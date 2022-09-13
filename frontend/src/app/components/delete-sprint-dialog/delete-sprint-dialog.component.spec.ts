import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSprintDialogComponent } from './delete-sprint-dialog.component';

describe('DeleteSprintDialogComponent', () => {
  let component: DeleteSprintDialogComponent;
  let fixture: ComponentFixture<DeleteSprintDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSprintDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteSprintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
