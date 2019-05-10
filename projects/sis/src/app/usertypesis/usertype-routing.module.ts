import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards/index';
import { SchoolComponent } from './school/school.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';
import { UserCredentialComponent } from './user-credential/user-credential.component';
/* import {theme} from '../app.routing';
let pathJSON = {};
if (theme === '1') {
  pathJSON =   {path: 'studentmaster', loadChildren: './../student-master/studentmaster.module#StudentMasterModule'};
} else {
  pathJSON =  {path: 'studentmaster',
  loadChildren: './../student-master-theme-two/student-master-theme-two.module#StudentMasterThemeTwoModule'};
} */
const routes: Routes = [
	{path: '', canActivate: [AuthGuard] , redirectTo: 'school', pathMatch: 'full'},
	{
		path: 'school', canActivate: [AuthGuard] , component: SchoolComponent, children: [
			{ path: '', component: SchoolDashboardComponent },
			{ path: 'studentmaster',
			loadChildren: '../student-master-theme-two/student-master-theme-two.module#StudentMasterThemeTwoModule'},
			{ path: 'auxilliarytool',
			loadChildren: '../auxillary-tools/auxillary-tools.module#AuxillaryToolsModule'},
			{ path: 'admissiontool',
			loadChildren: '../admission-tools/admission-tools.module#AdmissionToolsModule'},
			{ path: 'standardreports',
			loadChildren: '../standard-reports/standard-reports.module#StandardReportsModule'},
			{ path: 'dynamicreports',
			loadChildren: '../dynamic-reports/dynamic-reports.module#DynamicReportsModule'},
			{ path: 'setup',
			loadChildren: '../setup/setup.module#SetupModule'},
			{ path: 'manage-users',
			loadChildren: '../manage-users/manage-users.module#ManageUsersModule'},
			{ path: 'notifications',
			loadChildren: '../scheduler-notifications/scheduler-notifications.module#SchedulerNotificationsModule'},
			{ path: 'user-credential', component: UserCredentialComponent }
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
