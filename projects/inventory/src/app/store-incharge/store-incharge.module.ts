import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreInchargeRoutingModule } from './store-incharge-routing.module';
import { AssignStoreComponent } from './assign-store/assign-store.component';
import { InventorySharedModule } from '../inventory-shared/inventory-shared.module';
import { StoreAssignListComponent } from './store-assign-list/store-assign-list.component';
import { GenerateBillComponent } from './generate-bill/generate-bill.component';


@NgModule({
  imports: [
    CommonModule,
    StoreInchargeRoutingModule,
    InventorySharedModule
  ],
  declarations: [AssignStoreComponent, StoreAssignListComponent, GenerateBillComponent]
})
export class StoreInchargeModule { }
