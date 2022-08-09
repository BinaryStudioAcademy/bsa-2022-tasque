import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { ButtonComponent } from './components/button/button.component';
import { InputComponent } from './components/input/input.component';
import { LoadingComponent } from './components/loading-component/loading.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MaterialModule,
    ],
    declarations: [
        LoadingComponent,
        ButtonComponent,
        InputComponent
    ],
    exports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        LoadingComponent,
        ButtonComponent,
        InputComponent,        
        MaterialModule,
    ],
})
export class SharedModule { } 
