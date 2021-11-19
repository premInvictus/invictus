import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAsssignmentComponent } from './view-asssignment.component';

describe('ViewAsssignmentComponent', () => {
  let component: ViewAsssignmentComponent;
  let fixture: ComponentFixture<ViewAsssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAsssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAsssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
