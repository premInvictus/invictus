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
			{ path: 'employee', loadChildren:  '../employee-master/employee-master.module#EmployeeMasterModule' },
			{ path: 'payroll-master', loadChildren:  '../payroll-master/payroll-master.module#PayrollMasterModule' },
			{ path: 'auxillaries', loadChildren:  '../hr-auxiliaries/auxiliaries.module#AuxiliariesModule' },
			{ path: 'reports', loadChildren:  '../hr-reports/reports.module#ReportsModule' },
			{ path: 'configure', loadChildren:  '../hr-configure/hr-configure.module#HrConfigureModule' },
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers: [AuthGuard]
})
export class HrusertypeRoutingModule { }
