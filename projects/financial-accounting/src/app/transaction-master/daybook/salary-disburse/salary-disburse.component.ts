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
  selector: 'app-salary-disburse',
  templateUrl: './salary-disburse.component.html',
  styleUrls: ['./salary-disburse.component.css']
})
export class SalaryDisburseComponent implements OnInit {

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
  paymentModeArray:any[] = [];
  paymentModeAccount:any[]=[];
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
      this.daybookDisburse();
    }
  }
  ngOnChanges() {
    this.session = JSON.parse(localStorage.getItem('session'));
    console.log(this.param);
    //this.getChartsOfAccount();
    this.getSession();
    this.getGlobalSetting();
    if(this.param.month) {
      this.daybookDisburse();
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
  async daybookDisburse() {
    this.eachheadtotal_details = {};
    this.showLoadingFlag = true;
    this.headtoatl = 0;
    this.ELEMENT_DATA = [];
    this.faService.daybookDisburse({ sessionId: this.session.ses_id, month_id: Number(this.param.month) }).subscribe(async (result: any) => {
      if (result && result.result.length > 0) {
        this.showLoadingFlag = false;
        const tempData: any[] = result.result;  
        this.paymentModeArray =  tempData[0]['value'];
        if(tempData.length > 0){
          const dateArray: any[] = [];
          tempData.forEach(e => {
            const index = dateArray.findIndex(t => t == e.date);
            if (index == -1) {
              dateArray.push(e);
            }
          });
          this.paymentModeArray.forEach(ee => {
            this.eachheadtotal_details['id_' + ee.pm_id] = 0;
          })
          dateArray.forEach(e => {
            const tempelement: any = {};
            tempelement['date'] = e.date;
            tempelement['vc_id'] = e.vc_id;
            tempelement['vc_state'] = e.vc_state;
            tempelement['voucherExists'] = e.vc_state == 'delete' ? false : e.voucherExists;
            tempelement['be_back_status'] = e.be_back_status;
            let tempvalue = tempData.find(element => element.date == e.date);
            let total = 0;
            if (tempvalue) {
              this.paymentModeArray.forEach(ee => {
                tempvalue.value.forEach(element => {
                  if (element.pm_id == ee.pm_id) {
                    let tempvaluehead = element.pm_value ? Number(element.pm_value) : 0;
                    tempelement['id_' + ee.pm_id] = tempvaluehead;                    
                    total += tempvaluehead;
                    this.eachheadtotal_details['id_' + ee.pm_id] += tempvaluehead;
                  }
                });

              });
            }
            tempelement['data'] = tempvalue;
            tempelement['total'] = total;
            this.ELEMENT_DATA.push(tempelement);
          });
          this.tableDivFlag = true;
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
		this.paymentModeAccount = [];
		this.faService.getAllChartsOfAccount({}).subscribe((result: any) => {
			for (var i = 0; i < result.length; i++) {
				if ((result[i]['dependencies_type']) === "internal" && result[i]['coa_dependencies'] && (result[i]['coa_dependencies'][0]['dependenecy_component'] === "salary_component" || (result[i]['coa_dependencies'][0]['dependenecy_component'] === "cash") || (result[i]['coa_dependencies'][0]['dependenecy_component'] === "ca-7") || (result[i]['coa_dependencies'][0]['dependenecy_component'] === "ca-8") || (result[i]['coa_dependencies'][0]['dependenecy_component'] === "ca-10"))) {
					this.chartsOfAccount.push(result[i]);
				}
				if ((result[i]['dependencies_type']) === "internal" && result[i]['coa_dependencies'] && ((result[i]['coa_dependencies'][0]['dependenecy_component'] === "payment_mode_payment" || (result[i]['coa_dependencies'][0]['dependenecy_component'] === "cash") || result[i]['coa_dependencies'][0]['dependency_local_id'] === "ca-9")  && (result[i]['coa_dependencies'][0]['dependency_local_id'] !== "ca-1"))) {
					this.paymentModeAccount.push(result[i]);
				}
			}
			console.log('this.chartsOfAccount--', this.chartsOfAccount);
			console.log('this.paymentModeAccount--', this.paymentModeAccount);

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
      if (this.paymentModeAccount.length > 0) {
				var paymentParticularData = [];
				var cashPaymentParticularData = [];
				var spTotal = 0;
        var cpTotal = 0;
        let vFormJson:any;
        var cash_total = 0;
        var amt_total = 0;
        voucherData.data.value.forEach(element => {
          if(element.pm_acc_name == 'Cash Payment' && element.pm_value > 0){
            const findex = this.paymentModeAccount.findIndex(e => e['coa_dependencies'][0]['dependency_name'] == element.pm_acc_name);
            if(findex != -1){
              cash_total = element.pm_value;
              cpTotal = element.pm_value;
              vFormJson = {};
              if (cash_total > 0) {
              vFormJson = {
                vc_account_type: this.paymentModeAccount[findex]['coa_acc_name'],
                vc_account_type_id: this.paymentModeAccount[findex]['coa_id'],
                vc_particulars: this.paymentModeAccount[findex]['coa_acc_name'] + ' salary distribution',
                vc_grno: '',
                vc_invoiceno: '',
                vc_debit: '',
                vc_credit: cash_total
              };
              cashPaymentParticularData.push(vFormJson);
              }
            }
          } else if(element.pm_value > 0){
            let amt = element.pm_value;
            spTotal = spTotal + amt;
            const findex = this.paymentModeAccount.findIndex(e => e['coa_dependencies'][0]['dependency_name'] == element.pm_acc_name + ' Payment');
            if(findex != -1){     
              amt_total += amt;         
              vFormJson = {
                vc_account_type: this.paymentModeAccount[findex]['coa_acc_name'],
                vc_account_type_id: this.paymentModeAccount[findex]['coa_id'],
                vc_particulars: this.paymentModeAccount[findex]['coa_acc_name'] + ' salary distribution',
                vc_grno: '',
                vc_invoiceno: '',
                vc_debit: '',
                vc_credit: amt
              };
              paymentParticularData.push(vFormJson);
            }
          }
          
        });
				for (let i = 0; i < this.chartsOfAccount.length; i++) {
					if (this.chartsOfAccount[i]['coa_dependencies'][0]['dependency_name'] === 'Salary Payable') {
            console.log('injd');
            if(spTotal > 0) {
              let vFormJson = {};
              vFormJson = {
                vc_account_type: this.chartsOfAccount[i]['coa_acc_name'],
                vc_account_type_id: this.chartsOfAccount[i]['coa_id'],
                vc_particulars: 'salary payable',
                vc_grno: '',
                vc_invoiceno: '',
                vc_debit: spTotal,
                vc_credit: 0
              };
              paymentParticularData.push(vFormJson);
            }

            if(cpTotal > 0) {
              let vFormJson1 = {};
              vFormJson1 = {
                vc_account_type: this.chartsOfAccount[i]['coa_acc_name'],
                vc_account_type_id: this.chartsOfAccount[i]['coa_id'],
                vc_particulars: 'salary payable',
                vc_grno: '',
                vc_invoiceno: '',
                vc_debit: cpTotal,
                vc_credit: 0
              };
              cashPaymentParticularData.push(vFormJson1);
            }
					}
        }
        console.log('cashPaymentParticularData',cashPaymentParticularData)
        console.log('paymentParticularData',paymentParticularData)
				if (cashPaymentParticularData.length > 1 &&  cpTotal > 0) {
					this.getVoucherTypeMaxId(cashPaymentParticularData, 'Cash Payment','');
        }
        if (paymentParticularData.length > 1 &&  spTotal > 0 && spTotal == amt_total) {
					this.getVoucherTypeMaxId(paymentParticularData, 'Bank Payment','');
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
    let vcType = '';
    const vcTypeArr = vcData.vc_type.split(" ");
		if (vcTypeArr.length > 0) {
			vcTypeArr.forEach(element => {
				vcType += element.substring(0, 1).toUpperCase();
			});
    }
    vcType += 'V';
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
    let tempvc_narrations = 'Salary Computation of Month ' +vcMonth;
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
          // this.faService.insertVoucherEntry(fJson).subscribe((data: any) => {
          //   if (data) {
          //     this.daybookDisburse();
          //     this.commonAPIService.showSuccessErrorMessage('Voucher entry Created Successfully', 'success');
  
  
          //   } else {
          //     this.commonAPIService.showSuccessErrorMessage('Error While Creating Voucher Entry', 'error');
          //   }
          // });
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
