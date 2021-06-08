import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FleetMasterRoutingModule } from './fleet-master-routing.module';
import { VehicleProfileComponent } from './vehicle-profile/vehicle-profile.component';
import { StaffProfileComponent } from './staff-profile/staff-profile.component';
import { RouteManagementComponent } from './route-management/route-management.component';
import { AssignStudentsComponent } from './assign-students/assign-students.component';

@NgModule({
  imports: [
    CommonModule,
    FleetMasterRoutingModule
  ],
  declarations: [VehicleProfileComponent, StaffProfileComponent, RouteManagementComponent, AssignStudentsComponent]
})
export class FleetMasterModule { }
