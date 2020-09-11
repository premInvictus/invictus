import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { BillingRoutingModule } from './billing-routing.module';
import { SchoolListingComponent } from './school-listing/school-listing.component';
import { SchoolLedgerComponent } from './school-ledger/school-ledger.component';
import { InvoiceModalComponent } from './invoice-modal/invoice-modal.component';

@NgModule({
  imports: [
    CommonModule,
    BillingRoutingModule,
    SharedModuleModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [SchoolListingComponent, SchoolLedgerComponent, InvoiceModalComponent],
  entryComponents:[InvoiceModalComponent]
})
export class BillingModule { }
