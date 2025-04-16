import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.css'],
})
export class FeedbackFormComponent implements OnInit {
  feedbackForm: FormGroup;
  confirmationMessage: string | null = null;
  feedbackSubmitted: boolean = false; // Indicates whether feedback has already been submitted
  isLoading: boolean = true; // Loader for API calls

  constructor(private fb: FormBuilder, private feedbackService: AuthService) {
    // Initialize the form with FormBuilder
    this.feedbackForm = this.fb.group({
      websiteDesign: new FormControl({ value: '', disabled: false }, Validators.required),
      navigationEase: new FormControl({ value: '', disabled: false }, Validators.required),
      serviceSatisfaction: new FormControl({ value: '', disabled: false }, Validators.required),
      additionalComments: new FormControl({ value: '', disabled: false }),
    });
  }

  ngOnInit(): void {
    this.fetchExistingFeedback(); // Fetch existing feedback on component initialization
  }

  // Fetch existing feedback from the backend
  fetchExistingFeedback(): void {
    this.feedbackService.getMyFeedback().subscribe(
      (feedback) => {
        this.isLoading = false;
        console.log(feedback);

        // If feedback exists, populate the form and disable it
        if (feedback && feedback.length != 0) {
          this.feedbackSubmitted = true; // Mark as submitted
          this.feedbackForm.patchValue({
            websiteDesign: feedback[0].message.websiteDesign,
            navigationEase: feedback[0].message.navigationEase,
            serviceSatisfaction: feedback[0].message.serviceSatisfaction,
            additionalComments: feedback[0].message.additionalComments || '',
          });
          this.feedbackForm.disable(); // Disable the form fields
          this.confirmationMessage = 'You have already submitted your feedback. Thank you!';
        }else{
          this.feedbackForm.enable(); // enable the form fields
          this.feedbackSubmitted = false; // Mark as submitted

        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching feedback:', error);
      }
    );
  }

  // Submit feedback
  onSubmit(): void {
    if (this.feedbackForm.valid) {
      const formDetails = this.feedbackForm.value;

      this.feedbackService.submitFeedback(formDetails).subscribe(
        (response) => {
          this.confirmationMessage = 'Thank you for your valuable feedback! Your opinions help us improve.';
          this.feedbackSubmitted = true; // Mark as submitted
          this.feedbackForm.disable(); // Disable the form fields
        },
        (error) => {
          console.error('Error submitting feedback:', error);
          this.confirmationMessage = 'An error occurred while submitting your feedback. Please try again.';
        }
      );
    }
  }
}
