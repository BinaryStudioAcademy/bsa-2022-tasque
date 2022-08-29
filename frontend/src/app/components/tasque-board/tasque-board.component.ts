import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { BoardModel } from '../../../core/models/board/board-model';
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { TaskInfoModel } from 'src/core/models/board/task-Info-model';

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

  public board: BoardModel[] = [
    { columnName: 'To Do', tasks: [{name: 'TaskOne', avatarUrl: ''},{name: 'TaskTwo', avatarUrl: ''},{name: 'TaskThree', avatarUrl: ''} ] }, 
    { columnName: 'In Progress', tasks: [{name: 'TaskFour', avatarUrl: ''}] }, 
    { columnName: 'Code Review', tasks: [{name: 'TaskFive', avatarUrl: ''}, {name: 'TaskSix', avatarUrl: ''}] }, 
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

  drop(event: CdkDragDrop<TaskInfoModel[]>) {
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
