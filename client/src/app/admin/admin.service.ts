import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {IProductToCreate, ProductFormValues} from '../shared/models/product';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { User } from '../shared/models/user';
import { ProductExternal } from '../shared/models/ProductExternal';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;
  user: User[] = [];
  constructor(private http: HttpClient) { }

  createProduct(product: IProductToCreate, photos?: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('nameEn', product.nameEn);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('oldPrice', product.oldPrice.toString());
    formData.append('pictureUrl', product.pictureUrl);
    formData.append('productBrandId', product.productBrandId.toString());
    formData.append('productTypeId', product.productTypeId.toString());
  
    if (photos) {
      for (let i = 0; i < photos.length; i++) {
        formData.append('photos', photos[i]);
      }
    }
  
    return this.http.post(this.baseUrl + 'products', formData);
  }




/*   updateProduct(product: ProductFormValues, id: number) {
    return this.http.put(this.baseUrl + 'products/' + id, product);
  } */
  updateProduct(id: number, product: ProductFormValues): Observable<any> {
    const formData = new FormData();
  
    // Append each property of the product object to the FormData
    formData.append('name', product.name);
    formData.append('nameEn', product.nameEn);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('oldPrice', product.oldPrice.toString());
    formData.append('productTypeId', product.productTypeId.toString());
    formData.append('productBrandId', product.productBrandId.toString());
    formData.append('pictureUrl', product.pictureUrl);
    // Append each photo file to the FormData
    for (let i = 0; i < product.photos.length; i++) {
      formData.append('photos', product.photos[i]);
    }
  
    return this.http.put(`${this.baseUrl}products/${id}`, formData);
  }
 
  deletePhoto(photoId: number): Observable<any> {
    console.log(`Deleting photo with id: ${photoId}`); // Log the photo id
    return this.http.delete(this.baseUrl + `products/photos/${photoId}`);
}
   
  deleteProduct(id: number) {
    return this.http.delete(this.baseUrl + 'products/' + id);
  }
  uploadImage(file: File, id: number) {
    const formData = new FormData();
    formData.append('photo', file, 'image.png');
    return this.http.put(this.baseUrl + 'products/' + id + '/photo', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  deleteProductPhoto(photoId: number, productId: number) {
    return this.http.delete(this.baseUrl + 'products/' + productId + '/photo/' + photoId);
  }

  setMainPhoto(photoId: number, productId: number) {
    return this.http.post(this.baseUrl + 'products/' + productId + '/photo/' + photoId, {});
  }


  getTotalUsersCount(searchTerm: string): Observable<number> {
    const params = new HttpParams()
      .set('pageIndex', '0')
      .set('pageSize', '0')
      .set('searchTerm', searchTerm);
  
    return this.http
      .get<{ users: User[]; totalCount: number }>(this.baseUrl + 'account/all-users', { params })
      .pipe(map((response) => response.totalCount));
  }

  getAllUsers(pageIndex: number = 0, pageSize: number = 10, searchTerm: string = '') {
    const url = this.baseUrl + `account/all-users?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}`;
    return this.http.get<any>(url);
  }
  getUserById(id: string) {
    const user =this.user.find(p => p.id === id);

    if(user) return of(user);
  
    return this.http.get<User>(this.baseUrl + 'account/edit/' + id);
  }


  updateUser(id: string, user: any): Observable<any> {
    const url = `${this.baseUrl}account/edit/${id}`;
    return this.http.put(url, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}account/delete/${id}`);
  }

  getOrders() {
    return this.http.get<any>(this.baseUrl + 'orders/all');
  }
  getAllOrders(pageIndex: number = 0, pageSize: number = 10, searchTerm: string = '') {
    const url = this.baseUrl + `orders/allorders?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}`;
    return this.http.get<any>(url);
  }
  getUserOrderByEmail(buyerEmail:string) {
    return this.http.get<any>(this.baseUrl + 'orders/email/' + buyerEmail);
  }
  getExternalProducts(pageSize: number = 10, pageNum: number = 0, searchValue: string = ''): Observable<any> {
    const url = `${this.baseUrl}products/external-products`;
    let params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNum', pageNum.toString());
  
    const pidRegex = /^\d+$/; // Define the regex pattern for pid (e.g., all digits)
    
    if (searchValue.trim() !== '') {
      if (pidRegex.test(searchValue)) {
        params = params.set('pid', searchValue);
      } else {
        params = params.set('productNameEn', searchValue);
      }
    }
    
    console.log('Request URL:', url);
    console.log('Request Params:', params.toString());
    
    return this.http.get<any>(url, { params });
  }
  getPexternalroductDetails(pid: string): Observable<any> {
    const url = `${this.baseUrl}products/product-external-details/${pid}`;
    return this.http.get<any>(url);
  }

saveProductFromExternal(pid: string) {
  return this.http.post(this.baseUrl + 'products/product-external/' + pid, {});
}


getSupplierProducts(userId: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}products/supplier/${userId}`);
}
getAllOrdersForSupplier(userId: string, pageIndex: number = 0, pageSize: number = 10, searchTerm: string = '') {
  const url = this.baseUrl + `orders/allordersForSupplier?userId=${userId}&pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}`;
  console.log('getAllOrdersForSupplier called with userId:', userId, 'pageIndex:', pageIndex, 'pageSize:', pageSize, 'searchTerm:', searchTerm);
  return this.http.get<any>(url).pipe(
    map(response => {
      console.log('Mapped response:', response);
      // Perform additional parsing or validation if needed
      return response;
    }),
    tap((response: any) => console.log('Response from server:', response)),
    catchError(error => {
      // Handle the error here
      console.error(error);
      // The throwError operator re-throws the error so it can be caught elsewhere (like in your component)
      return throwError(error);
    })
  );
}




}