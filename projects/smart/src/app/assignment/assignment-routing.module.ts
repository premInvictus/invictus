import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssignmentReviewComponent } from '../assignment/assignment-review/assignment-review.component';
import { PastAssignmentsComponent } from '../assignment/past-assignments/past-assignments.component';
const routes: Routes = [
	{
		path: 'assignment-review', component: AssignmentReviewComponent
	},
	{
		path: 'past-assignments', component: PastAssignmentsComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AssignmentRoutingModule { }
