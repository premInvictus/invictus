import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeCommunicationModalComponent } from './fee-communication-modal.component';

describe('FeeCommunicationModalComponent', () => {
  let component: FeeCommunicationModalComponent;
  let fixture: ComponentFixture<FeeCommunicationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeCommunicationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeCommunicationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
