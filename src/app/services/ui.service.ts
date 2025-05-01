import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private toastSubject = new BehaviorSubject<{ show: boolean, title?: string, message?: string }>({ show: false });
  toast$ = this.toastSubject.asObservable();

  showLoading() {
    this.loadingSubject.next(true);
  }

  hideLoading() {
    this.loadingSubject.next(false);
  }

  showToast(title: string, message: string) {
    this.toastSubject.next({ show: true, title, message });
    setTimeout(() => this.toastSubject.next({ show: false }), 3000); // Auto-hide after 3s
  }

  hideToast() {
    this.toastSubject.next({ show: false });
  }
}
