import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SharedStateService } from 'src/app/services/shared-state.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  isDetailViewVisible = false;
  isAuthRoute = false;

  constructor(private sharedStateService: SharedStateService,
    private router: Router,
    public ui: UiService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isAuthRoute = this.router.url.includes('/auth');
      });
  }

  ngOnInit(): void {
    this.sharedStateService.isDetailViewVisible$.subscribe((visible) => {
      this.isDetailViewVisible = visible;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const content = document.querySelector('.content-area');
        if (content) {
          content.scrollTop = 0;
        } else {
          window.scrollTo(0, 0);
        }
      }
    });
  }
}
