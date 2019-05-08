import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestReportsRoutingModule } from './test-reports-routing.module';
import { TeacherScoreCardComponent } from './teacher-score-card/teacher-score-card.component';
import { TeacherTestQuestionAnalysisComponent } from './teacher-test-question-analysis/teacher-test-question-analysis.component';
import { TeacherTopicSubtopicComponent } from './teacher-topic-subtopic/teacher-topic-subtopic.component';
import { TeacherTopicWisePerformanceComponent } from './teacher-topic-wise-performance/teacher-topic-wise-performance.component';
import { TeacherCroReportComponent } from './teacher-cro-report/teacher-cro-report.component';
import { TeacherResponseDistributionComponent } from './teacher-response-distribution/teacher-response-distribution.component';
import { TeacherReportQuesReviewComponent } from './teacher-report-ques-review/teacher-report-ques-review.component';
import { TeacherTestReportComponent } from './teacher-test-report/teacher-test-report.component';
import { TeacherReportAnalysisComponent } from './teacher-report-analysis/teacher-report-analysis.component';
import { IndividualStudentReportComponent } from './individual-student-report/individual-student-report.component';
import { StudentScoreCardComponent } from '../reports/student/student-score-card/student-score-card.component';
import { SharedModule } from '../shared-module/share-module.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { LoadingModule } from 'ngx-loading';
import { GaugeModule } from 'angular-gauge';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TooltipModule } from 'ngx-bootstrap';

@NgModule({
	imports: [
		CommonModule,
		TestReportsRoutingModule,
		SharedModule,
		ReactiveFormsModule,
		ChartsModule,
		FormsModule,
		LoadingModule,
		GaugeModule.forRoot(),
		SimpleNotificationsModule,
		TooltipModule.forRoot()
	],
	declarations: [
		TeacherScoreCardComponent, TeacherTestQuestionAnalysisComponent, TeacherTopicSubtopicComponent,
		TeacherTopicWisePerformanceComponent, TeacherCroReportComponent,
		TeacherResponseDistributionComponent, TeacherReportQuesReviewComponent,
		TeacherTestReportComponent, TeacherReportAnalysisComponent,
		IndividualStudentReportComponent,
		StudentScoreCardComponent
	]
})
export class TestReportsModule { }
