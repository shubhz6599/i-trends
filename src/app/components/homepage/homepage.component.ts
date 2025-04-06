import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements AfterViewInit {
  isMenuOpen = false; // State to track menu visibility
  constructor(private router: Router) { }
  ngAfterViewInit(): void {
    this.observeCards();
    this.initImageFlipper();
  }
  initImageFlipper() {
    const flippers = document.querySelectorAll('.image-flipper');

    Array.from(flippers).forEach((flipper: Element) => {
      const images = flipper.querySelectorAll('.flipper-image');
      if (images.length !== 2) return; // Ensure we have exactly 2 images

      const frontImg = images[0] as HTMLElement;
      const backImg = images[1] as HTMLElement;
      let showFront = true;

      setInterval(() => {
        if (showFront) {
          frontImg.style.opacity = '0';
          backImg.style.opacity = '1';
        } else {
          frontImg.style.opacity = '1';
          backImg.style.opacity = '0';
        }
        showFront = !showFront;
      }, 1000);
    });
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

  navigate(name: any) {
    this.router.navigateByUrl(`category/${name}`)
  }
}
