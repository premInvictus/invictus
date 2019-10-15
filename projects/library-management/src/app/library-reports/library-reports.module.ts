import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { TranslateService } from '@ngx-translate/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports/reports.component';
import { LibraryReportsRoutingModule } from './library-reports-routing.module';
import { LibrarySharedModule } from '../library-shared/library-shared.module';
import { ReportFilterComponent } from './reports-filter-sort/report-filter/report-filter.component';
import { ReportSortComponent } from './reports-filter-sort/report-sort/report-sort.component';
import { AccessionReportComponent } from './reports/accession-report/accession-report.component';
import { IssueReturnReportComponent } from './reports/issue-return-report/issue-return-report.component';
import { OverDueBookReportComponent } from './reports/over-due-book-report/over-due-book-report.component';
import { AddVendorDialog } from './../catalogue-management/vendor-master/add-vendor-dialog/add-vendor-dialog.component';
@NgModule({
  imports: [
    CommonModule,
    LibraryReportsRoutingModule,
    LibrarySharedModule,
    AngularSlickgridModule.forRoot()
  ],
  declarations: [ReportsComponent, AccessionReportComponent, IssueReturnReportComponent, OverDueBookReportComponent, ReportFilterComponent, ReportSortComponent, AddVendorDialog],
  entryComponents: [ReportFilterComponent, ReportSortComponent, AddVendorDialog],
	providers: [TranslateService],
})
export class LibraryReportsModule { }
