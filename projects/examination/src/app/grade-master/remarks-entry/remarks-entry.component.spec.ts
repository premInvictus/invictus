import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarksEntryComponent } from './remarks-entry.component';

describe('RemarksEntryComponent', () => {
  let component: RemarksEntryComponent;
  let fixture: ComponentFixture<RemarksEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemarksEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemarksEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
