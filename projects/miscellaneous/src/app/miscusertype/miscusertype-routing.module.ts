import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_guards';
import { ProjectComponent } from '../../../../../src/app/invictus-shared/project/project.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';
// import {} from '../employee-master/employee-master.module'
const routes: Routes = [
	{
		path: '', canActivate: [AuthGuard], redirectTo: 'school', pathMatch: 'full'
	},
	{
		path: 'school', canActivate: [AuthGuard], component: ProjectComponent, children: [
			{ path: '', component: SchoolDashboardComponent },
			{ path: 'fms', loadChildren:  '../file-management/file-management.module#FileManagementModule' },
			{ path: 'communication', loadChildren:  '../communication/communication.module#CommunicationModule' },
			{ path: 'reports', loadChildren:  '../misc-reports/reports.module#ReportsModule' },
			{ path: 'configure', loadChildren:  '../misc-configure/misc-configure.module#MiscConfigureModule' },
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers: [AuthGuard]
})
export class MiscusertypeRoutingModule { }
 