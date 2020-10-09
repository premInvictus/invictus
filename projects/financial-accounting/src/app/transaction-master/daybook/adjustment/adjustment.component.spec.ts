import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeDueComponent } from './income-due.component';

describe('IncomeDueComponent', () => {
  let component: IncomeDueComponent;
  let fixture: ComponentFixture<IncomeDueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeDueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeDueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
