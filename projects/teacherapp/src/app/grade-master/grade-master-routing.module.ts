import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarksEntryComponent } from './marks-entry/marks-entry.component';
import { MarksEntryPrimaryComponent } from './marks-entry-primary/marks-entry-primary.component';
import { MarksEntrySecondaryComponent } from './marks-entry-secondary/marks-entry-secondary.component';
import { MarksEntryFinalComponent } from './marks-entry-final/marks-entry-final.component';
import { MarkAttendanceComponent } from './mark-attendance/mark-attendance.component';
import { RollnoAllotmentComponent } from './rollno-allotment/rollno-allotment.component';
import { AdditionalSubjectComponent } from './additional-subject/additional-subject.component';
import { RemarksEntryComponent } from './remarks-entry/remarks-entry.component';
import { CommonAttendanceComponent } from './common-attendance/common-attendance.component';
import { MarksInputComponent } from './marks-input/marks-input.component';
import { ResultEntryComponent } from './result-entry/result-entry.component';
import { StudentVerificationComponent } from './student-verification/student-verification.component';
import { GradecardPrintingComponent } from './gradecard-printing/gradecard-printing.component'


const routes: Routes = [
	{
		path: 'marks-entry', component: MarksEntryComponent
	},
	{
		path: 'marks-entry-primary', component: MarksEntryPrimaryComponent
	},
	{
		path: 'marks-entry-secondary', component: MarksEntrySecondaryComponent
	},
	{
		path: 'marks-entry-final', component: MarksEntryFinalComponent
	},
	{
		path: 'mark-attendance', component: CommonAttendanceComponent
	},
	{
		path: 'rollno-allotment', component: RollnoAllotmentComponent
	},
	{
		path: 'additional-subject', component: AdditionalSubjectComponent
	},
	{
		path: 'remarks-entry', component: RemarksEntryComponent
	},
	{
		path: 'marks-input', component: MarksInputComponent
	},
	{
		path: 'result-entry', component: ResultEntryComponent
	},
	{
		path: 'student-verification', component: StudentVerificationComponent
	},
	{
		path: 'grade-card', component: GradecardPrintingComponent,
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class GradeMasterRoutingModule { }
