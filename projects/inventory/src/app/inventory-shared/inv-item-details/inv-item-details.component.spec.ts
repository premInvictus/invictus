import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvItemDetailsComponent } from './inv-item-details.component';

describe('InvItemDetailsComponent', () => {
  let component: InvItemDetailsComponent;
  let fixture: ComponentFixture<InvItemDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvItemDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
