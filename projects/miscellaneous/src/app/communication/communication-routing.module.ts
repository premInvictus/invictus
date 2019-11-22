import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MessageComponent } from './message/message.component';
import { NotificationComponent } from './notification/notification.component';
const routes: Routes = [
	{ path: 'message', component: MessageComponent },
	{ path: 'notification', component: NotificationComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CommunicationRoutingModule { }
