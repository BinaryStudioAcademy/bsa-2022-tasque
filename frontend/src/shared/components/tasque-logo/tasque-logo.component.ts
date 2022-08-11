import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tasque-logo',
  templateUrl: './tasque-logo.component.html',
  styleUrls: ['./tasque-logo.component.sass']
})
export class TasqueLogoComponent implements OnInit {

  public isDark = true;
  public darkLogoSrc = "../../assets/tasque_logo_dark.svg";
  public lightLogosrc = '../../assets/tasque_logo.svg';

  @Input()
  set isLight(value: boolean) {
    this.isDark = !value;
  }
  get isLight(): boolean {
    return !this.isDark;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
