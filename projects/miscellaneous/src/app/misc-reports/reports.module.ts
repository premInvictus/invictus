import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports/reports.component';
import { MiscSharedModule } from '../misc-shared/misc-shared.module';
@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MiscSharedModule
  ],
  declarations: [ReportsComponent]
})
export class ReportsModule { }
