import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingModule } from 'ngx-loading';
import { TransportSharedModule } from '../transport-shared/transport-shared.module';
import { TransportAuxillariesRoutingModule } from './transport-auxillaries-routing.module';
import { ServiceLogsComponent } from './service-logs/service-logs.component';
import { FuelLogsComponent } from './fuel-logs/fuel-logs.component';
import { FleetDashboardComponent } from './fleet-dashboard/fleet-dashboard.component';
import { RemindersComponent } from './reminders/reminders.component';
import { DeviceMappingComponent } from './device-mapping/device-mapping.component';
import { TyreLogsComponent } from './tyre-logs/tyre-logs.component';
// import { ServiceLogItemsComponent } from './service-log-items/service-log-items.component';

@NgModule({
  imports: [
    CommonModule,
    TransportAuxillariesRoutingModule,
    TransportSharedModule,
    LoadingModule
  ],
  declarations: [ServiceLogsComponent, FuelLogsComponent, FleetDashboardComponent, RemindersComponent, DeviceMappingComponent, TyreLogsComponent],
  entryComponents:[]
})
export class TransportAuxillariesModule { }
