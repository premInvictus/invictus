import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransportAuxillariesRoutingModule } from './transport-auxillaries-routing.module';
import { ServiceLogsComponent } from './service-logs/service-logs.component';
import { FuelLogsComponent } from './fuel-logs/fuel-logs.component';
import { FleetDashboardComponent } from './fleet-dashboard/fleet-dashboard.component';
import { RemindersComponent } from './reminders/reminders.component';
import { DeviceMappingComponent } from './device-mapping/device-mapping.component';

@NgModule({
  imports: [
    CommonModule,
    TransportAuxillariesRoutingModule
  ],
  declarations: [ServiceLogsComponent, FuelLogsComponent, FleetDashboardComponent, RemindersComponent, DeviceMappingComponent]
})
export class TransportAuxillariesModule { }
