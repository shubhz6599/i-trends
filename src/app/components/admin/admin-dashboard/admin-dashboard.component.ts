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
    this.getOrders(); // Load all orders initially
  }

  getOrders() {
    const params: any = {};
    if (this.searchTerm) params.search = this.searchTerm;
    if (this.fromDate) params.from = this.fromDate; // Add start date filter
    if (this.toDate) params.to = this.toDate;       // Add end date filter

    this.orderService.getAdminOrders(params).subscribe({
      next: (res: any) => {
        this.orders = res.orders.map((order: any) => ({
          ...order,
          selectedStatus: order.status
        }));
      },
      error: () => {
        alert('Failed to load orders.');
      }
    });
  }

  // Clear Filters
  clearFilters() {
    this.searchTerm = '';
    this.fromDate = '';
    this.toDate = '';
    this.getOrders();
  }

  // Update Status
  updateStatus(order: any) {
    const status = order.selectedStatus;
    this.orderService.updateStatus(order._id, status).subscribe({
      next: () => this.getOrders(),
      error: () => alert('Error updating status.')
    });
  }

  // Export to Excel
  exportToExcel() {
    const params: any = {};
    if (this.searchTerm) params.search = this.searchTerm;
    if (this.fromDate) params.from = this.fromDate;
    if (this.toDate) params.to = this.toDate;

    this.orderService.exportOrdersToExcel(params);
  }

  // Filter for Today's Orders
  filterTodaysOrders() {
    const today = new Date();
    this.fromDate = today.toISOString().split('T')[0]; // Start of today
    this.toDate = today.toISOString().split('T')[0];   // End of today
    this.getOrders();
  }

  // Filter for Last 1 Month Orders
  filterLastMonthOrders() {
    const today = new Date();
    const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1));
    this.fromDate = oneMonthAgo.toISOString().split('T')[0]; // Start date (1 month ago)
    this.toDate = new Date().toISOString().split('T')[0];    // End date (today)
    this.getOrders();
  }

  // Filter for Last 1 Year Orders
  filterLastYearOrders() {
    const today = new Date();
    const oneYearAgo = new Date(today.setFullYear(today.getFullYear() - 1));
    this.fromDate = oneYearAgo.toISOString().split('T')[0]; // Start date (1 year ago)
    this.toDate = new Date().toISOString().split('T')[0];   // End date (today)
    this.getOrders();
  }
}
