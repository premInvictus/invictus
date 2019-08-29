import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminOverallPerformanceComponent } from './admin-overall-performance/admin-overall-performance.component';
import { AdminPerformanceGraphComponent } from './admin-performance-graph/admin-performance-graph.component';
import { AdminPerformanceAnalysisComponent } from './admin-performance-analysis/admin-performance-analysis.component';
import { StudentReportsRoutingModule } from './student-reports-routing.module';
import { SharedModule } from '../shared-module/share-module.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { LoadingModule } from 'ngx-loading';
import { GaugeModule } from 'angular-gauge';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TooltipModule } from 'ngx-bootstrap';
import { SchoolStudentReportsComponent } from './school-student-reports/school-student-reports.component';

@NgModule({
	imports: [
		CommonModule,
		StudentReportsRoutingModule,
		SharedModule,
		ReactiveFormsModule,
		ChartsModule,
		FormsModule,
		LoadingModule,
		GaugeModule.forRoot(),
		SimpleNotificationsModule,
		TooltipModule.forRoot()
	],
	declarations: [
		AdminOverallPerformanceComponent,
		AdminPerformanceGraphComponent,
		AdminPerformanceAnalysisComponent,
		SchoolStudentReportsComponent
	]
})
export class StudentReportsModule { }
