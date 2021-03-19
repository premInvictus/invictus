import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ErpCommonService, CommonAPIService } from '../../../../../../src/app/_services/index';
import { count } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-make-payment-payu',
  templateUrl: './make-payment-payu.component.html',
  styleUrls: ['./make-payment-payu.component.css']
})
export class MakePaymentPayuComponent implements OnInit {


  paytmResult: any;
  pauEnv = this.dom.bypassSecurityTrustResourceUrl(environment.payuApi);
  outStandingAmt = '';
  payFields: any[] = [];
  formData = new FormData();
  @ViewChild('myFormPost') myFormPost: ElementRef;
  constructor(
    public commonAPIService: CommonAPIService,
    public dom: DomSanitizer,
    public erpCommonService: ErpCommonService,
    public http: HttpClient
  ) { }

  ngOnInit() {

    this.paytmResult = JSON.parse(localStorage.getItem('paymentData'));
    console.log('paytmResult', this.paytmResult);
    if (this.paytmResult) {

      Object.keys(this.paytmResult).forEach(key => {
        this.payFields.push({
          name: key,
          value: this.paytmResult[key]
        })

      });

      this.outStandingAmt = this.paytmResult['amount'];
    }
  }

  cancelPay() {
    localStorage.setItem('paymentWindowStatus', '0');
    window.parent.close();
  }

}
