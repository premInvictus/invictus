import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DaybookComponent } from './daybook/daybook.component';
import { PartyCreationComponent } from './party-creation/party-creation.component';
import { PartyWiseAccountsComponent } from './party-wise-accounts/party-wise-accounts.component';
import { PrettyExpenseLogComponent } from './pretty-expense-log/pretty-expense-log.component';
import { VoucherEntryComponent } from './voucher-entry/voucher-entry.component';

const routes: Routes = [
  { path: 'daybook', component: DaybookComponent },
  { path: 'party-creation', component: PartyCreationComponent },
  { path: 'party-wise-account', component: PartyWiseAccountsComponent },
  { path: 'pretty-expense-log', component: PrettyExpenseLogComponent },
  { path: 'voucher-entry', component: VoucherEntryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionMasterRoutingModule { }
