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


@Component({
  selector: 'app-income-due',
  templateUrl: './income-due.component.html',
  styleUrls: ['./income-due.component.scss']
})
export class IncomeDueComponent implements OnInit, OnChanges {

  @Input() param: any;
  tableDivFlag = false;
  ELEMENT_DATA: any[] = [];
  displayedColumns: any[] = [];
  displayedDate: any[] = [];
  session: any;
  con_adj_details: any;
  eachheadtotal_details: any;
  headtoatl = 0;
  contoatl = 0;
  partialPaymentStatus = 1;
  apiInvoiceData = [];
  apiReceiptData = [];
  chartsOfAccount: any[] = [];
  vcData: any;
  currentVcType = 'Journal Voucher';
  sessionArray: any[] = [];
  sessionName: any;
  voucherDate: any;
  currentVoucherData: any;
  vcYearlyStatus   = 0;
  feeReceivableAccountId = 0;
  feeReceivableAccountName = 'Fee Receivable';
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
    if (this.param.month) {
      this.getGlobalSetting();
      this.getChartsOfAccount();
      this.getInvoiceDayBook();
      this.getSession();
    }
  }
  ngOnChanges() {
    console.log(this.param);
    if (this.param.month) {
      this.getGlobalSetting();
      this.getChartsOfAccount();
      this.getSession();
      this.getInvoiceDayBook();
    }

  }
  getGlobalSetting() {
		let param: any = {};
		param.gs_alias = ['fa_voucher_code_format_yearly_status'];
		this.faService.getGlobalSetting(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				if (result.data && result.data[0]) {
					this.vcYearlyStatus = Number(result.data[0]['gs_value']);
					console.log('this.vcYearlyStatus', this.vcYearlyStatus)
				}

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
    this.contoatl = 0;
    this.displayedColumns = [];
    this.ELEMENT_DATA = [];
    this.apiInvoiceData = [];
    this.apiReceiptData = [];
    this.faService.getInvoiceDayBook({ sessionId: this.session.ses_id, monthId: Number(this.param.month) }).subscribe((data: any) => {
      if (data && data.invoice_due_data.length > 0) {
        this.apiInvoiceData = data.invoice_due_data;
        this.apiReceiptData = data.receipt_data;
        const tempData: any = data.invoice_due_data;
        const tempHeader: any[] = [];
        tempData[0].value.forEach(element => {
          this.displayedColumns.push({
            id: element.fh_id,
            name: element.fh_name
          });
        });

        this.con_adj_details = {};
        this.eachheadtotal_details = {};
        this.displayedColumns.forEach(ee => {
          this.con_adj_details['id_' + ee.id] = 0;
          this.eachheadtotal_details['id_' + ee.id] = 0;
        });
        const dateArray: any[] = [];
        tempData.forEach(e => {
          const index = dateArray.findIndex(t => t == e.date);
          if (index == -1) {
            dateArray.push(e);
          }
        })
        if (tempData.length > 0) {
          dateArray.forEach(e => {
            const tempelement: any = {};
            tempelement['date'] = e.date;
            tempelement['vc_id'] = e.vc_id;
            tempelement['vc_state'] = e.vc_state;
            tempelement['voucherExists'] = e.voucherExists;
            tempelement['vc_records'] = e.vc_data;
            let tempvalue = tempData.find(element => element.date == e.date);
            if (tempvalue) {
              this.displayedColumns.forEach(ee => {
                tempvalue.value.forEach(element => {
                  if (element.fh_id == ee.id) {
                    let tempvaluehead = element.head_amt ? Number(element.head_amt) : 0;
                    let tempvaluecon = Number(element.concession_at) + Number(element.adjustment_amt);
                    this.headtoatl += tempvaluehead;
                    this.contoatl += tempvaluecon;
                    tempelement['id_' + ee.id] = tempvaluehead;
                    this.con_adj_details['id_' + ee.id] += tempvaluecon;
                    this.eachheadtotal_details['id_' + ee.id] += tempvaluehead;
                  }
                });

              });
            }
            this.ELEMENT_DATA.push(tempelement);
          });
          this.tableDivFlag = true;
        }
        console.log(this.ELEMENT_DATA);
        console.log(this.eachheadtotal_details);
        console.log(this.con_adj_details);

      }
    });
  }
  getColumnTotal(item) {
    let total = 0;
    Object.keys(item).forEach(key => {
      if (key != 'date' && key != 'vc_id' && key != 'vc_state' && key != 'voucherExists' && key != 'vc_records') {
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
    this.faService.getAllChartsOfAccount({}).subscribe((result: any) => {
      for (var i = 0; i < result.length; i++) {
        //console.log(result[i]);
        if ((result[i]['dependencies_type']) === "internal" && result[i]['coa_dependencies'] && result[i]['coa_dependencies'][0]['dependenecy_component'] === "fee_head") {
          console.log('result--', result[i]);
          this.chartsOfAccount.push(result[i]);
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
    console.log('this.currentvoucherData', this.currentVoucherData)
    for (var i = 0; i < this.apiInvoiceData.length; i++) {
      if (this.apiInvoiceData[i]['date'] === item.date) {
        this.voucherDate = item.date;
        this.checkForHeadData(this.apiInvoiceData[i]['value'], action);
        break;
      }
    }
  }

  checkForHeadData(invoiceHeadArr, action) {
    //invoiceHeadArr[0]['total_amt']=5500;
    // invoiceHeadArr[6]['total_amt']=3500;
    console.log(this.chartsOfAccount, invoiceHeadArr);
    var voucherEntryArray = [];
    var feeReceivableAmt = 0;
    for (var i = 0; i < invoiceHeadArr.length; i++) {
      for (var j = 0; j < this.chartsOfAccount.length; j++) {
        if (this.chartsOfAccount[j]['coa_dependencies'][0]['dependency_name'] === invoiceHeadArr[i]['fh_name']) {
          if (action != 'update') {
            let vFormJson = {};
            vFormJson = {
              vc_account_type: this.chartsOfAccount[j]['coa_acc_name'],
              vc_account_type_id: this.chartsOfAccount[j]['coa_id'],
              vc_particulars: this.chartsOfAccount[j]['coa_acc_name'],
              vc_grno: '',
              vc_invoiceno: '',
              vc_debit: 0,
              vc_credit: invoiceHeadArr[i]['total_amt']
            };
            feeReceivableAmt = feeReceivableAmt + ( invoiceHeadArr[i]['total_amt'])
            voucherEntryArray.push(vFormJson);
          } else {
            var mathchedFlag = 0;
            var deviation = 0;
            var accountDebitSum = 0;
            var accountCreditSum = 0;
            var totalPrevHeadAmt = 0;
            for (var k=0; k<this.currentVoucherData.vc_records.length;k++) {
              for (var l=0; l<this.currentVoucherData.vc_records[k]['vc_particulars_data'].length;l++) {                
                
                if (this.chartsOfAccount[j]['coa_dependencies'][0]['dependency_name'] == this.currentVoucherData.vc_records[k]['vc_particulars_data'][l]['vc_account_type'] ) {
                  mathchedFlag = 1;
                  
                  accountDebitSum = accountDebitSum + this.currentVoucherData.vc_records[k]['vc_particulars_data'][l]['vc_debit'];
                  accountCreditSum = accountCreditSum + this.currentVoucherData.vc_records[k]['vc_particulars_data'][l]['vc_credit'];



                }
              }
            }
            console.log(mathchedFlag, 'matchedFlag')
            if(!mathchedFlag) {
              let vFormJson = {};
              vFormJson = {
                vc_account_type: this.chartsOfAccount[j]['coa_acc_name'],
                vc_account_type_id: this.chartsOfAccount[j]['coa_id'],
                vc_particulars: this.chartsOfAccount[j]['coa_acc_name'],
                vc_grno: '',
                vc_invoiceno: '',
                vc_debit:  0,
                vc_credit: invoiceHeadArr[i]['total_amt']
              };
              feeReceivableAmt = feeReceivableAmt + ( invoiceHeadArr[i]['total_amt'])
              voucherEntryArray.push(vFormJson);
            } else {
              totalPrevHeadAmt = accountDebitSum - accountCreditSum;
              deviation = invoiceHeadArr[i]['total_amt'] - totalPrevHeadAmt;
              feeReceivableAmt = feeReceivableAmt + deviation;
              if (deviation < 0 ) {
                let vFormJson = {};
                vFormJson = {
                  vc_account_type: this.chartsOfAccount[j]['coa_acc_name'],
                  vc_account_type_id: this.chartsOfAccount[j]['coa_id'],
                  vc_particulars: this.chartsOfAccount[j]['coa_acc_name'],
                  vc_grno: '',
                  vc_invoiceno: '',
                  vc_debit:  -deviation,
                  vc_credit: 0
                };
                voucherEntryArray.push(vFormJson);
              }
              if (deviation > 0 ) {
                let vFormJson = {};
                vFormJson = {
                  vc_account_type: this.chartsOfAccount[j]['coa_acc_name'],
                  vc_account_type_id: this.chartsOfAccount[j]['coa_id'],
                  vc_particulars: this.chartsOfAccount[j]['coa_acc_name'],
                  vc_grno: '',
                  vc_invoiceno: '',
                  vc_debit:  0,
                  vc_credit: deviation
                };
                voucherEntryArray.push(vFormJson);
              }
            }
          }
        }
      }
    }
    if (voucherEntryArray.length > 0  && action != 'update') {
      let vFormJson = {
        vc_account_type: this.feeReceivableAccountName,
        vc_account_type_id: this.feeReceivableAccountId,
        vc_particulars: 'Fee Receivable',
        vc_grno: '',
        vc_invoiceno: '',
        vc_debit: feeReceivableAmt,
        vc_credit: 0
      };
      voucherEntryArray.push(vFormJson);
      this.getVoucherTypeMaxId(voucherEntryArray);
    }
    if (voucherEntryArray.length > 0  && action == 'update') {
      
      let vFormJson = {
        vc_account_type: this.feeReceivableAccountName,
        vc_account_type_id: this.feeReceivableAccountId,
        vc_particulars: 'Fee Receivable',
        vc_grno: '',
        vc_invoiceno: '',
        vc_debit: feeReceivableAmt,
        vc_credit: 0
      };
      voucherEntryArray.push(vFormJson);
      this.getVoucherTypeMaxId(voucherEntryArray);
    }

    if (voucherEntryArray.length  === 0) {
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
    let vcType = '';
    const vcTypeArr = this.currentVcType.split(" ");
    if (vcTypeArr.length > 0) {
      vcTypeArr.forEach(element => {
        vcType += element.substring(0, 1).toUpperCase();
      });
    }
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
    this.vcData = { vc_code: vcData.vc_code, vc_name: this.vcYearlyStatus ? vcType + '/' + ((vcNumber.toString()).padStart(4, '0')) : vcType + '/' + vcMonth + '/' + ((vcNumber.toString()).padStart(4, '0')), vc_date: nYear + '-' + (month_id).padStart(2, '0') + '-' + no_of_days, vc_month: monthNames[Number(month_id)] };
    


    if (this.vcData) {
      var fJson = {
        vc_id: null,
        vc_type: 'Journal Voucher',
        vc_number: { vc_code: this.vcData.vc_code, vc_name: this.vcData.vc_name },
        vc_date: this.voucherDate,
        vc_narrations: 'Invoice Due of Date ' + this.voucherDate,
        vc_attachments: [],
        vc_particulars_data: voucherEntryArray,
        vc_state: 'draft',
        vc_process: 'automatic/invoice'
      }

      console.log('fJson--', fJson)
      if (!this.currentVoucherData.vc_id) {
        this.faService.insertVoucherEntry(fJson).subscribe((data: any) => {
          if (data) {
            this.getInvoiceDayBook();
            this.commonAPIService.showSuccessErrorMessage('Voucher entry Created Successfully', 'success');


          } else {
            this.commonAPIService.showSuccessErrorMessage('Error While Creating Voucher Entry', 'error');
          }
        });
      } else {
        
        this.faService.insertVoucherEntry(fJson).subscribe((data: any) => {
          if (data) {
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
