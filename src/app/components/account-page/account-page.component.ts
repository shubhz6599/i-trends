import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UiService } from 'src/app/services/ui.service';
declare var bootstrap: any;

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css'],
})
export class AccountPageComponent implements OnInit {
  accountForm!: FormGroup;
  otpForm!: FormGroup;
  isEmailVerified = false; // Track whether the email is verified
  isPhoneDisabled = true; // Track whether the phone field is disabled
  formattedDob: string | null = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private uiService: UiService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getUserDetails();
  }

  initializeForm(): void {
    this.accountForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      dob: new FormControl({ value: '', disabled: true }),
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
    this.uiService.showLoading();
    this.authService.getUserDetails().subscribe(
      (response) => {
        const user = response.user;
        this.formattedDob = user.dob ? this.formatDateToDDMMYYYY(user.dob) : '';
        const formattedDobForInput = user.dob ? new Date(user.dob).toISOString().split('T')[0] : '';
        // Prepopulate form values
        this.accountForm.patchValue({
          name: user.name,
          dob: formattedDobForInput,
          phone: user.mobile,
          email: user.email,
          street: user.address?.street || '',
          landmark: user.address?.landmark || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          pincode: user.address?.pincode || '',
        });

        this.isEmailVerified = user.isOtpVerified; // Check email verification status

        // Enable phone field if it's blank
        if (!user.mobile) {
          this.accountForm.get('phone')?.enable(); // Dynamically enable the phone field
        }
        this.uiService.hideLoading();
      },
      (error) => {
        this.uiService.hideLoading()
        this.uiService.showToast('Failed', 'Failed to fetch user details. Please Re-Login.');
      }
    );
  }

  onResendOtp(): void {
    const email = this.accountForm.get('email')?.value; // Explicitly fetch the email value
    if (!email) {
      this.uiService.showToast('Something went wrong','Email is required to resend OTP.');
      return;
    }
    this.uiService.showLoading();
    this.authService.resendOtp({ email }).subscribe(
      (response) => {
        this.uiService.hideLoading()
        this.uiService.showToast('Success!', 'Otp Resent Successfully');
        this.openOtpModal()
      },
      (error) => {
        this.uiService.hideLoading()
        this.uiService.showToast('Error!', 'Error resending OTP!');

      }
    );
  }

  onSubmit(): void {


    if (this.accountForm.invalid) {
      this.uiService.showToast('Error!','Please fix the errors in the form before submitting.');
      return;
    }
    this.uiService.showLoading()
    this.authService.updateUserDetails(this.accountForm.value).subscribe(
      (response) => {
        let oldUser: any = localStorage.getItem('user');
        oldUser = JSON.parse(oldUser);

        let address = {
          city: this.accountForm.get('city')?.value,
          landmark: this.accountForm.get('landmark')?.value,
          pincode: this.accountForm.get('pincode')?.value,
          state: this.accountForm.get('state')?.value,
          street: this.accountForm.get('street')?.value
        }

        oldUser.address = address
        oldUser.name = this.accountForm.get('name')?.value;
        localStorage.setItem('user', JSON.stringify(oldUser))
        this.uiService.hideLoading();
        this.uiService.showToast('Success','User details updated successfully!')
      },
      (error) => {
        this.uiService.hideLoading();
        this.uiService.showToast('Failed', 'Failed to update user details. Please try again later.')
      }
    );
  }


  openOtpModal(): void {
    const otpModal = new bootstrap.Modal(document.getElementById('otpModal')!);
    otpModal.show();
  }
  verifyOtp(): void {
    if (this.otpForm.valid) {
      const otp = this.otpForm.value.otp;
      this.uiService.showLoading();
      this.authService.verifyOtp({ email: this.accountForm.value.email, otp }).subscribe(
        (response) => {
          this.uiService.hideLoading();
          this.uiService.showToast('Email Verified','Email verified successfully!')
          this.isEmailVerified = true;
          const otpModal = bootstrap.Modal.getInstance(document.getElementById('otpModal')!);
          otpModal.hide();
        },
        (error) => {
          this.uiService.hideLoading();
          this.uiService.showToast('Invalid OTP','Invalid or expired OTP.')
        }
      );
    }
  }
}
