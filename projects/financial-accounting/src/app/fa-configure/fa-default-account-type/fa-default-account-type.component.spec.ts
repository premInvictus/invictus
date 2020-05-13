import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultAccountTypeComponent } from './fa-default-account-type.component';

describe('DefaultAccountTypeComponent', () => {
  let component: DefaultAccountTypeComponent;
  let fixture: ComponentFixture<DefaultAccountTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultAccountTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultAccountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
