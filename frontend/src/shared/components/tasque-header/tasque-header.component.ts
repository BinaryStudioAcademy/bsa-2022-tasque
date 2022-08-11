import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tasque-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  searchForm: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.searchForm = formBuilder.group({
      'search': ['', [Validators.required]]
    });
   }

  ngOnInit() {
  }

}
