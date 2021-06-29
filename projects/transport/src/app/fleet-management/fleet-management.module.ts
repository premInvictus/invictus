import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingModule } from 'ngx-loading';
import { TransportSharedModule } from '../transport-shared/transport-shared.module';
import { FleetManagementRoutingModule } from './fleet-management-routing.module';
import { StartStopTripComponent } from './start-stop-trip/start-stop-trip.component';
import { LiveLocationComponent } from './live-location/live-location.component';
import { AttendanceComponent } from './attendance/attendance.component';

@NgModule({
  imports: [
    CommonModule,
    FleetManagementRoutingModule,
    LoadingModule,
    TransportSharedModule
  ],
  declarations: [StartStopTripComponent, LiveLocationComponent, AttendanceComponent]
})
export class FleetManagementModule { }
