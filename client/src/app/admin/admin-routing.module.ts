import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from './admin.component';

import { UsersListComponent } from './users-list/users-list.component';
import { ProductsListComponent } from './products-list/products-list.component';


import { UserEditComponent } from './users-list/user-edit/user-edit.component';
import { UserDetailsComponent } from './users-list/user-details/user-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AllOrdersComponent } from './all-orders/all-orders.component';
import { AllOrderDetailsComponent } from './all-orders/all-order-details/all-order-details.component';
import { CJProductsComponent } from './cj-products/cj-products.component';
import { CjProductDetailsComponent } from './cj-products/cj-product-details/cj-product-details.component';
import { CreateProductComponent } from './products-list/create-product/create-product.component';
import { EditProductFormComponent } from './products-list/edit-product-form/edit-product-form.component';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, data: { breadcrumb: { skip: false, label: 'لوحة الاحصائات' } } },

      { path: 'products-list', component: ProductsListComponent ,  data: { breadcrumb: { skip: false, label: 'المنتجات' } } },
      { path: 'products-CJ', component:CJProductsComponent ,  data: { breadcrumb: { skip: false, label: 'المنتجات الخارجية' } } },
      { path: 'products-CJ/details/:pid', component:CjProductDetailsComponent ,  data: { breadcrumb: { skip: false, label: ' external product details' } } },
      { path: 'users-list', component: UsersListComponent ,  data: { breadcrumb: { skip: false, label: ' المستخدمون' } } },
      {path: 'create', component: CreateProductComponent, data: {breadcrumb: 'Create'}},
      {path: 'products-list/edit/:id', component: EditProductFormComponent, data: {breadcrumb: 'Edit'}},
      { path: 'users-list/edit/:id', component: UserEditComponent },
      { path: 'users-list/details/:id', component: UserDetailsComponent },
      { path: 'all-orders', component: AllOrdersComponent,  data: { breadcrumb: { skip: false, label: ' الطلبات' } } },
      { path: 'all-orders/details/:email', component: AllOrderDetailsComponent ,  data: { breadcrumb: { skip: false, label: 'الطلب' } } },
    ],
  },

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }