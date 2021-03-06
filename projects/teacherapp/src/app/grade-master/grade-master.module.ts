import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GradeMasterRoutingModule } from './grade-master-routing.module';
import { MarksEntryComponent } from './marks-entry/marks-entry.component';
import { SharedModule } from '../shared-module/share-module.module';
import { MarksEntryPrimaryComponent } from './marks-entry-primary/marks-entry-primary.component';
import { MarksEntrySecondaryComponent } from './marks-entry-secondary/marks-entry-secondary.component';
import { MarksEntryFinalComponent } from './marks-entry-final/marks-entry-final.component';
import { MarkAttendanceComponent } from './mark-attendance/mark-attendance.component';
import { AdditionalSubjectComponent } from './additional-subject/additional-subject.component';
import { RollnoAllotmentComponent } from './rollno-allotment/rollno-allotment.component';
import { RemarksEntryComponent } from './remarks-entry/remarks-entry.component';
import { CommonAttendanceComponent } from './common-attendance/common-attendance.component';
import { MarkAttendanceThemeTwoComponent } from './mark-attendance-theme-two/mark-attendance-theme-two.component';
import { MarksInputComponent } from './marks-input/marks-input.component';
import { MarksRegisterComponent } from './marks-register/marks-register.component';
import { ResultEntryComponent } from './result-entry/result-entry.component';
import { StudentVerificationComponent } from './student-verification/student-verification.component';
import { StudentVerificationModalComponent } from './student-verification/student-verification-modal/student-verification-modal.component';
import { GradecardPrintingComponent} from './gradecard-printing/gradecard-printing.component';
import { ViewGradecardDialogComponent } from './view-gradecard-dialog/view-gradecard-dialog.component';
import { GradecardPagesetupComponent } from './gradecard-pagesetup/gradecard-pagesetup.component';
import { StudentAcademicProfileComponent } from './student-academic-profile/student-academic-profile.component';
import { StudentAcademicProfileDetailsComponent } from './student-academic-profile-details/student-academic-profile-details.component';

@NgModule({
  imports: [
    CommonModule,
    GradeMasterRoutingModule,
    SharedModule
  ],
  declarations: [MarksEntryComponent, MarksEntryPrimaryComponent, MarksEntrySecondaryComponent, MarksEntryFinalComponent, MarkAttendanceComponent, AdditionalSubjectComponent, RollnoAllotmentComponent, RemarksEntryComponent, CommonAttendanceComponent, MarkAttendanceThemeTwoComponent, MarksInputComponent, MarksRegisterComponent, ResultEntryComponent, StudentVerificationComponent,StudentVerificationModalComponent,GradecardPrintingComponent,ViewGradecardDialogComponent,GradecardPagesetupComponent,StudentAcademicProfileComponent, StudentAcademicProfileDetailsComponent],
  entryComponents: [StudentVerificationModalComponent,ViewGradecardDialogComponent,GradecardPagesetupComponent,StudentAcademicProfileComponent],
})
export class GradeMasterModule { }
