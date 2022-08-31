import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/shared/shared.module';
import { IssueTemplateComponent } from './issue-template/issue-template.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IssueFieldComponent } from './issue-template/issue-field/issue-field.component';

@NgModule({
  declarations: [
    IssueTemplateComponent,
    IssueFieldComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DragDropModule
  ]
})
export class ProjectOptionsModule { }
