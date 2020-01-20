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
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class GradeMasterRoutingModule { }
