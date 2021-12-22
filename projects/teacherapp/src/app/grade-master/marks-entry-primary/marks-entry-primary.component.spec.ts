import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksEntryPrimaryComponent } from './marks-entry-primary.component';

describe('MarksEntryPrimaryComponent', () => {
  let component: MarksEntryPrimaryComponent;
  let fixture: ComponentFixture<MarksEntryPrimaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarksEntryPrimaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarksEntryPrimaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
