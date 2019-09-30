import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';

@Component({
	selector: 'app-book-detail',
	templateUrl: './book-detail.component.html',
	styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
	searchForm: FormGroup;
	bookData:any;
	constructor(
		private fbuild: FormBuilder,
		private dialog: MatDialog,  
		private common: CommonAPIService,
		private erpCommonService: ErpCommonService) { }
	// @Input() bookInputData;
	ngOnInit() {
		// console.log(this.bookInputData);
		this.buildForm();
		var book_no = this.common.getReservoirId();
		if (book_no) {
			this.getBookDetail(book_no);
		}
		
	}

	buildForm() {
		this.searchForm = this.fbuild.group({
			searchId: ''
		});
	}

	getBookDetail(book_no) {
		// var book_no;		
		// if (this.searchForm.value.searchId) {
		// 	book_no = this.searchForm.value.searchId;
		// } else {
		// 	book_no = this.common.getReservoirId();
		// }
		const inputJson = {"filters":[{"filter_type":"reserv_id","filter_value": book_no,"type":"number"}]};
		this.erpCommonService.getReservoirDataBasedOnFilter(inputJson).subscribe((result: any) => {
		if (result && result.status == 'ok') {
			console.log('result', result);
			this.bookData = result.data.resultData[0];
		} else {
			this.bookData = {};
		}				
		});
	}

	bookReserveRequest($event) {

	}
	

}
