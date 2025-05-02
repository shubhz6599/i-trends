import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UiService } from 'src/app/services/ui.service';
import { SharedStateService } from 'src/app/services/shared-state.service';
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
  isOtpVerificationMode = false;
  otpVerificationForm: FormGroup;
  maxDob = new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0];

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private ui: UiService,
    private sharedStateService: SharedStateService) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      dob: ['', [Validators.required, this.minAgeValidator(18)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      adminCode: ['']
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
    this.sharedStateService.setDetailViewVisible(true);
  }


  minAgeValidator(minAge: number) {
    return (control: any) => {
      const dob = new Date(control.value);
      const today = new Date();

      const age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      const d = today.getDate() - dob.getDate();

      const isBirthdayPassed = m > 0 || (m === 0 && d >= 0);
      const isOldEnough = isBirthdayPassed ? age >= minAge : age - 1 >= minAge;

      return isOldEnough ? null : { minAge: { requiredAge: minAge } };
    };
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

  onResetPasswordSubmit(): void {
    if (this.resetPasswordForm.valid && this.token) {
      const data = {
        newPassword: this.resetPasswordForm.value.newPassword,
        token: this.token
      };
      this.ui.showLoading
      this.authService.resetPassword(data).subscribe(
        (response) => {
          this.isResetPasswordMode = false;
          this.ui.hideLoading()
          this.ui.showToast('Successful!', 'Password Reset Successful');

        },
        (error) => {
          this.ui.hideLoading()

          this.ui.showToast(error.message, 'danger');
        }
      );
    }
  }


  onSignupSubmit(): void {
    if (this.signupForm.valid) {
      const data = {
        name: `${this.signupForm.value.firstName} ${this.signupForm.value.lastName}`, // Concatenate names
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        dob: this.signupForm.value.dob,
        mobile: this.signupForm.value.mobile,
      };
      this.ui.showLoading();
      this.authService.signUp(data).subscribe(
        (response) => {
          this.isOtpVerificationMode = true;
          this.ui.hideLoading();
          this.ui.showToast('Email Sent', 'Otp Verification Email Sent To Mail')
          // this.router.navigate(['/home'])
        },
        (error) => {
          this.ui.hideLoading();
          this.ui.showToast(error.error.message, 'danger');
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
      this.ui.showLoading();
      this.authService.verifyOtp(data).subscribe(
        (response) => {
          this.isOtpVerificationMode = false; // Exit OTP verification mode after success
          localStorage.setItem('jwtToken', response.token);
          const user = {
            mobile: response.user.mobile,
            name: response.user.name,
            email: response.user.email,
            dob: response.user.dob
          }
          localStorage.setItem('user', JSON.stringify(user));
          this.ui.hideLoading()
          this.ui.showToast('Verification Successfully Done!', 'Email verified successfully!');
          this.router.navigate(['/'])

        },
        (error) => {
          this.ui.hideLoading
          this.ui.showToast('Invalid OTP!', 'OOps! You Entered Invalid or expired OTP!');
        }
      );
    }
  }

  onResendOtp(): void {
    this.otpVerificationForm.reset();
    const email = this.signupForm.value.email; // Get email from signup form
    if (!email) {
      this.ui.showToast('Email is required to resend OTP.', 'danger');
      return;
    }
    this.ui.showLoading();
    this.authService.resendOtp({ email }).subscribe(
      (response) => {
        this.ui.hideLoading();
        this.ui.showToast('Success!', 'OTP resent successfully!');
      },
      (error) => {
        if (error.status === 429) {
          this.ui.showToast('Daily OTP Limit Crossed','You exceeded the resend OTP limit of 3 times. Please try after 24 hours.');
        } else {
          this.ui.showToast('Error','Error resending OTP!');
        }
      }
    );
  }

  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      const data = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        adminCode: this.loginForm.value.adminCode
      };
      this.ui.showLoading();
      this.authService.login(data).subscribe(
        (response) => {
          localStorage.setItem('jwtToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.ui.hideLoading();
          this.ui.showToast('Login Success!','Please Wait We Are Loading Stuff');
          this.router.navigate(['/'])
        },
        (error) => {
          this.ui.hideLoading();
          this.ui.showToast('Oops Error!','Error while logging');
        }
      );
    }
  }

  onForgotPasswordSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const data = {
        email: this.forgotPasswordForm.value.email
      };
      this.ui.showLoading();
      this.authService.forgotPassword(data).subscribe(
        (response) => {
          this.ui.hideLoading()
          this.ui.showToast('Success!','Password Reset Email Sent!');
        },
        (error) => {
          this.ui.hideLoading()
          this.ui.showToast('Error','Error Sending Reset Email!', );
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
    }
  }

}
