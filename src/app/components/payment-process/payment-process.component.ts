import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-process',
  templateUrl: './payment-process.component.html',
  styleUrls: ['./payment-process.component.css'],
})
export class PaymentProcessComponent implements OnInit{
  orderId!: string;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.orderId = this.route.snapshot.queryParamMap.get('orderId')!;
    // Optionally, fetch order details from backend using orderId
  }


}
