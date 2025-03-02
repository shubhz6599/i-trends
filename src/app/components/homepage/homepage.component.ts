import { Component } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  isMenuOpen = false; // State to track menu visibility

  // Function to toggle menu
  toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
  }

  quantity = 1; // Default quantity
    cartCount = 0; // Cart count

    // Function to add item to cart
    addToCart() {
        this.cartCount += this.quantity;
        alert(`${this.quantity} item(s) added to cart!`);
    }

    // Function to buy now
    buyNow() {
        alert(`Buying ${this.quantity} item(s) now!`);
    }

    // Function to increase quantity
    increaseQuantity() {
        this.quantity++;
    }

    // Function to decrease quantity
    decreaseQuantity() {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }
}
