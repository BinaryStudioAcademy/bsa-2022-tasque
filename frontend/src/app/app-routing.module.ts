import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutes } from './auth/auth.routes';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { PageWithoutSidebarComponent } from './components/page-without-sidebar/page-without-sidebar.component';
import { OrganizationListComponent } from './components/organization-list/organization-list.component';
import { UserRoutes } from './user/user.routes';
import { PageWithSidebarComponent } from './components/page-with-sidebar/page-with-sidebar.component';
import { TasqueBoardComponent } from './components/tasque-board/tasque-board.component';
import { TasqueTeamComponent } from './components/tasque-team/tasque-team.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { BacklogComponent } from './components/backlog/backlog.component';
import { NotFoundPageComponent } from 'src/shared/components/not-found-page/not-found-page.component';
import { AccessControlGuard } from 'src/app/components/tasque-project-settings/project-options-module/guards/access-control.guard';
import { ProjectSettingsRoutes } from './components/tasque-project-settings/project-options-module/project-options.routes';
import { WikiComponent } from './components/wiki/wiki.component';

const routes: Routes = [
  ...AuthRoutes,
  {
    path: '',
    component: PageWithoutSidebarComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'organizations', pathMatch: 'full' },
      { path: 'organizations', component: OrganizationListComponent },
      { path: 'projects', component: ProjectListComponent },
      { path: 'backlog', component: BacklogComponent },
      { path: 'projects', component: ProjectListComponent },
      { path: 'not-found', component: NotFoundPageComponent },
      ...UserRoutes,
    ],
  },
  {
    path: 'project',
    component: PageWithSidebarComponent,
    canActivate: [AuthGuard],
    children: [
      { path: ':id/board', component: TasqueBoardComponent, canActivate: [AccessControlGuard] },
      { path: ':id/team', component: TasqueTeamComponent },
      { path: ':id/backlog', component: BacklogComponent },
      { path: ':id/wiki', component: WikiComponent },
      ...ProjectSettingsRoutes,
    ],
  },
  { path: '**', redirectTo: '/not-found', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
