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
  cartCount:any; // You can dynamically update it later from your cart service
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
    constructor(private authService: AuthService, private router: Router) {
      this.authService.cart$.subscribe((cart:any) => {
        this.cartCount = cart?.items?.length || 0;
      });

    }

    ngOnInit(): void {
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
