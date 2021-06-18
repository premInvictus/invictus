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

@NgModule({
  imports: [
    CommonModule,
    FleetMasterRoutingModule,
    LoadingModule,
    TransportSharedModule
  ],
  declarations: [VehicleProfileComponent, StaffProfileComponent, RouteManagementComponent, AssignStudentsComponent, VehicleComponent, AddVehicleComponent, AddTransportStaffComponent],
  entryComponents:[AddVehicleComponent,AddTransportStaffComponent]
})
export class FleetMasterModule { }
