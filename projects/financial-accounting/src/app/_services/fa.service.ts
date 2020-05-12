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
		return this.http.put(environment.apiFaUrl + '/voucher-entry/updateVoucherEntry', value);
	}
	getVoucherEntry(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/voucher-entry/getVoucherEntry', value);
	}
	getAllChartsOfAccount(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFaUrl + '/charts-of-account/getAllChartsOfAccount', value);
	}
}
