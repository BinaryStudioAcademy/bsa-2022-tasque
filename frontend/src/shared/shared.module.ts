import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { ButtonComponent } from './components/tasque-button/button.component';
import { LoadingComponent } from './components/tasque-loading/loading.component';
import { CheckboxComponent } from './components/tasque-checkbox/checkbox.component';
import { InputComponent } from './components/tasque-input/input.component';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationModalComponent } from './components/tasque-confirmation-modal/confirmation-modal.component';
import { HeaderComponent } from './components/tasque-header/tasque-header.component';

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
        LeftSidebarComponent,
        ConfirmationModalComponent,
        HeaderComponent
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
        HeaderComponent
    ],
})
export class SharedModule { }
