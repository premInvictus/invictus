import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GradeMasterRoutingModule } from './grade-master-routing.module';
import { StudentAcademicProfileComponent } from './student-academic-profile/student-academic-profile.component';
import { MarksEntryComponent, MarksEntryDialog } from './marks-entry/marks-entry.component';
import { RemarksEntryComponent, RemarksDialog } from './remarks-entry/remarks-entry.component';
import { ReviewComponent, ReviewDialog } from './review/review.component';
import { ExamSharedModule } from '../exam-shared/exam-shared.module';

@NgModule({
  imports: [
    CommonModule,
    GradeMasterRoutingModule,
    ExamSharedModule
  ],
  declarations: [StudentAcademicProfileComponent, MarksEntryComponent, RemarksEntryComponent, ReviewComponent, MarksEntryDialog, RemarksDialog, ReviewDialog],
  entryComponents: [
    MarksEntryDialog,
    RemarksDialog,
    ReviewDialog
  ],
})
export class GradeMasterModule { }
