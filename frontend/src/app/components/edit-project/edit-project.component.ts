import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditProjectModel } from 'src/core/models/project/edit-project-model';
import { ProjectInfoModel } from 'src/core/models/project/project-info-model';
import { ProjectService } from 'src/core/services/project.service';
import { IBoard, IUserCard } from 'src/shared/components/select-users/Models';

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
  deleteUserBoard: IBoard;
  inviteUserBoard: IBoard;

  invitedUsersList: IUserCard[];

  constructor(formBuilder: FormBuilder, public projectService: ProjectService) {
    this.editProjectForm = formBuilder.group({
      'editProjectName': ['', [Validators.required, Validators.min(3), Validators.max(12)]]
    });
    
    
  }

  ngOnInit() {
      this.changeRoleBoard = {id: 1, type: 1, hasRoles: true, users: this.project.users}
      this.deleteUserBoard = {id: 1, type: 1, hasRoles: false, users: this.project.users}
      this.inviteUserBoard = {id: 1, type: 1, hasRoles: false, users: this.invitedUsersList}
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
