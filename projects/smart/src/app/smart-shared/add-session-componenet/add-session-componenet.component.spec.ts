import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSessionComponenetComponent } from './add-session-componenet.component';

describe('AddSessionComponenetComponent', () => {
  let component: AddSessionComponenetComponent;
  let fixture: ComponentFixture<AddSessionComponenetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSessionComponenetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSessionComponenetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
