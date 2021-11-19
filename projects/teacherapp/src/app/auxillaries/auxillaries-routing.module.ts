import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeacherTimetableComponent } from './teacher-timetable/teacher-timetable.component';
import { BmiCalculatorComponent } from './bmi-calculator/bmi-calculator.component';
import { ExamAchievementComponent } from './exam-achievement/exam-achievement.component';

const routes: Routes = [
	{
		path: 'classwise-table', component: TeacherTimetableComponent,
		
	},
	{
		path: 'health-status', component: BmiCalculatorComponent
		
	}
	,
	{
		path: 'exam-achievement', component: ExamAchievementComponent
		
	}
];
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuxillariesRoutingModule { }
