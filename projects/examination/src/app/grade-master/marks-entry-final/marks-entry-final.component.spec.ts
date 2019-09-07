import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksEntryFinalComponent } from './marks-entry-final.component';

describe('MarksEntryFinalComponent', () => {
  let component: MarksEntryFinalComponent;
  let fixture: ComponentFixture<MarksEntryFinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarksEntryFinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarksEntryFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
