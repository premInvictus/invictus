import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonAPIService } from '../_services/commonAPI.service';
import { observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable()
export class FaService {

	constructor(private http: HttpClient, private service: CommonAPIService) { }
	insertVoucherEntry(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/voucher-entry/insertVoucherEntry', value);
	}
	updateVoucherEntry(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/voucher-entry/updateVoucherEntry', value);
	}
	getVoucherEntry(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/voucher-entry/getVoucherEntry', value);
	}
	getAllChartsOfAccount(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/charts-of-account/getAllChartsOfAccount', value);
	}
	getAllVoucherEntry(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/voucher-entry/getAllVoucherEntry', value);
	}
	createChartOfAccount(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/charts-of-account/insertChartsOfAccount', value);
	}
	updateChartOfAccount(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/charts-of-account/updateChartsOfAccount', value);
	}

	getAccountMaster(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/account-master/getAllAccountMaster', value);
	}
	getOrderMaster(value) {
		this.service.startLoading();
		return this.http.post(environment.apiInvUrl + '/requistion-master/getOrderMaster', value);
	}
	getVoucherTypeMaxId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/voucher-entry/getMaxVoucherTypeId', value);
	}
	getInvoiceDayBook(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/daybook/getInvoiceDayBook', value);
	}
	getNonPartialDayBook(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/daybook/getNonPartialDayBook', value);
	}
	getFeeMonths(value) {
		this.service.startLoading();
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getFeeMonths');
	}
	getLedger(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/ledger/getLedger', value);
	}
	insertAccountMaster(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/account-master/insertAccountMaster', value);
	}
	getSalaryComponent() {
		return this.http.get(environment.apiHRUrl + '/salary-component/getSalaryComponent');
	}
	getBanks(value) {
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getBanks');
	}
	getTrialBalance(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/ledger/getTrialBalance', value);
	}
	updateAccountMaster(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/account-master/updateAccountMaster', value);
	}
	updateAccountPosition(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/account-master/updateAccountPosition', value);
	}
	printvoucher(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/voucher-entry/printvoucher', value);
	}
	getGlobalSetting(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getGlobalSetting', value);
	}
	getSession() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/session');
	}
	getFeeHead(value) {
		return this.http.post(environment.apiFeeUrl + '/feeHeads/getFeeHeads', value);
	}
	getSattleJV(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/voucher-entry/getSattleJV', value);
	}
	changeSattleStatus(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/voucher-entry/changeSattleStatus', value);
	}

	insertMoveVoucherCodeLog(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/move-voucher-log/insertMoveVoucherLog', value);
	}

	updateMoveVoucherEntry(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/voucher-entry/updateForMove', value);
	}

	getGlobalSettingReplace(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getGlobalSettingReplace', value);
	}
	updateGlobalSetting(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/updateGlobalSetting', value);
	}
	getAdjustmentDayBook(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/daybook/getInvoiceDayBook', value);
	}

	updateBackDateEntry(value) {
		return this.http.post(environment.apiFeeUrl + '/feeTransaction/updateBackDateEntry', value);
	}

	checkPreviosuDueStatus(value) {
		return this.http.post(environment.apiFaUrl + '/voucher-entry/checkPreviosuDueStatus', value);
	}
	
	
}
