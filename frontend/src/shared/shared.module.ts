import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { LoadingComponent } from './components/loading-component/loading.component';
import { CheckboxComponent } from './components/checkbox-component/checkbox.component';
import { ButtonComponent } from './components/button/button.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationModalComponent } from './components/tasque-confirmation-modal/confirmation-modal.component';


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
        ButtonComponent,
        ConfirmationModalComponent,
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
