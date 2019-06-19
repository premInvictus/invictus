import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonAPIService } from '../../_services/commonAPI.service';
@Component({
	selector: 'app-processdate-modal',
	templateUrl: './processdate-modal.component.html',
	styleUrls: ['./processdate-modal.component.css']
})
export class ProcessdateModalComponent implements OnInit {

	inputData: any;
	dateFlag = false;
	dateForm: FormGroup;
	@Input() processMessage;
	@Output() processOk = new EventEmitter<any>();
	@Output() processCancel = new EventEmitter<any>();
	dialogRef: MatDialogRef<ProcessdateModalComponent>;
	maxdate = new Date();
	@ViewChild('processDateModal') processDateModal;
	constructor(private dialog: MatDialog, private fbuild: FormBuilder, private common: CommonAPIService) { }

	ngOnInit() {
		this.buildForm();
	}
	buildForm() {
		this.dateForm = this.fbuild.group({
			'processDate': ''
		});
	}
	openModal(data) {
		this.inputData = data;
		this.dialogRef = this.dialog.open(this.processDateModal, {
			'height': '30vh',
			position: {
				'top': '20%'
			},
			hasBackdrop: false
		});
	}
	process() {
		if (this.dateForm.value.processDate) {
			this.inputData['processDate'] = this.dateForm.value.processDate;
			this.processOk.emit(this.inputData);
			this.closeDialog();
		} else {
			this.common.showSuccessErrorMessage('Please fill the date', 'error');
		}
	}

	cancel() {
		this.processCancel.emit(this.inputData);
	}
	closeDialog() {
		this.dialogRef.close();
	}

	enableDate() {
		this.dateFlag = true;
	}
}
