import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { LoadingComponent } from './components/loading-component/loading.component';
import { CheckboxComponent } from './components/checkbox-component/checkbox.component';
import { ConfirmationModalComponent } from './components/confirmation-modal-component/confirmation-modal.component';
import { ButtonComponent } from './components/button/button.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


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
        CheckboxComponent,
        ConfirmationModalComponent,
        ButtonComponent
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
        CheckboxComponent,
        ConfirmationModalComponent,
    ],
})
export class SharedModule { } 
