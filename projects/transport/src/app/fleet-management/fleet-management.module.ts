import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FleetManagementRoutingModule } from './fleet-management-routing.module';
import { StartStopTripComponent } from './start-stop-trip/start-stop-trip.component';
import { LiveLocationComponent } from './live-location/live-location.component';
import { AttendanceComponent } from './attendance/attendance.component';

@NgModule({
  imports: [
    CommonModule,
    FleetManagementRoutingModule
  ],
  declarations: [StartStopTripComponent, LiveLocationComponent, AttendanceComponent]
})
export class FleetManagementModule { }
