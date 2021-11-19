import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EevaluationRoutingModule } from './eevaluation-routing.module';
import { ViewConcludedTestComponent } from './view-concluded-test/view-concluded-test.component';
import { ViewStudentTestReportComponent } from './view-student-test-report/view-student-test-report.component';
import { ConcludedeassessmentComponent } from './concludedeassessment/concludedeassessment.component';
import { StudentwiseevaluationComponent } from './studentwiseevaluation/studentwiseevaluation.component';
import { StudentanswerreviewComponent } from './studentanswerreview/studentanswerreview.component';
import { SharedModule } from '../shared-module/share-module.module';


@NgModule({
	imports: [
		CommonModule,
		EevaluationRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		SharedModule
	],
	declarations: [
		ConcludedeassessmentComponent,
		StudentwiseevaluationComponent,
		StudentanswerreviewComponent,
		ViewConcludedTestComponent,
		ViewStudentTestReportComponent,
	]
})
export class EevaluationModule { }
