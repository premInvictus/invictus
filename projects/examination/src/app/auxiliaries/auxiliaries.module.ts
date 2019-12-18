import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuxiliariesRoutingModule } from './auxiliaries-routing.module';
import { GradecardPrintingComponent } from './gradecard-printing/gradecard-printing.component';
import { AdditionalSubjectComponent } from './additional-subject/additional-subject.component';
import { CbseMarksAnalysisComponent, CbseMarksUploadDialog } from './cbse-marks-analysis/cbse-marks-analysis.component';
import { RollnoAllotmentComponent } from './rollno-allotment/rollno-allotment.component';
import { MarkAttendanceComponent } from './mark-attendance/mark-attendance.component';
import { ExamSharedModule } from '../exam-shared/exam-shared.module';
import { ViewGradecardDialogComponent } from './view-gradecard-dialog/view-gradecard-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { TranslateService } from '@ngx-translate/core';
import { MarkAttendanceThemeTwoComponent } from './mark-attendance-theme-two/mark-attendance-theme-two.component';

@NgModule({
	imports: [
		CommonModule,
		AuxiliariesRoutingModule,
		ExamSharedModule,
		AngularSlickgridModule.forRoot()
	],
	declarations: [GradecardPrintingComponent, AdditionalSubjectComponent, CbseMarksAnalysisComponent,
		RollnoAllotmentComponent, MarkAttendanceComponent, CbseMarksUploadDialog, ViewGradecardDialogComponent, MarkAttendanceThemeTwoComponent],
	entryComponents: [
		CbseMarksUploadDialog, ViewGradecardDialogComponent
	],
	providers: [{
		provide: MAT_DIALOG_DATA,
		useValue: {}
	  },
	  TranslateService]
})
export class AuxiliariesModule { }
