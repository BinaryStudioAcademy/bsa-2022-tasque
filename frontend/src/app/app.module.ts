import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from 'src/core/core.module';
import { SharedModule } from 'src/shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateOrganizationComponent } from './components/create-organization/create-organization.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { CreateOrganizationDialogComponent } from './components/create-organization/create-organization-dialog/create-organization-dialog.component';
import { CreateProjectDialogComponent } from './components/create-project/create-project-dialog/create-project-dialog.component';
import { AuthModule } from './auth/auth.module';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectListItemComponent } from './components/project-list/project-list-item/project-list-item.component';
import { OrganizationListComponent } from './components/organization-list/organization-list.component';
import { OrganizationListItemComponent } from './components/organization-list/organization-list-item/organization-list-item.component';
import { TasqueBoardComponent } from './components/tasque-board/tasque-board.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../core/interceptors/jwt.interceptor';
import { PageWithoutSidebarComponent } from './components/page-without-sidebar/page-without-sidebar.component';
import { PageWithSidebarComponent } from './components/page-with-sidebar/page-with-sidebar.component';
import { TasqueTeamComponent } from './components/tasque-team/tasque-team.component';
import { TasqueProjectSettingsComponent } from './components/tasque-project-settings/tasque-project-settings.component';
import { ToastrConfig } from 'src/entity-models/const-resources/toastr-config';
import { UserModule } from './user/user.module';
import { EditOrganizationComponent } from './components/edit-organization/edit-organization.component';
import { EditProjectComponent } from './components/edit-project/edit-project.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateOrganizationComponent,
    CreateOrganizationDialogComponent,
    CreateProjectComponent,
    CreateProjectDialogComponent,
    ProjectListComponent,
    ProjectListItemComponent,
    OrganizationListComponent,
    OrganizationListItemComponent,
    TasqueBoardComponent,
    PageWithoutSidebarComponent,
    TasqueBoardComponent,
    PageWithSidebarComponent,
    TasqueTeamComponent,
    TasqueProjectSettingsComponent,
    TasqueBoardComponent,
    EditOrganizationComponent,
    TasqueProjectSettingsComponent,
    EditProjectComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    CoreModule,
    FormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(ToastrConfig),
    AuthModule,
    UserModule,
  ],
  providers: [
    BrowserAnimationsModule,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  exports: [OrganizationListComponent],
})
export class AppModule {}
