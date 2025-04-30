import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SharedStateService } from 'src/app/services/shared-state.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  isDetailViewVisible = false;
  constructor(private sharedStateService: SharedStateService,
    private router:Router
  ) { }

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
