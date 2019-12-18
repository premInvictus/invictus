import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemSearchComponent } from './item-search/item-search.component';
import { PhysicalVerificationComponent } from './physical-verification/physical-verification.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { ChangeStatusComponent } from './change-status/change-status.component';
import { BarcodePrintComponent } from './barcode-print/barcode-print.component';
import { StockReconciliationComponent } from './stock-reconciliation/stock-reconciliation.component';
import { InventoryDetailsComponent } from '../inventory-shared/inventory-details/inventory-details.component';
import { BranchTransferComponent } from './branch-transfer/branch-transfer.component';
const routes: Routes = [
	{ path: 'item-search', component: ItemSearchComponent },
	{ path: 'branch-transfer', component: BranchTransferComponent },
	{ path: 'physical-verification', component: PhysicalVerificationComponent },
	{ path: 'bulk-upload', component: BulkUploadComponent },
	{ path: 'change-status', component: ChangeStatusComponent },
	{ path: 'barcode-print', component: BarcodePrintComponent },
	{ path: 'stock-reconciliation', component: StockReconciliationComponent },
	{ path: 'inventory-details', component: InventoryDetailsComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuxiliariesRoutingModule { }
