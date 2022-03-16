import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessRightsReportComponent } from './access-rights-report/access-rights-report.component';
import { ViewAllExamsComponent } from './admin/view-all-exams/view-all-exams.component';
import { TopicwiseReportOverviewComponent } from './topicwise-report-overview/topicwise-report-overview.component';

const routes: Routes = [
	{ path: 'view-exams-all', component: ViewAllExamsComponent },
	{ path: 'topicwise-report-overview', component: TopicwiseReportOverviewComponent },
	{ path: 'access-report', component: AccessRightsReportComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ReportsRoutingModule { }
