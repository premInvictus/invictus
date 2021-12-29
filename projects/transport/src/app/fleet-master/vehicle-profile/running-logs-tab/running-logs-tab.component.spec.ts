import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningLogsTabComponent } from './running-logs-tab.component';

describe('RunningLogsTabComponent', () => {
  let component: RunningLogsTabComponent;
  let fixture: ComponentFixture<RunningLogsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunningLogsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunningLogsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
