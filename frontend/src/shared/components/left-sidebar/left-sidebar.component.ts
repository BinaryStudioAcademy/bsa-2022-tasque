import { Component, OnInit } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.sass']
})
export class LeftSidebarComponent implements OnInit {

  public containerWidth: number;

  public sideBarMinimized: boolean;

  constructor(public breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 1200px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.containerWidth = 127;
          this.sideBarMinimized = true;
        } else {
          this.containerWidth = 252;
          this.sideBarMinimized = false;
        }
      });
  }

  minimize(): void{
    this.sideBarMinimized = !this.sideBarMinimized;
    if(this.sideBarMinimized){
      this.containerWidth = 127;
      return;
    }
    this.containerWidth = 252;
  }

}
