import { Component, OnInit } from '@angular/core';
import { SharedStateService } from 'src/app/services/shared-state.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  isDetailViewVisible = false;
  constructor(private sharedStateService: SharedStateService) { }

  ngOnInit(): void {
    this.sharedStateService.isDetailViewVisible$.subscribe((visible) => {
      this.isDetailViewVisible = visible;
    });
  }
}
