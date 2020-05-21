import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayrollMasterRoutingModule } from './payroll-master-routing.module';
import { SalaryComputationComponent } from './salary-computation/salary-computation.component';
import { DisbursmentSheetComponent } from './disbursment-sheet/disbursment-sheet.component';
import { HrSharedModule } from '../hr-shared/hr-shared.module';
import { SalaryAdvanceComponent } from './salary-advance/salary-advance.component';

@NgModule({
  imports: [
    CommonModule,
    HrSharedModule,
    PayrollMasterRoutingModule
  ],
  declarations: [SalaryComputationComponent, DisbursmentSheetComponent, SalaryAdvanceComponent]
})
export class PayrollMasterModule { }
