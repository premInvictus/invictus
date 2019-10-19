import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
const routes: Routes = [
	{ path: 'employee-details', component: EmployeeDetailComponent }	
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class EmployeeMasterRoutingModule { }
