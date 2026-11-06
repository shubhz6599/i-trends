import { Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import type { FaceLandmarker, FaceLandmarkerResult, NormalizedLandmark } from '@mediapipe/tasks-vision';
import productsData from '../../../assets/Json/products.json';
import { SharedStateService } from 'src/app/services/shared-state.service';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { UiService } from 'src/app/services/ui.service';
import { RazorpayService } from 'src/app/services/razorpay.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from '../spinner/spinner.component';
declare var bootstrap: any;
interface Variant {
  color: string;
  colorCode: string;
  images: string[];
  tryOnImage?: string;
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
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, FormsModule, ReactiveFormsModule, SpinnerComponent],
  selector: 'app-product-explorer',
  templateUrl: './product-explorer.component.html',
  styleUrls: ['./product-explorer.component.css']
})
export class ProductExplorerComponent implements OnInit, OnDestroy {
  @ViewChild('tryOnVideo') private tryOnVideo?: ElementRef<HTMLVideoElement>;
  @ViewChild('tryOnCanvas') private tryOnCanvas?: ElementRef<HTMLCanvasElement>;

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
  failedImageUrls = new Set<string>();
  discountPercent: number = 0;
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
  private imageLoadTimeout?: ReturnType<typeof setTimeout>;
  private readonly pendingTimeouts = new Set<ReturnType<typeof setTimeout>>();
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
  isTryOnOpen = false;
  isTryOnLoading = false;
  tryOnError = '';
  tryOnStatus = '';
  private cameraStream: MediaStream | null = null;
  private faceLandmarker: FaceLandmarker | null = null;
  private tryOnContext: CanvasRenderingContext2D | null = null;
  private tryOnProductImage: HTMLImageElement | null = null;
  private tryOnProductImageUrl = '';
  private tryOnProductImageLoadSource = '';
  private tryOnProductImageLoad: Promise<HTMLImageElement> | null = null;
  private animationFrameId: number | null = null;
  private tryOnRequestId = 0;
  private isTryOnStarting = false;
  private lastVideoTime = -1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedStateService: SharedStateService,
    private authService: AuthService,
    public uiService: UiService,
    private fb: FormBuilder,
    private razorpayService: RazorpayService,
    private ngZone: NgZone
  ) { }

  get supportsVirtualTryOn(): boolean {
    const productName = this.selectedProduct?.name ?? '';
    const categoryName = this.currentCategory?.name ?? '';
    return !!this.selectedProduct && !/(contact lens|lens care|accessor|case)/i.test(`${productName} ${categoryName}`);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const viewType = params.get('category');
      const searchQuery = params.get('searchQuery');
      this.viewType = viewType;
      this.searchQueryFromHomePageNav = searchQuery ?? '';
      this.currentCategory = null;
      this.categoryId = '';
      this.filteredProducts = [];
      this.isAllProductsView = false;
      this.isBumperDiscountView = false;
      this.currentCategoryImage = '';

      if (viewType === 'bumper-discount') {
        this.showBumperDiscountProducts();
      } else if (viewType === 'all-products' && searchQuery == null) {
        this.currentCategoryImage = 'https://envision-eyecare.com/wp-content/uploads/2024/09/7-Reasons-To-Buy-Glasses-From-Your-Optometrist-Hero.jpg';
        this.showAllProducts();
      } else if (viewType === 'all-products') {
        this.showAllProducts();
      }
      else if (viewType) {
        this.categoryId = params.get('category');
        this.currentCategory = this.categories.find(c => c.id === this.categoryId) || null;
        this.filteredProducts = this.currentCategory?.products || [];
      }
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
    this.isAllProductsView = true;
    this.isBumperDiscountView = false;
    this.filteredProducts = this.getBaseProducts();
    this.searchResultMessage = 'Showing all available products';
  }

  private getBaseProducts(): Product[] {
    if (this.isBumperDiscountView) {
      return this.categories
        .flatMap(category => category.products)
        .filter(product => product.bumperdiscount);
    }

    if (this.isAllProductsView) {
      const products = this.categories.flatMap(category => category.products);
      return this.searchQueryFromHomePageNav.trim()
        ? products.filter(product =>
            product.name.toLowerCase().includes(this.searchQueryFromHomePageNav.toLowerCase())
          )
        : products;
    }

    return this.currentCategory?.products || [];
  }

  getDiscountedPrice(product: Product): number {
    return product.basePrice - (product.basePriceWithDiscount || 0);
  }

  isFilterSelected(label: string): boolean {
    return this.selectedFilters.some(filter => filter.label === label);
  }

  private lensModalInstance: any;

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

  openTryOn(): void {
    if (!this.supportsVirtualTryOn || this.isTryOnStarting) return;
    this.isTryOnOpen = true;
    this.tryOnError = '';
    if (!this.selectedVariant?.tryOnImage) {
      this.tryOnError = 'A transparent try-on image is not available for this frame color yet. The catalog photo includes its background and cannot be used as a clean overlay.';
      this.tryOnStatus = '';
      return;
    }
    this.tryOnStatus = 'Preparing your camera preview…';
    void this.startTryOn();
  }

  closeTryOn(): void {
    this.tryOnRequestId++;
    this.isTryOnOpen = false;
    this.isTryOnLoading = false;
    this.isTryOnStarting = false;
    this.tryOnError = '';
    this.tryOnStatus = '';
    this.stopCamera();
  }

  @HostListener('document:keydown.escape')
  onTryOnEscape(): void {
    if (this.isTryOnOpen) this.closeTryOn();
  }

  private async startTryOn(): Promise<void> {
    if (this.isTryOnStarting) return;

    const requestId = ++this.tryOnRequestId;
    this.isTryOnStarting = true;
    this.isTryOnLoading = true;
    this.tryOnError = '';

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera access is unavailable. Open this site over HTTPS in a supported browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (requestId !== this.tryOnRequestId) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      this.cameraStream = stream;
      await new Promise<void>(resolve => setTimeout(resolve, 0));

      const video = this.tryOnVideo?.nativeElement;
      const canvas = this.tryOnCanvas?.nativeElement;
      if (!this.selectedVariant?.tryOnImage) {
        throw new Error('A transparent try-on image is not available for this frame color yet.');
      }
      if (!video || !canvas) {
        throw new Error('The camera preview could not be initialized. Close it and try again.');
      }

      video.srcObject = stream;
      await video.play();
      if (requestId !== this.tryOnRequestId) return;

      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        await new Promise<void>(resolve => video.addEventListener('loadeddata', () => resolve(), { once: true }));
      }
      if (requestId !== this.tryOnRequestId) return;

      const [landmarker] = await Promise.all([
        this.faceLandmarker ?? this.createFaceLandmarker(),
        this.loadSelectedTryOnImage()
      ]);
      if (requestId !== this.tryOnRequestId) {
        if (landmarker !== this.faceLandmarker) landmarker.close();
        return;
      }
      this.faceLandmarker = landmarker;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      this.tryOnContext = canvas.getContext('2d');
      if (!this.tryOnContext) {
        throw new Error('Your browser could not create the virtual try-on preview.');
      }

      this.lastVideoTime = -1;
      this.tryOnStatus = 'Center your face in the frame to see the glasses.';
      this.isTryOnLoading = false;
      this.ngZone.runOutsideAngular(() => this.detectTryOnFrame());
    } catch (error: unknown) {
      if (requestId !== this.tryOnRequestId) return;
      this.stopCamera();
      this.tryOnError = this.getTryOnErrorMessage(error);
      this.tryOnStatus = '';
      this.isTryOnLoading = false;
      console.error('Virtual try-on could not be started.', error);
    } finally {
      if (requestId === this.tryOnRequestId) this.isTryOnStarting = false;
    }
  }

  private async createFaceLandmarker(): Promise<FaceLandmarker> {
    const { FaceLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');
    const visionFiles = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.2/wasm'
    );
    return FaceLandmarker.createFromOptions(visionFiles, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
      },
      runningMode: 'VIDEO',
      numFaces: 1,
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false
    });
  }

  private detectTryOnFrame(): void {
    const video = this.tryOnVideo?.nativeElement;
    const canvas = this.tryOnCanvas?.nativeElement;
    const context = this.tryOnContext;
    const landmarker = this.faceLandmarker;
    if (!this.isTryOnOpen || !video || !canvas || !context || !landmarker) return;

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && video.currentTime !== this.lastVideoTime) {
      this.lastVideoTime = video.currentTime;
      const result: FaceLandmarkerResult = landmarker.detectForVideo(video, performance.now());
      context.clearRect(0, 0, canvas.width, canvas.height);
      const face = result.faceLandmarks[0];
      if (face) {
        const selectedImageUrl = this.selectedVariant?.tryOnImage || '';
        if (this.tryOnProductImage?.complete && this.tryOnProductImageUrl === selectedImageUrl) {
          this.drawTryOnFrame(context, this.tryOnProductImage, face, canvas.width, canvas.height);
          this.setTryOnStatus('');
        } else if (selectedImageUrl) {
          this.setTryOnStatus('Loading the selected frame…');
          void this.loadSelectedTryOnImage().then(image => {
            if (this.selectedVariant?.tryOnImage === image.src) {
              this.tryOnProductImage = image;
              this.tryOnProductImageUrl = image.src;
              this.setTryOnStatus('Center your face in the frame to see the glasses.');
            }
          }).catch((error: unknown) => {
            this.ngZone.run(() => {
              this.tryOnError = 'The selected product image could not be loaded. Check your connection and try again.';
              this.tryOnStatus = '';
            });
            console.error('Virtual try-on could not load the selected product image.', error);
          });
        }
      } else {
        this.setTryOnStatus('Center your face in the frame to see the glasses.');
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.detectTryOnFrame());
  }

  private loadSelectedTryOnImage(): Promise<HTMLImageElement> {
    const imageUrl = this.selectedVariant?.tryOnImage || '';
    if (!imageUrl) return Promise.reject(new Error('A transparent try-on image is not available for this frame color yet.'));
    if (this.tryOnProductImageUrl === imageUrl && this.tryOnProductImage?.complete) {
      return Promise.resolve(this.tryOnProductImage);
    }
    if (this.tryOnProductImageLoadSource === imageUrl && this.tryOnProductImageLoad) {
      return this.tryOnProductImageLoad;
    }

    const image = new Image();
    image.decoding = 'async';
    image.src = imageUrl;
    const load = image.decode().then(() => {
      if (!image.naturalWidth || !image.naturalHeight) {
        throw new Error('The selected product image has no usable dimensions.');
      }
      if ((this.currentMainImage || this.selectedVariant?.images[0]) === imageUrl) {
        this.tryOnProductImage = image;
        this.tryOnProductImageUrl = imageUrl;
      }
      return image;
    }).catch((error: unknown) => {
      if (this.tryOnProductImageLoadSource === imageUrl) {
        this.tryOnProductImageLoadSource = '';
        this.tryOnProductImageLoad = null;
      }
      throw error;
    });
    this.tryOnProductImageLoadSource = imageUrl;
    this.tryOnProductImageLoad = load;
    return load;
  }

  private drawTryOnFrame(
    context: CanvasRenderingContext2D,
    productImage: HTMLImageElement,
    landmarks: NormalizedLandmark[],
    canvasWidth: number,
    canvasHeight: number
  ): void {
    const point = (index: number) => ({
      x: landmarks[index].x * canvasWidth,
      y: landmarks[index].y * canvasHeight
    });
    const midpoint = (first: { x: number; y: number }, second: { x: number; y: number }) => ({
      x: (first.x + second.x) / 2,
      y: (first.y + second.y) / 2
    });
    const eyes = [
      midpoint(point(33), point(133)),
      midpoint(point(362), point(263))
    ].sort((first, second) => first.x - second.x);
    const [leftEye, rightEye] = eyes;
    const center = midpoint(leftEye, rightEye);
    const eyeDistance = Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y);
    if (!Number.isFinite(eyeDistance) || eyeDistance < 1) return;

    const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
    const overlayWidth = eyeDistance * 2.35;
    const overlayHeight = overlayWidth * productImage.naturalHeight / productImage.naturalWidth;

    context.save();
    context.translate(center.x, center.y);
    context.rotate(angle);
    context.drawImage(
      productImage,
      -overlayWidth / 2,
      -overlayHeight / 2,
      overlayWidth,
      overlayHeight
    );
    context.restore();
  }
  private setTryOnStatus(status: string): void {
    if (this.tryOnStatus === status) return;
    this.ngZone.run(() => this.tryOnStatus = status);
  }

  private getTryOnErrorMessage(error: unknown): string {
    if (error instanceof DOMException) {
      if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
        return 'Camera permission was blocked. Allow camera access in your browser settings, then try again.';
      }
      if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        return 'No camera was found. Connect a camera and try again.';
      }
      if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        return 'Your camera is already in use by another app. Close it there and try again.';
      }
    }
    return error instanceof Error
      ? error.message
      : 'The virtual try-on could not start. Check your camera and network connection, then try again.';
  }

  private stopCamera(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.cameraStream?.getTracks().forEach(track => track.stop());
    this.cameraStream = null;
    const video = this.tryOnVideo?.nativeElement;
    if (video) video.srcObject = null;
    const canvas = this.tryOnCanvas?.nativeElement;
    if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    this.tryOnContext = null;
    this.lastVideoTime = -1;
  }

  ngOnDestroy(): void {
    this.closeTryOn();
    this.faceLandmarker?.close();
    this.faceLandmarker = null;
    this.pendingTimeouts.forEach(timeout => clearTimeout(timeout));
    this.pendingTimeouts.clear();
    if (this.imageLoadTimeout) {
      clearTimeout(this.imageLoadTimeout);
    }
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0';
    this.hideModal()
    this.sharedStateService.setDetailViewVisible(false)
  }

  resetSelections(): void {
    this.closeTryOn();
    this.selectedProduct = null;
    this.selectedVariant = null;
    this.selectedColor = null;
    this.currentMainImage = '';
    this.selectedQuantity = "Select Quantity";
    this.sharedStateService.setDetailViewVisible(false);
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
    this.discountPercent = this.calculateDiscountPercentage(product.basePrice, product.basePriceWithDiscount)
    this.updateAvailableColorsForProduct();
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
    if (this.selectedProduct) {
      this.discountPercent = this.calculateDiscountPercentage(
        this.selectedProduct.basePrice,
        this.selectedProduct.basePriceWithDiscount
      );
    }
  }

  private scheduleTimeout(callback: () => void, delay: number): void {
    let timeout: ReturnType<typeof setTimeout>;
    timeout = setTimeout(() => {
      this.pendingTimeouts.delete(timeout);
      callback();
    }, delay);
    this.pendingTimeouts.add(timeout);
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

  onImageLoaded(product: Product): void {
    const variant = product.variants[0];
    if (variant) {
      variant.imagesLoaded = true;
    }
  }

  onProductImageError(product: Product): void {
    const imageUrl = product.variants[0]?.images[0];
    if (imageUrl) {
      this.failedImageUrls.add(imageUrl);
      product.variants[0].imagesLoaded = true;
    }
  }

  trackByProductId(_index: number, product: Product): string {
    return product.id;
  }

  goBack() {
    this.router.navigateByUrl('/')
  }

  sortProducts(sortOption: string): void {
    if (sortOption === 'lowToHigh') {
      this.filteredProducts = [...this.filteredProducts].sort(
        (a, b) => this.getDiscountedPrice(a) - this.getDiscountedPrice(b)
      );
    } else if (sortOption === 'highToLow') {
      this.filteredProducts = [...this.filteredProducts].sort(
        (a, b) => this.getDiscountedPrice(b) - this.getDiscountedPrice(a)
      );
    }
  }

  filterByColor(colorName: string) {
    this.toggleFilterSelection(colorName, colorName);
  }

  filterByPrice(priceRange: any) {
    this.toggleFilterSelection(priceRange.label, priceRange);
  }

  filterByRating(rating: number) {
    this.toggleFilterSelection(`${rating} ★ & Up`, rating);
  }

  filterByDiscount(discount: number) {
    this.toggleFilterSelection(`${discount}% or more`, discount);
  }

  private toggleFilterSelection(label: string, value: any): void {
    if (this.isFilterSelected(label)) {
      this.selectedFilters = this.selectedFilters.filter(filter => filter.label !== label);
    } else {
      this.selectedFilters.push({ label, value });
    }
  }

  removeFilter(filter: { label: string, value: any }) {
    this.selectedFilters = this.selectedFilters.filter(f => f.label !== filter.label);
  }

  resetFilters() {
    this.selectedFilters = [];
    this.selectedSort = '';
    this.filteredProducts = this.getBaseProducts();
    this.searchResultMessage = this.isAllProductsView
      ? 'Showing all available products'
      : '';
    this.toggleFilterPanel();
  }

  applyFilters() {
    this.uiService.showLoading();
    let filtered = this.getBaseProducts();
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
          this.getDiscountedPrice(product) >= range.min && this.getDiscountedPrice(product) <= range.max
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
          product.basePrice > 0 &&
          Math.round((product.basePriceWithDiscount / product.basePrice) * 100) >= discount
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
      this.scheduleTimeout(() => {
        this.router.navigate(['/auth']);
      }, 3000);
    } else if (!user.address || Object.keys(user.address).length === 0) {
      // If user is logged in but address not filled properly
      const button = document.querySelector('.customBtn') as HTMLElement;
      this.uiService.showToast('OOPS!', 'Address details are missing. Redirecting to Account Page...')

      this.scheduleTimeout(() => {
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
    if (!this.selectedProduct || !this.selectedVariant || !this.selectedVariant.inStock) return;
    const price = this.getDiscountedPrice(this.selectedProduct);
    const productData = {
      name: this.selectedProduct.name,
      variant: this.selectedVariant.color,
      quantity: 1,
      price,
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
    this.scheduleTimeout(() => {
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
        this.razorpayService.openCheckout(options).then(() => {
          this.uiService.hideLoading();
        }).catch(error => {
          this.uiService.hideLoading();
          this.uiService.showToast('Payment unavailable', 'Unable to open the payment gateway. Please try again.');
          console.error('Unable to open Razorpay checkout', error);
        });

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
