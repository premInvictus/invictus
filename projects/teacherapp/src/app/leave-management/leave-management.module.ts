import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveManagementRoutingModule } from './leave-management-routing.module';
import { MyLeaveComponent } from './my-leave/my-leave.component';
import { LeaveApplicationComponent } from './my-leave/leave-application/leave-application.component';
import { SharedModule } from '../shared-module/share-module.module';
@NgModule({
  imports: [
    CommonModule, 
    LeaveManagementRoutingModule,
    SharedModule
  ],
  declarations: [MyLeaveComponent, LeaveApplicationComponent],
  entryComponents: [LeaveApplicationComponent]
})
export class LeaveManagementModule { }
