import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeacherTestReportComponent } from './teacher-test-report/teacher-test-report.component';
import { TeacherReportAnalysisComponent } from './teacher-report-analysis/teacher-report-analysis.component';
import { TeacherScoreCardComponent } from './teacher-score-card/teacher-score-card.component';
import { IndividualStudentReportComponent } from './individual-student-report/individual-student-report.component';
import { StudentListComponent } from './student-list/student-list.component';


const routes: Routes = [
	{ path: '', component: TeacherTestReportComponent },
	{ path: 'report-analysis/:id', component: TeacherReportAnalysisComponent },
	{ path: 'score-card', component: TeacherScoreCardComponent },
	{ path: 'individual-student-report/:id1/:id2', component: IndividualStudentReportComponent },
	{ path: 'student-list', component: StudentListComponent },
	
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TestReportsRoutingModule { }
