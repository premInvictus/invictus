import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillingRoutingModule } from './billing-routing.module';
import { SchoolListingComponent } from './school-listing/school-listing.component';
import { SchoolLedgerComponent } from './school-ledger/school-ledger.component';

@NgModule({
  imports: [
    CommonModule,
    BillingRoutingModule
  ],
  declarations: [SchoolListingComponent, SchoolLedgerComponent]
})
export class BillingModule { }
