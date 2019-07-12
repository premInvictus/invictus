import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { LoadingModule } from 'ngx-loading';
import { SmartSharedModule } from '../smart-shared/smart-shared.module';
import { ViewSyllabusComponent } from './view-syllabus/view-syllabus.component';
import { EtcReportComponent } from './etc-report/etc-report.component';
import { SyllabusProgressReportComponent } from './syllabus-progress-report/syllabus-progress-report.component';
import { ComparitiveComponent } from './comparitive/comparitive.component';
import { TopicSubtopicSkippedComponent } from './topic-subtopic-skipped/topic-subtopic-skipped.component';
import { NegativeReportComponent } from './negative-report/negative-report.component';
import {MatDialogModule} from '@angular/material/dialog';
import { TeacherLogEntryComponent } from './teacher-log-entry/teacher-log-entry.component';
import { PastAssignmentComponent } from './past-assignment/past-assignment.component';
import { LogEntryReportComponent } from './log-entry-report/log-entry-report.component';
import { TeacherWiseComponent } from './teacher-wise/teacher-wise.component';
import { ClassWiseComponent } from './class-wise/class-wise.component';
import { SubjectWiseComponent } from './subject-wise/subject-wise.component';
import { PastAssignmentsReportComponent } from './past-assignments-report/past-assignments-report.component';

@NgModule({
	imports: [
		CommonModule,
		ReportsRoutingModule,
		LoadingModule,
		SmartSharedModule,
		MatDialogModule
	],
	declarations: [ViewSyllabusComponent,
		EtcReportComponent, SyllabusProgressReportComponent, ComparitiveComponent, TopicSubtopicSkippedComponent, NegativeReportComponent, TeacherLogEntryComponent, PastAssignmentComponent, LogEntryReportComponent, TeacherWiseComponent, ClassWiseComponent, SubjectWiseComponent],

})
export class SmartReportsModule { }
