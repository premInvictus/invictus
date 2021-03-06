import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { LoadingModule } from 'ngx-loading';

import { TransactionMasterRoutingModule } from './transaction-master-routing.module';
import { FaSharedModule } from '../fa-shared/sharedmodule.module';
import { DaybookComponent } from './daybook/daybook.component';
import { PartyCreationComponent } from './party-creation/party-creation.component';
import { PartyWiseAccountsComponent } from './party-wise-accounts/party-wise-accounts.component';
import { PrettyExpenseLogComponent } from './pretty-expense-log/pretty-expense-log.component';
import { VoucherEntryComponent } from './voucher-entry/voucher-entry.component';
import { IncomeDueComponent } from './daybook/income-due/income-due.component';
import { AdjustmentComponent } from './daybook/adjustment/adjustment.component';
import { ReceiptModeWiseComponent } from './daybook/receipt-mode-wise/receipt-mode-wise.component';
import { ReceiptModeWiseComponent1 } from './daybook/receipt_advance/receipt-mode-wise.component';
import { TotalFeeReceivableComponent } from './daybook/total-fee-receivable/total-fee-receivable.component';
import { VouchersListComponent } from './daybook/vouchers-list/vouchers-list.component';
import { VoucherPrintSetupComponent } from './voucher-print-setup/voucher-print-setup.component';
import { ModeltableComponent } from './modeltable/modeltable.component';
import { WalletComponent } from './daybook/wallet/wallet.component';
import { WalletModalComponent } from './wallet-modal/wallet-modal.component';
import { SalaryDisburseComponent } from './daybook/salary-disburse/salary-disburse.component';
@NgModule({
  imports: [
    CommonModule,
    TransactionMasterRoutingModule,
    FaSharedModule,
    LoadingModule,
    AngularSlickgridModule.forRoot(),
  ],
  declarations: [
    DaybookComponent,
    PartyCreationComponent,
    PartyWiseAccountsComponent,
    PrettyExpenseLogComponent,
    VoucherEntryComponent,
    IncomeDueComponent,
    ReceiptModeWiseComponent,
    ReceiptModeWiseComponent1,
    TotalFeeReceivableComponent,
    VouchersListComponent,
    VoucherPrintSetupComponent,
    AdjustmentComponent,
    ModeltableComponent,
    WalletComponent,
    WalletModalComponent,
    SalaryDisburseComponent
  ],
  entryComponents: [VoucherPrintSetupComponent, ModeltableComponent, WalletModalComponent]
})
export class TransactionMasterModule { }
