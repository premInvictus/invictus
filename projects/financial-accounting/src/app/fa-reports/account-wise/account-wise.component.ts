import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { TitleCasePipe } from '@angular/common';
import { SisService, CommonAPIService, FaService } from '../../_services/index';
import {Element} from './model'

@Component({
  selector: 'app-account-wise',
  templateUrl: './account-wise.component.html',
  styleUrls: ['./account-wise.component.css']
})
export class AccountWiseComponent implements OnInit {
  paramForm:FormGroup;
  accountsArray:any[] = [];
  ledgerArray:any[] = [];
  feeMonthArray:any[] = [];
  tableDivFlag = false;
	ELEMENT_DATA: Element[];
	displayedColumns: string[] = ['vc_date','vc_account','vc_amount'];
  dataSource = new MatTableDataSource<Element>();
  @ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
  constructor(
    private fbuild: FormBuilder,
		private sisService: SisService,
		private commonAPIService: CommonAPIService,
		private faService:FaService,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getFeeMonths();
    this.getAccounts();
  }
  buildForm() {
    this.paramForm = this.fbuild.group({
      coa_id:'',
      vc_account_type:'',
      monthId:'',
      type: 'credit'
    })
  }
  getAccounts(event = null) {
		console.log('event',event);
		if(event){
			console.log('key',event.keyCode);
			if(event.keyCode != 38 && event.keyCode != 40 ){
				let param: any = {};
				if(event) {
					param.coa_acc_name = event.target.value
				}
				this.faService.getAllChartsOfAccount(param).subscribe((data:any)=>{
					if(data) {
						this.accountsArray = data;
					} else {
						this.accountsArray = [];
					}
				})
			}
		} else {
			let param: any = {};
			if(event) {
				param.coa_acc_name = event.target.value
			}
			this.faService.getAllChartsOfAccount(param).subscribe((data:any)=>{
				if(data) {
					this.accountsArray = data;
				} else {
					this.accountsArray = [];
				}
			})	
		}
  }
  setaccount(item) {
		this.paramForm.patchValue({
      coa_id: item.coa_id,
      vc_account_type: item.coa_acc_name
		});
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
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    if(this.paramForm.valid){
      console.log(this.paramForm.value);
      var inputJson = {
        monthId : this.paramForm.value.monthId && (this.paramForm.value.monthId != 'consolidate') ? Number(this.paramForm.value.monthId) : 'consolidate'
      };
      if (this.paramForm.value.coa_id) {
        inputJson['coa_id'] = [this.paramForm.value.coa_id ? this.paramForm.value.coa_id : null]
      }
      this.faService.getTrialBalance(inputJson).subscribe((data:any)=>{
        this.tableDivFlag = true;
        if(data) { 
          const tempdata = data.ledger_data.find( e => e.coa_id == this.paramForm.value.coa_id);
          console.log(tempdata);
          // const renderdata = this.paramForm.value.type == 'credit' ? tempdata.credit_data : tempdata.debit_data;
          if(this.paramForm.value.type == 'credit'){
            const renderdata = tempdata.credit_data;
            for (const item of renderdata) {
              const element = {
                vc_date: item.vc_date,
                vc_account: item.vc_account_type,
                vc_amount:item.vc_debit,
              };
              this.ELEMENT_DATA.push(element);              
            }
          } else {
            const renderdata = tempdata.debit_data;
            for (const item of renderdata) {
              const element = {
                vc_date: item.vc_date,
                vc_account: item.vc_account_type,
                vc_amount:item.vc_credit,
              };
              this.ELEMENT_DATA.push(element);              
            }
          }
          this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator;
          if (this.sort) {
            this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
            this.dataSource.sort = this.sort;
          }
        } else {
          
        }
      })
    }
  }

}
