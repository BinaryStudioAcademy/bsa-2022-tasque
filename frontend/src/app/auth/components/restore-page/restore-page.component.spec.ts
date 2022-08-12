import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestorePageComponent } from './restore-page.component';

describe('RestorePageComponent', () => {
  let component: RestorePageComponent;
  let fixture: ComponentFixture<RestorePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestorePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestorePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
