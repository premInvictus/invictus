import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ErpCommonService, CommonAPIService } from '../../../../../../src/app/_services/index';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-make-payment-via-eazypay',
  templateUrl: './make-payment-via-eazypay.component.html',
  styleUrls: ['./make-payment-via-eazypay.component.css']
})
export class MakePaymentViaEazypayComponent implements OnInit {

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
    this.paytmResult = JSON.parse(localStorage.getItem('paymentData'));
    console.log('paytmResult', this.paytmResult);
    if (this.paytmResult) {
      this.outStandingAmt = this.paytmResult['amount'];
    }
  }
  goToLocation() {
    window.location.href = this.paytmResult.url;
  }
  cancelPay() {
    localStorage.setItem('paymentWindowStatus', '0');
    window.parent.close();
  }


}
