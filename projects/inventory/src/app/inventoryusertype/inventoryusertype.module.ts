import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryusertypeRoutingModule } from './inventoryusertype-routing.module';
import { SchoolComponent } from './school/school.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';
import { InventorySharedModule } from '../inventory-shared/inventory-shared.module'

@NgModule({
  imports: [
    CommonModule,
    InventoryusertypeRoutingModule,
    InventorySharedModule
  ],
  declarations: [SchoolComponent, SchoolDashboardComponent]
})
export class InventoryusertypeModule { }
