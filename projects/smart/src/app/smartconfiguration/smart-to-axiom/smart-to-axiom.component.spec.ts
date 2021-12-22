import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartToAxiomComponent } from './smart-to-axiom.component';

describe('SmartToAxiomComponent', () => {
  let component: SmartToAxiomComponent;
  let fixture: ComponentFixture<SmartToAxiomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartToAxiomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartToAxiomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
