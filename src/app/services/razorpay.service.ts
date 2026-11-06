import { Injectable } from '@angular/core';

type RazorpayOptions = Record<string, unknown>;

interface RazorpayInstance {
  open(): void;
}

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

@Injectable({ providedIn: 'root' })
export class RazorpayService {
  private scriptPromise?: Promise<void>;

  async openCheckout(options: RazorpayOptions): Promise<void> {
    await this.loadScript();
    const Razorpay = window.Razorpay;
    if (!Razorpay) {
      throw new Error('Razorpay checkout did not initialize.');
    }

    new Razorpay(options).open();
  }

  private loadScript(): Promise<void> {
    if (window.Razorpay) {
      return Promise.resolve();
    }
    if (this.scriptPromise) {
      return this.scriptPromise;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    this.scriptPromise = new Promise<void>((resolve, reject) => {
      script.addEventListener('load', () => {
        if (window.Razorpay) {
          resolve();
        } else {
          reject(new Error('Razorpay checkout loaded without initializing.'));
        }
      }, { once: true });
      script.addEventListener('error', () => reject(new Error('Unable to load Razorpay checkout.')), { once: true });
      document.head.appendChild(script);
    }).catch(error => {
      script.remove();
      this.scriptPromise = undefined;
      throw error;
    });

    return this.scriptPromise;
  }
}
