import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogueManagementRoutingModule } from './catalogue-management-routing.module';
import { LibrarySharedModule } from '../library-shared/library-shared.module';
import { AccessionMasterComponent } from './accession-master/accession-master.component';
import { PeriodicalMasterComponent, AddSubscriptionDialog } from './periodical-master/periodical-master.component';
import { VendorMasterComponent, AddVendorDialog } from './vendor-master/vendor-master.component';
import { PurchaseMasterComponent } from './purchase-master/purchase-master.component';

@NgModule({
  imports: [
    CommonModule,
    CatalogueManagementRoutingModule,
    LibrarySharedModule
  ],
  declarations: [AccessionMasterComponent, PeriodicalMasterComponent, VendorMasterComponent, PurchaseMasterComponent, AddSubscriptionDialog, AddVendorDialog],
  entryComponents: [
    AddSubscriptionDialog,
    AddVendorDialog
  ],
})
export class CatalogueManagementModule { }
