import { Component, OnDestroy, OnInit } from '@angular/core';
import { SideBarService } from 'src/core/services/sidebar.service';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/core/services/notification.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-task-creation',
  templateUrl: './task-creation.component.html',
  styleUrls: ['./task-creation.component.sass'],
})
export class TaskCreationComponent implements OnInit, OnDestroy {
  faExpeditedssl = faEllipsisVertical;

  public taskCreateForm: FormGroup = new FormGroup({});
  public projectControl: FormControl;
  public issueTypeControl: FormControl;
  public summaryControl: FormControl;
  public descriptionControl: FormControl;
  public unsubscribe$ = new Subject<void>();
  issueTypeControltest = '';

  get projectErrorMessage(): string {
    const ctrl = this.projectControl;

    if (ctrl.errors?.['required']) {
      return 'Project is required';
    }
    return '';
  }

  get issueTypeErrorMessage(): string {
    const ctrl = this.issueTypeControl;

    if (ctrl.errors?.['required']) {
      return 'Issue type is required';
    }
    return '';
  }

  get summaryErrorMessage(): string {
    const ctrl = this.summaryControl;

    if (ctrl.errors?.['minlength']) {
      return 'Summary must be at least 2 characters';
    }
    if (ctrl.errors?.['maxlength']) {
      return 'Summary must be at less  80 characters';
    }

    return '';
  }

  get descriptionErrorMessage(): string {
    const ctrl = this.descriptionControl;

    if (ctrl.errors?.['maxlength']) {
      return 'Description must be at less  80 characters';
    }

    return '';
  }

  constructor(
    private sideBarService: SideBarService,
    private notification: NotificationService,
  ) {
    this.projectControl = new FormControl(this.issueTypeControltest, [
      Validators.required,
    ]);
    this.issueTypeControl = new FormControl(this.issueTypeControltest, [
      Validators.required,
    ]);
    this.summaryControl = new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(80),
    ]);
    this.descriptionControl = new FormControl('', [Validators.maxLength(5000)]);
  }

  ngOnInit(): void {
    this.taskCreateForm = new FormGroup({
      projectControl: this.projectControl,
      issueTypeControl: this.issueTypeControl,
      summaryControl: this.summaryControl,
      descriptionControl: this.descriptionControl,
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openSidebar(): void {
    this.sideBarService.toggle();
  }

  onSubmit() {
    console.log(this.taskCreateForm.value);
  }

  public submitForm(): void {
    if (!this.taskCreateForm.valid || !this.taskCreateForm.dirty) {
      if (!this.summaryControl.valid)
        this.notification.error('Issue name is required');

      this.notification.error(
        this.summaryControl.valid + 'Invalid values' + this.summaryErrorMessage,
      );

      console.log('Invalid values');
      return;
    }
    console.log('valid values');
  }
}
