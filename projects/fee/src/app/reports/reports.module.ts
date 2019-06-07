import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports/reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';
import { ReportFilterComponent } from './reports-filter-sort/report-filter/report-filter.component';
import { ReportSortComponent } from './reports-filter-sort/report-sort/report-sort.component';

@NgModule({
	imports: [
		CommonModule,
		ReportsRoutingModule,
		SharedmoduleModule
	],
	declarations: [ReportsComponent, ReportFilterComponent, ReportSortComponent],
	entryComponents: [ReportFilterComponent, ReportSortComponent]
})
export class ReportsModule { }
