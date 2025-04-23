import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent implements OnInit {
  orderId: string = '';
  orderDetails: any = null;

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    // Get the orderId from the route parameters
    this.orderId = this.route.snapshot.params['orderId'];

    // Fetch order details by ID
    this.authService.getOrderDetailsById(this.orderId).subscribe(
      (response: any) => {
        if (response.success) {
          this.orderDetails = response.order;
          console.log('Order Details:', this.orderDetails);
        } else {
          console.error('Failed to fetch order details:', response.message);
        }
      },
      (error: any) => {
        console.error('Error fetching order details:', error);
      }
    );
  }
}
