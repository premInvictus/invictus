
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Element } from './model';
import {SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { TitleCasePipe } from '@angular/common';
import { SisService, CommonAPIService, FaService } from '../../_services/index';
import { ChartOfAccountsCreateComponent } from '../../fa-shared/chart-of-accounts-create/chart-of-accounts-create.component';

import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent implements OnInit {
  accountForm:FormGroup;
  accountsArray:any[] = [];
  ledgerArray:any[] = [];
  feeMonthArray:any[] = [];
  tableDivFlag = false;
  filteredList: any[] = [];
  
  public bankMultiFilterCtrl: FormControl = new FormControl();
  private _onDestroy = new Subject<void>();
  public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  constructor(
		private fbuild: FormBuilder,
		private sisService: SisService,
		private commonAPIService: CommonAPIService,
		private faService:FaService,
    private dialog: MatDialog
  ) { }
  

  ngOnInit(){
    this.buildForm();
    this.getFeeMonths();
    this.getAccounts();
    //this.getLedger();
    this.bankMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanksMulti();
      });
    
  }
  // ngAfterViewInit() {
  //   this.setInitialValue();
  // }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  // private setInitialValue() {
  //   this.filteredBanks
  //     .pipe(take(1), takeUntil(this._onDestroy))
  //     .subscribe(() => {          
  //       // setting the compareWith property to a comparison function 
  //       // triggers initializing the selection according to the initial value of 
  //       // the form control (i.e. _initializeSelection())
  //       // this needs to be done after the filteredBanks are loaded initially 
  //       // and after the mat-option elements are available
  //       this.singleSelect.compareWith = (a: Bank, b: Bank) => a.id === b.id;
  //     });
  // }

  private filterBanksMulti() {
    if (!this.filteredList) {
      return;
    }
    // get the search keyword
    let search = this.bankMultiFilterCtrl.value;
    if (!search) {
      // this.filteredBanksMulti.next(this.accountsArray.slice());
      this.filteredList.slice()
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    // this.filteredBanksMulti.next(
    //   this.accountsArray.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    // );
   // console.log(search);
   // console.log(this.filteredList.filter(item => item.coa_acc_name.toLowerCase().indexOf(search) > -1));
    this.accountsArray = this.filteredList.filter(item => item.coa_acc_name.toLowerCase().indexOf(search) > -1)
  }

  buildForm() {
    this.accountForm = this.fbuild.group({
      coa_id:'',
      monthId:''
    })
  }

  

  getAccounts() {
		this.faService.getAllChartsOfAccount({}).subscribe((data:any)=>{
			if(data) {
        this.accountsArray = data;
        this.filteredList = data;
			} else {
				this.accountsArray = [];
			}
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

  getLedger(){
    if(this.accountForm.valid){
      var inputJson = {
        monthId : this.accountForm.value.monthId && (this.accountForm.value.monthId != 'consolidate') ? Number(this.accountForm.value.monthId) : 'consolidate'
      };
      if (this.accountForm.value.coa_id) {
        inputJson['coa_id'] = this.accountForm.value.coa_id ? this.accountForm.value.coa_id : null
      }
      this.faService.getTrialBalance(inputJson).subscribe((data:any)=>{
        if(data) {
          
          var receipt_data = data.receipt_data;
          var receiptArr = [];
          if (receipt_data) {
          for(var j=0; j<receipt_data.length; j++) {
            receiptArr.push(receipt_data[j]['tb_name']);
          }}
          for(var i=0; i<data.ledger_data.length;i++) {
            
            for(var j=0; j<data.ledger_data[i]['debit_data'].length;j++) {
              if (data.ledger_data[i]['debit_data'][j]['vc_account_type'] === 'Opening Balance') {
                var a = data.ledger_data[i]['debit_data'].splice(j,1);   // removes the item
                data.ledger_data[i]['debit_data'].unshift(a[0]);         // adds it back to the beginning
                break;
              }
            }
            for(var j=0; j<data.ledger_data[i]['credit_data'].length;j++) {
              if (data.ledger_data[i]['credit_data'][j]['vc_account_type'] === 'Opening Balance') {
                var a = data.ledger_data[i]['credit_data'].splice(j,1);   // removes the item
                data.ledger_data[i]['credit_data'].unshift(a[0]);         // adds it back to the beginning
                break;
              }
            }
          }
          
          for (var i =0;  i < data.ledger_data.length; i++) {
            if (data.ledger_data[i]['coa_dependencies'] && receiptArr.indexOf(data.ledger_data[i]['coa_dependencies'][0]['dependency_name'] ) > -1) {
              var index = receiptArr.indexOf(data.ledger_data[i]['coa_dependencies'][0]['dependency_name'] );

              var opening_balance = 0;
              if (data.ledger_data[i]['debit_data'] && data.ledger_data[i]['debit_data'][0] && data.ledger_data[i]['debit_data'][0]['vc_account_type'] === 'opening_balance') {
                opening_balance = data.ledger_data[i]['debit_data'][0]['vc_account_type']['vc_debit'];
              }
             
              // var receipt_value = receipt_data[index]['receipt_amt'];
              // if (receipt_value > 0) {
              //   var iJson:any = {
              //     "vc_account_type" :  data.ledger_data[i]['coa_dependencies'][0]['dependency_name'],
              //         "vc_credit" : receipt_value+opening_balance
                                          
              //   }
              //   data.ledger_data[i]['debit_data'].push(iJson);
              //   data.ledger_data[i]['credit_data'].push({});
              // }
              // if (receipt_value < 0) {
              //   var iJson:any = {
              //     "vc_account_type" :  data.ledger_data[i]['coa_dependencies'][0]['dependency_name'],
              //         "vc_debit" : receipt_value+opening_balance
                                          
              //   }
              //   data.ledger_data[i]['credit_data'].push(iJson);
              //   data.ledger_data[i]['debit_data'].push({});
              // }
            }
            if(i===data.ledger_data.length -1 ) {
              this.ledgerArray = data;
              this.tableDivFlag = true;
            }
          }

          
         // console.log('this.ledgerArray--', this.ledgerArray);

          
          
        } else {
          
        }
      })
    }
  }
  applyfilter(event){
   // console.log(event.target.value);
    this.accountsArray = this.search(event.target.value);
  }
  search(value: string) { 
    let filter = value.toLowerCase();
    return this.filteredList.filter(item => item.coa_acc_name.toLowerCase().startsWith(filter));
  }

}