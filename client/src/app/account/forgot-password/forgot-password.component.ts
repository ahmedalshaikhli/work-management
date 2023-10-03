import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }
  
    const email = this.forgotPasswordForm.controls.email.value;
    this.accountService.forgotPassword(email).subscribe(
      data => {
        console.log('تم إرسال طلب استعادة كلمة المرور بنجاح! يرجى التحقق من بريدك الإلكتروني');
        this.toastr.success('تم إرسال طلب استعادة كلمة المرور بنجاح! يرجى التحقق من بريدك الإلكتروني');
        this.router.navigate(['/account/login']);
      },
      error => {
        console.error('حدث خطأ أثناء إرسال طلب استعادة كلمة المرور');
        this.toastr.error('حدث خطأ أثناء إرسال طلب استعادة كلمة المرور');
      }
    );
  }
}