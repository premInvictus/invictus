import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonAPIService } from '../_services/commonAPI.service';
import { observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProcesstypeFeeService } from './processtype.service';
@Injectable()
export class FeeService {

	constructor(private http: HttpClient, private service: CommonAPIService,
		private processType: ProcesstypeFeeService) { }
	getFeeTypes(value) {
		this.service.startLoading();
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getFeeTypes');
	}
	getFeeMonths(value) {
		this.service.startLoading();
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getFeeMonths');
	}
	getFeeOthers(value) {
		this.service.startLoading();
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getFeeOthers');
	}
	getFeePeriods(value) {
		this.service.startLoading();
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getFeePeriods');
	}
	getCalculationMethods(value) {
		this.service.startLoading();
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getCalculationMethods');
	}
	getConcessionRuleType(value) {
		this.service.startLoading();
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getConcessionRuleType');
	}
	getFeeHeads(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeHeads/getFeeHeads', value);
	}
	insertFeeHeads(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeHeads/insertFeeHeads', value);
	}
	updateFeeHeads(value) {
		this.service.startLoading();
		return this.http.put(environment.apiFeeUrl + `/feeHeads/updateFeeHeads/${value.fh_id}`, value);
	}
	deleteFeeHeads(value) {
		this.service.startLoading();
		return this.http.put(environment.apiFeeUrl + `/feeHeads/deleteFeeHeads/${value.fh_id}`, value);
	}
	getConcessionCategory(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/concessionCategory/getConcessionCategory', value);
	}
	insertConcessionCategory(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/concessionCategory/insertConcessionCategory', value);
	}
	updateConcessionCategory(value) {
		this.service.startLoading();
		return this.http.put(environment.apiFeeUrl + '/concessionCategory/updateConcessionCategory/' + value.fcc_id, value);
	}
	deleteConcessionCategory(value) {
		this.service.startLoading();
		return this.http.delete(environment.apiFeeUrl + '/concessionCategory/deleteConcessionCategory/' + value.fcc_id, value);
	}
	getConcessionGroup(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/concessionGroup/getConcessionGroup', value);
	}
	getConcessionRectification(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/concessionGroup/getConcessionRectification', value);
	}
	insertConcessionGroup(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/concessionGroup/insertConcessionGroup', value);
	}
	updateConcessionRectification(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/concessionGroup/updateConcessionRectification', value);
	}
	updateConcessionGroup(value) {
		this.service.startLoading();
		return this.http.put(environment.apiFeeUrl + '/concessionGroup/updateConcessionGroup/' + value.fcg_id, value);
	}
	deleteConcessionGroup(value) {
		this.service.startLoading();
		return this.http.delete(environment.apiFeeUrl + '/concessionGroup/deleteConcessionGroup/' + value.fcg_id, value);
	}
	insertFeeGroup(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeGroup/insertFeeGroup', value);
	}
	updateFeeGroup(value) {
		this.service.startLoading();
		return this.http.put(environment.apiFeeUrl + `/feeGroup/updateFeeGroup/${value.fs_id}`, value);
	}
	getFeeGroup(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeGroup/getFeeGroup', value);
	}
	deleteFeeGroup(value) {
		this.service.startLoading();
		return this.http.put(environment.apiFeeUrl + '/feeGroup/deleteFeeGroup/' + value.fs_id, value);
	}
	getFinType() {
		this.service.startLoading();
		return this.http.get(environment.apiFeeUrl + '/fineandpenalties/getFineType');
	}
	getFineEvent() {
		this.service.startLoading();
		return this.http.get(environment.apiFeeUrl + '/fineandpenalties/getFineEvent');
	}
	getFineandPenalties(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/fineandpenalties/getFineandpenalties', value);
	}
	insertFineandPenalties(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/fineandpenalties/insertFineandpenalties', value);
	}

	getRoutes(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/transportroutes/getTransportRoutes', value);
	}
	getStoppages(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/transportstoppages/getTransportStoppages', value);
	}
	saveRoute(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/transportroutes/insertTransportRoutes', value);
	}
	getSlabs(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/transportslab/getTransportSlab', value);
	}
	saveStoppage(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/transportstoppages/insertTransportStoppages', value);
	}
	saveTransportSlab(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/transportslab/insertTransportSlab', value);
	}
	insertFeeStructure(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeStructure/insertFeeStructure', value);
	}
	updateFeeStructure(value) {
		this.service.startLoading();
		return this.http.put(environment.apiFeeUrl + `/feeStructure/updateFeeStructure/${value.fs_id}`, value);
	}
	getFeeStructure(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeStructure/getFeeStructure', value);
	}
	deleteFeeStructure(value) {
		this.service.startLoading();
		return this.http.put(environment.apiFeeUrl + '/feeStructure/deleteFeeStructure/' + value.fs_id, value);
	}
	getTransportMode() {
		this.service.startLoading();
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getTransportMode');
	}
	insertFeeAccount(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/feeAccount/insertFeeAccount', value);
	}
	updateFeeAccount(value) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/feeAccount/updateFeeAccount/' + value.accd_id, value);
	}
	getFeeAccount(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/feeAccount/getFeeAccount', value);
	}
	getInvoiceBifurcation(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/invoice/getInvoiceBifurcation', value);
	}
	getReceiptBifurcation(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/invoice/getReceiptBifurcation', value);
	}
	invoiceAdjustmentRemark(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/invoice/updateInvoice', value);
	}
	insertInvoice(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/invoice/insertInvoice', value);
	}
	printInvoice(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/invoice/printInvoice', value);
	}
	recalculateInvoice(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/invoice/recalculateInvoice', value);
	}
	deleteInvoice(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/invoice/deleteInvoice', value);
	}
	consolidateInvoice(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/invoice/consolidateInvoice', value);
	}
	unconsolidateInvoice(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/invoice/unconsolidateInvoice', value);
	}
	detachReceipt(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeTransaction/detachReceipt', value);
	}
	deleteReceipt(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeTransaction/deleteFeeReceipt', value);
	}

	attachReceipt(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeTransaction/attachReceipt', value);
	}
	getInvoice(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/invoice/getInvoice', value);
	}
	getStudentsForFilter(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/invoice/getStudentsForFilter', value);
	}
	getInvoiceFeeMonths(value) {
		this.service.startLoading();
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getInvoiceFeeMonths');
	}
	getEntryMode(value) {
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getEntryMode');
	}
	getPaymentMode(value) {
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getPaymentMode');
	}
	insertFeeTransaction(value: any) {
		this.service.startLoading();
		if (this.processType.getProcesstype()) {
			value.inv_process_type = this.processType.getProcesstype();
		}
		return this.http.post(environment.apiFeeUrl + '/feeTransaction/insertFeeTransaction', value);
	}
	getBanks(value) {
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getBanks');
	}
	getBanksAll(value) {
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getAllBank');
	}
	getCheckControlList(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/checkControlTool/getCheckControlList', value);
	}
	addCheckControlTool(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/checkControlTool/addCheckControlTool', value);
	}
	approveFeeTransaction(value: any) {
		return this.http.post(environment.apiFeeUrl + '/checkControlTool/approveFeeTransaction', value);
	}
	getFeeLedger(value: any) {
		this.service.startLoading();
		if (this.processType.getProcesstype()) {
			value.inv_process_type = this.processType.getProcesstype();
		}
		return this.http.post(environment.apiFeeUrl + '/feeTransaction/getFeeLedger', value);
	}
	getHeadWiseCollection(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeCollectionReports/getHeadWiseCollection', value);
	}
	getMissingFeeInvoiceReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeCollectionReports/getMissingFeeInvoiceReport', value);
	}
	getCheckControlReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeCollectionReports/getCheckControlReport', value);
	}
	getUserName() {
		return this.http.get(environment.apiSmartUrl + '/common/getUserName');
	}
	getFeeLedgerReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeCollectionReports/getFeeLedgerReport', value);
	}
	getDeletedFeeTransactionReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeCollectionReports/getDeletedFeeTransactionReport', value);
	}
	getFeeStructureReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeCollectionReports/getFeeStructureReport', value);
	}
	getFeeConcessionReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeCollectionReports/getFeeConcessionReport', value);
	}
	getFeeConcessionAllotedReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeCollectionReports/getFeeConcessionAllotedReport', value);
	}
	getFeeConcessionAllotedSummaryReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeCollectionReports/getFeeConcessionAllotedSummaryReport', value);
	}
	
	getFeeAdjustmentReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeCollectionReports/getFeeAdjustmentReport', value);
	}
	getFeeStructureAllotedReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeCollectionReports/getFeeStructureAllotedReport', value);
	}
	getAdvanceSecurityDepositReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeCollectionReports/getAdvanceSecurityDepositReport', value);
	}
	getTransportReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeCollectionReports/getTransportReport', value);
	}
	getMFRReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeCollectionReports/getMFRReport', value);
	}
	getFeeProjectionReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeCollectionReports/getFeeProjectionReport', value);
	}
	getFeeReceiptReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeCollectionReports/getFeeReceiptReport', value);
	}
	getFeeOutstanding(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeCollectionReports/getFeeOutstanding', value);
	}
	getClassWiseFeeOutstanding(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeCollectionReports/getClassWiseFeeOutstanding', value);
	}
	printReceipt(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeTransaction/printReceipt', value);
	}
	getStoppagesPerRoute(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/transportroutes/getStoppagesPerRoute', value);
	}
	getTransportSlabPerStoppages(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/transportstoppages/getTransportSlabPerStoppages', value);
	}
	addSchoolBank(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeSetup/addSchoolBank', value);
	}
	updateSchoolBank(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeSetup/updateSchoolBank', value);
	}
	deleteBank(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeSetup/deleteSchoolBank', value);
	}
	updateSchoolSettings(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeSetup/updateSchoolSettings', value);
	}
	getSchoolSettings() {
		this.service.startLoading();
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getSchoolSettings');
	}
	getStudentDataPerName(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/studentinfo/getStudentDataPerName', value);
	}
	updateInvoice(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/invoice/updateInvoice', value);
	}
	updateReceipt(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeTransaction/updateFeeReceipt', value);
	}
	getRouteWiseTransportReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeCollectionReports/getRouteWiseTransportReport', value);
	}
	addFamily(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/familyInformation/addFamily', value);
	}
	updateFamily(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/familyInformation/updateFamily', value);
	}
	deleteFamily(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/familyInformation/deleteFamily', value);
	}
	getFamilyWiseFeeReceipt(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/familyInformation/getFamilyWiseFeeReceipt', value);
	}

	getFamilyInformation(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/familyInformation/getFamilyInformation', value);
	}
	getFamilyOutstandingDetail(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/familyInformation/getFamilyOutstandingDetail', value);
	}

	printFamilyInvoice(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/familyInformation/printFamilyInvoice', value);
	}

	checkChildExists(value) {
		return this.http.post(environment.apiFeeUrl + '/familyInformation/checkChildExists', value);
	}
}
