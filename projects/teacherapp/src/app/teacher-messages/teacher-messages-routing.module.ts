import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessagesComponent } from 'projects/teacherapp/src/app/teacher-messages/messages/messages.component';
const routes: Routes = [
  {path: 'messages', component: MessagesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherMessagesRoutingModule { }
