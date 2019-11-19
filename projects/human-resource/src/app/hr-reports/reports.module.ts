import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports/reports.component';
import { HrSharedModule } from '../hr-shared/hr-shared.module';
@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    HrSharedModule
  ],
  declarations: [ReportsComponent]
})
export class ReportsModule { }
