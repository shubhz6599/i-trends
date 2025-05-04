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
      'https://static.vecteezy.com/system/resources/thumbnails/045/948/372/small_2x/modern-eyeglasses-isolated-on-background-png.png',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainAssets%2F0a83f3d6-5867-46ae-826e-e81163baa977_removalai_preview.png?alt=media&token=351ee7a3-ef6e-45ff-a614-fd19ebaf8a1c',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainAssets%2FGanesh.png?alt=media&token=7fdf2e4e-863c-4c4b-b28d-690b58bf669c',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainAssets%2Fframe%209.jpg?alt=media&token=54bb2db0-bf90-4cdd-a681-959fc750f069',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainAssets%2Fframe%202.jpg?alt=media&token=afc2347e-7622-4cf6-89ba-104d9c7adc63',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainAssets%2Fframe%2010.jpg?alt=media&token=6f9cb2ff-83c9-4d73-9f64-15b7b4315d7a',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainAssets%2Fframe.jpg?alt=media&token=65c0e5ce-e172-4264-b5b9-ca4079b326f9',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainAssets%2Fframe%2011%20(1).jpg?alt=media&token=d693cda1-d417-411e-98e1-bd6e3f6ad282',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainAssets%2Fframe%204.jpg?alt=media&token=4073306b-8f97-454b-bd8e-b78c0d714ea7',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Metal%2FCompressed%20Rounded%2FDSC_0094.jpg?alt=media&token=6695b486-bdab-47cd-8c37-473f881a6133',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Metal%2FCompressed%20Rounded%2FDSC_0095.jpg?alt=media&token=f04febbe-c9b8-4436-8b28-ee5c3bdee02a',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Squares%2FDSC_0220.jpg?alt=media&token=00ebfdde-649e-4cd3-a770-765f848f6226',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Squares%2FDSC_0221.jpg?alt=media&token=e3f217ce-0c5b-4a6d-8119-dfafb5ec1e51',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%2012X%20Square%2FDSC_0295.jpg?alt=media&token=47c407d3-8e3a-4ca7-ac02-c7f21aefddc9',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%2012X%20Square%2FDSC_0296.jpg?alt=media&token=0f4b0c70-ce61-4ef1-b087-2da200a62a69',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Rim%20less%2FCompressed%20Hexagonal%2FDSC_0380.jpg?alt=media&token=625cc6dc-1ef4-4afd-88e9-1776e3990d63',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Rim%20less%2FCompressed%20Hexagonal%2FDSC_0383.jpg?alt=media&token=07c4e18f-8c77-4013-8875-cfa76138ee0a',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Rounded%2FDSC_0320.jpg?alt=media&token=c2c885d8-c94f-4e04-8591-d8f2552ccbae',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Rounded%2FDSC_0321.jpg?alt=media&token=efa42e64-a74b-424c-a2b1-6af3cb70cf9a',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Husler%2FDSC_0252.jpg?alt=media&token=e964ba07-a517-4725-b75d-b4f8f36518e1',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Husler%2FDSC_0253.jpg?alt=media&token=01f5a896-58fc-486c-8fd2-1a1e48d25f22',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Unisex%20Sunglasses%2FDSC_0434.jpg?alt=media&token=a9e2d78b-9a19-445c-93b5-4aac86f6d5be',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Unisex%20Sunglasses%2FDSC_0435.jpg?alt=media&token=ed27d3cd-f256-44e1-864c-8f8177cdbfc2',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Kids%20Sunglasses%2FDSC_0457.jpg?alt=media&token=d4aab688-f75e-462e-b46e-5dfe9a2afbdd',
      'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Kids%20Sunglasses%2FDSC_0458.jpg?alt=media&token=56b79658-ff7f-43fd-bf60-debf9ec1f054'
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
    this.preloadImagesInParallel();
  }

  // NEW: Preload all products regardless of category
  preloadAllProductsImages(): void {
    this.stopPreloading();
    const allProducts = productsData.categories.flatMap(category => category.products);
    const imageUrls = this.collectProductImages(allProducts);
    this.currentBatch = imageUrls;
    this.preloadImagesInParallel();
  }
  private collectProductImages(products: any[]): string[] {
    const imageUrls: string[] = [];
    products.forEach((product) => {
      product.variants.forEach((variant: any) => {
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
    this.preloadImagesInParallel(); // Start fetching images one by one
  }

  // Preload images sequentially (one image at a time)
  private preloadImagesInParallel(): void {
    this.currentBatch.forEach((url) => {
      if (!this.imageCache.has(url)) {
        const img = new Image();
        img.src = url;
        this.imageCache.set(url, img);
      }
    });
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
