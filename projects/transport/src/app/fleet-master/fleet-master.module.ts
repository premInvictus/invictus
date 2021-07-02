import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingModule } from 'ngx-loading';
import { TransportSharedModule } from '../transport-shared/transport-shared.module';
import { FleetMasterRoutingModule } from './fleet-master-routing.module';
import { VehicleProfileComponent } from './vehicle-profile/vehicle-profile.component';
import { StaffProfileComponent } from './staff-profile/staff-profile.component';
import { RouteManagementComponent } from './route-management/route-management.component';
import { AssignStudentsComponent } from './assign-students/assign-students.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { AddTransportStaffComponent } from './add-transport-staff/add-transport-staff.component';
import { ServiceLogsTabComponent } from './vehicle-profile/service-logs-tab/service-logs-tab.component';
import { FuelLogsTabComponent } from './vehicle-profile/fuel-logs-tab/fuel-logs-tab.component';
import { TyreLogsTabComponent } from './vehicle-profile/tyre-logs-tab/tyre-logs-tab.component';
import { VehicleCommonProfileComponent } from './vehicle-profile/vehicle-common-profile/vehicle-common-profile.component';
import { RunningLogsTabComponent } from './vehicle-profile/running-logs-tab/running-logs-tab.component';
import { ServiceLogItemsComponent } from '../transport-auxillaries/service-log-items/service-log-items.component';
import { VehicleStaffProfileComponent } from './vehicle-profile/vehicle-staff-profile/vehicle-staff-profile.component';

@NgModule({
  imports: [
    CommonModule,
    FleetMasterRoutingModule,
    LoadingModule,
    TransportSharedModule
  ],
  declarations: [VehicleProfileComponent, StaffProfileComponent, RouteManagementComponent, AssignStudentsComponent, VehicleComponent, AddVehicleComponent, AddTransportStaffComponent, ServiceLogsTabComponent, FuelLogsTabComponent, TyreLogsTabComponent, VehicleCommonProfileComponent, RunningLogsTabComponent,ServiceLogItemsComponent, VehicleStaffProfileComponent],
  entryComponents:[AddVehicleComponent,AddTransportStaffComponent,ServiceLogItemsComponent]
})
export class FleetMasterModule { }
