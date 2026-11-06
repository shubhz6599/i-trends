import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { UiService } from 'src/app/services/ui.service';
import { BottomNavbarComponent } from '../bottom-navbar/bottom-navbar.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ToasterComponent } from '../toaster/toaster.component';
import { TopNavbarComponent } from '../top-navbar/top-navbar.component';

@Component({
  standalone: true,
  imports: [
    BottomNavbarComponent,
    CommonModule,
    RouterOutlet,
    SpinnerComponent,
    ToasterComponent,
    TopNavbarComponent
  ],
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  isAuthRoute = false;

  constructor(private router: Router, public ui: UiService) {
    this.isAuthRoute = this.isAuthenticationRoute(this.router.url);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.isAuthRoute = this.isAuthenticationRoute(event.urlAfterRedirects);
      });
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  private isAuthenticationRoute(url: string): boolean {
    return url === '/auth' || url.startsWith('/auth?') || url.startsWith('/reset-password/');
  }
}
