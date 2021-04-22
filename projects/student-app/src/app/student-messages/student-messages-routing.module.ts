import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessagesComponent } from 'projects/student-app/src/app/student-messages/messages/messages.component';
import { OutboxComponent } from './outbox/outbox.component';

const routes: Routes = [
  {path: 'messages', component: MessagesComponent},
  {path: 'outbox', component: OutboxComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentMessagesRoutingModule { }
