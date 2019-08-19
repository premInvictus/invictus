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
}
