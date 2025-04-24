import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
declare var bootstrap: any;

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css'],
})
export class AccountPageComponent implements OnInit {
  accountForm!: FormGroup;
  otpForm!: FormGroup;
  alertMessage: string | null = null;
  alertType: string | null = null;
  isLoading = false;
  isEmailVerified = false; // Track whether the email is verified
  isPhoneDisabled = true; // Track whether the phone field is disabled
  formattedDob: string | null = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getUserDetails();
  }

  initializeForm(): void {
    this.accountForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      phone: new FormControl({ value: '', disabled: true }, [Validators.pattern('^[0-9]{10}$')]),
      email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
      street: ['', [Validators.required]],
      landmark: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
    });
    this.otpForm = this.formBuilder.group({
      otp: ['', Validators.required],
    });
  }

  formatDateToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  getUserDetails(): void {
    this.isLoading = true;
    this.authService.getUserDetails().subscribe(
      (response) => {
        this.isLoading = false;
        const user = response.user;
        this.formattedDob = user.dob ? this.formatDateToDDMMYYYY(user.dob) : '';
        const formattedDobForInput = user.dob ? new Date(user.dob).toISOString().split('T')[0] : '';
        // Prepopulate form values
        this.accountForm.patchValue({
          name: user.name,
          dob: formattedDobForInput,
          phone: user.phone || '',
          email: user.email,
          street: user.address?.street || '',
          landmark: user.address?.landmark || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          pincode: user.address?.pincode || '',
        });

        this.isEmailVerified = user.isOtpVerified; // Check email verification status

        // Enable phone field if it's blank
        if (!user.phone) {
          this.accountForm.get('phone')?.enable(); // Dynamically enable the phone field
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching user details:', error);
        this.showAlert('Failed to fetch user details. Please try again later.', 'danger');
      }
    );
  }

  onResendOtp(): void {
    const email = this.accountForm.get('email')?.value; // Explicitly fetch the email value
    if (!email) {
      this.showAlert('Email is required to resend OTP.', 'danger');
      return;
    }

    this.authService.resendOtp({ email }).subscribe(
      (response) => {
        this.showAlert('OTP resent successfully!', 'success');
        this.openOtpModal()
      },
      (error) => {
        console.error('Resend OTP Error:', error);
        this.showAlert('Error resending OTP!', 'danger');
      }
    );
  }

  onSubmit(): void {
    if (this.accountForm.invalid) {
      this.showAlert('Please fix the errors in the form before submitting.', 'danger');
      return;
    }

    this.isLoading = true;
    this.authService.updateUserDetails(this.accountForm.value).subscribe(
      (response) => {
        this.isLoading = false;
        this.showAlert('User details updated successfully!', 'success');
      },
      (error) => {
        this.isLoading = false;
        console.error('Error updating user details:', error);
        this.showAlert('Failed to update user details. Please try again later.', 'danger');
      }
    );
  }

  showAlert(message: string, type: string): void {
    this.alertMessage = message;
    this.alertType = `alert-${type}`;
    setTimeout(() => {
      this.alertMessage = null;
    }, 3000);
  }

  openOtpModal(): void {
    const otpModal = new bootstrap.Modal(document.getElementById('otpModal')!);
    otpModal.show();
  }
  verifyOtp(): void {
    if (this.otpForm.valid) {
      const otp = this.otpForm.value.otp;

      this.authService.verifyOtp({ email: this.accountForm.value.email, otp }).subscribe(
        (response) => {
          console.log('OTP Verified Successfully:', response);
          this.showAlert('Email verified successfully!', 'success');
          this.isEmailVerified = true;
          const otpModal = bootstrap.Modal.getInstance(document.getElementById('otpModal')!);
          otpModal.hide();
        },
        (error) => {
          console.error('Error verifying OTP:', error);
          this.showAlert('Invalid or expired OTP.', 'danger');
        }
      );
    }
  }
}
