import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExamsetupComponent } from './examsetup/examsetup.component';
import { ScheduleexamComponent } from './scheduleexam/scheduleexam.component';
import { StudentScheduleExamComponent } from './student-schedule-exam/student-schedule-exam.component';
import { TestinitiationscreenComponent } from './testinitiationscreen/testinitiationscreen.component';
import { TeinvilagationComponent } from './teinvilagation/teinvilagation.component';

const routes: Routes = [
			{ path: 'exam_setup', component: ExamsetupComponent },
      { path: 'schedule_exam', component: ScheduleexamComponent },
      { path: 'student_schedule_exam', component: StudentScheduleExamComponent },
			{ path: 'testscreeen/:id', component: TestinitiationscreenComponent },
			{ path: 'teinvilagation/:id', component: TeinvilagationComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class EassessmentRoutingModule { }
