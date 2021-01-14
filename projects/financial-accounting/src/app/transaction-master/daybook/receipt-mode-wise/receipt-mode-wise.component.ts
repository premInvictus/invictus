import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './model';
import { SelectionModel } from '@angular/cdk/collections';
import { TitleCasePipe } from '@angular/common';
import { SisService, CommonAPIService, FaService } from '../../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { IndianCurrency } from '../../../_pipes';
import * as moment from 'moment';
import { ModeltableComponent } from '../../modeltable/modeltable.component';

@Component({
  selector: 'app-receipt-mode-wise',
  templateUrl: './receipt-mode-wise.component.html',
  styleUrls: ['./receipt-mode-wise.component.scss']
})
export class ReceiptModeWiseComponent implements OnInit {

  @Input() param: any;
  tableDivFlag = false;
  ELEMENT_DATA: any[] = [];
  displayedColumns: any[] = [];
  displayedDate: any[] = [];
  session: any;
  headtoatl = 0;
  eachheadtotal_details: any;
  partialPaymentStatus = 1;
  apiInvoiceData = [];
  apiReceiptData = [];
  chartsOfAccount: any[] = [];
  chartsOfAccountInvoice: any[] = [];
  vcData: any;
  currentVcType = 'Receipt';
  sessionArray: any[] = [];
  sessionName: any;
  voucherDate: any;
  currentVoucherData: any;
  tempChartsOfAccountInvoice: any[] = [];
  vcYearlyStatus = 0;
  feeReceivableAccountId = 0;
  feeReceivableAccountName = 'Fee Receivable';
  globalsetup:any;

  constructor(
    private fbuild: FormBuilder,
    private sisService: SisService,
    private commonAPIService: CommonAPIService,
    private faService: FaService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.session = JSON.parse(localStorage.getItem('session'));
    this.checkPartialPaymentStatus();
    this.getGlobalSetting();
    //this.getChartsOfAccount();
    this.getSession();
    //this.getInvoiceDayBook();
  }
  ngOnChanges() {
    this.session = JSON.parse(localStorage.getItem('session'));
    console.log(this.param);
    this.getChartsOfAccount();
    this.getSession();
    this.getGlobalSetting();
    if (this.partialPaymentStatus) {
      this.getInvoiceDayBook();
    } else {
      this.getNonPartialDayBook();
    }


  }
  openModel(e) {
    const dialogRefFilter = this.dialog.open(ModeltableComponent, {
			width: '70%',
			height: '70%',
			data: {
        month_id: this.param.month,
        date: e.date,
        reportType: 'headwise'
			}
		});
		dialogRefFilter.afterClosed().subscribe(result => {
		});
  }
  // getGlobalSetting() {
	// 	let param: any = {};
	// 	param.gs_alias = ['fa_voucher_code_format_yearly_status'];
	// 	this.faService.getGlobalSetting(param).subscribe((result: any) => {
	// 		if (result && result.status === 'ok') {
	// 			if (result.data && result.data[0]) {
	// 				this.vcYearlyStatus = Number(result.data[0]['gs_value']);
	// 				console.log('this.vcYearlyStatus', this.vcYearlyStatus)
	// 			}

	// 		}
	// 	})
  // }
  getGlobalSetting() {
		let param: any = {};
		this.globalsetup = {};
		param.gs_alias = ['fa_voucher_code_format_yearly_status','fa_session_freez'];
		this.faService.getGlobalSetting(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				result.data.forEach(element => {
					this.globalsetup[element.gs_alias] = element.gs_value
				});
				this.vcYearlyStatus = Number(this.globalsetup['fa_voucher_code_format_yearly_status']);
			}
		})
	}
  checkPartialPaymentStatus() {
    let param: any = {};
    param.gs_alias = ['fa_partial_payment'];
    this.faService.getGlobalSetting(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        if (result.data && result.data[0]) {
          this.partialPaymentStatus = Number(result.data[0]['gs_value']);
        }

      }
    })
  }

  getInvoiceDayBook() {
    this.headtoatl = 0;
    this.displayedColumns = [];
    this.ELEMENT_DATA = [];
    this.faService.getInvoiceDayBook({ sessionId: this.session.ses_id, monthId: Number(this.param.month) }).subscribe((data: any) => {
      if (data) {

        const tempData: any = data.receipt_data;
        this.apiReceiptData = data.receipt_data;

        const tempHeader: any[] = [];

        tempData.forEach(e => {
          e.value.forEach(element => {
            element.temp_id = element.pay_name ? element.pay_name.toString().toLowerCase().replace(/ /g, '') : '';
          });
        });
        console.log(tempData);
        tempData[0].value.forEach(element => {
          this.displayedColumns.push({
            id: element.temp_id,
            name: element.pay_name
          });
        });
        const dateArray: any[] = [];
        tempData.forEach(e => {
          const index = dateArray.findIndex(t => t == e.date);
          if (index == -1) {
            dateArray.push(e);
          }
        });
        this.eachheadtotal_details = {};
        this.displayedColumns.forEach(ee => {
          this.eachheadtotal_details['id_' + ee.id] = 0;
        });
        if (tempData.length > 0) {
          dateArray.forEach(e => {
            const tempelement: any = {};
            tempelement['date'] = e.date;
            tempelement['vc_id'] = e.vc_id;
            tempelement['vc_state'] = e.vc_state;
            tempelement['voucherExists'] = e.vc_state == 'delete' ? false : e.voucherExists;
            tempelement['be_back_status'] = e.be_back_status;
            let tempvalue = tempData.find(element => element.date == e.date);
            if (tempvalue) {
              this.displayedColumns.forEach(ee => {
                tempvalue.value.forEach(element => {
                  if (element.temp_id == ee.id) {
                    let tempvaluehead = element.receipt_amt ? Number(element.receipt_amt) : 0;
                    this.headtoatl += tempvaluehead;
                    tempelement['id_' + ee.id] = tempvaluehead;
                    this.eachheadtotal_details['id_' + ee.id] += tempvaluehead;
                  }
                });

              });
            }
            this.ELEMENT_DATA.push(tempelement);
          });
          this.tableDivFlag = true;
        }
        // if(tempData.length > 0) {
        //   dateArray.forEach(e => {
        //     const tempelement: any = {};
        //     tempelement['date'] = e;
        //     tempHeader.forEach(ee => {
        //       let tempvalue = tempData.find(element => element.ftr_pay_id == ee.id && element.ftr_transaction_date == e);
        //       if(tempvalue) {
        //         tempelement['id_'+ee.id] = Number(tempvalue.receipt_amt);
        //         this.headtoatl += Number(tempvalue.receipt_amt);
        //       } else {
        //         tempelement['id_'+ee.id] = '';
        //       }              
        //     });
        //     this.ELEMENT_DATA.push(tempelement);
        //   });
        //   this.tableDivFlag = true;
        // }
        console.log(this.ELEMENT_DATA);

      }
    });
  }

  getNonPartialDayBook() {
    this.headtoatl = 0;
    this.displayedColumns = [];
    this.ELEMENT_DATA = [];
    this.faService.getNonPartialDayBook({ sessionId: this.session.ses_id, monthId: Number(this.param.month) }).subscribe((data: any) => {
      if (data) {

        const tempData: any = data.receipt_data;
        this.apiReceiptData = data.receipt_data;

        const tempHeader: any[] = [];

        tempData.forEach(e => {
          e.value.forEach(element => {
            element.temp_id = element.pay_name ? element.pay_name.toString().toLowerCase().replace(/ /g, '') : '';
          });
        });
        console.log(tempData);
        tempData[0].value.forEach(element => {
          this.displayedColumns.push({
            id: element.temp_id,
            name: element.pay_name
          });
        });
        const dateArray: any[] = [];
        tempData.forEach(e => {
          const index = dateArray.findIndex(t => t == e.date);
          if (index == -1) {
            dateArray.push(e);
          }
        });
        this.eachheadtotal_details = {};
        this.displayedColumns.forEach(ee => {
          this.eachheadtotal_details['id_' + ee.id] = 0;
        });
        if (tempData.length > 0) {
          dateArray.forEach(e => {
            const tempelement: any = {};
            tempelement['date'] = e.date;
            tempelement['vc_id'] = e.vc_id;
            tempelement['vc_state'] = e.vc_state;
            tempelement['voucherExists'] = e.voucherExists;
            tempelement['invoice_head_arr'] = e.invoice_head_arr;
            tempelement['vc_records'] = e.vc_data;
            tempelement['be_back_status'] = e.be_back_status;
            let tempvalue = tempData.find(element => element.date == e.date);
            if (tempvalue) {
              this.displayedColumns.forEach(ee => {
                tempvalue.value.forEach(element => {
                  if (element.temp_id == ee.id) {
                    let tempvaluehead = element.receipt_amt ? Number(element.receipt_amt) : 0;
                    this.headtoatl += tempvaluehead;
                    tempelement['id_' + ee.id] = tempvaluehead;
                    this.eachheadtotal_details['id_' + ee.id] += tempvaluehead;
                  }
                });

              });
            }
            this.ELEMENT_DATA.push(tempelement);
          });
          this.tableDivFlag = true;
        }
        // if(tempData.length > 0) {
        //   dateArray.forEach(e => {
        //     const tempelement: any = {};
        //     tempelement['date'] = e;
        //     tempHeader.forEach(ee => {
        //       let tempvalue = tempData.find(element => element.ftr_pay_id == ee.id && element.ftr_transaction_date == e);
        //       if(tempvalue) {
        //         tempelement['id_'+ee.id] = Number(tempvalue.receipt_amt);
        //         this.headtoatl += Number(tempvalue.receipt_amt);
        //       } else {
        //         tempelement['id_'+ee.id] = '';
        //       }              
        //     });
        //     this.ELEMENT_DATA.push(tempelement);
        //   });
        //   this.tableDivFlag = true;
        // }
        console.log(this.ELEMENT_DATA);

      }
    });
  }
  getColumnTotal(item) {
    let total = 0;
    Object.keys(item).forEach(key => {
      if (key != 'date' && key != 'vc_id' && key != 'vc_state' && key != 'voucherExists' && key != 'invoice_head_arr' && key != 'vc_records') {
        let v = item[key] || 0;
        total += v;
      }
    });
    return total;
  }
  getTotal(id) {
    if (this.ELEMENT_DATA.length > 0) {
      return this.ELEMENT_DATA.reduce((a, b) => a + Number(b['id_' + id]), 0);
    } else {
      return 0;
    }
  }

  getSession() {
    this.faService.getSession().subscribe(
      (result: any) => {
        if (result && result.status === 'ok') {
          for (const citem of result.data) {
            this.sessionArray[citem.ses_id] = citem.ses_name;
          }
          if (this.session) {
            this.sessionName = this.sessionArray[this.session.ses_id];
          }

        }
      });
  }

  getChartsOfAccount() {
    this.chartsOfAccount = [];
    this.chartsOfAccountInvoice = [];
    this.tempChartsOfAccountInvoice = [];
    this.faService.getAllChartsOfAccount({}).subscribe((result: any) => {
      
      for (var i = 0; i < result.length; i++) {
        if ((result[i]['dependencies_type']) === "internal" && result[i]['coa_dependencies'] && result[i]['coa_dependencies'][0] && (result[i]['coa_dependencies'][0]['dependenecy_component'] === "payment_mode_collection" || result[i]['coa_dependencies'][0]['dependenecy_component'] === "cash")) {
          this.chartsOfAccount.push(result[i]);
          console.log('charts of account receipt,', this.chartsOfAccount);
        }
        if ((result[i]['dependencies_type']) === "internal" && result[i]['coa_dependencies'] && result[i]['coa_dependencies'][0] && result[i]['coa_dependencies'][0]['dependenecy_component'] === "fee_head") {
          //console.log('result--', result[i]);
          this.chartsOfAccountInvoice.push(result[i]);
          this.tempChartsOfAccountInvoice.push(result[i]['coa_dependencies'][0]['dependency_name']);
          console.log('charts of account invoice,', this.chartsOfAccountInvoice)
        }
        if ((result[i]['dependencies_type']) === "internal" && result[i]['coa_dependencies'] && result[i]['coa_dependencies'][0]['dependenecy_component'] === "fee_receivable") {
          console.log('result--', result[i]);
          //this.chartsOfAccount.push(result[i]);
          this.feeReceivableAccountId = result[i]['coa_id'];
          this.feeReceivableAccountName = result[i]['coa_acc_name'];
        }
      }
    });
  }

  createVoucher(item, action) {
    console.log('item--', item);
    this.currentVoucherData = item;
    for (var i = 0; i < this.apiReceiptData.length; i++) {
      if (this.apiReceiptData[i]['date'] === item.date) {
        this.voucherDate = item.date;
        if (this.partialPaymentStatus) {
          this.checkForHeadData(this.apiReceiptData[i]['value'], action);
        } else {
          this.checkForNonPartialHeadData(this.apiReceiptData[i]['value'], action);
        }

        break;
      }
    }
  }

  checkForHeadData(receiptHeadArr, action) {
    console.log(receiptHeadArr, this.chartsOfAccount);
    var feeReceivableAmt = 0;
    var voucherEntryArray = [];
    for (var i = 0; i < receiptHeadArr.length; i++) {
      for (var j = 0; j < this.chartsOfAccount.length; j++) {
        if ((this.chartsOfAccount[j]['coa_dependencies'][0]['dependency_name'] === receiptHeadArr[i]['pay_name']+' Collection') || (this.chartsOfAccount[j]['coa_dependencies'][0]['dependency_name'] === receiptHeadArr[i]['pay_name']) ) {
          if (action != 'update') {
            let vFormJson = {};
            vFormJson = {
              vc_account_type: this.chartsOfAccount[j]['coa_acc_name'],
              vc_account_type_id: this.chartsOfAccount[j]['coa_id'],
              vc_particulars: this.chartsOfAccount[j]['coa_acc_name'],
              vc_grno: '',
              vc_invoiceno: '',
              vc_debit: receiptHeadArr[i]['receipt_amt'],
              vc_credit: 0
            };
            feeReceivableAmt = feeReceivableAmt + (receiptHeadArr[i]['receipt_amt'])
            voucherEntryArray.push(vFormJson);
            break;

          } else {
            var mathchedFlag = 0;
            var deviation = 0;
            var accountDebitSum = 0;
            var accountCreditSum = 0;
            var totalPrevHeadAmt = 0;
            if (this.currentVoucherData && this.currentVoucherData.vc_records) {
            for (var k = 0; k < this.currentVoucherData.vc_records.length; k++) {
              for (var l = 0; l < this.currentVoucherData.vc_records[k]['vc_particulars_data'].length; l++) {

                if (this.chartsOfAccount[j]['coa_dependencies'][0]['dependency_name'] == this.currentVoucherData.vc_records[k]['vc_particulars_data'][l]['vc_account_type']) {
                  mathchedFlag = 1;

                  accountDebitSum = accountDebitSum + this.currentVoucherData.vc_records[k]['vc_particulars_data'][l]['vc_debit'];
                  accountCreditSum = accountCreditSum + this.currentVoucherData.vc_records[k]['vc_particulars_data'][l]['vc_credit'];



                }
              }
            }}
            if (!mathchedFlag) {
              let vFormJson = {};
              vFormJson = {
                vc_account_type: this.chartsOfAccount[j]['coa_acc_name'],
                vc_account_type_id: this.chartsOfAccount[j]['coa_id'],
                vc_particulars: this.chartsOfAccount[j]['coa_acc_name'],
                vc_grno: '',
                vc_invoiceno: '',
                vc_debit: receiptHeadArr[i]['receipt_amt'],
                vc_credit: 0
              };
              feeReceivableAmt = feeReceivableAmt + (receiptHeadArr[i]['receipt_amt'])
              voucherEntryArray.push(vFormJson);
            } else {
              totalPrevHeadAmt = accountDebitSum - accountCreditSum;
              deviation = receiptHeadArr[i]['receipt_amt'] - totalPrevHeadAmt;
              feeReceivableAmt = feeReceivableAmt + deviation;
              if (deviation < 0) {
                let vFormJson = {};
                vFormJson = {
                  vc_account_type: this.chartsOfAccount[j]['coa_acc_name'],
                  vc_account_type_id: this.chartsOfAccount[j]['coa_id'],
                  vc_particulars: this.chartsOfAccount[j]['coa_acc_name'],
                  vc_grno: '',
                  vc_invoiceno: '',
                  vc_debit: 0,
                  vc_credit: -deviation
                };
                voucherEntryArray.push(vFormJson);
              }
              if (deviation > 0) {
                let vFormJson = {};
                vFormJson = {
                  vc_account_type: this.chartsOfAccount[j]['coa_acc_name'],
                  vc_account_type_id: this.chartsOfAccount[j]['coa_id'],
                  vc_particulars: this.chartsOfAccount[j]['coa_acc_name'],
                  vc_grno: '',
                  vc_invoiceno: '',
                  vc_debit: deviation,
                  vc_credit: 0
                };
                voucherEntryArray.push(vFormJson);
              }
            }
          }
        }
      }
    }
    if (voucherEntryArray.length > 0) {
      let vFormJson = {
        vc_account_type: this.feeReceivableAccountName,
        vc_account_type_id: this.feeReceivableAccountId,
        vc_particulars: 'Fee Receiveable',
        vc_grno: '',
        vc_invoiceno: '',
        vc_debit: 0,
        vc_credit: feeReceivableAmt
      };
      voucherEntryArray.push(vFormJson);
      this.getVoucherTypeMaxId(voucherEntryArray);
    }


  }

  checkForNonPartialHeadData(receiptHeadArr, action) {
    console.log(receiptHeadArr, this.chartsOfAccount);
    var feeReceivableAmt = 0;
    var voucherEntryArray = [];
    for (var i = 0; i < receiptHeadArr.length; i++) {
      for (var j = 0; j < this.chartsOfAccount.length; j++) {
        if ((this.chartsOfAccount[j]['coa_dependencies'][0]['dependency_name'] === receiptHeadArr[i]['pay_name']+' Collection')  || (this.chartsOfAccount[j]['coa_dependencies'][0]['dependency_name'] === receiptHeadArr[i]['pay_name'])) {
          if (action != 'update') {
            let vFormJson = {};
            vFormJson = {
              vc_account_type: this.chartsOfAccount[j]['coa_acc_name'],
              vc_account_type_id: this.chartsOfAccount[j]['coa_id'],
              vc_particulars: this.chartsOfAccount[j]['coa_acc_name'],
              vc_grno: '',
              vc_invoiceno: '',
              vc_debit: receiptHeadArr[i]['receipt_amt'],
              vc_credit: 0
            };
            voucherEntryArray.push(vFormJson);
            // for (var k = 0; k < this.currentVoucherData['invoice_head_arr'].length; k++) {
            var chartMatchedIndex = -1;
            var currentHeadMatchedIndex = -1;
            if (this.currentVoucherData['invoice_head_arr'] && this.currentVoucherData['invoice_head_arr'][i]) {
            for (var l = 0; l < this.currentVoucherData['invoice_head_arr'][i]['head_data'].length; l++) {
              var matchedIndexFlag = false;
              if (this.tempChartsOfAccountInvoice.indexOf(this.currentVoucherData['invoice_head_arr'][i]['head_data'][l]['invg_fh_name']) > -1) {
                currentHeadMatchedIndex = l;
                chartMatchedIndex = this.tempChartsOfAccountInvoice.indexOf(this.currentVoucherData['invoice_head_arr'][i]['head_data'][l]['invg_fh_name']);
                matchedIndexFlag = true;
                // console.log('in_'+i,this.currentVoucherData['invoice_head_arr'][i]['head_data'][l]['invg_fh_name'] );
                if (matchedIndexFlag) {
                  if (this.currentVoucherData['invoice_head_arr'][i]['head_data'][currentHeadMatchedIndex]['total_amount'] > 0) {
                    let vFormJson1 = {};
                    vFormJson1 = {
                      vc_account_type: this.chartsOfAccountInvoice[chartMatchedIndex]['coa_acc_name'],
                      vc_account_type_id: this.chartsOfAccountInvoice[chartMatchedIndex]['coa_id'],
                      vc_particulars: this.chartsOfAccountInvoice[chartMatchedIndex]['coa_acc_name'],
                      vc_grno: '',
                      vc_invoiceno: '',
                      vc_debit: 0,
                      vc_credit: this.currentVoucherData['invoice_head_arr'][i]['head_data'][currentHeadMatchedIndex]['total_amount']
                    };
                    voucherEntryArray.push(vFormJson1);
                  }
                  // }


                }
              }
            }
          }
            feeReceivableAmt = feeReceivableAmt + (receiptHeadArr[i]['receipt_amt']);

            break;

          } else {
            var mathchedFlag = 0;
            var deviation = 0;
            var receiptAccountDebitSum = 0;
            var receiptAccountCreditSum = 0;
            var invoiceAccountDebitSum = 0;
            var invoiceAccountCreditSum = 0;
            var totalPrevHeadAmt = 0;
            console.log('this.currentVoucherData---', this.currentVoucherData)
            for (var k = 0; k < this.currentVoucherData.vc_records.length; k++) {
              for (var l = 0; l < this.currentVoucherData.vc_records[k]['vc_particulars_data'].length; l++) {

                if (this.chartsOfAccount[j]['coa_dependencies'][0]['dependency_name'] == this.currentVoucherData.vc_records[k]['vc_particulars_data'][l]['vc_account_type']) {
                  mathchedFlag = 1;
                  // console.log('l--',l,j, this.chartsOfAccount[j]['coa_dependencies'][0]['dependency_name']);
                  receiptAccountDebitSum = receiptAccountDebitSum + this.currentVoucherData.vc_records[k]['vc_particulars_data'][l]['vc_debit'];
                  receiptAccountCreditSum = receiptAccountCreditSum + this.currentVoucherData.vc_records[k]['vc_particulars_data'][l]['vc_credit'];



                }
              }
            }
            if (!mathchedFlag) {
              let vFormJson = {};
              vFormJson = {
                vc_account_type: this.chartsOfAccount[j]['coa_acc_name'],
                vc_account_type_id: this.chartsOfAccount[j]['coa_id'],
                vc_particulars: this.chartsOfAccount[j]['coa_acc_name'],
                vc_grno: '',
                vc_invoiceno: '',
                vc_debit: receiptHeadArr[i]['receipt_amt'],
                vc_credit: 0
              };
              voucherEntryArray.push(vFormJson);
              // for (var k = 0; k < this.currentVoucherData['invoice_head_arr'].length; k++) {
              var chartMatchedIndex = -1;
              var currentHeadMatchedIndex = -1;
              for (var l = 0; l < this.currentVoucherData['invoice_head_arr'][i]['head_data'].length; l++) {
                var matchedIndexFlag = false;
                if (this.tempChartsOfAccountInvoice.indexOf(this.currentVoucherData['invoice_head_arr'][i]['head_data'][l]['invg_fh_name']) > -1) {
                  currentHeadMatchedIndex = l;
                  chartMatchedIndex = this.tempChartsOfAccountInvoice.indexOf(this.currentVoucherData['invoice_head_arr'][i]['head_data'][l]['invg_fh_name']);
                  matchedIndexFlag = true;
                  // console.log('in_'+i,this.currentVoucherData['invoice_head_arr'][i]['head_data'][l]['invg_fh_name'] );
                  if (matchedIndexFlag) {
                    if (this.currentVoucherData['invoice_head_arr'][i]['head_data'][currentHeadMatchedIndex]['total_amount'] > 0) {
                      let vFormJson1 = {};
                      vFormJson1 = {
                        vc_account_type: this.chartsOfAccountInvoice[chartMatchedIndex]['coa_acc_name'],
                        vc_account_type_id: this.chartsOfAccountInvoice[chartMatchedIndex]['coa_id'],
                        vc_particulars: this.chartsOfAccountInvoice[chartMatchedIndex]['coa_acc_name'],
                        vc_grno: '',
                        vc_invoiceno: '',
                        vc_debit: 0,
                        vc_credit: this.currentVoucherData['invoice_head_arr'][i]['head_data'][currentHeadMatchedIndex]['total_amount']
                      };
                      voucherEntryArray.push(vFormJson1);
                    }
                    // }


                  }
                }
              }

              feeReceivableAmt = feeReceivableAmt + (receiptHeadArr[i]['receipt_amt']);


            } else {

              totalPrevHeadAmt = receiptAccountDebitSum - receiptAccountCreditSum;
              deviation = receiptHeadArr[i]['receipt_amt'] - totalPrevHeadAmt;
              feeReceivableAmt = feeReceivableAmt + deviation;
              console.log('in else', deviation, receiptHeadArr[i]['receipt_amt'], receiptAccountDebitSum, receiptAccountCreditSum)
              if (deviation < 0) {
                let vFormJson = {};
                vFormJson = {
                  vc_account_type: this.chartsOfAccount[j]['coa_acc_name'],
                  vc_account_type_id: this.chartsOfAccount[j]['coa_id'],
                  vc_particulars: this.chartsOfAccount[j]['coa_acc_name'],
                  vc_grno: '',
                  vc_invoiceno: '',
                  vc_debit: 0,
                  vc_credit: -deviation
                };
                voucherEntryArray.push(vFormJson);
                var chartMatchedIndex = -1;
                var currentHeadMatchedIndex = -1;
                for (var l = 0; l < this.currentVoucherData['invoice_head_arr'][i]['head_data'].length; l++) {
                  var matchedIndexFlag = false;
                  if (this.tempChartsOfAccountInvoice.indexOf(this.currentVoucherData['invoice_head_arr'][i]['head_data'][l]['invg_fh_name']) > -1) {
                    currentHeadMatchedIndex = l;
                    chartMatchedIndex = this.tempChartsOfAccountInvoice.indexOf(this.currentVoucherData['invoice_head_arr'][i]['head_data'][l]['invg_fh_name']);
                    matchedIndexFlag = true;
                    // console.log('in_'+i,this.currentVoucherData['invoice_head_arr'][i]['head_data'][l]['invg_fh_name'] );
                    if (matchedIndexFlag) {
                      if (this.currentVoucherData['invoice_head_arr'][i]['head_data'][currentHeadMatchedIndex]['total_amount'] > 0) {
                        let vFormJson1 = {};
                        vFormJson1 = {
                          vc_account_type: this.chartsOfAccountInvoice[chartMatchedIndex]['coa_acc_name'],
                          vc_account_type_id: this.chartsOfAccountInvoice[chartMatchedIndex]['coa_id'],
                          vc_particulars: this.chartsOfAccountInvoice[chartMatchedIndex]['coa_acc_name'],
                          vc_grno: '',
                          vc_invoiceno: '',
                          vc_debit: 0,
                          vc_credit: this.currentVoucherData['invoice_head_arr'][i]['head_data'][currentHeadMatchedIndex]['total_amount']
                        };
                        voucherEntryArray.push(vFormJson1);
                      }
                      // }


                    }
                  }
                }

              }
              if (deviation > 0) {
                let vFormJson = {};
                vFormJson = {
                  vc_account_type: this.chartsOfAccount[j]['coa_acc_name'],
                  vc_account_type_id: this.chartsOfAccount[j]['coa_id'],
                  vc_particulars: this.chartsOfAccount[j]['coa_acc_name'],
                  vc_grno: '',
                  vc_invoiceno: '',
                  vc_debit: deviation,
                  vc_credit: 0
                };
                voucherEntryArray.push(vFormJson);
                var chartMatchedIndex = -1;
                var currentHeadMatchedIndex = -1;
                for (var l = 0; l < this.currentVoucherData['invoice_head_arr'][i]['head_data'].length; l++) {
                  var matchedIndexFlag = false;
                  if (this.tempChartsOfAccountInvoice.indexOf(this.currentVoucherData['invoice_head_arr'][i]['head_data'][l]['invg_fh_name']) > -1) {
                    currentHeadMatchedIndex = l;
                    chartMatchedIndex = this.tempChartsOfAccountInvoice.indexOf(this.currentVoucherData['invoice_head_arr'][i]['head_data'][l]['invg_fh_name']);
                    matchedIndexFlag = true;
                    // console.log('in_'+i,this.currentVoucherData['invoice_head_arr'][i]['head_data'][l]['invg_fh_name'] );
                    if (matchedIndexFlag) {
                      if (this.currentVoucherData['invoice_head_arr'][i]['head_data'][currentHeadMatchedIndex]['total_amount'] > 0) {
                        let vFormJson1 = {};
                        vFormJson1 = {
                          vc_account_type: this.chartsOfAccountInvoice[chartMatchedIndex]['coa_acc_name'],
                          vc_account_type_id: this.chartsOfAccountInvoice[chartMatchedIndex]['coa_id'],
                          vc_particulars: this.chartsOfAccountInvoice[chartMatchedIndex]['coa_acc_name'],
                          vc_grno: '',
                          vc_invoiceno: '',
                          vc_debit: 0,
                          vc_credit: this.currentVoucherData['invoice_head_arr'][i]['head_data'][currentHeadMatchedIndex]['total_amount']
                        };
                        voucherEntryArray.push(vFormJson1);
                      }
                      // }


                    }
                  }
                }

              }





            }
          }
        }
      }
    }

    if (voucherEntryArray.length > 0) {
      let vFormJson = {
        vc_account_type: this.feeReceivableAccountName,
        vc_account_type_id: this.feeReceivableAccountId,
        vc_particulars: 'Fee Receiveable',
        vc_grno: '',
        vc_invoiceno: '',
        vc_debit: 0,
        vc_credit: feeReceivableAmt
      };
      voucherEntryArray.push(vFormJson);
      
      this.getVoucherTypeMaxId(voucherEntryArray);
    }

    if (voucherEntryArray.length === 0) {
      this.commonAPIService.showSuccessErrorMessage('There is no information to update / create', 'error');
    }


  }

  getVoucherTypeMaxId(voucherEntryArray) {
    let param: any = {};
    param.vc_type = this.currentVcType;;
    param.vc_date = this.currentVoucherData.date;
    let flag = 0;
    let result: any;

    this.faService.getVoucherTypeMaxId(param).subscribe((data: any) => {
      if (data) {
        flag = 1;
        result = data;

        this.getVcName(result, voucherEntryArray);

      }
    });

  }

  getVcName(vcData, voucherEntryArray) {
    let vcType = 'RV';
    // const vcTypeArr = this.currentVcType.split(" ");
    // if (vcTypeArr.length > 0) {
    //   vcTypeArr.forEach(element => {
    //     vcType += element.substring(0, 1).toUpperCase();
    //   });
    // }
    //vcType = (this.currentVcType.split(" ")[0].substring(0,1)+this.currentVcType.split(" ")[1].substring(0,1)).toUpperCase();
    let currentSessionFirst = this.sessionName.split('-')[0];
    let currentSessionSecond = this.sessionName.split('-')[1];
    var nYear: any = '';
    var month_id = (this.param.month);
    if ((Number(month_id) != 1) && (Number(month_id) != 2) && (Number(month_id) != 3)) {
      nYear = currentSessionFirst;
    } else {
      nYear = currentSessionSecond;
    }
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    var no_of_days = new Date(nYear, month_id, 0).getDate();


    let vcDay = no_of_days;
    let vcMonth = monthNames[Number(month_id) - 1].substring(0, 3);
    let vcYear = nYear;
    let vcNumber = vcData.vc_code;
    //this.vcData = { vc_code: vcData.vc_code, vc_name: vcType + '/' + vcMonth + '/' + ((vcNumber.toString()).padStart(4, '0')), vc_date: nYear + '-' + (month_id).padStart(2, '0') + '-' + no_of_days, vc_month: monthNames[Number(month_id)] };
    this.vcData = { vc_code: vcData.vc_code, vc_name: this.vcYearlyStatus ? vcType + '/' + ((vcNumber.toString()).padStart(4, '0')) : vcType + '/' + vcMonth + '/' + ((vcNumber.toString()).padStart(4, '0')), vc_date: nYear + '-' + (month_id).padStart(2, '0') + '-' + no_of_days, vc_month: monthNames[Number(month_id)] };
    console.log(voucherEntryArray, 'test');


    if (this.vcData) {
      var fJson = {
        vc_id: this.currentVoucherData && this.currentVoucherData.vc_id ? this.currentVoucherData.vc_id : null,
        vc_type: 'Receipt',
        vc_number: { vc_code: this.vcData.vc_code, vc_name: this.vcData.vc_name },
        vc_date: this.voucherDate,
        vc_narrations: 'Receipt Computation of Date ' + this.voucherDate,
        vc_attachments: [],
        vc_particulars_data: voucherEntryArray,
        vc_state: 'draft',
        vc_process: 'automatic/receipt'

      }

      

      console.log('fJson--', fJson);
      if (!this.currentVoucherData.vc_id) {
        this.faService.insertVoucherEntry(fJson).subscribe((data: any) => {
          if (data) {
            if(this.currentVoucherData.be_back_status) {
              this.faService.updateBackDateEntry({be_back_date:this.currentVoucherData.be_back_date, be_back_status:this.currentVoucherData.be_back_status}).subscribe((data:any)=>{
      
              });
            }
            this.getInvoiceDayBook();
            this.commonAPIService.showSuccessErrorMessage('Voucher entry Created Successfully', 'success');


          } else {
            this.commonAPIService.showSuccessErrorMessage('Error While Creating Voucher Entry', 'error');
          }
        });
      } else {

        this.faService.insertVoucherEntry(fJson).subscribe((data: any) => {
          if (data) {
            this.faService.updateBackDateEntry({be_back_date:this.currentVoucherData.be_back_date, be_back_status:this.currentVoucherData.be_back_status}).subscribe((data:any)=>{
      
            });
            this.getInvoiceDayBook();
            this.commonAPIService.showSuccessErrorMessage('Voucher entry Updated Successfully', 'success');


          } else {
            this.commonAPIService.showSuccessErrorMessage('Error While Updating Voucher Entry', 'error');
          }
        });

      }
    }


  }
  isExistUserAccessMenu(mod_id) {
		return this.commonAPIService.isExistUserAccessMenu(mod_id);
	}


}
