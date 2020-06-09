import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { UserCredentialComponent } from 'src/app/invictus-shared/user-credential/user-credential.component';
import { AuthGuard } from '../_guards/auth.guard';
import { ProjectComponent } from 'src/app/invictus-shared/project/project.component';
import { MakePaymentComponent } from './../student-fee/make-payment/make-payment.component';
import { NotificationPageComponent } from 'src/app/login/notification-page/notification-page.component';
import { MakePaymentBasedonproviderComponent } from '../student-fee/make-payment-basedonprovider/make-payment-basedonprovider.component';
import { MakePaymentViaEazypayComponent } from '../student-fee/make-payment-via-eazypay/make-payment-via-eazypay.component';
import { ViewStudentProfileComponent } from '../shared-module/view-student-profile/view-student-profile.component';
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
			{
				path: 'academics',
				loadChildren: '../academics/academics.module#AcademicsModule'
			},
			{
				path: 'library',
				loadChildren: '../library/library.module#LibraryModule'
			},
			{ path: 'user-credential', component: UserCredentialComponent },
			{ path: 'communication', loadChildren: '../student-messages/student-messages.module#StudentMessagesModule' },
			{ path: 'notification', component: NotificationPageComponent },
			{ path: 'view-profile-student', component: ViewStudentProfileComponent },
			{
				path: 'notice',
				loadChildren: '../notice-board/notice-board.module#NoticeBoardModule'
			},
		]
	},
	{
		path: 'test',
		canActivate: [AuthGuard],
		loadChildren: '../test-engine/test-engine.module#TestEngineModule'
	},
	{
		path: 'make-payment',
		canActivate: [AuthGuard],
		component: MakePaymentBasedonproviderComponent
	},
	{
		path: 'make-paymentviapg',
		canActivate: [AuthGuard],
		component: MakePaymentComponent
	},
	{
		path: 'make-paymentviaeazypay',
		canActivate: [AuthGuard],
		component: MakePaymentViaEazypayComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class StudentUserTypeRoutingModule { }
