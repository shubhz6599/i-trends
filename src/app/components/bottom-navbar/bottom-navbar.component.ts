import { Component } from '@angular/core';

@Component({
  selector: 'app-bottom-navbar',
  templateUrl: './bottom-navbar.component.html',
  styleUrls: ['./bottom-navbar.component.css']
})
export class BottomNavbarComponent {
  whatsappNumber = '+917276372943';
  openWhatsAppChat() {
    const url = `https://wa.me/${this.whatsappNumber}`;
    window.open(url, '_blank'); // Open in a new tab
  }
}
