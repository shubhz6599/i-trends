import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
declare var Razorpay: any;
@Component({
  selector: 'app-lens-details',
  templateUrl: './lens-details.component.html',
  styleUrls: ['./lens-details.component.css']
})
export class LensDetailsComponent implements OnInit {
  products: any[] = [];
  selectedProduct: any = null;
  selectedImage: string = '';
  isDetailsView: boolean = false;
  productForm!: FormGroup;
  cylOptions: any
  // Options
  sphOptions = Array.from({ length: 25 }, (_, i) => (-8.5 + i * 0.5).toFixed(1));
  axisOptions = [10, 20, 70, 80, 90, 100, 110, 160, 170];
  boxesOptions = Array.from({ length: 21 }, (_, i) => i);

  constructor(private http: HttpClient, private fb: FormBuilder, private authService: AuthService,private router:Router) { }

  ngOnInit(): void {
    // Load products from JSON
    this.http.get<any[]>('/assets/Json/lenses.json').subscribe((data) => {
      this.products = data;
    });
    this.cylOptions = Array.from({ length: 9 }, (_, i) => (-2 + i * 0.5).toFixed(1)); // Example range: -2 to 2

    // Initialize the form
    this.productForm = this.fb.group({
      rightEyePowerSPH: [''],
      rightEyePowerCYL: [''],
      rightEyeAxis: [''],
      rightNumberOfBoxes: [''],

      leftEyePowerSPH: [''],
      leftEyePowerCYL: [''],
      leftEyeAxis: [''],
      leftNumberOfBoxes: ['']
    });


  }

  // Show product details
  viewDetails(product: any): void {
    this.selectedProduct = product;
    this.selectedImage = product.image[0];
    this.isDetailsView = true;
  }

  // Go back to card view
  goBack(): void {
    this.isDetailsView = false;
    this.productForm.reset();
    this.selectedImage = '';
    this.selectedProduct = null;
  }


  // Change main image
  changeImage(newImage: string): void {
    this.selectedImage = newImage;
  }

  onSubmit(): void {
    const formValues = this.productForm.value;
    const lensOrder = {
      description: this.selectedProduct?.description,
      imageUrl: this.selectedProduct?.image?.[0] || '',
      mainOption: "Contact-Lens",
      name: this.selectedProduct?.name || '',
      price: this.selectedProduct?.price || 0,
      productId: this.selectedProduct?.id || '',
      productType: "contact-lens",
      quantity: 1,
      subOption: "contactLens",
      variant: "",
      userSelectionDetails: {
        rightEyePowerSPH: formValues.rightEyePowerSPH || '',
        rightEyePowerCYL: formValues.rightEyePowerCYL || '',
        rightEyeAxis: formValues.rightEyeAxis || '',
        rightNumberOfBoxes: formValues.rightNumberOfBoxes || '',
        leftEyePowerSPH: formValues.leftEyePowerSPH || '',
        leftEyePowerCYL: formValues.leftEyePowerCYL || '',
        leftEyeAxis: formValues.leftEyeAxis || '',
        leftNumberOfBoxes: formValues.leftNumberOfBoxes || '',
      }
    };

    const orderPayload = {
      items: [lensOrder],
      amount: this.selectedProduct?.price || 0,
    };

    let userdetails: any = localStorage.getItem('user');
    userdetails = JSON.parse(userdetails);
    this.authService.createOrder(orderPayload).subscribe({
      next: (res) => {
      if (res.success) {
             const options = {
               key: environment.razorPayKey, // Razorpay Key ID
               amount: res.order.amount,
               currency: res.order.currency,
               name: "i-trends",
               description: "Payment For Spec Purchase",
               order_id: res.order.id,
               handler: (paymentResponse: any) => {
                 this.verifyPayment(paymentResponse);
               },
               prefill: {
                 name: userdetails.name,
                 email: userdetails.email,
                 contact: userdetails.mobile
               },
               theme: {
                 color: "#3399cc"
               }
             };

             const razorpay = new Razorpay(options);
             razorpay.open();
           }
      },
      error: (err) => {
        console.error(err);
        alert('Failed to place order. Please try again.');
      }
    });
  }


  verifyPayment(paymentResponse: any) {
    const paymentData = {
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_signature: paymentResponse.razorpay_signature,
    };

    this.authService.verifyPayment(paymentData).subscribe((response: any) => {
      if (response.success) {
        console.log("Payment verification successful:", response);

        // Trigger order placement
        this.placeOrder(paymentResponse.razorpay_order_id, paymentResponse.razorpay_payment_id); // Pass verified order_id
      } else {
        console.error("Payment verification failed:", response.message);
      }
    }, (error: any) => {
      console.error("Payment verification failed:", error);
    });
  }

  placeOrder(razorpay_order_id: string, paymentId: string) {
    const orderData = { razorpay_order_id, paymentId };
    this.authService.placeOrder(orderData).subscribe((response: any) => {
      if (response.success) {
        const orderId = response.order._id;
        this.getOrderDetailsById(orderId)
      } else {


        console.error("Order placement failed:", response.message);
      }
    }, (error: any) => {


      console.error("Order placement failed:", error);
    });
  }
  confirmCartOrder(payload: any, orderId: any) {
    this.authService.confirmOrder(payload).subscribe((response: any) => {
      if (response.success) {
        const orderedItems = response.order.items;
        const confirmedProductIds: any = { productId: orderedItems[0].productId };


        // this.removeItem(confirmedProductIds.productId)

        this.router.navigate(['/payment-success'], { queryParams: { orderId: orderId } });
      } else {
        console.error("Order placement failed:", response.message);


      }
    }, (error: any) => {
      console.error("Order placement failed:", error);


    });
  }
  getOrderDetailsById(orderId: any) {
    this.authService.getOrderDetailsById(orderId).subscribe(
      (response: any) => {
        if (response.success) {
          let payload = {
            'paymentId': response.order.paymentId,
            'totalAmount': response.order.totalAmount,
            'items': response.order.items
          }
          this.confirmCartOrder(payload, orderId)
        } else {


          console.error('Failed to fetch order details:', response.message);
        }
      },
      (error: any) => {


        console.error('Error fetching order details:', error);
      }
    );
  }


}
