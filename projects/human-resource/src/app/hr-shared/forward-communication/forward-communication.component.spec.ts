import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardCommunicationComponent } from './forward-communication.component';

describe('ForwardCommunicationComponent', () => {
  let component: ForwardCommunicationComponent;
  let fixture: ComponentFixture<ForwardCommunicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForwardCommunicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForwardCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
