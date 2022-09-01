import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TasqueDropdownOption } from 'src/shared/components/tasque-dropdown/dropdown.component';
import { TaskTemplate } from 'src/core/models/task/task-template';
import { ToastrService } from 'ngx-toastr';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { TaskCustomField } from 'src/core/models/task/task-custom-field';
import { Router } from '@angular/router';
import { AvailableFields } from 'src/core/models/const-resources/available-fields';
import { TaskTemplateService } from 'src/core/services/task-template.service';
import { TaskType } from 'src/core/models/task/task-type';

@Component({
  selector: 'app-issue-template',
  templateUrl: './issue-template.component.html',
  styleUrls: ['./issue-template.component.sass']
})
export class IssueTemplateComponent implements OnInit {

  constructor(
    private notificationService: ToastrService,
    private router: Router,
    private taskTemplateService: TaskTemplateService,
  ) { }

  public issueTemplate: TaskTemplate;  
  //fieldsWithDescription and contextFields props should be replaced with this object same properties

  public fieldsWithDescription: TaskCustomField[] = [ 
    // { name: 'Description', type: TaskFieldType.Paragraph }, 
    // { name: 'Summary', type: TaskFieldType.Text }, 
    // { name: 'State', type: TaskFieldType.State }, 
    // { name: 'Type', type: TaskFieldType.Type }
  ];
  public contextFields: TaskCustomField[] = [ 
    // { name:'Assignee', type: TaskFieldType.User }, 
    // { name:'Label', type: TaskFieldType.Label, labels: [ 
    //   { color: 'red', name: 'first label' },
    //   { color: 'green', name: 'second label' },
    //   { color: 'blue', name: 'third label' }, 
    // ] }, 
    // { name:'Sprint', type: TaskFieldType.Type }, 
    // { name:'Story point estimate', type: TaskFieldType.Number }
  ];
  public customFields = Object.assign([], AvailableFields) as TaskCustomField[];

  public selectedIssue: TasqueDropdownOption;
  public issueColor: string;
  public fieldName: string;
  faTrash = faTrash;

  public templates: TaskTemplate[] = [];
  public type: TaskType;

  public dropdownOptions: TasqueDropdownOption[] = [ //Here will be all project issue types
    {
      id: 3,
      color: 'red',
      title: 'Bug'
    },{
      id: 1,
      color: 'blue',
      title: 'Task'
    },{
      id: 2,
      color: 'green',
      title: 'Story'
    },
  ];

  @Input() projectId: number;
  public selectedId: number;
  public isLabel: TaskCustomField | undefined;
  public isDropdown: TaskCustomField | undefined;

  ngOnInit(): void {
    this.taskTemplateService.getAllProjectTemplates(String(this.projectId))
    .subscribe((resp) => {
      this.templates = resp.body as TaskTemplate[];
      this.setDropdownOptions();
    });
  }

  dropCustomFields(event: CdkDragDrop<TaskCustomField[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {

      if(event.previousContainer.data === this.customFields) {
        const toMove: TaskCustomField[] = [];
        this.customFields.forEach((f) => toMove.push( { name: f.name, type: f.type } ));
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
    const template: TaskTemplate = { 
      typeId: this.selectedId,
      title: '',
      id: String(this.selectedId),
      projectId: this.projectId,
      customDescriptionFields: this.fieldsWithDescription,
      customContextFields: this.contextFields,
    };

    this.taskTemplateService.updateTaskTemplate(template)
    .subscribe(() => {
      this.notificationService.success(`${this.selectedIssue.title} template has been updated successfully`);
    });
  }

  discardChanges(): void {
    this.router.navigate(['/project/settings']);
  }

  setSelected(val:number): void {
    this.selectedId = val;
    this.taskTemplateService.getTaskType(val).subscribe((resp) => {
      this.type = resp.body as TaskType;
    });
    this.taskTemplateService.getTemplateById(String(val)).subscribe((resp) => {
      this.issueTemplate = resp.body as TaskTemplate;
      this.contextFields = this.issueTemplate.customContextFields;
      this.fieldsWithDescription = this.issueTemplate.customDescriptionFields;
    });
    const issue = this.dropdownOptions.find((i) => i.id === this.selectedId) as TasqueDropdownOption;
    this.issueColor = issue.color as string;
    this.selectedIssue = issue;
  }

  public fieldRename(event: Event): string {
    const input = event.target as HTMLElement;
    return input.innerText;
  }

  setIsLabel(val: TaskCustomField): void {
    this.isDropdown = undefined;
    this.isLabel = val;
  }

  setIsDropdown(val: TaskCustomField): void {
    this.isLabel = undefined;
    this.isDropdown = val;
  }

  closeEdit(): void {
    this.isLabel = undefined;
    this.isDropdown = undefined;
  }

  setDropdownOptions(): void {
    this.templates.forEach((t) => {
      this.dropdownOptions.push({
        id: Number(t.id),
        title: this.type.name, 
      });
    });
  }
}
