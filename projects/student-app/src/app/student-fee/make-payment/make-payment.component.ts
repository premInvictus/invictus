import { Component, OnInit } from '@angular/core';
import { ErpCommonService, CommonAPIService } from '../../../../../../src/app/_services/index';

@Component({
	selector: 'app-make-payment',
	templateUrl: './make-payment.component.html',
	styleUrls: ['./make-payment.component.css']
})
export class MakePaymentComponent implements OnInit {
	paytmResult: any;
	paytmResponsHtml = '';
	postURL = '';
	constructor(
		public commonAPIService: CommonAPIService,
		public erpCommonService: ErpCommonService
	) { }

	ngOnInit() {
		this.paytmResult = JSON.parse(localStorage.getItem('paymentData'));
		this.setFormData(this.paytmResult);
	}

	setFormData(data) {
		const transactionUrl = 'https://securegw-stage.paytm.in/theia/processTransaction';
		this.postURL = transactionUrl;
		if (data.responseData) {
			this.paytmResult = data.responseData;
		}
	}
}
