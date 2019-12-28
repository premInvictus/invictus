import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { InventorySharedModule } from '../inventory-shared/inventory-shared.module';
import * as _moment from 'moment';
import { ReportsRoutingModule } from './reports-routing.module';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ReportsComponent } from './reports/reports.component';
import { ItemMasterReportsComponent } from './item-master-reports/item-master-reports.component';


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
		ReportsRoutingModule,
		AngularSlickgridModule.forRoot()
	],
	declarations: [
		ReportsComponent,
		ItemMasterReportsComponent
	],
	entryComponents: [],
	providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

	{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class ReportsModule { }