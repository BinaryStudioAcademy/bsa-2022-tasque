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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationModalComponent } from './components/tasque-confirmation-modal/confirmation-modal.component';
import { OrganizationsDropdownComponent } from './components/organizations-dropdown/organizations-dropdown.component';

@NgModule({
        imports: [
                CommonModule,
                RouterModule,
                FormsModule,
                ReactiveFormsModule,
                RouterModule,
                MaterialModule,
                BrowserAnimationsModule,
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
                OrganizationsDropdownComponent
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
                CreateOrganizationComponent,
                CreateOrganizationDialogComponent,
                OrganizationsDropdownComponent
        ],
})
export class SharedModule { }
