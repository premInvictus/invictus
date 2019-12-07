import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessagesComponent } from './messages/messages.component';
import { ReviewerMessagesComponent } from './reviewer-messages/reviewer-messages.component';
const routes: Routes = [
  {path: 'messages', component: MessagesComponent},
  {path: 'reviewer', component: ReviewerMessagesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeMessagesRoutingModule { }
