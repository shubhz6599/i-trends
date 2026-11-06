import { Component, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [NgOptimizedImage, RouterLink],
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
