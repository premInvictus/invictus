import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TyreLogsTabComponent } from './tyre-logs-tab.component';

describe('TyreLogsTabComponent', () => {
  let component: TyreLogsTabComponent;
  let fixture: ComponentFixture<TyreLogsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TyreLogsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TyreLogsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
