import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowupRemarksThemeTwoComponent } from './followup-remarks-theme-two.component';

describe('FollowupRemarksThemeTwoComponent', () => {
  let component: FollowupRemarksThemeTwoComponent;
  let fixture: ComponentFixture<FollowupRemarksThemeTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowupRemarksThemeTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowupRemarksThemeTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
