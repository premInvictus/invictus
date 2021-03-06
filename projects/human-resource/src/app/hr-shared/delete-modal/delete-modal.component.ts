import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
@Component({
	selector: 'app-delete-modal',
	templateUrl: './delete-modal.component.html',
	styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {
	inputData: any = { 'text': '' };
	@Input() deleteMessage;
	@Output() deleteOk = new EventEmitter<any>();
	@Output() deleteCancel = new EventEmitter<any>();
	dialogRef: MatDialogRef<DeleteModalComponent>;
	@ViewChild('deleteModal') deleteModal;
	head: any = 'Delete';
	constructor(private dialog: MatDialog) { }

	ngOnInit() {
	}
	openModal(data) {
		console.log('data--',data);
		this.inputData = data;

		if (!(this.inputData && this.inputData.text)) {
			this.inputData.text = 'Do You Wish to Delete ';
		} else {
			if (this.inputData.head) {
				this.head = this.inputData.head;
			} else {
				this.head = this.inputData.text;
			}
		}
		if(this.deleteMessage){
			this.inputData.text = this.deleteMessage;
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
