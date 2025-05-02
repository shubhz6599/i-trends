import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UiService } from 'src/app/services/ui.service';
import { environment } from 'src/environments/environment';
declare var Razorpay: any;

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;

  constructor(private authService: AuthService, private router: Router, public uiService: UiService) { }

  ngOnInit(): void {
    this.fetchCartItems();
  }

  fetchCartItems(): void {
    this.uiService.showLoading()
    this.authService.getCart().subscribe(
      (response) => {

        if (response.cart.items.length > 0) {
          this.cartItems = response.cart.items;
          this.uiService.hideLoading();
          this.calculateTotal();
        } else {
          this.cartItems = [];
          this.uiService.hideLoading();
        }
      },
      (error) => {
        this.uiService.hideLoading();
        // this.uiService.showToast('Error', 'Error fetching cart items')
      }
    );
  }

  removeItem(productId: string): void {
    this.uiService.showLoading();
    this.authService.removeFromCart(productId).subscribe(
      (response) => {
        this.uiService.showToast('Success!', 'Product Removed From Cart')
        this.cartItems = Array.isArray(response) ? response : [response];
        this.calculateTotal();
        this.fetchCartItems()
        this.uiService.hideLoading();

      },
      (error) => {
        this.uiService.hideLoading();
        this.uiService.showToast('Erro!', 'Error while Removing From Cart')
      }
    );
  }

  calculateTotal(): void {
    if (!Array.isArray(this.cartItems)) {
      this.totalAmount = 0;
      return;
    }

    this.totalAmount = this.cartItems.reduce((total, item) => {
      // Convert discountedPrice from string to number (if needed)
      const price = Number(item.discountedPrice) || 0;
      return total + price * item.quantity;
    }, 0);
  }

  confirmOrder() {
    //   this.authService.placeOrder().subscribe(
    //     (response) => {
    //       this.isLoading =false
    //       this.fetchCartItems()
    //     },
    //     (error) => {
    //       this.isLoading =false
    //       this.isLoading =false
    //     }
    //   );

    const productData = this.cartItems.map(item => ({
      name: item.name,
      variant: item.color, // or item.variant if that's the correct key
      quantity: item.quantity,
      price: item.price, // use individual item price instead of totalAmount
      imageUrl: item.img,
      productId: item.productId,
      productType: item.productType,
      userSelectionDetails: item.userSelectionDetails || null // optional for contact-lens
    }));
    const totalAmount = this.cartItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);


    this.initiatePayment(productData, totalAmount);
  }

  initiatePayment(items: any[], amount: number) {
    let userdetails: any = localStorage.getItem('user');
    userdetails = JSON.parse(userdetails);

    this.uiService.showLoading()
    this.authService.createOrder({ items, amount }).subscribe((response: any) => {
      if (response.success) {
        const options = {
          key: environment.razorPayKey, // Razorpay Key ID
          amount: response.order.amount,
          currency: response.order.currency,
          name: "i-trends",
          description: "Payment For Spec Purchase",
          order_id: response.order.id,
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
    });
  }

  verifyPayment(paymentResponse: any) {
    const paymentData = {
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_signature: paymentResponse.razorpay_signature,
    };
    this.uiService.showLoading()
    this.authService.verifyPayment(paymentData).subscribe((response: any) => {
      if (response.success) {
        this.uiService.hideLoading();

        this.placeOrder(paymentResponse.razorpay_order_id, paymentResponse.razorpay_payment_id); // Pass verified order_id
      } else {
        this.uiService.hideLoading();
        this.uiService.showToast('Payment Failed', 'Error While Verifying Payment')
      }
    }, (error: any) => {
      this.uiService.hideLoading();
      this.uiService.showToast('Payment Failed', 'Error While Verifying Payment')
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
        this.uiService.showToast('Order Failed', 'Unable To Place Order')

      }
    }, (error: any) => {
      this.uiService.hideLoading();
      this.uiService.showToast('Order Failed', 'Unable To Place Order')
    });
  }
  confirmCartOrder(payload: any, orderId: any) {
    this.uiService.showLoading();
    this.authService.confirmOrder(payload).subscribe((response: any) => {
      if (response.success) {
        const orderedItems = response.order.items;
        const confirmedProductIds: any = { productId: orderedItems[0].productId };

        this.uiService.hideLoading()
        this.removeItem(confirmedProductIds.productId)
        this.router.navigate(['/payment-success'], { queryParams: { orderId: orderId } });
      } else {
        this.uiService.hideLoading()
        this.uiService.showToast('Order Failed', 'Unable To Place Order')
      }
    }, (error: any) => {
      this.uiService.hideLoading()
        this.uiService.showToast('Order Failed', 'Unable To Place Order')

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
          this.uiService.hideLoading()
          this.uiService.showToast('Order Failed', 'Unable To Place Order')
        }
      },
      (error: any) => {
        this.uiService.hideLoading()
        this.uiService.showToast('Order Failed', 'Unable To Place Order')
      }
    );
  }
}
