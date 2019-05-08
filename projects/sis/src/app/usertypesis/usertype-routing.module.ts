import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards/index';
import { AdminComponent } from './admin/admin.component';
import { TeacherComponent } from './teacher/teacher.component';
import { StudentComponent } from './student/student.component';
import { SchoolComponent } from './school/school.component';
import { UserRedirectComponent } from './user-redirect/user-redirect.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';
import { ParentComponent } from './parent/parent.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
import { ParentDashboardComponent } from './parent/parent-dashboard/parent-dashboard.component';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
// import { StudentMasterModule } from './../student-master/studentmaster.module';
import { StudentMasterThemeTwoModule } from '../student-master-theme-two/student-master-theme-two.module';
import { UserCredentialComponent } from './user-credential/user-credential.component';
import { ResolverService } from '../_services/resolver.service';
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
			{ path: 'studentmaster', loadChildren: () => StudentMasterThemeTwoModule},
			{ path: 'auxilliarytool', loadChildren: () => AuxillaryToolsModule },
			{ path: 'admissiontool', loadChildren: () => AdmissionToolsModule },
			{ path: 'standardreports', loadChildren: () => StandardReportsModule  },
			{ path: 'dynamicreports', loadChildren: () => DynamicReportsModule },
			{ path: 'setup', loadChildren: () => SetupModule },
			{ path: 'manage-users', loadChildren: () => ManageUsersModule },
			{ path: 'notifications', loadChildren: () => SchedulerNotificationsModule },
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
