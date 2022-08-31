import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { TasqueDropdownOption } from 'src/shared/components/tasque-dropdown/dropdown.component';
import { TaskTemplate } from 'src/core/models/task/task-template';
import { ToastrService } from 'ngx-toastr';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { TaskCustomField } from 'src/core/models/task/task-custom-field';
import { AvailableFields } from 'src/entity-models/const-resources/available-fields';

@Component({
  selector: 'app-issue-template',
  templateUrl: './issue-template.component.html',
  styleUrls: ['./issue-template.component.sass']
})
export class IssueTemplateComponent implements OnInit {

  constructor(
    private notificationService: ToastrService,
  ) { }

  @Input() public issueTemplate: TaskTemplate;  
  //fieldsWithDescription and contextFields props should be replaced with this object same properties

  public fieldsWithDescription: TaskCustomField[] = [ { name: 'Description' }, { name: 'Summary'}, { name: 'State' }, { name: 'Type' }];
  public contextFields: TaskCustomField[] = [ { name:'Assignee' }, { name:'Label' }, { name:'Sprint' }, { name:'Story point estimate' }];
  public customFields = Object.assign([], AvailableFields) as TaskCustomField[];

  public selectedIssue: TasqueDropdownOption;
  public issueColor: string;
  public fieldName: string;
  faTrash = faTrash;

  @Input() public dropdownOptions: TasqueDropdownOption[] = [ //Here will be all project issue types
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

  dropCustomFields(event: CdkDragDrop<TaskCustomField[]>): void {
    const cloned = Object.assign([], AvailableFields);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {

      if(event.previousContainer.data === this.customFields) {
        console.log('Work');
        const toMove: TaskCustomField[] = [];
        this.customFields.forEach(f => toMove.push( { name: f.name } ));
        transferArrayItem(
          toMove,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      } else
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  deleteContextItem(val: TaskCustomField): void {
    this.contextFields.forEach((value,index)=>{
        if(value==val) this.contextFields.splice(index,1);
    });
}

  deleteDescriptionItem(val:TaskCustomField): void {
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
