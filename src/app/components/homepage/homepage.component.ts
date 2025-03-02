import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements AfterViewInit {
  isMenuOpen = false; // State to track menu visibility

  ngAfterViewInit(): void {
    this.observeCards();
  }

  observeCards(): void {
    const cards = document.querySelectorAll('.hover-trigger');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('hover-trigger-active');
        } else {
          entry.target.classList.remove('hover-trigger-active');
        }
      });
    }, {
      threshold: 0.5 // Adjust this value to control when the effect triggers
    });

    cards.forEach(card => {
      observer.observe(card);
    });
  }

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
