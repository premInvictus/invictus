import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ProcesstypeFeeService, CommonAPIService, FeeService } from '../../_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-create-invoice-modal',
	templateUrl: './create-invoice-modal.component.html',
	styleUrls: ['./create-invoice-modal.component.css']
})
export class CreateInvoiceModalComponent implements OnInit {
	feePeriod: any[] = [];
	invoiceCreationForm: FormGroup;
	constructor(@Inject(MAT_DIALOG_DATA) public data,
		private dialogRef: MatDialogRef<CreateInvoiceModalComponent>,
		private processTypeService: ProcesstypeFeeService,
		private fb: FormBuilder,
		public feeService: FeeService,
		public commonAPIService: CommonAPIService) { }

	ngOnInit() {
		this.buildForm();
		this.processTypeService.setProcesstype('4');
		console.log(this.data);
		this.feePeriod = this.data.invoiceDetails.fp_name;
	}
	buildForm() {
		this.invoiceCreationForm = this.fb.group({
			recalculation_flag: '0',
			inv_id: [],
			inv_title: '',
			login_id: [],
			inv_calm_id: '',
			inv_fp_id: '',
			inv_fm_id: [],
			inv_invoice_date: '',
			inv_due_date: '',
			inv_activity: ''
		});
	}
	closeDialog() {
		this.dialogRef.close({ status: false });
	}
	insertInvoice() {
		if (this.invoiceCreationForm.valid) {
			this.invoiceCreationForm.patchValue({
				'inv_invoice_date': new DatePipe('en-in').transform(this.invoiceCreationForm.value.inv_invoice_date, 'yyyy-MM-dd'),
				'inv_due_date': new DatePipe('en-in').transform(this.invoiceCreationForm.value.inv_due_date, 'yyyy-MM-dd'),
				'login_id': [this.data.invoiceDetails.au_login_id],
				'inv_fp_id': this.data.invoiceDetails.inv_fp_id
			});
			this.feeService.insertInvoice(this.invoiceCreationForm.value).subscribe((res: any) => {
				if (res && res.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage(res.message, 'success');
					this.dialogRef.close({ status: true });
				} else {
					this.commonAPIService.showSuccessErrorMessage(res.message, 'error');
					this.dialogRef.close({ status: false });
				}
			});
		}
	}

}
