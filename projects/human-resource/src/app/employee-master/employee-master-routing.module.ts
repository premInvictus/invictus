import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { TabDetailsComponent } from './tab-details/tab-details.component';

const routes: Routes = [
  {
		path: 'employee-details', component: EmployeeDetailsComponent,
  },
  {
		path: 'tab-details', component: TabDetailsComponent,
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeMasterRoutingModule { }
 