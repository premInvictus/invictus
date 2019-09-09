import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentAcademicProfileComponent } from './student-academic-profile/student-academic-profile.component';
import { MarksEntryComponent } from './marks-entry/marks-entry.component';
import { ReviewComponent } from './review/review.component';
import { RemarksEntryComponent } from './remarks-entry/remarks-entry.component';
import { MarksEntryPrimaryComponent } from './marks-entry-primary/marks-entry-primary.component';
import { MarksEntrySecondaryComponent } from './marks-entry-secondary/marks-entry-secondary.component';
import { MarksEntryFinalComponent } from './marks-entry-final/marks-entry-final.component';

const routes: Routes = [
	{
		path: 'student', component: StudentAcademicProfileComponent,
	},
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
		path: 'remarks-entry', component: RemarksEntryComponent
	},
	{
		path: 'review', component: ReviewComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class GradeMasterRoutingModule { }
