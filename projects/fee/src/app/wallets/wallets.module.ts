import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';

import { WalletsRoutingModule } from './wallets-routing.module';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { WalletsLedgerComponent } from './wallets-ledger/wallets-ledger.component';
import { StudentRouteMoveStoreService } from './student-route-move-store.service';
import { CommonStudentProfileComponent } from './common-student-profile/common-student-profile.component';


@NgModule({
  imports: [
    CommonModule,
    WalletsRoutingModule,
    SharedmoduleModule
  ],
  declarations: [AddTransactionComponent, WalletsLedgerComponent,CommonStudentProfileComponent],
  providers:[StudentRouteMoveStoreService]
})
export class WalletsModule { }
