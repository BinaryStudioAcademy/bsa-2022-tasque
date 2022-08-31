import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { TasqueDropdownOption } from 'src/shared/components/tasque-dropdown/dropdown.component';
import { TaskTemplate } from 'src/core/models/task/task-template';
import { ToastrService } from 'ngx-toastr';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-issue-template',
  templateUrl: './issue-template.component.html',
  styleUrls: ['./issue-template.component.sass']
})
export class IssueTemplateComponent implements OnInit {

  constructor(
    private notificationService: ToastrService,
  ) { }

  public fieldsWithDescription: string[] = [ 'Description', 'Summary', 'State', 'Type'];
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

  public selectedIssue: TasqueDropdownOption;
  public issueColor: string;
  public fieldName: string;
  faTrash = faTrash;

  @Input() public dropdownOptions: TasqueDropdownOption[] = [
    {
      id: 0,
      color: 'red',
      title: 'Issue'
    },{
      id: 1,
      color: 'blue',
      title: 'Task'
    },{
      id: 2,
      color: 'green',
      title: 'Enhance'
    },
  ];

  public selectedId: number;

  ngOnInit(): void {
  }

  dropCustomFields(event: CdkDragDrop<string[]>): void {
    const cloned  = Object.assign([], this.customFields);
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
    this.customFields = cloned;
  }

  deleteContextItem(val: string): void {
    this.contextFields.forEach((value,index)=>{
        if(value==val) this.contextFields.splice(index,1);
    });
}

  deleteDescriptionItem(val:string): void {
    this.fieldsWithDescription.forEach((value,index)=>{
        if(value==val) this.fieldsWithDescription.splice(index,1);
    });
  }

  saveChanges(): void {
    if(this.selectedId === undefined){
      this.notificationService.error('No issue type selected');
      return;
    }
    console.log('clicked save changes');
    const template: TaskTemplate = {
      id: this.selectedId,
      customDescriptionFields: this.fieldsWithDescription,
      customContextFields: this.contextFields,
    }
    console.log(template);
    this.notificationService.success(`${this.selectedIssue.title} template has been updated successfully`);
  }

  setSelected(val:number): void {
    this.selectedId = val;
    const issue = this.dropdownOptions.find(i => i.id === this.selectedId) as TasqueDropdownOption;
    this.issueColor = issue.color;
    this.selectedIssue = issue;
  }

  public fieldRename(event: Event): string {
    const input = event.target as HTMLElement;
    return input.innerText;
  }
}
