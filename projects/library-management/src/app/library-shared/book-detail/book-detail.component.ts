import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CommonAPIService, ErpCommonService } from 'src/app/_services';

@Component({
	selector: 'app-book-detail',
	templateUrl: './book-detail.component.html',
	styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
	searchForm: FormGroup;
	@ViewChild('bookReserve')bookReserve;
	bookData: any = {};
	currentUser: any;
	constructor(
		private fbuild: FormBuilder,
		private dialog: MatDialog,
		private route: ActivatedRoute,
		private common: CommonAPIService,
		private erpCommonService: ErpCommonService) { }
	// @Input() bookInputData;
	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		// console.log(this.bookInputData);
		this.buildForm();
		const book_no = this.route.snapshot.queryParams['book_id'];
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
		const inputJson = { "filters": [{ "filter_type": "reserv_id", "filter_value": book_no, "type": "number" }] };
		this.erpCommonService.getReservoirDataBasedOnFilter(inputJson).subscribe((result: any) => {
			if (result && result.status == 'ok') {
				console.log('result', result);
				this.bookData = result.data.resultData[0];
			} else {
				this.bookData = {};
			}
		});
	}

	reserve_request(item) {
		this.bookReserve.openModal(item) ;
	}
}
