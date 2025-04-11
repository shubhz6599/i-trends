import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImagePreloaderService } from 'src/app/services/image-preloader.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit, AfterViewInit {
  isMenuOpen = false; // State to track menu visibility
  isLoading = true; // State to track image loading for placeholders
  imagesLoaded = 0;
  totalImages = 2;
  private navLinks!: HTMLElement;
  private scrollLeftBtn!: HTMLElement;
  private scrollRightBtn!: HTMLElement;
  images = [
    {
      front: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Squares%2FDSC_0220.jpg?alt=media&token=89e9d23f-bc48-4121-8f07-1d7597f35fbd',
      back: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Squares%2FDSC_0221.jpg?alt=media&token=340515a4-4bf3-46ef-95db-6da4312afd46',
      title: 'Square Frames',
      category: 'Square',
      loaded: false, // Placeholder visibility
      frontLoaded: false,
      backLoaded: false,
    },
    {
      front: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainFrames%2FSquareMain12X.jpg?alt=media&token=9fd9c3ea-b95b-459a-a254-5525b6718a0e',
      back: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainFrames%2FSquareMain12X2.jpg?alt=media&token=39fe9500-1dd5-40d6-9bd0-e8d8ce05156b',
      title: '12X Square Frames',
      category: '12X Square Frames',
      loaded: false, // Placeholder visibility
      frontLoaded: false,
      backLoaded: false,
    },
    {
      front: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainFrames%2FRimless.jpg?alt=media&token=fa26679b-febc-4c46-affe-b98fc22296a3',
      back: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainFrames%2FRimless2.jpg?alt=media&token=2569f6bc-03d1-4ea8-b01c-b034be9e95b1',
      title: 'Rim Less Frames',
      category: 'Rim Less Frames',
      loaded: false, // Placeholder visibility
      frontLoaded: false,
      backLoaded: false,
    },
    {
      front: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainFrames%2FRounded.jpg?alt=media&token=b6dc8604-4da4-4ad5-86d5-b58a45628d52',
      back: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainFrames%2FRounded2.jpg?alt=media&token=e68216e4-2286-48d6-9672-ca30f1b0db89',
      title: 'Rounded Frames',
      category: 'Rounded Frames',
      loaded: false, // Placeholder visibility
      frontLoaded: false,
      backLoaded: false,
    },
    {
      front: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainFrames%2FHuslr.jpg?alt=media&token=fffacfee-42a4-4b5a-992a-3e9063706d67',
      back: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainFrames%2FHuslr2.jpg?alt=media&token=6bb29f8c-57bd-42d2-9f1c-57fc677f265c',
      title: 'Husler Frames ',
      category: 'Husler Frames',
      loaded: false, // Placeholder visibility
      frontLoaded: false,
      backLoaded: false,
    },
    {
      front: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainFrames%2FUnisex.jpg?alt=media&token=ec671f5d-765b-49c8-a8c1-e42ef882aa1f',
      back: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/MainFrames%2FUnisex2.jpg?alt=media&token=adcaa9ae-7427-4130-9ba6-7e4cd110ea1f',
      title: 'Unisex Sunglasses',
      category: 'Unisex Sunglasses',
      loaded: false, // Placeholder visibility
      frontLoaded: false,
      backLoaded: false,
    },
  ];
  constructor(private router: Router, private imagePreloader: ImagePreloaderService, private ngZone: NgZone, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.imagePreloader.lazyLoadHomePageImages();

    // this.imagePreloader.preloadCategoryImages('Square');


    // this.checkImageCache();
  }

  ngAfterViewInit(): void {
    this.observeCards();
    this.initImageFlipper();
    this.navLinks = document.querySelector('.nav-links') as HTMLElement;
    this.scrollLeftBtn = document.querySelector('.scroll-left') as HTMLElement;
    this.scrollRightBtn = document.querySelector('.scroll-right') as HTMLElement;

    if (this.navLinks) {
      this.setupScrollButtons();
      // Initial check
      setTimeout(() => this.checkScrollPosition(), 100);
    }
  }
  private setupScrollButtons() {
    // Check on scroll
    this.navLinks.addEventListener('scroll', () => this.checkScrollPosition());

    // Button click handlers
    if (this.scrollLeftBtn) {
      this.scrollLeftBtn.addEventListener('click', () => {
        this.navLinks.scrollBy({ left: -200, behavior: 'smooth' });
      });
    }

    if (this.scrollRightBtn) {
      this.scrollRightBtn.addEventListener('click', () => {
        this.navLinks.scrollBy({ left: 200, behavior: 'smooth' });
      });
    }
  }

  private checkScrollPosition() {
    const { scrollLeft, scrollWidth, clientWidth } = this.navLinks;
    const atStart = scrollLeft <= 0;
    const atEnd = scrollLeft >= scrollWidth - clientWidth - 1;

    if (this.scrollLeftBtn) {
      atStart ? this.scrollLeftBtn.classList.remove('active')
        : this.scrollLeftBtn.classList.add('active');
    }

    if (this.scrollRightBtn) {
      atEnd ? this.scrollRightBtn.classList.remove('active')
        : this.scrollRightBtn.classList.add('active');
    }
  }



  navigate(categoryId: string): void {
    this.imagePreloader.preloadCategoryImages(categoryId); // Preload selected category images
    this.router.navigateByUrl(`category/${categoryId}`); // Redirect to specific category
  }


  onImageLoaded(index: number, side: 'front' | 'back'): void {

    this.ngZone.run(() => {
      const image = this.images[index];

      if (side === 'front') {
        image.frontLoaded = true;
      } else {
        image.backLoaded = true;
      }

      // Check if both images are loaded
      if (image.frontLoaded && image.backLoaded) {
        image.loaded = true;
      }
    });
    this.cdr.detectChanges()
  }

  initImageFlipper() {
    const flippers = document.querySelectorAll('.image-flipper');

    Array.from(flippers).forEach((flipper: Element) => {
      const images = flipper.querySelectorAll('.flipper-image');
      if (images.length !== 2) return; // Ensure we have exactly 2 images

      const frontImg = images[0] as HTMLElement;
      const backImg = images[1] as HTMLElement;
      let showFront = true;

      setInterval(() => {
        if (showFront) {
          frontImg.style.opacity = '0';
          backImg.style.opacity = '1';
        } else {
          frontImg.style.opacity = '1';
          backImg.style.opacity = '0';
        }
        showFront = !showFront;
      }, 1000);
    });
  }

  observeCards(): void {
    const cards = document.querySelectorAll('.hover-trigger');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('hover-trigger-active');
          } else {
            entry.target.classList.remove('hover-trigger-active');
          }
        });
      },
      {
        threshold: 0.5, // Adjust this value to control when the effect triggers
      }
    );

    cards.forEach((card) => {
      observer.observe(card);
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  navigateToStoreLocation(): void {
    const googleMapsLink = 'https://www.google.com/maps/dir//Shop+No+3,+Ground+floor,+i-trends,+Sr.+No+296,+Porwal+Rd,+near+DY+Patil+University+Road,+Lohegaon,+Pune,+Maharashtra+411047/@18.6141551,73.9071623,17z/data=!4m9!4m8!1m0!1m5!1m1!1s0x3bc2c700594eff49:0x4978255b63aab10e!2m2!1d73.9120332!2d18.6141552!3e0?entry=ttu&g_ep=EgoyMDI1MDQwOC4wIKXMDSoASAFQAw%3D%3D';
    window.open(googleMapsLink, '_blank'); // Opens the link in a new tab
  }
  scrollToCategory() {
    const categorySection = document.querySelector('.cart');
    if (categorySection) {
      categorySection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}
