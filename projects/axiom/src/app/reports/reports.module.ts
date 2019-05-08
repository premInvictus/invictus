import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { TestReportComponent } from './student/test-report/test-report.component';
import { StuReportAnalysisComponent } from './student/stu-report-analysis/stu-report-analysis.component';
import { OverallStudentPerformanceComponent } from './overall-student-performance/overall-student-performance.component';
import { StudentPerformanceAnalysisComponent } from './student/student-performance-analysis/student-performance-analysis.component';
// tslint:disable-next-line:max-line-length
import { StudentSubjectWisePerformanceComponent } from './student/student-subject-wise-performance/student-subject-wise-performance.component';
import { ChartsModule } from 'ng2-charts';
import { GaugeModule } from 'angular-gauge';
import { ReportService } from '../reports/service/report.service';
import { StudentPerformanceGraphComponent } from './student/student-performance-graph/student-performance-graph.component';
import { StudentQuestionReviewComponent } from './student/student-question-review/student-question-review.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NotificationsService } from 'angular2-notifications';
import { LoadingModule } from 'ngx-loading';
import { TooltipModule } from 'ngx-bootstrap';
import { SharedModule } from '../shared-module/share-module.module';
import { BookmarkedQuestionsComponent } from './student/bookmarked-questions/bookmarked-questions.component';
import { ViewAllExamsComponent } from './admin/view-all-exams/view-all-exams.component';
import { TableRendererComponent } from './admin/view-all-exams/table-renderer/table-renderer.component';
@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		ReactiveFormsModule,
		ReportsRoutingModule,
		ChartsModule,
		FormsModule,
		LoadingModule,
		GaugeModule.forRoot(),
		SimpleNotificationsModule,
		TooltipModule.forRoot()
	],
	// tslint:disable-next-line:max-line-length
	declarations: [ReportsComponent, TestReportComponent,
		StuReportAnalysisComponent,
		OverallStudentPerformanceComponent, StudentPerformanceAnalysisComponent,
		StudentSubjectWisePerformanceComponent,
		StudentPerformanceGraphComponent, StudentQuestionReviewComponent,
		BookmarkedQuestionsComponent,
		ViewAllExamsComponent, TableRendererComponent],
	providers: [ReportService, NotificationsService]
})
export class ReportsModule { }
