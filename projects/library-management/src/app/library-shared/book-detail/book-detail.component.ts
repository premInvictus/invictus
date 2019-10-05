import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonAPIService, ErpCommonService } from 'src/app/_services';
import { MatTableDataSource } from '@angular/material';

@Component({
	selector: 'app-book-detail',
	templateUrl: './book-detail.component.html',
	styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
	searchForm: FormGroup;
	@ViewChild('bookReserve') bookReserve;
	bookData: any = {};
	currentUser: any;
	pageSize: 10;
	pageIndex: 0;
	BOOK_LOGS: any[] = [];
	datasource = new MatTableDataSource<any>(this.BOOK_LOGS);
	logdisplayedcolumns = ['sno', 'enrollment_no', 'issued_to', 'class-sec', 'issued_on', 'return_on'];
	constructor(
		private fbuild: FormBuilder,
		private dialog: MatDialog,
		private route: ActivatedRoute,
		private common: CommonAPIService,
		private router: Router,
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
		this.bookData = {};
		const inputJson = { 'filters': [{ 'filter_type': 'reserv_id', 'filter_value': book_no, 'type': 'number' }] };
		this.erpCommonService.getReservoirDataBasedOnFilter(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.bookData = result.data.resultData[0];
				this.erpCommonService.getBookLogsPerBook({
					book_id: this.bookData.reserv_id
				}).subscribe((res: any) => {
					let i = 0;
					if (res && res.status === 'ok') {
						for (const item of res.data.resultData) {
							for (const titem of item.reserv_user_logs) {
								if (titem.reserv_id === this.bookData.reserv_id) {
									let prefix = '';
									if (Number(item.user_role_id) === 2) {
										prefix = 'A-';
									} else if (Number(item.user_role_id) === 3) {
										prefix = 'T-';
									} else {
										prefix = 'S-';
									}

									this.BOOK_LOGS.push({
										sr_no: i + 1,
										enrollment_no: prefix + item.user_login_id,
										issued_to: item.user_full_name,
										role_id: item.user_role_id,
										issued_on: titem.issued_on,
										return_on: titem.returned_on
									})
									i++;
								}
							}
						}
						this.datasource = new MatTableDataSource<any>(this.BOOK_LOGS);
						console.log(this.BOOK_LOGS);
					}
				});
			} else {
				this.bookData = {};
			}
		});
	}
	getBookDetail2(book_no) {
		this.bookData = {};
		this.router.navigate([], { relativeTo: this.route, queryParams: { book_id: book_no }, queryParamsHandling: 'merge' });
		const inputJson = { 'filters': [{ 'filter_type': 'reserv_id', 'filter_value': book_no, 'type': 'number' }] };
		this.erpCommonService.getReservoirDataBasedOnFilter(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.bookData = result.data.resultData[0];
				this.erpCommonService.getBookLogsPerBook({
					book_id: this.bookData.reserv_id,
					page_size: this.pageSize,
					page_index: this.pageIndex,
				}).subscribe((res: any) => {
				});
			} else {
				this.bookData = {};
			}
		});
	}

	reserve_request(item) {
		this.bookReserve.openModal(item);
	}
}
