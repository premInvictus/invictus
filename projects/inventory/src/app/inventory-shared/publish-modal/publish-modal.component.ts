import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-publish-modal',
	templateUrl: './publish-modal.component.html',
	styleUrls: ['./publish-modal.component.css']
})
export class PublishModalComponent implements OnInit {
	inputData: any;
	@Input() publishMessage;
	@Output() publishOk = new EventEmitter<any>();
	@Output() publishCancel = new EventEmitter<any>();
	dialogRef: MatDialogRef<PublishModalComponent>;
	@ViewChild('publishModal') publishModal;
	constructor(private dialog: MatDialog) { }

	ngOnInit() {
	}
	openpublishModal(data) {
		this.inputData = data;
		this.dialogRef = this.dialog.open(this.publishModal, {
			'height': '25vh',
			'width': '60vh',
			position: {
				'top': '15%'
			}
		});
	}
	publish() {
		this.publishOk.emit(this.inputData);
	}

	cancel() {
		this.publishCancel.emit(this.inputData);
	}
	closeDialog() {
		this.dialogRef.close();
	}

}
