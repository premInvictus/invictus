import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkEntrySubmitDialogComponent } from './mark-entry-submit-dialog.component';

describe('MarkEntrySubmitDialogComponent', () => {
  let component: MarkEntrySubmitDialogComponent;
  let fixture: ComponentFixture<MarkEntrySubmitDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkEntrySubmitDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkEntrySubmitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
