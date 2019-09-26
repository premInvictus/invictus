import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessionMasterComponent } from './accession-master/accession-master.component';
import { PeriodicalMasterComponent } from './periodical-master/periodical-master.component';
import { VendorMasterComponent } from './vendor-master/vendor-master.component';
import { PurchaseMasterComponent } from './purchase-master/purchase-master.component';

const routes: Routes = [
  { path: 'accession-master', component: AccessionMasterComponent },
  { path: 'periodical-master', component: PeriodicalMasterComponent },
  { path: 'vendor-master', component: VendorMasterComponent },
  { path: 'purchase-master', component: PurchaseMasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogueManagementRoutingModule { }
