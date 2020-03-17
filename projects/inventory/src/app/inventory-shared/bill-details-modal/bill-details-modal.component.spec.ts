import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillDetailsModalComponent } from './bill-details-modal.component';

describe('BillDetailsModalComponent', () => {
  let component: BillDetailsModalComponent;
  let fixture: ComponentFixture<BillDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
