import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.css'],
})
export class FeedbackFormComponent {
  feedbackForm: FormGroup;
  confirmationMessage: string | null = null;

  constructor(private fb: FormBuilder) {
    // Initialize the form with FormBuilder
    this.feedbackForm = this.fb.group({
      websiteDesign: ['', Validators.required],
      navigationEase: ['', Validators.required],
      serviceSatisfaction: ['', Validators.required],
      additionalComments: [''],
    });
  }

  onSubmit(): void {
    if (this.feedbackForm.valid) {
      const formDetails = this.feedbackForm.value;

      // Simulate sending form details to the owner
      console.log('Feedback Form Submitted:', formDetails);

      // Set a confirmation message
      this.confirmationMessage = 'Thank you for your valuable feedback! Your opinions help us improve.';

      // Reset the form
      this.feedbackForm.reset();
    }
  }
}
