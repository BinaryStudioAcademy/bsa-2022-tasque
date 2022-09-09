import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ProjectInfoModel } from 'src/core/models/project/project-info-model';
import { UserModel } from 'src/core/models/user/user-model';
import { GetCurrentProjectService } from 'src/core/services/get-current-project.service';

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.sass']
})
export class ProjectListItemComponent implements OnInit, OnDestroy {

  @Input() public project: ProjectInfoModel;
  @Input() public currentUser: UserModel;

  public unsubscribe$ = new Subject<void>();

  constructor(public router: Router, private currentProject: GetCurrentProjectService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openProjectBoard(): void {
    this.currentProject.setProjects(this.project);
    this.router.navigate(['/project/' + this.project.id.toString() + '/board']);
  }

  permissionToEdit(): boolean {
    if(this.currentUser.id === this.project.authorId) {
      return true;
    }
    if (this.project.users.every((x) => { x.id == this.currentUser.id && x.role === 1; })) {
      return true;
    }

    return false;
  }
}
