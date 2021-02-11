import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { InvoiceCreationComponent } from './invoice-creation/invoice-creation.component';
import { InvoiceCreationBulkComponent } from './invoice-creation-bulk/invoice-creation-bulk.component';
import { InvoiceCreationIndividualComponent } from './invoice-creation-individual/invoice-creation-individual.component';
import { FeeTransactionEntryComponent } from './fee-transaction-entry/fee-transaction-entry.component';
import { FeeLedgerComponent } from './fee-ledger/fee-ledger.component';
import { FeeModificationComponent } from './fee-modification/fee-modification.component';
import { FeeTransactionEntryBulkComponent } from './fee-transaction-entry-bulk/fee-transaction-entry-bulk.component';
import { WalletsLedgerComponent } from './wallets-ledger/wallets-ledger.component';
import { MissingInvoiceComponent } from './missing-invoice/missing-invoice.component';


const routes: Routes = [
	{ path: 'student-profile', component: StudentProfileComponent},
	{ path: 'invoice-creation', component: InvoiceCreationBulkComponent},
	{ path: 'invoice-creation-bulk', component: InvoiceCreationBulkComponent},
	{ path: 'invoice-creation-individual', component: InvoiceCreationIndividualComponent},
	{ path: 'fee-transaction-entry-bulk', component: FeeTransactionEntryBulkComponent},
	{ path: 'fee-transaction-entry-individual', component: FeeTransactionEntryComponent},
	{ path: 'fee-ledger', component: FeeLedgerComponent},
	{ path: 'fee-modification', component: FeeModificationComponent},
	{ path: 'fee-transaction-entry-bulk', component: FeeTransactionEntryBulkComponent},
	{ path: 'wallet-ledger', component: WalletsLedgerComponent},
	{ path: 'missing-invoice', component: MissingInvoiceComponent}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class FeemasterRoutingModule { }
