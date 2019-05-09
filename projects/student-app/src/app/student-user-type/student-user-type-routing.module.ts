import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { ReportsModule } from '../reports/reports.module';
import { EassessmentModule } from '../eassessment/eassessment.module';
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
				loadChildren: () => ReportsModule
			},
			{
				path: 'eassessment',
				loadChildren: () => EassessmentModule
			},
			{ path: 'user-credential', component: UserCredentialComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class StudentUserTypeRoutingModule {}
