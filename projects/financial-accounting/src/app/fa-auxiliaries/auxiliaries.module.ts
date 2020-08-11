import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuxiliariesRoutingModule } from './auxiliaries-routing.module';
import { FaSharedModule } from '../fa-shared/sharedmodule.module';

import { CertificatePrintingComponent } from './certificate-printing/certificate-printing.component';
import { PayableBalancesComponent } from './payable-balances/payable-balances.component';
import { ReconciliationComponent } from './reconciliation/reconciliation.component';
import { StatutoryFillingsComponent } from './statutory-fillings/statutory-fillings.component';
import { BulkUpdatesComponent } from './bulk-updates/bulk-updates.component';
@NgModule({
  imports: [
    CommonModule,
    AuxiliariesRoutingModule,
    FaSharedModule
  ],
  declarations: [CertificatePrintingComponent,
    PayableBalancesComponent,
    ReconciliationComponent,
    StatutoryFillingsComponent,
    BulkUpdatesComponent
  ],
  entryComponents: []
})
export class AuxiliariesModule { }
