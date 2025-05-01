import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css']
})
export class ToasterComponent {
  @Input() show = false;
  @Input() title = 'Notification';
  @Input() message = '';

  hide() {
    this.show = false;
  }
}
