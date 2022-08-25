import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditProjectModel } from 'src/core/models/project/edit-project-model';
import { ProjectInfoModel } from 'src/core/models/project/project-info-model';
import { ProjectService } from 'src/core/services/project.service';
import { IBoard } from 'src/shared/components/select-users/Models';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.sass']
})
export class EditProjectComponent implements OnInit {

  @Input() project: ProjectInfoModel;

  editProjectForm: FormGroup;
  showErrorMessage: boolean;
  editProjectModel: EditProjectModel;

  changeRoleBoard: IBoard;
  deleteUser: IBoard;
  inviteUser: IBoard;

  constructor(formBuilder: FormBuilder, public projectService: ProjectService) {
    this.editProjectForm = formBuilder.group({
      'editProjectName': ['', [Validators.required, Validators.min(3), Validators.max(12)]]
    });
  }

  ngOnInit() {
  }

  editProject() {
    if(this.editProjectForm.valid) {
      this.showErrorMessage = false;

      this.editProjectModel = {id: this.project.id, name: this.editProjectForm.controls['editProjectName'].value}

      this.projectService.editProject(this.editProjectModel).subscribe(() => {
        //
      })
    }
    else {
      this.showErrorMessage = true;
    }
  }
}
