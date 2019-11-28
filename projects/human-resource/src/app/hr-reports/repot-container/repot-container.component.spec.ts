import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepotContainerComponent } from './repot-container.component';

describe('RepotContainerComponent', () => {
  let component: RepotContainerComponent;
  let fixture: ComponentFixture<RepotContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepotContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepotContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
