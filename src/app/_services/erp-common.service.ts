import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonAPIService } from '../_services/commonAPI.service';
import { observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable()
export class ErpCommonService {

	constructor(private http: HttpClient, private service: CommonAPIService) { }
	getStudentInvoice(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeOnlineTransaction/getStudentInvoice', value);
	}
	updateRFIDMapping(value) {
		return this.http.post(environment.apiReservUrl + '/rfidmapping/updateRFIDMapping', value);
	}
	insertReservoirData(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/reservoir/insertReservoirData', value);
	}
	deleteReservoirData(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/reservoir/deleteReservoirData', value);
	}
	updateReservoirData(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/reservoir/updateReservoirData', value);
	}
	generateBookRequest(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/bookreservation/generateBookRequest', value);
	}
	searchReservoir(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/booksearch/searchReservoir', value);
	}
	getReservoirData(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/reservoir/getReservoirData', value);
	}
	getBookReservations(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/bookreservation/getBookReservations', value);
	}
	deleteReservationData(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/bookreservation/deleteReservationData', value);
	}
	expireReservationData(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/bookreservation/expireReservationData', value);
	}
	updateReservationData(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/bookreservation/updateReservationData', value);
	}
	getReservoirDataBasedOnFilter(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/reservoir/getReservoirDataBasedOnFilter', value);
	}
	getBookLogsPerBook(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/reservoir/getBookLogsPerBook', value);
	}
	getLanguages(value) {
		return this.http.post(environment.apiReservUrl + '/reservoir/getLanguages', value);
	}
	getVendor(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/vendor/getVendor', value);
	}
	getGenres(value) {
		return this.http.post(environment.apiReservUrl + '/reservoir/getGenres', value);
	}
	getBarcodePrint(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/barcodeprint/getBarcodePrint', value);
	}
	getFeeLedger(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeTransaction/getFeeLedger/', value);
	}

	downloadInvoice(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/invoice/printInvoice', value);
	}

	getStudentFeeOutstanding(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeOnlineTransaction/getStudentFeeOutstanding', value);
	}

	makeTransaction(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeOnlineTransaction/makeTransaction', value);
	}

	getOnlineTransaction(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeOnlineTransaction/getOnlineTransaction', value);
	}

	downloadReceipt(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/feeTransaction/printReceipt', value);
	}

	checkForPaymentStatus(value: any) {
		return this.http.post(environment.apiFeeUrl + '/feeOnlineTransaction/checkForPaymentStatus', value);
	}

	// smart api
	getScheduler(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/scheduler/getScheduler', value);
	}
	getSubjectByTeacherIdClassIdSectionId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/getSubjectByTeacherIdClassIdSectionId', value);
	}
	getSectionByTeacherIdClassId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/getSectionByTeacherIdClassId', value);
	}
	getClassByTeacherId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/getClassByTeacherId', value);
	}
	getClassByTeacherIdSubjectId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/getClassByTeacherIdSubjectId', value);
	}
	getSmartToAxiom(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/setup/getSmartToAxiom', value);
	}
	getSubject(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/setup/getSubject', value);
	}
	getClasswork(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/classwork/getClasswork', value);
	}
	getClasswiseDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smttimetable/getClasswiseDetails', value);
	}
	getTimeTableId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smttimetable/getTimeTableId', value);
	}
	getClassSectionWiseTimeTable(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smttimetable/getClassSectionWiseTimeTable', value);
	}
	getTeacherwiseTableDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smttimetable/getTeacherwiseTableDetails', value);
	}
	getPeriodDayByClass(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smttimetable/getPeriodDayByClass', value);
	}
	getSubjectsByClass(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/getSubjectsByClass', value);
	}
	getAssignment(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/assignment/getAssignment', value);
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

	getEntryMode(value) {
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getEntryMode');
	}
	getPaymentMode(value) {
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getPaymentMode');
	}
	getFeePeriods(value) {
		this.service.startLoading();
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getFeePeriods');
	}
	getBanks(value) {
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getBanks');
	}
	getBanksAll(value) {
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getAllBank');
	}
	getCalculationMethods(value) {
		this.service.startLoading();
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getCalculationMethods');
	}
	insertFeeTransaction(value: any) {
		this.service.startLoading();
		// if (this.processType.getProcesstype()) {
		// 	value.inv_process_type = this.processType.getProcesstype();
		// }
		return this.http.post(environment.apiFeeUrl + '/feeTransaction/insertFeeTransaction', value);
	}
	getSchool() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/dashboard/getSchool');
	}
	getUser(value) {
		const param: any = {};
		if (value.full_name) {
			param.au_full_name = value.full_name;
		}
		if (value.login_id) {
			param.au_login_id = value.login_id;
		}
		if (value.class_id) {
			param.au_class_id = value.class_id;
		}
		if (value.sec_id) {
			param.au_sec_id = value.sec_id;
		}
		if (value.role_id) {
			param.au_role_id = value.role_id;
		}
		if (value.sub_id) {
			param.au_sub_id = value.sub_id;
		}
		if (value.status) {
			param.au_status = value.status;
		}
		if (value.au_admission_no) {
			param.au_admission_no = value.au_admission_no;
		}
		this.service.startLoading();
		return this.http.post(environment.apiAxiomUrl + '/users/getUser', param);
	}

	getVerificationLog(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/physicalverification/getPhysicalVerification', value);
	}

	insertPhysicalVerification(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/physicalverification/insertPhysicalVerification', value);
	}

	updatePhysicalVerification(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/physicalverification/updatePhysicalVerification', value);
	}

	getSubscriptionList(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/subscription/getSubscription', value);
	}

	getVendorList(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/vendor/getVendor', value);
	}

	insertSubscription(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/subscription/insertSubscription', value);
	}

	updateSubscription(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/subscription/updateSubscription', value);
	}

	deleteSubscription(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/subscription/deleteSubscription', value);
	}

	insertVendor(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/vendor/insertVendor', value);
	}

	updateVendor(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/vendor/updateVendor', value);
	}

	deleteVendor(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/vendor/deleteVendor', value);
	}

	getStudentInformation(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/students/getAllStudents', value);
	}




	insertUserReservoirData(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/issuereturnprocess/insertUserReservoirData', value);
	}

	getUserReservoirData(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/issuereturnprocess/getUserReservoirData', value);
	}

	updateUserReservoirData(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/issuereturnprocess/updateUserReservoirData', value);
	}


	changeReservoirStatus(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/reservoir/changeReservoirStatus', value);
	}

	searchReservoirByStatus(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/booksearch/searchReservoirByStatus', value);
	}

	getTeacher(value) {
		const param: any = {};
		if (value.full_name) {
			param.au_full_name = value.full_name;
		}
		if (value.login_id) {
			param.au_login_id = value.login_id;
		}
		if (value.class_id) {
			param.au_class_id = value.class_id;
		}
		if (value.sec_id) {
			param.au_sec_id = value.sec_id;
		}
		if (value.role_id) {
			param.au_role_id = value.role_id;
		}
		if (value.sub_id) {
			param.au_sub_id = value.sub_id;
		}
		if (value.status) {
			param.au_status = value.status;
		}
		if (value.au_admission_no) {
			param.au_admission_no = value.au_admission_no;
		}
		this.service.startLoading();
		return this.http.post(environment.apiAxiomUrl + '/users/getAllTeacher', param);
	}

	getDashboardReservoirData(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/dashboard/getReservoirData', value);
	}

	getDashboardIssueBookData(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/dashboard/getIssuedReservoir', value);
	}

	getDashboardDueReservoirData(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/dashboard/getDueReservoir', value);
	}

	getIssueReturnReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/dashboard/getIssueReturnReport', value);
	}
	getSession() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/session');
	}

	uploadBulkDocuments(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/bulkUpdate/uploadBulkDocuments', value);
	}

	downloadBulkUpdateTemplate(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/bulkUpdate/downloadBulkUpdateTemplate', value);
	}

	insertGenre(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/genre/insertGenre', value);
	}

	getGenre(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/genre/getGenre', value);
	}

	getGlobalSetting(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getGlobalSetting', value);
	}

	updateGlobalSetting(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/updateGlobalSetting', value);
	}

	getClass(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/setup/getClass', value);
	}

	getSection(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/setup/getSection', value);
	}

	getBookIssued(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/issuereturnprocess/getBookIssued', value);
	}

	getClassTeacher(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/ctForClass', value);
	}

	getSectionsByClass(value) {
		const param: any = {};
		param.class_id = value.class_id;
		if (value.role_id) {
			param.role_id = value.role_id;
		}
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/setupdetail/getSectionsByClass', param);
	}

	getUserOutstandingFine(value) {
		this.service.startLoading();
		return this.http.post(environment.apiReservUrl + '/issuereturnprocess/getUserOutstandingFine', value);

	}
	checkUserStatus(value) {
		this.service.startLoading();
		return this.http.put(environment.apiAxiomUrl + `/users/checkUserExists`, value);
	}
	changeUserStatus(value) {
		this.service.startLoading();
		return this.http.post(environment.apiAxiomUrl + '/users/changeUserStatus', value);
	}
	reset_password(value) {
		this.service.startLoading();
		return this.http.post(environment.apiAxiomUrl + '/users/reset_password', value);
	}

	insertMessage(value) {
		this.service.startLoading();
		return this.http.post(environment.apiHRUrl + '/communication/insert', value);
	}

	updateMessage(value) {
		this.service.startLoading();
		return this.http.post(environment.apiHRUrl + '/communication/update', value);
	}

	getMessage(value) {
		this.service.startLoading();
		return this.http.post(environment.apiHRUrl + '/communication/getAll', value);
	}

	uploadDocuments(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/documents/uploadDocuments', value);
	}
	
	getMasterStudentDetail(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/students/getAllStudents', value);
	}

	getLastMessageRecord(value) {
		this.service.startLoading();
		return this.http.post(environment.apiHRUrl + '/communication/lastMessageId', value);
	}

	getUserItemsData(value) {
		this.service.startLoading();
		return this.http.post(environment.apiInvUrl + '/inventory-user/getAll', value);
	}

	searchItemByStatus(value) {
		this.service.startLoading();
		return this.http.post(environment.apiInvUrl + '/configuration/filterItemsFromMaster', value);
	}

	insertUserItemData(value) {
		this.service.startLoading();
		return this.http.post(environment.apiInvUrl + '/inventory-user/insert', value);
	}

	updateUserItemData(value) {
		this.service.startLoading();
		return this.http.post(environment.apiInvUrl + '/inventory-user/update', value);
	}

	getFilterLocation(value) {
		//this.service.startLoading();
		return this.http.post(environment.apiInvUrl + '/location/getAll', value);
	}

	getInventoryPhysicalVerification(value) {
		this.service.startLoading();
		return this.http.post(environment.apiInvUrl + '/physical-verification/getAll', value);
	}

	insertInventoryPhysicalVerification(value) {
		this.service.startLoading();
		return this.http.post(environment.apiInvUrl + '/physical-verification/insert', value);
	}

	getInventoryStockReconciliation(value) {
		this.service.startLoading();
		return this.http.post(environment.apiInvUrl + '/stock-reconciliation/getAll', value);
	}

	updateInventoryStockReconciliation(value) {
		this.service.startLoading();
		return this.http.post(environment.apiInvUrl + '/stock-reconciliation/update', value);
	}

	getVendorLogDetail(value) {
		this.service.startLoading();
		return this.http.post(environment.apiInvUrl + '/vendor/getAll', value);
	}

	getSectionsByClassMultiple(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/getSectionsByClassMultiple', value);
	}

}



