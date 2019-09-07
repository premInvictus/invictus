import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksEntrySecondaryComponent } from './marks-entry-secondary.component';

describe('MarksEntrySecondaryComponent', () => {
  let component: MarksEntrySecondaryComponent;
  let fixture: ComponentFixture<MarksEntrySecondaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarksEntrySecondaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarksEntrySecondaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
