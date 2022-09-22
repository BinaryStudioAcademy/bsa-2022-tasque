import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TasqueDropdownOption } from 'src/shared/components/tasque-dropdown/dropdown.component';
import { TaskTemplate } from 'src/core/models/task/task-template';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { TaskCustomField } from 'src/core/models/task/task-template-models/task-custom-field';
import { ActivatedRoute, Router } from '@angular/router';
import { AvailableFields } from 'src/core/models/const-resources/available-fields';
import { TaskType } from 'src/core/models/task/task-type';
import { TaskTemplateService } from 'src/core/services/task-template.service';
import { ToastrNotificationService } from 'src/core/services/toastr-notification.service';

@Component({
  selector: 'app-issue-template',
  templateUrl: './issue-template.component.html',
  styleUrls: ['./issue-template.component.sass'],
})
export class IssueTemplateComponent implements OnInit {
  constructor(
    private notificationService: ToastrNotificationService,
    private router: Router,
    private taskTemplateService: TaskTemplateService,
    private route: ActivatedRoute
  ) { }

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

  public dropdownOptions: TasqueDropdownOption[] = [];

  public projectId: number;
  public selectedId: number;
  public isLabel: TaskCustomField | undefined;
  public isDropdown: TaskCustomField | undefined;
  public isCheckbox: TaskCustomField | undefined;

  ngOnInit(): void {
     this.projectId = parseInt(
      this.route.parent?.snapshot.paramMap.get('id') as string);

    this.taskTemplateService
      .getAllProjectTemplates(this.projectId)
      .subscribe((resp) => {
        this.templates = resp.body as TaskTemplate[];
      }, () => {
        this.notificationService.info('No templates found');
        this.templates = [];
      });

    this.taskTemplateService
      .getAllProjectTaskTypes(this.projectId)
      .subscribe((resp) => {
        this.types = resp.body as TaskType[];
        this.setDropdownOptions();
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
    this.router.navigate([`/project/${this.projectId}/board`]);
  }

  setSelected(val: number): void {
    this.selectedId = val;
    this.type = this.types.find((t) => t.id === val);
    this.issueTemplate = this.templates.find((t) => t.typeId === val) as TaskTemplate;
    if(this.issueTemplate?.customFields !== undefined) {
      this.customFields = this.issueTemplate.customFields;
    } else {
      this.customFields = [];
    }

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
    this.types.forEach((t) => this.dropdownOptions.push({
      id: t.id,
      color: t.color,
      title: t.name,
    }));
  }
}
