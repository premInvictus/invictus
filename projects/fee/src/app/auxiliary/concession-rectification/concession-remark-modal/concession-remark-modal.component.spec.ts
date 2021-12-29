import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcessionRemarkModalComponent } from './concession-remark-modal.component';

describe('ConcessionRemarkModalComponent', () => {
  let component: ConcessionRemarkModalComponent;
  let fixture: ComponentFixture<ConcessionRemarkModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcessionRemarkModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcessionRemarkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
