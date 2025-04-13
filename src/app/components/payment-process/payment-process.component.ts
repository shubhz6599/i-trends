import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedStateService } from 'src/app/services/shared-state.service';
declare var bootstrap: any;

@Component({
  selector: 'app-payment-process',
  templateUrl: './payment-process.component.html',
  styleUrls: ['./payment-process.component.css'],
})
export class PaymentProcessComponent implements OnInit {
  paymentForm!: FormGroup;
  productData: any;
  ownerWhatsAppNumber: string = '+918888052579';

  constructor(private fb: FormBuilder, private router: Router,private sharedStateService:SharedStateService) { }

  ngOnInit(): void {

    this.productData = history.state.product;
    console.log(this.productData);
    this.sharedStateService.setDetailViewVisible(false);


    // Initialize the form
    this.paymentForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      pincode: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{6}$')],
      ],
      landmark: ['', Validators.required],
      contact: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      // paymentMethod: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      const confirmationModal = document.getElementById('confirmationModal');
      if (confirmationModal) {
        const modalInstance = new (window as any).bootstrap.Modal(confirmationModal);
        modalInstance.show();
      }
    } else {
      this.paymentForm.markAllAsTouched();
    }
  }

  redirectToWhatsApp(): void {
    const customerDetails = this.paymentForm.value;

    const productImageText = this.productData.imageUrl
      ? `- Image: ${this.productData.imageUrl}`
      : '';


    const message = `Hello, I would like to place an order. Here are my details:
  Customer Details:
  - Name: ${customerDetails.name}
  - Address: ${customerDetails.address}
  - State: ${customerDetails.state}
  - City: ${customerDetails.city}
  - Pincode: ${customerDetails.pincode}
  - Nearby Landmark: ${customerDetails.landmark}
  - Contact Number: ${customerDetails.contact}
  Product Details:
  - Product Name: ${this.productData.name}
  - Variant: ${this.productData.variant}
  - Quantity: ${this.productData.quantity}
  - Price: ₹${this.productData.price}
  ${productImageText}

  Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${this.ownerWhatsAppNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }
}
