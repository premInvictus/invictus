import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
@Component({
	selector: 'app-delete-modal',
	templateUrl: './delete-modal.component.html',
	styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {
	inputData: any = {'text':''};
	@Input() deleteMessage;
	@Output() deleteOk = new EventEmitter<any>();
	@Output() deleteCancel = new EventEmitter<any>();
	dialogRef: MatDialogRef<DeleteModalComponent>;
	@ViewChild('deleteModal') deleteModal;
	constructor(private dialog: MatDialog) { }

	ngOnInit() {
	}
	openModal(data) {
		this.inputData = data;

		if (! (this.inputData && this.inputData.text)) {
			this.inputData.text = 'Do You Wish to Delete ';
		}
		this.dialogRef = this.dialog.open(this.deleteModal, {
			'height': '30vh',
			'width': '60vh',
			position: {
				'top': '15%'
			}
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

}
