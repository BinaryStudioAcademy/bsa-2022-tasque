import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reset-page',
  templateUrl: './reset-page.component.html',
  styleUrls: ['./reset-page.component.sass']
})
export class ResetPageComponent implements OnInit {

  public isValidKey = false;
  public password = '';
  public passwordRepeat = '';
  public hidePass = true;
  public hidePassRepeat = true;
  public loginForm: FormGroup = new FormGroup({});
  public emailControl: FormControl;

  constructor() { }

  ngOnInit(): void {
  }

}
