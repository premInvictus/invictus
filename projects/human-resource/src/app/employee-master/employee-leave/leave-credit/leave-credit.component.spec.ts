import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveCreditComponent } from './leave-credit.component';

describe('LeaveCreditComponent', () => {
  let component: LeaveCreditComponent;
  let fixture: ComponentFixture<LeaveCreditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveCreditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
