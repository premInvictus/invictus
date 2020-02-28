import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreInchargeRoutingModule } from './store-incharge-routing.module';
import { AssignStoreComponent } from './assign-store/assign-store.component';
import { InventorySharedModule } from '../inventory-shared/inventory-shared.module';


@NgModule({
  imports: [
    CommonModule,
    StoreInchargeRoutingModule,
    InventorySharedModule
  ],
  declarations: [AssignStoreComponent]
})
export class StoreInchargeModule { }
