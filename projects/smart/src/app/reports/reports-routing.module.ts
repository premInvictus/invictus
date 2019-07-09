import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewSyllabusComponent } from '../reports/view-syllabus/view-syllabus.component';
import { EtcReportComponent } from '../reports/etc-report/etc-report.component';
import { SyllabusProgressReportComponent } from '../reports/syllabus-progress-report/syllabus-progress-report.component';
import { ComparitiveComponent } from '../reports/comparitive/comparitive.component';
import { TopicSubtopicSkippedComponent } from '../reports/topic-subtopic-skipped/topic-subtopic-skipped.component';
import { NegativeReportComponent } from '../reports/negative-report/negative-report.component';
import { TeacherLogEntryComponent } from './teacher-log-entry/teacher-log-entry.component';
import { PastAssignmentComponent } from './past-assignment/past-assignment.component';
import { LogEntryReportComponent } from './log-entry-report/log-entry-report.component';
const routes: Routes = [
	{
		path: 'view-syllabus', component: ViewSyllabusComponent
	},
	{
		path: 'etc-report', component: EtcReportComponent
	},
	{
		path: 'syllabus-progress-report', component: SyllabusProgressReportComponent
	},
	{
		path: 'comparitive-analysis', component: ComparitiveComponent
	},
	{
		path: 'topic-subtopic-skipped', component: TopicSubtopicSkippedComponent
	},
	{
		path: 'negative-report', component: NegativeReportComponent
	},
	{
		path: 'teacher-log-entry', component: TeacherLogEntryComponent
	},
	{
		path: 'log-entry-report', component: LogEntryReportComponent
	},
	{
		path: 'past-assignment', component: PastAssignmentComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ReportsRoutingModule { }
