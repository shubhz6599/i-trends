import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'opticalApp';
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.checkViewportSize();
  }

  checkViewportSize(): void {
    const screenWidth = window.innerWidth;
    if (screenWidth > 700) {
      // Redirect to the error page if screen width exceeds 600px
      this.router.navigate(['/error']);
    }
  }
}
