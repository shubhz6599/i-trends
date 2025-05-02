import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent  implements OnInit{
  orders: any[] = [];

  constructor(private authService: AuthService, private router: Router, private uiService:UiService) {}

  ngOnInit(): void {
    // Fetch all orders for the logged-in user
    this.uiService.showLoading()
    this.authService.getOrdersByUser().subscribe(
      (response: any) => {
        this.uiService.hideLoading();
        if (response.success) {
          this.orders = response.orders;
        } else {
        }
      },
      (error: any) => {
        this.uiService.hideLoading();
        this.uiService.showToast('Error!','Error While Fetching Orders')
      }
    );
  }

  // Navigate to order details when an order is clicked
  viewOrderDetails(orderId: string): void {
    this.router.navigate(['/order-details', orderId]);
  }

  getStatusColor(status: string): string {

    switch (status.toLowerCase()) {
      case 'deliveryday':
        return '#f6c23e'; // Yellow
      case 'processing':
        return '#28a745'; // Green
      case 'cancelled':
        return '#dc3545'; // Red
      default:
        return '#6c757d'; // Gray
    }
  }
}
