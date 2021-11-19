import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailNotificationComponent } from './email-notification/email-notification.component';
import { SmsNotificationComponent } from './sms-notification/sms-notification.component';
import { EmailNotificationListComponent } from './email-notification-list/email-notification-list.component';
import { SmsNotificationListComponent } from './sms-notification-list/sms-notification-list.component';

const routes: Routes = [
	{ path: '', component: EmailNotificationComponent },
	{ path: 'email', component: EmailNotificationComponent },
	{ path: 'sms', component: SmsNotificationComponent },
	{ path: 'sms-list', component: SmsNotificationListComponent },
	{ path: 'email-list', component: EmailNotificationListComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SchedulerNotificationsRoutingModule { }
