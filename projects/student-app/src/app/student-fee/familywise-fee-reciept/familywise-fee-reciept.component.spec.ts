import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilywiseFeeRecieptComponent } from './familywise-fee-reciept.component';

describe('FamilywiseFeeRecieptComponent', () => {
  let component: FamilywiseFeeRecieptComponent;
  let fixture: ComponentFixture<FamilywiseFeeRecieptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilywiseFeeRecieptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilywiseFeeRecieptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
