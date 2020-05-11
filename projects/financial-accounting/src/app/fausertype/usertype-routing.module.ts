import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards/index';
import { SchoolComponent } from './school/school.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';
import { UserCredentialComponent } from 'src/app/invictus-shared/user-credential/user-credential.component';
import { ProjectComponent } from 'src/app/invictus-shared/project/project.component';
const routes: Routes = [
	{path: 'financial-accounting', canActivate: [AuthGuard] , redirectTo: 'financial-accounting/school', pathMatch: 'full'},
	{
		path: 'school', canActivate: [AuthGuard] , component: ProjectComponent, children: [
			{ path: '', component: SchoolDashboardComponent },
			{ path: 'financial-statements', loadChildren:  '../financial-statements/finanacial-statements.module#FinancialStatementModule' },
			{ path: 'transaction-master', loadChildren:  '../transaction-master/transaction-master.module#TransactionMasterModule' },
			{ path: 'auxiliaries', loadChildren:  '../fa-auxiliaries/auxiliaries.module#AuxiliariesModule' },
			// { path: 'reports', loadChildren:  '../hr-reports/reports.module#ReportsModule' },
			// { path: 'configure', loadChildren:  '../hr-configure/hr-configure.module#HrConfigureModule' },
			// { path: 'leave-management', loadChildren:  '../leave-management/leave-management.module#LeaveManagementModule' },
			// { path: 'communication', loadChildren:  '../employee-messages/employee-messages.module#EmployeeMessagesModule' },
			
		]
	}
];



@NgModule({
	imports: [RouterModule.forChild(routes)],
	providers: [AuthGuard],
	exports: [RouterModule]
})
export class UserTypeRoutingModule {
	constructor() {
	}
}
