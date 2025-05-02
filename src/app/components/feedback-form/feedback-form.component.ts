import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.css'],
})
export class FeedbackFormComponent implements OnInit {
  feedbackForm: FormGroup;
  feedbackSubmitted: boolean = false; // Indicates whether feedback has already been submitted

  constructor(private fb: FormBuilder, private feedbackService: AuthService, private uiService: UiService) {
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
    this.uiService.showLoading()
    this.feedbackService.getMyFeedback().subscribe(
      (feedback: any) => {

        // If feedback exists, populate the form and disable it
        if (feedback && feedback.feedbacks.length != 0) {
          this.feedbackSubmitted = true; // Mark as submitted
          this.feedbackForm.patchValue({
            websiteDesign: feedback[0].message.websiteDesign,
            navigationEase: feedback[0].message.navigationEase,
            serviceSatisfaction: feedback[0].message.serviceSatisfaction,
            additionalComments: feedback[0].message.additionalComments || '',
          });
          this.feedbackForm.disable(); // Disable the form fields
          this.uiService.hideLoading();
          this.uiService.showToast('Feedback Already Submitted', "Hey Chief! You've Already Submitted Feedback.")
        } else {
          this.uiService.hideLoading();
          this.feedbackForm.enable(); // enable the form fields
          this.feedbackSubmitted = false; // Mark as submitted

        }
      },
      (error) => {
        this.uiService.hideLoading();
        // this.uiService.showToast('Error', "Hey Chief! Error while fetching feedback.")

      }
    );
  }

  // Submit feedback
  onSubmit(): void {
    if (this.feedbackForm.valid) {
      const formDetails = this.feedbackForm.value;
      this.uiService.showLoading();
      this.feedbackService.submitFeedback(formDetails).subscribe(
        (response) => {
          this.feedbackSubmitted = true; // Mark as submitted
          this.feedbackForm.disable(); // Disable the form fields
          this.uiService.hideLoading();
          this.uiService.showToast('Submitted', 'Feedback Submitted Successfully')
        },
        (error) => {
          this.uiService.hideLoading();
          this.uiService.showToast('Error', 'Error While Submitting Feedback')
        }
      );
    }
  }
}
