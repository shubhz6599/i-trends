import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

// In your product.model.ts or where you define interfaces
interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: any;
  variants: Variant[];
  features: string[];
  rating?: number; // Optional property
  basePriceWithDiscount?: number; // Optional property
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
export class ProductExplorerComponent implements OnInit, OnDestroy, AfterViewInit,OnDestroy {
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
  selectedSort: string = ''; // Tracks selected sorting option
  selectedPriceRange: any = null; // Tracks selected price range
  selectedRating: number | null = null; // Tracks selected rating
  selectedDiscount: number | null = null; // Tracks selected discount
  isFilterPanelVisible: boolean = false;
  priceRanges = [
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: '₹1000 - ₹1500', min: 1000, max: 1500 },
    { label: '₹1500 - ₹2000', min: 1500, max: 2000 },
    { label: '₹2000 - ₹2500', min: 2000, max: 2500 },
    { label: '₹2500 - ₹3000', min: 2500, max: 3000 },
  ];
  ratingsOptions = [4, 3, 2, 1]; // Ratings options: 4 stars & up, 3 stars & up, etc.
  discountOptions = [10, 20, 30, 40, 50];
  selectedFilters: { label: string, value: any }[] = [];
  searchResultMessage: string = '';
  currentStep: number = 1; // Tracks the current step (1, 2, or 3)
  steps = [1, 2, 3]; // Step numbers

  selection = {
    mainOption: '',
    subOption: ''
  };

  subOptions: string[] = []; // Sub-options for the selected main option

  subOptionsMap: Record<string, string[]> = {
    'single-vision': [
      'Anti-Glare Premium',
      'BLU Screen Lenses',
      'Thin BLU Screen Lenses',
      'Owndays Japan Clear Vision Lenses',
      'Owndays Japan Shatterproof'
    ],
    'bifocal': ['Circular Bi-focal KT', 'Anti-Glare Normal Corridor Progressive', 'Anti-Glare Normal Corridor Progressive', 'BLU Screen Normal Corridor Progressive', 'BLU Screen Wide Corridor Progressive'],
    'zero-power': ['BLU Screen Lenses Zero Power', 'Brown Tinted Color Lenses', 'Pink Tinted Color Lenses', 'Yellow Tinted Color Lenses', 'Blue Tinted Color Lenses', 'Green Tinted Color Lenses', 'Grey Tinted Color Lenses', 'Owndays Japan Clear Vision Lenses Zero Power'],
    'frame-only': ['Stylish Frames', 'Lightweight', 'Durable']
  };
  optionDetails: Record<string, string[]> = {
    'Anti-Glare Premium': ['6 Months Warranty', 'Double Side Anti-Glare'],
    'BLU Screen Lenses': ['1 Year Warranty', 'Protects from Digital Rays', 'Crack, Smudge & Scratch Resistant'],
    'Thin BLU Screen Lenses': ['Lightweight', 'Slim Design', 'High Optical Clarity'],
    'Owndays Japan Clear Vision Lenses': ['Premium Quality', 'Clear Vision', 'Anti-Reflection Coating'],
    'Owndays Japan Shatterproof': ['Shatterproof Design', 'Durable', 'Impact Resistant'],
    'Circular Bi-focal KT': ['1 Year Warranty', 'UV-400 Protection', 'Crack & Scratch Resistant', 'Water & Dust Repellent', 'Circular Reading Area in Lower Part'],
    'Anti-Glare Normal Corridor Progressive': ['1 Year Warranty', 'UV-400 Protection', 'Crack & Scratch Resistant', 'Water & Dust Repellent', 'For Distance Intermediate & Near Vision', 'Smooth Lens with No Visible Line'],
    'BLU Screen Normal Corridor Progressive': ['1 Year Warranty', 'UV-400 Protection', 'Crack & Scratch Resistant', 'Water & Dust Repellent', 'Protects from Digital Rays', 'For Distance, Intermediate & Near Vision'],
    'BLU Screen Wide Corridor Progressive': ['1 Year Warranty', 'UV-400 Protection', 'Crack & Scratch Resistant', 'Water & Dust Repellent', 'Protects from Digital Rays', 'For Distance, Intermediate & Near Vision'],
    'BLU Screen Lenses Zero Power': ['1 Year Warranty', 'UV-420 Protection', 'Crack & Scratch Resistant', 'Water & Dust Repellent', 'Protects from Digital Rays', 'Double Side Anti-Glare'],
    'Brown Tinted Color Lenses': ['1 Year Warranty', 'UV-420 Protection', 'Crack & Scratch Resistant', 'Water & Dust Repellent', 'Lightweight Lenses', 'Applicable Only for Single Vision Power'],
    'Pink Tinted Color Lenses': ['1 Year Warranty', 'UV-420 Protection', 'Crack & Scratch Resistant', 'Water & Dust Repellent', 'Lightweight Lenses', 'Applicable Only for Single Vision Power'],
    'Yellow Tinted Color Lenses': ['1 Year Warranty', 'UV-420 Protection', 'Crack & Scratch Resistant', 'Water & Dust Repellent', 'Lightweight Lenses', 'Applicable Only for Single Vision Power'],
    'Blue Tinted Color Lenses': ['1 Year Warranty', 'UV-420 Protection', 'Crack & Scratch Resistant', 'Water & Dust Repellent', 'Lightweight Lenses', 'Applicable Only for Single Vision Power'],
    'Green Tinted Color Lenses': ['1 Year Warranty', 'UV-420 Protection', 'Crack & Scratch Resistant', 'Water & Dust Repellent', 'Lightweight Lenses', 'Applicable Only for Single Vision Power'],
    'Grey Tinted Color Lenses': ['1 Year Warranty', 'UV-420 Protection', 'Crack & Scratch Resistant', 'Water & Dust Repellent', 'Lightweight Lenses', 'Applicable Only for Single Vision Power'],
    'Owndays Japan Clear Vision Lenses Zero Power': ['1 Year Warranty', 'UV-420 Protection', 'Crack & Scratch Resistant', 'Water & Dust Repellent', 'Lightweight Lenses', 'Applicable Only for Single Vision Power']
  };
  prices: Record<string, number> = {
    'Anti-Glare Premium': 400,
    'BLU Screen Lenses': 500,
    'Thin BLU Screen Lenses': 1000,
    'Owndays Japan Clear Vision Lenses': 1200,
    'Owndays Japan Shatterproof': 2000,
    'Circular Bi-focal KT': 1000,
    'Anti-Glare Normal Corridor Progressive': 1000,
    'BLU Screen Normal Corridor Progressive': 1800,
    'BLU Screen Wide Corridor Progressive': 2500,
    'BLU Screen Lenses Zero Power': 1500,
    'Brown Tinted Color Lenses': 1200,
    'Pink Tinted Color Lenses': 120,
    'Yellow Tinted Color Lenses': 1200,
    'Blue Tinted Color Lenses': 1200,
    'Green Tinted Color Lenses': 1200,
    'Grey Tinted Color Lenses': 1200,
    'Owndays Japan Clear Vision Lenses Zero Power': 1600
  };
  isBumperDiscountView: boolean = false;
  isAllProductsView: boolean = false;
  constructor(private route: ActivatedRoute, private router: Router, private imagePreloader: ImagePreloaderService, private ngZone: NgZone, private cdr: ChangeDetectorRef, private sharedStateService: SharedStateService, private viewportScroller: ViewportScroller) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const viewType = params.get('category');

      if (viewType === 'bumper-discount') {
        this.showBumperDiscountProducts();
      } else if (viewType === 'all-products') {
        this.showAllProducts();
      } else {
      this.categoryId = params.get('category');
      this.currentCategory = this.categories.find(c => c.id === this.categoryId) || null;
      this.filteredProducts = this.currentCategory?.products || [];
      }

      this.fetchCategoryImages();
      this.resetSelections();
      this.updateAvailableColors();

    });
  }

  showBumperDiscountProducts(): void {
    this.isBumperDiscountView = true;
    this.isAllProductsView = false;

    // Flatten all products from all categories and filter by bumperDiscount flag
    this.filteredProducts = this.categories
      .flatMap((category:any) => category.products)
      .filter(product => product.bumperdiscount === true);

    this.searchResultMessage = 'Showing all bumper discounted products';
    console.log(this.filteredProducts);

  }

  showAllProducts(): void {
    this.imagePreloader.preloadAllProductsImages();
    this.isAllProductsView = true;
    this.isBumperDiscountView = false;

    // Flatten all products from all categories
    this.filteredProducts = this.categories.flatMap(category => category.products);

    this.searchResultMessage = 'Showing all available products';
  }
  ngAfterViewInit() {
    this.setupScrollListener();

  }


  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // Reset body styles when modal closes (including via browser back button)
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0';
  }

  manualFixBodyStyles() {
    // Call this when you open/close the modal programmatically
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0';
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
    const lensModal = document.getElementById('lensModal');
    this.hideModal()
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
     // Reset body styles when component is destroyed
     document.body.style.overflow = 'auto';
     document.body.style.paddingRight = '0';
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
      // Get all bumper discount products across all categories
      productsToCheck = this.categories
        .flatMap(category => category.products)
        .filter(product => product.bumperdiscount);
    } else if (this.isAllProductsView) {
      // Get all products across all categories
      productsToCheck = this.categories.flatMap(category => category.products);
    } else if (this.currentCategory) {
      // Get products from current category
      productsToCheck = this.currentCategory.products;
    }

    // Collect unique colors with their codes
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
    this.updateAvailableColorsForProduct();
    this.sharedStateService.setDetailViewVisible(true);
    setTimeout(() => {
      this.startPriceAnimation();
    }, 1000);
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
      }, 2000);
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


  buyNow(): void {
    if (!this.selectedProduct || !this.selectedVariant || !this.selectedVariant.inStock) return;



    // Optional: Navigate to checkout
    // this.router.navigate(['/checkout']);
  }

  onImageLoaded(index: number): void {
    this.ngZone.run(() => {
      const image: any = this.filteredProducts[index].variants[0].images[0];
      // image.loaded = true;
      this.filteredProducts[index].variants[0].imagesLoaded = true;
    });
    this.cdr.detectChanges()
  }

  goBack() {
    this.hideModal()
    this.router.navigateByUrl('/home')
  }

  sortProducts(sortOption: string): void {
    if (sortOption === 'lowToHigh') {
      this.filteredProducts = [...this.filteredProducts].sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortOption === 'highToLow') {
      this.filteredProducts = [...this.filteredProducts].sort((a, b) => b.basePrice - a.basePrice);
    }
  }

  // Filter products by color
  filterByColor(colorName: string) {
    // Check if filter is already selected
    if (!this.selectedFilters.find(filter => filter.label === colorName)) {
      this.selectedFilters.push({ label: colorName, value: colorName });
      // this.applyFilters(); // Apply filters immediately
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
      this.selectedFilters.push({ label: ` ${discount}% or more`, value: discount });
    }
  }

  // Remove filter from selectedFilters array
  removeFilter(filter: { label: string, value: any }) {
    this.selectedFilters = this.selectedFilters.filter(f => f.label !== filter.label);

  }

  resetFilters() {
    if (this.currentCategory?.products) this.filteredProducts = this.currentCategory?.products;
    this.searchResultMessage = ''
    this.toggleFilterPanel();

  }
  // Apply filters on search button click
  applyFilters() {
    console.log('Applying filters:', this.selectedFilters);

    // Start with all products in the current category
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

    // Apply color filters
    const colorFilters = this.selectedFilters
      .filter(filter => this.availableColors.some(color => color.name === filter.value))
      .map(filter => filter.value);

    if (colorFilters.length > 0) {
      filtered = filtered.filter(product =>
        product.variants.some(variant => colorFilters.includes(variant.color))
      );
    }

    // Apply price filters
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

    // Apply rating filters (if applicable)
    const ratingFilters = this.selectedFilters
      .filter(filter => filter.label.endsWith('★ & Up'))
      .map(filter => filter.value);

    if (ratingFilters.length > 0) {
      filtered = filtered.filter((product: any) =>
        product.rating && ratingFilters.some(rating => product.rating >= rating)
      );
    }

    // Apply discount filters
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

    // If no products match, prepare related products
    if (filtered.length === 0) {
      this.filteredProducts = this.getRelatedProducts();
      this.searchResultMessage =
        'Your search query did not match any products. Showing related products instead.';
    } else {
      this.searchResultMessage = filtered.length > 0
      ? `Showing Available ${filtered.length} Variants`
      : 'No products match your filters';
      this.filteredProducts = filtered
    }

    // Close filter panel
    this.toggleFilterPanel();
  }

  getRelatedProducts(): Product[] {
    return this.currentCategory?.products || [];
  }
  // Filter products by today's deals
  filterTodaysDeals(): void {
    this.filteredProducts = this.currentCategory?.products.filter((product: any) =>
      product.isTodaysDeal // Assuming isTodaysDeal exists in product data
    ) || [];

  }

  toggleFilterPanel(): void {

    this.isFilterPanelVisible = !this.isFilterPanelVisible;
  }

  // Apply filters and close the filter panel
  openModal(): void {
    const lensModal = document.getElementById('lensModal');
    if (lensModal) {
      const modalInstance = new (window as any).bootstrap.Modal(lensModal);
      modalInstance.show(); // Show the modal

      // Apply fade-in effect to backdrop (optional, handled via CSS)
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.classList.add('fade');
      }
    }
  }



  // Handle main option selection
  selectMainOption(option: string): void {
    if (option === 'frame-only') {
      this.selectFrameOnly()
    } else {
      this.selection.mainOption = option;
      this.subOptions = this.subOptionsMap[option];
      this.currentStep = 2; // Navigate to Step 2
    }
  }

  // Handle sub-option selection
  selectSubOption(option: string): void {
    this.selection.subOption = option;
    this.currentStep = 3; // Navigate to Step 3
  }

  // Go back to the previous step
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

  // Proceed to buy
  proceedToBuy(): void {
    console.log(this.selectedProduct?.basePrice);

    if (this.selection.mainOption && this.selection.subOption && this.selectedProduct) {
      let price = this.prices[this.selection.subOption] + this.selectedProduct?.basePrice
      // Prepare product data for Step 3 display
      const productData = {
        name: this.selectedProduct?.name,
        variant: this.selectedVariant?.color,
        quantity: this.selectedQuantity || 1,
        price: price,
        imageUrl: this.selectedVariant?.images[0],
        ...this.selection
      };

      const totalPrice = price; // Add frame price

      // Log product data for debugging
      console.log('Proceeding to buy:', productData, `Total Price: ₹${totalPrice}`);

      // Navigate to checkout or payment page
      this.hideModal();
      this.manualFixBodyStyles();
      this.router.navigate(['/payment'], { state: { product: productData, totalPrice } });

      // Reset selection
      this.resetSelection();
    } else {
      alert('Please make all selections!');
    }
  }

  // Reset the selection after proceeding
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
      quantity: this.selectedQuantity,
      price: price.join(""),
      imageUrl: this.selectedVariant.images[0],
    };
    this.hideModal()
    this.router.navigate(['/payment'], { state: { product: productData } });

  }
  hideModal(): void {
    const lensModal = document.getElementById('lensModal');
    if (lensModal) {
      const modalInstance = new (window as any).bootstrap.Modal(lensModal);
      modalInstance.hide(); // Trigger Bootstrap's hide functionality

      // Delay removal for transition effect
      setTimeout(() => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove(); // Remove the backdrop after animation completes
        }
      }, 300); // Match the transition duration in your CSS (0.3s)
    }
  }
}
