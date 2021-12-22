import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChequeControlToolComponent } from './cheque-control-tool/cheque-control-tool.component';
import { EditRequestsComponent } from './edit-requests/edit-requests.component';
import { ConcessionRectificationComponent } from './concession-rectification/concession-rectification.component';
import { FamilywiseFeeRecieptComponent } from './familywise-fee-reciept/familywise-fee-reciept.component';
import { AddFamilyComponent } from './add-family/add-family.component';
import { FamilyInformationComponent } from './family-information/family-information.component';
import { FamilyTransactionEntryComponent } from './family-transaction-entry/family-transaction-entry.component';
import { SecurityDepositComponent } from './security-deposit/security-deposit.component';
import { DropoutComponent } from './dropout/dropout.component';
import { BulkUpdatesComponent } from './bulk-updates/bulk-updates.component';
import { BulkWalletTransactionComponent } from './bulk-wallet-transaction/bulk-wallet-transaction.component';
import { MissingInvoiceComponent } from './missing-invoice/missing-invoice.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';

const routes: Routes = [
	{ path: 'cheque-control-tool', component: ChequeControlToolComponent },
	{path:  'edit-requests', component: EditRequestsComponent},
	{path:  'concession-rectification', component: ConcessionRectificationComponent},
	{ path: 'familywise-fee-reciept', component: FamilywiseFeeRecieptComponent},
	{ path: 'add-family', component: AddFamilyComponent},
	{ path: 'familywise-fee-receipt', component: FamilywiseFeeRecieptComponent},
	{ path: 'family-information', component: FamilyInformationComponent},
	{ path: 'family-transaction-entry', component: FamilyTransactionEntryComponent},
	{ path: 'security-deposit', component: SecurityDepositComponent},
	{ path: 'dropout', component: DropoutComponent},
	{ path: 'bulk-transaction', component: BulkUpdatesComponent},
	{ path: 'bulk-wallet-transaction', component: BulkWalletTransactionComponent},
	{ path: 'missing-invoices', component: MissingInvoiceComponent},
	{ path: 'bulk-update', component: BulkUploadComponent},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuxiliaryRoutingModule { }
