
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './model';
import {SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { TitleCasePipe } from '@angular/common';
import { SisService, CommonAPIService, FaService } from '../../_services/index';
import { LedgerEntryModelComponent } from '../../fa-shared/ledger-entry-model/ledger-entry-model.component';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.scss']
})
export class TrialBalanceComponent implements OnInit {
	accountForm:FormGroup;
  accountsArray:any[] = [];
  ledgerArray:any[] = [];
  tableDivFlag = false;
  feeMonthArray:any[] = [];
  prevIncomeExpenditureArray:any[] = [];
  constructor(
		private fbuild: FormBuilder,
		private sisService: SisService,
		private commonAPIService: CommonAPIService,
		private faService:FaService,
    private dialog: MatDialog
  ) { }
  

  ngOnInit(){
    this.buildForm();
    this.getAccounts();
    this.getFeeMonths();
  }

  buildForm() {
    this.accountForm = this.fbuild.group({
		tb_month:''
    })
  }

  getFeeMonths() {
		this.feeMonthArray = [];
		this.faService.getFeeMonths({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
			//	console.log(result.data);
        this.feeMonthArray = result.data;
        this.feeMonthArray.push({
          fm_id:'consolidate',
          fm_name:'Consolidated'
        })
			}
		});
	}
  getAccounts() {
		this.faService.getAllChartsOfAccount({}).subscribe((data:any)=>{
			if(data) {
        this.accountsArray = data;
			} else {
				this.accountsArray = [];
			}
		})
  }

  getTrialBalance(){
    if(this.accountForm.valid){
      var inputJson = {
        monthId : this.accountForm.value.tb_month && (this.accountForm.value.tb_month != 'consolidate') ? Number(this.accountForm.value.tb_month) : 'consolidate',
        display_section: 'trialBalance'
      };
      
      this.faService.getTrialBalance(inputJson).subscribe((data:any)=>{
        if(data) {
          
          var receipt_data = data.receipt_data;
          var receiptArr = [];
          for(var j=0; j<receipt_data.length; j++) {
            receiptArr.push(receipt_data[j]['tb_name']);
          }
          if (data.ledger_data && data.ledger_data.length > 0) {
          for (var i =0;  i < data.ledger_data.length; i++) {
            if (data.ledger_data[i]['coa_dependencies'] && receiptArr.indexOf(data.ledger_data[i]['coa_dependencies'][0]['dependency_name'] ) > -1) {
              var index = receiptArr.indexOf(data.ledger_data[i]['coa_dependencies'][0]['dependency_name'] );

              var opening_balance = 0;
              if (data.ledger_data[i]['debit_data'] && data.ledger_data[i]['debit_data'][0] && data.ledger_data[i]['debit_data'][0]['vc_account_type'] === 'opening_balance') {
                opening_balance = data.ledger_data[i]['debit_data'][0]['vc_account_type']['vc_debit'];
              }
             
              var receipt_value = receipt_data[index]['receipt_amt'];
              if (receipt_value > 0) {
                var iJson:any = {
                  "vc_account_type" :  data.ledger_data[i]['coa_dependencies'][0]['dependency_name'],
                      "vc_credit" : receipt_value + opening_balance
                                          
                }
                data.ledger_data[i]['debit_data'].push(iJson);
                data.ledger_data[i]['credit_data'].push({});
              }
              if (receipt_value < 0) {
                var iJson:any = {
                  "vc_account_type" :  data.ledger_data[i]['coa_dependencies'][0]['dependency_name'],
                      "vc_debit" : receipt_value + opening_balance
                                          
                }
                data.ledger_data[i]['credit_data'].push(iJson);
                data.ledger_data[i]['debit_data'].push({});
              }
            }
            if(i===data.ledger_data.length-1 ) {
              this.ledgerArray = data;
              this.tableDivFlag = true;
            }
          }
        } else {
          this.ledgerArray  = data;
          this.tableDivFlag = true;
        }
        
          
         // console.log('this.ledgerArray--', this.ledgerArray);

          
          
        } else {
          
        }
      })
    }
  }

  getPreviousIncomeAndExenditure() {
    this.prevIncomeExpenditureArray=[];
    if (this.accountForm.valid && this.accountForm.value.tb_month !='consolidate') {
      this.tableDivFlag = false;
      this.ledgerArray = [];

      let prevMonth = 0;
      if (Number(this.accountForm.value.tb_month) == 1 || Number(this.accountForm.value.tb_month) == 2 || Number(this.accountForm.value.tb_month) == 3) {
        if (Number(this.accountForm.value.tb_month) == 1) {
          prevMonth = 12
        } else {
          prevMonth = Number(this.accountForm.value.tb_month) -1;
        }
      } else if (Number(this.accountForm.value.tb_month) > 4 && Number(this.accountForm.value.tb_month) <= 12) {
        prevMonth = Number(this.accountForm.value.tb_month) -1;
      }
      console.log('prevMonth--',prevMonth)
      var inputJson = {
        monthId: prevMonth ,
        display_section: 'incomeExpenditure'
      };

      this.faService.getTrialBalance(inputJson).subscribe((data: any) => {
        if (data) {

          var receipt_data = data.receipt_data;
          var receiptArr = [];
          for (var j = 0; j < receipt_data.length; j++) {
            receiptArr.push(receipt_data[j]['tb_name']);
          }
          if (data.ledger_data.length > 0) {
            for (var i = 0; i < data.ledger_data.length; i++) {
              if (data.ledger_data[i]['coa_dependencies'] && receiptArr.indexOf(data.ledger_data[i]['coa_dependencies'][0]['dependency_name']) > -1) {
                var index = receiptArr.indexOf(data.ledger_data[i]['coa_dependencies'][0]['dependency_name']);

                var opening_balance = 0;
                if (data.ledger_data[i]['debit_data'] && data.ledger_data[i]['debit_data'][0] && data.ledger_data[i]['debit_data'][0]['vc_account_type'] === 'opening_balance') {
                  opening_balance = data.ledger_data[i]['debit_data'][0]['vc_account_type']['vc_debit'];
                }

                var receipt_value = receipt_data[index]['receipt_amt'];
                if (receipt_value > 0) {
                  var iJson: any = {
                    "vc_account_type": data.ledger_data[i]['coa_dependencies'][0]['dependency_name'],
                    "vc_credit": receipt_value + opening_balance

                  }
                  data.ledger_data[i]['debit_data'].push(iJson);
                  data.ledger_data[i]['credit_data'].push({});
                }
                if (receipt_value < 0) {
                  var iJson: any = {
                    "vc_account_type": data.ledger_data[i]['coa_dependencies'][0]['dependency_name'],
                    "vc_debit": receipt_value + opening_balance

                  }
                  data.ledger_data[i]['credit_data'].push(iJson);
                  data.ledger_data[i]['debit_data'].push({});
                }
              }
              if (i === data.ledger_data.length - 1) {
                this.prevIncomeExpenditureArray = data;
                
              }
            }
          } else {
            this.prevIncomeExpenditureArray = data;
            
          }

          // console.log('this.ledgerArray--', this.ledgerArray);



        } else {
          
        }
      })
    }
  }

  


  openLedgerModal(value) {
		const dialogRef = this.dialog.open(LedgerEntryModelComponent, {
			height: '520px',
			width: '800px',
			data: {
        title: 'Create Account'
      }
		});
		dialogRef.afterClosed().subscribe(dresult => {
		//	console.log(dresult);
			this.getAccounts();
		});
  }

}