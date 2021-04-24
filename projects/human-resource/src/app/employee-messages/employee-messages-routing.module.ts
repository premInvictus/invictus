import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessagesComponent } from './messages/messages.component';
import { ReviewerMessagesComponent } from './reviewer-messages/reviewer-messages.component';
import { OutboxComponent} from './outbox/outbox.component'
const routes: Routes = [
  {path: 'messages', component: MessagesComponent},
  {path: 'reviewer', component: ReviewerMessagesComponent},
  {path: 'outbox', component: OutboxComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeMessagesRoutingModule { }
