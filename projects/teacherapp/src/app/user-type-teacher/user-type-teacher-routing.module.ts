import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards/index';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
import { UserCredentialComponent } from './user-credential/user-credential.component';
import { ProjectComponent } from '../../../../../src/app/invictus-shared/project/project.component';
const routes: Routes = [
	{
		path: '',
		component: ProjectComponent,
		canActivate: [AuthGuard],
		children: [
			{ path: '', component: TeacherDashboardComponent },
			{
				path: 'questionbank',
				loadChildren: 'projects/teacherapp/src/app/questionbank/questionbank.module#QuestionbankModule'
			},
			{
				path: 'question',
				loadChildren: 'projects/teacherapp/src/app/question/question.module#QuestionModule'
			},
			{
				path: 'template',
				loadChildren: 'projects/teacherapp/src/app/questiontemplate/questiontemplate.module#QuestiontemplateModule'
			},
			{
				path: 'questionpaper',
				loadChildren: 'projects/teacherapp/src/app/questionpaper/questionpaper.module#QuestionpaperModule'
			},
			{
				path: 'eassessment',
				loadChildren: 'projects/teacherapp/src/app/eassessment/eassessment.module#EassessmentModule'
			},
			{
				path: 'eevaluation',
				loadChildren: 'projects/teacherapp/src/app/eevaluation/eevaluation.module#EevaluationModule'
			},
			{
				path: 'question_paper_setup',
				loadChildren: 'projects/teacherapp/src/app/question-paper-setup/question-paper-setup.module#QuestionPaperSetupModule'
			},
			{
				path: 'class-reports',
				loadChildren: 'projects/teacherapp/src/app/class-performance-reports/class-performance-reports.module#ClassPerformanceReportsModule'
			},
			{
				path: 'student-reports',
				loadChildren: 'projects/teacherapp/src/app/student-reports/student-reports.module#StudentReportsModule'
			},
			{
				path: 'test-report',
				loadChildren: 'projects/teacherapp/src/app/test-reports/test-reports.module#TestReportsModule'
			},
			{ path: 'user-credential', component: UserCredentialComponent }
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TeacherUserTypeRoutingModule { }
