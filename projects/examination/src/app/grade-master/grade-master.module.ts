import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GradeMasterRoutingModule } from './grade-master-routing.module';
import { StudentAcademicProfileComponent } from './student-academic-profile/student-academic-profile.component';
import { MarksEntryComponent } from './marks-entry/marks-entry.component';
import { RemarksEntryComponent } from './remarks-entry/remarks-entry.component';
import { ReviewComponent } from './review/review.component';
import { ExamSharedAppModule } from '../app.module';

@NgModule({
  imports: [
    CommonModule,
    GradeMasterRoutingModule,
    ExamSharedAppModule
  ],
  declarations: [StudentAcademicProfileComponent, MarksEntryComponent, RemarksEntryComponent, ReviewComponent]
})
export class GradeMasterModule { }
