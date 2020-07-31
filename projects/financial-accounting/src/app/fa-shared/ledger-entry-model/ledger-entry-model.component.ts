import { Component, OnInit, Inject,Input,OnChanges } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { SisService, CommonAPIService, SmartService, FaService } from '../../_services';
import { forEach } from '@angular/router/src/utils/collection';
import {VoucherModalComponent} from '../voucher-modal/voucher-modal.component';
@Component({
  selector: 'app-ledger-entry-model',
  templateUrl: './ledger-entry-model.component.html',
  styleUrls: ['./ledger-entry-model.component.css']
})
export class LedgerEntryModelComponent implements OnInit, OnChanges {
  accountform: FormGroup;
  disabledApiButton = false;
  accountGroupArr:any[] = [];
  accountTypeArr:any[] = [];
  currentCoaId =0;
  blankArr:any[] = [];
  showtitle = false;
  currentReceiptData:any;
  credit_total_f =0;
  debit_total_f =0;
  deviation_f =0;
  @Input() param: any;
  closingDate:any;
  partialPaymentStatus = 1;
  constructor(
    public dialogRef: MatDialogRef<LedgerEntryModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fbuild: FormBuilder,
    private fb: FormBuilder,
		private commonAPIService: CommonAPIService,
    private faService:FaService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
  this.buildForm();
  console.log(this.data);
  if(this.data.showtitle){
    this.showtitle = true;
  }
  this.getLedger();
  this.checkPartialPaymentStatus();
  }
  buildForm() {
  }
  ngOnChanges() {
   // console.log(this.param);
    // this.param.forEach(element => {
      // let dtotal = 0;
      // element.debit_data.forEach(element1 => {
      //   dtotal += Number(element1.vc_particulars_data.vc_debit);
      // });
      // element.dtotal = dtotal;
      // let ctotal = 0;
      // element.credit_data.forEach(element1 => {
      //   ctotal += Number(element1.vc_particulars_data.vc_credit);
      // });
      // element.ctotal = ctotal;
      // if((dtotal -  ctotal) > 0){
      //   element.ctobalance = (dtotal -  ctotal);
      //   element.ctotal += element.ctobalance
      // } else {
      //   element.dtobalance = (ctotal -  dtotal);
      //   element.dtotal += element.dtobalance;
      // }
    // });
    
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

  checkBlankArray(item) {
   // console.log("in");
   this.blankArr  = [];
    if (item.debit_data.length > item.credit_data.length) {
      for (var i=0; i< (item.debit_data.length - item.credit_data.length); i++) {
        this.blankArr.push(i);
      }
    }else if (item.debit_data.length < item.credit_data.length) {
      for (var i=0; i< (item.credit_data.length - item.debit_data.length); i++) {
        this.blankArr.push(i);
      }
    }

    return this.blankArr;

  }

  getLedger(){
    if(this.data.coa_id){
      console.log(this.data.date);
      this.faService.getTrialBalance({coa_id:[this.data.coa_id],monthId: this.data.date != 'consolidate' ? Number(this.data.date): 'consolidate'}).subscribe((data:any)=>{
        if(data) {
          console.log(data);
         // this.param = data;
          var receipt_data = data.receipt_data;
          var receiptArr = [];
          for(var j=0; j<receipt_data.length; j++) {
            receiptArr.push(receipt_data[j]['tb_name']);
          }
          for (var i =0;  i < data.ledger_data.length; i++) {
            if (data.ledger_data[i]['coa_dependencies'] && receiptArr.indexOf(data.ledger_data[i]['coa_dependencies'][0]['dependency_name'] ) > -1) {
              var index = receiptArr.indexOf(data.ledger_data[i]['coa_dependencies'][0]['dependency_name'] );

             
              var receipt_value = receipt_data[index]['receipt_amt'];
              if (receipt_value > 0) {
                var iJson:any = {
                  "vc_account_type" :  data.ledger_data[i]['coa_dependencies'][0]['dependency_name'],
                      "vc_credit" : receipt_value
                                          
                }
                data.ledger_data[i]['debit_data'].push(iJson);
                data.ledger_data[i]['credit_data'].push({});
              }
              if (receipt_value < 0) {
                var iJson:any = {
                  "vc_account_type" :  data.ledger_data[i]['coa_dependencies'][0]['dependency_name'],
                      "vc_debit" : receipt_value
                                          
                }
                data.ledger_data[i]['credit_data'].push(iJson);
                data.ledger_data[i]['debit_data'].push({});
              }
            }
            if(i===data.ledger_data.length -1 ) {
              this.param = data;
              //this.tableDivFlag = true;
            }
          }
        } else {
          
        }
      })
    }
  }

  getDeviation(param) {
    if(param) {
      this.debit_total_f = 0;
      this.credit_total_f = 0;
      this.deviation_f =0;
      for(var i=0; i<param['debit_data'].length; i++) {
        //debit_total = debit_total+param['debit_data'][i]['vc_credit'];
        this.debit_total_f = this.debit_total_f + (param['debit_data'][i]['vc_credit'] ? param['debit_data'][i]['vc_credit'] : 0 );
      }
      for(var i=0; i<param['credit_data'].length; i++) {
        //credit_total = credit_total+param['credit_data'][i]['vc_debit'];
        this.credit_total_f = this.credit_total_f + (param['credit_data'][i]['vc_debit'] ? param['credit_data'][i]['vc_debit'] : 0);
      }
     // console.log(this.debit_total_f, this.credit_total_f);
      this.deviation_f = this.debit_total_f - this.credit_total_f;
      return this.deviation_f;
    }
  }

  // checkForPayableComponent(citem, param) {
  //   //console.log('djfd');
  //   this.currentReceiptData = {};
  //   var flag = 0;
  //   if( param['receipt_data'] && citem ) {
  //    console.log('in--',  citem, param);
  //     for(var i=0; i< param['receipt_data'].length;i++) {
  //     //  console.log(param['receipt_data'][i]['tb_name'], citem['coa_acc_name']);
  //       if( param['receipt_data'][i]['tb_name'] === citem['coa_acc_name'] ) {
  //         this.currentReceiptData = param['receipt_data'][i];
  //          console.log('in1---', i, this.currentReceiptData);
  //         flag = 1;
  //         break;
  //       }
  //     }
  //   }
  //   return flag;
  // }


  closeDialog() {
		this.dialogRef.close();
  }
  getTwoDecimalValue(value) {
    // console.log('value',value);
    if (value && value != 0 && value != '') {
      return Number.parseFloat(value.toFixed(2));
    } else {
      return value;
    }

  }

  openVoucherModal(value){
    console.log('value--', value);
		const dialogRef = this.dialog.open(VoucherModalComponent, {
			height: '50vh',
			width: '100vh',
			data: {
				title: value.vc_type + ' voucher',
				vc_id: value.vc_id
			}
		});
	}


}
