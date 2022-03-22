import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TyreLogReportsComponent } from './tyre-log-reports/tyre-log-reports.component';
import { ReportComponent } from './report/report.component'
import { FuelLogReportsComponent } from './fuel-log-reports/fuel-log-reports.component';
import { ServiceLogReportsComponent } from './service-log-reports/service-log-reports.component';
import { RunningLogReportsComponent } from './running-log-reports/running-log-reports.component';
import { BusAttendanceReportsComponent } from './bus-attendance-report/bus-attendance-report.component';
import { VehicleLogReportsComponent } from './vehicle-log-reports/vehicle-log-reports.component';

const routes: Routes = [
	{ path: '', component: ReportComponent },
	{ path: 'tyre-log-reports', component: TyreLogReportsComponent },
	{ path: 'fuel-log-reports', component: FuelLogReportsComponent },
	{ path: 'running-log-reports', component: RunningLogReportsComponent },
	{ path: 'service-log-reports', component: ServiceLogReportsComponent },
	{ path: 'bus-attendance-report', component: BusAttendanceReportsComponent },
	{ path: 'vehicle-log-reports', component: VehicleLogReportsComponent },
	{ path: 'report', component: ReportComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TransportReportsRoutingModule { }
