import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Reports2Component } from './reports2.component';

describe('Reports2Component', () => {
  let component: Reports2Component;
  let fixture: ComponentFixture<Reports2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Reports2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Reports2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
