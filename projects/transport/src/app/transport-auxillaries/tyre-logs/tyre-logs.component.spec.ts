import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TyreLogsComponent } from './tyre-logs.component';

describe('TyreLogsComponent', () => {
  let component: TyreLogsComponent;
  let fixture: ComponentFixture<TyreLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TyreLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TyreLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
