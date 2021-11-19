import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
@Component({
	selector: 'app-delete-modal',
	templateUrl: './delete-modal.component.html',
	styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {
	inputData: any = {'text':''};
	showInvPhysicalVerification =false;
	ipvForm: FormGroup;
	@Input() inputText;
	@Input() deleteMessage;
	@Output() deleteOk = new EventEmitter<any>();
	@Output() deleteCancel = new EventEmitter<any>();
	dialogRef: MatDialogRef<DeleteModalComponent>;
	@ViewChild('deleteModal') deleteModal;
	constructor(private dialog: MatDialog, private fbuild : FormBuilder, private commonAPIService: CommonAPIService) { }

	ngOnInit() {
	}
	openModal(data) {
		this.inputData = data;
		console.log('data--', data);
		if (! (this.inputData && this.inputData.text)) {
			this.inputData.text = 'Delete ';
		}

		if (data && data.from === 'inv-physical-verification') {
			this.inputData.text = 'Action';
			this.showInvPhysicalVerification = true;
			this.buildForm();
		} else {
			this.showInvPhysicalVerification = false;
		}
		this.dialogRef = this.dialog.open(this.deleteModal, {
			'height': '30vh',
			'width': '60vh',
			position: {
				'top': '15%'
			}
		});
	}

	buildForm() {
		this.ipvForm = this.fbuild.group({
			quantity:''
		});
	}

	delete() {
		this.deleteOk.emit(this.inputData);
	}

	cancel() {
		this.deleteCancel.emit(this.inputData);
	}
	closeDialog() {
		this.dialogRef.close();
	}

	setQuantity() {
		if (this.ipvForm.valid) {
			this.inputData['quantity'] = this.ipvForm.value.quantity;
			this.deleteOk.emit(this.inputData);
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please Fill Required Field', 'error');
		}
		
	}

}
