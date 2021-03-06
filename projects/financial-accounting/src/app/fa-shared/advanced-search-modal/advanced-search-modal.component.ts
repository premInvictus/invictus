import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService,FaService } from '../../_services/index';
import { ErpCommonService } from 'src/app/_services';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-advanced-search-modal',
  templateUrl: './advanced-search-modal.component.html',
  styleUrls: ['./advanced-search-modal.component.css']
})
export class AdvancedSearchModalComponent implements OnInit {
  dialogRef: MatDialogRef<AdvancedSearchModalComponent>;
  @ViewChild('searchModal') searchModal;
  @Output() searchOk = new EventEmitter;
  @Output() searchCancel = new EventEmitter;
  generalFilterForm: FormGroup;
  currentUser: any = {};
  today=new Date();
  accountsArray:any[]=[];
  voucherArray:any[]=['Journal','Contra','Cash Payment','Bank Payment','Receipt','Credit Note','Debit Note','Purchase','Sale'];
  operatorArray:any[]=[
    {id:'$eq',value:'='},
    {id:'$gte',value:'>='},
    {id:'$lte',value:'<='},
    ];
  constructor(private dialog: MatDialog, private fbuild: FormBuilder,
    private common: ErpCommonService,
    private commonAPIService: CommonAPIService,
    private faService:FaService
    ) { }

 
  ngOnInit() {
  }
  openModal(data) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.dialogRef = this.dialog.open(this.searchModal, {
      width: '750px',
    });
    this.buildForm();
  }
  
  
  getOperatorValue(id){
    return this.operatorArray.find(e => e.id == id).value;
  }
  buildForm() {
    this.generalFilterForm = this.fbuild.group({
      from_date:'',
      to_date:'',
      vc_type:'',
      vc_account_type_id:'',
      vc_account_type:'',
      operator:'',
      vc_debit:''
    });
    const param=this.commonAPIService.state$['filter'] ? this.commonAPIService.state$['filter'] : {};
    if(param) {
      Object.keys(param).forEach(key => {
        if(param[key]) {
          this.generalFilterForm.get(key).patchValue(param[key]);
        }
      });
      // this.generalFilterForm.patchValue({
      //   from_date:param.from_date,
      //   to_date:param.to_date,
      //   vc_type:param.vc_type,
      //   vc_account_type_id:param.vc_account_type_id,
      //   vc_account_type:param.vc_account_type,
      //   operator:param.operator,
      //   vc_debit:param.vc_debit
      // });
    }
  }
  setaccount(item, i) {
		this.generalFilterForm.patchValue({
			vc_account_type_id: item.coa_id,
			vc_account_type: item.coa_acc_name
		});
  }
  getAccounts(event = null) {
		if (event) {
			console.log('key', event.keyCode);
			if (event.keyCode != 38 && event.keyCode != 40) {
        let param: any = {};
        if (event) {
					param.coa_acc_name = event.target.value
				}
				this.faService.getAllChartsOfAccount(param).subscribe((data: any) => {
					if (data) {
						this.accountsArray = data;
					} else {
						this.accountsArray = [];
					}
				})
			}
		}
	}
  closeDialog() {
    this.dialogRef.close();
    this.searchCancel.emit();
  }
  submit() {
    if (this.generalFilterForm.value.from_date) {
      this.generalFilterForm.patchValue({
        'from_date': new DatePipe('en-in').transform(this.generalFilterForm.value.from_date, 'yyyy-MM-dd'),
      });
    }

    if (this.generalFilterForm.value.to_date) {
      this.generalFilterForm.patchValue({
        'to_date': new DatePipe('en-in').transform(this.generalFilterForm.value.to_date, 'yyyy-MM-dd'),
      });
    }
    this.searchOk.emit(this.generalFilterForm.value);
    let filter_text_arr:any[]=[];
    Object.keys(this.generalFilterForm.value).forEach(key => {
      if(this.generalFilterForm.value[key]) {
        if(key == 'from_date') {
          filter_text_arr.push('From: '+new DatePipe('en-in').transform(this.generalFilterForm.value[key], 'd-MMM-y'));
        }
        if(key == 'to_date') {
          filter_text_arr.push('To: '+new DatePipe('en-in').transform(this.generalFilterForm.value[key], 'd-MMM-y'));
        }
        if(key == 'vc_type') {
          filter_text_arr.push('Voucher: '+this.generalFilterForm.value[key]);
        }
        if(key == 'vc_account_type') {
          filter_text_arr.push('Account: '+this.generalFilterForm.value[key]);
        }
        if(key == 'operator') {
          filter_text_arr.push('Amount: '+this.getOperatorValue(this.generalFilterForm.value[key]) + ' ' + this.generalFilterForm.value['vc_debit'] );
        }
      }
    });
    this.commonAPIService.state$['filterText']=filter_text_arr;
    this.closeDialog();
  }
  cancel() {
    this.closeDialog();
  }
  reset(){
    this.generalFilterForm.reset();
    this.commonAPIService.state$['filter']={};
  }
  getFromDate(value) {
    this.generalFilterForm.patchValue({
      from_date: new DatePipe('en-in').transform(value, 'yyyy-MM-dd')
    });
  }
  getToDate(value) {
    this.generalFilterForm.patchValue({
      to_date: new DatePipe('en-in').transform(value, 'yyyy-MM-dd')
    });
  }

}
