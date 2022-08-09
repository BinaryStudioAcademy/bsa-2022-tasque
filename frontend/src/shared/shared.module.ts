import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { LoadingComponent } from './components/loading-component/loading.component';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';

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
        LeftSidebarComponent,
    ],
    exports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        LoadingComponent,
        MaterialModule,
        LeftSidebarComponent,
    ],
})
export class SharedModule { }
