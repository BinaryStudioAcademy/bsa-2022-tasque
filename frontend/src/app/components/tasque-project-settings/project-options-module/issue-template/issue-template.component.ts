import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'

@Component({
  selector: 'app-issue-template',
  templateUrl: './issue-template.component.html',
  styleUrls: ['./issue-template.component.sass']
})
export class IssueTemplateComponent implements OnInit {

  constructor() { }

  public fieldsWithDescription: string[] = ['Title', 'Description', 'Summary', 'Priority', 'State', 'Type'];
  public contextFields: string[] = ['Assignee', 'Label', 'Sprint', 'Story point estimate'];
  public customFields: string[] = ['Custom field 1', 
    'Custom field 2', 
    'Custom field 3', 
    'Custom field 4',
    'Custom field 5', 
    'Custom field 6', 
    'Custom field 7',
    'Custom field 8',
    'Custom field 9'];

  ngOnInit(): void {
  }

  dropFieldsWithDescription(event: CdkDragDrop<string[]>):void {
    moveItemInArray(this.fieldsWithDescription, event.previousIndex, event.currentIndex);
  }

  dropContextFields(event: CdkDragDrop<string[]>):void {
    moveItemInArray(this.contextFields, event.previousIndex, event.currentIndex);
  }

  dropCustomFields(event: CdkDragDrop<string[]>):void {
    moveItemInArray(this.customFields, event.previousIndex, event.currentIndex);
  }

  deleteContextItem(): void {
    this.contextFields.pop();
  }

  deleteDescriptionItem(val:string): void {
    this.fieldsWithDescription.pop();
  }
}
