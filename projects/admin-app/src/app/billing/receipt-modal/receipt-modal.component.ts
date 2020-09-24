import { Component, OnInit, Output, EventEmitter, ViewChild,Inject } from '@angular/core';
import { MatDialogRef, MatDialog ,MAT_DIALOG_DATA, throwMatDialogContentAlreadyAttachedError} from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AdminService } from '../../admin-user-type/admin/services/admin.service';
import { AcsetupService } from '../../acsetup/service/acsetup.service';
import { NotificationService } from 'projects/axiom/src/app/_services/notification.service';
import { CommonAPIService } from 'src/app/_services/index';
import * as moment from 'moment';

@Component({
  selector: 'app-receipt-modal',
  templateUrl: './receipt-modal.component.html',
  styleUrls: ['./receipt-modal.component.css']
})
export class ReceiptModalComponent implements OnInit {

  invoiceCreationForm:FormGroup;
  paramForm: FormGroup;
  feePeriod:any[]=[];
  sessionArray:any[]=[];
  totalDebit=0;
  payModes: any[] = [];
  allBanks:any[]=[];
  constructor(
    public dialogRef: MatDialogRef<ReceiptModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb:FormBuilder,
    private adminService:AdminService,
    private acsetupService:AcsetupService,
    private notif:NotificationService,
    private common:CommonAPIService
  ) { }

  ngOnInit() {
    console.log('data',this.data);
    this.buildForm();
    this.getPayModes();
    this.getAllBanks();
    this.getSession();
  }
  buildForm() {
		this.invoiceCreationForm = this.fb.group({
      'br_date':'',
      'br_amount':this.data.item.billing_amount,
      'br_pay_id':'',
      'br_cheque_no':'',
      'br_bnk_id':'',
      'br_branch':'',
      'br_cheque_date':'',
      'br_remark':'',
      'br_transaction_id':'',
    });
  }
  getAllBanks() {
		this.allBanks = [];
		this.acsetupService.getBanksAll({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.allBanks = result.data;
			}
		});
  }
  getPayModes() {
		this.acsetupService.getPaymentMode({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.payModes = result.data;
			}
		});
	}
  getSession() {
		this.common.getSession().subscribe((result2: any) => {
			if (result2.status === 'ok') {
        this.sessionArray = result2.data;
        if(!this.data.edit)
        this.invoiceCreationForm.patchValue({
          billing_ses:this.sessionArray[this.sessionArray.length-1].ses_id
        })
			}
		});
  }
  
  submitInvoice(){
    let param:any={};
    if(this.invoiceCreationForm.valid){
      let br_date: any;
      if (!moment.isMoment(this.invoiceCreationForm.value.br_date)) {
        br_date = moment(this.invoiceCreationForm.value.br_date);
      } else {
        br_date = (this.invoiceCreationForm.value.br_date);
      }
      
      
      param = this.invoiceCreationForm.value;
      param.br_date = br_date.format("YYYY-MM-DD");
      param.br_billing_id = this.data.item.billing_id;
      let br_cheque_date: any;
      if(this.invoiceCreationForm.value.br_cheque_date){
        if (!moment.isMoment(this.invoiceCreationForm.value.br_cheque_date)) {
          br_cheque_date = moment(this.invoiceCreationForm.value.br_cheque_date);
        } else {
          br_cheque_date = (this.invoiceCreationForm.value.br_cheque_date);
        }
        param.br_cheque_date = br_cheque_date.format("YYYY-MM-DD");
      }
      this.acsetupService.insertReceipt(param).subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.notif.showSuccessErrorMessage(result.data,'success');
            this.closeDialog({status:'ok'})
          } else {
            this.notif.showSuccessErrorMessage(result.data,'error');
          }
        });
      
    } else{
      this.notif.showSuccessErrorMessage('Please fill all required field','error');
    }
  }
  closeDialog(value=null){
    if(value){
      this.dialogRef.close(value);
    } else {
      this.dialogRef.close();
    }
    
  }

}
