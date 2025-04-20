import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent {
  constructor(private authService:AuthService){}
  orders: any[] = [];

ngOnInit() {
  this.getOrders();
}

getOrders() {
  this.authService.getOrders().subscribe({
    next: (res) => {
      this.orders = res;
    },
    error: (err) => {
      console.error('Failed to fetch orders', err);
    }
  });
}
getStatusMessage(order: any): string {
  console.log(order);

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
