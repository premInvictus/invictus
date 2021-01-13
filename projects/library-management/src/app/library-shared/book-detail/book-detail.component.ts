import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonAPIService, ErpCommonService } from 'src/app/_services';
import { MatTableDataSource, MatPaginatorIntl, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { AdvancedSearchModalComponent } from '../../library-shared/advanced-search-modal/advanced-search-modal.component';
import { MatPaginatorI18n } from '../../library-shared/customPaginatorClass';
import { DatePipe } from '@angular/common';
@Component({
	selector: 'app-book-detail',
	templateUrl: './book-detail.component.html',
	styleUrls: ['./book-detail.component.scss'],
	providers: [
		{ provide: MatPaginatorIntl, useClass: MatPaginatorI18n }
	]
})
export class BookDetailComponent implements OnInit, AfterViewInit {
	searchForm: FormGroup;
	@ViewChild('searchModal') searchModal;
	@ViewChild('bookReserve') bookReserve;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	bookData: any = {};
	currentUser: any;
	pageSize: 10;
	pageIndex: 0;
	pageEvent: PageEvent;
	bookpagesizeoptions = [10, 25, 50, 100];
	BOOK_LOGS: any[] = [];
	datasource = new MatTableDataSource<any>(this.BOOK_LOGS);
	logdisplayedcolumns = ['sno', 'enrollment_no', 'issued_to', 'class_sec', 'issued_on', 'return_on'];
	totalRecords: number;
	constructor(
		private fbuild: FormBuilder,
		private dialog: MatDialog,
		private route: ActivatedRoute,
		private common: CommonAPIService,
		private router: Router,
		private erpCommonService: ErpCommonService) { }
	ngAfterViewInit() {
		this.datasource.paginator = this.paginator;
		this.datasource.sort = this.sort;
	}
	// @Input() bookInputData;
	ngOnInit() {
		localStorage.removeItem('invoiceBulkRecords');
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		// console.log(this.bookInputData);
		this.buildForm();
		const book_no = this.route.snapshot.queryParams['book_id'];
		if (book_no) {
			this.getBookDetail(book_no);
		}

		this.route.queryParams.subscribe(queryParams => {
			// do something with the query params
			console.log('routeParams', queryParams);
			this.getBookDetail(queryParams.book_id);
		});

	}
	openSearchDialog = (data) => { this.searchModal.openModal(data); }
	// openAdvanceSearchDialog(): void {
	// 	const dialogRef = this.dialog.open(AdvancedSearchModalComponent, {
	// 	  width: '750px',
	// 	});
	
	// 	dialogRef.afterClosed().subscribe(result => {
	// 	  console.log('The dialog was closed');
	// 	});
	//   }

	buildForm() {
		this.searchForm = this.fbuild.group({
			searchId: ''
		});
	}
	getBookDetail(book_no) {
		this.BOOK_LOGS = [];
		this.datasource = new MatTableDataSource<any>(this.BOOK_LOGS);
		this.bookData = {};
		const inputJson = { 'filters': [{ 'filter_type': 'reserv_no', 'filter_value': book_no, 'type': 'text' }], search_from: 'master'  };
		this.erpCommonService.getReservoirDataBasedOnFilter(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.bookData = result.data.resultData[0];
				this.erpCommonService.getBookLogsPerBook({
					book_id: this.bookData.reserv_id,
					page_size: this.pageSize,
					page_index: this.pageIndex
				}).subscribe((res: any) => {
					let i = 0;
					if (res && res.status === 'ok') {
						this.totalRecords = Number(res.data.totalRecords);
						localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
						for (const item of res.data.resultData) {
							for (const titem of item.reserv_user_logs) {
								let prefix = '';
								if (Number(item.user_role_id) === 2) {
									prefix = 'A-';
								} else if (Number(item.user_role_id) === 3) {
									prefix = 'T-';
								} else {
									prefix = 'S-';
								}
								let classSec = '';
								if (Number(item.user_role_id) === 4) {
									if (Number(item.user_sec_id) !== 0) {
										classSec = item.user_class_name + '-' + item.user_sec_name;
									} else {
										classSec = item.user_class_name ;
									}
								} else {
									classSec = '-';
								}

								this.BOOK_LOGS.push({
									sr_no: i + 1,
									enrollment_no: prefix + item.user_login_id,
									issued_to: item.user_full_name,
									class_sec: classSec,
									role_id: item.user_role_id,
									issued_on: item.reserv_user_logs[0].issued_on ? new DatePipe('en-in').transform(item.reserv_user_logs[0].issued_on,  'd-MMM-y') : '-',
									return_on: item.reserv_user_logs[0].returned_on ? new DatePipe('en-in').transform(item.reserv_user_logs[0].returned_on, 'd-MMM-y') : '-'
								});
								i++;
							}
						}
						this.datasource = new MatTableDataSource<any>(this.BOOK_LOGS);
						this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
						this.datasource.sort = this.sort;
						this.datasource.paginator.length = this.paginator.length = this.totalRecords;
						this.datasource.paginator = this.paginator;
						console.log(this.BOOK_LOGS);
					}
				});
			} else {
				this.bookData = {};
			}
		});
	}
	getBookDetail2(book_no) {
		this.BOOK_LOGS = [];
		this.datasource = new MatTableDataSource<any>(this.BOOK_LOGS);
		this.bookData = {};
		this.router.navigate([], { relativeTo: this.route, queryParams: { book_id: book_no }, queryParamsHandling: 'merge' });
		const inputJson = { 'filters': [{ 'filter_type': 'reserv_no', 'filter_value': book_no, 'type': 'number' }],
	    search_from: 'master' };
		this.erpCommonService.getReservoirDataBasedOnFilter(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.bookData = result.data.resultData[0];
				this.erpCommonService.getBookLogsPerBook({
					book_id: this.bookData.reserv_id,
					page_size: this.pageSize,
					page_index: this.pageIndex
				}).subscribe((res: any) => {
					let i = 0;
					if (res && res.status === 'ok') {
						this.totalRecords = Number(res.data.totalRecords);
						localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
						for (const item of res.data.resultData) {
							for (const titem of item.reserv_user_logs) {
								let prefix = '';
								if (Number(item.user_role_id) === 2) {
									prefix = 'A-';
								} else if (Number(item.user_role_id) === 3) {
									prefix = 'T-';
								} else {
									prefix = 'S-';
								}
								let classSec = '';
								if (Number(item.user_role_id) === 4) {
									if (Number(item.user_sec_id) !== 0) {
										classSec = item.user_class_name + '-' + item.user_sec_name;
									} else {
										classSec = item.user_class_name ;
									}
								} else {
									classSec = '-';
								}
								this.BOOK_LOGS.push({
									sr_no: i + 1,
									enrollment_no: prefix + item.user_login_id,
									issued_to: item.user_full_name,
									class_sec: classSec,
									role_id: item.user_role_id,
									issued_on: item.reserv_user_logs[0].issued_on ? new DatePipe('en-in').transform(item.reserv_user_logs[0].issued_on,  'd-MMM-y') : '-',
									return_on: item.reserv_user_logs[0].returned_on ? new DatePipe('en-in').transform(item.reserv_user_logs[0].returned_on, 'd-MMM-y') : '-'
								});
								i++;
							}
						}
						this.datasource = new MatTableDataSource<any>(this.BOOK_LOGS);
						this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
						this.datasource.sort = this.sort;
						this.datasource.paginator.length = this.paginator.length = this.totalRecords;
						this.datasource.paginator = this.paginator;
						console.log(this.BOOK_LOGS);
					}
				});
			} else {
				this.bookData = {};
			}
		});
	}

	reserve_request(item) {
		this.bookReserve.openModal(item);
	}
	fetchData($event) {
		this.pageIndex = $event.pageIndex;
		this.pageSize = $event.pageSize;
		return $event;
	}
	getBookLogsPerPage() {
		this.BOOK_LOGS = [];
		this.datasource = new MatTableDataSource<any>(this.BOOK_LOGS);
		this.erpCommonService.getBookLogsPerBook({
			book_id: this.bookData.reserv_id,
			page_size: this.pageSize,
			page_index: this.pageIndex
		}).subscribe((res: any) => {
			let i = 0;
			if (res && res.status === 'ok') {
				this.totalRecords = Number(res.data.totalRecords);
				localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
				for (const item of res.data.resultData) {
					for (const titem of item.reserv_user_logs) {
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
							class_sec: '',
							role_id: item.user_role_id,
							issued_on: item.reserv_user_logs[0].issued_on ? item.reserv_user_logs[0].issued_on : '-',
							return_on: item.reserv_user_logs[0].returned_on ? item.reserv_user_logs[0].returned_on : '-'
						});
						i++;
					}
				}
				this.datasource = new MatTableDataSource<any>(this.BOOK_LOGS);
				this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
				this.datasource.sort = this.sort;
				this.datasource.paginator.length = this.paginator.length = this.totalRecords;
				this.datasource.paginator = this.paginator;
			}
		});
	}

	searchOk($event) {
		this.common.setDashboardSearchData({filters: $event.filters,
		  generalFilters: $event.generalFilters});
		  this.router.navigate(['../book-search'], {relativeTo: this.route , queryParams : {book_id :this.searchForm.value.searchId }});	
	}
	  
	search() {
	 this.common.setDashboardSearchData({search:this.searchForm.value.searchId});
	 this.router.navigate(['../book-search'], {relativeTo: this.route });
	}

	goToBookSearch() {
		this.router.navigate(['../book-search'], {relativeTo: this.route });
	}
}
