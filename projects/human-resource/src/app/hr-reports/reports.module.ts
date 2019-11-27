import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports/reports.component';
import { HrSharedModule } from '../hr-shared/hr-shared.module';
import { EmpSalaryReportComponent } from './reports/emp-salary-report/emp-salary-report.component';
import { EmpDetailsReportComponent } from './reports/emp-details-report/emp-details-report.component';
@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    HrSharedModule,
    AngularSlickgridModule.forRoot()

  ],
  declarations: [ReportsComponent, EmpSalaryReportComponent, EmpDetailsReportComponent]
})
export class ReportsModule { }
