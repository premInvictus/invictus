import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GradeMasterRoutingModule } from './grade-master-routing.module';
import { StudentAcademicProfileComponent } from './student-academic-profile/student-academic-profile.component';
import { MarksEntryComponent } from './marks-entry/marks-entry.component';
import { RemarksEntryComponent, RemarksDialog } from './remarks-entry/remarks-entry.component';
import { ReviewComponent, ReviewDialog } from './review/review.component';
import { ExamSharedModule } from '../exam-shared/exam-shared.module';
import { MarksEntryPrimaryComponent } from './marks-entry-primary/marks-entry-primary.component';
import { MarksEntrySecondaryComponent } from './marks-entry-secondary/marks-entry-secondary.component';
import { MarksEntryFinalComponent } from './marks-entry-final/marks-entry-final.component';
import { StudentAcademicProfileDetailsComponent } from './student-academic-profile-details/student-academic-profile-details.component';

@NgModule({
  imports: [
    CommonModule,
    GradeMasterRoutingModule,
    ExamSharedModule
  ],
  declarations: [StudentAcademicProfileComponent, MarksEntryComponent, RemarksEntryComponent, ReviewComponent, RemarksDialog, ReviewDialog, MarksEntryPrimaryComponent, MarksEntrySecondaryComponent, MarksEntryFinalComponent, StudentAcademicProfileDetailsComponent],
  entryComponents: [
    RemarksDialog,
    ReviewDialog
  ],
})
export class GradeMasterModule { }
