import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemSearchComponent } from './item-search/item-search.component';
import { PhysicalVerificationComponent } from './physical-verification/physical-verification.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { ChangeStatusComponent } from './change-status/change-status.component';
import { BarcodePrintComponent } from './barcode-print/barcode-print.component';
import { StockReconciliationComponent } from './stock-reconciliation/stock-reconciliation.component';
const routes: Routes = [
	{ path: 'item-search', component: ItemSearchComponent },
	{ path: 'physical-verification', component: PhysicalVerificationComponent },
	{ path: 'bulk-upload', component: BulkUploadComponent },
	{ path: 'change-status', component: ChangeStatusComponent },
	{ path: 'barcode-printing', component: BarcodePrintComponent },
	{ path: 'stock-reconciliation', component: StockReconciliationComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuxiliariesRoutingModule { }
