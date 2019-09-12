import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FeeService, SisService, CommonAPIService } from '../../../_services';
@Component({
	selector: 'app-bounced-cheque-modal',
	templateUrl: './bounced-cheque-modal.component.html',
	styleUrls: ['./bounced-cheque-modal.component.scss']
})
export class BouncedChequeModalComponent implements OnInit {
	studentDetails: any = {};
	defaultSrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.svg';
	bouncedForm: FormGroup;
	reasonArray: any[] = [];
	gender: any;
	defaultsrc: any;
	banks: any[] = [];
	constructor(
		public dialogRef: MatDialogRef<BouncedChequeModalComponent>,
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
		this.studentDetails = {};
		this.studentDetails = this.data;
		this.gender = this.studentDetails.au_gender;
		if (this.gender === 'M') {
			this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.svg';
		} else if (this.gender === 'F') {
			this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/girl.svg';
		} else {
			this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.svg';
		}
		this.defaultSrc = this.studentDetails.au_profileimage ? this.studentDetails.au_profileimage : this.defaultsrc;
		if (!this.data.fcc_status) {
			this.bouncedForm.patchValue({
				fcc_status: 'd'
			});
		} else if (this.data.fcc_status === 'd') {
			this.bouncedForm.patchValue({
				fcc_status: 'c'
			});
		}
	}
	buildForm() {
		this.bouncedForm = this.fbuild.group({
			'fcc_id': this.data.fcc_id ? this.data.fcc_id : '',
			'ftr_deposit_bnk_id': this.data.ftr_deposit_bnk_id ? this.data.ftr_deposit_bnk_id : '',
			'fcc_deposite_date': this.data.fcc_deposite_date ? this.data.fcc_deposite_date : '',
			'fcc_ftr_id': this.data.fee_transaction_id ? this.data.fee_transaction_id : '',
			'fcc_dishonor_date': this.data.dishonor_date ? this.data.dishonor_date : '',
			'fcc_bank_code': this.data.fcc_bank_code ? this.data.fcc_bank_code : '',
			'fcc_reason_id': this.data.fcc_bank_code ? this.data.fcc_bank_code : '',
			'fcc_remarks': this.data.fcc_remarks ? this.data.fcc_remarks : '',
			'fcc_process_date': this.data.fcc_process_date ? this.data.fcc_process_date : '',
			'fcc_status': this.data.fcc_status ? this.data.fcc_status : '',
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
	submit() {
		if (this.bouncedForm.value.fcc_status === 'd') {
			if (this.bouncedForm.value.fcc_deposite_date && this.bouncedForm.value.fcc_remarks
				&& this.bouncedForm.value.ftr_deposit_bnk_id) {
				this.bouncedForm.patchValue({
					'fcc_deposite_date': this.commonAPIService.dateConvertion(this.bouncedForm.value.fcc_deposite_date, 'yyyy-MM-dd'),
					'fcc_inv_id': this.studentDetails.invoice_id,
					'fcc_ftr_id': this.studentDetails.fee_transaction_id,
				});
				this.feeService.addCheckControlTool(this.bouncedForm.value).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.dialogRef.close({ status: '1' });
					}
				});
			} else {
				this.commonAPIService.showSuccessErrorMessage('Please fill all required field', 'error');
			}
		} else if (this.bouncedForm.value.fcc_status === 'c') {
			if (this.bouncedForm.value.fcc_process_date && this.bouncedForm.value.fcc_remarks) {
				this.bouncedForm.patchValue({
					'fcc_process_date': this.commonAPIService.dateConvertion(this.bouncedForm.value.fcc_process_date, 'yyyy-MM-dd'),
					'fcc_inv_id': this.studentDetails.invoice_id,
					'fcc_ftr_id': this.studentDetails.fee_transaction_id,
				});
				this.feeService.addCheckControlTool(this.bouncedForm.value).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.dialogRef.close({ status: '1' });
					}
				});
			} else {
				this.commonAPIService.showSuccessErrorMessage('Please fill all required field', 'error');
			}
		} else if (this.bouncedForm.value.fcc_status === 'b') {
			if (this.bouncedForm.value.fcc_dishonor_date && this.bouncedForm.value.fcc_bank_code
				&& this.bouncedForm.value.fcc_reason_id && this.bouncedForm.value.fcc_remarks) {
				this.bouncedForm.patchValue({
					'fcc_process_date': this.commonAPIService.dateConvertion(this.bouncedForm.value.fcc_process_date, 'yyyy-MM-dd'),
					'fcc_dishonor_date': this.commonAPIService.dateConvertion(this.bouncedForm.value.fcc_dishonor_date, 'yyyy-MM-dd'),
					'fcc_inv_id': this.studentDetails.invoice_id,
					'fcc_ftr_id': this.studentDetails.fee_transaction_id,
					'fcc_reason_id': this.getReasonId(this.bouncedForm.value.fcc_bank_code)
				});
				this.feeService.addCheckControlTool(this.bouncedForm.value).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.dialogRef.close({ status: '1' });
					}
				});
			} else {
				this.commonAPIService.showSuccessErrorMessage('Please fill all required field', 'error');
			}
		}
	}
	setBankcode(event) {
		this.bouncedForm.patchValue({
			'fcc_bank_code': event.value,
		});
	}
	setBouncedReason(event) {
		this.bouncedForm.patchValue({
			fcc_reason_id: event.target.value
		});
	}

	getReasonId(bankcode) {
		if (this.reasonArray.length > 0) {
			for (const value of this.reasonArray) {
				if (value.reason_desc === bankcode) {
					return value.reason_id;
				}
			}
		}
	}
}

