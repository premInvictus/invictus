import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';
import { ChequeControlToolComponent } from './cheque-control-tool/cheque-control-tool.component';
import { BouncedChequeModalComponent } from './cheque-control-tool/bounced-cheque-modal/bounced-cheque-modal.component';

import { AuxiliaryRoutingModule } from './auxiliary-routing.module';
import { EditRequestsComponent } from './edit-requests/edit-requests.component';
import { ConcessionRectificationComponent } from './concession-rectification/concession-rectification.component';
import { ConcessionRemarkModalComponent } from './concession-rectification/concession-remark-modal/concession-remark-modal.component';
import { FamilywiseFeeRecieptComponent } from './familywise-fee-reciept/familywise-fee-reciept.component';
import { AddFamilyComponent } from './add-family/add-family.component';
import { FamilyInformationComponent } from './family-information/family-information.component';
import { FamilyTransactionEntryComponent } from './family-transaction-entry/family-transaction-entry.component';
import { SecurityDepositComponent } from './security-deposit/security-deposit.component';
import { DropoutComponent } from './dropout/dropout.component';
@NgModule({
	imports: [
		CommonModule,
		AuxiliaryRoutingModule,
		SharedmoduleModule
	],
	entryComponents: [BouncedChequeModalComponent, ConcessionRemarkModalComponent

	],
	declarations: [
		BouncedChequeModalComponent,
		ChequeControlToolComponent,
		EditRequestsComponent,
		ConcessionRectificationComponent,
		ConcessionRemarkModalComponent,
		FamilywiseFeeRecieptComponent,
		AddFamilyComponent,
		FamilyInformationComponent,
		FamilyTransactionEntryComponent,
		SecurityDepositComponent,
		DropoutComponent
	]
})
export class AuxiliaryModule { }
