import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';
import { ChequeControlToolComponent } from './cheque-control-tool/cheque-control-tool.component';
import { BouncedChequeModalComponent } from './cheque-control-tool/bounced-cheque-modal/bounced-cheque-modal.component';

import { AuxiliaryRoutingModule } from './auxiliary-routing.module';
import { EditRequestsComponent } from './edit-requests/edit-requests.component';
import { ConcessionRectificationComponent } from './concession-rectification/concession-rectification.component';
import { ConcessionRemarkModalComponent } from './concession-rectification/concession-remark-modal/concession-remark-modal.component';

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
		ConcessionRemarkModalComponent
	]
})
export class AuxiliaryModule { }
