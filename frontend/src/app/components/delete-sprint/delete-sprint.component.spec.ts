import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSprintComponent } from './delete-sprint.component';

describe('DeleteSprintComponent', () => {
  let component: DeleteSprintComponent;
  let fixture: ComponentFixture<DeleteSprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSprintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteSprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
