import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectInfoModel } from '../models/project/project-info-model';
import { GetCurrentProjectService } from '../services/get-current-project.service';
import { GetCurrentUserService } from '../services/get-current-user.service';
import { ProjectService } from '../services/project.service';

@Injectable({
  providedIn: 'root'
})
export class AccessControlGuard implements CanActivate {

  private userId: number;
  private currentProject: ProjectInfoModel;

  constructor(
    private projectService: ProjectService,
    private currentProjectService: GetCurrentProjectService,
    private currentUser: GetCurrentUserService,
    private router: Router) { }
  
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    this.userId = this.currentUser.currentUserId;

    return this.projectService.getCurrentProjectInfoById(Number(route.paramMap.get('id')))
      .pipe(map((data) => {
        if(data.body) {
          const isUserExist = data.body.users.find(x => x.id == this.userId);
          if(isUserExist) {
            this.currentProjectService.setCurrentProject(this.currentProject);
            return true;
          } else {
            this.router.navigate(['/projects']);
            return false;
          }
        }
        return false;
      }));
  }
}
