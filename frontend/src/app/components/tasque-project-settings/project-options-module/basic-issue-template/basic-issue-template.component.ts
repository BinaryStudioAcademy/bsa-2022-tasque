import { Component, OnInit } from '@angular/core';
import { concatMap, map, takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/core/base/base.component';
import { ProjectModel } from 'src/core/models/project/project-model';
import { TaskPriority } from 'src/core/models/task/task-priority';
import { TaskState } from 'src/core/models/task/task-state';
import { TaskType } from 'src/core/models/task/task-type';
import { GetCurrentProjectService } from 'src/core/services/get-current-project.service';
import { ProjectService } from 'src/core/services/project.service';
import { TaskTemplateService } from 'src/core/services/task-template.service';
import { templateSetting } from './template-setting-model';

@Component({
  selector: 'app-basic-issue-template',
  templateUrl: './basic-issue-template.component.html',
  styleUrls: ['./basic-issue-template.component.sass']
})
export class BasicIssueTemplateComponent extends BaseComponent implements OnInit {
  public selectedSetting?: templateSetting;

  public project: ProjectModel;
  public priorities: TaskPriority[];
  public types: TaskType[];
  public states: TaskState[];

  constructor(
    private getProjectService: GetCurrentProjectService,
    private projectService: ProjectService,
    private taskTemplateService: TaskTemplateService) {
    super();
  }

  ngOnInit(): void {
    this.getProjectService.currentProjectId$.pipe(
      concatMap((id) => this.projectService.getProjectById(id)),
      map((resp) => resp.body),
    ).subscribe((project) => {
      if (!project) {
        return;
      }
      this.project = project;
    });
  }

  public selectSetting(setting: templateSetting): void {
    this.selectedSetting = setting;

    switch (this.selectedSetting) {
      case 'Priority':
        this.projectService
          .getProjectPriorities(this.project.id)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((priorities) => {
            if (!priorities.body) {
              return;
            }
            this.priorities = priorities.body;
          });
        return;
      case 'State':
        this.taskTemplateService
          .getAllProjectTaskStates(this.project.id)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((states) => {
            if (!states.body) {
              return;
            }
            this.states = states.body;
          });
        return;
      case 'Type':
        this.taskTemplateService
          .getAllProjectTaskTypes(this.project.id)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((types) => {
            if (!types.body) {
              return;
            }
            this.types = types.body;
          });
        return;
      case 'Project':
        return;
    }
  }
}
