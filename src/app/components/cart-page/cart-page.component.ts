import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit {
  cartItems: any[] = [];
  isLoading: boolean = true;
  totalAmount: number = 0;

  constructor(private authService: AuthService) {}

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
        console.log('Item removed from cart:', response);
        this.isLoading =false
        this.cartItems = Array.isArray(response) ? response : [response];
        this.calculateTotal();
        this.fetchCartItems()
      },
      (error) => {
        this.isLoading =false
        console.error('Error removing item from cart:', error);
        this.isLoading =false

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

  confirmOrder(){
    this.authService.placeOrder().subscribe(
      (response) => {
        console.log('Order Confirmed:', response);
        this.isLoading =false
        this.fetchCartItems()
      },
      (error) => {
        this.isLoading =false
        console.error('Error removing item from cart:', error);
        this.isLoading =false
      }
    );
  }
}
