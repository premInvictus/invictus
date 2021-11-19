import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusChecklistComponent } from './bus-checklist.component';

describe('BusChecklistComponent', () => {
  let component: BusChecklistComponent;
  let fixture: ComponentFixture<BusChecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusChecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
