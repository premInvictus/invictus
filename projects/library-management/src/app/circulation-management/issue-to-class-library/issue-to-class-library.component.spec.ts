import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueToClassLibraryComponent } from './issue-to-class-library.component';

describe('IssueToClassLibraryComponent', () => {
  let component: IssueToClassLibraryComponent;
  let fixture: ComponentFixture<IssueToClassLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueToClassLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueToClassLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
