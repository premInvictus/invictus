import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleProfileComponent } from './vehicle-profile/vehicle-profile.component';
import { StaffProfileComponent } from './staff-profile/staff-profile.component';
import { RouteManagementComponent } from './route-management/route-management.component';
import { AssignStudentsComponent } from './assign-students/assign-students.component';

const routes: Routes = [
  {path:'vehicle-profile',component:VehicleProfileComponent},
  {path:'staff-profile',component:StaffProfileComponent},
  {path:'route-management',component:RouteManagementComponent},
  {path:'assign-students',component:AssignStudentsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetMasterRoutingModule { }
