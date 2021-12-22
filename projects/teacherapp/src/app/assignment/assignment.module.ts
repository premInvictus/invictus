import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignmentRoutingModule } from './assignment-routing.module';
import { LoadingModule } from 'ngx-loading';
import { SharedModule } from '../shared-module/share-module.module';
import { AssignmentReviewComponent } from './assignment-review/assignment-review.component';
import { PastAssignmentsComponent } from './past-assignments/past-assignments.component';
import { ViewAsssignmentComponent } from './view-asssignment/view-asssignment.component';

@NgModule({
	imports: [
		CommonModule,
		AssignmentRoutingModule,
		LoadingModule,
		SharedModule,
	],
	declarations: [AssignmentReviewComponent, PastAssignmentsComponent, ViewAsssignmentComponent],
	entryComponents: []
})
export class AssignmentModule { }
