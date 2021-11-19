import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared-module/share-module.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ExamsetupComponent } from './examsetup/examsetup.component';
import { ScheduleexamComponent } from './scheduleexam/scheduleexam.component';
import { TestinitiationscreenComponent } from './testinitiationscreen/testinitiationscreen.component';
import { TeinvilagationComponent } from './teinvilagation/teinvilagation.component';
import { EassessmentRoutingModule } from './eassessment-routing.module';
import { NgxGaugeModule } from 'ngx-gauge';
import { ChartsModule } from 'ng2-charts';
import { QuestionPaperDialogComponent } from '../questionbank/question-paper-dialog/question-paper-dialog.component';
import { StudentStatusModalComponent } from './student-status-modal/student-status-modal.component';

@NgModule({
	imports: [
		CommonModule,
		EassessmentRoutingModule,
		SharedModule,
		ReactiveFormsModule,
		FormsModule,
		NgxGaugeModule,
		ChartsModule
	],
	entryComponents: [
		QuestionPaperDialogComponent,StudentStatusModalComponent
	],
	declarations: [
		ExamsetupComponent,
		ScheduleexamComponent,
		TestinitiationscreenComponent,
		TeinvilagationComponent,
		StudentStatusModalComponent,
	]
})
export class EassessmentModule { }
