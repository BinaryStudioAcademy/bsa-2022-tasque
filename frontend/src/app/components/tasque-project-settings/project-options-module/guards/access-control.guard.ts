import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserModel } from 'src/core/models/user/user-model';
import { ProjectInfoModel } from '../../../../../core/models/project/project-info-model';
import { GetCurrentProjectService } from '../../../../../core/services/get-current-project.service';
import { GetCurrentUserService } from '../../../../../core/services/get-current-user.service';
import { ProjectService } from '../../../../../core/services/project.service';

@Injectable({
  providedIn: 'root'
})
export class AccessControlGuard implements CanActivate {

  private user: UserModel;
  private isGrantedAccess: boolean;
  private currentProject: ProjectInfoModel;

  constructor(
    private projectService: ProjectService,
    private currentProjectService: GetCurrentProjectService,
    private currentUserService: GetCurrentUserService,
    private router: Router) { }
  
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    this.currentUserService.getCurrentUser();
    this.currentUserService.currentUser$.subscribe((data) => {
      this.user = data;
    });

    return this.projectService.getCurrentProjectInfoById(Number(route.paramMap.get('id')))
      .pipe(
        map((data) => {
        if(data.body) {
          const isUserExist = data.body.users.find((x) => x.id == this.user.id);

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
