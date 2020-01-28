import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GradeMasterRoutingModule } from './grade-master-routing.module';
import { StudentAcademicProfileComponent } from './student-academic-profile/student-academic-profile.component';
import { MarksEntryComponent } from './marks-entry/marks-entry.component';
import { RemarksEntryComponent } from './remarks-entry/remarks-entry.component';

import { ExamSharedModule } from '../exam-shared/exam-shared.module';
import { MarksEntryPrimaryComponent } from './marks-entry-primary/marks-entry-primary.component';
import { MarksEntrySecondaryComponent } from './marks-entry-secondary/marks-entry-secondary.component';
import { MarksEntryFinalComponent } from './marks-entry-final/marks-entry-final.component';
import { StudentAcademicProfileDetailsComponent } from './student-academic-profile-details/student-academic-profile-details.component';
import { MarkEntrySubmitDialogComponent } from './mark-entry-submit-dialog/mark-entry-submit-dialog.component';
import { ResultEntryComponent } from './result-entry/result-entry.component';

@NgModule({
  imports: [
    CommonModule,
    GradeMasterRoutingModule,
    ExamSharedModule
  ],
  declarations: [StudentAcademicProfileComponent, MarksEntryComponent, RemarksEntryComponent,  MarksEntryPrimaryComponent, MarksEntrySecondaryComponent, MarksEntryFinalComponent, StudentAcademicProfileDetailsComponent, MarkEntrySubmitDialogComponent,ResultEntryComponent],
  entryComponents: [
     MarkEntrySubmitDialogComponent
  ],
})
export class GradeMasterModule { }
