import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { DatePipe } from '@angular/common';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';

@Component({
  selector: 'add-subscription-dialog',
  templateUrl: './add-subscription-dialog.component.html',
  styleUrls: ['./add-subscription-dialog.component.css'],
})
export class AddSubscriptionDialog implements OnInit {
  subscriptionForm: FormGroup;
  

  constructor(
        @Inject(MAT_DIALOG_DATA) private dialogData: any,
         private fbuild: FormBuilder,
         private common: CommonAPIService, 
         private erpCommonService : ErpCommonService,
         public dialogRef: MatDialogRef<AddSubscriptionDialog>) {
          
         }

  ngOnInit() {
    console.log('dialogData', this.dialogData)
    this.buildForm();
  }

  buildForm() {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();		
    this.subscriptionForm = this.fbuild.group({
      subscription_id: this.dialogData.subscription_id ? this.dialogData.subscription_id : '',
      subscription_name : this.dialogData.subscription_name ? this.dialogData.subscription_name : '',
      subscription_type : this.dialogData.subscription_type ? this.dialogData.subscription_type : '',
      subscription_frequency: this.dialogData.subscription_frequency ? this.dialogData.subscription_frequency : '',
      subscription_start_date: this.dialogData.subscription_start_date ? this.dialogData.subscription_start_date : new Date(y, m, 1),
      subscription_vendor_id: this.dialogData.subscription_vendor_id ? this.dialogData.subscription_vendor_id : '',
      subscription_end_date: this.dialogData.subscription_end_date ? this.dialogData.subscription_end_date : new Date(),
      subscription_vendor_name: '',
      subscription_vendor_contact: '',
      subscription_vendor_email: '',
      subscription_status: this.dialogData.subscription_status ? this.dialogData.subscription_status : '1',
      showButtonStatus: this.dialogData.showButtonStatus
    });
    
    if (this.dialogData.subscription_id) {
      this.getVendorDetail({target:{value : this.dialogData.subscription_vendor_id}});
    } else {
      this.subscriptionForm.patchValue({
        subscription_vendor_name: '',
        subscription_vendor_contact: '',
        subscription_vendor_email: '',
      })
    }
    console.log('this.subscriptionForm', this.subscriptionForm);
  }


  onNoClick() {
    this.dialogRef.close();
  }

  getVendorDetail(event) {
    console.log('event--', event);
    if (event.target && event.target.value !== '') {
      console.log("fdj");
      this.erpCommonService.getVendor({
        ven_id: Number(event.target.value)
      }).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          console.log("in");
          let vendorDetail: any;
          vendorDetail = res.data[0];
          this.subscriptionForm.patchValue({
            subscription_vendor_name: vendorDetail.ven_name,
            subscription_vendor_contact: vendorDetail.ven_contact,
            subscription_vendor_email: vendorDetail.ven_email,
          })
        } else {
          console.log("out");
        }
      })
    }
  }

  save() {
    if (this.subscriptionForm.valid) {
      const inputJson = {
        subscription_name : this.subscriptionForm.value.subscription_name,
        subscription_type : this.subscriptionForm.value.subscription_type,
        subscription_frequency: this.subscriptionForm.value.subscription_frequency,
        subscription_start_date: this.subscriptionForm.value.subscription_start_date,
        subscription_vendor_id: this.subscriptionForm.value.subscription_vendor_id,
        subscription_vendor_name: this.subscriptionForm.value.subscription_vendor_name,
        subscription_end_date: this.subscriptionForm.value.subscription_end_date,
        subscription_status: this.subscriptionForm.value.subscription_status
      };
  
      this.erpCommonService.insertSubscription(inputJson).subscribe((res: any) => {
        if (res && res.status == 'ok') {
          this.common.showSuccessErrorMessage(res.message, res.status);
          this.subscriptionForm.reset();
          this.dialogRef.close();
        } else {
          this.common.showSuccessErrorMessage(res.message, res.status);
        }
      });
    } else {
      this.common.showSuccessErrorMessage('Please Fill All Required Fields', 'error');
    }
    
  }

  update() {
    const inputJson = {
      subscription_id : this.subscriptionForm.value.subscription_id,
      subscription_name : this.subscriptionForm.value.subscription_name,
      subscription_type : this.subscriptionForm.value.subscription_type,
      subscription_frequency: this.subscriptionForm.value.subscription_frequency,
      subscription_start_date: this.subscriptionForm.value.subscription_start_date,
      subscription_vendor_id: this.subscriptionForm.value.subscription_vendor_id,
      subscription_vendor_name: this.subscriptionForm.value.subscription_vendor_name,
      subscription_end_date: this.subscriptionForm.value.subscription_end_date,
      subscription_status: this.subscriptionForm.value.subscription_status
    };

    this.erpCommonService.updateSubscription(inputJson).subscribe((res: any) => {
      if (res && res.status == 'ok') {
        this.common.showSuccessErrorMessage(res.message, res.status);
        this.subscriptionForm.reset();
        this.dialogRef.close();
      } else {
        this.common.showSuccessErrorMessage(res.message, res.status);
      }
    });
  }

  reset() {
    this.subscriptionForm.reset();
  }


}