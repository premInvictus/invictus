import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueReturnComponent } from './issue-return.component';

describe('IssueReturnComponent', () => {
  let component: IssueReturnComponent;
  let fixture: ComponentFixture<IssueReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
