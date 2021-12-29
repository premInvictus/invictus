import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservoirEditModalComponent } from './reservoir-edit-modal.component';

describe('ReservoirEditModalComponent', () => {
  let component: ReservoirEditModalComponent;
  let fixture: ComponentFixture<ReservoirEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservoirEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservoirEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
