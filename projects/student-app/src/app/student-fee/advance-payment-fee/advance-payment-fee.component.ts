import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { QelementService } from 'projects/admin-app/src/app/questionbank/service/qelement.service';
import { InvoiceElement } from 'projects/fee/src/app/auxiliary/family-transaction-entry/invoiceelement.model';
import { FeeLedgerElement } from 'projects/fee/src/app/feemaster/fee-ledger/fee-ledger.model';
import { CommonAPIService, ErpCommonService } from 'src/app/_services';
import { PaymentChooserComponent } from '../payment-chooser/payment-chooser.component';

@Component({
  selector: 'app-advance-payment-fee',
  templateUrl: './advance-payment-fee.component.html',
  styleUrls: ['./advance-payment-fee.component.css']
})
export class AdvancePaymentFeeComponent implements OnInit {

  invoiceArray: any;
  @ViewChild('chooser') chooser;
  dialogRef: MatDialogRef<PaymentChooserComponent>;
  totalRecords: any;
  recordArray: any[] = [];
  lastRecordId: any;
  loginId: any;
  processType: any;
  orderMessage = '';
  footerRecord: any = {
    feeduetotal: 0,
    concessiontotal: 0,
    receipttotal: 0
  };
  userDetail: any;
  studentInvoiceData: any;
  responseHtml = '';
  paytmResult: any = {};
  postURL = '';
  apiResponse: any = {
    suceessWithData: false,
    sucessWithNoData: false,
    errorWithNoData: false,
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') table: ElementRef;
  @ViewChild('paymentOrderModel') paymentOrderModel;
  @ViewChild('paytmResponse', { read: ElementRef }) private paytmResponse: ElementRef;
  INVOICE_ELEMENT: InvoiceElement[] = [];
  FEE_LEDGER_ELEMENT: FeeLedgerElement[] = [];

  finalMonthArr: any[] = [];
  monthArray: any[] = [];
  // tslint:disable-next-line: max-line-length
  displayedColumns: string[] = ['srno', 'invoiceno', 'feeperiod', 'invoicedate', 'duedate', 'feedue', 'status', 'action'];
  dataSource = new MatTableDataSource<InvoiceElement>(this.INVOICE_ELEMENT);

  displayedLedgerColumns: string[] = ['srno', 'date', 'invoiceno', 'feeperiod', 'particular', 'amount', 'concession', 'reciept', 'balance'];

  ledgerDataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
  monthJSON: any[] = [
    { month_id: 1, month_name: 'January' },
    { month_id: 2, month_name: 'February' },
    { month_id: 3, month_name: 'March' },
    { month_id: 4, month_name: 'April' },
    { month_id: 5, month_name: 'May' },
    { month_id: 6, month_name: 'June' },
    { month_id: 7, month_name: 'July' },
    { month_id: 8, month_name: 'August' },
    { month_id: 9, month_name: 'September' },
    { month_id: 10, month_name: 'October' },
    { month_id: 11, month_name: 'November' },
    { month_id: 12, month_name: 'December' }
  ];
  pageIndex = 0;
  currentIndex = 0;
  invoicepagesize = 10;
  invoicepagesizeoptions = [10, 25, 50, 100];
  outStandingAmt = 0;
  payAPICall: any;
  unsubscribePayAPIStatus: any;
  paymentStatus = false;
  settings: any[] = [];
  settingArr7: any[] = [];
  counter = 0;
  noDataFlag: boolean;
  advanceFeepayForm: FormGroup;
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    public commonAPIService: CommonAPIService,
    public erpCommonService: ErpCommonService,
    public qelementService: QelementService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private fbuild: FormBuilder
  ) { }
  buildForm() {
    this.advanceFeepayForm = this.fbuild.group({
      months: [],
      amount: ''
    })
  }
  ngOnInit() {
    this.buildForm();
    this.getGlobalSetting();
    this.invoiceArray = [];
    this.INVOICE_ELEMENT = [];
    this.recordArray = [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loginId = currentUser.login_id;
    this.processType = currentUser.au_process_type;
    this.getSchool();
  }

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getGlobalSetting() {
    this.settingArr7 = [];
    this.erpCommonService.getGlobalSetting({ "gs_alias": "payment_banks" }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.settings = (result.data[0] && result.data[0]['gs_value']) ? JSON.parse(result.data[0] && result.data[0]['gs_value']) : [];
        console.log(this.settings);
        this.counter = 0;
        this.currentIndex = 0;
        if (this.settings && this.settings.length > 0) {
          let i = 0;
          for (const item of this.settings) {
            if (item.enabled === 'true') {
              this.settingArr7.push(item.bank_alias);
              this.counter++;
            }
            if (this.counter === 1) {
              this.currentIndex = i;
            }
            i++;
          }
        } else {
          this.counter = 0;
        }

      }
    });
  }



  orderPayment(element) {
    // this.commonAPIService.showSuccessErrorMessage('Sorry ! This service is not Available', 'error');
    this.outStandingAmt = element.amount;
    this.orderMessage = 'Are you confirm to make payment?  Your Pyament is : <b>' + this.outStandingAmt + '</b>';
    this.makePayment(element);
  }


  makePayment(element) {
    console.log('Do Payment');
    if (this.counter === 0) {
      this.commonAPIService.showSuccessErrorMessage('No providers available', 'error');
    }
    if (this.counter === 1) {
      const bank: any = {
        bank: this.settingArr7[0]
      };
      console.log(bank);
      this.exceutePayment(bank);
    }
    if (this.counter > 1) {
      this.chooser.openModal();
    }
  }
  getMID(value) {
    const index = this.settings.findIndex(f => f.bank_alias === value);
    if (index !== -1) {
      return this.settings[index]['merchant'];
    }
  }
  exceutePayment($event) {
    if ($event && $event.bank) {
      const bank: any = $event.bank;
      const inputJson = {
        inv_login_id: this.loginId,
        inv_process_type: this.processType,
        out_standing_amt: this.outStandingAmt,
        bank: bank,
        advance_fee_type: true,
        trans_fm_id: this.advanceFeepayForm.value.months
      };
      if (bank === 'icici') {
        this.erpCommonService.makeTransaction(inputJson).subscribe((result: any) => {
          localStorage.setItem('paymentData', '');
          if (result && result.status === 'ok') {
            console.log('result.data[0]', result.data[0]);
            this.paytmResult['url'] = result.data[0]['url'];
            const ORDER_ID = this.paytmResult.order_id;
            const MID = this.getMID(bank);
            this.paytmResult['amount'] = this.outStandingAmt;
            localStorage.setItem('paymentData', JSON.stringify(this.paytmResult));
            const hostName = window.location.href.split('/')[2];
            var left = (screen.width / 2) - (800 / 2);
            var top = (screen.height / 2) - (800 / 2);
            window.open(location.protocol + '//' + hostName + '/student/make-paymentviaeazypay', 'Payment', 'height=800,width=800,dialog=yes,resizable=no, top=' +
              top + ',' + 'left=' + left);
            localStorage.setItem('paymentWindowStatus', '1');
            this.payAPICall = setInterval(() => {
              if (ORDER_ID && MID) {
                this.checkForPaymentStatus(ORDER_ID, MID);
              }
            }, 10000);
          } else {
            this.paymentOrderModel.closeDialog();
          }
        });
      }
      if (bank === 'axis') {
        this.erpCommonService.makeTransaction(inputJson).subscribe((result: any) => {
          localStorage.setItem('paymentData', '');
          if (result && result.status === 'ok') {
            console.log('result.data[0]', result.data[0]);
            this.paytmResult = result.data[0];
            const ORDER_ID = this.paytmResult.orderId;
            const MID = this.getMID(bank);
            localStorage.setItem('paymentData', JSON.stringify(this.paytmResult));
            const hostName = window.location.href.split('/')[2];
            var left = (screen.width / 2) - (800 / 2);
            var top = (screen.height / 2) - (800 / 2);
            window.open(location.protocol + '//' + hostName + '/student/make-payment', 'Payment', 'height=800,width=800,dialog=yes,resizable=no, top=' +
              top + ',' + 'left=' + left);
            localStorage.setItem('paymentWindowStatus', '1');


            // this.payAPICall = interval(10000).subscribe(x => {

            // });
            this.payAPICall = setInterval(() => {
              if (ORDER_ID && MID) {
                this.checkForPaymentStatus(ORDER_ID, MID);
              }
            }, 10000);



          } else {
            this.paymentOrderModel.closeDialog();
          }

        });
      }
      if (bank === 'paytm') {
        this.erpCommonService.makeTransaction(inputJson).subscribe((result: any) => {
          localStorage.setItem('paymentData', '');
          if (result && result.status === 'ok') {
            this.paytmResult = result.data[0];
            let ORDER_ID, MID;
            for (let i = 0; i < this.paytmResult.length; i++) {
              if (this.paytmResult[i]['name'] === 'ORDER_ID') {
                ORDER_ID = this.paytmResult[i]['value'];
              }
              if (this.paytmResult[i]['name'] === 'MID') {
                MID = this.paytmResult[i]['value'];
              }
            }
            localStorage.setItem('paymentData', JSON.stringify(this.paytmResult));
            const hostName = window.location.href.split('/')[2];
            var left = (screen.width / 2) - (800 / 2);
            var top = (screen.height / 2) - (800 / 2);
            window.open(location.protocol + '//' + hostName + '/student/make-paymentviapg', 'Payment', 'height=800,width=800,dialog=yes,resizable=no, top=' +
              top + ',' + 'left=' + left);
            localStorage.setItem('paymentWindowStatus', '1');
            // this.payAPICall = interval(10000).subscribe(x => {

            // });
            this.payAPICall = setInterval(() => {
              if (ORDER_ID && MID) {
                this.checkForPaymentStatus(ORDER_ID, MID);
              }
            }, 10000);

          } else {
            this.paymentOrderModel.closeDialog();
          }

        });
      }
      if (bank === 'hdfc') {
        this.erpCommonService.makeTransaction(inputJson).subscribe((result: any) => {
          localStorage.setItem('paymentData', '');
          if (result && result.status === 'ok') {
            this.paytmResult = result.data[0];
            console.log(this.paytmResult);
            const ORDER_ID = this.paytmResult.id;
            const MID = this.paytmResult.merchant;
            localStorage.setItem('paymentData', JSON.stringify(this.paytmResult));
            const hostName = window.location.href.split('/')[2];
            var left = (screen.width / 2) - (800 / 2);
            var top = (screen.height / 2) - (800 / 2);
            window.open(location.protocol + '//' + hostName + '/student/make-paymentviarazorpay', 'Payment', 'height=800,width=800,dialog=yes,resizable=no, top=' +
              top + ',' + 'left=' + left);
            localStorage.setItem('paymentWindowStatus', '1');
            this.payAPICall = setInterval(() => {
              if (ORDER_ID && MID) {
                this.checkForPaymentStatus(ORDER_ID, MID);
              }
            }, 10000);

          } else {
            this.paymentOrderModel.closeDialog();
          }
        });
      }

    }
  }
  checkForPaymentStatus(ORDER_ID, MID) {
    const inputJson = {
      // invoice_ids: this.studentInvoiceData['inv_ids'],	
      inv_login_id: this.loginId,
      // inv_login_id: 1567,
      inv_process_type: this.processType,
      orderId: ORDER_ID,
      mid: MID
    };

    this.erpCommonService.checkForPaymentStatus(inputJson).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        const resultData = result.data;
        console.log(resultData);
        if (resultData && resultData[0]['trans_status'] === 'TXN_SUCCESS' || resultData && resultData[0]['trans_status'] === 'TXN_FAILURE') {
          this.paymentStatus = true;
          clearInterval(this.payAPICall);
          this.getSchool();
        }
      }
    });
  }
  getMonthPerSessionPerLoginId() {
    this.finalMonthArr = [];
    this.erpCommonService.getAlreadyPaidMonthsPerSessionAndLoginId({}).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        const monthData: any[] = res.data;
        for (const item of this.monthArray) {
          if (Number(item.month_id) > 0 && Number(item.month_id) < 10) {
            item.month_id = '0' + item.month_id;
          } else {
            item.month_id = item.month_id.toString();
          }
          const findex = monthData.indexOf(item.month_id);
          if (findex == -1) {
            this.finalMonthArr.push(item);
          }
        }
        this.apiResponse['suceessWithData'] = true;
        this.apiResponse['suceessWithNoData'] = false;
        this.noDataFlag = false;
      } else {
        this.apiResponse['suceessWithData'] = false;
        this.apiResponse['suceessWithNoData'] = true;
        this.noDataFlag = true;
      }
    });
  }
  getSchool() {
    this.erpCommonService.getSchool().subscribe((res: any) => {
      this.monthArray = [];
      if (res && res.status === 'ok') {
        const schoolinfo = res.data[0];
        const startMonth = schoolinfo.session_start_month;
        const endMonth = schoolinfo.session_end_month;
        for (let i = Number(startMonth); i <= Number(endMonth) + 12; i++) {
          for (const item of this.monthJSON) {
            if (i === item.month_id) {
              this.monthArray.push(item);
            }
            if ((i - 12) === item.month_id) {
              this.monthArray.push(item);
            }
          }
        }
        console.log(this.monthArray);
        this.getMonthPerSessionPerLoginId();
      }
    });
  }
  ngOnDestroy() {
    if (this.payAPICall) {
      clearInterval(this.payAPICall);
    }
    this.getSchool();
  }
}
