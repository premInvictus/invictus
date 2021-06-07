import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoppageComponent } from './stoppage.component';

describe('StoppageComponent', () => {
  let component: StoppageComponent;
  let fixture: ComponentFixture<StoppageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoppageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoppageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
