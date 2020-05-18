import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartsofAccountComponent } from './chart-of-accounts/chart-of-accounts.component';
import { IncomeAndExpenditureComponent } from './income-and-expenditure/income-and-expenditure.component';
import { ReceiptAndPaymentsComponent } from './receipts-and-payments/receipts-and-payments.component';
import { StatementOfAffairsComponent } from './statement-of-affairs/statement-of-affairs.component';


const routes: Routes = [
  { path: 'charts-of-account', component: ChartsofAccountComponent },
  { path: 'income-and-expenditure', component: IncomeAndExpenditureComponent },
  { path: 'receipt-and-payments', component: ReceiptAndPaymentsComponent },
  { path: 'statement-of-affairs', component: StatementOfAffairsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialStatementRoutingModule { }
