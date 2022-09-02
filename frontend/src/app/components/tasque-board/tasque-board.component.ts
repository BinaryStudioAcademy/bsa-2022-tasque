import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { BoardColumnModel } from '../../../core/models/board/board-column-model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskInfoModel } from 'src/core/models/board/task-Info-model';
import { BoardService } from 'src/core/services/board.service';
import { NotificationService } from 'src/core/services/notification.service';
import { BoardModel } from 'src/core/models/board/board-model';
import { ActivatedRoute } from '@angular/router';

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
  
  private newColumn: BoardColumnModel;
  private projectId: number;

  public board: BoardModel = {projectId: 0, id: 0, name: "", columns: []};

  constructor(formBuilder: FormBuilder, private route: ActivatedRoute, private boardService: BoardService, private notificationService: NotificationService) { 
    this.createColumnForm = formBuilder.group({
      'columnName': ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id == null) {
      return;
    }
    this.projectId = parseInt(id);
    this.boardService.getProjectBoard(this.projectId).subscribe(
      (resp) => {
        if (resp.ok && resp.body != null) {
          this.board = resp.body;
        } else {
          this.notificationService.error('Something went wrong');
        }
      },
      (error) => {
        this.notificationService.error(error);
      },
    );
  }

  openAddColumn(): void {
    this.isOpenColumnAddDialog = true;
  }

  addColumn(): void {
    if(this.createColumnForm.valid) {
      this.newColumn = { id: 0, columnName: this.createColumnForm.get('columnName')?.value, tasks: [] };
      this.board.columns.push(this.newColumn);
      this.createColumnForm.reset();
      this.isOpenColumnAddDialog = false;  
    }
  }

  onClickedOutside(): void {
    this.isOpenColumnAddDialog = false;
    this.createColumnForm.reset();
  }

  dragDrop(event: CdkDragDrop<TaskInfoModel[]>): void {
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
