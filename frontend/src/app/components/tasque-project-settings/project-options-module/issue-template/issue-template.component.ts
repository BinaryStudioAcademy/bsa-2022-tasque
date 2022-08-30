import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'

@Component({
  selector: 'app-issue-template',
  templateUrl: './issue-template.component.html',
  styleUrls: ['./issue-template.component.sass']
})
export class IssueTemplateComponent implements OnInit {

  constructor() { }

  public fieldsWithDescription: string[] = ['Title', 'Description', 'Summary', 'State', 'Type'];
  public contextFields: string[] = ['Assignee', 'Label', 'Sprint', 'Story point estimate'];
  public customFields: string[] = [
    'Text', 
    'Paragraph', 
    'Number',
    'Label', 
    'User', 
    'Date',
    'Dropdown',
    'Check box'];

  ngOnInit(): void {
  }

  dropFieldsWithDescription(event: CdkDragDrop<string[]>):void {
    moveItemInArray(this.fieldsWithDescription, event.previousIndex, event.currentIndex);
  }

  dropContextFields(event: CdkDragDrop<string[]>):void {
    moveItemInArray(this.contextFields, event.previousIndex, event.currentIndex);
  }

  dropCustomFields(event: CdkDragDrop<string[]>):void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  deleteContextItem(val: string): void {
    this.contextFields.forEach((value,index)=>{
        if(value==val) this.contextFields.splice(index,1);
    });
    console.log('Delete context ' + val);
}

  deleteDescriptionItem(val:string): void {
    this.fieldsWithDescription.forEach((value,index)=>{
        if(value==val) this.fieldsWithDescription.splice(index,1);
    });
    console.log('Delete description ' + val);
  }
}
