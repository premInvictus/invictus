import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSupervisorComponent } from './change-supervisor.component';

describe('ChangeSupervisorComponent', () => {
  let component: ChangeSupervisorComponent;
  let fixture: ComponentFixture<ChangeSupervisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeSupervisorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
