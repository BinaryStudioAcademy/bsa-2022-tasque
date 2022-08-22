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
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  ...AuthRoutes,
  {
    path: '', component: PageWithoutSidebarComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'organizations', component: OrganizationListComponent },
      { path: 'projects', component: ProjectListComponent, },
      ...UserRoutes,
    ]
  },
  {
    path: 'project', component: PageWithSidebarComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'board', component: TasqueBoardComponent },
      { path: 'team', component: TasqueTeamComponent },
      { path: 'settings', component: TasqueProjectSettingsComponent },
    ]
  },
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
