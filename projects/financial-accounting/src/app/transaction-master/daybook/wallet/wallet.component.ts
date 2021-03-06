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
import { element } from '@angular/core/src/render3/instructions';

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
  walletData = [];
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
  errorMessage:any[]=[];
  currentses:any={};
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
		param.gs_alias = ['fa_voucher_code_format_yearly_status','fa_session_freez','fa_monthwise_freez'];
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
  async getWalletsReport() {
    this.showLoadingFlag = true;
    this.headtoatl = 0;
    this.ELEMENT_DATA = [];
    this.feeService.getWalletsReport({ sessionId: this.session.ses_id, monthId: Number(this.param.month) }).subscribe(async (result: any) => {
      if (result && result.status === 'ok') {
        this.showLoadingFlag = true;
        const tempData: any[] = result.data;   
        this.walletData = result.data;  
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
            let param:any = {};
            param.from_date = dateArray[0];
            param.to_date = dateArray[dateArray.length - 1];
            param.vc_process = 'automatic/wallet';
            let apiVoucherData = [];
            await this.faService.getAllVoucherEntry(param).toPromise().then((data:any)=>{
              if(data) {
                apiVoucherData = data;
              }
            });
            console.log('apiVoucherData',apiVoucherData);
            console.log('apiVoucherData',apiVoucherData);
            dateArray.forEach(e => {
              const tempelement: any = {};
              tempelement['date'] = e;
              // tempelement['vc_id'] = e.vc_id;
              // tempelement['vc_state'] = e.vc_state;
              // tempelement['voucherExists'] = e.vc_state == 'delete' ? false : e.voucherExists;
              // tempelement['be_back_status'] = e.be_back_status;
              let tempvalue = tempData.filter(element => element.w_transaction_date == e);
              let apiVoucherDataEach = apiVoucherData.filter(element => element.vc_date == e);
              console.log('tempvalue',tempvalue);
              if (tempvalue && tempvalue.length > 0) {
                let deposit_amt = 0;
                let withdrawal_amt = 0;
                let purchase_amt = 0;
                let tempreceiptHeadArr:any[] = [];
                let tempstoredArr:any[] = [];
                tempvalue.forEach(element => {
                  let pay_name;
                  if(element.pay_id == 1){
                      pay_name = element.pay_name;
                  } else {
                    pay_name = element.tb_name_bnk ? element.tb_name_bnk : null;
                  }
                  if(pay_name){
                    element['pay_name']=pay_name;
                    tempreceiptHeadArr[pay_name] = tempreceiptHeadArr[pay_name] ? tempreceiptHeadArr[pay_name] : 0;
                  }                  
                  if(element.w_opening == 1){
                    // deposit_amt += parseInt(element.w_amount);
                    // if(pay_name) {
                    //   tempreceiptHeadArr[pay_name] += parseInt(element.w_amount);
                    // }                    
                  } else if(element.w_amount_status == 'deposit'){
                    deposit_amt += parseInt(element.w_amount);
                    if(pay_name) {
                      tempreceiptHeadArr[pay_name] += parseInt(element.w_amount);
                    } 
                  } else if(element.w_amount_status == 'withdrawal'){
                    withdrawal_amt += parseInt(element.w_amount);
                    if(pay_name) {
                      tempreceiptHeadArr[pay_name] -= parseInt(element.w_amount);
                    } 
                  } else if(element.w_amount_status == 'purchase'){
                    if(element.w_ref_location_id){
                      tempstoredArr[element.w_ref_location_id] = tempstoredArr[element.w_ref_location_id] ? tempstoredArr[element.w_ref_location_id] : 0
                      tempstoredArr[element.w_ref_location_id] += parseInt(element.w_amount);
                    }
                    purchase_amt += parseInt(element.w_amount);
                  }
                });
                tempelement['storewise_total_amt'] = tempstoredArr;
                tempelement['modewise_total_amt'] = tempreceiptHeadArr;
                tempelement['deposit_amt'] = deposit_amt;
                tempelement['withdrawal_amt'] = withdrawal_amt;
                tempelement['total_cash'] = deposit_amt-withdrawal_amt;
                tempelement['purchase_amt'] = purchase_amt;					
                tempelement['total'] = deposit_amt-withdrawal_amt-purchase_amt;
                this.eachheadtotal_details['deposit_amt'] += deposit_amt;
                this.eachheadtotal_details['withdrawal_amt'] += withdrawal_amt;
                this.eachheadtotal_details['purchase_amt'] += purchase_amt;
                this.eachheadtotal_details['total'] += tempelement['total'];
                tempelement['voucherExists'] = false;
                if(apiVoucherDataEach.length > 0){
                  if(apiVoucherDataEach[0].vc_state != 'delete'){
                    tempelement['voucherExists'] = true;                  
                  }
                }
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
            let tdate = new Date();
            const sessionarr = citem.ses_name.split('-');
            var from = new Date(sessionarr[0]+'-04-01');
            var to = new Date(sessionarr[1]+'-03-31');
            if(tdate >= from && tdate <= to) {
                this.currentses['ses_id'] = citem.ses_id;
            }
          }
          if (this.session) {
            this.sessionName = this.sessionArray[this.session.ses_id];
          }

        }
      });
  }
  monthwiseFreez(date){
    if(date) {
      let datearr = date.split('-');
      if(this.session.ses_id == this.currentses.ses_id) {
        if(this.globalsetup['fa_monthwise_freez'] && this.globalsetup['fa_monthwise_freez'].includes(datearr[1])) {
          return true;
        }
      } else {
        return false;
      }
    }
    return false;
  }
  getChartsOfAccount() {
    this.chartsOfAccount = [];
    this.chartsOfAccountInvoice = [];
    this.tempChartsOfAccountInvoice = [];
    this.faService.getAllChartsOfAccount({coa_status:'active'}).subscribe((result: any) => {
      
      for (var i = 0; i < result.length; i++) {
        if ((result[i]['dependencies_type']) === "internal" && result[i]['coa_dependencies'] && result[i]['coa_dependencies'][0] && (result[i]['coa_dependencies'][0]['dependenecy_component'] === "wallet" || result[i]['coa_dependencies'][0]['dependenecy_component'] === "cash" || result[i]['coa_dependencies'][0]['dependenecy_component'] === "payment_mode_collection")) {
          this.chartsOfAccount.push(result[i]);
          console.log('chartsOfAccount,', this.chartsOfAccount);
        }
        if ((result[i]['dependencies_type']) === "internal" && result[i]['coa_dependencies'] && result[i]['coa_dependencies'][0] && (result[i]['coa_dependencies'][0]['dependenecy_component'] === "store" || result[i]['coa_dependencies'][0]['dependenecy_component'] === "wallet")) {
          //console.log('result--', result[i]);
          this.chartsOfAccountInvoice.push(result[i]);
          this.tempChartsOfAccountInvoice.push(result[i]['coa_dependencies'][0]['dependency_name']);
          console.log('chartsOfAccountInvoice,', this.chartsOfAccountInvoice)
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
    this.errorMessage = [];
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
      let dateWalletData = this.walletData.filter(e => e.w_transaction_date == voucherData.date);
      console.log(voucherData.modewise_total_amt['Cash']);
      if(voucherData.modewise_total_amt['Cash']){
        let voucherEntryArray = [];
        let voucheramt = voucherData.modewise_total_amt['Cash'];
        let tempnaration = 'Being Net Amount Received against Pocket Money';
        if(voucheramt > 0){
          debitac = this.chartsOfAccount.find(e => e['coa_dependencies'][0]['dependency_name'] == 'Cash Collection') ;
          creditac = this.chartsOfAccount.find(e => e['coa_dependencies'][0]['dependency_name'] == 'Wallet') ;  
        } else {
          tempnaration = 'Being Net Amount Paid against Pocket Money';
          debitac = this.chartsOfAccount.find(e => e['coa_dependencies'][0]['dependency_name'] == 'Wallet') ; 
          creditac = this.chartsOfAccount.find(e => e['coa_dependencies'][0]['dependency_name'] == 'Cash Collection') ; 
          voucheramt  = -voucheramt ;
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
            vc_debit: 0,
            vc_credit: voucheramt
          };
          voucherEntryArray.push(vFormJson);
          this.getVoucherTypeMaxId(voucherEntryArray,'Receipt',tempnaration);
        } else {
          this.errorMessage.push('Error While Creating Voucher Entry');
          // this.commonAPIService.showSuccessErrorMessage('Error While Creating Voucher Entry', 'error');
        }
      }
      let receiptHeadArr = []
      for(let mod in voucherData.modewise_total_amt){
        if(mod != 'Cash') {
          receiptHeadArr[mod] = voucherData.modewise_total_amt[mod];
        }
      }
      console.log('receiptHeadArr',receiptHeadArr);
      console.log('receiptHeadArr.length',Object.keys(receiptHeadArr).length);
      if(Object.keys(receiptHeadArr).length > 0){
        let tempnaration = 'Being Net Amount Received against Pocket Money';
        let feeReceivableAmt = 0;
        let voucherEntryArray = [];
        let total_debit_amt = 0;
        let total_credit_amt = 0;
        for (let mod in receiptHeadArr) {
          total_debit_amt += receiptHeadArr[mod];
        }
        for (let mod in receiptHeadArr) {
          for (let j = 0; j < this.chartsOfAccount.length; j++) {
            if ((this.chartsOfAccount[j]['coa_dependencies'][0]['dependency_name'] === mod+' Collection') || (this.chartsOfAccount[j]['coa_dependencies'][0]['dependency_name'] === mod) ) {
              if (receiptHeadArr[mod] != 0) {
                let vFormJson = {
                  vc_account_type: this.chartsOfAccount[j]['coa_acc_name'],
                  vc_account_type_id: this.chartsOfAccount[j]['coa_id'],
                  vc_particulars: this.chartsOfAccount[j]['coa_acc_name'],
                  vc_grno: '',
                  vc_invoiceno: '',
                  vc_debit: receiptHeadArr[mod],
                  vc_credit: 0
                };
                feeReceivableAmt = feeReceivableAmt + receiptHeadArr[mod]
                voucherEntryArray.push(vFormJson);
                break;
              }
            }
          }
        }
        if (voucherEntryArray.length > 0) {
          creditac = this.chartsOfAccount.find(e => e['coa_dependencies'][0]['dependenecy_component'] == 'wallet') ; 
          if(creditac) {
            let vFormJson = {
              vc_account_type: creditac['coa_acc_name'],
              vc_account_type_id: creditac['coa_id'],
              vc_particulars: creditac['coa_acc_name'],
              vc_grno: '',
              vc_invoiceno: '',
              vc_debit: 0,
              vc_credit: feeReceivableAmt
            };
            total_credit_amt += feeReceivableAmt;
            voucherEntryArray.push(vFormJson);
            if(total_debit_amt == total_credit_amt) {
              this.getVoucherTypeMaxId(voucherEntryArray,'Receipt',tempnaration);
            } else {
              this.errorMessage.push('Error Mismatch amount in modewise collention');
            }
          } else {
            this.errorMessage.push('Error While Creating Voucher Entry');
            // this.commonAPIService.showSuccessErrorMessage('Error While Creating Voucher Entry', 'error');
          }
        }
      }
      if(voucherData.purchase_amt > 0){
        let dateWalletData = this.walletData.filter(e => e.w_transaction_date == voucherData.date);
        console.log(voucherData.purchase_amt);
        let voucherEntryArray1 = [];
        debitac=null;
        creditac =null;
        debitac = this.chartsOfAccountInvoice.find(e => e['coa_dependencies'][0]['dependenecy_component'] == 'wallet') ;
        creditac = this.chartsOfAccountInvoice.find(e => e['coa_dependencies'][0]['dependenecy_component'] == 'store') ;  
        console.log('debitact',debitac);
        console.log('creditac',creditac);
        if(debitac && creditac) {
          let total_debit_amt = 0;
          let total_credit_amt = 0;
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
          total_debit_amt += voucherData.purchase_amt;
          voucherEntryArray1.push(vFormJson);
          let storewise_total_amt =  voucherData.storewise_total_amt;
          for (let storeid in storewise_total_amt) {
            for (let j = 0; j < this.chartsOfAccountInvoice.length; j++) {
              if ((this.chartsOfAccountInvoice[j]['coa_dependencies'][0]['dependancy_id'] === storeid) && (this.chartsOfAccountInvoice[j]['coa_dependencies'][0]['dependenecy_component'] === 'store') ) {
                if (storewise_total_amt[storeid] != 0) {
                  let vFormJson = {
                    vc_account_type: this.chartsOfAccountInvoice[j]['coa_acc_name'],
                    vc_account_type_id: this.chartsOfAccountInvoice[j]['coa_id'],
                    vc_particulars: this.chartsOfAccountInvoice[j]['coa_acc_name'],
                    vc_grno: '',
                    vc_invoiceno: '',
                    vc_debit: 0,
                    vc_credit: storewise_total_amt[storeid]
                  };
                  total_credit_amt += (storewise_total_amt[storeid] ? parseInt(storewise_total_amt[storeid]) : 0);
                  voucherEntryArray1.push(vFormJson);
                  break;
                }
              }
            }
          }
          if(total_debit_amt == total_credit_amt) {
            this.getVoucherTypeMaxId(voucherEntryArray1,'Journal','Being Non cash purchases made through pocket money account');
          } else {
            this.errorMessage.push('Error Mismatch amount in storewise collention');
          }
        } else {
          this.errorMessage.push('Error While Creating Voucher Entry');
          // this.commonAPIService.showSuccessErrorMessage('Error While Creating Voucher Entry', 'error');
        }
      }

    }
  }

  async getVoucherTypeMaxId(voucherEntryArray,vc_type,vc_narrations) {
    let param: any = {};
    param.vc_type = vc_type;
    param.vc_date = this.currentVoucherData.date;
    let flag = 0;
    let result: any;

    await this.faService.getVoucherTypeMaxId(param).toPromise().then((data: any) => {
      if (data) {
        flag = 1;
        result = data;
        result['vc_narrations'] = vc_narrations;

        this.getVcName(result, voucherEntryArray);

      }
    });

  }

  async getVcName(vcData, voucherEntryArray) {
    let vcType = vcData.vc_type.substr(0,1)+'V';
    let tempvc_narrations = vcData.vc_narrations;
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
        vc_narrations: tempvc_narrations + ' Date ' + this.voucherDate,
        vc_attachments: [],
        vc_particulars_data: voucherEntryArray,
        vc_state: 'draft',
        vc_process: 'automatic/wallet'
        // vc_process: 'automatic/'+vcData.vc_type.toLowerCase()

      }
      console.log('fJson--', fJson);
      if (!this.currentVoucherData.vc_id) {
        if(this.errorMessage.length == 0){
          this.faService.insertVoucherEntry(fJson).subscribe((data: any) => {
            if (data) {
              // if(this.currentVoucherData.be_back_status) {
              //   this.faService.updateBackDateEntry({be_back_date:this.currentVoucherData.be_back_date, be_back_status:this.currentVoucherData.be_back_status}).subscribe((data:any)=>{
        
              //   });
              // }
              this.getWalletsReport();
              this.commonAPIService.showSuccessErrorMessage('Voucher entry Created Successfully', 'success');
  
  
            } else {
              this.commonAPIService.showSuccessErrorMessage('Error While Creating Voucher Entry', 'error');
            }
          });
        } else {
          this.commonAPIService.showSuccessErrorMessage(this.errorMessage[0], 'error');
        }
      }
    }

  }
  isExistUserAccessMenu(mod_id) {
		return this.commonAPIService.isExistUserAccessMenu(mod_id);
	}

}
