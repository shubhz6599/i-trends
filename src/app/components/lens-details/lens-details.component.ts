import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { UiService } from 'src/app/services/ui.service';
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
  sphOptions = [
    -8.00, -7.50, -7.00, -6.50, -6.00, -5.75, -5.50, -5.25, -5.00, -4.75, -4.50, -4.25,
    -4.00, -3.75, -3.50, -3.25, -3.00, -2.75, -2.50, -2.25,
    -2.00, -1.75, -1.50, -1.25, -1.00, -0.75, -0.50, -0.25,
    0.00, 0.25, 0.50, 0.75, 1.00, 1.25, 1.50, 1.75,
    2.00, 2.25, 2.50, 2.75, 3.00, 3.25, 3.50, 3.75,
    4.00, 4.25, 4.50, 4.75, 5.00, 5.25, 5.50, 5.75,
    6.00
  ];
  cylOptions = [
    -8.00, -7.50, -7.00, -6.50, -6.00, -5.50, -5.00, -4.50, -4.00, -3.75, -3.50, -3.25, -3.00, -2.75, -2.50, -2.25, -2.00, -1.75, -1.50, -1.25, -1.00, -0.75, -0.50, -0.25,
    0.00, 0.25, 0.50, 0.75, 1.00, 1.25, 1.50, 1.75,
    2.00
  ];
  axisOptions = [
    10, 20, 30, 40,
    50, 60, 70, 80, 90,
    100, 110, 120, 130, 140,
    150, 160, 170, 180
  ];
  boxesOptions = Array.from({ length: 21 }, (_, i) => i);
  ErrorMsg: string = '';

  constructor(private http: HttpClient, private fb: FormBuilder, private authService: AuthService, private router: Router, public uiService: UiService) { }

  ngOnInit(): void {
    // Load products from JSON
    this.http.get<any[]>('/assets/Json/lenses.json').subscribe((data) => {
      this.products = data;
    });


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
    let userData = this.productForm.value;
    console.log(userData);

    if (userData.rightEyePowerSPH || userData.rightEyePowerCYL || userData.leftEyePowerSPH || userData.leftEyePowerCYL) {
      console.log(userData.rightEyePowerCYL);
      if ((userData.rightEyePowerCYL && userData.rightEyeAxis == '') || userData.leftEyePowerCYL && userData.leftEyeAxis == '') {
        this.ErrorMsg = 'To Proceed Ahead Please Select Valid Axis Selection*'
        return
      }
    } else {
      this.ErrorMsg = 'To Proceed Ahead Please Make Valid Selection*'
      return
    }
    const formValues = this.productForm.value;
    console.log(this.selectedProduct?.price);
    console.log(formValues.rightNumberOfBoxes);
    console.log((formValues.rightNumberOfBoxes + formValues.leftNumberOfBoxes));

    console.log(this.selectedProduct?.price * (+(formValues.rightNumberOfBoxes) + +(formValues.leftNumberOfBoxes)));
    const lensOrder = {
      description: this.selectedProduct?.description,
      imageUrl: this.selectedProduct?.image?.[0] || '',
      mainOption: "Contact-Lens",
      name: this.selectedProduct?.name || '',
      price: this.selectedProduct?.price * (Number(formValues.rightNumberOfBoxes) + Number(formValues.leftNumberOfBoxes)) || 0,
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
      amount: lensOrder.price || 0,
    };

    let userdetails: any = localStorage.getItem('user');
    userdetails = JSON.parse(userdetails);
    this.uiService.showLoading();
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
        this.uiService.hideLoading();
        this.uiService.showToast('Error!', 'Failed To Place Order')
      }
    });
  }


  verifyPayment(paymentResponse: any) {
    const paymentData = {
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_signature: paymentResponse.razorpay_signature,
    };
    this.uiService.showLoading();
    this.authService.verifyPayment(paymentData).subscribe((response: any) => {
      if (response.success) {
        this.uiService.hideLoading();
        // Trigger order placement
        this.placeOrder(paymentResponse.razorpay_order_id, paymentResponse.razorpay_payment_id); // Pass verified order_id
      } else {
        this.uiService.hideLoading();
        this.uiService.showToast('Payment Failed!', 'Payment Verification Failed')
      }
    }, (error: any) => {
      this.uiService.hideLoading();
      this.uiService.showToast('Payment Failed!', 'Payment Verification Failed')
    });
  }

  placeOrder(razorpay_order_id: string, paymentId: string) {
    const orderData = { razorpay_order_id, paymentId };
    this.uiService.showLoading();
    this.authService.placeOrder(orderData).subscribe((response: any) => {
      if (response.success) {
        const orderId = response.order._id;
        this.uiService.hideLoading();
        this.getOrderDetailsById(orderId)
      } else {


        this.uiService.hideLoading();
        this.uiService.showToast('Order Place Failed!', 'Unable To Place Order')
      }
    }, (error: any) => {

      this.uiService.hideLoading();
      this.uiService.showToast('Order Place Failed!', 'Unable To Place Order')
    });
  }
  confirmCartOrder(payload: any, orderId: any) {
    this.uiService.showLoading();
    this.authService.confirmOrder(payload).subscribe((response: any) => {
      if (response.success) {
        const orderedItems = response.order.items;
        const confirmedProductIds: any = { productId: orderedItems[0].productId };
        this.uiService.hideLoading();

        this.router.navigate(['/payment-success'], { queryParams: { orderId: orderId } });
      } else {
        this.uiService.hideLoading();
        this.uiService.showToast('Order Failed', 'Unable To Place Order.')


      }
    }, (error: any) => {
      this.uiService.hideLoading();
      this.uiService.showToast('Order Failed', 'Unable To Place Order.')


    });
  }
  getOrderDetailsById(orderId: any) {
    this.uiService.showLoading()
    this.authService.getOrderDetailsById(orderId).subscribe(
      (response: any) => {
        if (response.success) {
          let payload = {
            'paymentId': response.order.paymentId,
            'totalAmount': response.order.totalAmount,
            'items': response.order.items
          }
          this.uiService.hideLoading();
          this.confirmCartOrder(payload, orderId)
        } else {


          this.uiService.hideLoading();
          this.uiService.showToast('Error', 'Unable To Place Order')
        }
      },
      (error: any) => {


        this.uiService.hideLoading();
        this.uiService.showToast('Error', 'Unable To Place Order')
      }
    );
  }


}
