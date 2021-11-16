import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonAPIService } from 'src/app/_services';
import { SisService, FeeService } from '../../_services';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-bulk-update-model',
	templateUrl: './app-bulk-update-model.component.html',
	styleUrls: ['./app-bulk-update-model.component.css']
})
export class AppBulkUpdateSecurityModel implements OnInit {

	reason_type: any;
	inputData: any = {};
	reasonForm: FormGroup;
	reasonArr: any;
	@Input() deleteMessage;
	@Output() clickOkModel = new EventEmitter<any>();
	@Output() deleteCancel = new EventEmitter<any>();
	dialogRef: MatDialogRef<AppBulkUpdateSecurityModel>;
	@ViewChild('deleteWithReasonModal') deleteWithReasonModal;
	constructor(private sisService: SisService, private feeService: FeeService, private dialog: MatDialog, private fbuild: FormBuilder, public common: CommonAPIService,) { }

	ngOnInit() {
		this.buildForm();
	}

	buildForm() {
		this.reasonForm = this.fbuild.group({
			'fsd_status': '',
			'fsd_payment_type': '',
			'fsd_created_date': '',
			'fsd_remarks': ''
		});
	}

	addEvent() {
		// this.events.push(`${type}: ${event.value}`);
		const datePipe = new DatePipe('en-US');
		const convertedDate = datePipe.transform(this.reasonForm.value.fsd_created_date, 'yyyy-MM-dd hh:mm:ss');
		this.reasonForm.patchValue({
			'fsd_created_date': convertedDate
		});
	}


	openModal(data) {
		this.getReason(13);
		this.inputData = data;
		this.dialogRef = this.dialog.open(this.deleteWithReasonModal, {
			'height': '50vh',
			position: {
				'top': '20%'
			}
		});
	}
	// openModalFee(data) {
	// 	this.inputData = data;	
	// 	this.getReason(this.inputData.receipt_id);
	// 	this.reasonForm.patchValue({
	// 		'inv_id': this.inputData.id
	// 	});
	// 	this.dialogRef = this.dialog.open(this.deleteWithReasonModal, {
	// 		'height': '90vh',
	// 		position: {
	// 			'top': '20%'
	// 		}
	// 	});
	// }

	getReason(reason_type) {
		this.reasonArr = [];
		this.feeService.getPaymentMode({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.reasonArr = result.data;
			}
		});
	}


	delete() {
		// if (this.reasonForm.valid) {
			this.clickOkModel.emit(this.reasonForm.value);
			this.dialogRef.close();
			this.reasonForm.patchValue({
				'fsd_status': '',
				'fsd_payment_type': '',
				'fsd_created_date': '',
				'fsd_remarks': ''
			});
		// } else {
		// 	this.common.showSuccessErrorMessage('Please choose reason to delete invoice', 'error');
		// }

	}

	cancel() {
		this.deleteCancel.emit(this.reasonForm.value);
	}
	closeDialog() {
		this.dialogRef.close();
	}

}
