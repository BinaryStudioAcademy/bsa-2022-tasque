import { Injectable } from '@angular/core';
import { ProjectService } from '../project.service';
import { TaskService } from '../task-service.service';
import { TaskStateService } from '../task-state.service';

@Injectable({
    providedIn: 'root'
  })
  export class ScopeBoardService {
    
    constructor(
        public projectService: ProjectService,
        public taskStateService: TaskStateService,
        public taskService: TaskService
    ) { }
  }

  