import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { UserCredentialComponent } from './user-credential/user-credential.component';
import {AuthGuard} from '../_guards/auth.guard';
const routes: Routes = [
	{
		path: '',
		component: StudentComponent,
		canActivate: [AuthGuard],
		children: [
			{ path: '', component: StudentDashboardComponent },
			{
				path: 'report',
				loadChildren: '../reports/reports.module#ReportsModule'
			},
			{
				path: 'eassessment',
				loadChildren: '../eassessment/eassessment.module#EassessmentModule'
			},
			{ path: 'user-credential', component: UserCredentialComponent }
		]
	},
	{
		path: 'test',
		loadChildren: '../test-engine/test-engine.module#TestEngineModule'
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class StudentUserTypeRoutingModule {}
