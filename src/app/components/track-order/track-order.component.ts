import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.css']
})
export class TrackOrderComponent implements OnInit {
  order: any;

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('orderId');
    if (orderId) {
      this.authService.trackOrder(orderId).subscribe({
        next: (res) => this.order = res,
        error: (err) => console.error('Error tracking order:', err)
      });
    }
  }
  getStatusMessage(order: any): string {

    switch (order.status) {
      case 'Processing':
        return '📦 Your order has been placed and will be shipped soon!';
      case 'confirmed':
        return '✅ Order confirmed. Preparing to dispatch...';
      case (order.status.startsWith('shippedto') ? order.status : ''):
        return `🚚 Dispatched from warehouse ➝ Arrived at ${order.currentCity}`;
      case 'deliveryday':
        return '📬 Out for delivery. You will receive it today!';
      case 'complete':
        return '✅ Order delivered successfully.';
      default:
        return '🔄 Status updating...';
    }
  }
}
