import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  orders: any[] = [];
  isLoading = false;

  constructor(private orderService: AuthService) {}

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this.isLoading = true;
    this.orderService.getOrders().subscribe({
      next: (res: any) => {
        this.orders = res.map((order: any) => ({
          ...order,
          selectedStatus: order.status
        }));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Failed to load orders.');
      }
    });
  }

  updateStatus(order: any) {
    const status = order.selectedStatus;
    this.orderService.updateStatus(order._id, status).subscribe({
      next: () => this.getOrders(),
      error: () => alert('Error updating status.')
    });
  }

  exportToExcel() {
    this.orderService.exportOrders();
  }
}
