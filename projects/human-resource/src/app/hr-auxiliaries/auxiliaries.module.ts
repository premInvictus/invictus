import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuxiliariesRoutingModule } from './auxiliaries-routing.module';
import { AdminReturnComponent } from './admin-return/admin-return.component';
import { HrSharedModule } from '../hr-shared/hr-shared.module';
import { HrEmpMarkAttendanceComponent } from './hr-emp-mark-attendance/hr-emp-mark-attendance.component';

@NgModule({
  imports: [
    CommonModule,
    AuxiliariesRoutingModule,
    HrSharedModule 
  ],
  declarations: [AdminReturnComponent, HrEmpMarkAttendanceComponent]
})
export class AuxiliariesModule { }
