import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GradecardPrintingComponent } from './gradecard-printing.component';

describe('GradecardPrintingComponent', () => {
  let component: GradecardPrintingComponent;
  let fixture: ComponentFixture<GradecardPrintingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GradecardPrintingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradecardPrintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
