import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsofAccountComponent } from './chart-of-accounts.component';

describe('ChartsofAccountComponent', () => {
  let component: ChartsofAccountComponent;
  let fixture: ComponentFixture<ChartsofAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartsofAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsofAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
