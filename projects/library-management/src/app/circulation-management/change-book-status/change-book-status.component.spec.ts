import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeBookStatusComponent } from './change-book-status.component';

describe('ChangeBookStatusComponent', () => {
  let component: ChangeBookStatusComponent;
  let fixture: ComponentFixture<ChangeBookStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeBookStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeBookStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
