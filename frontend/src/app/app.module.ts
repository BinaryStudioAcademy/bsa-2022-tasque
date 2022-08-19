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
import { UserModule } from './user/user.module';
import { SelectUsersComponent } from '../shared/components/select-users/select-users.component';

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
    SelectUsersComponent,
    TasqueBoardComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    CoreModule,
    FormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AuthModule,
    UserModule,

  ],
  providers: [BrowserAnimationsModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
