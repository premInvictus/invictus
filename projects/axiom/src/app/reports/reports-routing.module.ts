import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestReportComponent } from './student/test-report/test-report.component';
import { StuReportAnalysisComponent } from './student/stu-report-analysis/stu-report-analysis.component';
import { OverallStudentPerformanceComponent } from './overall-student-performance/overall-student-performance.component';
import { StudentPerformanceAnalysisComponent } from './student/student-performance-analysis/student-performance-analysis.component';
import { BookmarkedQuestionsComponent } from './student/bookmarked-questions/bookmarked-questions.component';
import { ViewAllExamsComponent } from './admin/view-all-exams/view-all-exams.component';
const routes: Routes = [
	{ path: 'test-report', component: TestReportComponent },
	{ path: 'report-analysis/:id', component: StuReportAnalysisComponent },
	{ path: 'overall-student-performance', component: OverallStudentPerformanceComponent },
	{ path: 'performance-analysis', component: StudentPerformanceAnalysisComponent },
	{ path: 'bookmark-question', component: BookmarkedQuestionsComponent },
	{ path: 'view-exams-all', component: ViewAllExamsComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ReportsRoutingModule { }
