import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards/index';
import { SchoolComponent } from './school/school.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';
import { StudentMasterThemeTwoModule } from '../student-master-theme-two/student-master-theme-two.module';
import { UserCredentialComponent } from './user-credential/user-credential.component';
import { AuxillaryToolsModule } from './../auxillary-tools/auxillary-tools.module';
import { AdmissionToolsModule } from './../admission-tools/admission-tools.module';
import { StandardReportsModule } from './../standard-reports/standard-reports.module';
import { DynamicReportsModule } from './../dynamic-reports/dynamic-reports.module';
import { SetupModule } from './../setup/setup.module';
import { ManageUsersModule } from './../manage-users/manage-users.module';
import { SchedulerNotificationsModule } from './../scheduler-notifications/scheduler-notifications.module';
/* import {theme} from '../app.routing';
let pathJSON = {};
if (theme === '1') {
  pathJSON =   {path: 'studentmaster', loadChildren: './../student-master/studentmaster.module#StudentMasterModule'};
} else {
  pathJSON =  {path: 'studentmaster',
  loadChildren: './../student-master-theme-two/student-master-theme-two.module#StudentMasterThemeTwoModule'};
} */
const routes: Routes = [
	{path: '', redirectTo: 'school', pathMatch: 'full'},
	{
		path: 'school', component: SchoolComponent, children: [
			{ path: '', component: SchoolDashboardComponent },
			{ path: 'studentmaster',
			loadChildren: 'projects/sis/src/app/student-master-theme-two/student-master-theme-two.module#StudentMasterThemeTwoModule'},
			{ path: 'auxilliarytool',
			loadChildren: 'projects/sis/src/app/auxillary-tools/auxillary-tools.module#AuxillaryToolsModule'},
			{ path: 'admissiontool',
			loadChildren: 'projects/sis/src/app/admission-tools/admission-tools.module#AdmissionToolsModule'},
			{ path: 'standardreports',
			loadChildren: 'projects/sis/src/app/standard-reports/standard-reports.module#StandardReportsModule'},
			{ path: 'dynamicreports',
			loadChildren: 'projects/sis/src/app/dynamic-reports/dynamic-reports.module#DynamicReportsModule'},
			{ path: 'setup',
			loadChildren: 'projects/sis/src/app/setup/setup.module#SetupModule'},
			{ path: 'manage-users',
			loadChildren: 'projects/sis/src/app/manage-users/manage-users.module#ManageUsersModule'},
			{ path: 'notifications',
			loadChildren: 'projects/sis/src/app/scheduler-notifications/scheduler-notifications.module#SchedulerNotificationsModule'},
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
