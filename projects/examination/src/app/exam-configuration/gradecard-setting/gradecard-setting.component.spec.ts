import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GradecardSettingComponent } from './gradecard-setting.component';

describe('GradecardSettingComponent', () => {
  let component: GradecardSettingComponent;
  let fixture: ComponentFixture<GradecardSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GradecardSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradecardSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
