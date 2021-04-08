import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteWithReasonComponent } from './delete-with-reason.component';

describe('DeleteWithReasonComponent', () => {
  let component: DeleteWithReasonComponent;
  let fixture: ComponentFixture<DeleteWithReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteWithReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteWithReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
