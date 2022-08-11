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
import { CreateProjectDialogComponent } from './components/create-project/create-project-dialog/create-project-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationModalComponent } from './components/tasque-confirmation-modal/confirmation-modal.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TasqueLogoComponent } from './components/tasque-logo/tasque-logo.component';

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
        RegisterPageComponent,
        TasqueLogoComponent,
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
        TasqueLogoComponent,
    ],
})
export class SharedModule {}
