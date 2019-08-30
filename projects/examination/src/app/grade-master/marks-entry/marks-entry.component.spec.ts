import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksEntryComponent } from './marks-entry.component';

describe('MarksEntryComponent', () => {
  let component: MarksEntryComponent;
  let fixture: ComponentFixture<MarksEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarksEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarksEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
