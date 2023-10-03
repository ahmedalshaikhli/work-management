import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import { Location } from '@angular/common';
import { User } from 'src/app/shared/models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  userId: string;
  user: User = {
    id: '',
    email: '',
    displayName: '',
    UserProfilePhoto: '',
    token: '',
    roles: [],
    rolesCheckbox: [],
    address: {
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      state: '',
      zipcode: '',
    }
  };

  roles: string[] = ['Admin', 'Member', 'Supplier'];

  constructor(private adminService: AdminService, private route: ActivatedRoute, private location: Location, private router: Router,private toastr: ToastrService,) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.adminService.getUserById(this.userId).subscribe((user: User) => {
      this.user = user;
      this.user.rolesCheckbox = this.roles.map(() => false);
  
      this.user.roles.forEach((role: string) => {
        const index = this.roles.indexOf(role);
        if (index > -1) {
          this.user.rolesCheckbox[index] = true;
        }
      });
  
      // Log user info after roles processing
      console.log('User info with roles:', this.user);
    });
  }
  goBack(): void {
    this.location.back();
  }

  onSave() {
    this.user.roles = this.user.rolesCheckbox.reduce((roles: string[], checked: boolean, i: number) => {
      if (checked) {
        roles.push(this.roles[i]);
      }
      return roles;
    }, []);

    // Log user info before updating
    console.log('User info before update:', this.user);

    // Create a copy of user without the rolesCheckbox
    const userToSend = { ...this.user };
    delete userToSend.rolesCheckbox;

    // Log user info before sending to server
    console.log('User info to send:', userToSend);

    this.adminService.updateUser(this.userId, userToSend).subscribe(
      (updatedUser: User) => {
        console.log('User updated successfully', updatedUser);

        // Show the Toastr success message
        this.toastr.success('تم تحديث المستخدم بنجاح', 'تم التحديث');

        // Navigate to the users-list page
        this.router.navigate(['admin/users-list']);
      },
      (error) => {
        console.error('Error updating user', error);

        // Show the Toastr error message
        this.toastr.error('حدث خطأ أثناء تحديث المستخدم', 'خطأ في التحديث');
      }
    );
  }
}