import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMasterReportsComponent } from './item-master-reports.component';

describe('ItemMasterReportsComponent', () => {
  let component: ItemMasterReportsComponent;
  let fixture: ComponentFixture<ItemMasterReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMasterReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMasterReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
