import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessdateModalComponent } from './processdate-modal.component';

describe('ProcessdateModalComponent', () => {
  let component: ProcessdateModalComponent;
  let fixture: ComponentFixture<ProcessdateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessdateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
