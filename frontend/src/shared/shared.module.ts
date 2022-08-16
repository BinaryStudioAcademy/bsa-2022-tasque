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
import { SideBarComponent } from './components/tasque-sidebar/sidebar.component';
import { SideBarService } from 'src/core/services/sidebar.service';
import { HeaderComponent } from './components/tasque-header/tasque-header.component';
import { RichTextEditorComponent } from './components/tasque-rich-text-editor/rich-text-editor.component';

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
    LeftSidebarComponent,
    ConfirmationModalComponent,
    DropdownComponent,
    TasqueLogoComponent,
    SideBarComponent,
    OrganizationsDropdownComponent,
    MenuDropdownComponent,
    HeaderComponent,
    RichTextEditorComponent,
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
    SideBarComponent,
    MenuDropdownComponent,
    OrganizationsDropdownComponent,
    HeaderComponent,
    RichTextEditorComponent,
  ],
  providers: [SideBarService],
})
export class SharedModule {}
