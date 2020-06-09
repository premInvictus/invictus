import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionMasterRoutingModule } from './transaction-master-routing.module';
import { FaSharedModule } from '../fa-shared/sharedmodule.module';
import { DaybookComponent } from './daybook/daybook.component';
import { PartyCreationComponent } from './party-creation/party-creation.component';
import { PartyWiseAccountsComponent } from './party-wise-accounts/party-wise-accounts.component';
import { PrettyExpenseLogComponent } from './pretty-expense-log/pretty-expense-log.component';
import { VoucherEntryComponent } from './voucher-entry/voucher-entry.component';
import { IncomeDueComponent } from './daybook/income-due/income-due.component';
import { ReceiptModeWiseComponent } from './daybook/receipt-mode-wise/receipt-mode-wise.component';
import { TotalFeeReceivableComponent } from './daybook/total-fee-receivable/total-fee-receivable.component';
import { VouchersListComponent } from './daybook/vouchers-list/vouchers-list.component';

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
    VoucherEntryComponent,
    IncomeDueComponent,
    ReceiptModeWiseComponent,
    TotalFeeReceivableComponent,
    VouchersListComponent
  ],
  entryComponents: []
})
export class TransactionMasterModule { }
