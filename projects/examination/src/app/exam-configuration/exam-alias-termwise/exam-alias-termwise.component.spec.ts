import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamAliasTermwiseComponent } from './exam-alias-termwise.component';

describe('ExamAliasTermwiseComponent', () => {
  let component: ExamAliasTermwiseComponent;
  let fixture: ComponentFixture<ExamAliasTermwiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamAliasTermwiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamAliasTermwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
