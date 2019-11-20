import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminReturnComponent } from './admin-return/admin-return.component';
import { HrEmpMarkAttendanceComponent } from './hr-emp-mark-attendance/hr-emp-mark-attendance.component';


const routes: Routes = [
  { path: 'admin-return', component: AdminReturnComponent },
  { path: 'mark-attendance', component: HrEmpMarkAttendanceComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuxiliariesRoutingModule { }
