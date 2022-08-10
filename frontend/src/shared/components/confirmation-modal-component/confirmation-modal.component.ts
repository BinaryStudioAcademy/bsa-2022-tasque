import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmationData {
  title: string;
  message: string;
  type?: 'deletion' | 'default';
}

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.sass']
})
export class ConfirmationModalComponent implements OnInit {
  public type: string = 'default';
  public message: string;
  public title: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationData) {
    if (data.type) {
      this.type = data.type;
    }
    this.message = data.message;
    this.title = data.title;
  }

  public onConfirm(): void {
    this.dialogRef.close(true);
  }

  public onDismiss(): void {
    this.dialogRef.close(false);
  }

  ngOnInit(): void { }
}
