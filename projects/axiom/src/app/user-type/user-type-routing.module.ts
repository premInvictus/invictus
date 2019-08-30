import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards/index';
import { SchoolComponent } from './school/school.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';
import { UserCredentialComponent } from './user-credential/user-credential.component';
import { ProjectComponent } from 'src/app/invictus-shared/project/project.component';
const routes: Routes = [
	{
		path: '',
		canActivate: [AuthGuard],
		redirectTo: 'school',
		pathMatch: 'full'
	},
	{
		path: 'school',
		component: ProjectComponent,
		canActivate: [AuthGuard],
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
