import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeAttendanceComponent } from './employee-attendance/employee-attendance.component';
import { EmployeeLeaveComponent } from './employee-leave/employee-leave.component';
import { EmployeeLedgerComponent } from './employee-ledger/employee-ledger.component';
const routes: Routes = [
	{ path: 'employee-details', component: EmployeeDetailComponent },
	{ path: 'employee-attendance', component: EmployeeAttendanceComponent },
	{ path: 'employee-leave', component: EmployeeLeaveComponent },	
	{ path: 'employee-ledger', component: EmployeeLedgerComponent },	
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class EmployeeMasterRoutingModule { }
