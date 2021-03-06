import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports/reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';
import { ReportFilterComponent } from './reports-filter-sort/report-filter/report-filter.component';
import { ReportSortComponent } from './reports-filter-sort/report-sort/report-sort.component';
import { LoadingModule } from 'ngx-loading';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { TranslateService } from '@ngx-translate/core';
import { Reports2Component } from './reports2/reports2.component';
import { CollectionReportComponent } from './reports2/collection-report/collection-report.component';
import { OutstandingReportComponent } from './reports2/outstanding-report/outstanding-report.component';
import { FeeLedgerReportComponent } from './reports2/fee-ledger-report/fee-ledger-report.component';
import { DeletedFeetransReportComponent } from './reports2/deleted-feetrans-report/deleted-feetrans-report.component';
import { FeeadjReportComponent } from './reports2/feeadj-report/feeadj-report.component';
import { FeeconReportComponent } from './reports2/feecon-report/feecon-report.component';
import { MissingFeeinvReportComponent } from './reports2/missing-feeinv-report/missing-feeinv-report.component';
import { FeestrucReportComponent } from './reports2/feestruc-report/feestruc-report.component';
import { ChequeclearanceReportComponent } from './reports2/chequeclearance-report/chequeclearance-report.component';
import { SecurityDepositReportComponent } from './reports2/security-deposit-report/security-deposit-report.component';
import { TransportReportComponent } from './reports2/transport-report/transport-report.component';
import { DropoutReportComponent } from './reports2/drop-out-report/drop-out-report.component';
import { DeletedReceiptReportComponent } from './reports2/deleted-receipt-report/deleted-receipt-report.component';
import { SummarizedFeeReviewReportComponent } from './reports2/summarized-fee-review-report/summarized-fee-review-report.component';
import { WalletCollectionComponent } from './reports2/wallet-collection/wallet-collection.component';
import { HostelReportComponent } from './reports2/hostel-report/hostel-report.component';
import { HostelOccupancyReportComponent } from './reports2/hostel-occupancy-report/hostel-occupancy-report.component';
import { PaymentOnlineSettlementReportComponent } from './reports2/payment-online-settlement-report/payment-online-settlement-report.component';
import { FeeOutstandingSummaryReportComponent } from './reports2/fee-outstanding-summary-report/fee-outstanding-summary-report.component';
import {CancelReceiptReportComponent} from './reports2/app-cancel-receipt-report/app-cancel-receipt-report.component';
@NgModule({
	imports: [
		CommonModule,
		ReportsRoutingModule,
		SharedmoduleModule,
		LoadingModule,
		AngularSlickgridModule.forRoot()
	],
	declarations: [ReportsComponent,
		ReportFilterComponent,
		ReportSortComponent, Reports2Component,
		CollectionReportComponent, OutstandingReportComponent, FeeLedgerReportComponent,
		DeletedFeetransReportComponent, FeeadjReportComponent, FeeconReportComponent,
		MissingFeeinvReportComponent, FeestrucReportComponent, ChequeclearanceReportComponent,
		SecurityDepositReportComponent, TransportReportComponent,DropoutReportComponent,DeletedReceiptReportComponent,CancelReceiptReportComponent,SummarizedFeeReviewReportComponent, WalletCollectionComponent, HostelReportComponent, HostelOccupancyReportComponent, PaymentOnlineSettlementReportComponent, FeeOutstandingSummaryReportComponent],
	entryComponents: [ReportFilterComponent, ReportSortComponent],
	providers: [TranslateService],
})
export class ReportsModule { }
