import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import productsData from '../../../assets/Json/products.json';
import { ImagePreloaderService } from 'src/app/services/image-preloader.service';
import { SharedStateService } from 'src/app/services/shared-state.service';

interface Variant {
  color: string;
  colorCode: string;
  images: string[];
  inStock: boolean;
  priceModifier: number;
  imagesLoaded: boolean;
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
export class ProductExplorerComponent implements OnInit, OnDestroy {
  categories: Category[] = productsData.categories;
  currentCategory: Category | null = null;
  selectedProduct: Product | null = null;
  selectedVariant: Variant | null = null;
  selectedColor: string | null = null;
  availableColors: string[] = [];
  filteredProducts: Product[] = [];
  currentMainImage: string = '';
  selectedQuantity: any = "Select Quantity";
  quantityOptions: any[] = ["Select Quantity", 1, 2, 3, 4, 5];
  imageLoaded: boolean = false;
  loadingMessages = [
    "Carrots are healthy for eyes!",
    "Did you know: Blinking helps keep eyes moist",
    "20-20-20 rule: Every 20 minutes, look 20 feet away for 20 seconds",
    "The human eye can distinguish about 10 million different colors",
    "Your eyes contain about 107 million light-sensitive cells",
    "Eyes are the second most complex organ after the brain",
    "The average person blinks 15-20 times per minute",
    "Wearing sunglasses protects your eyes from UV damage",
    "The cornea is the only tissue in the body without blood vessels",
    "Eye exercises can help reduce digital eye strain"
  ];

  currentLoadingMessage = this.loadingMessages[0];
  isLoading: boolean = true;
  categoryId: string | any = '';
  products: any[] = [];
  cachedImages: string[] = [];
  showImgPlaceholder: boolean = true;
  constructor(private route: ActivatedRoute, private router: Router, private imagePreloader: ImagePreloaderService, private ngZone: NgZone, private cdr: ChangeDetectorRef, private sharedStateService: SharedStateService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('category');
      this.currentCategory = this.categories.find(c => c.id === this.categoryId) || null;
      this.filteredProducts = this.currentCategory?.products || [];
      this.fetchCategoryImages();
      this.resetSelections();
      this.updateAvailableColors();

    });
  }
  fetchCategoryImages(): void {
    this.isLoading = true; // Show loader
    this.cachedImages = this.imagePreloader.getCategoryImages(this.categoryId); // Get cached images
    this.products = this.getCategoryProducts(); // Load products dynamically

    // If there are uncached images, preload them sequentially
    if (this.cachedImages.length < this.products.length) {
      this.imagePreloader.preloadCategoryImages(this.categoryId);
      this.showImgPlaceholder = false;
    }

    setTimeout(() => {
      this.isLoading = false; // Hide loader after images are fetched
    }, 2000); // Simulate loading delay (adjust based on real data fetching time)
  }


  getCategoryProducts(): any[] {
    const category = productsData.categories.find((cat) => cat.id === this.categoryId);
    return category?.products || [];
  }
  onImageLoad(): void {
    this.imageLoaded = true;
    const randomIndex = Math.floor(Math.random() * this.loadingMessages.length);
    this.currentLoadingMessage = this.loadingMessages[randomIndex];
  }

  getColorCode(colorName: string): string {
    if (!this.currentCategory) return '#ffffff';
    for (const product of this.currentCategory.products) {
      const variant = product.variants.find(v => v.color === colorName);
      if (variant) return variant.colorCode;
    }
    return '#ffffff';
  }

  navigateToHome() {
    this.router.navigateByUrl('/home');
  }

  // Add to your component
  private imageLoadTimeout: any;

  setMainImage(imgUrl: string): void {
    this.imageLoaded = false;
    this.currentMainImage = imgUrl;

    // Clear any existing timeout
    if (this.imageLoadTimeout) {
      clearTimeout(this.imageLoadTimeout);
    }

    // Set a timeout (e.g., 10 seconds)
    this.imageLoadTimeout = setTimeout(() => {
      if (!this.imageLoaded) {
        console.warn('Image load timed out:', imgUrl);
        this.imageLoaded = true; // Give up trying to show loading indicator
        // Optionally set a fallback image here
      }
    }, 10000);
  }

  // Don't forget to clear timeout in ngOnDestroy
  ngOnDestroy(): void {
    if (this.imageLoadTimeout) {
      clearTimeout(this.imageLoadTimeout);
    }
  }

  resetSelections(): void {
    this.selectedProduct = null;
    this.selectedVariant = null;
    this.selectedColor = null;
    this.currentMainImage = '';
    this.selectedQuantity = "Select Quantity";
    this.sharedStateService.setDetailViewVisible(false);
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
    console.log(product);

    this.selectedProduct = product;
    this.selectedVariant = product.variants[0];
    this.currentMainImage = this.selectedVariant.images[0];
    this.imageLoaded = false;
    this.selectedColor = this.selectedVariant.color;
    this.updateAvailableColorsForProduct();
    this.sharedStateService.setDetailViewVisible(true);
  }



  updateAvailableColorsForProduct(): void {
    if (!this.selectedProduct) return;
    this.availableColors = this.selectedProduct.variants
      .filter(v => v.inStock)
      .map(v => v.color);
  }

  selectVariant(variant: Variant): void {
    this.selectedVariant = variant;
    this.currentMainImage = variant.images[0];
    this.imageLoaded = false;
    this.selectedColor = variant.color;
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
      this.selectVariant(variant);
    }
  }

  addToCart(): void {
    if (!this.selectedProduct || !this.selectedVariant || !this.selectedVariant.inStock) return;

    // Implement your add to cart logic here
    console.log('Added to cart:', {
      product: this.selectedProduct.name,
      variant: this.selectedVariant.color,
      quantity: this.selectedQuantity,
      price: this.getFinalPrice()
    });
    const productData = {
      name: this.selectedProduct.name,
      variant: this.selectedVariant.color,
      quantity: this.selectedQuantity,
      price: this.getFinalPrice(),
      imageUrl: this.selectedVariant.images[0], // Assuming the first image is the main image
    };
    this.router.navigate(['/payment'], { state: { product: productData } });

    // Optional: Show confirmation or navigate to cart
    // this.router.navigate(['/cart']);
  }

  buyNow(): void {
    if (!this.selectedProduct || !this.selectedVariant || !this.selectedVariant.inStock) return;

    // Implement your buy now logic here
    console.log('Buy now:', {
      product: this.selectedProduct.name,
      variant: this.selectedVariant.color,
      quantity: this.selectedQuantity,
      price: this.getFinalPrice()
    });

    // Optional: Navigate to checkout
    // this.router.navigate(['/checkout']);
  }

  onImageLoaded(index: number): void {
    this.ngZone.run(() => {
      const image: any = this.filteredProducts[index].variants[0].images[0];
      // image.loaded = true;
      this.filteredProducts[index].variants[0].imagesLoaded = true;
      console.log(`images loaded for ${image}`);
    });
    this.cdr.detectChanges()
  }

  goBack() {
    this.router.navigateByUrl('/home')
  }
}
