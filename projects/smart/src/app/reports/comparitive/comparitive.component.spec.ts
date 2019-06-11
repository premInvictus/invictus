import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparitiveComponent } from './comparitive.component';

describe('ComparitiveComponent', () => {
  let component: ComparitiveComponent;
  let fixture: ComponentFixture<ComparitiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparitiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparitiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
