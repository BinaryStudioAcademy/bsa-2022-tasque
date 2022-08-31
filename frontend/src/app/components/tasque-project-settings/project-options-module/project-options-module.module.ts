import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/shared/shared.module';
import { IssueTemplateComponent } from './issue-template/issue-template.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IssueFieldComponent } from './issue-template/issue-field/issue-field.component';
import { LabelFieldEditComponent } from './issue-template/label-field-edit/label-field-edit.component';

@NgModule({
  declarations: [
    IssueTemplateComponent,
    IssueFieldComponent,
    LabelFieldEditComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DragDropModule
  ]
})
export class ProjectOptionsModule { }
