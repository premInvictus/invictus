import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestReportComponent } from './student/test-report/test-report.component';
import { StuReportAnalysisComponent } from './student/stu-report-analysis/stu-report-analysis.component';
import { StudentPerformanceAnalysisComponent } from './student/student-performance-analysis/student-performance-analysis.component';
import { BookmarkedQuestionsComponent } from './student/bookmarked-questions/bookmarked-questions.component';
import {OverallStudentPerformanceComponent} from './student/overall-student-performance/overall-student-performance.component';
const routes: Routes = [
	{ path: 'test-report', component: TestReportComponent },
	{ path: 'report-analysis/:id', component: StuReportAnalysisComponent },
	{
		path: 'performance-analysis',
		component: StudentPerformanceAnalysisComponent
	},
	{ path: 'bookmark-question', component: BookmarkedQuestionsComponent },
	{ path: 'overall-student-performance', component: OverallStudentPerformanceComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ReportsRoutingModule {}
