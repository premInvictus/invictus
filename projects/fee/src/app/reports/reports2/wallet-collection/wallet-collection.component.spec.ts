import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCollectionComponent } from './wallet-collection.component';

describe('WalletCollectionComponent', () => {
  let component: WalletCollectionComponent;
  let fixture: ComponentFixture<WalletCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
