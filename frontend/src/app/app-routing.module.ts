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
import { TasqueProjectSettingsComponent } from './components/tasque-project-settings/tasque-project-settings.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { ProjectSettingsRoutes } from './components/tasque-project-settings/project-options-module/project-options-routes';
import { BacklogComponent } from './components/backlog/backlog.component';
import { NotFoundPageComponent } from 'src/shared/components/not-found-page/not-found-page.component';

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
      { path: 'backlog', component: BacklogComponent },
      { path: 'projects', component: ProjectListComponent, },
      ...UserRoutes,
      { path: 'not-found', component: NotFoundPageComponent },
    ],
  },
  {
    path: 'project',
    component: PageWithSidebarComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'board', component: TasqueBoardComponent },
      { path: 'team', component: TasqueTeamComponent },
      { path: 'settings', component: TasqueProjectSettingsComponent },
      ...ProjectSettingsRoutes,
      { path: 'backlog', component: BacklogComponent },
    ],
  },
  { path: '**', redirectTo: '/not-found', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
