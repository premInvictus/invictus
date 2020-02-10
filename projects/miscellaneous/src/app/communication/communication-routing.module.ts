import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MessageComponent } from './message/message.component';
import { NotificationComponent } from './notification/notification.component';
import { BroadcastComponent } from './broadcast/broadcast.component';
import { ComposeMessageComponent } from './../misc-shared/compose-message/compose-message.component';
import { CallLogsComponent } from './call-logs/call-logs.component';
const routes: Routes = [
	{ path: 'message', component: MessageComponent },
	{ path: 'broadcast', component: BroadcastComponent },
	{ path: 'notification', component: NotificationComponent },
	{ path: 'compose-message', component: ComposeMessageComponent },
	{ path: 'call-logs', component: CallLogsComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CommunicationRoutingModule { }
