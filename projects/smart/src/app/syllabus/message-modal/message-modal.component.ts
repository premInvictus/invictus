import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-message-modal',
	templateUrl: './message-modal.component.html',
	styleUrls: ['./message-modal.component.css']
})
export class MessageModalComponent implements OnInit {

	inputData: any;
	@Input() messageM;
	@Output() messageOk = new EventEmitter<any>();
	@Output() messageCancel = new EventEmitter<any>();
	dialogRef: MatDialogRef<MessageModalComponent>;
	@ViewChild('messageModal') messageModal;
	constructor(private dialog: MatDialog) { }

	ngOnInit() {
	}
	openModal(data) {
		this.inputData = data;
		this.dialogRef = this.dialog.open(this.messageModal, {
			'height': '20vh',
			'width': '40vh',
			position: {
				'top': '15%'
			}
		});
	}
	message() {
		this.messageOk.emit(this.inputData);
	}
	cancel() {
		this.messageCancel.emit(this.inputData);
	}
	closeDialog() {
		this.dialogRef.close();
	}
}
