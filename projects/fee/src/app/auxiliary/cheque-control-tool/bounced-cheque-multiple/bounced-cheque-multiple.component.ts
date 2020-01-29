import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FeeService, SisService, CommonAPIService } from '../../../_services';

@Component({
  selector: 'app-bounced-cheque-multiple',
  templateUrl: './bounced-cheque-multiple.component.html',
  styleUrls: ['./bounced-cheque-multiple.component.css']
})
export class BouncedChequeMultipleComponent implements OnInit {
  studentDetails: any = {};
  finalArray: any[] = [];
  defaultSrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.svg';
  bouncedForm: FormGroup;
  reasonArray: any[] = [];
  gender: any;
  defaultsrc: any;
  banks: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<BouncedChequeMultipleComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public fbuild: FormBuilder,
    public feeService: FeeService,
    public sisService: SisService,
    public commonAPIService: CommonAPIService
  ) { }


  ngOnInit() {
    this.buildForm();
    this.getReason();
    this.getBanks();
    this.studentDetails = this.data;
    // console.log('studentDetails', this.studentDetails);
  }
  buildForm() {
    this.bouncedForm = this.fbuild.group({
      'ftr_deposit_bnk_id': this.data.ftr_deposit_bnk_id ? this.data.ftr_deposit_bnk_id : '',
      'fcc_deposite_date': this.data.fcc_deposite_date ? this.data.fcc_deposite_date : '',
      'fcc_ftr_id': this.data.fee_transaction_id ? this.data.fee_transaction_id : '',
      'fcc_dishonor_date': this.data.dishonor_date ? this.data.dishonor_date : '',
      'fcc_bank_code': this.data.fcc_bank_code ? this.data.fcc_bank_code : '',
      'fcc_reason_id': this.data.fcc_bank_code ? this.data.fcc_bank_code : '',
      'fcc_remarks': this.data.fcc_remarks ? this.data.fcc_remarks : '',
      'fcc_process_date': this.data.fcc_process_date ? this.data.fcc_process_date : '',
      'fcc_status': this.data.fcc_status ? this.data.fcc_status : 'd',
      'fcc_inv_id': this.data.invoice_id ? this.data.invoice_id : '',
    });
  }
  getReason() {
    this.reasonArray = [];
    this.sisService.getReason({ reason_type: '11' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.reasonArray = result.data;
      }
    });
  }
  getBanks() {
    this.banks = [];
    this.feeService.getBanks({}).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.banks = result.data;
      }
    });
  }
  closeModal() {
    this.dialogRef.close({ status: '0' });
  }
  isExistUserAccessMenu(actionT) {
    return this.commonAPIService.isExistUserAccessMenu(actionT);
  }
  submit() {
    let finalArray: any[] = [];
    for (let item of this.studentDetails) {
      if (this.bouncedForm.value.fcc_status === 'cd') {
        this.bouncedForm.value.fcc_status = 'c';
      }
      finalArray.push({
        fcc_id: item.fcc_id,
        ftr_deposit_bnk_id: this.bouncedForm.value.ftr_deposit_bnk_id,
        fcc_deposite_date: this.bouncedForm.value.fcc_deposite_date ?
          this.commonAPIService.dateConvertion(this.bouncedForm.value.fcc_deposite_date, 'yyyy-MM-dd') : '',
        fcc_ftr_id: item.fee_transaction_id,
        fcc_dishonor_date: this.bouncedForm.value.fcc_dishonor_date ?
          this.commonAPIService.dateConvertion(this.bouncedForm.value.fcc_dishonor_date, 'yyyy-MM-dd') : '',
        fcc_bank_code: this.bouncedForm.value.fcc_bank_code ? this.bouncedForm.value.fcc_bank_code : '',
        fcc_reason_id: this.bouncedForm.value.fcc_reason_id ? this.bouncedForm.value.fcc_reason_id : '',
        fcc_remarks: this.bouncedForm.value.fcc_remarks,
        fcc_process_date: this.bouncedForm.value.fcc_process_date ?
          this.commonAPIService.dateConvertion(this.bouncedForm.value.fcc_process_date, 'yyyy-MM-dd') : '',
        fcc_status: this.bouncedForm.value.fcc_status,
        fcc_inv_id: item.invoice_id
      });
    }
    this.feeService.addMultipleCheckControlTool(finalArray).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.dialogRef.close({ status: '1' });
        this.studentDetails = [];
      } else {
        this.commonAPIService.showSuccessErrorMessage('Some error occured while insert', 'error');
      }
    });
  }
}
