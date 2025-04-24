import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
declare var bootstrap: any;


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AuthComponent implements OnInit {
  isSignupMode = false;
  signupForm: FormGroup;
  loginForm: FormGroup;
  isLoading = false;
  forgotPasswordForm: FormGroup;
  resetPasswordForm: FormGroup;
  token: string | null = null;
  isResetPasswordMode = false;
  alertMessage: string | null = null; // Holds the alert message
  alertType: string | null = null; // Holds the alert type (Bootstrap classes)
  isOtpVerificationMode = false;
  otpVerificationForm: FormGroup;
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      dob: [''],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validators: this.passwordsMatchValidator, // Custom validator to check password matching
    });
    this.otpVerificationForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });

  }
  ngOnInit(): void {
    localStorage.clear()
    // Check if the current route is 'reset-password/:token'
    this.route.params.subscribe((params) => {
      this.token = params['token'] || null;
      if (this.token) {
        this.isResetPasswordMode = true; // Enable Reset Password mode
      }
    });
  }

  passwordsMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordsMismatch: true };
    }
    return null;
  }
  toggleMode(isSignup: boolean): void {
    this.isSignupMode = isSignup;

    // Reset form fields
    if (isSignup) {
      this.loginForm.reset();
    } else {
      this.signupForm.reset();
    }
  }

  showAlert(message: string, type: string): void {
    this.alertMessage = message;
    this.alertType = `alert-${type}`; // Bootstrap classes: alert-success, alert-danger
    setTimeout(() => {
      this.alertMessage = null; // Clear alert after 3 seconds
    }, 3000);
  }
  onResetPasswordSubmit(): void {
    if (this.resetPasswordForm.valid && this.token) {
      const data = {
        newPassword: this.resetPasswordForm.value.newPassword,
        token: this.token
      };
      this.isLoading = true;
      this.authService.resetPassword(data).subscribe(
        (response) => {
          console.log('Password Reset Successful:', response);
          this.isResetPasswordMode = false
          this.isLoading = false;
          this.showAlert('Password Reset Successful!', 'success');

        },
        (error) => {
          this.isLoading = false;

          console.error('Password Reset Error:', error);
          this.showAlert(error.message, 'danger');
        }
      );
    }
  }


  onSignupSubmit(): void {
    if (this.signupForm.valid) {
      const data = {
        name:`${this.signupForm.value.firstName} ${this.signupForm.value.lastName}`, // Concatenate names
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        dob: this.signupForm.value.dob,
        mobile: this.signupForm.value.mobile,
      };
      this.isLoading = true;

      this.authService.signUp(data).subscribe(
        (response) => {
          // console.log('Sign Up Successful:', response);
          this.isOtpVerificationMode = true;
          this.isLoading = false;
          this.showAlert('Sign Up Successful! OTP sent to email.', 'success');
          // this.router.navigate(['/home'])
        },
        (error) => {
          console.error('Sign Up Error:', error);
          this.isLoading = false;
          this.showAlert(error.error.message, 'danger');
        }
      );
    }
  }

  onOtpVerificationSubmit(): void {
    if (this.otpVerificationForm.valid) {
      const data = {
        email: this.signupForm.value.email, // Email from signup
        otp: this.otpVerificationForm.value.otp, // OTP entered by the user
      };
      this.isLoading = true;

      this.authService.verifyOtp(data).subscribe(
        (response) => {
          console.log('OTP Verified:', response);
          this.isOtpVerificationMode = false; // Exit OTP verification mode after success
          localStorage.setItem('jwtToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.isLoading = false;
          this.showAlert('Email verified successfully! You can Login Now', 'success');
          // this.router.navigate(['/'])

        },
        (error) => {
          console.error('OTP Verification Error:', error);
          this.isLoading = false;
          this.showAlert('Invalid or expired OTP!', 'danger');
        }
      );
    }
  }

  onResendOtp(): void {
    this.otpVerificationForm.reset();
    const email = this.signupForm.value.email; // Get email from signup form
    if (!email) {
      this.showAlert('Email is required to resend OTP.', 'danger');
      return;
    }
    this.isLoading = true;

    this.authService.resendOtp({ email }).subscribe(
      (response) => {
        console.log('Resend OTP Successful:', response);
        this.isLoading = false;
        this.showAlert('OTP resent successfully!', 'success');
      },
      (error) => {
        console.error('Resend OTP Error:', error);
        if (error.status === 429) {
          this.isLoading = false;
          this.showAlert('You exceeded the resend OTP limit. Please try after 24 hours.', 'danger');
        } else {
          this.isLoading = false;
          this.showAlert('Error resending OTP!', 'danger');
        }
      }
    );
  }

  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      const data = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
      this.isLoading = true;

      this.authService.login(data).subscribe(
        (response) => {
          console.log('Login Successful:', response);
          this.isLoading = false;
          localStorage.setItem('jwtToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.showAlert('Login Successful!', 'success');
          this.router.navigate(['/'])
        },
        (error) => {
          console.error('Login Error:', error);
          this.isLoading = false;
          this.showAlert('Error Logging In!', 'danger');
        }
      );
    }
  }

  onForgotPasswordSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const data = {
        email: this.forgotPasswordForm.value.email
      };
      this.isLoading = true;

      this.authService.forgotPassword(data).subscribe(
        (response) => {
          console.log('Forgot Password Email Sent:', response);
          this.isLoading = false;
          this.showAlert('Password Reset Email Sent!', 'success');
        },
        (error) => {
          console.error('Forgot Password Error:', error);
          this.isLoading = false;
          this.showAlert('Error Sending Reset Email!', 'danger');
        }
      );
    }
  }



  openForgotPasswordModal(): void {
    const modalElement = document.getElementById('forgotPasswordModal'); // Get modal element
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement); // Initialize Bootstrap modal
      modalInstance.show(); // Show the modal
    } else {
      console.error('Modal element not found!');
    }
  }

}
