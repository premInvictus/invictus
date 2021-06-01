import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_guards';
import { ProjectComponent } from '../../../../../src/app/invictus-shared/project/project.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';
const routes: Routes = [
	{
		path: '', canActivate: [AuthGuard], redirectTo: 'school', pathMatch: 'full'
	},
	{
		path: 'school', canActivate: [AuthGuard], component: ProjectComponent, children: [
			{ path: '', component: SchoolDashboardComponent },
			{ path: 'fleet-master', loadChildren:  '../fleet-master/fleet-master.module#FleetMasterModule' },
			{ path: 'fleet-management', loadChildren:  '../fleet-management/fleet-management.module#FleetManagementModule' },
			{ path: 'reports', loadChildren:  '../transport-reports/transport-reports.module#TransportReportsModule' },
			{ path: 'configure', loadChildren:  '../transport-configure/transport-configure.module#TransportConfigureModule' },
			{ path: 'auxillaries', loadChildren:  '../transport-auxillaries/transport-auxillaries.module#TransportAuxillariesModule' },
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers: [AuthGuard]
})
export class TransportusertypeRoutingModule { }
 