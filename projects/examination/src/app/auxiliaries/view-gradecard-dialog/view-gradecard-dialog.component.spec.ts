import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGradecardDialogComponent } from './view-gradecard-dialog.component';

describe('ViewGradecardDialogComponent', () => {
  let component: ViewGradecardDialogComponent;
  let fixture: ComponentFixture<ViewGradecardDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGradecardDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGradecardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
