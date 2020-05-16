import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancialStatementRoutingModule } from './finanacial-statements-routing.module';
import { FaSharedModule } from '../fa-shared/sharedmodule.module';
import { ChartsofAccountComponent } from './chart-of-accounts/chart-of-accounts.component';
import { IncomeAndExpenditureComponent } from './income-and-expenditure/income-and-expenditure.component';
import { ReceiptAndPaymentsComponent } from './receipts-and-payments/receipts-and-payments.component';
import { StatementOfAffairsComponent } from './statement-of-affairs/statement-of-affairs.component';
@NgModule({
  imports: [
    CommonModule,
    FaSharedModule,
    FinancialStatementRoutingModule
  ],
  declarations: [
    ChartsofAccountComponent,
    IncomeAndExpenditureComponent,
    ReceiptAndPaymentsComponent,
    StatementOfAffairsComponent
  ],
  entryComponents: []
})
export class FinancialStatementModule { }
