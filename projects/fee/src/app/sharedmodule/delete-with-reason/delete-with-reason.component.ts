import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonAPIService } from 'src/app/_services';
import { SisService } from '../../_services';

@Component({
	selector: 'app-delete-with-reason',
	templateUrl: './delete-with-reason.component.html',
	styleUrls: ['./delete-with-reason.component.css']
})
export class DeleteWithReasonComponent implements OnInit {

	inputData: any;
	reasonForm: FormGroup;
	reasonArr: any;
	@Input() deleteMessage;
	@Output() deleteOk = new EventEmitter<any>();
	@Output() deleteCancel = new EventEmitter<any>();
	dialogRef: MatDialogRef<DeleteWithReasonComponent>;
	@ViewChild('deleteWithReasonModal') deleteWithReasonModal;
	constructor(private sisService: SisService, private dialog: MatDialog, private fbuild: FormBuilder, public common: CommonAPIService, ) { }

	ngOnInit() {
		this.buildForm();
		this.getReason();
	}

	buildForm() {
		this.reasonForm = this.fbuild.group({
			'inv_id': [],
			'reason_id': '',
			'reason_remark': ''
		});
	}


	openModal(data) {
		this.inputData = data;
		this.reasonForm.patchValue({
			'inv_id': data
		});
		this.dialogRef = this.dialog.open(this.deleteWithReasonModal, {
			'height': '50vh',
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


	delete() {
		if (this.reasonForm.valid) {
			this.deleteOk.emit(this.reasonForm.value);
			this.dialogRef.close();
			this.reasonForm.patchValue({
				'inv_id': [],
				'reason_id': '',
				'reason_remark': ''
			});
		} else {
			this.common.showSuccessErrorMessage('Please choose reason to delete invoice', 'error');
		}

	}

	cancel() {
		this.deleteCancel.emit(this.reasonForm.value);
	}
	closeDialog() {
		this.dialogRef.close();
	}

}
