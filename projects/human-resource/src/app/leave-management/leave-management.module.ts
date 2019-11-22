import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrSharedModule } from '../hr-shared/hr-shared.module';
import { LeaveManagementRoutingModule } from './leave-management-routing.module';
import { MyLeaveComponent } from './my-leave/my-leave.component';
@NgModule({
  imports: [
    CommonModule,    
    HrSharedModule,
    LeaveManagementRoutingModule
  ],
  declarations: [MyLeaveComponent]
})
export class LeaveManagementModule { }
