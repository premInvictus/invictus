import { Component, OnInit, Output, EventEmitter, ViewChild,Inject } from '@angular/core';
import { MatDialogRef, MatDialog ,MAT_DIALOG_DATA} from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AdminService } from '../../admin-user-type/admin/services/admin.service';
import { AcsetupService } from '../../acsetup/service/acsetup.service';
import { NotificationService } from 'projects/axiom/src/app/_services/notification.service';
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
  totalDebit=0;
  arrayService:any[]=[];
  monthArray: any[] = [
    {id:'1',name:'Jan'},
    {id:'2',name:'Feb'},
    {id:'3',name:'Mar'},
    {id:'4',name:'Apr'},
    {id:'5',name:'May'},
    {id:'6',name:'Jun'},
    {id:'7',name:'Jul'},
    {id:'8',name:'Aug'},
    {id:'9',name:'Sep'},
    {id:'10',name:'Oct'},
    {id:'111',name:'Nov'},
    {id:'12',name:'Dec'},
  ];
  constructor(
    public dialogRef: MatDialogRef<InvoiceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb:FormBuilder,
    private adminService:AdminService,
    private acsetupService:AcsetupService,
    private notif:NotificationService
  ) { }

  ngOnInit() {
    console.log('data',this.data);
    this.buildForm();
    this.getServiceAll();
  }
  buildForm() {
		this.invoiceCreationForm = this.fb.group({
			billing_id: '',
			billing_school_id: this.data.school_id,
			billing_month: [],
			billing_date: '',
			billing_duedate: '',
    });
    if(!this.data.edit){
      this.addVoucher();
    }
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
      this.acsetupService.insertBilling(param).subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.notif.showSuccessErrorMessage(result.data,'success');
          } else {
            this.notif.showSuccessErrorMessage(result.data,'error');
          }
        }
      );
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
  closeDialog(){
    this.dialogRef.close();
  }

}
