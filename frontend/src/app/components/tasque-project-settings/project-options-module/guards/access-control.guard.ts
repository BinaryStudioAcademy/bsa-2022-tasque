import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProjectInfoModel } from '../../../../../core/models/project/project-info-model';
import { GetCurrentProjectService } from '../../../../../core/services/get-current-project.service';
import { GetCurrentUserService } from '../../../../../core/services/get-current-user.service';
import { ProjectService } from '../../../../../core/services/project.service';

@Injectable({
  providedIn: 'root'
})
export class AccessControlGuard implements CanActivate {

  private userId: number;
  private isGrantedAccess: boolean;
  private currentProject: ProjectInfoModel;

  constructor(
    private projectService: ProjectService,
    private currentProjectService: GetCurrentProjectService,
    private currentUserService: GetCurrentUserService,
    private router: Router) { }
  
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    this.userId = this.currentUserService.getUserId();

    return this.projectService.getCurrentProjectInfoById(Number(route.paramMap.get('id')))
      .pipe(
        map((data) => {
        if(data.body) {
          const isUserExist = data.body.users.find((x) => x.id == this.userId);

          if(isUserExist) {
            this.currentProjectService.updateProject(this.currentProject);
            this.isGrantedAccess = true;
          } else {
            this.router.navigate(['/projects']);
            this.isGrantedAccess = false;
          }
        }
        return this.isGrantedAccess;
      }), catchError(() => {
        this.router.navigate(['/projects']);
        return of(false);
      }));
  }

}
