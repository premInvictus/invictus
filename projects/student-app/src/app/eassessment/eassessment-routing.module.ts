import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentScheduleExamComponent } from './student-schedule-exam/student-schedule-exam.component';

const routes: Routes = [
	{ path: 'student_schedule_exam', component: StudentScheduleExamComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class EassessmentRoutingModule {}
