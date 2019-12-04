import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherMessagesRoutingModule } from './teacher-messages-routing.module';
import { SharedModule } from '../shared-module/share-module.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessagesComponent } from 'projects/teacherapp/src/app/teacher-messages/messages/messages.component';
import { ViewMessageComponent } from 'projects/teacherapp/src/app/teacher-messages/view-message/view-message.component';
@NgModule({
  imports: [
    CommonModule,
    TeacherMessagesRoutingModule,
    SharedModule,
		ReactiveFormsModule,
		FormsModule,
  ],
  declarations: [MessagesComponent, ViewMessageComponent]
})
export class TeacherMessagesModule { }
