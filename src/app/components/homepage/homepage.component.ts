import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { SharedStateService } from 'src/app/services/shared-state.service';

@Component({
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  images = [
    {
     front: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Metal%2FCompressed%20Rounded%2FDSC_0094.jpg?alt=media&token=6695b486-bdab-47cd-8c37-473f881a6133',
      back: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Metal%2FCompressed%20Rounded%2FDSC_0095.jpg?alt=media&token=f04febbe-c9b8-4436-8b28-ee5c3bdee02a',
      title: 'Metal Frames',
      category: 'Metal Frames',
      loaded: false, // Placeholder visibility
      frontLoaded: false,
      backLoaded: false,
    },
    {
      front: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Squares%2FDSC_0220.jpg?alt=media&token=00ebfdde-649e-4cd3-a770-765f848f6226',
      back: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Squares%2FDSC_0221.jpg?alt=media&token=e3f217ce-0c5b-4a6d-8119-dfafb5ec1e51',
      title: 'Square Frames',
      category: 'Square',
      loaded: false, // Placeholder visibility
      frontLoaded: false,
      backLoaded: false,
    },
    {
      front: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%2012X%20Square%2FDSC_0295.jpg?alt=media&token=47c407d3-8e3a-4ca7-ac02-c7f21aefddc9',
      back: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%2012X%20Square%2FDSC_0296.jpg?alt=media&token=0f4b0c70-ce61-4ef1-b087-2da200a62a69',
      title: '12X Square Frames',
      category: '12X Square Frames',
      loaded: false, // Placeholder visibility
      frontLoaded: false,
      backLoaded: false,
    },
    {
      front: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Rim%20less%2FCompressed%20Hexagonal%2FDSC_0380.jpg?alt=media&token=625cc6dc-1ef4-4afd-88e9-1776e3990d63',
      back: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Rim%20less%2FCompressed%20Hexagonal%2FDSC_0383.jpg?alt=media&token=07c4e18f-8c77-4013-8875-cfa76138ee0a',
      title: 'Rim Less Frames',
      category: 'Rim Less Frames',
      loaded: false, // Placeholder visibility
      frontLoaded: false,
      backLoaded: false,
    },
    {
      front: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Rounded%2FDSC_0320.jpg?alt=media&token=c2c885d8-c94f-4e04-8591-d8f2552ccbae',
      back: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Rounded%2FDSC_0321.jpg?alt=media&token=efa42e64-a74b-424c-a2b1-6af3cb70cf9a',
      title: 'Rounded Frames',
      category: 'Rounded Frames',
      loaded: false, // Placeholder visibility
      frontLoaded: false,
      backLoaded: false,
    },
    {
      front: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Husler%2FDSC_0252.jpg?alt=media&token=e964ba07-a517-4725-b75d-b4f8f36518e1',
      back: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Husler%2FDSC_0253.jpg?alt=media&token=01f5a896-58fc-486c-8fd2-1a1e48d25f22',
      title: 'Husler Frames ',
      category: 'Husler Frames',
      loaded: false, // Placeholder visibility
      frontLoaded: false,
      backLoaded: false,
    },
    {
      front: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Unisex%20Sunglasses%2FDSC_0434.jpg?alt=media&token=a9e2d78b-9a19-445c-93b5-4aac86f6d5be',
      back: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Unisex%20Sunglasses%2FDSC_0435.jpg?alt=media&token=ed27d3cd-f256-44e1-864c-8f8177cdbfc2',
      title: 'Unisex Sunglasses',
      category: 'Unisex Sunglasses',
      loaded: false, // Placeholder visibility
      frontLoaded: false,
      backLoaded: false,
    },
    {
      front: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Kids%20Sunglasses%2FDSC_0457.jpg?alt=media&token=d4aab688-f75e-462e-b46e-5dfe9a2afbdd',
      back: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Compressed%20Kids%20Sunglasses%2FDSC_0458.jpg?alt=media&token=56b79658-ff7f-43fd-bf60-debf9ec1f054',
      title: 'Kids Sunglasses & Frames',
      category: 'Kids Sunglasses & Frames',
      loaded: false, // Placeholder visibility
      frontLoaded: false,
      backLoaded: false,
    },
    {
      front: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Cat%20Eye%2FDSC_0504.jpg?alt=media&token=63d871aa-a376-46e3-a09e-196315db54ad',
      back: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Cat%20Eye%2FDSC_0497.jpg?alt=media&token=ac0bedbc-b243-427b-a25f-49cb6ac270fd',
      title: 'Cat Eye Frames',
      category: 'Cat Eye Frames',
      loaded: false, // Placeholder visibility
      frontLoaded: false,
      backLoaded: false,
    },
    {
      front: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Lenses%2FCJVAWD86_1_lar_1.webp?alt=media&token=ba134290-515b-4355-a4c5-a0c6ba1fbd58',
      back: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Lenses%2Fcbicwc86_iconnect-pack-shot_2_8.webp?alt=media&token=c7e02074-27e8-445a-a7ca-bc315b3e8e1e',
      title: 'Contact Lenses',
      category: 'Contact Lenses',
      loaded: false, // Placeholder visibility
      frontLoaded: false,
      backLoaded: false,
    },
    {
      front: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Sports%20%26%20Swimming%2FSoccer-Football-Prescription-Sports-Glasses.jpeg?alt=media&token=faeaf302-75f2-43db-ae27-2259c945b054',
      back: 'https://firebasestorage.googleapis.com/v0/b/i-trends-85dd4.firebasestorage.app/o/Sports%20%26%20Swimming%2F514CmWROAyL._AC_UY1100_FMwebp_.webp?alt=media&token=79dfbee3-d46f-4314-9191-6e81a54d5efc',
      title: 'Unisex Sports & Swimming',
      category: 'Unisex Sports & Swimming',
      loaded: false, // Placeholder visibility
      frontLoaded: false,
      backLoaded: false,
    }

  ].map(image => ({
    ...image,
    imageWidth: image.title === 'Contact Lenses' ? 1094 : image.title === 'Unisex Sports & Swimming' ? 800 : 1200,
    imageHeight: image.title === 'Contact Lenses' ? 616 : image.title === 'Unisex Sports & Swimming' ? 800 : 800
  }));
  featuredStyles = [
    {
      title: 'Modern square',
      description: 'A confident shape made for everyday.',
      image: this.images[1].front,
      category: 'Square'
    },
    {
      title: 'Easygoing round',
      description: 'A softer silhouette with plenty of character.',
      image: this.images[4].front,
      category: 'Rounded Frames'
    },
    {
      title: 'A little extra character',
      description: 'A distinctive frame made to stand out.',
      image: this.images[5].front,
      category: 'Husler Frames'
    },
    {
      title: 'A little cat-eye charm',
      description: 'A lifted silhouette with a point of view.',
      image: this.images[8].front,
      category: 'Cat Eye Frames'
    },
    {
      title: 'Made for little adventures',
      description: 'Comfortable frames for curious young eyes.',
      image: this.images[7].front,
      category: 'Kids Sunglasses & Frames'
    },
    {
      title: 'Made to move',
      description: 'Comfort-first frames for days in motion.',
      image: this.images[10].front,
      category: 'Unisex Sports & Swimming'
    }
  ];
  motionCards = [
    {
      eyebrow: 'EVERYDAY ICON',
      title: 'The frame that feels like you',
      description: 'Lightweight specs, ready to go wherever the day takes you.',
      image: this.images[0].front,
      imageAlt: 'Lightweight metal eyeglass frames',
      imageWidth: 1200,
      imageHeight: 800,
      category: 'Metal Frames',
      action: 'Explore eyeglasses'
    },
    {
      eyebrow: 'SUN ON YOUR SIDE',
      title: 'Make room for brighter days',
      description: 'Find sunglasses that bring a little more style outdoors.',
      image: this.images[6].front,
      imageAlt: 'Unisex sunglasses',
      imageWidth: 1200,
      imageHeight: 800,
      category: 'Unisex Sunglasses',
      action: 'Explore sunglasses'
    },
    {
      eyebrow: 'A CLEARER ROUTINE',
      title: 'Comfort in every blink',
      description: 'Discover contact lenses for a simple, comfortable view.',
      image: this.images[9].front,
      imageAlt: 'Contact lens product',
      imageWidth: 1094,
      imageHeight: 616,
      category: 'Contact Lenses',
      action: 'Explore contact lenses'
    }
  ];
  spotlightCards = [
    {
      eyebrow: 'A SHAPE WITH PRESENCE',
      title: 'Think outside the square.',
      description: 'A confident oversized silhouette with room for personality.',
      image: this.images[2].front,
      imageAlt: 'Oversized square eyeglass frames',
      imageWidth: 1200,
      imageHeight: 800,
      category: '12X Square Frames',
      action: 'Explore 12X square'
    },
    {
      eyebrow: 'BARELY-THERE COMFORT',
      title: 'A lighter way to see.',
      description: 'Refined rimless frames that keep the focus on you.',
      image: this.images[3].front,
      imageAlt: 'Lightweight rimless eyeglass frames',
      imageWidth: 1200,
      imageHeight: 800,
      category: 'Rim Less Frames',
      action: 'Explore rimless frames'
    }
  ];
  searchQuery: string = '';
  constructor(private router: Router, private sharedStateService: SharedStateService) { }

  ngOnInit(): void {
    this.sharedStateService.setDetailViewVisible(false);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate([`category/all-products/${this.searchQuery}`], {
        queryParams: { query: this.searchQuery },
      });
    }
  }

  navigate(categoryId: string): void {
    if(categoryId !== 'Contact Lenses'){
      this.router.navigateByUrl(`category/${categoryId}`); // Redirect to specific category
    }else{
      this.router.navigateByUrl(`/contact-lenses`); // Redirect to specific category

    }
  }


  navigateToStoreLocation(): void {
    const googleMapsLink = 'https://www.google.com/maps/dir//Shop+No+3,+Ground+floor,+i-trends,+Sr.+No+296,+Porwal+Rd,+near+DY+Patil+University+Road,+Lohegaon,+Pune,+Maharashtra+411047/@18.6141551,73.9071623,17z/data=!4m9!4m8!1m0!1m5!1m1!1s0x3bc2c700594eff49:0x4978255b63aab10e!2m2!1d73.9120332!2d18.6141552!3e0?entry=ttu&g_ep=EgoyMDI1MDQwOC4wIKXMDSoASAFQAw%3D%3D';
    window.open(googleMapsLink, '_blank'); // Opens the link in a new tab
  }

}
