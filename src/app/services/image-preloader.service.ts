import { Injectable } from '@angular/core';
import productsData from '../../assets/Json/products.json';

@Injectable({
  providedIn: 'root',
})
export class ImagePreloaderService {
  public imageCache: Map<string, HTMLImageElement> = new Map(); // Cache for preloaded images
  private currentBatch: string[] = []; // Current active batch
  private isPreloading: boolean = false; // Flag to track preloading state

  constructor() { }

  // Lazy load homepage images
  lazyLoadHomePageImages(): void {
    const homepageImages = [
      // Add all homepage-specific image URLs here
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainAssets%2FitrendsLogo.png?alt=media&token=827321c7-4251-42c3-8a0f-8e3d3481a453',
      'https://static.vecteezy.com/system/resources/thumbnails/045/948/372/small_2x/modern-eyeglasses-isolated-on-background-png.png',
      'https://static.vecteezy.com/system/resources/thumbnails/049/589/946/small_2x/man-adjusting-his-glasses-focusing-intently-on-his-task-png.png',
      'https://srmglobalhospitals.com/wp-content/uploads/2023/12/Dr.-Venkatesan.png',
      'https://static1.lenskart.com/media/desktop/img/Oct22/kiara/Refresh-Banner-Web.gif',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainAssets%2Feyeglasses-wear-VEED.gif?alt=media&token=8e740f32-7434-4ca6-afdf-8244f1135d72',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainFrames%2FSquareMain.jpg?alt=media&token=4c5f425b-103f-4669-8864-c2b4a86ff870',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainFrames%2FSquareMain2.jpg?alt=media&token=ebe68f96-cc01-48df-ac16-b4c266a242d7',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainFrames%2FSquareMain12X.jpg?alt=media&token=9fd9c3ea-b95b-459a-a254-5525b6718a0e',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainFrames%2FSquareMain12X2.jpg?alt=media&token=39fe9500-1dd5-40d6-9bd0-e8d8ce05156b',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainFrames%2FRimless.jpg?alt=media&token=fa26679b-febc-4c46-affe-b98fc22296a3',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainFrames%2FRimless2.jpg?alt=media&token=2569f6bc-03d1-4ea8-b01c-b034be9e95b1',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainFrames%2FRounded.jpg?alt=media&token=b6dc8604-4da4-4ad5-86d5-b58a45628d52',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainFrames%2FRounded2.jpg?alt=media&token=e68216e4-2286-48d6-9672-ca30f1b0db89',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainFrames%2FHuslr.jpg?alt=media&token=fffacfee-42a4-4b5a-992a-3e9063706d67',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainFrames%2FHuslr2.jpg?alt=media&token=6bb29f8c-57bd-42d2-9f1c-57fc677f265c',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainFrames%2FUnisex.jpg?alt=media&token=ec671f5d-765b-49c8-a8c1-e42ef882aa1f',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainFrames%2FUnisex2.jpg?alt=media&token=adcaa9ae-7427-4130-9ba6-7e4cd110ea1f',
      'https://static1.lenskart.com/media/desktop/img/Oct22/nyfw/web%20banner.gif',
      'https://static1.lenskart.com/media/desktop/img/Nov20/25-Nov/Banner03_TileDesktop.jpg',
      'https://static1.lenskart.com/media/desktop/img/Aug21/Desktop/ce-square.jpg',
      'https://static1.lenskart.com/media/desktop/img/May22/ojos-web.jpg',
      'https://static1.lenskart.com/media/desktop/img/Aug21/Desktop/VC-Banner.jpg',
      'https://static1.lenskart.com/media/desktop/img/Aug21/25-Aug/LK-AIR-Banner.jpg',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Kids%20Sunglasses%2FDSC_0457.jpg?alt=media&token=1db700db-c21f-4682-9e67-64a8b76301f5',
      'http://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Kids%20Sunglasses%2FDSC_0458.jpg?alt=media&token=ce288b72-b9d0-4774-87b2-6d9d628f1aeb',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Squares%2FDSC_0232.jpg?alt=media&token=64925148-c94f-4668-83e3-9cf61a9bb40d',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Squares%2FDSC_0233.jpg?alt=media&token=bdbd701c-a618-4273-b467-9c8f1209c870'

      // Add other homepage images as required
    ];

    homepageImages.forEach((url) => {
      if (!this.imageCache.has(url)) {
        const img = new Image();


        img.src = url; // Trigger image loading
        this.imageCache.set(url, img); // Cache the image
      }
    });
  }

  preloadBumperDiscountImages(): void {
    this.stopPreloading();
    const bumperProducts = productsData.categories
      .flatMap(category => category.products)
      .filter(product => product.bumperdiscount);
    const imageUrls = this.collectProductImages(bumperProducts);
    this.currentBatch = imageUrls;
    this.preloadImagesSequentially();
  }

  // NEW: Preload all products regardless of category
  preloadAllProductsImages(): void {
    this.stopPreloading();
    const allProducts = productsData.categories.flatMap(category => category.products);
    const imageUrls = this.collectProductImages(allProducts);
    this.currentBatch = imageUrls;
    this.preloadImagesSequentially();
  }
  private collectProductImages(products: any[]): string[] {
    const imageUrls: string[] = [];
    products.forEach((product) => {
      product.variants.forEach((variant:any) => {
        imageUrls.push(...variant.images);
      });
    });
    return imageUrls;
  }

  // Preload category-specific images dynamically
  preloadCategoryImages(categoryId: string): void {
    const category = productsData.categories.find((cat) => cat.id === categoryId);
    if (!category) return;

    this.stopPreloading(); // Stop any existing preloading

    const imageUrls: string[] = [];
    category.products.forEach((product) => {
      product.variants.forEach((variant) => {
        imageUrls.push(...variant.images); // Collect all images from variants
      });
    });

    this.currentBatch = imageUrls; // Set the new batch
    this.preloadImagesSequentially(); // Start fetching images one by one
  }

  // Preload images sequentially (one image at a time)
  private preloadImagesSequentially(): void {
    let index = 0;

    const loadNextImage = () => {
      if (index >= this.currentBatch.length || !this.isPreloading) return; // Stop if preloading is canceled

      const url = this.currentBatch[index];
      if (!this.imageCache.has(url)) {
        const img = new Image();
        img.src = url; // Trigger image loading
        img.onload = () => {
          this.imageCache.set(url, img); // Cache the loaded image
          index++;
          loadNextImage(); // Fetch the next image
        };
      } else {
        index++;
        loadNextImage(); // Skip already cached images
      }
    };

    this.isPreloading = true; // Start preloading
    loadNextImage();
  }

  // Preload images for other categories in the background
  preloadAllCategories(): void {
    const categories = productsData.categories;

    categories.forEach((category) => {
      const imageUrls: string[] = [];
      category.products.forEach((product) => {
        product.variants.forEach((variant) => {
          imageUrls.push(...variant.images);
        });
      });

      // Load images sequentially for each category
      imageUrls.forEach((url) => {
        if (!this.imageCache.has(url)) {
          const img = new Image();
          img.src = url; // Trigger image loading
          this.imageCache.set(url, img); // Cache the loaded image
        }
      });
    });
  }


  getCategoryImages(categoryId: string): string[] {
    const category = productsData.categories.find((cat) => cat.id === categoryId);
    if (!category) return [];

    const imageUrls: string[] = [];
    category.products.forEach((product) => {
      product.variants.forEach((variant) => {
        imageUrls.push(...variant.images);
      });
    });

    return imageUrls.filter((url) => this.imageCache.has(url)); // Return only cached images
  }

  // Stop preloading
  stopPreloading(): void {
    this.isPreloading = false;
  }
  isImageLoaded(url: string): boolean {
    if (this.imageCache.has(url)) {
      const img = this.imageCache.get(url);
      return img?.complete ?? false;
    }
    return false;
  }
}
