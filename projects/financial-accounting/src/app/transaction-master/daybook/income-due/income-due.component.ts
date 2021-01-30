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
  apiData:any[]=[];
  chartsOfAccount: any[] = [];
  vcData: any;
  currentVcType = 'Journal';
  sessionArray: any[] = [];
  sessionName: any;
  voucherDate: any;
  currentVoucherData: any;
  vcYearlyStatus   = 0;
  feeReceivableAccountId = 0;
  feeReceivableAccountName = 'Fee Receivable';
  adjustmentStatus = 0;
  previousBalanceObject = {};
  previousYearVoucherExists = false;
  previousYearVoucherData:any[] = [];
  globalsetup:any;
  showLoadingFlag = false;

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
    // this.commonAPIService.startLoading();
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
    this.tableDivFlag = false;
    console.log(this.param);
    if (this.param.month) {
      this.getGlobalSetting();
      this.getChartsOfAccount();
      this.getSession();
      this.getInvoiceDayBook();
      // this.commonAPIService.startLoading();
    }

  }

  openModel(e) {
    const dialogRefFilter = this.dialog.open(ModeltableComponent, {
			width: '70%',
			height: '70%',
			data: {
        month_id: this.param.month,
        date: e.date,
        reportType: 'feedue'
			}
		});
		dialogRefFilter.afterClosed().subscribe(result => {
		});
  }
  getGlobalSetting() {
		let param: any = {};
		this.globalsetup = {};
		param.gs_alias = ['fa_voucher_code_format_yearly_status','fee_invoice_includes_adjustments','fa_session_freez'];
		this.faService.getGlobalSetting(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				result.data.forEach(element => {
					this.globalsetup[element.gs_alias] = element.gs_value
				});
        this.vcYearlyStatus = Number(this.globalsetup['fa_voucher_code_format_yearly_status']);
        this.adjustmentStatus = this.globalsetup['fee_invoice_includes_adjustments'] == '1' ? 1 : 0 ;
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

  getPreviousHeadAmt(item) {
    var flag=0;
    for(var i=0; i< this.apiData.length;i++) {
      
      if(this.apiData[i]['fh_name']==item['name']) {
        
        //flag= Number(this.apiData[i]['head_amt'])-Number(this.apiData[i]['adjustment_amt'])-Number(this.apiData[i]['concession_amt']);
        flag= Number(this.apiData[i]['head_amt']);
        
        break;
      }
    }
    return flag;
  }

  checkForPreviousYearVoucher() {
    
    this.faService.checkPreviosuDueStatus({vc_narrations: 'Previous Due' }).subscribe((data:any)=> {
      // this.commonAPIService.startLoading();
      console.log('data--', data);
      if(data && data[0] && data[0]['vc_id']) {
        this.previousYearVoucherData = data[0];
        this.previousYearVoucherExists = true;
        this.previousBalanceObject = {};
          this.previousBalanceObject['voucherExists'] = this.previousYearVoucherExists;
          this.previousBalanceObject['vc_id'] =  this.previousYearVoucherData['vc_id'];
          this.previousBalanceObject['vc_state'] = this.previousYearVoucherData['vc_state'];
          this.previousBalanceObject['vc_records'] = [this.previousYearVoucherData];
          this.previousBalanceObject['value'] = this.apiData;
          this.previousBalanceObject['prev_balance_voucher'] = true;
          this.previousBalanceObject['date'] = '';
          for(var i=0; i <this.apiData.length;i++) {
            if (!(this.apiData[i]['fh_name'])) {
              this.apiData[i]['fh_name'] = 'Transport Fee';
              this.apiData[i]['fh_id'] = 0;
              this.previousBalanceObject['id_0'] = this.apiData[i]['head_amt']-this.apiData[i]['adjustment_amt']-this.apiData[i]['concession_amt'];
            } else {
              this.previousBalanceObject['id_'+this.apiData[i]['fh_id']] = this.apiData[i]['head_amt']-this.apiData[i]['adjustment_amt']-this.apiData[i]['concession_amt'];
            }
          }
          console.log('this.previousBalanceObject--',this.previousBalanceObject)
      } else {
        this.previousYearVoucherExists = false;
      }
      // this.commonAPIService.stopLoading();
    })
  }

  getInvoiceDayBook() {
    this.showLoadingFlag = true;
    this.headtoatl = 0;
    this.contoatl = 0;
    this.displayedColumns = [];
    this.ELEMENT_DATA = [];
    this.apiInvoiceData = [];
    this.apiReceiptData = [];
    this.previousBalanceObject = {};
    this.faService.getInvoiceDayBook({ sessionId: this.session.ses_id, monthId: Number(this.param.month), vc_process: 'automatic/invoice' }).subscribe((data: any) => {
      // this.commonAPIService.startLoading();
      if (data && data.invoice_due_data.length > 0) {
        this.displayedColumns = [];
        if (Number(this.param.month)==4) {
          this.checkForPreviousYearVoucher();
        
        
        this.apiData = data.previous_years_data ? data.previous_years_data: [];
        if (this.previousYearVoucherData.length > 0) {
          
        } else {
        this.previousBalanceObject = {};
        this.previousBalanceObject['voucherExists'] = this.previousYearVoucherExists;
        this.previousBalanceObject['vc_id'] = '';
        this.previousBalanceObject['vc_state'] = 'draft';
        this.previousBalanceObject['vc_records'] = [];
        this.previousBalanceObject['value'] = this.apiData;
        this.previousBalanceObject['prev_balance_voucher'] = true;
        this.previousBalanceObject['date'] = '';
        for(var i=0; i <this.apiData.length;i++) {
          if (!(this.apiData[i]['fh_name'])) {
            this.apiData[i]['fh_name'] = 'Transport Fee';
            this.apiData[i]['fh_id'] = 0;
            this.previousBalanceObject['id_0'] = this.apiData[i]['head_amt']-this.apiData[i]['adjustment_amt']-this.apiData[i]['concession_amt'];
          } else {
            this.previousBalanceObject['id_'+this.apiData[i]['fh_id']] = this.apiData[i]['head_amt']-this.apiData[i]['adjustment_amt']-this.apiData[i]['concession_amt'];
          }
        }
        console.log('this.previousBalanceObject--',this.previousBalanceObject)
      }}
        


        
        this.apiInvoiceData = data.invoice_due_data;
        console.log('data.invoice_due_data--',data.invoice_due_data)
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
          if(this.previousBalanceObject['id_'+ee.id]) {
            console.log(this.previousBalanceObject['id_'+ee.id]);  
            
            this.eachheadtotal_details['id_' + ee.id] += Number(this.previousBalanceObject['id_'+ee.id]);
            this.headtoatl += Number(this.previousBalanceObject['id_'+ee.id]);
          }

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
            tempelement['voucherExists'] = e.vc_state == 'delete' ? false : e.voucherExists;
            tempelement['vc_records'] = e.vc_data;
            let tempvalue = tempData.find(element => element.date == e.date);
            if (tempvalue) {
              this.displayedColumns.forEach(ee => {
                tempvalue.value.forEach(element => {
                  if (element.fh_id == ee.id) {
                    let tempvaluehead = 0;
                    if (this.adjustmentStatus) {
                      tempvaluehead = (element.head_amt ? Number(element.head_amt) : 0) + Number(element.concession_at) + Number(element.adjustment_amt);
                    } else {
                      tempvaluehead = element.head_amt ? Number(element.head_amt) : 0;
                    }
                    
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
            // console.log('tempelement--',tempelement);
            this.ELEMENT_DATA.push(tempelement);
          });
          
        }
        console.log("------------------------", this.ELEMENT_DATA);
        // console.log(this.eachheadtotal_details);
        // console.log(this.con_adj_details);

      }
      
      // this.commonAPIService.stopLoading();
      this.showLoadingFlag = false;
      this.tableDivFlag = true;
    });
  }
  getColumnTotal(item) {
    let total = 0;
    Object.keys(item).forEach(key => {
      if (key != 'date' && key != 'vc_id' && key != 'vc_state' && key != 'voucherExists' && key != 'vc_records' && key != 'prev_balance_voucher' && key != 'value') {
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
      // this.commonAPIService.startLoading();
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
      // this.commonAPIService.stopLoading();
    });
  }

  createVoucher(item, action) {
    console.log('item--', item);
    console.log('this.apiInvoiceData--',this.apiInvoiceData)
    this.currentVoucherData = item;
    console.log('this.currentvoucherData', this.currentVoucherData)
    if (item && item['prev_balance_voucher']) {
      this.voucherDate = item.date;
      this.checkForHeadData(item['value'], action, true);
    } else {
      for (var i = 0; i < this.apiInvoiceData.length; i++) {
        if (this.apiInvoiceData[i]['date'] === item.date) {
          this.voucherDate = item.date;
          this.checkForHeadData(this.apiInvoiceData[i]['value'], action, false);
          break;
        }
      }
    }
    
  }

  checkForHeadData(invoiceHeadArr, action,prev_balance_voucher) {
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
      this.getVoucherTypeMaxId(voucherEntryArray, prev_balance_voucher);
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
      this.getVoucherTypeMaxId(voucherEntryArray, prev_balance_voucher);
    }

    if (voucherEntryArray.length  === 0) {
      this.commonAPIService.showSuccessErrorMessage('There is no information to update / create', 'error');
    }


  }

  getVoucherTypeMaxId(voucherEntryArray, prev_balance_voucher) {
    let param: any = {};
    param.vc_type = this.currentVcType;;
    param.vc_date = this.currentVoucherData.date;
    let flag = 0;
    let result: any;

    this.faService.getVoucherTypeMaxId(param).subscribe((data: any) => {
      if (data) {
        flag = 1;
        result = data;

        this.getVcName(result, voucherEntryArray, prev_balance_voucher);

      }
    });

  }

  getVcName(vcData, voucherEntryArray, prev_balance_voucher) {
    let vcType = 'JV';
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
    this.vcData = { vc_code: vcData.vc_code, vc_name: this.vcYearlyStatus ? vcType + '/' + ((vcNumber.toString()).padStart(4, '0')) : vcType + '/' + vcMonth + '/' + ((vcNumber.toString()).padStart(4, '0')), vc_date: nYear + '-' + (month_id).padStart(2, '0') + '-' + no_of_days, vc_month: monthNames[Number(month_id)] };
    


    if (this.vcData) {
      var fJson = {
        vc_id: null,
        vc_type: 'Journal',
        vc_number: { vc_code: this.vcData.vc_code, vc_name: this.vcData.vc_name },
        vc_date: prev_balance_voucher  ? '' : this.voucherDate,
        vc_narrations: prev_balance_voucher ? 'Previous Due' : 'Invoice Due of Date ' + this.voucherDate,
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
