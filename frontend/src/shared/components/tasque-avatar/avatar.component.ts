import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tasque-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.sass']
})
export class AvatarComponent implements OnInit {

  @Input()
  diameter_px: number;

  @Input()
  imageURL: string;

  @Input()
  alt: string;

  defaultImage = 'https://www.w3schools.com/howto/img_avatar.png';

  constructor() { }

  ngOnInit(): void { }

}