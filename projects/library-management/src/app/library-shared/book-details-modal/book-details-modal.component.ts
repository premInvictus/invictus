import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ErpCommonService } from 'src/app/_services';

@Component({
	selector: 'app-book-details-modal',
	templateUrl: './book-details-modal.component.html',
	styleUrls: ['./book-details-modal.component.css']
})
export class BookDetailsModalComponent implements OnInit, AfterViewInit {
	@ViewChild('bookDet') bookDet;
	dialogRef: MatDialogRef<BookDetailsModalComponent>;
	bookData: any = {};
	constructor(private dialog: MatDialog, private erpCommonService: ErpCommonService) { }

	ngOnInit() {
	}
	ngAfterViewInit() {
	}
	openModal(book_no) {
		this.dialogRef = this.dialog.open(this.bookDet, {
			width: '30%',
		});
		this.getBookDetail(book_no);
	}
	async getBookDetail(book_no) {
		this.bookData = {};
		const inputJson = { 'filters': [{ 'filter_type': 'reserv_no', 'filter_value': book_no, 'type': 'text' }], search_from: 'master'  };
		await this.erpCommonService.getReservoirDataBasedOnFilter(inputJson).toPromise().then((result: any) => {
			if (result && result.status === 'ok') {
				this.bookData = result.data.resultData[0];
			} else {
				this.bookData = {};
			}
		});
	}
	closeDialog() {
		this.dialogRef.close();
	}

}
