import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { DropdownComponent } from './components/tasque-dropdown/dropdown.component';
import { ButtonComponent } from './components/tasque-button/button.component';
import { LoadingComponent } from './components/tasque-loading/loading.component';
import { CheckboxComponent } from './components/tasque-checkbox/checkbox.component';
import { InputComponent } from './components/tasque-input/input.component'; 
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationModalComponent } from './components/tasque-confirmation-modal/confirmation-modal.component';
import { OrganizationsDropdownComponent } from './components/tasque-header/organizations-dropdown/organizations-dropdown.component';
import { MenuDropdownComponent } from './components/tasque-menu-dropdown/menu-dropdown.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TasqueLogoComponent } from './components/tasque-logo/tasque-logo.component';
import { SideBarService } from 'src/core/services/sidebar.service';
import { HeaderComponent } from './components/tasque-header/tasque-header.component';
import { LayoutModule } from '@angular/cdk/layout';
import { TasqueTeamSelectComponent } from './components/tasque-team-select/tasque-team-select.component';
import { TaskCreationComponent } from 'src/shared/components/tasque-task-creation/task-creation.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TasqueSidebarComponent } from './components/tasque-sidebar/tasque-sidebar.component';
import { TasqueSideBarModalComponent } from './components/tasque-sidebar/tasque-sidebar-modal/sidebar-modal.component';
import { AvatarComponent } from './components/tasque-avatar/avatar.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    LayoutModule,
    AngularEditorModule,
  ],
  declarations: [
    LoadingComponent,
    ButtonComponent,
    InputComponent,
    CheckboxComponent,
    LeftSidebarComponent,
    ConfirmationModalComponent,
    DropdownComponent,
    TasqueLogoComponent,
    OrganizationsDropdownComponent,
    MenuDropdownComponent,
    HeaderComponent,
    TasqueTeamSelectComponent,
    TaskCreationComponent,
    TasqueSidebarComponent,
    TasqueSideBarModalComponent,
    AvatarComponent
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    BrowserAnimationsModule,
    LoadingComponent,
    ButtonComponent,
    InputComponent,
    CheckboxComponent,
    ConfirmationModalComponent,
    LeftSidebarComponent,
    DropdownComponent,
    DropdownComponent,
    FontAwesomeModule,
    TasqueLogoComponent,
    TasqueSidebarComponent,
    TasqueSideBarModalComponent,
    MenuDropdownComponent,
    OrganizationsDropdownComponent,
    HeaderComponent,
    TasqueTeamSelectComponent,
    TaskCreationComponent,
    AvatarComponent
  ],
  providers: [SideBarService],
})
export class SharedModule {}
