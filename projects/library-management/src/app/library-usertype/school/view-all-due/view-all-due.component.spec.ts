import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllDueComponent } from './view-all-due.component';

describe('ViewAllDueComponent', () => {
  let component: ViewAllDueComponent;
  let fixture: ComponentFixture<ViewAllDueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllDueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllDueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
