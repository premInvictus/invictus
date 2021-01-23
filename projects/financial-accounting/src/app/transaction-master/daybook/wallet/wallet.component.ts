import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { SisService, CommonAPIService, FaService, FeeService } from '../../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { IndianCurrency } from '../../../_pipes';
import * as moment from 'moment';
import { WalletModalComponent } from '../../wallet-modal/wallet-modal.component';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  @Input() param: any;
  tableDivFlag = false;
  ELEMENT_DATA: any[] = [];
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
  currentVcType;
  sessionArray: any[] = [];
  sessionName: any;
  voucherDate: any;
  currentVoucherData: any;
  tempChartsOfAccountInvoice: any[] = [];
  vcYearlyStatus = 0;
  feeReceivableAccountId = 0;
  showLoadingFlag = false;
  feeReceivableAccountName = 'Fee Receivable';
  globalsetup:any;

  constructor(
    private fbuild: FormBuilder,
    private sisService: SisService,
    private commonAPIService: CommonAPIService,
    private faService: FaService,
    private feeService: FeeService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.session = JSON.parse(localStorage.getItem('session'));
    this.getGlobalSetting();
    this.getChartsOfAccount();
    this.getSession();
    if(this.param.month) {
      this.getWalletsReport();
    }
  }
  ngOnChanges() {
    this.session = JSON.parse(localStorage.getItem('session'));
    console.log(this.param);
    //this.getChartsOfAccount();
    this.getSession();
    this.getGlobalSetting();
    if(this.param.month) {
      this.getWalletsReport();
    }
  }
  openModel(e) {
    const dialogRefFilter = this.dialog.open(WalletModalComponent, {
			width: '70%',
			height: '70%',
			data: {
        month_id: this.param.month,
        date: e.date,
        reportType: 'wallet'
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
  getDaysInMonth(month, year) {
		return new Date(year, month, 0).getDate();
	};
  getWalletsReport() {
    this.showLoadingFlag = true;
    this.headtoatl = 0;
    this.ELEMENT_DATA = [];
    this.feeService.getWalletsReport({ sessionId: this.session.ses_id, monthId: Number(this.param.month) }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.showLoadingFlag = true;
        const tempData: any[] = result.data;     
        const dateArray: any[] = [];
        const no_of_days2 = this.getDaysInMonth(this.param.month, new Date().getFullYear());
        if(tempData.length > 0){
          let date = new Date(tempData[0].w_transaction_date);
          let month = date.getMonth() + 1;
          let year = date.getFullYear();
          for (let i = 1; i <= no_of_days2; i++) {
						const tempdate = year + '-' + month + '-' + i;
            const dateFormate = this.commonAPIService.dateConvertion(tempdate, 'y-MM-dd');
            dateArray.push(dateFormate);
          }
          // tempData.forEach(e => {
          //   const index = dateArray.findIndex(t => t == e.w_transaction_date);
          //   if (index == -1) {
          //     dateArray.push(e.w_transaction_date);
          //   }
          // });
          this.eachheadtotal_details = {};
          this.eachheadtotal_details['deposit_amt']=0;
          this.eachheadtotal_details['withdrawal_amt']=0;
          this.eachheadtotal_details['purchase_amt']=0;
          this.eachheadtotal_details['total']=0;
          if (tempData.length > 0) {
            dateArray.forEach(e => {
              const tempelement: any = {};
              tempelement['date'] = e;
              // tempelement['vc_id'] = e.vc_id;
              // tempelement['vc_state'] = e.vc_state;
              // tempelement['voucherExists'] = e.vc_state == 'delete' ? false : e.voucherExists;
              // tempelement['be_back_status'] = e.be_back_status;
              let tempvalue = tempData.filter(element => element.w_transaction_date == e);
              console.log('tempvalue',tempvalue);
              if (tempvalue && tempvalue.length > 0) {
                let deposit_amt = 0;
                let withdrawal_amt = 0;
                let purchase_amt = 0;
                tempvalue.forEach(element => {
                  if(element.w_opening == 1){
                    deposit_amt += parseInt(element.w_amount);
                  } else if(element.w_amount_status == 'deposit'){
                    deposit_amt += parseInt(element.w_amount);
                  } else if(element.w_amount_status == 'withdrawal'){
                    withdrawal_amt += parseInt(element.w_amount);
                  } else if(element.w_amount_status == 'purchase'){
                    purchase_amt += parseInt(element.w_amount);
                  }
                });
                tempelement['deposit_amt'] = deposit_amt;
                tempelement['withdrawal_amt'] = withdrawal_amt;
                tempelement['purchase_amt'] = purchase_amt;					
                tempelement['total'] = deposit_amt-withdrawal_amt-purchase_amt;
                this.eachheadtotal_details['deposit_amt'] += deposit_amt;
                this.eachheadtotal_details['withdrawal_amt'] += withdrawal_amt;
                this.eachheadtotal_details['purchase_amt'] += purchase_amt;
                this.eachheadtotal_details['total'] += tempelement['total'];
              }
              this.ELEMENT_DATA.push(tempelement);
            });
            this.tableDivFlag = true;
          }
          console.log('this.ELEMENT_DATA',this.ELEMENT_DATA);
        }
      }
      this.showLoadingFlag = false;
    });
  }

  getColumnTotal(item) {
    let total = 0;
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
        if ((result[i]['dependencies_type']) === "internal" && result[i]['coa_dependencies'] && result[i]['coa_dependencies'][0] && (result[i]['coa_dependencies'][0]['dependenecy_component'] === "wallet" || result[i]['coa_dependencies'][0]['dependenecy_component'] === "cash")) {
          this.chartsOfAccount.push(result[i]);
          console.log('charts of account receipt,', this.chartsOfAccount);
        }
        if ((result[i]['dependencies_type']) === "internal" && result[i]['coa_dependencies'] && result[i]['coa_dependencies'][0] && result[i]['coa_dependencies'][0]['dependenecy_component'] === "store") {
          //console.log('result--', result[i]);
          this.chartsOfAccountInvoice.push(result[i]);
          this.tempChartsOfAccountInvoice.push(result[i]['coa_dependencies'][0]['dependency_name']);
          console.log('charts of account invoice,', this.chartsOfAccountInvoice)
        }
        if ((result[i]['dependencies_type']) === "internal" && result[i]['coa_dependencies'] && result[i]['coa_dependencies'][0]['dependenecy_component'] === "fee_receivable") {
          //console.log('result--', result[i]);
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
    this.voucherDate = item.date;
    this.checkForHeadData(this.currentVoucherData, action);
    // for (var i = 0; i < this.apiReceiptData.length; i++) {
    //   if (this.apiReceiptData[i]['date'] === item.date) {
    //     this.voucherDate = item.date;
    //     this.checkForHeadData(this.apiReceiptData[i]['value'], action);
    //     break;
    //   }
    // }
  }

  checkForHeadData(voucherData, action) {
    if (action != 'update') {
      let debitac;
      let creditac;
      if(voucherData.deposit_amt || voucherData.withdrawal_amt){
        let voucherEntryArray = [];
        const voucheramt = voucherData.deposit_amt - voucherData.withdrawal_amt;
        if(voucheramt >= 0){
          debitac = this.chartsOfAccount.find(e => e['coa_dependencies'][0]['dependency_name'] == 'Cash Collection') ;
          creditac = this.chartsOfAccount.find(e => e['coa_dependencies'][0]['dependency_name'] == 'Wallet') ;  
        } else {
          debitac = this.chartsOfAccount.find(e => e['coa_dependencies'][0]['dependency_name'] == 'Wallet') ; 
          creditac = this.chartsOfAccount.find(e => e['coa_dependencies'][0]['dependency_name'] == 'Cash Collection') ; 
        }
        if(debitac && creditac) {
          let vFormJson = {};
          vFormJson = {
            vc_account_type: debitac['coa_acc_name'],
            vc_account_type_id: debitac['coa_id'],
            vc_particulars: debitac['coa_acc_name'],
            vc_grno: '',
            vc_invoiceno: '',
            vc_debit: voucheramt,
            vc_credit: 0
          };
          voucherEntryArray.push(vFormJson);
          vFormJson = {
            vc_account_type: creditac['coa_acc_name'],
            vc_account_type_id: creditac['coa_id'],
            vc_particulars: creditac['coa_acc_name'],
            vc_grno: '',
            vc_invoiceno: '',
            vc_debit: voucheramt,
            vc_credit: 0
          };
          voucherEntryArray.push(vFormJson);
          this.getVoucherTypeMaxId(voucherEntryArray,'Receipt');
        }
      }
      if(voucherData.purchase_amt > 0){
        let voucherEntryArray1 = [];
        debitac=null;
        creditac =null;
        debitac = this.chartsOfAccountInvoice.find(e => e['coa_dependencies'][0]['dependency_name'] == 'Wallet') ;
        creditac = this.chartsOfAccountInvoice.find(e => e['coa_dependencies'][0]['dependency_name'] == 'Store') ;  
        if(debitac && creditac) {
          let vFormJson = {};
          vFormJson = {
            vc_account_type: debitac['coa_acc_name'],
            vc_account_type_id: debitac['coa_id'],
            vc_particulars: debitac['coa_acc_name'],
            vc_grno: '',
            vc_invoiceno: '',
            vc_debit: voucherData.purchase_amt,
            vc_credit: 0
          };
          voucherEntryArray1.push(vFormJson);
          vFormJson = {
            vc_account_type: creditac['coa_acc_name'],
            vc_account_type_id: creditac['coa_id'],
            vc_particulars: creditac['coa_acc_name'],
            vc_grno: '',
            vc_invoiceno: '',
            vc_debit: voucherData.purchase_amt,
            vc_credit: 0
          };
          voucherEntryArray1.push(vFormJson);
          this.getVoucherTypeMaxId(voucherEntryArray1,'Journal');
        }
      }
    }
  }

  async getVoucherTypeMaxId(voucherEntryArray,vc_type) {
    let param: any = {};
    param.vc_type = vc_type;
    param.vc_date = this.currentVoucherData.date;
    let flag = 0;
    let result: any;

    await this.faService.getVoucherTypeMaxId(param).toPromise().then((data: any) => {
      if (data) {
        flag = 1;
        result = data;

        this.getVcName(result, voucherEntryArray);

      }
    });

  }

  getVcName(vcData, voucherEntryArray) {
    let vcType = vcData.vc_type.substr(0,1)+'V';
    console.log('vcData---',vcData);
    console.log('voucherEntryArray------',voucherEntryArray);
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
        vc_id: this.currentVoucherData && this.currentVoucherData.vc_id ? this.currentVoucherData.vc_id : null,
        vc_type: vcData.vc_type,
        vc_number: { vc_code: this.vcData.vc_code, vc_name: this.vcData.vc_name },
        vc_date: this.voucherDate,
        vc_narrations: 'Receipt Computation of Date ' + this.voucherDate,
        vc_attachments: [],
        vc_particulars_data: voucherEntryArray,
        vc_state: 'draft',
        vc_process: 'automatic/'+vcData.vc_type.toLowerCase()

      }
      console.log('fJson--', fJson);
      // if (!this.currentVoucherData.vc_id) {
      //   this.faService.insertVoucherEntry(fJson).subscribe((data: any) => {
      //     if (data) {
      //       if(this.currentVoucherData.be_back_status) {
      //         this.faService.updateBackDateEntry({be_back_date:this.currentVoucherData.be_back_date, be_back_status:this.currentVoucherData.be_back_status}).subscribe((data:any)=>{
      
      //         });
      //       }
      //       this.getWalletsReport();
      //       this.commonAPIService.showSuccessErrorMessage('Voucher entry Created Successfully', 'success');


      //     } else {
      //       this.commonAPIService.showSuccessErrorMessage('Error While Creating Voucher Entry', 'error');
      //     }
      //   });
      // } else {

      //   this.faService.insertVoucherEntry(fJson).subscribe((data: any) => {
      //     if (data) {
      //       this.faService.updateBackDateEntry({be_back_date:this.currentVoucherData.be_back_date, be_back_status:this.currentVoucherData.be_back_status}).subscribe((data:any)=>{
      
      //       });
      //       this.getWalletsReport();
      //       this.commonAPIService.showSuccessErrorMessage('Voucher entry Updated Successfully', 'success');


      //     } else {
      //       this.commonAPIService.showSuccessErrorMessage('Error While Updating Voucher Entry', 'error');
      //     }
      //   });

      // }
    }


  }
  isExistUserAccessMenu(mod_id) {
		return this.commonAPIService.isExistUserAccessMenu(mod_id);
	}

}
