import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuxillaryToolsRoutingModule } from './auxillary-tools-routing.module';
import { PromotionToolComponent } from './promotion-tool/promotion-tool.component';
import { ShufflingToolComponent } from './shuffling-tool/shuffling-tool.component';
import { SuspensionComponent } from './suspension/suspension.component';
import { ChangeEnrolmentNumberComponent } from './change-enrolment-number/change-enrolment-number.component';
import { ChangeEnrolmentStatusComponent } from './change-enrolment-status/change-enrolment-status.component';
import { IdCardPrintingComponent } from './id-card-printing/id-card-printing.component';
import { SlctcComponent } from './slctc/slctc.component';
import { EditRequestsComponent } from './edit-requests/edit-requests.component';
import { BulkUpdatesComponent } from './bulk-updates/bulk-updates.component';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';
import { MatTableModule } from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { RequestSlctcComponent } from './request-slctc/request-slctc.component';
import { ApproveSlctcComponent } from './approve-slctc/approve-slctc.component';
import { AcknowledgementSlctcComponent } from './acknowledgement-slctc/acknowledgement-slctc.component';
import { IssueSlctcComponent } from './issue-slctc/issue-slctc.component';
import { ReissueSlctcComponent } from './reissue-slctc/reissue-slctc.component';
import { ConfigSlctcComponent } from './config-slctc/config-slctc.component';
import { IdcardStyle1Component } from './id-card-printing/idcard-style1/idcard-style1.component';
import { IdcardStyle2Component } from './id-card-printing/idcard-style2/idcard-style2.component';
import { IdcardStyle3Component } from './id-card-printing/idcard-style3/idcard-style3.component';
import { ViewIdCardComponent } from './id-card-printing/view-id-card/view-id-card.component';
import { PrintIdCardComponent } from './id-card-printing/print-id-card/print-id-card.component';
import { CancelSlctcComponent } from './cancel-slctc/cancel-slctc.component';
import { ViewSlctcComponent } from './view-slctc/view-slctc.component';
import { ViewSlctcPrintComponent } from './config-slctc/view-slctc-print/view-slctc-print.component';




@NgModule({
	imports: [
		CommonModule,
		AuxillaryToolsRoutingModule,
		SharedmoduleModule,
		MatTableModule,
		MatSortModule,
		MatRadioModule,
		MatInputModule,
		MatFormFieldModule
	],
	declarations: [
		PromotionToolComponent,
		ShufflingToolComponent,
		SuspensionComponent,
		ChangeEnrolmentNumberComponent,
		ChangeEnrolmentStatusComponent,
		IdCardPrintingComponent,
		SlctcComponent,
		EditRequestsComponent,
		BulkUpdatesComponent,
		RequestSlctcComponent,
		ApproveSlctcComponent,
		AcknowledgementSlctcComponent,
		IssueSlctcComponent,
		ReissueSlctcComponent,
		ConfigSlctcComponent,
		IdcardStyle1Component,
		IdcardStyle2Component,
		IdcardStyle3Component,
		ViewIdCardComponent,
		PrintIdCardComponent,
		CancelSlctcComponent,
		ViewSlctcComponent,
		ViewSlctcPrintComponent
	],
	entryComponents: [ViewIdCardComponent, PrintIdCardComponent, ViewSlctcPrintComponent]
})
export class AuxillaryToolsModule {}
