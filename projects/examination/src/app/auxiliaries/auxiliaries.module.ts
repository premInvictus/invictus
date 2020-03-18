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
import { BmiCalculatorComponent } from './bmi-calculator/bmi-calculator.component';
import { CommonAttendanceComponent } from './common-attendance/common-attendance.component';
import { ExamAchievementComponent } from './exam-achievement/exam-achievement.component';
import { GradecardPagesetupComponent } from './gradecard-pagesetup/gradecard-pagesetup.component';

@NgModule({
	imports: [
		CommonModule,
		AuxiliariesRoutingModule,
		ExamSharedModule,
		AngularSlickgridModule.forRoot()
	],
	declarations: [GradecardPrintingComponent, AdditionalSubjectComponent, CbseMarksAnalysisComponent,
		RollnoAllotmentComponent, MarkAttendanceComponent, CbseMarksUploadDialog, ViewGradecardDialogComponent, MarkAttendanceThemeTwoComponent, BmiCalculatorComponent, CommonAttendanceComponent, ExamAchievementComponent, GradecardPagesetupComponent],
	entryComponents: [
		CbseMarksUploadDialog, ViewGradecardDialogComponent, GradecardPagesetupComponent
	],
	providers: [{
		provide: MAT_DIALOG_DATA,
		useValue: {}
	  },
	  TranslateService]
})
export class AuxiliariesModule { }
