import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, RouteAccessGuard } from '../_guards/index';
import { AdminComponent } from './admin/admin.component';
import { TeacherComponent } from './teacher/teacher.component';
import { StudentComponent } from './student/student.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { SchoolComponent } from './school/school.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';
import { SchoolsetupComponent } from './admin/schoolsetup/schoolsetup.component';
import { AccesscontrolComponent } from './admin/accesscontrol/accesscontrol.component';
import { CreateNewUserComponent } from './admin/create-new-user/create-new-user.component';
import { ManageAccessComponent } from './admin/manage-access/manage-access.component';
import { CreateNewSchoolComponent } from './admin/create-new-school/create-new-school.component';
import { UserCredentialComponent } from './user-credential/user-credential.component';
import { QuestionbankModule } from '../questionbank/questionbank.module';
import { QuestionModule } from '../question/question.module';
import { SecondaryreviewModule } from '../secondaryreview/secondaryreview.module';
import { QuestiontemplateModule } from '../questiontemplate/questiontemplate.module';
import { QuestionpaperModule } from '../questionpaper/questionpaper.module';
import { EassessmentModule } from '../eassessment/eassessment.module';
import { EevaluationModule } from '../eevaluation/eevaluation.module';
import { QuestionPaperSetupModule } from '../question-paper-setup/question-paper-setup.module';
import { ReportsModule } from '../reports/reports.module';
import { ClassPerformanceReportsModule } from '../class-performance-reports/class-performance-reports.module';
import { StudentReportsModule } from '../student-reports/student-reports.module';
import { TestReportsModule } from '../test-reports/test-reports.module';
import { AcsetupModule } from '../acsetup/acsetup.module';

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
				loadChildren: () => AcsetupModule
			},
			{
				path: 'questionbank',
				loadChildren: () => QuestionbankModule
			},
			{
				path: 'question',
				loadChildren: () => QuestionModule
			},
			{
				path: 'review',
				loadChildren: () => SecondaryreviewModule
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
	// {
	// 	path: 'student',
	// 	component: StudentComponent,
	// 	canActivate: [AuthGuard],
	// 	children: [
	// 		{ path: '', component: StudentDashboardComponent },
	// 		{
	// 			path: 'report',
	// 			loadChildren: () => ReportsModule
	// 		},
	// 		{
	// 			path: 'eassessment',
	// 			loadChildren: () => EassessmentModule
	// 		},
	// 		{
	// 			path: 'test-report',
	// 			loadChildren: () => TestReportsModule
	// 		},
	// 		{ path: 'user-credential', component: UserCredentialComponent }
	// 	]
	// },
	{
		path: 'teacher',
		component: TeacherComponent,
		canActivate: [AuthGuard],
		children: [
			{ path: '', component: TeacherDashboardComponent },
			{
				path: 'report',
				loadChildren: () => ReportsModule
			},
			{
				path: 'questionbank',
				loadChildren: () => QuestionbankModule
			},
			{
				path: 'template',
				loadChildren: () => QuestiontemplateModule
			},
			{
				path: 'questionpaper',
				loadChildren: () => QuestionpaperModule
			},
			{
				path: 'eassessment',
				loadChildren: () => EassessmentModule
			},
			{
				path: 'eevaluation',
				loadChildren: () => EevaluationModule
			},
			{
				path: 'question_paper_setup',
				loadChildren: () => QuestionPaperSetupModule
			},
			{
				path: 'report',
				loadChildren: () => ReportsModule
			},
			{
				path: 'class-reports',
				loadChildren: () => ClassPerformanceReportsModule
			},
			{
				path: 'student-reports',
				loadChildren: () => StudentReportsModule
			},
			{
				path: 'test-report',
				loadChildren: () => TestReportsModule
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
				loadChildren: () => AcsetupModule
			},
			{
				path: 'questionbank',
				loadChildren: () => QuestionbankModule
			},
			{
				path: 'question',
				loadChildren: () => QuestionModule
			},
			{
				path: 'review',
				loadChildren: () => SecondaryreviewModule
			},
			{
				path: 'template',
				loadChildren: () => QuestiontemplateModule
			},
			{
				path: 'questionpaper',
				loadChildren: () => QuestionpaperModule
			},
			{
				path: 'eassessment',
				loadChildren: () => EassessmentModule
			},
			{
				path: 'eevaluation',
				loadChildren: () => EevaluationModule
			},
			{
				path: 'question_paper_setup',
				loadChildren: () => QuestionPaperSetupModule
			},
			{
				path: 'report',
				loadChildren: () => ReportsModule
			},
			{
				path: 'class-reports',
				loadChildren: () => ClassPerformanceReportsModule
			},
			{
				path: 'student-reports',
				loadChildren: () => StudentReportsModule
			},
			{
				path: 'test-report',
				loadChildren: () => TestReportsModule
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
