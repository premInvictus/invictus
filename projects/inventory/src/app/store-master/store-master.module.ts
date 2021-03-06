import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreMasterRoutingModule } from './store-master-routing.module';
import { InventorySharedModule } from '../inventory-shared/inventory-shared.module';
import * as _moment from 'moment';

import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { RecordMasterComponent } from './record-master/record-master.component';
import { VendorMasterComponent } from './vendor-master/vendor-master.component';
import { ProcurementMasterComponent } from './procurement-master/procurement-master.component';
import { AddVendorDialog } from './vendor-master/add-vendor-dialog/add-vendor-dialog.component';
import { PurchaseRequisitionComponent } from './purchase-requisition/purchase-requisition.component';
import { CreatePurchaseOrderComponent } from './create-purchase-order/create-purchase-order.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { GenerateReceiptComponent } from './generate-receipt/generate-receipt.component';
import { GoodsReceiptComponent } from './goods-receipt/goods-receipt.component';
import { ProcurementCommonComponent } from './procurement-common/procurement-common.component';
import { BranchTranferTwoComponent } from './branch-tranfer-two/branch-tranfer-two.component';
import { AddItemsBranchTransferComponent } from './add-items-branch-transfer/add-items-branch-transfer.component';


const moment = _moment;

export const MY_FORMATS = {
	parse: {
		dateInput: 'L',
	},
	display: {
		dateInput: 'DD-MMM-YYYY',
		monthYearLabel: 'YYYY',
		dateA11yLabel: 'LL',
		monthYearA11yLabel: 'YYYY',
	},
};
@NgModule({
	imports: [
		CommonModule,
		StoreMasterRoutingModule,
		InventorySharedModule
	],
	declarations: [
		RecordMasterComponent,
		VendorMasterComponent,
		ProcurementMasterComponent,
		AddVendorDialog,
		PurchaseRequisitionComponent,
		CreatePurchaseOrderComponent,
		PurchaseOrderComponent,
		GenerateReceiptComponent,
		GoodsReceiptComponent,
		ProcurementCommonComponent,
		BranchTranferTwoComponent,
		AddItemsBranchTransferComponent
	],
	entryComponents: [AddVendorDialog],
	providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

	{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class StoreMasterModule { }
