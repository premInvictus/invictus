import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceLogsComponent } from './service-logs/service-logs.component';
import { FuelLogsComponent } from './fuel-logs/fuel-logs.component';
import { FleetDashboardComponent } from './fleet-dashboard/fleet-dashboard.component';
import { RemindersComponent } from './reminders/reminders.component';
import { DeviceMappingComponent } from './device-mapping/device-mapping.component';

const routes: Routes = [
  {path:'service-logs',component:ServiceLogsComponent},
  {path:'fuel-logs',component:FuelLogsComponent},
  {path:'fleet-dashboard',component:FleetDashboardComponent},
  {path:'reminders',component:RemindersComponent},
  {path:'device-mapping',component:DeviceMappingComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransportAuxillariesRoutingModule { }
