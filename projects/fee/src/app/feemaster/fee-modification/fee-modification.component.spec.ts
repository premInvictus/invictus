import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeModificationComponent } from './fee-modification.component';

describe('FeeModificationComponent', () => {
  let component: FeeModificationComponent;
  let fixture: ComponentFixture<FeeModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
