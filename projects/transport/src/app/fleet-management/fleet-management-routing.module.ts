import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartStopTripComponent } from './start-stop-trip/start-stop-trip.component';
import { LiveLocationComponent } from './live-location/live-location.component';
import { AttendanceComponent } from './attendance/attendance.component';

const routes: Routes = [
  {path:'start-stop-trip',component:StartStopTripComponent},
  {path:'live-location',component:LiveLocationComponent},
  {path:'attendance',component:AttendanceComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetManagementRoutingModule { }
