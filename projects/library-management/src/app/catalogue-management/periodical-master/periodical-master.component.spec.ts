import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodicalMasterComponent } from './periodical-master.component';

describe('PeriodicalMasterComponent', () => {
  let component: PeriodicalMasterComponent;
  let fixture: ComponentFixture<PeriodicalMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodicalMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodicalMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
