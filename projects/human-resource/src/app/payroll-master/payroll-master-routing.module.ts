import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalaryComputationComponent } from './salary-computation/salary-computation.component';
import { DisbursmentSheetComponent } from './disbursment-sheet/disbursment-sheet.component';
import { SalaryAdvanceComponent } from './salary-advance/salary-advance.component';

const routes: Routes = [
	{ path: 'salary-computation', component: SalaryComputationComponent },
  { path: 'disbursment-sheet', component: DisbursmentSheetComponent },
  { path: 'advance-salary', component: SalaryAdvanceComponent }		
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollMasterRoutingModule { }
