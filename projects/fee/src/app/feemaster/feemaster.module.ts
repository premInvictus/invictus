import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';
import { CommonFilterModule } from '../common-filter/common-filter.module';
import { BarecodeScannerLivestreamModule } from 'ngx-barcode-scanner';
import { FeemasterRoutingModule } from './feemaster-routing.module';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { InvoiceCreationComponent } from './invoice-creation/invoice-creation.component';
import { InvoiceCreationBulkComponent } from './invoice-creation-bulk/invoice-creation-bulk.component';
import { InvoiceCreationIndividualComponent } from './invoice-creation-individual/invoice-creation-individual.component';
import { InvoiceCreationPopupComponent } from './invoice-creation-popup/invoice-creation-popup.component';
import { CommonStudentProfileComponent } from './common-student-profile/common-student-profile.component';
import { StudentAccountComponent } from './student-account/student-account.component';
import { FeeTransactionEntryComponent } from './fee-transaction-entry/fee-transaction-entry.component';
import { FeeLedgerComponent } from './fee-ledger/fee-ledger.component';
import { FeeModificationComponent } from './fee-modification/fee-modification.component';
import { InvoiceDetailsModalComponent } from './invoice-details-modal/invoice-details-modal.component';
import { FeeFilterModalComponent } from './fee-filter-modal/fee-filter-modal.component';
import { FeeTransactionEntryBulkComponent } from './fee-transaction-entry-bulk/fee-transaction-entry-bulk.component';
import { StudentRouteMoveStoreService } from './student-route-move-store.service';
import { LoadingModule } from 'ngx-loading';
import { InvoiceSearchModalComponent } from './invoice-search-modal/invoice-search-modal.component';
import { WalletsLedgerComponent } from './wallets-ledger/wallets-ledger.component';
@NgModule({
	imports: [
		CommonModule,
		FeemasterRoutingModule,
		SharedmoduleModule,
		CommonFilterModule,
		LoadingModule,
		BarecodeScannerLivestreamModule
	],
	entryComponents: [InvoiceDetailsModalComponent, InvoiceSearchModalComponent],
	declarations: [StudentProfileComponent,
		InvoiceCreationComponent,
		InvoiceCreationBulkComponent,
		InvoiceCreationIndividualComponent,
		CommonStudentProfileComponent,
		InvoiceCreationPopupComponent,
		StudentAccountComponent,
		FeeTransactionEntryComponent,
		FeeLedgerComponent,
		FeeModificationComponent,
		FeeFilterModalComponent,
		FeeTransactionEntryBulkComponent,
		InvoiceSearchModalComponent,
		WalletsLedgerComponent
	],
	providers: [StudentRouteMoveStoreService]
})
export class FeemasterModule { }
