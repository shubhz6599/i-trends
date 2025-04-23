import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
declare var Razorpay: any;

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit {
  cartItems: any[] = [];
  isLoading: boolean = true;
  totalAmount: number = 0;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.fetchCartItems();
  }

  fetchCartItems(): void {
    this.isLoading = true;

    this.authService.getCart().subscribe(
      (response) => {
        this.isLoading = false;

        if (response.length > 0) {
          this.cartItems = response;
          this.calculateTotal();
        } else {
          this.cartItems = [];
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching cart items:', error);
      }
    );
  }

  removeItem(productId: string): void {
    this.isLoading = true
    this.authService.removeFromCart(productId).subscribe(
      (response) => {
        this.isLoading = false
        this.cartItems = Array.isArray(response) ? response : [response];
        this.calculateTotal();
        this.fetchCartItems()
      },
      (error) => {
        this.isLoading = false
        console.error('Error removing item from cart:', error);
        this.isLoading = false

      }
    );
  }

  calculateTotal(): void {
    if (!Array.isArray(this.cartItems)) {
      console.error('cartItems is not an array:', this.cartItems);
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
    //       console.error('Error removing item from cart:', error);
    //       this.isLoading =false
    //     }
    //   );
    const productData = {
      name: this.cartItems[0].name,
      variant: this.cartItems[0].color,
      quantity: this.cartItems[0].quantity,
      price: this.cartItems[0].discountedPrice,
      imageUrl: this.cartItems[0].img,
      productId: this.cartItems[0].productId
    };



    this.initiatePayment([productData], productData.price);
  }

  initiatePayment(items: any[], amount: number) {
    this.isLoading = true;
    let userdetails: any = localStorage.getItem('user');
    userdetails = JSON.parse(userdetails);
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
        this.isLoading = false;

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
        this.isLoading = false;

        console.error("Order placement failed:", response.message);
      }
    }, (error: any) => {
      this.isLoading = false;

      console.error("Order placement failed:", error);
    });
  }
  confirmCartOrder(payload: any, orderId: any) {
    this.authService.confirmOrder(payload).subscribe((response: any) => {
      if (response.success) {
        const orderedItems = response.order.items;
        const confirmedProductIds: any = { productId: orderedItems[0].productId };


        this.removeItem(confirmedProductIds.productId)
        this.isLoading = false;
        this.router.navigate(['/payment-success'], { queryParams: { orderId: orderId } });
      } else {
        console.error("Order placement failed:", response.message);
        this.isLoading = false;

      }
    }, (error: any) => {
      console.error("Order placement failed:", error);
      this.isLoading = false;

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
          this.isLoading = false;

          console.error('Failed to fetch order details:', response.message);
        }
      },
      (error: any) => {
        this.isLoading = false;

        console.error('Error fetching order details:', error);
      }
    );
  }
}
