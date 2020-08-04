import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CertificatePrintingComponent } from './certificate-printing/certificate-printing.component';
import { PayableBalancesComponent } from './payable-balances/payable-balances.component';
import { ReconciliationComponent } from './reconciliation/reconciliation.component';
import { StatutoryFillingsComponent } from './statutory-fillings/statutory-fillings.component';
import { BulkUpdatesComponent } from './bulk-updates/bulk-updates.component';
const routes: Routes = [
  { path: 'certificate-printing', component: CertificatePrintingComponent },
  { path: 'payable-balances', component: PayableBalancesComponent },
  { path: 'reconciliation', component: ReconciliationComponent },
  { path: 'statutory-fillings', component: StatutoryFillingsComponent },
  { path: 'bulk-updates', component: BulkUpdatesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuxiliariesRoutingModule { }
