import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent implements OnInit {
  orderId: string = '';
  orderDetails: any = null;

  constructor(private route: ActivatedRoute, private authService: AuthService, private uiService: UiService) { }

  ngOnInit(): void {
    // Get the orderId from the route parameters
    this.orderId = this.route.snapshot.params['orderId'];

    // Fetch order details by ID
    this.uiService.showLoading()
    this.authService.getOrderDetailsById(this.orderId).subscribe(
      (response: any) => {
        this.uiService.hideLoading()
        if (response.success) {
          this.orderDetails = response.order;
        } else {
        }
      },
      (error: any) => {
        this.uiService.hideLoading()
        this.uiService.showToast('Error!', 'Error fetching order details')
      }
    );
  }
}
