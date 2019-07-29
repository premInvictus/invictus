import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { UserCredentialComponent } from './user-credential/user-credential.component';
import { AuthGuard } from '../_guards/auth.guard';
import { ProjectComponent } from 'src/app/invictus-shared/project/project.component';
import { MakePaymentComponent } from './../student-fee/make-payment/make-payment.component';
const routes: Routes = [
	{
		path: '',
		component: ProjectComponent,
		canActivate: [AuthGuard],
		children: [
			{ path: '', component: StudentDashboardComponent },
			{
				path: 'report',
				loadChildren: 'projects/student-app/src/app/reports/reports.module#ReportsModule'
			},
			{
				path: 'eassessment',
				loadChildren: '../eassessment/eassessment.module#EassessmentModule'
			},
			{
				path: 'fees',
				loadChildren: '../student-fee/student-fee.module#StudentFeeModule'
			},
			{ path: 'user-credential', component: UserCredentialComponent }
		]
	},
	{
		path: 'test',
		canActivate: [AuthGuard],
		loadChildren: '../test-engine/test-engine.module#TestEngineModule'
	},
	{ 	path: 'make-payment',
		canActivate: [AuthGuard],
		component: MakePaymentComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class StudentUserTypeRoutingModule { }
