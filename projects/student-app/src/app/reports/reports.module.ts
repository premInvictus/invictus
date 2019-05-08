import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { LoadingModule } from 'ngx-loading';
import { GaugeModule } from 'angular-gauge';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TooltipModule } from 'ngx-bootstrap';
import { TestReportComponent } from './student/test-report/test-report.component';
import { StuReportAnalysisComponent } from './student/stu-report-analysis/stu-report-analysis.component';
import { StudentPerformanceAnalysisComponent } from './student/student-performance-analysis/student-performance-analysis.component';
import {OverallStudentPerformanceComponent} from './student/overall-student-performance/overall-student-performance.component';
// tslint:disable-next-line:max-line-length
import { StudentQuestionReviewComponent } from './student/student-question-review/student-question-review.component';
import { BookmarkedQuestionsComponent } from './student/bookmarked-questions/bookmarked-questions.component';

@NgModule({
	imports: [
		CommonModule,
		ReportsRoutingModule,
		CommonModule,
		SharedModuleModule,
		ReactiveFormsModule,
		ReportsRoutingModule,
		ChartsModule,
		FormsModule,
		LoadingModule,
		GaugeModule.forRoot(),
		SimpleNotificationsModule,
		TooltipModule.forRoot()
	],
	declarations: [
		TestReportComponent,
		StuReportAnalysisComponent,
		StudentPerformanceAnalysisComponent,
		StudentQuestionReviewComponent,
		BookmarkedQuestionsComponent,
		OverallStudentPerformanceComponent
	]
})
export class ReportsModule {}
