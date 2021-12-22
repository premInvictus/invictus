import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared-module/share-module.module';
import { PersonaldetailsRoutingModule } from './personaldetails-routing.module';
import { SalaryDetailsComponent } from './salary-details/salary-details.component';
import { LeaveDetailsComponent } from './leave-details/leave-details.component';

@NgModule({
  imports: [
    CommonModule,
    PersonaldetailsRoutingModule,
    SharedModule
  ],
  declarations: [SalaryDetailsComponent, LeaveDetailsComponent]
})
export class PersonaldetailsModule { }
