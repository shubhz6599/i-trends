import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import productsData from '../../../assets/Json/products.json';
import { ImagePreloaderService } from 'src/app/services/image-preloader.service';
import { SharedStateService } from 'src/app/services/shared-state.service';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { ViewportScroller } from '@angular/common';
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
  styleUrls: ['./product-explorer.component.css'],
  animations: [
    trigger('priceStep', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition(':enter', [
        animate('0.5s ease-out')
      ]),
      transition(':leave', [
        animate('0.3s ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class ProductExplorerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('priceDisplay') priceDisplay!: ElementRef;
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
  showDiscount: boolean = true; // Set to false if you don't want to show discount
  discountPercent: number = 20;
  priceAnimationTriggered = false;
  showOriginalPrice = false;
  showDiscountPercent = false;
  showFinalPrice = false;
  constructor(private route: ActivatedRoute, private router: Router, private imagePreloader: ImagePreloaderService, private ngZone: NgZone, private cdr: ChangeDetectorRef, private sharedStateService: SharedStateService, private viewportScroller: ViewportScroller) { }

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
  ngAfterViewInit() {
    this.setupScrollListener();

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
    window.removeEventListener('scroll', this.checkPriceInView.bind(this));
  }

  resetSelections(): void {
    this.selectedProduct = null;
    this.selectedVariant = null;
    this.selectedColor = null;
    this.currentMainImage = '';
    this.selectedQuantity = "Select Quantity";
    this.sharedStateService.setDetailViewVisible(false);
    this.priceAnimationTriggered = false;
    this.showOriginalPrice = false;
    this.showDiscountPercent = false;
    this.showFinalPrice = false;
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
    this.priceAnimationTriggered = false;
    this.showOriginalPrice = false;
    this.showDiscountPercent = false;
    this.showFinalPrice = false;
    this.updateAvailableColorsForProduct();
    this.sharedStateService.setDetailViewVisible(true);
    setTimeout(() => {
      this.startPriceAnimation();
    }, 50);
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
    this.priceAnimationTriggered = false;
    this.showOriginalPrice = false;
    this.showDiscountPercent = false;
    this.showFinalPrice = false;
    setTimeout(() => {
      this.startPriceAnimation();
    }, 50);
  }

  checkPriceInView(): void {
    if (this.priceAnimationTriggered || !this.priceDisplay) return;

    const element = this.priceDisplay.nativeElement;
    const rect = element.getBoundingClientRect();
    const isVisible = (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );

    if (isVisible) {
      this.priceAnimationTriggered = true;
      this.startPriceAnimation();
    }
  }



  setupScrollListener(): void {
    window.addEventListener('scroll', this.checkPriceInView.bind(this));
    // Initial check in case price is already visible
    setTimeout(() => this.checkPriceInView(), 500);
  }

  startPriceAnimation(): void {
    // Show original price first
    this.showOriginalPrice = true;
    this.cdr.detectChanges();

    // After 1 second, show discount percent
    setTimeout(() => {
      this.showDiscountPercent = true;
      this.cdr.detectChanges();

      // After another second, hide both and show final price
      setTimeout(() => {
        this.showOriginalPrice = false;
        this.showDiscountPercent = false;
        this.showFinalPrice = true;
        this.cdr.detectChanges();
      }, 1000);
    }, 1000);
  }

  showPriceWithDiscount() {
    this.showDiscount = false;
    this.cdr.detectChanges(); // Force view to update and detect the change
    setTimeout(() => {
      this.showDiscount = true;
    }, 10); // Small delay to allow DOM update
  }

  getFinalPriceDigits(): string[] {
    if (!this.selectedProduct || !this.selectedVariant) return [];
    const price = (this.selectedProduct.basePrice + this.selectedVariant.priceModifier).toString();
    return price.split('');
  }

  getOriginalPrice(): number {
    if (!this.selectedProduct || !this.selectedVariant) return 0;
    const finalPrice = this.selectedProduct.basePrice + this.selectedVariant.priceModifier;
    return Math.round(finalPrice / (1 - this.discountPercent / 100));
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
    if (this.selectedQuantity == "Select Quantity") {
      window.alert('Please select quantity to proceed')
    }

    // Implement your add to cart logic here
    console.log('Added to cart:', {
      product: this.selectedProduct.name,
      variant: this.selectedVariant.color,
      quantity: this.selectedQuantity,
      // price: this.getFinalPrice()
    });
    const productData = {
      name: this.selectedProduct.name,
      variant: this.selectedVariant.color,
      quantity: this.selectedQuantity,
      // price: this.getFinalPrice(),
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
      // price: this.getFinalPrice()
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
