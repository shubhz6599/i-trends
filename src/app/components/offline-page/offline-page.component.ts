import { Component } from '@angular/core';
import { ConnectionService } from 'src/app/services/connection.service';

@Component({
  selector: 'app-offline-page',
  templateUrl: './offline-page.component.html',
  styleUrls: ['./offline-page.component.css']
})
export class OfflinePageComponent {
  constructor(private connectionService: ConnectionService){}
  reload() {
    if (this.connectionService.isOnline) {
      window.location.reload();
    }
  }
}
