import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordMasterComponent } from './record-master/record-master.component';
import { VendorMasterComponent } from './vendor-master/vendor-master.component';
import { ProcurementMasterComponent } from './procurement-master/procurement-master.component';
import { PurchaseRequisitionComponent } from './purchase-requisition/purchase-requisition.component';
import { CreatePurchaseOrderComponent } from './create-purchase-order/create-purchase-order.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { GenerateReceiptComponent } from './generate-receipt/generate-receipt.component';
import { GoodsReceiptComponent } from './goods-receipt/goods-receipt.component';
const routes: Routes = [
	{ path: 'record-master', component: RecordMasterComponent },
	{ path: 'procurement-master', component: ProcurementMasterComponent },
	{ path: 'vendor-master', component: VendorMasterComponent },
	{ path: 'purchase-requisition', component: PurchaseRequisitionComponent },
	{ path: 'create-purchase-order', component: CreatePurchaseOrderComponent },
	{ path: 'purchase-order', component: PurchaseOrderComponent },
	{ path: 'generate-receipt', component: GenerateReceiptComponent },
	{ path: 'goods-receipt', component: GoodsReceiptComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class StoreMasterRoutingModule { }
