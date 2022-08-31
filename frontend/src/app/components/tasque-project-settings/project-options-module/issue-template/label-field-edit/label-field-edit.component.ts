import { Component, Input, OnInit } from '@angular/core';
import { LabelField } from 'src/core/models/task/label-field';
import { TaskCustomField } from 'src/core/models/task/task-custom-field';
import { faPenToSquare, faCheck, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-label-field-edit',
  templateUrl: './label-field-edit.component.html',
  styleUrls: ['./label-field-edit.component.sass']
})
export class LabelFieldEditComponent implements OnInit {

  constructor() { }

  @Input() field: TaskCustomField;
  public labels: LabelField[];

  faPenToSquare = faPenToSquare;
  faCheck = faCheck;
  faMinus = faMinus;
  faPlus = faPlus;

  isChanging = false;
  newField: LabelField = { name: ''};

  ngOnInit(): void {
    this.labels = this.field?.labels as LabelField[];
  }

  public deleteLabel(val: LabelField): void  {
    console.log('delete label');
    this.labels.forEach((value,index)=>{
        if(value==val) this.labels.splice(index,1);
    });
  }

  public addLabel(): void {
    this.isChanging = ! this.isChanging;
    console.log('add label');
  }

  public setEv(val: MouseEvent, type: string): void {
    if(type === 'color'){
      this.newField.color = String(val);
    } else {
      this.newField.name = String(val);
    }
    console.log(val);
  }

  public saveLabel():void {
    this.labels.push(this.newField);
    this.isChanging = false;
    console.log(this.newField);
  }
}
