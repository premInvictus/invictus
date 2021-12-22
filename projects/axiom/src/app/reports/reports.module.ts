import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
// tslint:disable-next-line:max-line-length
import { ChartsModule } from 'ng2-charts';
import { GaugeModule } from 'angular-gauge';
import { ReportService } from '../reports/service/report.service';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NotificationsService } from 'angular2-notifications';
import { LoadingModule } from 'ngx-loading';
import { TooltipModule } from 'ngx-bootstrap';
import { SharedModule } from '../shared-module/share-module.module';
import { ViewAllExamsComponent } from './admin/view-all-exams/view-all-exams.component';
import { TableRendererComponent } from './admin/view-all-exams/table-renderer/table-renderer.component';
import { TopicwiseReportOverviewComponent } from './topicwise-report-overview/topicwise-report-overview.component';
@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		ReactiveFormsModule,
		ReportsRoutingModule,
		ChartsModule,
		FormsModule,
		LoadingModule,
		GaugeModule.forRoot(),
		SimpleNotificationsModule,
		TooltipModule.forRoot()
	],
	// tslint:disable-next-line:max-line-length
	declarations: [ReportsComponent,
		ViewAllExamsComponent, TableRendererComponent, TopicwiseReportOverviewComponent],
	providers: [ReportService, NotificationsService]
})
export class ReportsModule { }
