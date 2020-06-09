import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VouchersListComponent } from './vouchers-list.component';

describe('VouchersListComponent', () => {
  let component: VouchersListComponent;
  let fixture: ComponentFixture<VouchersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VouchersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VouchersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
