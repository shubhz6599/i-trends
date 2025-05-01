import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})
export class TopNavbarComponent implements OnInit {
  isMenuOpen = false;
  cartCount = 0; // You can dynamically update it later from your cart service
  searchQuery: string = '';
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInsideMenu = target.closest('.nav-content') || target.closest('.hamburger');

    if (!clickedInsideMenu && this.isMenuOpen) {
      this.closeMenu();
    }
  }
  closeMenu() {
    this.isMenuOpen = false;
  }
    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit(): void {
      this.fetchCartItems()
    }
    fetchCartItems(): void {
      this.authService.getCart().subscribe(
        (response) => {
          if (response.cart.items.length > 0) {
            this.cartCount = response.cart.items.length;
          } else {
            this.cartCount = 0;
          }
        },
        (error) => {
          console.error('Error fetching cart items:', error);
        }
      );
    }


    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    }

    onSearch(): void {
      if(this.searchQuery.trim()) {
      this.router.navigate([`category/all-products/${this.searchQuery}`], {
        queryParams: { query: this.searchQuery },
      });
      this.toggleMenu()
    }
  }
}
