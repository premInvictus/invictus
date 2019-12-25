import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventorySharedModule } from '../inventory-shared/inventory-shared.module';
import * as _moment from 'moment';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CategoriesComponent } from './categories/categories.component';
import { ItemCodeGenerationComponent } from './item-code-generation/item-code-generation.component';
import { LocationMasterComponent } from './location-master/location-master.component';
import { SetupComponent } from './setup/setup.component';

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
		ConfigurationRoutingModule
	],
	declarations: [
		CategoriesComponent,
		ItemCodeGenerationComponent,
		LocationMasterComponent,
		SetupComponent
	],
	entryComponents: [],
	providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

	{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class ConfigurationModule { }
