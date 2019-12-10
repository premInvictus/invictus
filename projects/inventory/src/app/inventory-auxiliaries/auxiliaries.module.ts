import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { InventorySharedModule } from '../inventory-shared/inventory-shared.module';
import * as _moment from 'moment';
import { AuxiliariesRoutingModule } from './auxiliaries-routing.module';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ItemSearchComponent } from './item-search/item-search.component';
import { PhysicalVerificationComponent } from './physical-verification/physical-verification.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { ChangeStatusComponent } from './change-status/change-status.component';
import { BarcodePrintComponent } from './barcode-print/barcode-print.component';
import { StockReconciliationComponent } from './stock-reconciliation/stock-reconciliation.component';

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
		InventorySharedModule,
		AuxiliariesRoutingModule
	],
	declarations: [
		ItemSearchComponent,
		PhysicalVerificationComponent,
		BulkUploadComponent,
		ChangeStatusComponent,
		BarcodePrintComponent,
		StockReconciliationComponent
	],
	entryComponents: [],
	providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

	{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class AuxiliariesModule { }
