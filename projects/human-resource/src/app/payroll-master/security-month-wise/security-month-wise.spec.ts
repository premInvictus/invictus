import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityDetailComponent } from './security-month-wise.component';

describe('SecurityDetailComponent', () => {
  let component: SecurityDetailComponent;
  let fixture: ComponentFixture<SecurityDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
