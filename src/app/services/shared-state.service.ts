import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedStateService {
  private isDetailViewVisible = new BehaviorSubject<boolean>(false);
  isDetailViewVisible$ = this.isDetailViewVisible.asObservable();

  setDetailViewVisible(visible: boolean): void {
    this.isDetailViewVisible.next(visible);
  }
}
