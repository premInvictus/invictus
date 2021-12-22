import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeFilterModalComponent } from './fee-filter-modal.component';

describe('FeeFilterModalComponent', () => {
  let component: FeeFilterModalComponent;
  let fixture: ComponentFixture<FeeFilterModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeFilterModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
