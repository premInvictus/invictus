import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ErpCommonService } from 'src/app/_services';

@Component({
	selector: 'app-book-reserve-request-confirmation',
	templateUrl: './book-reserve-request-confirmation.component.html',
	styleUrls: ['./book-reserve-request-confirmation.component.scss']
})
export class BookReserveRequestConfirmationComponent implements OnInit {
	dialogRef: MatDialogRef<BookReserveRequestConfirmationComponent>;
	unpublishDiv = true;
	data: any = {};
	currentUser: any = {};
	success = false;
	constructor(private dialog: MatDialog, private erp: ErpCommonService) { }
	@ViewChild('confirmModal')confirmModal;
	generatedId: any ;
	ngOnInit() {
	}
	openModal(item) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.generatedId = '';
		this.unpublishDiv = true;
		this.success = false;
		this.data = item;
		this.dialogRef = this.dialog.open(this.confirmModal, {
			width: '25%',
			height: '25vh'
		});
	}
	request_gen() {
		this.generatedId = '';
		this.erp.generateBookRequest({
			book_data: this.data,
			userData: this.currentUser
		}).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.unpublishDiv = false;
				this.success = true;
				this.generatedId = res.data[0].requested_id;
			} else {
				this.unpublishDiv = false;
				this.success = false;
			}
		});
	}
	closeDialog() {
		this.dialogRef.close();
	}
}
