import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SisService, CommonAPIService } from '../../_services/index';
@Component({
	selector: 'app-edit-request-modal',
	templateUrl: './edit-request-modal.component.html',
	styleUrls: ['./edit-request-modal.component.scss']
})
export class EditRequestModalComponent implements OnInit {
	displayMessage: any = 'You dont have the permission to change the field values<br> <b> Please verify your changes </b>';
	@Output() confirmEdit = new EventEmitter();
	@Output() cancelEdit = new EventEmitter();
	@Input() editForm: FormGroup;
	dialogRef: MatDialogRef<EditRequestModalComponent>;
	inputData: any;
	reasonsArray: any[] = [];
	formfieldValueArray: any[] = [];
	formFields: any[] = [];
	priorityArray: any[] = [{ req_priority: 'low', req_priority_name: 'Low' },
	{ req_priority: 'medium', req_priority_name: 'Medium' },
	{ req_priority: 'high', req_priority_name: 'High' }];
	@ViewChild('editModal') editModal;
	constructor(private dialog: MatDialog,
		private fbuild: FormBuilder,
		private sisService: SisService,
		private commomService: CommonAPIService) { }

	ngOnInit() {
	}
	openModal(data) {
		this.buildForm();
		this.getReasons();
		this.inputData = data;
		this.getFormFields();
		this.formfieldValueArray = this.inputData.data;
		this.dialogRef = this.dialog.open(this.editModal, {
			'height': '80vh',
			'width': '100vw',
			disableClose: true,
			position: {
				'top': '5%'
			}
		});
	}
	buildForm() {
		this.editForm = this.fbuild.group({
			req_priority: '',
			req_remarks: '',
			req_reason: '',
			rff_field_name: '',
			rff_old_field_value: '',
			rff_new_field_value: ''
		});
	}
	getReasons() {
		this.sisService.getReason({ reason_type: 5 }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.reasonsArray = result.data;
			}
		});
	}
	confirm() {
		console.log(this.inputData.reqParam);
		if (!this.editForm.valid) {
			this.commomService.showSuccessErrorMessage('Please fill required fields', 'error');
		} else {
			for (let i = 0; i < this.inputData.reqParam.length; i++) {
				this.inputData.reqParam[i].req_priority = this.editForm.value.req_priority;
				this.inputData.reqParam[i].req_reason = this.editForm.value.req_reason;
				this.inputData.reqParam[i].req_remarks = this.editForm.value.req_remarks;
				this.inputData.reqParam[i].req_param = this.inputData.data[i];
				this.sisService.insertEditRequest(this.inputData.reqParam[i]).subscribe((result: any) => {
					if (result.status === 'ok') {
						if (i === 0) {
							this.commomService.showSuccessErrorMessage('Edit Request Submitted Successfully', 'success');
						}
						this.commomService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
						this.closeDialog();
					}
				});
			}

			this.confirmEdit.emit(this.inputData);
		}
	}
	cancel() {
		this.cancelEdit.emit(this.inputData);
	}
	closeDialog() {
		this.dialogRef.close();
	}
	getFormFields() {
		this.sisService.getFormFields({
			ff_tb_id: '18'
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.formFields = result.data;
			}
		});
	}
	getFieldName(field_name) {
		const findex = this.formFields.findIndex(f => f.ff_field_name === field_name);
		if (findex !== -1) {
			return this.formFields[findex]['ff_label'];
		}
	}
	isArray(obj) {
		return Array.isArray(obj);
	}
}
