import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tasque-project-settings',
  templateUrl: './tasque-project-settings.component.html',
  styleUrls: ['./tasque-project-settings.component.sass']
})
export class TasqueProjectSettingsComponent implements OnInit {

  public projectId: number;
  constructor() { }

  ngOnInit(): void {
  }

}
