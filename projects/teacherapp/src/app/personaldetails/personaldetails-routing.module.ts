import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaveDetailsComponent } from './leave-details/leave-details.component';
import { SalaryDetailsComponent } from './salary-details/salary-details.component';

const routes: Routes = [ 
    {
      path: 'salary_details', component: SalaryDetailsComponent,
    },
    {
      path: 'leave_details', component: LeaveDetailsComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonaldetailsRoutingModule { }
