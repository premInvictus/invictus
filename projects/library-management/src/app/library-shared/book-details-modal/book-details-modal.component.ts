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
		let accession_type;
		await this.erpCommonService.getGlobalSetting({gs_alias:['accession_type']}).toPromise().then((result: any) => {
			if (result && result.status === 'ok') {
				const settings = result.data;
				for (let i=0; i< settings.length;i++) {
					accession_type = settings[i].gs_value;
				}
			}
		});
		const inputJson = { 'filters': [{ 'filter_type': 'reserv_no', 'filter_value': book_no, 'type': 'text' }], search_from: 'master'  };
		await this.erpCommonService.getReservoirDataBasedOnFilter(inputJson).toPromise().then((result: any) => {
			if (result && result.status === 'ok') {
				let book_no;
				if(accession_type == 'single') {
					book_no = result.data.resultData[0].reserv_no;
				} else {
					book_no = result.data.resultData[0].accessionsequence + result.data.resultData[0].reserv_no;
				}
				result.data.resultData[0]['book_no'] =book_no;
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
