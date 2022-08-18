import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { BoardModel } from '../../../core/models/board/board-model';

@Component({
  selector: 'tasque-board',
  templateUrl: './tasque-board.component.html',
  styleUrls: ['./tasque-board.component.sass']
})
export class TasqueBoardComponent implements OnInit {

  public searchIcon = faMagnifyingGlass;
  public plusIcon = faPlus;
  public isCreateColumn: boolean;
  public createColumnForm: FormGroup;
  private newBoard: BoardModel;

  public board: BoardModel[] = [
    { columName: 'To Do', tasks: [] }, 
    { columName: 'In Progress', tasks: [] }, 
    { columName: 'Code Review', tasks: [] }, 
    { columName: 'Done', tasks: [] },
  ];

  constructor(formBuilder: FormBuilder) { 
    this.createColumnForm = formBuilder.group({
      'columnName': ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  OpenAddColumn(): void {
    this.isCreateColumn = true;
  }

  AddColumn(): void {
    if(this.createColumnForm.valid) {
      this.newBoard = { columName: this.createColumnForm.get('columnName')?.value, tasks: [] };
      this.board.push(this.newBoard);
      this.createColumnForm.reset();
      this.isCreateColumn = false;  
    }
  }

  onClickedOutside(): void {
    this.isCreateColumn = false;
    this.createColumnForm.reset();
  }
}
