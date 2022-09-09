import { Component, Input, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TasqueDropdownOption } from 'src/shared/components/tasque-dropdown/dropdown.component';
import { TaskTemplate } from 'src/core/models/task/task-template';
import { ToastrService } from 'ngx-toastr';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { TaskCustomField } from 'src/core/models/task/task-template-models/task-custom-field';
import { Router } from '@angular/router';
import { AvailableFields } from 'src/core/models/const-resources/available-fields';
import { TaskType } from 'src/core/models/task/task-type';
import { TaskTemplateService } from 'src/core/services/task-template.service';

@Component({
  selector: 'app-issue-template',
  templateUrl: './issue-template.component.html',
  styleUrls: ['./issue-template.component.sass'],
})
export class IssueTemplateComponent implements OnInit {
  constructor(
    private notificationService: ToastrService,
    private router: Router,
    private taskTemplateService: TaskTemplateService,
  ) {}

  public issueTemplate: TaskTemplate;

  public customFields: TaskCustomField[] = [];

  public availableFields = Object.assign(
    [],
    AvailableFields,
  ) as TaskCustomField[];

  public selectedIssue: TasqueDropdownOption;
  public issueColor: string;
  public fieldName: string;

  faTrash = faTrash;

  public templates: TaskTemplate[] = [];
  public types: TaskType[] = [];
  public type?: TaskType;

  public dropdownOptions: TasqueDropdownOption[] = [
    // TODO: Here will be all project issue types
    {
      id: 3,
      color: 'red',
      title: 'Bug',
    },
    {
      id: 1,
      color: 'blue',
      title: 'Task',
    },
    {
      id: 2,
      color: 'green',
      title: 'Story',
    },
  ];

  @Input() projectId = 5; //TODO: Change with number type, when ability to input value will implemented

  public selectedId: number;
  public isLabel: TaskCustomField | undefined;
  public isDropdown: TaskCustomField | undefined;
  public isCheckbox: TaskCustomField | undefined;

  ngOnInit(): void {
    this.taskTemplateService
    .getAllProjectTemplates(this.projectId)
    .subscribe((resp) => {
      this.templates = resp.body as TaskTemplate[];

      this.templates.forEach(
        (t) => this.taskTemplateService
          .getTaskType(t.typeId as number)
          .subscribe((resp) => {
            this.types.push(resp.body as TaskType);
            this.types.forEach((t) => {
              this.type = t;
              this.setDropdownOptions();
              this.type = undefined;
            });
      }));
    }, () => {
      this.notificationService.info('No templates found');
      this.templates = [];
    });

    this.taskTemplateService
    .getAllProjectTaskTypes(this.projectId)
    .subscribe((resp) => {
      this.types = resp.body as TaskType[];
    });
  }

  dropCustomFields(event: CdkDragDrop<TaskCustomField[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      if (event.previousContainer.data === this.availableFields) {
        const toMove: TaskCustomField[] = [];
        this.availableFields.forEach((f) => toMove.push( { name: f.name, type: f.type, fieldId: f.fieldId } ));
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

  deleteItem(val: TaskCustomField): void {
    this.customFields.forEach((value, index) => {
      if (value == val) this.customFields.splice(index, 1);
    });
  }

  saveChanges(): void {
    if (this.selectedId === undefined) {
      this.notificationService.error('No issue type selected');
      return;
    }

    const template: TaskTemplate = {
      typeId: this.selectedId,
      title: this.issueTemplate.title,
      id: String(this.selectedId),
      projectId: this.projectId,
      customFields: this.customFields,
    };

    this.taskTemplateService.updateTaskTemplate(template).subscribe(
      () => {
        this.notificationService.success(
          `${this.selectedIssue.title} template has been updated successfully`,
        );
      },
      () => {
        this.notificationService.warning('No changes indicated');
      },
    );
  }

  discardChanges(): void {
    this.router.navigate(['/project/settings']);
  }

  setSelected(val: number): void {
    this.selectedId = val;

    this.taskTemplateService.getTaskType(val).subscribe((resp) => {
      this.type = resp.body as TaskType;
    }, () => {
      this.type = {
        name: 'New issue',
        createdAt: new Date(),
        updatedAt: new Date(),
        id: this.templates.length + 1,
      };

      this.issueTemplate = {
        title: this.type.name,
        projectId: this.projectId,
        customFields: [],
      };
    });

    this.taskTemplateService.getTemplateById(String(val)).subscribe((resp) => {

      if(resp.ok) {
        this.issueTemplate = resp.body as TaskTemplate;
        this.customFields = this.issueTemplate.customFields;
      } else {
        this.issueTemplate = {
          title: this.type?.name as string,
          projectId: this.projectId,
          customFields: []
        };
      }
    }, 
    () => {
      this.issueTemplate = {
        title: 'New issue',
        projectId: this.projectId,
        customFields: [],
        typeId: this.type?.id,
      };
      this.customFields = [];
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
    this.isCheckbox = undefined;
    this.isLabel = val;
  }

  setIsDropdown(val: TaskCustomField): void {
    this.isLabel = undefined;
    this.isCheckbox = undefined;
    this.isDropdown = val;
  }

  setIsCheckbox(val: TaskCustomField): void {
    this.isLabel = undefined;
    this.isDropdown = undefined;
    this.isCheckbox = val;
  }

  closeEdit(): void {
    this.isLabel = undefined;
    this.isDropdown = undefined;
    this.isCheckbox = undefined;
  }

  setDropdownOptions(): void {
    this.templates.forEach((t) => {
      this.dropdownOptions.push({
        id: Number(t.id),
        title: this.type?.name ?? 'Undefined',
      });
    });
  }
}
