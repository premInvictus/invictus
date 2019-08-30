import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuxiliariesRoutingModule } from './auxiliaries-routing.module';
import { GradecardPrintingComponent } from './gradecard-printing/gradecard-printing.component';
import { AdditionalSubjectComponent } from './additional-subject/additional-subject.component';
import { CbseMarksAnalysisComponent } from './cbse-marks-analysis/cbse-marks-analysis.component';
import { RollnoAllotmentComponent } from './rollno-allotment/rollno-allotment.component';
import { MarkAttendanceComponent } from './mark-attendance/mark-attendance.component';
import { ExamSharedModule } from '../exam-shared/exam-shared.module';

@NgModule({
	imports: [
		CommonModule,
		AuxiliariesRoutingModule,
		ExamSharedModule
	],
	declarations: [GradecardPrintingComponent, AdditionalSubjectComponent, CbseMarksAnalysisComponent,
		RollnoAllotmentComponent, MarkAttendanceComponent]
})
export class AuxiliariesModule { }
