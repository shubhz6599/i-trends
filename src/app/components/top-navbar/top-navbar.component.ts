import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UiService } from 'src/app/services/ui.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})
export class TopNavbarComponent implements OnInit {
  isMenuOpen = false;
  cartCount: any; // You can dynamically update it later from your cart service
  searchQuery: string = '';
  userDetails: any;
  isAdmin:boolean = false;
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
  constructor(
    private authService: AuthService,
    private router: Router,
    private uiService: UiService,
    public theme: ThemeService
  ) {
    this.authService.cart$.subscribe((cart: any) => {
      this.cartCount = cart?.items?.length || 0;
    });

  }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    this.userDetails = storedUser ? JSON.parse(storedUser) : null;
    this.isAdmin = this.userDetails?.isAdmin ?? false;

  }

  toggleTheme(): void {
    this.theme.toggleTheme();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate([`category/all-products/${this.searchQuery}`], {
        queryParams: { query: this.searchQuery },
      });
      this.toggleMenu()
    }
  }
}
