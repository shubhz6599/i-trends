import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent  implements OnInit{
  orders: any[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Fetch all orders for the logged-in user
    this.authService.getOrdersByUser().subscribe(
      (response: any) => {
        if (response.success) {
          this.orders = response.orders;
        } else {
          console.error('Failed to fetch orders:', response.message);
        }
      },
      (error: any) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  // Navigate to order details when an order is clicked
  viewOrderDetails(orderId: string): void {
    this.router.navigate(['/order-details', orderId]);
  }
}
