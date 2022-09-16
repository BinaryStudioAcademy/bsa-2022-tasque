import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/shared/shared.module';
import { IssueTemplateComponent } from './issue-template/issue-template.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IssueFieldComponent } from './issue-template/issue-field/issue-field.component';
import { LabelFieldEditComponent } from './issue-template/label-field-edit/label-field-edit.component';
import { DropdownFieldEditComponent } from './issue-template/dropdown-field-edit/dropdown-field-edit.component';
import { CheckboxFieldComponent } from './issue-template/checkbox-field-edit/checkbox-field.component';
import { BasicIssueTemplateComponent } from './basic-issue-template/basic-issue-template.component';
import { BasicLabelFieldComponent } from './basic-issue-template/basic-label-field/basic-label-field.component';

@NgModule({
  declarations: [
    IssueTemplateComponent,
    IssueFieldComponent,
    LabelFieldEditComponent,
    DropdownFieldEditComponent,
    CheckboxFieldComponent,
    BasicIssueTemplateComponent,
    BasicLabelFieldComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DragDropModule
  ]
})
export class ProjectOptionsModule { }
