import { Component } from '@angular/core';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  // Default selected values
  selectedImage: string = 'https://parspng.com/wp-content/uploads/2023/04/eyeglassespng.parspng.com-3.png';
  selectedTitle: string = 'Spec Name';
  selectedSubtitle: string = 'Popular House Plant';
  selectedPrice: string = '1499 RS';
  selectedDescription: string = 'Classic Peace Lily is a spathiphyllum floor plant arranged in a bamboo planter with a blue & red ribbon and butterfly pick.';

  selectedQuantity: any = "";
  quantityOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  // Color options with their corresponding images and details
  colorOptions = [
    {
      color: 'black',
      image: 'https://parspng.com/wp-content/uploads/2023/04/eyeglassespng.parspng.com-3.png',
      title: 'Black Specs',
      subtitle: 'Elegant and Stylish',
      price: '1499 RS',
      description: 'These black specs are perfect for a sophisticated look.'
    },
    {
      color: 'blue',
      image: 'https://i.pinimg.com/736x/09/a8/ce/09a8cef53dafa82900e1ace6106fbb4f.jpg',
      title: 'Blue Specs',
      subtitle: 'Trendy and Cool',
      price: '1459 RS',
      description: 'These blue specs are ideal for a modern and trendy style.'
    },
    {
      color: '#2c3e50',
      image: 'https://www.soigne.co.in/product-images/DSC09526.1.png/583024000004073238/1100x1100',
      title: 'Dark Blue Specs',
      subtitle: 'Classic and Timeless',
      price: '1499 RS',
      description: 'These dark blue specs offer a classic and timeless design.'
    }
  ];

  // Function to change the image and other details
  changeImage(color: any) {
    this.selectedImage = color.image;
    this.selectedTitle = color.title;
    this.selectedSubtitle = color.subtitle;
    this.selectedPrice = color.price;
    this.selectedDescription = color.description;
  }
  addToCart() {
    console.log('Added to Cart:', {
      title: this.selectedTitle,
      quantity: this.selectedQuantity,
      price: this.selectedPrice,
      image: this.selectedImage
    });
    // Add your logic to add the product to the cart
  }
  buyNow() {
    console.log('Buy Now:', {
      title: this.selectedTitle,
      quantity: this.selectedQuantity,
      price: this.selectedPrice,
      image: this.selectedImage
    });
    // Add your logic to proceed to checkout
  }
}
