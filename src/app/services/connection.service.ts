// connection.service.ts
import { Injectable, EventEmitter } from '@angular/core';
import { fromEvent, merge, of, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private onlineEvent$: Observable<Event>;
  private offlineEvent$: Observable<Event>;
  public connectionStatus$: Observable<boolean>;
  public showOfflinePage = new EventEmitter<boolean>();

  constructor() {
    this.onlineEvent$ = fromEvent(window, 'online');
    this.offlineEvent$ = fromEvent(window, 'offline');

    this.connectionStatus$ = merge(
      of(navigator.onLine),
      this.onlineEvent$.pipe(map(() => true)),
      this.offlineEvent$.pipe(map(() => false))
    );

    // Initialize the service
    this.initConnectionMonitoring();
  }

  private initConnectionMonitoring() {
    this.connectionStatus$.subscribe(isOnline => {
      if (!isOnline) {
        this.showOfflinePage.emit(true);
      } else {
        this.showOfflinePage.emit(false);
      }
    });
  }

  public get isOnline(): boolean {
    return navigator.onLine;
  }
}
