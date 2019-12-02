import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuxiliariesRoutingModule } from './auxiliaries-routing.module';
import { AdminReturnComponent } from './admin-return/admin-return.component';
import { HrSharedModule } from '../hr-shared/hr-shared.module';
import { HrEmpMarkAttendanceComponent } from './hr-emp-mark-attendance/hr-emp-mark-attendance.component';
import { ViewIdCardComponent } from './id-card-printing/view-id-card/view-id-card.component';
import { PrintIdCardComponent } from './id-card-printing/print-id-card/print-id-card.component';
import { IdcardStyle3Component } from './id-card-printing/idcard-style3/idcard-style3.component';
import { IdcardStyle2Component } from './id-card-printing/idcard-style2/idcard-style2.component';
import { IdcardStyle1Component } from './id-card-printing/idcard-style1/idcard-style1.component';
import { IdCardPrintingComponent } from './id-card-printing/id-card-printing.component';
import { BulkUpdatesComponent } from './bulk-updates/bulk-updates.component';

@NgModule({
  imports: [
    CommonModule,
    AuxiliariesRoutingModule,
    HrSharedModule
  ],
  declarations: [AdminReturnComponent, HrEmpMarkAttendanceComponent,
    IdCardPrintingComponent,
    IdcardStyle1Component,
    IdcardStyle2Component,
    IdcardStyle3Component,
    ViewIdCardComponent,
    PrintIdCardComponent,
    BulkUpdatesComponent
  ],
  entryComponents: [ViewIdCardComponent, PrintIdCardComponent]
})
export class AuxiliariesModule { }
