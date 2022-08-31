import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { BoardModel } from '../../../core/models/board/board-model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskInfoModel } from 'src/core/models/board/task-Info-model';
import { UserModel } from 'src/core/models/user/user-model';

@Component({
  selector: 'tasque-board',
  templateUrl: './tasque-board.component.html',
  styleUrls: ['./tasque-board.component.sass']
})
export class TasqueBoardComponent implements OnInit {

  public searchIcon = faMagnifyingGlass;
  public plusIcon = faPlus;
  public isOpenColumnAddDialog: boolean;
  public createColumnForm: FormGroup;
  private newBoard: BoardModel;

  user: UserModel = {
    id: 1,
    name: 'John Doe',
    email: 'johndoe@gmail.com'
  }

  public board: BoardModel[] = [
    { columnName: 'To Do', tasks: [ { description: 'Create task', attachmentUrl: '', user: this.user, projectKey: 'TO' }, { description: 'Drag task to "In Progress" column', attachmentUrl: '', user: this.user, projectKey: 'TT' }, { description: 'Drag task to "Code Review" column', attachmentUrl: '', user: this.user, projectKey: 'TT' } ] }, 
    { columnName: 'In Progress', tasks: [ { description: 'Create an issue', attachmentUrl: '', user: this.user, projectKey: 'TF' }] }, 
    { columnName: 'Code Review', tasks: [ { description: 'Drag task to "Done" column', attachmentUrl: '', user: this.user, projectKey: 'TF' }, { description: 'Smile!', attachmentUrl: '', user: this.user, projectKey: 'TS' }] }, 
    { columnName: 'Done', tasks: [] },
  ];

  constructor(formBuilder: FormBuilder) { 
    this.createColumnForm = formBuilder.group({
      'columnName': ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  OpenAddColumn(): void {
    this.isOpenColumnAddDialog = true;
  }

  AddColumn(): void {
    if(this.createColumnForm.valid) {
      this.newBoard = { columnName: this.createColumnForm.get('columnName')?.value, tasks: [] };
      this.board.push(this.newBoard);
      this.createColumnForm.reset();
      this.isOpenColumnAddDialog = false;  
    }
  }

  onClickedOutside(): void {
    this.isOpenColumnAddDialog = false;
    this.createColumnForm.reset();
  }

  drop(event: CdkDragDrop<TaskInfoModel[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
