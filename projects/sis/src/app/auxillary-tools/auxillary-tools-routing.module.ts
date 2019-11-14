import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromotionToolComponent } from './promotion-tool/promotion-tool.component';
import { ShufflingToolComponent } from './shuffling-tool/shuffling-tool.component';
import { SuspensionComponent } from './suspension/suspension.component';
import { ChangeEnrolmentNumberComponent } from './change-enrolment-number/change-enrolment-number.component';
import { IdCardPrintingComponent } from './id-card-printing/id-card-printing.component';
import { SlctcComponent } from './slctc/slctc.component';
import { EditRequestsComponent } from './edit-requests/edit-requests.component';
import { BulkUpdatesComponent } from './bulk-updates/bulk-updates.component';
import { ChangeEnrolmentStatusComponent } from './change-enrolment-status/change-enrolment-status.component';
import { RequestSlctcComponent } from './request-slctc/request-slctc.component';
import { ApproveSlctcComponent } from './approve-slctc/approve-slctc.component';
import { AcknowledgementSlctcComponent } from './acknowledgement-slctc/acknowledgement-slctc.component';
import { IssueSlctcComponent } from './issue-slctc/issue-slctc.component';
import { ReissueSlctcComponent } from './reissue-slctc/reissue-slctc.component';
import { ConfigSlctcComponent } from './config-slctc/config-slctc.component';
import { IdcardStyle1Component } from './id-card-printing/idcard-style1/idcard-style1.component';
import { IdcardStyle2Component } from './id-card-printing/idcard-style2/idcard-style2.component';
import { IdcardStyle3Component } from './id-card-printing/idcard-style3/idcard-style3.component';
import { CancelSlctcComponent } from './cancel-slctc/cancel-slctc.component';
import { ViewSlctcComponent } from './view-slctc/view-slctc.component';
import { BranchTransferToolComponent } from './branch-transfer-tool/branch-transfer-tool.component';
import { BulkInsertComponent } from './bulk-insert/bulk-insert.component';

const routes: Routes = [
	{path: '', component: PromotionToolComponent},
	{path: 'promotion-tool', component: PromotionToolComponent},
	{path: 'branch-transfer-tool', component: BranchTransferToolComponent},
	{path: 'shuffling-tool', component: ShufflingToolComponent},
	{path: 'suspension', component: SuspensionComponent},
	{path: 'change-enrolment-status', component: ChangeEnrolmentStatusComponent},
	{path: 'change-enrolment-number', component: ChangeEnrolmentNumberComponent},
	{path: 'id-card-printing', component: IdCardPrintingComponent},
	{path: 'style1', component: IdcardStyle1Component},
	{path: 'style2', component: IdcardStyle2Component},
	{path: 'style3', component: IdcardStyle3Component},
	{path: 'request-slc', component: RequestSlctcComponent},
	{path: 'approve-slc', component: ApproveSlctcComponent},
	{path: 'acknowledgement-slc', component: AcknowledgementSlctcComponent},
	{path: 'issue-slc', component: IssueSlctcComponent},
	{path: 'reissue-slc', component: ReissueSlctcComponent},
	{path: 'config-slc', component: ConfigSlctcComponent},
	{path: 'slc', component: SlctcComponent},
	{path: 'edit-requests', component: EditRequestsComponent},
	{path: 'bulk-updates', component: BulkUpdatesComponent},
	{path: 'bulk-insert', component: BulkInsertComponent},
	{path: 'cancel-slc', component: CancelSlctcComponent},
	{path: 'view-slc', component: ViewSlctcComponent}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuxillaryToolsRoutingModule { }
