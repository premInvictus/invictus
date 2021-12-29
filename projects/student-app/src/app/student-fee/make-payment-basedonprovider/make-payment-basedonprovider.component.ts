import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ErpCommonService, CommonAPIService } from '../../../../../../src/app/_services/index';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-make-payment-basedonprovider',
  templateUrl: './make-payment-basedonprovider.component.html',
  styleUrls: ['./make-payment-basedonprovider.component.css']
})
export class MakePaymentBasedonproviderComponent implements OnInit {
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
    window.location.href = this.paytmResult.paymentLinks.web;
  }
  cancelPay() {
    localStorage.setItem('paymentWindowStatus', '0');
    window.parent.close();
  }

}
