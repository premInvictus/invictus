import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignmentRoutingModule } from './assignment-routing.module';
import { LoadingModule } from 'ngx-loading';
import { SmartSharedModule } from '../smart-shared/smart-shared.module';
import { AssignmentReviewComponent, EditAssignment } from './assignment-review/assignment-review.component';
import { PastAssignmentsComponent } from './past-assignments/past-assignments.component';

@NgModule({
	imports: [
		CommonModule,
		AssignmentRoutingModule,
		LoadingModule,
		SmartSharedModule,
	],
	declarations: [AssignmentReviewComponent, PastAssignmentsComponent, EditAssignment],
	entryComponents: [EditAssignment]
})
export class AssignmentModule { }
