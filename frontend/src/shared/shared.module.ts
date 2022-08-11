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
import { CreateOrganizationDialogComponent } from './components/create-organization/create-organization-dialog/create-organization-dialog.component';
import { CreateOrganizationComponent } from './components/create-organization/create-organization.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import {
  CreateProjectDialogComponent
} from './components/create-project/create-project-dialog/create-project-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationModalComponent } from './components/tasque-confirmation-modal/confirmation-modal.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SideBarComponent } from './components/tasque-sidebar/sidebar.component';
import { SideBarService } from 'src/core/services/sidebar.service';

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
       
    ],
    declarations: [
        LoadingComponent,
        ButtonComponent,
        InputComponent,
        CheckboxComponent,
        CreateOrganizationComponent,
        CreateOrganizationDialogComponent,
        LeftSidebarComponent,
        ConfirmationModalComponent,
        DropdownComponent,
        CreateProjectComponent,
        CreateProjectDialogComponent,
        LoginPageComponent,
        SideBarComponent
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
        CreateProjectComponent,
        CreateProjectDialogComponent,
        DropdownComponent,
        CreateOrganizationComponent,
        CreateOrganizationDialogComponent,
        LoginPageComponent,
        FontAwesomeModule,
        SideBarComponent
    ],
    providers:[SideBarService]
})
export class SharedModule {}
