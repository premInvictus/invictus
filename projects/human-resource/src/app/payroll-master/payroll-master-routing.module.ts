import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalaryComputationComponent } from './salary-computation/salary-computation.component';
import { DisbursmentSheetComponent } from './disbursment-sheet/disbursment-sheet.component';
import { SalaryAdvanceComponent } from './salary-advance/salary-advance.component';
import { SecurityDetailComponent } from './security-month-wise/security-month-wise.component';

const routes: Routes = [
	{ path: 'salary-computation', component: SalaryComputationComponent },
  { path: 'disbursment-sheet', component: DisbursmentSheetComponent },
  { path: 'advance-salary', component: SalaryAdvanceComponent }	,
  { path: 'security-details', component: SecurityDetailComponent }		
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollMasterRoutingModule { }
