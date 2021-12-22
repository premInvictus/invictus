import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksInputComponent } from './marks-input.component';

describe('MarksInputComponent', () => {
  let component: MarksInputComponent;
  let fixture: ComponentFixture<MarksInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarksInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarksInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
