import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrSharedModule } from '../hr-shared/hr-shared.module';
import { LeaveManagementRoutingModule } from './leave-management-routing.module';
import { MyLeaveComponent } from './my-leave/my-leave.component';
import { LeaveApplicationComponent } from './my-leave/leave-application/leave-application.component';
import { EmployeeLeaveComponent } from './employee-leave/employee-leave.component';
import { ChangeSupervisorComponent } from './employee-leave/change-supervisor/change-supervisor.component';
@NgModule({
  imports: [
    CommonModule,    
    HrSharedModule,
    LeaveManagementRoutingModule
  ],
  declarations: [MyLeaveComponent, LeaveApplicationComponent, EmployeeLeaveComponent, ChangeSupervisorComponent],
  entryComponents: [LeaveApplicationComponent,ChangeSupervisorComponent]
})
export class LeaveManagementModule { }
