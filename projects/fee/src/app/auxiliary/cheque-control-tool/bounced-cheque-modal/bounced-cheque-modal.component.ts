import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FeeService, SisService } from '../../../_services';
@Component({
	selector: 'app-bounced-cheque-modal',
	templateUrl: './bounced-cheque-modal.component.html',
	styleUrls: ['./bounced-cheque-modal.component.scss']
})
export class BouncedChequeModalComponent implements OnInit {
	studentDetails: any = {};
	defaultSrc = '/assets/images/student.png';
	bouncedForm: FormGroup;
	reasonArray: any[] = [];
	constructor(
		public dialogRef: MatDialogRef<BouncedChequeModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data,
		public fbuild: FormBuilder,
		public feeService: FeeService,
		public sisService: SisService
	) { }

	ngOnInit() {
		this.buildForm();
		this.getReason();
		this.studentDetails = {};
		this.studentDetails = this.data;
		console.log(this.studentDetails);
		this.defaultSrc = this.studentDetails.au_profileimage ? this.studentDetails.au_profileimage : '/assets/images/student.png';
	}
	buildForm() {
		this.bouncedForm = this.fbuild.group({
			'fcc_ftr_id': '',
			'fcc_dishonor_date': '',
			'fcc_bank_code': '',
			'fcc_reason_id': '',
			'fcc_remarks': '',
			'fcc_process_date': new DatePipe('en-in').transform(new Date(), 'yyyy-MM-dd'),
			'fcc_status': 'b',
			'fcc_inv_id': ''
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
	closeModal() {
		this.dialogRef.close();
	}
	submit() {
		if (this.bouncedForm.valid) {
			this.bouncedForm.patchValue({
				'fcc_dishonor_date': new DatePipe('en-in').transform(this.bouncedForm.value.fcc_dishonor_date, 'yyyy-MM-dd'),
				'fcc_inv_id': this.studentDetails.invoice_id,
				'fcc_ftr_id': this.studentDetails.fee_transaction_id,
				'fcc_reason_id': this.getReasonId(this.bouncedForm.value.fcc_bank_code)
			});
			this.feeService.addCheckControlTool(this.bouncedForm.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.dialogRef.close();
				}
			});
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

