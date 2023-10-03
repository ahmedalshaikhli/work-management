import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';

import {SharedModule} from '../shared/shared.module';
import {AdminRoutingModule} from './admin-routing.module';
import { EditProductFormComponent } from './products-list/edit-product-form/edit-product-form.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { UsersListComponent } from './users-list/users-list.component';


import { UserEditComponent } from './users-list/user-edit/user-edit.component';
import { UserDetailsComponent } from './users-list/user-details/user-details.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationComponent } from './pagination/pagination.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { AllOrderDetailsComponent } from './all-orders/all-order-details/all-order-details.component';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CJProductsComponent } from './cj-products/cj-products.component';
import { CjProductDetailsComponent } from './cj-products/cj-product-details/cj-product-details.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CreateProductComponent } from './products-list/create-product/create-product.component';



@NgModule({
  declarations: [AdminComponent, EditProductFormComponent, ProductsListComponent, UsersListComponent, UserEditComponent, UserDetailsComponent, PaginationComponent, DashboardComponent, AllOrdersComponent, AllOrderDetailsComponent, CJProductsComponent, CjProductDetailsComponent, CreateProductComponent],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    NgxPaginationModule,
    CKEditorModule,
    DragDropModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule { }