import { Component } from '@angular/core';

@Component({
  selector: 'app-bottom-navbar',
  templateUrl: './bottom-navbar.component.html',
  styleUrls: ['./bottom-navbar.component.css']
})
export class BottomNavbarComponent {
  whatsappNumber = '+917276372943';
  showContactOptions: boolean = false;
  openWhatsAppChat() {
    const url = `https://wa.me/${this.whatsappNumber}`;
    window.open(url, '_blank'); // Open in a new tab
  }
  toggleOptions(): void {

    this.showContactOptions = !this.showContactOptions;
  }

  call(): void {
    const phoneNumber = '+91-8888952579';
    window.location.href = `tel:${phoneNumber}`; // Opens dialer with the number
  }

  mail(): void {
    const email = 'test@test.com';
    window.location.href = `mailto:${email}`; // Opens email client with the email address
  }

  whatsapp(): void {
    const phoneNumber = '+91-8888952579';
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}`; // WhatsApp URL format
    window.open(whatsappUrl, '_blank'); // Opens WhatsApp in a new tab
  }
}
