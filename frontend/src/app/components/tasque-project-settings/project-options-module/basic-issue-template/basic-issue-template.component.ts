import { Component, OnInit } from '@angular/core';
import { concatMap, map } from 'rxjs/operators';
import { BaseComponent } from 'src/core/base/base.component';
import { ProjectModel } from 'src/core/models/project/project-model';
import { GetCurrentProjectService } from 'src/core/services/get-current-project.service';
import { ProjectService } from 'src/core/services/project.service';
import { templateSetting } from './template-setting-model';

@Component({
  selector: 'app-basic-issue-template',
  templateUrl: './basic-issue-template.component.html',
  styleUrls: ['./basic-issue-template.component.sass']
})
export class BasicIssueTemplateComponent extends BaseComponent implements OnInit {
  public selectedSetting?: templateSetting;

  public project: ProjectModel;

  constructor(
    private getProjectService: GetCurrentProjectService,
    private projectService: ProjectService) {
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
        return;
      case 'State':
        return;
      case 'Type':
        return;
      case 'Project':
        return;
    }
  }
}
