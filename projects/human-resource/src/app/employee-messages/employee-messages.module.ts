import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeMessagesRoutingModule } from './employee-messages-routing.module';
import { HrSharedModule } from '../hr-shared/hr-shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessagesComponent } from './messages/messages.component';
import { ReviewerMessagesComponent } from './reviewer-messages/reviewer-messages.component';
import { ViewMessageComponent } from './view-message/view-message.component';
@NgModule({
  imports: [
    CommonModule,
    EmployeeMessagesRoutingModule,
    HrSharedModule,
		ReactiveFormsModule,
		FormsModule,
  ],
  declarations: [MessagesComponent,ReviewerMessagesComponent, ViewMessageComponent]
})
export class EmployeeMessagesModule { }
