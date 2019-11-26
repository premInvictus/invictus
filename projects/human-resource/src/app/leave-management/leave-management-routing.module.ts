import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyLeaveComponent } from './my-leave/my-leave.component';
import { EmployeeLeaveComponent } from './employee-leave/employee-leave.component';
const routes: Routes = [
  { path: 'my-leave', component: MyLeaveComponent },
  { path: 'emplyoee-leave', component: EmployeeLeaveComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveManagementRoutingModule { }
