import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessagesComponent } from 'projects/student-app/src/app/student-messages/messages/messages.component';
const routes: Routes = [
  {path: 'messages', component: MessagesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentMessagesRoutingModule { }
