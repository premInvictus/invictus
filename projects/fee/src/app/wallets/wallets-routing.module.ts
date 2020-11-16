import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { WalletsLedgerComponent } from './wallets-ledger/wallets-ledger.component';

const routes: Routes = [
	{path: '', component: WalletsLedgerComponent},
	{path: 'ledger', component: WalletsLedgerComponent},
	{path: 'add-transaction', component: AddTransactionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletsRoutingModule { }
