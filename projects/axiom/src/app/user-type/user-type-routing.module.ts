import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, RouteAccessGuard } from '../_guards/index';
import { AdminComponent } from './admin/admin.component';
import { TeacherComponent } from './teacher/teacher.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
import { SchoolComponent } from './school/school.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';
import { SchoolsetupComponent } from './admin/schoolsetup/schoolsetup.component';
import { AccesscontrolComponent } from './admin/accesscontrol/accesscontrol.component';
import { CreateNewUserComponent } from './admin/create-new-user/create-new-user.component';
import { ManageAccessComponent } from './admin/manage-access/manage-access.component';
import { CreateNewSchoolComponent } from './admin/create-new-school/create-new-school.component';
import { UserCredentialComponent } from './user-credential/user-credential.component';
const routes: Routes = [
	{
		path: '',
		redirectTo: 'school',
		pathMatch: 'full'
	},


	{
		path: 'admin',
		component: AdminComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'setup',
				loadChildren: '../acsetup/acsetup.module#AcsetupModule'
			},
			{
				path: 'questionbank',
				loadChildren: '../questionbank/questionbank.module#QuestionbankModule'
			},
			{
				path: 'question',
				loadChildren: '../question/question.module#QuestionModule'
			},
			{
				path: 'review',
				loadChildren: '../secondaryreview/secondaryreview.module#SecondaryreviewModule'
			},
			{ path: '', component: AdminDashboardComponent },
			{
				path: 'schoolsetup',
				component: SchoolsetupComponent,
				canActivate: [RouteAccessGuard]
			},
			{
				path: 'accesscontrol',
				component: AccesscontrolComponent,
				canActivate: [RouteAccessGuard]
			},
			{ path: 'create_new_user', component: CreateNewUserComponent },
			{ path: 'manage-access/:id', component: ManageAccessComponent },
			{ path: 'create-new-school', component: CreateNewSchoolComponent },
			{ path: 'user-credential', component: UserCredentialComponent }
		]
	},
	{
		path: 'teacher',
		component: TeacherComponent,
		canActivate: [AuthGuard],
		children: [
			{ path: '', component: TeacherDashboardComponent },
			{
				path: 'questionbank',
				loadChildren: '../questionbank/questionbank.module#QuestionbankModule'
			},
			{
				path: 'question',
				loadChildren: '../question/question.module#QuestionModule'
			},
			{
				path: 'template',
				loadChildren: '../questiontemplate/questiontemplate.module#QuestiontemplateModule'
			},
			{
				path: 'questionpaper',
				loadChildren: '../questionpaper/questionpaper.module#QuestionpaperModule'
			},
			{
				path: 'eassessment',
				loadChildren: 'projects/axiom/src/app/eassessment/eassessment.module#EassessmentModule'
			},
			{
				path: 'eevaluation',
				loadChildren: '../eevaluation/eevaluation.module#EevaluationModule'
			},
			{
				path: 'question_paper_setup',
				loadChildren: '../question-paper-setup/question-paper-setup.module#QuestionPaperSetupModule'
			},
			{
				path: 'report',
				loadChildren: 'projects/axiom/src/app/reports/reports.module#ReportsModule'
			},
			{
				path: 'class-reports',
				loadChildren: '../class-performance-reports/class-performance-reports.module#ClassPerformanceReportsModule'
			},
			{
				path: 'student-reports',
				loadChildren: '../student-reports/student-reports.module#StudentReportsModule'
			},
			{
				path: 'test-report',
				loadChildren: '../test-reports/test-reports.module#TestReportsModule'
			},
			{ path: 'user-credential', component: UserCredentialComponent }
		]
	},
	{
		path: 'school',
		component: SchoolComponent,
		children: [
			{ path: '', component: SchoolDashboardComponent },
			{
				path: 'setup',
				loadChildren: '../acsetup/acsetup.module#AcsetupModule'
			},
			{
				path: 'questionbank',
				loadChildren: '../questionbank/questionbank.module#QuestionbankModule'
			},
			{
				path: 'question',
				loadChildren: '../question/question.module#QuestionModule'
			},
			{
				path: 'review',
				loadChildren: '../secondaryreview/secondaryreview.module#SecondaryreviewModule'
			},
			{
				path: 'template',
				loadChildren: '../questiontemplate/questiontemplate.module#QuestiontemplateModule'
			},
			{
				path: 'questionpaper',
				loadChildren: '../questionpaper/questionpaper.module#QuestionpaperModule'
			},
			{
				path: 'eassessment',
				loadChildren: 'projects/axiom/src/app/eassessment/eassessment.module#EassessmentModule'
			},
			{
				path: 'eevaluation',
				loadChildren: '../eevaluation/eevaluation.module#EevaluationModule'
			},
			{
				path: 'question_paper_setup',
				loadChildren: '../question-paper-setup/question-paper-setup.module#QuestionPaperSetupModule'
			},
			{
				path: 'report',
				loadChildren: 'projects/axiom/src/app/reports/reports.module#ReportsModule'
			},
			{
				path: 'class-reports',
				loadChildren: '../class-performance-reports/class-performance-reports.module#ClassPerformanceReportsModule'
			},
			{
				path: 'student-reports',
				loadChildren: '../student-reports/student-reports.module#StudentReportsModule'
			},
			{
				path: 'test-report',
				loadChildren: '../test-reports/test-reports.module#TestReportsModule'
			},
			{ path: 'user-credential', component: UserCredentialComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class UserTypeRoutingModule { }
