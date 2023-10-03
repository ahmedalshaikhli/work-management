import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, ReplaySubject, switchMap, take, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address, User } from '../shared/models/user';
import { UserDto } from '../shared/models/UserDto';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();
  private isAdminSource = new ReplaySubject<boolean>(1);
  isAdmin$ = this.isAdminSource.asObservable();

  private isSupplierSource = new ReplaySubject<boolean>(1);
  isSupplier$ = this.isSupplierSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }


/*   isAdmin(token: string): boolean {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      if (decodedToken.role.indexOf('Admin') > -1) {
        return true;
      }
    }
  } */
  isAdmin(token: string): boolean {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.role.indexOf('Admin') > -1; // Return true if the role is found, false otherwise
    }
    return false;
  }
  
  isSupplier(token: string): boolean {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.role.indexOf('Supplier') > -1; // Return true if the role is found, false otherwise
    }
    return false;
  }
  
/*   isSupplier(token: string): boolean {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const isSupplier = decodedToken.role.indexOf('Supplier') > -1;
      console.log('isSupplier:', isSupplier);
      return isSupplier;
    }
    return false;
  }  */

  async loadCurrentUser(token: string | null) {
    if (token == null) {
      this.currentUserSource.next(null);
      this.isAdminSource.next(false); // Set isAdmin to false
      this.isSupplierSource.next(false); // Set isSupplier to false
      return of(null);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    const user = await this.http.get<User>(this.baseUrl + 'account', { headers }).toPromise();
    if (user) {
      localStorage.setItem('token', user.token);
      this.currentUserSource.next(user);
      const isSupplier = await this.isSupplier(user.token);
      this.isSupplierSource.next(isSupplier);
      const isAdmin = await this.isAdmin(user.token);
      this.isAdminSource.next(isAdmin);

    
    }
  }

  login(values: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', values).pipe(
      switchMap((user: User) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
          this.isAdminSource.next(this.isAdmin(user.token));
          this.isSupplierSource.next(this.isSupplier(user.token)); // Update isSupplier immediately
  
          this.getCurrentUser().subscribe(userDto => {
            localStorage.setItem('userId', userDto.id);
          });
        }
        return of(user); // Return the user object in the observable
      })
    );
  }

  getCurrentUser(): Observable<UserDto> {
    return this.http.get<UserDto>(this.baseUrl + 'account');
  }

  register(values: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', values).pipe(
      map(user => {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
      })
    )
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.http.get<boolean>(this.baseUrl + 'account/emailExists?email=' + email);
  }

  getUserAddress() {
    return this.http.get<Address>(this.baseUrl + 'account/address');
  }

  updateUserAddress(address: Address) {
    return this.http.put(this.baseUrl + 'account/address', address);
  }

  resetPassword(email: string, token: string, newPassword: string): Observable<any> {
    const url = `${this.baseUrl}account/reset-password`;
    const requestBody = {
      email: email,
      token: token,
      newPassword: newPassword
    };
    return this.http.post(url, requestBody);
  }


  forgotPassword(email: string) {
    const body = { email: email };
    return this.http.post(this.baseUrl + 'account/forgotpassword', body, { responseType: 'text' }).pipe(
      catchError(error => {
        console.log('Error response:', error); // Log the error response
        
        // Check if the error response is actually a success
        if (error.status >= 200 && error.status < 300) {
          console.log('Email was sent successfully');
          return of(error);
        }
  
        throw error;
      })
    );
  }

  async getCurrentUserForSetting(): Promise<Observable<any>> {
    let email: string | null = null;
  
    await this.currentUser$.pipe(take(1)).toPromise().then(user => {
      if (user && user.token) {
        email = this.getEmailFromToken(user.token);
      }
    });
  
    if (!email) {
      return throwError('Failed to get user email from the token');
    }
  
    const params = new HttpParams().set('email', email);
    return this.http.get<any>(this.baseUrl + 'account/getcurrentusersetting', { params });
  }

  getEmailFromToken(token: string): string | null {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      /* console.log('Token:', token); */
     /*  console.log('Decoded token:', decodedToken); */
  
      return decodedToken.email;
    }
    return null;
  }

//update user info in setting
  updateUserInformation(userUpdate: any): Observable<any> {
    return this.http.put(this.baseUrl + 'account/update-user', userUpdate);
  }

  deleteUserByEmail(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.delete(this.baseUrl + 'account/delete-user', { params });
  }

  deleteAccount(email: string): Promise<any> {
    const url = `${this.baseUrl}account/delete-account`;
  
    const params = new HttpParams().set('email', email);
  
    return this.http.delete(url, { params })
      .toPromise()
      .catch(error => {
        throw new Error('Failed to delete account');
      });
  }
}
