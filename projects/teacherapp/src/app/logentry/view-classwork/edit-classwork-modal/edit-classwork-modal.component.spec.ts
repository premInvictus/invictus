import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClassworkModalComponent } from './edit-classwork-modal.component';

describe('EditClassworkModalComponent', () => {
  let component: EditClassworkModalComponent;
  let fixture: ComponentFixture<EditClassworkModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditClassworkModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClassworkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
