import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from './services/connection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'opticalApp';
  showOfflinePage = false;
  constructor(private router: Router,private connectionService: ConnectionService) { }

  ngOnInit(): void {
    // this.checkViewportSize();
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
    const screenWidth = window.innerWidth;
    if (screenWidth > 600) {
      // Redirect to the error page if screen width exceeds 600px
      this.router.navigate(['/error']);
    }
  }
}
