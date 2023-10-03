import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: { breadcrumb: { skip: true } }
      },
      {
        path: 'register',
        component: RegisterComponent,
        data: { breadcrumb: { skip: true } }
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        data: { breadcrumb: { skip: true } }
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: { breadcrumb: { skip: true } }
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
