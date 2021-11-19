import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FailureListComponent } from './failure-list.component';

describe('FailureListComponent', () => {
  let component: FailureListComponent;
  let fixture: ComponentFixture<FailureListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailureListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
