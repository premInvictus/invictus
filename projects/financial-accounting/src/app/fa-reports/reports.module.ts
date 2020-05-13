import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports/reports.component';
import { FaSharedModule } from '../fa-shared/sharedmodule.module';

import { RepotContainerComponent } from './repot-container/repot-container.component';
import { AgeingReportComponent } from './ageing-report/ageing-report.component';
import { CollectionReportComponent } from './collection-report/collection-report.component';
import { DaybookReportComponent } from './daybook-report/daybook-report.component';
import { ExpenditureReportComponent } from './expenditure-report/expenditure-report.component';
import { LedgersReportComponent } from './ledgers-report/ledgers-report.component';
import { OutstandingReportComponent } from './outstanding-report/outstanding-report.component';
import { StatutoryReportComponent } from './statutory-report/statutory-report.component';
import { VouchersReportComponent } from './vouchers-report/vouchers-report.component';
@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    FaSharedModule,
    AngularSlickgridModule.forRoot()

  ],
  declarations: [ReportsComponent,  RepotContainerComponent,
    AgeingReportComponent,
    CollectionReportComponent,
    DaybookReportComponent,
    ExpenditureReportComponent,
    LedgersReportComponent,
    OutstandingReportComponent,
    StatutoryReportComponent,
    VouchersReportComponent

     ]
})
export class ReportsModule { }
