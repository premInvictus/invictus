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
  selector: 'app-invoice-modal',
  templateUrl: './invoice-modal.component.html',
  styleUrls: ['./invoice-modal.component.css']
})
export class InvoiceModalComponent implements OnInit {
  invoiceCreationForm:FormGroup;
  paramForm: FormGroup;
  voucherFormGroupArray: any[] = [];
  feePeriod:any[]=[];
  sessionArray:any[]=[];
  totalDebit=0;
  arrayService:any[]=[];
  feeMonthArray:any=[];
  constructor(
    public dialogRef: MatDialogRef<InvoiceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb:FormBuilder,
    private adminService:AdminService,
    private acsetupService:AcsetupService,
    private notif:NotificationService,
    private common:CommonAPIService
  ) { }

  ngOnInit() {
    console.log('data',this.data);
    this.voucherFormGroupArray = [];
    this.buildForm();
    this.getServiceAll();
    this.getSession();
    this.getFeeMonths();
    if(this.data.edit && this.data.item){
      this.invoiceCreationForm.patchValue({
        billing_id: this.data.item.billing_id,
        billing_school_id: this.data.item.billing_school_id,
        billing_month: this.data.item.billing_month.split(','),
        billing_date: this.data.item.billing_date,
        billing_duedate: this.data.item.billing_duedate,
        billing_ses:this.data.item.billing_ses
      });
      this.data.item.billing_item.forEach(element => {
        this.paramForm = this.fb.group({
          service_id: element.bi_service_id,
          service_charge: element.bi_service_charge,
          naration: element.bi_naration,
        });
        this.voucherFormGroupArray.push(this.paramForm);
      });
      this.calculateDebitTotal();
    }
  }
  buildForm() {
		this.invoiceCreationForm = this.fb.group({
			billing_id: '',
			billing_school_id: this.data.school_id,
			billing_month: [],
			billing_date: '',
      billing_duedate: '',
      billing_ses:''
    });
    if(!this.data.edit){
      this.addVoucher();
    }
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
  addVoucher() {
		this.paramForm = this.fb.group({
			service_id: '',
			service_charge: '',
			naration: '',
		});
		this.voucherFormGroupArray.push(this.paramForm);
  }
  deleteVoucherEntry(i) {
		this.voucherFormGroupArray.splice(i, 1);
		this.calculateDebitTotal();
  }
  calculateDebitTotal() {
		this.totalDebit = 0;
		for (let i = 0; i < this.voucherFormGroupArray.length; i++) {
			this.totalDebit = this.totalDebit + Number(this.voucherFormGroupArray[i].value.service_charge);
		}

  }
  

  getServiceAll() {
		this.arrayService = [];
		this.acsetupService.getService({status:'1'}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.arrayService = result.data;
				}
			}
		);
  }
  submitInvoice(){
    let param:any={};
    const billing_item:any[]=[];
    if(this.invoiceCreationForm.valid){
      if(this.voucherFormGroupArray.length > 0){
        this.voucherFormGroupArray.forEach((element:FormGroup) => {
          billing_item.push(element.value);
        });       
      }
      let billing_date: any;
      if (!moment.isMoment(this.invoiceCreationForm.value.billing_date)) {
        billing_date = moment(this.invoiceCreationForm.value.billing_date);
      } else {
        billing_date = (this.invoiceCreationForm.value.billing_date);
      }
      let billing_duedate: any;
      if (!moment.isMoment(this.invoiceCreationForm.value.billing_duedate)) {
        billing_duedate = moment(this.invoiceCreationForm.value.billing_duedate);
      } else {
        billing_duedate = (this.invoiceCreationForm.value.billing_duedate);
      }
      param = this.invoiceCreationForm.value;
      param.billing_duedate = billing_duedate.format("YYYY-MM-DD");
      param.billing_date = billing_date.format("YYYY-MM-DD");
      param.billing_item = billing_item;
      if(this.data.edit && this.data.item){
        this.acsetupService.updateBilling(param).subscribe(
          (result: any) => {
            if (result && result.status === 'ok') {
              this.notif.showSuccessErrorMessage(result.data,'success');
              this.closeDialog({status:'ok'})
            } else {
              this.notif.showSuccessErrorMessage(result.data,'error');
            }
          }
        );
      } else {
        this.acsetupService.insertBilling(param).subscribe(
          (result: any) => {
            if (result && result.status === 'ok') {
              this.notif.showSuccessErrorMessage(result.data,'success');
              this.closeDialog({status:'ok'})
            } else {
              this.notif.showSuccessErrorMessage(result.data,'error');
            }
          }
        );
      }
      
    } else{
      this.notif.showSuccessErrorMessage('Please fill all required field','error');
    }
  }
  resetInvoice(){
    
  }
  updateInvoice(){
    
  }
  cancelInvoice(){
    
  }
  closeDialog(value=null){
    if(value){
      this.dialogRef.close(value);
    } else {
      this.dialogRef.close();
    }
    
  }
  getFeeMonths() {
		this.feeMonthArray = [];
		this.acsetupService.getFeeMonths({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
        console.log(result.data);
        result.data.forEach(element => {
          element.fm_id = Number(element.fm_id);
          this.feeMonthArray.push(element);
        });
				console.log('this.feeMonthArray',this.feeMonthArray);
			}
		});
	}

}
