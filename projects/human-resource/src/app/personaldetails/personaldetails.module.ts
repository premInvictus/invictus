import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrSharedModule } from '../hr-shared/hr-shared.module';

import { PersonaldetailsRoutingModule } from './personaldetails-routing.module';

import { SalaryDetailsComponent } from './salary-details/salary-details.component';
import { LeaveDetailsComponent } from './leave-details/leave-details.component';

@NgModule({
  imports: [
    CommonModule,
    PersonaldetailsRoutingModule,
    HrSharedModule
  ],
  declarations: [SalaryDetailsComponent,LeaveDetailsComponent]
})
export class PersonaldetailsModule { }
