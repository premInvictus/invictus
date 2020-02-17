import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { DatePipe } from '@angular/common';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { ConfirmValidParentMatcher } from '../../../ConfirmValidParentMatcher';

@Component({
  selector: 'add-vendor-dialog',
  templateUrl: './add-vendor-dialog.component.html',
  styleUrls: ['./add-vendor-dialog.component.css'],
})
export class AddVendorDialog implements OnInit {
  confirmValidParentMatcher = new ConfirmValidParentMatcher();
  vendorForm: FormGroup;
  disableApiCall = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private fbuild: FormBuilder,
    private common: CommonAPIService,
    private erpCommonService: ErpCommonService,
    public dialogRef: MatDialogRef<AddVendorDialog>) {

  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    this.vendorForm = this.fbuild.group({
      ven_id: this.dialogData.ven_id ? this.dialogData.ven_id : '',
      ven_name: this.dialogData.ven_name ? this.dialogData.ven_name : '',
      ven_category: this.dialogData.ven_category ? this.dialogData.ven_category : '',
      ven_frequency: this.dialogData.ven_frequency ? this.dialogData.ven_frequency : '',
      ven_items_tags: this.dialogData.ven_items_tags ? this.dialogData.ven_items_tags : [],
      ven_address: this.dialogData.ven_address ? this.dialogData.ven_address : '',
      ven_contact: this.dialogData.ven_contact ? this.dialogData.ven_contact : '',
      ven_email: this.dialogData.ven_email ? this.dialogData.ven_email : '',
      ven_authorised_person_detail_name: this.dialogData.ven_authorised_person_detail_name ? this.dialogData.ven_authorised_person_detail_name : '',
      ven_authorised_person_detail_designation: this.dialogData.ven_authorised_person_detail_designation ? this.dialogData.ven_authorised_person_detail_designation : '',
      ven_authorised_person_detail_contact: this.dialogData.ven_authorised_person_detail_contact ? this.dialogData.ven_authorised_person_detail_contact : '',
      ven_pan_no: this.dialogData.ven_pan_no ? this.dialogData.ven_pan_no : '',
      ven_gst_no: this.dialogData.ven_gst_no ? this.dialogData.ven_gst_no : '',
      ven_status: this.dialogData.ven_status ? this.dialogData.ven_status : '1',
      ven_created_date: this.dialogData.ven_created_date ? this.dialogData.ven_created_date : '',
      ven_updated_date: this.dialogData.ven_updated_date ? this.dialogData.ven_updated_date : '',
      showButtonStatus: this.dialogData.showButtonStatus ? this.dialogData.showButtonStatus : false
    });
  }


  onNoClick() {
    this.dialogRef.close();
  }


  save() {
    if (this.vendorForm.valid) {
      const inputJson = this.vendorForm.value;

      this.erpCommonService.insertVendor(inputJson).subscribe((res: any) => {
        if (res && res.status == 'ok') {
          this.common.showSuccessErrorMessage(res.message, res.status);
          this.vendorForm.reset();
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
    if (this.vendorForm.valid) {
      const inputJson = this.vendorForm.value;
      this.disableApiCall = true;
      this.erpCommonService.updateVendor(inputJson).subscribe((res: any) => {
        if (res && res.status == 'ok') {
          this.common.showSuccessErrorMessage(res.message, res.status);
          this.vendorForm.reset();
          this.dialogRef.close();
          this.disableApiCall = false;
        } else {
          this.common.showSuccessErrorMessage(res.message, res.status);
          this.disableApiCall = false;
        }
      });
    }
    else {
      this.common.showSuccessErrorMessage('Please Fill All Required Fields', 'error');
      this.disableApiCall = false;
    }


  }

  reset() {
    this.vendorForm.reset();
  }


}