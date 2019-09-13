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

@NgModule({
  imports: [
    CommonModule,
    GradeMasterRoutingModule,
    SharedModule
  ],
  declarations: [MarksEntryComponent, MarksEntryPrimaryComponent, MarksEntrySecondaryComponent, MarksEntryFinalComponent, MarkAttendanceComponent, AdditionalSubjectComponent, RollnoAllotmentComponent],
  entryComponents: [],
})
export class GradeMasterModule { }
