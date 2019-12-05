import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentMessagesRoutingModule } from './student-messages-routing.module';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessagesComponent } from 'projects/student-app/src/app/student-messages/messages/messages.component';
import { ViewMessageComponent } from 'projects/student-app/src/app/student-messages/view-message/view-message.component';
@NgModule({
  imports: [
    CommonModule,
    StudentMessagesRoutingModule,
    SharedModuleModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [MessagesComponent, ViewMessageComponent]
})
export class StudentMessagesModule { }
