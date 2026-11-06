import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  selector: 'app-bottom-navbar',
  templateUrl: './bottom-navbar.component.html',
  styleUrls: ['./bottom-navbar.component.css']
})
export class BottomNavbarComponent {
  showContactOptions: boolean = false;

  constructor(public theme: ThemeService, private authService: AuthService) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  toggleTheme(): void {
    this.theme.toggleTheme();
  }

  @HostListener('document:click', ['$event'])
  closeContactOptionsOnOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.showContactOptions && !target.closest('.contact-nav-item')) {
      this.showContactOptions = false;
    }
  }

  @HostListener('document:keydown.escape')
  closeContactOptionsOnEscape(): void {
    this.showContactOptions = false;
  }

  toggleOptions(): void {
    this.showContactOptions = !this.showContactOptions;
  }

  call(): void {
    const phoneNumber = '+91-8888952579';
    window.location.href = `tel:${phoneNumber}`; // Opens dialer with the number
  }

  mail(): void {
    const email = 'support@itrends.com';
    window.location.href = `mailto:${email}`; // Opens email client with the email address
  }

  whatsapp(): void {
    const phoneNumber = '+91-8888952579';
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}`; // WhatsApp URL format
    window.open(whatsappUrl, '_blank'); // Opens WhatsApp in a new tab
  }
}
