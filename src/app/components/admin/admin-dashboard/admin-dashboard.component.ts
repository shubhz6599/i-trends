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

  // Filters
  searchTerm = '';
  fromDate = '';
  toDate = '';

  constructor(private orderService: AuthService) {}

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this.isLoading = true;
    const params: any = {};
    if (this.searchTerm) params.search = this.searchTerm;
    if (this.fromDate) params.from = this.fromDate;
    if (this.toDate) params.to = this.toDate;

    this.orderService.getAdminOrders(params).subscribe({
      next: (res: any) => {
        this.orders = res.orders.map((order: any) => ({
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

  clearFilters() {
    this.searchTerm = '';
    this.fromDate = '';
    this.toDate = '';
    this.getOrders();
  }

  updateStatus(order: any) {
    console.log(order);

    const status = order.selectedStatus;
    this.orderService.updateStatus(order._id, status).subscribe({
      next: () => this.getOrders(),
      error: () => alert('Error updating status.')
    });
  }

  exportToExcel() {
    const params: any = {};
    if (this.searchTerm) params.search = this.searchTerm;
    if (this.fromDate) params.from = this.fromDate;
    if (this.toDate) params.to = this.toDate;

    this.orderService.exportOrdersToExcel(params);
  }
}
