import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentAttachmentDialogComponent } from './assignment-attachment-dialog.component';

describe('AssignmentAttachmentDialogComponent', () => {
  let component: AssignmentAttachmentDialogComponent;
  let fixture: ComponentFixture<AssignmentAttachmentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentAttachmentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentAttachmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
