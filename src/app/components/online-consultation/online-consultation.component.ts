import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-online-consultation',
  templateUrl: './online-consultation.component.html',
  styleUrls: ['./online-consultation.component.css']
})
export class OnlineConsultationComponent {
  bookingForm: FormGroup;
  showOtherConcern = false; // Toggle for "Other" concern input

  constructor(private fb: FormBuilder) {
    // Initialize the form
    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\d{10}$/)] // 10-digit phone number validation
      ],
      concern: ['', Validators.required],
      otherConcern: [''] // Initially hidden
    });
  }

  // Handle Concern Change
  onConcernChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue === 'Other') {
      this.showOtherConcern = true;
      this.bookingForm.get('otherConcern')?.setValidators(Validators.required);
      this.bookingForm.get('otherConcern')?.updateValueAndValidity();
    } else {
      this.showOtherConcern = false;
      this.bookingForm.get('otherConcern')?.clearValidators();
      this.bookingForm.get('otherConcern')?.updateValueAndValidity();
    }
  }

  // Handle Form Submission
  onSubmit(): void {
    if (this.bookingForm.valid) {
      const formData = this.bookingForm.value;

      // Construct the WhatsApp message
      const message = `
        New Eye Consultation Booking:%0A
        Name: ${formData.name}%0A
        Address: ${formData.address}%0A
        Phone: ${formData.phone}%0A
        Concern: ${formData.concern === 'Other' ? formData.otherConcern : formData.concern
        }%0A
      `;

      // Navigate to WhatsApp
      const whatsappURL = `https://wa.me/+918888052579?text=${encodeURIComponent(message)}`;
      window.open(whatsappURL, '_blank');
    }
  }

}
