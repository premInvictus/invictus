import { Component, OnInit, ViewChild, Input, OnChanges  } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './model';
import {SelectionModel} from '@angular/cdk/collections';
import { TitleCasePipe } from '@angular/common';
import { SisService, CommonAPIService, FaService } from '../../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { IndianCurrency } from '../../../_pipes';
import * as moment from 'moment';

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
  eachheadtotal_details:any;
  partialPaymentStatus = 1;
  apiInvoiceData = [];
  apiReceiptData = [];
  chartsOfAccount: any[] = [];
  vcData: any;
  currentVcType = 'Journel Entry';
  sessionArray: any[] = [];
  sessionName: any;
  voucherDate:any;
  currentVoucherData:any;
  constructor(
    private fbuild: FormBuilder,
		  private sisService: SisService,
		  private commonAPIService: CommonAPIService,
		  private faService:FaService,
		  private dialog: MatDialog,            
		  private router: Router,
			private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.session = JSON.parse(localStorage.getItem('session'));
    this.checkPartialPaymentStatus();
    this.getChartsOfAccount();
    this.getSession();
    //this.getInvoiceDayBook();
  }
  ngOnChanges() {
    this.session = JSON.parse(localStorage.getItem('session'));
    console.log(this.param);
    this.getChartsOfAccount();
    this.getSession();
    this.getInvoiceDayBook();
    
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
  getInvoiceDayBook(){
    this.headtoatl = 0;
    this.displayedColumns = [];
    this.ELEMENT_DATA = [];
    this.faService.getInvoiceDayBook({sessionId: this.session.ses_id,monthId: Number(this.param.month)}).subscribe((data:any)=>{
      if(data) {

        const tempData: any = data.receipt_data;
        this.apiReceiptData = data.receipt_data;
        
        const tempHeader: any[] = [];

        tempData.forEach(e => {
          e.value.forEach(element => {
            element.temp_id = element.pay_name ? element.pay_name.toString().toLowerCase().replace(/ /g,'') : '';
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
          if(index == -1) {
            dateArray.push(e);
          }
        });
        this.eachheadtotal_details = {};
        this.displayedColumns.forEach(ee => {
          this.eachheadtotal_details['id_'+ee.id] = 0;
        });
        if(tempData.length > 0) {
          dateArray.forEach(e => {
            const tempelement: any = {};
            tempelement['date'] = e.date;
            tempelement['vc_id'] = e.vc_id ;
            tempelement['vc_state'] = e.vc_state ;
            tempelement['voucherExists'] = e.voucherExists;
            let tempvalue = tempData.find(element => element.date == e.date);
            if(tempvalue) {
              this.displayedColumns.forEach(ee => {
                tempvalue.value.forEach(element => {
                  if(element.temp_id == ee.id){
                    let tempvaluehead = element.receipt_amt ? Number(element.receipt_amt) : 0;
                    this.headtoatl += tempvaluehead;
                    tempelement['id_'+ee.id] = tempvaluehead;
                    this.eachheadtotal_details['id_'+ee.id] += tempvaluehead;
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
  getColumnTotal(item){
    let total = 0;
    Object.keys(item).forEach(key => {
      if (key != 'date' && key != 'vc_id' && key != 'vc_state' && key != 'voucherExists') {
        let v = item[key] || 0;
        total += v;
      }
    });
    return total;
  }
  getTotal(id) {
    if(this.ELEMENT_DATA.length > 0){
      return this.ELEMENT_DATA.reduce((a,b) => a + Number(b['id_'+id]),0);
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
    this.faService.getAllChartsOfAccount({}).subscribe((result: any) => {
      for (var i = 0; i < result.length; i++) {
        if ((result[i]['dependencies_type']) === "internal" && (result[i]['coa_dependencies'][0]['dependenecy_component'] === "payment_mode" || result[i]['coa_dependencies'][0]['dependenecy_component'] === "cash")) {
          this.chartsOfAccount.push(result[i]);
        }
      }
    });
  }

  createVoucher(item) {
    console.log('item--', item);
    this.currentVoucherData = item;
    for (var i = 0; i < this.apiReceiptData.length; i++) {
      if (this.apiReceiptData[i]['date'] === item.date) {
        this.voucherDate = item.date;
        this.checkForHeadData(this.apiReceiptData[i]['value']);
        break;
      }
    }
  }

  checkForHeadData(receiptHeadArr) {
    console.log(receiptHeadArr, this.chartsOfAccount);
    var voucherEntryArray = [];
    for (var i = 0; i < receiptHeadArr.length; i++) {
      for (var j = 0; j < this.chartsOfAccount.length; j++) {
        if (this.chartsOfAccount[j]['coa_dependencies'][0]['dependency_name'] === receiptHeadArr[i]['pay_name']) {
          
          let vFormJson = {};
          vFormJson = {
            vc_account_type: this.chartsOfAccount[j]['coa_acc_name'],
            vc_account_type_id: this.chartsOfAccount[j]['coa_id'],
            vc_particulars: this.chartsOfAccount[j]['coa_acc_name'],
            vc_grno: '',
            vc_invoiceno: '',
            vc_debit: 0,
            vc_credit: receiptHeadArr[i]['receipt_amt']
          };
          voucherEntryArray.push(vFormJson);
        }
      }
    }
    if (voucherEntryArray.length > 0) {
      this.getVoucherTypeMaxId(voucherEntryArray);
    }


  }

  getVoucherTypeMaxId(voucherEntryArray) {
    let param: any = {};
    param.vc_type = this.currentVcType;;
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
    this.vcData = { vc_code: vcData.vc_code, vc_name: vcType + '/' + vcMonth + '/' + ((vcNumber.toString()).padStart(4, '0')), vc_date: nYear + '-' + (month_id).padStart(2, '0') + '-' + no_of_days, vc_month: monthNames[Number(month_id)] };
    console.log(voucherEntryArray, 'test');


    if (this.vcData) {
      var fJson = {
        vc_id:  this.currentVoucherData &&  this.currentVoucherData.vc_id ? this.currentVoucherData.vc_id : null,
        vc_type: 'Journel Entry',
        vc_number: { vc_code: this.vcData.vc_code, vc_name: this.vcData.vc_name },
        vc_date: this.voucherDate,
        vc_narrations: 'Receipt Computation of Date ' + this.voucherDate,
        vc_attachments: [],
        vc_particulars_data: voucherEntryArray,
        vc_state: 'draft',
        vc_process:'automatic/receipt'

      }



      
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
        this.faService.updateVoucherEntry(fJson).subscribe((data: any) => {
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


}
