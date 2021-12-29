import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleintegerComponent } from './singleinteger.component';

describe('SingleintegerComponent', () => {
  let component: SingleintegerComponent;
  let fixture: ComponentFixture<SingleintegerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleintegerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleintegerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
