import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SisService, CommonAPIService } from '../../_services/index';

@Component({
	selector: 'app-unpublish-modal',
	templateUrl: './unpublish-modal.component.html',
	styleUrls: ['./unpublish-modal.component.css']
})
export class UnpublishModalComponent implements OnInit {
	@Input() unPublishForm: FormGroup;
	inputData: any = {};
	reasonsArray: any[] = [];
	unpublishDiv = true;
	reasonDiv = false;

	@Input() unpublishMessage;
	@Output() unpublishOk = new EventEmitter<any>();
	@Output() unpublishCancel = new EventEmitter<any>();
	dialogRef: MatDialogRef<UnpublishModalComponent>;
	@ViewChild('UnpublishModal') UnpublishModal;
	constructor(private dialog: MatDialog,
		private fbuild: FormBuilder,
		private sisService: SisService,
		private commomService: CommonAPIService) { }

	ngOnInit() {
	}
	openunpublishModal(data) {
		this.buildForm();
		this.getReasons();
		this.inputData = data;
		this.dialogRef = this.dialog.open(this.UnpublishModal, {
			'width': '60vh',
			position: {
				'top': '10%'
			}
		});
	}
	buildForm() {
		this.unPublishForm = this.fbuild.group({
			req_reason: '',
			req_reason_text: ''
		});
	}
	getReasons() {
		this.sisService.getReason({ reason_type: 5 }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.reasonsArray = result.data;
			}
		});
	}
	closeunpublishDiv() {
		this.unpublishDiv = false;
		this.reasonDiv = true;
	}
	unpublish() {
		if (this.unPublishForm.valid) {
			this.inputData.req_reason = this.unPublishForm.value.req_reason;
			this.inputData.req_reason_text = this.unPublishForm.value.req_reason_text;
			this.unpublishOk.emit(this.inputData);
			this.closeDialog();
		}
	}

	cancel() {
		this.unpublishCancel.emit(this.inputData);
	}
	closeDialog() {
		this.dialogRef.close();
		this.unpublishDiv = true;
		this.reasonDiv = false;
	}

}
