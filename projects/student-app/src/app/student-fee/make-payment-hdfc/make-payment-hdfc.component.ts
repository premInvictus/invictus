import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ErpCommonService, CommonAPIService } from '../../../../../../src/app/_services/index';
import { count } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-make-payment-hdfc',
  templateUrl: './make-payment-hdfc.component.html',
  styleUrls: ['./make-payment-hdfc.component.css']
})
export class MakePaymentHdfcComponent implements OnInit {

  paytmResult: any;
  paytmResponsHtml = '';
  postURL = '';
  outStandingAmt = '';
  formData = new FormData();
  @ViewChild('myFormPost') myFormPost: ElementRef;
  constructor(
    public commonAPIService: CommonAPIService,
    public erpCommonService: ErpCommonService,
    public http: HttpClient
  ) { }

  ngOnInit() {
    const transactionUrl = 'https://securegw-stage.paytm.in/theia/processTransaction';
    this.postURL = transactionUrl;
    this.paytmResult = JSON.parse(localStorage.getItem('paymentData'));
    console.log('paytmResult', this.paytmResult);
    if (this.paytmResult) {
      this.outStandingAmt = this.paytmResult['payAmt'];
    }
  }

  cancelPay() {
    localStorage.setItem('paymentWindowStatus', '0');
    window.parent.close();
  }
}

