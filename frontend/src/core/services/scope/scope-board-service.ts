import { Injectable } from '@angular/core';
import { ProjectService } from '../project.service';
import { TaskService } from '../task.service';
import { TaskStateService } from '../task-state.service';
import { SprintService } from '../sprint.service';
import { TaskTypeService } from '../task-type.service';

@Injectable({
  providedIn: 'root',
})
export class ScopeBoardService {
  constructor(
    public projectService: ProjectService,
    public taskStateService: TaskStateService,
    public taskTypeService: TaskTypeService,
    public taskService: TaskService,
    public sprintService: SprintService,
  ) {}
}
