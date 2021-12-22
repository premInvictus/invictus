import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchTransferToolComponent } from './branch-transfer-tool.component';

describe('BranchTransferToolComponent', () => {
  let component: BranchTransferToolComponent;
  let fixture: ComponentFixture<BranchTransferToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchTransferToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchTransferToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
