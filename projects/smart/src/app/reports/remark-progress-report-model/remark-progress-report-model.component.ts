import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SmartService } from '../../_services';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-remark-progress-report-model',
	templateUrl: './remark-progress-report-model.component.html',
	styleUrls: ['./remark-progress-report-model.component.css']
})
export class RemarkProgressReportModelComponent implements OnInit {

	@Input() remarkForm: FormGroup;
	@Input() editRemarkForm: FormGroup;
	addFlag = false;
	editFlag = false;
	remarkText: any;
	public remarkArray: any[] = [];
	editRemark: any;
	ckeConfig: any = {};
	inputData: any = {};
	@Input() remarkMessage;
	@Output() remarkOk = new EventEmitter<any>();
	@Output() remarkCancel = new EventEmitter<any>();
	dialogRef: MatDialogRef<RemarkProgressReportModelComponent>;
	@ViewChild('remarkModel') remarkModel;
	constructor(
		private dialog: MatDialog,
		private fbuild: FormBuilder,
		private smartService: SmartService,
	) { }
	buildForm() {
		this.remarkForm = this.fbuild.group({
			ftr_remark: ''
		});
		this.editRemarkForm = this.fbuild.group({
			edit_remark: ''
		});

	}
	ngOnInit() {
		this.buildForm();
	}
	openRemarkModal(data) {
		this.dialogRef = this.dialog.open(this.remarkModel, {
			width: '450px'
		});
		this.buildForm();
		this.inputData = data;
		if (this.inputData.type === 'add') {
			this.addFlag = true;
			this.editFlag = false;
		}
		if (this.inputData.type === 'edit') {
			this.editFlag = true;
			this.addFlag = false;
			this.getRemarkDetails();

		}

	}
	getRemarkDetails() {
		const param: any = {};
		param.rm_tt_id = this.inputData.tt_id;
		param.rm_subject_id = this.inputData.sub_id;
		this.smartService.getProgressReportRemarks(param).subscribe((remark_r: any) => {
			if (remark_r && remark_r.status === 'ok') {
				this.editRemark = remark_r.data[0].rm_remark;
			}

		});
	}
	editremark() {
		this.remarkText = document.getElementById('edit_remark').innerHTML;
		this.remarkForm.patchValue({
			'ftr_remark': this.remarkText
		});
		this.addFlag = true;
		this.editFlag = false;
	}
	addremark() {
		if (this.editRemarkForm.valid) {
			this.inputData.remark = this.remarkForm.value.ftr_remark;
			this.remarkOk.emit(this.inputData);
			this.closeDialog();
		}
	}
	deleteRemark() {
		this.remarkCancel.emit(this.inputData);
		this.closeDialog();
	}
	closeDialog() {
		this.dialogRef.close(false);
	}
}
