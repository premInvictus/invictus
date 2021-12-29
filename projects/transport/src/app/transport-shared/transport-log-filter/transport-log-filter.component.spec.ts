import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportLogFilterComponent } from './transport-log-filter.component';

describe('TransportLogFilterComponent', () => {
  let component: TransportLogFilterComponent;
  let fixture: ComponentFixture<TransportLogFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportLogFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportLogFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
