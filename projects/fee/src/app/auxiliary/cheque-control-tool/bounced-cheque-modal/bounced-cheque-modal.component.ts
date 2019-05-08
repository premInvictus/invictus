import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FeeService } from '../../../_services';
@Component({
	selector: 'app-bounced-cheque-modal',
	templateUrl: './bounced-cheque-modal.component.html',
	styleUrls: ['./bounced-cheque-modal.component.scss']
})
export class BouncedChequeModalComponent implements OnInit {
	studentDetails: any = {};
	defaultSrc = '../../../../assets/images/student.png';
	bouncedForm: FormGroup;
	constructor(
		public dialogRef: MatDialogRef<BouncedChequeModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data,
		public fbuild: FormBuilder,
		public feeService: FeeService) { }

	ngOnInit() {
		this.buildForm();
		this.studentDetails = {};
		this.studentDetails = this.data;
		console.log(this.studentDetails);
		this.defaultSrc = this.studentDetails.au_profileimage ? this.studentDetails.au_profileimage : '../../../../assets/images/student.png';
	}
	buildForm() {
		this.bouncedForm = this.fbuild.group({
			'fcc_ftr_id': '',
			'fcc_dishonor_date': '',
			'fcc_bank_code': '4',
			'fcc_reason_id': '1',
			'fcc_remarks': '',
			'fcc_process_date': new DatePipe('en-in').transform(new Date(), 'yyyy-MM-dd'),
			'fcc_status': 'b',
			'fcc_inv_id': ''
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
				'fcc_ftr_id': this.studentDetails.fee_transaction_id
			});
			this.feeService.addCheckControlTool(this.bouncedForm.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.dialogRef.close();
				}
			});
		}
	}

}
