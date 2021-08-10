import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulerNotificationsRoutingModule } from './scheduler-notifications-routing.module';
import { EmailNotificationComponent } from './email-notification/email-notification.component';
import { SmsNotificationComponent } from './sms-notification/sms-notification.component';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';

import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { EmailNotificationListComponent } from './email-notification-list/email-notification-list.component';
import { SmsNotificationListComponent } from './sms-notification-list/sms-notification-list.component';

@NgModule({
	imports: [
		CommonModule,
		SchedulerNotificationsRoutingModule,
		SharedmoduleModule,
		MatRadioModule,
		MatTableModule,
		MatSortModule
	],
	declarations: [EmailNotificationComponent, SmsNotificationComponent, EmailNotificationListComponent, SmsNotificationListComponent]
})
export class SchedulerNotificationsModule { }
