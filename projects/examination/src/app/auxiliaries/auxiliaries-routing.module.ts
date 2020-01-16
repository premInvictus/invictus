import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GradecardPrintingComponent } from './gradecard-printing/gradecard-printing.component';
import { AdditionalSubjectComponent } from './additional-subject/additional-subject.component';
import { CbseMarksAnalysisComponent } from './cbse-marks-analysis/cbse-marks-analysis.component';
import { RollnoAllotmentComponent } from './rollno-allotment/rollno-allotment.component';
import { BmiCalculatorComponent } from './bmi-calculator/bmi-calculator.component';
import { CommonAttendanceComponent } from './common-attendance/common-attendance.component';
import { ExamAchievementComponent } from './exam-achievement/exam-achievement.component';

const routes: Routes = [
	{
		path: 'grade-card', component: GradecardPrintingComponent,
	},
	{
		path: 'additional-subject', component: AdditionalSubjectComponent
	},
	{
		path: 'marks-analysis', component: CbseMarksAnalysisComponent
	},
	{
		path: 'rollno-allotment', component: RollnoAllotmentComponent
	},
	{
		path: 'health-status', component: BmiCalculatorComponent
	},
	{
		path: 'mark-attendance', component: CommonAttendanceComponent
	},
	{
		path: 'exam-achievement', component: ExamAchievementComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuxiliariesRoutingModule { }
