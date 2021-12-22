import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassPerformanceReportComponent } from './class-performance-report/class-performance-report.component';
import { ClassPerformanceReportsRoutingModule } from './class-performance-reports-routing.module';
// tslint:disable-next-line:max-line-length
import { AdminClassPerformanceTopicsubtopicwiseReportComponent } from './admin-class-performance-topicsubtopicwise-report/admin-class-performance-topicsubtopicwise-report.component';
// tslint:disable-next-line:max-line-length
import { ClassPerformanceTopicsectionWiseComponent } from './class-performance-topicsection-wise/class-performance-topicsection-wise.component';
// tslint:disable-next-line:max-line-length
import { ClassTopicSectionSlabwiseReportComponent } from './class-topic-section-slabwise-report/class-topic-section-slabwise-report.component';
import { ClassReportsComponent } from './class-reports/class-reports.component';
import { AdminOverallClassPerformanceComponent } from './admin-overall-class-performance/admin-overall-class-performance.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { LoadingModule } from 'ngx-loading';
import { GaugeModule } from 'angular-gauge';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TooltipModule } from 'ngx-bootstrap';
import { SharedModule } from '../shared-module/share-module.module';
@NgModule({
	imports: [
		CommonModule,
		ClassPerformanceReportsRoutingModule,
		ReactiveFormsModule,
		ChartsModule,
		FormsModule,
		LoadingModule,
		SharedModule,
		GaugeModule.forRoot(),
		SimpleNotificationsModule,
		TooltipModule.forRoot()
	],
	declarations: [
		AdminClassPerformanceTopicsubtopicwiseReportComponent,
		ClassPerformanceTopicsectionWiseComponent,
		ClassTopicSectionSlabwiseReportComponent,
		ClassPerformanceReportComponent,
		ClassReportsComponent,
		AdminOverallClassPerformanceComponent
	]
})
export class ClassPerformanceReportsModule { }
