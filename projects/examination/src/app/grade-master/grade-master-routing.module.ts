import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentAcademicProfileComponent } from './student-academic-profile/student-academic-profile.component';
import { MarksEntryComponent } from './marks-entry/marks-entry.component';
import { ReviewComponent } from './review/review.component';
import { RemarksEntryComponent } from './remarks-entry/remarks-entry.component';

const routes: Routes = [
	{
		path: 'student', component: StudentAcademicProfileComponent,
	},
	{
		path: 'marks-entry', component: MarksEntryComponent
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
