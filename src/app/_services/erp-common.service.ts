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
		return this.http.post(environment.apiReservUrl + '/reservoir/insertReservoirData', value);
	}
	searchReservoir(value) {
		return this.http.post(environment.apiReservUrl + '/booksearch/searchReservoir', value);
	}
	getReservoirData(value) {
		return this.http.post(environment.apiReservUrl + '/reservoir/getReservoirData', value);
	}
	getLanguages(value) {
		return this.http.post(environment.apiReservUrl + '/reservoir/getLanguages', value);
	}
	getVendor(value) {
		return this.http.post(environment.apiReservUrl + '/vendor/getVendor', value);
	}
	getGenres(value) {
		return this.http.post(environment.apiReservUrl + '/reservoir/getGenres', value);
	}
	getBarcodePrint(value) {
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
		return this.http.post(environment.apiSisUrl + '/users/getUser', param);
	}
}
