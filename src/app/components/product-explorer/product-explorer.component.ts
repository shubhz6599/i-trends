import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import productsData from '../../../assets/Json/products.json';

interface Variant {
  color: string;
  colorCode: string;
  images: string[];
  inStock: boolean;
  priceModifier: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  variants: Variant[];
  features: string[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  products: Product[];
}

@Component({
  selector: 'app-product-explorer',
  templateUrl: './product-explorer.component.html',
  styleUrls: ['./product-explorer.component.css']
})
export class ProductExplorerComponent implements OnInit {
  categories: Category[] = productsData.categories;
  currentCategory: Category | null = null;
  selectedProduct: Product | null = null;
  selectedVariant: Variant | null = null;
  selectedColor: string | null = null;
  availableColors: string[] = [];
  filteredProducts: Product[] = [];
  currentMainImage: string = ''; // Track currently displayed main image

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const categoryId = params.get('category');
      this.currentCategory = this.categories.find(c => c.id === categoryId) || null;
      this.filteredProducts = this.currentCategory?.products || [];
      this.resetSelections();
      this.updateAvailableColors();
    });
  }

  getColorCode(colorName: string): string {
    if (!this.currentCategory) return '#ffffff';
    for (const product of this.currentCategory.products) {
      const variant = product.variants.find(v => v.color === colorName);
      if (variant) return variant.colorCode;
    }
    return '#ffffff';
  }

  setMainImage(imgUrl: string): void {
    this.currentMainImage = imgUrl; // Update the current main image
  }

  resetSelections(): void {
    this.selectedProduct = null;
    this.selectedVariant = null;
    this.selectedColor = null;
    this.currentMainImage = '';
  }

  updateAvailableColors(): void {
    const colors = new Set<string>();
    this.currentCategory?.products.forEach(product => {
      product.variants.forEach(variant => {
        if (variant.inStock) colors.add(variant.color);
      });
    });
    this.availableColors = Array.from(colors);
  }

  filterByColor(color: string): void {
    this.selectedColor = color;
    if (!this.currentCategory) return;

    if (!color) {
      this.filteredProducts = [...this.currentCategory.products];
      return;
    }

    this.filteredProducts = this.currentCategory.products.filter(product =>
      product.variants.some(v => v.color === color && v.inStock)
    );
  }

  selectProduct(product: Product): void {
    this.selectedProduct = product;
    this.selectedVariant = product.variants[0];
    this.currentMainImage = this.selectedVariant.images[0]; // Set initial main image
    this.updateAvailableColorsForProduct();
  }


  updateAvailableColorsForProduct(): void {
    if (!this.selectedProduct) return;
    this.availableColors = this.selectedProduct.variants
      .filter(v => v.inStock)
      .map(v => v.color);
  }

  selectVariant(variant: Variant): void {
    this.selectedVariant = variant;
    this.currentMainImage = variant.images[0]; // Reset to first image when variant changes
  }

  getFinalPrice(): number {
    if (!this.selectedProduct || !this.selectedVariant) return 0;
    return this.selectedProduct.basePrice + this.selectedVariant.priceModifier;
  }
  selectColor(color: string): void {
    this.selectedColor = color;
    if (!this.selectedProduct) return;

    const variant = this.selectedProduct.variants.find(v =>
      v.color === color && v.inStock
    );

    if (variant) {
      this.selectedVariant = variant;
      this.currentMainImage = variant.images[0];
    }
  }
}
