import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-lens-details',
  templateUrl: './lens-details.component.html',
  styleUrls: ['./lens-details.component.css']
})
export class LensDetailsComponent implements OnInit {
  products: any[] = [];
  selectedProduct: any = null;
  selectedImage: string = '';
  isDetailsView: boolean = false;
  productForm!: FormGroup;

  // Options
  sphOptions = Array.from({ length: 25 }, (_, i) => (-8.5 + i * 0.5).toFixed(1));
  axisOptions = [10, 20, 70, 80, 90, 100, 110, 160, 170];
  boxesOptions = Array.from({ length: 21 }, (_, i) => i);

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    // Load products from JSON
    this.http.get<any[]>('/assets/Json/lenses.json').subscribe((data) => {
      this.products = data;
    });

    // Initialize the form
    this.productForm = this.fb.group({
      rightEyePower: ["", Validators.required],
      leftEyePower: ["", Validators.required],
      rightEyeAxis: ["", Validators.required],
      leftEyeAxis: ["", Validators.required],
      numberOfBoxes: ["", [Validators.required, Validators.min(1)]]
    });
  }

  // Show product details
  viewDetails(product: any): void {
    this.selectedProduct = product;
    this.selectedImage = product.image[0];
    this.isDetailsView = true;
  }

  // Go back to card view
  goBack(): void {
    this.isDetailsView = false;
    this.productForm.reset();
    this.selectedImage = '';
  }

  // Change main image
  changeImage(newImage: string): void {
    this.selectedImage = newImage;
  }

  // Handle form submission
  onSubmit(): void {
    if (this.productForm.valid) {
      alert(`Order placed for ${this.selectedProduct.name}!`);
      console.log(this.productForm.value);
    } else {
      alert('Please fill out all required fields!');
    }
  }
}
