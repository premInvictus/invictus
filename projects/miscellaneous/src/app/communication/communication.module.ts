import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiscSharedModule } from '../misc-shared/misc-shared.module';
import * as _moment from 'moment';
import { CommunicationRoutingModule } from './communication-routing.module';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MessageComponent } from './message/message.component';
import { NotificationComponent } from './notification/notification.component';
import { BroadcastComponent } from './broadcast/broadcast.component';


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
		MiscSharedModule,
		CommunicationRoutingModule
	],
	declarations: [
		MessageComponent,
		NotificationComponent,
		BroadcastComponent
		],
	providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

	{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class CommunicationModule { }
