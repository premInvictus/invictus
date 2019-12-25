import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemsBranchTransferComponent } from './add-items-branch-transfer.component';

describe('AddItemsBranchTransferComponent', () => {
  let component: AddItemsBranchTransferComponent;
  let fixture: ComponentFixture<AddItemsBranchTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddItemsBranchTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemsBranchTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
