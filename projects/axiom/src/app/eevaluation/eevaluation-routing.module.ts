import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewConcludedTestComponent } from './view-concluded-test/view-concluded-test.component';
import { ViewStudentTestReportComponent } from './view-student-test-report/view-student-test-report.component';
import { ConcludedeassessmentComponent } from './concludedeassessment/concludedeassessment.component';
import { StudentwiseevaluationComponent } from './studentwiseevaluation/studentwiseevaluation.component';
import { StudentanswerreviewComponent } from './studentanswerreview/studentanswerreview.component';


const routes: Routes = [
	{ path: 'concluded_eassessment', component: ConcludedeassessmentComponent },
	{ path: 'student_wise_evaluation/:id', component: StudentwiseevaluationComponent },
	{ path: 'studentanswerreview/:id1/:id2', component: StudentanswerreviewComponent },
	{ path: 'view_concluded_test/:id', component: ViewConcludedTestComponent },
	{ path: 'view_student_test_report/:id1/:id2', component: ViewStudentTestReportComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class EevaluationRoutingModule { }
