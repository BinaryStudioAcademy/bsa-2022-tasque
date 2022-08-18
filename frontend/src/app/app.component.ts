import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'tasque';

  options: [color: string, title: string, id: number][] = [
    ['red', 'test', 0],
    ['#F6F7F9', 'Feature', 1],
  ];

  userId = 223232;
}
