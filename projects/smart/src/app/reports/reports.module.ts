import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { LoadingModule } from 'ngx-loading';
import { SmartSharedModule } from '../smart-shared/smart-shared.module';
import { ViewSyllabusComponent } from './view-syllabus/view-syllabus.component';
import { EtcReportComponent } from './etc-report/etc-report.component';
import { SyllabusProgressReportComponent, AddRemarkPopUp } from './syllabus-progress-report/syllabus-progress-report.component';
import { ComparitiveComponent } from './comparitive/comparitive.component';
import { TopicSubtopicSkippedComponent } from './topic-subtopic-skipped/topic-subtopic-skipped.component';
import { NegativeReportComponent } from './negative-report/negative-report.component';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
	imports: [
		CommonModule,
		ReportsRoutingModule,
		LoadingModule,
		SmartSharedModule,
		MatDialogModule
	],
	declarations: [ViewSyllabusComponent,
		EtcReportComponent, SyllabusProgressReportComponent, ComparitiveComponent, TopicSubtopicSkippedComponent, NegativeReportComponent, AddRemarkPopUp],
		entryComponents: [
			AddRemarkPopUp
		  ],
})
export class SmartReportsModule { }
