import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ConnectionService } from './services/connection.service';
import { OfflinePageComponent } from './components/offline-page/offline-page.component';

@Component({
  standalone: true,
  imports: [CommonModule, OfflinePageComponent, RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'opticalApp';
  showOfflinePage = false;
  constructor(private router: Router, private connectionService: ConnectionService) { }

  ngOnInit(): void {
    // this.checkViewportSize();
    // localStorage.clear();
    this.connectionService.showOfflinePage.subscribe(show => {
      this.showOfflinePage = show;
    });
    document.addEventListener('click', (event) => {
      if (!this.connectionService.isOnline && (event.target as HTMLElement).tagName === 'BUTTON') {
        this.showOfflinePage = true;
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);

  }

  checkViewportSize(): void {
    if (window.innerWidth > 600) {
      this.router.navigate(['/error']);
    }
  }
}
