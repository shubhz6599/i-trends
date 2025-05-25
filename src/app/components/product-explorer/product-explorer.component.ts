import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import productsData from '../../../assets/Json/products.json';
import { ImagePreloaderService } from 'src/app/services/image-preloader.service';
import { SharedStateService } from 'src/app/services/shared-state.service';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { ViewportScroller } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { UiService } from 'src/app/services/ui.service';
import { FormBuilder } from '@angular/forms';
declare var Razorpay: any;
declare var bootstrap: any;
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
  basePrice: any;
  variants: Variant[];
  features: string[];
  rating?: number; // Optional property
  basePriceWithDiscount: any; // Optional property
  bumperdiscount?: boolean; // Add this new optional property
  isTodaysDeal?: boolean; // Existing optional property
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
export class ProductExplorerComponent implements OnInit, OnDestroy, AfterViewInit, OnDestroy {
  @ViewChild('priceDisplay') priceDisplay!: ElementRef;
  categories: Category[] = productsData.categories;
  currentCategory: Category | null = null;
  selectedProduct: Product | null = null;
  selectedVariant: Variant | any = null;
  selectedColor: any | null = null;
  availableColors: any[] = [];
  filteredProducts: Product[] = [];
  currentMainImage: string = '';
  selectedQuantity: any = "Select Quantity";
  quantityOptions: any[] = ["Select Quantity", 1, 2, 3, 4, 5];
  imageLoaded: boolean = false;
  paymentMsg: string = '';
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
  showDiscount: boolean = true;
  discountPercent: number = 0;
  priceAnimationTriggered = false;
  showOriginalPrice = false;
  showDiscountPercent = false;
  showFinalPrice = false;
  selectedSort: string = '';
  selectedPriceRange: any = null;
  selectedRating: number | null = null;
  selectedDiscount: number | null = null;
  isFilterPanelVisible: boolean = false;
  priceRanges = [
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: '₹1000 - ₹1500', min: 1000, max: 1500 },
    { label: '₹1500 - ₹2000', min: 1500, max: 2000 },
    { label: '₹2000 - ₹2500', min: 2000, max: 2500 },
    { label: '₹2500 - ₹3000', min: 2500, max: 3000 },
  ];
  ratingsOptions = [4, 3, 2, 1];
  discountOptions = [10, 20, 30, 40, 50];
  selectedFilters: { label: string, value: any }[] = [];
  searchResultMessage: string = '';
  currentStep: number = 1;
  steps = [1, 2, 3, 4];
  selection = {
    mainOption: '',
    subOption: ''
  };
  subOptions: string[] = [];
  subOptionsMap: Record<string, string[]> = {
    'single-vision': [
      'Anti-Glare Premium',
      'BLU Screen Lenses',
      'Thin BLU Screen Lenses',
      'High Power Screen Lenses',
      'Hoya Nulux Blue Control Lenses Japan'
    ],
    'bifocal': ['Circular Bi-focal KT', 'Normal Corridor Progressive', 'Anti-Glare Normal Corridor Progressive', 'BLU Screen Normal Corridor Progressive', 'BLU Screen Wide Corridor Progressive'],
    'zero-power': ['BLU Screen Lenses Zero Power', 'Brown Tinted Color Lenses', 'Pink Tinted Color Lenses', 'Yellow Tinted Color Lenses', 'Blue Tinted Color Lenses', 'Green Tinted Color Lenses', 'Grey Tinted Color Lenses'],
    'frame-only': ['Stylish Frames', 'Lightweight', 'Durable']
  };
  optionDetails: Record<string, string[]> = {
    'Anti-Glare Premium': ['Double Side Anti-Glare', 'Scratch Resistant', 'Index 1.50'],
    'BLU Screen Lenses': ['Double Side Anti-Glare', 'Protects from Digital Rays', 'Crack, Smudge & Scratch Resistant'],
    'Thin BLU Screen Lenses': ['Lightweight', 'Slim Design', 'High Optical Clarity', 'Double Side Anti-Glare', 'Protects from Digital Rays', 'Crack, Smudge & Scratch Resistant', 'Uv Protection'],
    'High Power Screen Lenses': ['Lightweight', 'Slim Design', 'High Optical Clarity', 'Double Side Anti-Glare', 'Protects from Digital Rays', 'Crack, Smudge & Scratch Resistant', 'Uv Protection', 'Index 1.60', 'Material MR8'],
    'Hoya Nulux Blue Control Lenses Japan': ['Shatterproof Design', 'Durable', 'Impact Resistant', 'Lightweight', 'Slim Design', 'High Optical Clarity', 'Double Side Anti-Glare', 'Protects from Digital Rays', 'Crack, Smudge & Scratch Resistant', 'Uv Protection', 'Index 1.60', 'Material MR8'],
    'Circular Bi-focal KT': ['Scratch Resistant', 'UV-400 Protection', 'Water & Dust Repellent', 'Circular Reading Area in Lower Part', 'Index 1.50', 'Material CR'],
    'Normal Corridor Progressive': ['Water & Dust Repellent', 'Crack & Scratch Resistant', 'For Distance Intermediate & Near Vision', 'Smooth Lens with No Visible Line', 'Index 1.50'],
    'Anti-Glare Normal Corridor Progressive': ['Double Side Anti Glare', 'Water & Dust Repellent', 'Crack & Scratch Resistant', 'For Distance Intermediate & Near Vision', 'Smooth Lens with No Visible Line', 'Index 1.50'],
    'BLU Screen Normal Corridor Progressive': ['Protects from digital rays', 'Double Side Anti Glare', 'Crack & Scratch Resistant', 'Water & Dust Repellent', 'For Distance, Intermediate & Near Vision', 'Smooth Lens with No Visible Line'],
    'BLU Screen Wide Corridor Progressive': ['Protects from digital rays', 'Double Side Anti Glare', 'Crack & Scratch Resistant', 'Eye Tracking', 'Power Optimiser', 'Nearmax', 'Auto adjust', 'Lightweight', 'Thinner'],
    'BLU Screen Lenses Zero Power': ['UV-420 Protection', 'Crack & Scratch Resistant', 'Water & Dust Repellent', 'Protects from Digital Rays', 'Double Side Anti-Glare'],
    'Brown Tinted Color Lenses': ['UV-420 Protection', 'Crack & Scratch Resistant', 'Water & Dust Repellent', 'Lightweight Lenses', 'Applicable Only for Single Vision Power'],
    'Pink Tinted Color Lenses': ['UV-420 Protection', 'Crack & Scratch Resistant', 'Water & Dust Repellent', 'Lightweight Lenses', 'Applicable Only for Single Vision Power'],
    'Yellow Tinted Color Lenses': ['Best For Night Drive', 'UV-420 Protection', 'Crack & Scratch Resistant', 'Water & Dust Repellent', 'Lightweight Lenses', 'Applicable Only for Single Vision Power'],
    'Blue Tinted Color Lenses': ['UV-420 Protection', 'Crack & Scratch Resistant', 'Water & Dust Repellent', 'Lightweight Lenses', 'Applicable Only for Single Vision Power'],
    'Green Tinted Color Lenses': ['UV-420 Protection', 'Crack & Scratch Resistant', 'Water & Dust Repellent', 'Lightweight Lenses', 'Applicable Only for Single Vision Power'],
    'Grey Tinted Color Lenses': ['UV-420 Protection', 'Crack & Scratch Resistant', 'Water & Dust Repellent', 'Lightweight Lenses', 'Applicable Only for Single Vision Power']
  };
  prices: Record<string, number> = {
    'Anti-Glare Premium': 600,
    'BLU Screen Lenses': 1000,
    'Thin BLU Screen Lenses': 1500,
    'High Power Screen Lenses': 2000,
    'Hoya Nulux Blue Control Lenses Japan': 4000,
    'Circular Bi-focal KT': 1200,
    'Normal Corridor Progressive': 1500,
    'Anti-Glare Normal Corridor Progressive': 2200,
    'BLU Screen Normal Corridor Progressive': 3200,
    'BLU Screen Wide Corridor Progressive': 5500,
    'BLU Screen Lenses Zero Power': 1000,
    'Brown Tinted Color Lenses': 1200,
    'Pink Tinted Color Lenses': 1200,
    'Yellow Tinted Color Lenses': 1200,
    'Blue Tinted Color Lenses': 1200,
    'Green Tinted Color Lenses': 1200,
    'Grey Tinted Color Lenses': 1200
  };
  isBumperDiscountView: boolean = false;
  isAllProductsView: boolean = false;
  searchQueryFromHomePageNav: string = '';
  currentCategoryImage: string = '';
  alertMessage: any = '';
  alertType: string = '';
  private imageLoadTimeout: any;
  viewType: any;
  productForm = this.fb.group({
    rightEyePowerSPH: [''],
    rightEyePowerCYL: [''],
    rightEyeAxis: [''],
    rightNumberOfBoxes: [''],
    leftEyePowerSPH: [''],
    leftEyePowerCYL: [''],
    leftEyeAxis: [''],
    leftNumberOfBoxes: ['']
  });

  sphOptions = [
    -6.00, -5.75, -5.50, -5.25, -5.00, -4.75, -4.50, -4.25,
    -4.00, -3.75, -3.50, -3.25, -3.00, -2.75, -2.50, -2.25,
    -2.00, -1.75, -1.50, -1.25, -1.00, -0.75, -0.50, -0.25,
    0.00, 0.25, 0.50, 0.75, 1.00, 1.25, 1.50, 1.75,
    2.00, 2.25, 2.50, 2.75, 3.00, 3.25, 3.50, 3.75,
    4.00, 4.25, 4.50, 4.75, 5.00, 5.25, 5.50, 5.75,
    6.00
  ];
  cylOptions = [
    -4.00, -3.75, -3.50, -3.25, -3.00, -2.75, -2.50, -2.25, -2.00, -1.75, -1.50, -1.25, -1.00, -0.75, -0.50, -0.25,
    0.00, 0.25, 0.50, 0.75, 1.00, 1.25, 1.50, 1.75,
    2.00
  ];
  axisOptions = [
    10, 20, 30, 40,
    50, 60, 70, 80, 90,
    100, 110, 120, 130, 140,
    150, 160, 170, 180
  ];
  boxesOptions = [1.50, 1.60, 1.67, 1.74];
  addOptions = ['+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00'];
  ErrorMsg: string = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private imagePreloader: ImagePreloaderService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private sharedStateService: SharedStateService,
    private viewportScroller: ViewportScroller,
    private authService: AuthService,
    public uiService: UiService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const viewType = params.get('category');
      this.viewType = viewType
      const searchQuery = params.get('searchQuery')
      if (viewType === 'bumper-discount') {
        this.currentCategoryImage = 'https://media.istockphoto.com/id/842287212/vector/bright-sale-background-poster-in-orange-color.jpg?s=612x612&w=0&k=20&c=0y7tCbAmRQriR4080d2omzcuTDSamVU34Q1p3Ejqge0='
        this.showBumperDiscountProducts();
      } if (viewType === 'all-products' && searchQuery == null) {
        this.currentCategoryImage = 'https://envision-eyecare.com/wp-content/uploads/2024/09/7-Reasons-To-Buy-Glasses-From-Your-Optometrist-Hero.jpg'
        this.showAllProducts();
      } else if (viewType === 'all-products' && searchQuery != null) {
        this.searchQueryFromHomePageNav = searchQuery
        this.showAllProducts()
      }
      if (viewType !== 'all-products' && viewType !== 'bumper-discount') {
        this.categoryId = params.get('category');
        this.currentCategory = this.categories.find(c => c.id === this.categoryId) || null;
        this.filteredProducts = this.currentCategory?.products || [];
      }
      this.fetchCategoryImages();
      this.resetSelections();
      this.updateAvailableColors();
    });
    this.scrollTop();
  }


  scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  showBumperDiscountProducts(): void {
    this.isBumperDiscountView = true;
    this.isAllProductsView = false;
    this.filteredProducts = this.categories
      .flatMap((category: any) => category.products)
      .filter(product => product.bumperdiscount === true);
    this.searchResultMessage = 'Showing all bumper discounted products';
  }

  showAllProducts(): void {
    this.imagePreloader.preloadAllProductsImages();
    this.isAllProductsView = true;
    this.isBumperDiscountView = false;
    this.filteredProducts = this.categories.flatMap(category => category.products);
    this.searchResultMessage = 'Showing all available products';
    if (this.searchQueryFromHomePageNav != null) {
      this.filteredProducts = this.filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(this.searchQueryFromHomePageNav.toLowerCase())
      );
    }
  }
  private lensModalInstance: any;

  ngAfterViewInit() {
    this.setupScrollListener();
  }

  fetchCategoryImages(): void {
    this.cachedImages = this.imagePreloader.getCategoryImages(this.categoryId);
    this.products = this.getCategoryProducts();
    if (this.cachedImages.length < this.products.length) {
      this.imagePreloader.preloadCategoryImages(this.categoryId);
      this.showImgPlaceholder = false;
    }
    setTimeout(() => {
    }, 2000);
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

  setMainImage(imgUrl: string): void {
    this.imageLoaded = false;
    this.currentMainImage = imgUrl;
    if (this.imageLoadTimeout) {
      clearTimeout(this.imageLoadTimeout);
    }
    this.imageLoadTimeout = setTimeout(() => {
      if (!this.imageLoaded) {
        this.imageLoaded = true;
      }
    }, 10000);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.checkPriceInView.bind(this));
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0';
    this.hideModal()
    this.sharedStateService.setDetailViewVisible(false)
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
    this.updateAvailableColors();
  }

  updateAvailableColors(): void {
    let productsToCheck: Product[] = [];
    if (this.isBumperDiscountView) {
      productsToCheck = this.categories
        .flatMap(category => category.products)
        .filter(product => product.bumperdiscount);
    } else if (this.isAllProductsView) {
      productsToCheck = this.categories.flatMap(category => category.products);
    } else if (this.currentCategory) {
      productsToCheck = this.currentCategory.products;
    }
    const colorsWithCodes: { name: string; colorCode: string }[] = [];
    productsToCheck.forEach(product => {
      product.variants.forEach(variant => {
        if (!colorsWithCodes.some(color => color.name === variant.color)) {
          colorsWithCodes.push({
            name: variant.color,
            colorCode: variant.colorCode
          });
        }
      });
    });
    this.availableColors = colorsWithCodes;
  }

  selectProduct(product: Product): void {
    this.selectedProduct = product;
    this.selectedVariant = product.variants[0];
    this.currentMainImage = this.selectedVariant.images[0];
    this.imageLoaded = false;
    this.selectedColor = this.selectedVariant.color;
    this.priceAnimationTriggered = false;
    this.showOriginalPrice = false;
    this.showDiscountPercent = false;
    this.showFinalPrice = false;
    this.discountPercent = this.calculateDiscountPercentage(product.basePrice, product.basePriceWithDiscount)
    this.updateAvailableColorsForProduct();
    // this.sharedStateService.setDetailViewVisible(true);
    setTimeout(() => {
      this.startPriceAnimation();
    }, 1000);
    this.scrollTop();
  }


  calculateDiscountPercentage(basePrice: number, discountPrice: number): number {
    if (basePrice === 0) {
      throw new Error("Base price cannot be zero.");
    }
    const discountPercentage = (discountPrice / basePrice) * 100;
    return parseFloat(discountPercentage.toFixed(2)); // Round to 2 decimal places
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
    setTimeout(() => this.checkPriceInView(), 500);
  }

  startPriceAnimation(): void {
    this.showOriginalPrice = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.showDiscountPercent = true;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.showOriginalPrice = false;
        this.showDiscountPercent = false;
        this.showFinalPrice = true;
        this.cdr.detectChanges();
      }, 2000);
    }, 1000);
  }

  showPriceWithDiscount() {
    this.showDiscount = false;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.showDiscount = true;
    }, 10);
  }

  getFinalPriceDigits(): string[] {
    if (!this.selectedProduct || !this.selectedVariant) return [];
    const price = (this.selectedProduct.basePrice - this.selectedProduct.basePriceWithDiscount).toString();
    return price.split('');
  }

  getOriginalPrice(): number {
    if (!this.selectedProduct || !this.selectedVariant) return 0;
    return this.selectedProduct.basePrice;
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

  onImageLoaded(index: number): void {
    this.ngZone.run(() => {
      const image: any = this.filteredProducts[index].variants[0].images[0];
      this.filteredProducts[index].variants[0].imagesLoaded = true;
    });
    this.cdr.detectChanges()
  }

  goBack() {
    this.router.navigateByUrl('/')
  }

  sortProducts(sortOption: string): void {
    if (sortOption === 'lowToHigh') {
      this.filteredProducts = [...this.filteredProducts].sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortOption === 'highToLow') {
      this.filteredProducts = [...this.filteredProducts].sort((a, b) => b.basePrice - a.basePrice);
    }
  }

  filterByColor(colorName: string) {
    if (!this.selectedFilters.find(filter => filter.label === colorName)) {
      this.selectedFilters.push({ label: colorName, value: colorName });
    }
  }

  filterByPrice(priceRange: any) {
    if (!this.selectedFilters.find(filter => filter.label === priceRange.label)) {
      this.selectedFilters.push({ label: priceRange.label, value: priceRange });
    }
  }

  filterByRating(rating: number) {
    if (!this.selectedFilters.find((filter: any) => filter.label === `${rating} ★ & Up`)) {
      this.selectedFilters.push({ label: `${rating} ★ & Up`, value: rating });
    }
  }

  filterByDiscount(discount: number) {
    if (!this.selectedFilters.find((filter: any) => filter.label === `${discount}% or more`)) {
      this.selectedFilters.push({ label: `${discount}% or more`, value: discount });
    }
  }

  removeFilter(filter: { label: string, value: any }) {
    this.selectedFilters = this.selectedFilters.filter(f => f.label !== filter.label);
  }

  resetFilters() {
    if (this.currentCategory?.products) this.filteredProducts = this.currentCategory?.products;
    this.searchResultMessage = ''
    this.toggleFilterPanel();
  }

  applyFilters() {
    this.uiService.showLoading();
    let filtered: Product[] = [];
    if (this.isBumperDiscountView) {
      filtered = this.categories
        .flatMap(category => category.products)
        .filter(product => product.bumperdiscount);
    } else if (this.isAllProductsView) {
      filtered = this.categories.flatMap(category => category.products);
    } else {
      filtered = [...this.currentCategory?.products || []];
    }
    const colorFilters = this.selectedFilters
      .filter(filter => this.availableColors.some(color => color.name === filter.value))
      .map(filter => filter.value);

    if (colorFilters.length > 0) {
      filtered = filtered.filter(product =>
        product.variants.some(variant => colorFilters.includes(variant.color))
      );
    }
    const priceFilters = this.selectedFilters
      .filter(filter => this.priceRanges.some(range => range.label === filter.label))
      .map(filter => filter.value);
    if (priceFilters.length > 0) {
      filtered = filtered.filter(product =>
        priceFilters.some(range =>
          product.basePrice >= range.min && product.basePrice <= range.max
        )
      );
    }
    const ratingFilters = this.selectedFilters
      .filter(filter => filter.label.endsWith('★ & Up'))
      .map(filter => filter.value);
    if (ratingFilters.length > 0) {
      filtered = filtered.filter((product: any) =>
        product.rating && ratingFilters.some(rating => product.rating >= rating)
      );
    }
    const discountFilters = this.selectedFilters
      .filter(filter => filter.label.endsWith('% or more'))
      .map(filter => filter.value);
    if (discountFilters.length > 0) {
      filtered = filtered.filter((product: any) =>
        discountFilters.some(discount =>
          Math.round(100 - (product.basePrice / product.basePriceWithDiscount) * 100) >= discount
        )
      );
    }
    if (filtered.length === 0) {
      this.filteredProducts = this.getRelatedProducts();
      this.searchResultMessage =
        'Your search query did not match any products. Showing related products instead.';
    } else {
      this.searchResultMessage = filtered.length > 0
        ? `Showing Available ${filtered.length} Variants`
        : 'No products match your filters';
      this.filteredProducts = filtered;
    }
    this.uiService.hideLoading()
    this.toggleFilterPanel();

  }

  getRelatedProducts(): Product[] {
    return this.currentCategory?.products || [];
  }

  filterTodaysDeals(): void {
    this.filteredProducts = this.currentCategory?.products.filter((product: any) =>
      product.isTodaysDeal
    ) || [];

  }

  toggleFilterPanel(): void {
    this.isFilterPanelVisible = !this.isFilterPanelVisible;
  }

  openModal(): void {
    let jwt = localStorage.getItem('jwtToken');
    let user: any = localStorage.getItem('user');
    user = user ? JSON.parse(user) : null;
    if (!jwt || !user) {
      // If jwt or user is missing → Not Logged In
      this.uiService.showToast('OOPS!', 'You are not logged in. Please log in to continue. Redirecting to Login Page...')
      setTimeout(() => {
        this.router.navigate(['/auth']);
      }, 3000);
    } else if (!user.address || Object.keys(user.address).length === 0) {
      // If user is logged in but address not filled properly
      const button = document.querySelector('.customBtn') as HTMLElement;
      this.uiService.showToast('OOPS!', 'Address details are missing. Redirecting to Account Page...')

      setTimeout(() => {
        this.router.navigate(['/account']);
      }, 3000);
    } else {
      // User is logged in and address is filled → Open Lens Selection Modal
      const lensModal = document.getElementById('lensModal');
      if (lensModal) {
        this.currentStep = 1;
        this.selection = {
          mainOption: '',
          subOption: ''
        };
        const modalInstance = new (window as any).bootstrap.Modal(lensModal);
        modalInstance.show();
      }
    }
  }


  selectMainOption(option: string): void {
    if (option === 'frame-only') {
      this.selectFrameOnly()
    }
    else {
      this.selection.mainOption = option;
      this.subOptions = this.subOptionsMap[option];
      if (option === 'zero-power' && this.viewType == 'Unisex Sunglasses') {
        this.subOptions = this.subOptions.filter(
          item => item !== 'BLU Screen Lenses Zero Power'
        );
      }

      this.currentStep = 2;
    }
  }

  selectSubOption(option: string): void {
    this.selection.subOption = option;
    if (this.selection.mainOption == 'zero-power') {
      this.currentStep = 4
    } else {
      this.currentStep = 3;

    }
  }

  goBackForToggle(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      if (this.currentStep === 1) {
        this.selection.mainOption = '';
      } else if (this.currentStep === 2) {
        this.selection.subOption = '';
      }
    }
  }


  hideModal() {
    const modalElement = document.getElementById('lensModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal?.hide();
  }
  proceedToBuy(): void {
    if (this.selection.mainOption && this.selection.subOption && this.selectedProduct) {
      let price = this.prices[this.selection.subOption] + this.selectedProduct?.basePrice - this.selectedProduct?.basePriceWithDiscount
      const productData = {
        name: this.selectedProduct?.name,
        variant: this.selectedVariant?.color,
        quantity: 1,
        price: price,
        imageUrl: this.selectedVariant?.images[0],
        ...this.selection,
        productId: this.selectedProduct?.id,
        productType: 'specs'
      };
      this.initiatePayment([productData], productData.price);
    } else {
      alert('Please make all selections!');
    }
  }

  resetSelection(): void {
    this.selection = { mainOption: '', subOption: '' };
    this.currentStep = 1;
  }

  selectFrameOnly(): void {

    let price: any = this.getFinalPriceDigits();
    if (!this.selectedProduct || !this.selectedVariant || !this.selectedVariant.inStock) return;
    const productData = {
      name: this.selectedProduct.name,
      variant: this.selectedVariant.color,
      quantity: 1,
      price: price.join(""),
      imageUrl: this.selectedVariant.images[0],
      productId: this.selectedProduct.id,
      mainOption: "Frame-Only",
      subOption: "No Suboption(Only Frame)",
      description: this.selectedProduct.description,
      productType: 'specs'
    };
    this.initiatePayment([productData], productData.price)
  }

  AddToCart() {
    if (this.selection.mainOption && this.selection.subOption && this.selectedProduct) {
      let price = this.prices[this.selection.subOption] + this.selectedProduct?.basePrice - this.selectedProduct?.basePriceWithDiscount
      const productData = {
        name: this.selectedProduct?.name,
        variant: this.selectedVariant?.color,
        quantity: 1,
        price: price,
        imageUrl: this.selectedVariant?.images[0],
        ...this.selection,
        productId: this.selectedProduct?.id,
        productType: 'specs',
        description: this.selectedProduct?.description,
        userSelectionDetails: this.productForm.value
      };
      this.hideModal()
      this.uiService.showLoading()
      this.authService.addToCart(productData).subscribe({
        next: (res) => {
          this.showAlert('Product added to cart', 'success');
          this.uiService.hideLoading();
          this.uiService.showToast('Success!', 'Product Added To Cart Successfully')
        },
        error: (err) => {
          this.uiService.hideLoading()
          this.uiService.showToast('Error!', 'Error While Adding Product To Cart')
          this.showAlert(err.error.message, 'danger');
        }
      });
    }
  }

  showAlert(message: string, type: string): void {
    this.alertMessage = message;
    this.alertType = ` alert-${type}`;
    setTimeout(() => {
      this.alertMessage = null;
    }, 3000);
  }

  initiatePayment(items: any[], amount: number) {
    const modalElement = document.getElementById('lensModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal?.hide();
    let userdetails: any = localStorage.getItem('user');
    userdetails = JSON.parse(userdetails);
    this.uiService.showLoading();
    this.authService.createOrder({ items, amount }).subscribe((response: any) => {
      console.log(response)
      if (response.success) {
        const options = {
          key: environment.razorPayKey,
          amount: response.order.amount,
          currency: response.order.currency,
          name: "i-trends",
          description: "Payment For Spec Purchase",
          order_id: response.order.id,
          handler: (paymentResponse: any) => {
            this.verifyPayment(paymentResponse);
          },
          prefill: {
            name: userdetails.name,
            email: userdetails.email,
            contact: userdetails.mobile
          },
          theme: {
            color: "#3399cc"
          }, modal: {
            // Called when user closes Razorpay modal
            ondismiss: () => {
              console.log('Razorpay payment popup closed');
              this.uiService.hideLoading();
            }
          }
        };
        const razorpay = new Razorpay(options);
        // this.uiService.hideLoading();
        razorpay.open();
        this.uiService.hideLoading();

      }
    });
  }

  verifyPayment(paymentResponse: any) {
    this.paymentMsg = 'Please Wait, Verifying Your Payment'
    const paymentData = {
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_signature: paymentResponse.razorpay_signature,
    };
    this.uiService.showLoading()
    this.authService.verifyPayment(paymentData).subscribe((response: any) => {
      if (response.success) {
        this.uiService.hideLoading()
        this.uiService.showToast('Payment Success', 'Please while verifying your payment')
        this.placeOrder(paymentResponse.razorpay_order_id, paymentResponse.razorpay_payment_id);
      } else {
        this.uiService.hideLoading()
        this.uiService.showToast('Payment Failed', 'Error While verifying payment with merchant')
      }
    }, (error: any) => {
      this.uiService.hideLoading()
      this.uiService.showToast('Payment Failed', 'Error while verifying payment')
    });
  }

  placeOrder(razorpay_order_id: string, paymentId: string) {
    const orderData = { razorpay_order_id, paymentId };
    this.uiService.showLoading()
    this.authService.placeOrder(orderData).subscribe((response: any) => {
      if (response.success) {
        const orderId = response.order._id;
        this.getOrderDetailsById(orderId)
        this.uiService.hideLoading()
      } else {
        this.uiService.hideLoading();
        this.uiService.showToast('Order Failed', 'Payment Success but unable to place order.')
      }
    }, (error: any) => {
    });
  }

  confirmOrder(payload: any, orderId: any) {
    this.uiService.showLoading()
    this.authService.confirmOrder(payload).subscribe((response: any) => {
      if (response.success) {
        this.uiService.hideLoading();
        this.router.navigate(['/payment-success'], { queryParams: { orderId: orderId } });
      } else {
        this.uiService.hideLoading();
        this.uiService.showToast('Unable To Place Order', 'Payment Success but unable to place order.')
      }
    }, (error: any) => {
      this.uiService.hideLoading();
      this.uiService.showToast('Unable To Place Order', 'Payment Success but unable to place order.')
    });
  }

  getOrderDetailsById(orderId: any) {
    this.uiService.showLoading()
    this.authService.getOrderDetailsById(orderId).subscribe(
      (response: any) => {
        if (response.success) {
          let payload = {
            'paymentId': response.order.paymentId,
            'totalAmount': response.order.totalAmount,
            'items': response.order.items
          }
          this.uiService.hideLoading();
          this.confirmOrder(payload, orderId)
        } else {
          this.uiService.hideLoading();
          this.uiService.showToast('Unable To Place Order', 'Payment Success but unable to order')
        }
      },
      (error: any) => {
        this.uiService.hideLoading();
        this.uiService.showToast('Unable To Place Order', 'Payment Success but unable to order')
      }
    );
  }

  onSubmit() {


    let userData = this.productForm.value;
    console.log(userData);

    if (userData.rightEyePowerSPH || userData.rightEyePowerCYL || userData.leftEyePowerSPH || userData.leftEyePowerCYL) {
      console.log(userData.rightEyePowerCYL);


      if ((userData.rightEyePowerCYL && userData.rightEyeAxis == '') || userData.leftEyePowerCYL && userData.leftEyeAxis == '') {
        this.ErrorMsg = 'To Proceed Ahead Please Select Valid Axis Selection*'
        return
      }
      else {
        this.currentStep = 4;

      }
    } else {
      this.ErrorMsg = 'To Proceed Ahead Please Make Valid Selection*'
    }

  }
}
