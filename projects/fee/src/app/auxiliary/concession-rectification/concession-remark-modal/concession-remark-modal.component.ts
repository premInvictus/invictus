import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SisService, FeeService, CommonAPIService } from '../../../_services';

@Component({
	selector: 'app-concession-remark-modal',
	templateUrl: './concession-remark-modal.component.html',
	styleUrls: ['./concession-remark-modal.component.scss']
})
export class ConcessionRemarkModalComponent implements OnInit {

	inputData: any;
	reasonForm: FormGroup;
	reasonArr: any;
	@Input() deleteMessage;
	@Output() deleteOk = new EventEmitter<any>();
	@Output() deleteCancel = new EventEmitter<any>();
	dialogRef: MatDialogRef<ConcessionRemarkModalComponent>;
	@ViewChild('deleteWithReasonModal') deleteWithReasonModal;
	constructor(
		private sisService: SisService,
		private dialog: MatDialog,
		private fbuild: FormBuilder,
		public common: CommonAPIService, ) { }

	ngOnInit() {
		this.buildForm();
		this.getReason();
	}

	buildForm() {
		this.reasonForm = this.fbuild.group({
			'callee_data': '',
			'reason_id': '',
			'reason_remark': ''
		});
	}


	openModal(data) {
		this.inputData = data;
		this.reasonForm.patchValue({
			'callee_data': data
		});
		this.dialogRef = this.dialog.open(this.deleteWithReasonModal, {
			'height': '25vh',
			position: {
				'top': '20%'
			}
		});
	}

	getReason() {
		this.reasonArr = [];
		this.sisService.getReason({ reason_type: '11' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.reasonArr = result.data;
			}
		});
	}


	approve() {
		if (this.reasonForm.valid) {
			this.deleteOk.emit(this.reasonForm.value);
			this.dialogRef.close();
		} else {
			this.common.showSuccessErrorMessage('Please choose reason to approve concession', 'error');
		}

	}

	cancel() {
		this.deleteCancel.emit(this.reasonForm.value);
	}
	closeDialog() {
		this.reasonForm.reset();
		this.dialogRef.close();
	}

}
