import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css']
})
export class ToasterComponent {
  @Input() show = false;
  @Input() title = 'Notification';
  @Input() message = '';
  @Output() dismiss = new EventEmitter<void>();

  get type(): 'success' | 'error' | 'info' {
    const text = `${this.title} ${this.message}`.toLowerCase();
    if (/\b(error|failed|failure|invalid|unable|oops|danger|missing|denied)\b/.test(text)) {
      return 'error';
    }
    if (/\b(success|successful|submitted|verified|added|resent|sent|payment success)\b/.test(text)) {
      return 'success';
    }
    return 'info';
  }

  get typeLabel(): string {
    return this.type === 'success' ? 'All set' : this.type === 'error' ? 'Needs attention' : 'A quick note';
  }

  get displayTitle(): string {
    return this.message.trim().toLowerCase() === 'danger' ? 'Something went wrong' : this.title;
  }

  get displayMessage(): string {
    return this.message.trim().toLowerCase() === 'danger' ? this.title : this.message;
  }

  hide() {
    this.dismiss.emit();
    this.show = false;
  }
}
