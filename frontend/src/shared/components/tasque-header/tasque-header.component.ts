import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { UserModel } from 'src/core/models/user/user-model';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';

@Component({
  selector: 'tasque-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  public searchIcon = faMagnifyingGlass;
  public currentUser: UserModel;
  public createOptions: string[] = [
    'Create Organization', 'Create Project',
  ];
  public yourWorkOptions: string[] = [
    'One task', 'Some task',
  ];
  public projectOptions: string[] = [
    'Last Project', 'Previous Project',
  ];

  public createItemControl = new FormControl('');

  constructor(
    private currentUserService: GetCurrentUserService,
  ) { }

  ngOnInit(): void {
    this.currentUserService.currentUser.subscribe((user) => {
      this.currentUser = user as UserModel;
    });

    this.createItemControl.valueChanges.subscribe(
      () => this.openCreateItemDialog(this.createItemControl.value as string)
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public openCreateItemDialog(value: string): void { }
  public openCreateTaskDialog(): void { }
}
