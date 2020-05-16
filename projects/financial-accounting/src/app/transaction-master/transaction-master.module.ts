import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionMasterRoutingModule } from './transaction-master-routing.module';
import { FaSharedModule } from '../fa-shared/sharedmodule.module';
import { DaybookComponent } from './daybook/daybook.component';
import { PartyCreationComponent } from './party-creation/party-creation.component';
import { PartyWiseAccountsComponent } from './party-wise-accounts/party-wise-accounts.component';
import { PrettyExpenseLogComponent } from './pretty-expense-log/pretty-expense-log.component';
import { VoucherEntryComponent } from './voucher-entry/voucher-entry.component';

@NgModule({
  imports: [
    CommonModule,
    TransactionMasterRoutingModule,
    FaSharedModule
  ],
  declarations: [
    DaybookComponent,
    PartyCreationComponent,
    PartyWiseAccountsComponent,
    PrettyExpenseLogComponent,
    VoucherEntryComponent
  ],
  entryComponents: []
})
export class TransactionMasterModule { }
