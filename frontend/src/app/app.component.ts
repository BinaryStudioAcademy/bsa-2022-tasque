import { Component } from '@angular/core';
import { NotificationServices } from '../core/services/notification.services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'tasque';

  public constructor(private notification: NotificationServices) {}

  Notification() {
    this.notification.Error("Test", "Title");
    this.notification.Info("Test");
    this.notification.Success("Test");
    this.notification.Warning("Test");
  }
}
