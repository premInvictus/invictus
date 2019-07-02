import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards';
import { ProjectComponent } from '../../../../../src/app/invictus-shared/project/project.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
const routes: Routes = [
	{
		path: '', canActivate: [AuthGuard], redirectTo: 'school', pathMatch: 'full'
	},
	{
		path: 'school', canActivate: [AuthGuard], component: ProjectComponent, children: [
			{ path: '', component: SchoolDashboardComponent },
			{ path: 'syllabus', loadChildren: '../syllabus/syllabus.module#SyllabusModule' },
			{ path: 'logentry', loadChildren: '../logentry/logentry.module#LogentryModule' },
			{ path: 'assignment', loadChildren: '../assignment/assignment.module#AssignmentModule' },
			{ path: 'auxillaries', loadChildren: '../auxillaries/auxillaries.module#AuxillariesModule' },
			{ path: 'reports', loadChildren: '../reports/reports.module#SmartReportsModule' },
			{ path: 'smartconfiguration', loadChildren: '../smartconfiguration/smartconfiguration.module#SmartconfigurationModule' }
		]
	},
	{
		path: 'teacher', canActivate: [AuthGuard], component: ProjectComponent, children: [
			{ path: '', component: TeacherDashboardComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers: [AuthGuard]
})
export class SmartusertypeRoutingModule { }
