import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogueManagementRoutingModule } from './catalogue-management-routing.module';
import { LibrarySharedModule } from '../library-shared/library-shared.module';
import { AccessionMasterComponent } from './accession-master/accession-master.component';
import { PeriodicalMasterComponent } from './periodical-master/periodical-master.component';
import { AddSubscriptionDialog } from './periodical-master/add-subscription-dialog/add-subscription-dialog.component';

import { VendorMasterComponent } from './vendor-master/vendor-master.component';
import { AddVendorDialog } from './vendor-master/add-vendor-dialog/add-vendor-dialog.component';
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
