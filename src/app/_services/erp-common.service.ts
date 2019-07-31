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
			this.service.startLoading();
			return this.http.post(environment.apiFeeUrl + '/feeOnlineTransaction/checkForPaymentStatus', value);
		}
}
