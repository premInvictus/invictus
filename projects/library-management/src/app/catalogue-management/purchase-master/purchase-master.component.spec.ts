import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseMasterComponent } from './purchase-master.component';

describe('PurchaseMasterComponent', () => {
  let component: PurchaseMasterComponent;
  let fixture: ComponentFixture<PurchaseMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
