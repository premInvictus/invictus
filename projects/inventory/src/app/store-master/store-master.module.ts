import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { InventorySharedModule } from '../inventory-shared/inventory-shared.module';
import * as _moment from 'moment';
import { StoreMasterRoutingModule } from './store-master-routing.module';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { RecordMasterComponent } from './record-master/record-master.component';
import { VendorMasterComponent } from './vendor-master/vendor-master.component';
import { ProcurementMasterComponent } from './procurement-master/procurement-master.component';
import { AddVendorDialog } from './vendor-master/add-vendor-dialog/add-vendor-dialog.component';


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
		StoreMasterRoutingModule
	],
	declarations: [
		RecordMasterComponent,
		VendorMasterComponent,
		ProcurementMasterComponent,
		AddVendorDialog
	],
	entryComponents: [AddVendorDialog],
	providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

	{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class StoreMasterModule { }
