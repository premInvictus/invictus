import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent, MatTableDataSource, MatPaginator } from '@angular/material';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-book-search',
	templateUrl: './book-search.component.html',
	styleUrls: ['./book-search.component.css']
})
export class BookSearchComponent implements OnInit, AfterViewInit {
	searchFlag = false;
	bookData: any[] = [];
	BOOK_ELEMENT_DATA: any[] = [];
	bookDataSource = new MatTableDataSource<any>(this.BOOK_ELEMENT_DATA);
	@ViewChild('searchModal') searchModal;
	@ViewChild('paginator') paginator: MatPaginator;
	filters: any = {};
	bookpagesize = 100;
	pageEvent: PageEvent;
	bookpageindex = 0;
	bookpagesizeoptions = [100, 300, 500, 1000];
	gridView = true;
	enteredVal: any = false;
	statusArray: any[] = [
		{
			type_id: '1',
			type_name: 'Available',
		},
		{
			type_id: '2',
			type_name: 'Issued',
		},
		{
			type_id: '3',
			type_name: 'Reserved',
		},
		{
			type_id: '4',
			type_name: 'Flagged',
		}
	];
	gridViewClass = 'btn-success-blue-btn';
	listViewClass = 'default-view-button btn-spacer';
	searchForm: FormGroup;
	totalRecords: number;
	filteredFlag = false;
	searchViaSearch = false;
	searchViaText = false;
	currentUser: any = {};
	accession_type;
	constructor(private common: ErpCommonService,
		private route: ActivatedRoute,
		private router: Router,
		private fbuild: FormBuilder,
		private notif: CommonAPIService) { }

	ngOnInit() {
		this.builForm();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		var dashboardSearchData = this.notif.getDashboardSearchData();
		console.log('this.common.setDashboardSearchData', this.notif.getDashboardSearchData())
		if (dashboardSearchData && dashboardSearchData.filters) {
			this.filters.filters = dashboardSearchData.filters;
			this.filters.generalFilters = dashboardSearchData.generalFilters;
			this.getReservoirDataBasedOnFilter();
		} else if (dashboardSearchData && dashboardSearchData.search) {			
			this.searchForm.patchValue({
				search: dashboardSearchData.search,
				page_size: this.bookpagesize,
				page_index: this.bookpageindex,
				role_id: this.currentUser.role_id
			});
			this.searchBook();
		}
		
	}
	ngAfterViewInit() {
		this.bookDataSource.paginator = this.paginator;
	}
	builForm() {
		this.searchForm = this.fbuild.group({
			search: '',
			page_size: this.bookpagesize,
			page_index: this.bookpageindex,
			role_id: this.currentUser.role_id
		});
	}
	openBookDetails(id) {
		this.router.navigate(['../book-detail'], { queryParams: { book_id: id }, relativeTo: this.route });
	}
	searchBook() {
		this.searchForm.patchValue({
			page_size: 10,
			page_index: 0,
			role_id: this.currentUser.role_id
		})
		this.filters = {};
		this.searchFlag = false;
		this.BOOK_ELEMENT_DATA = [];
		this.bookDataSource = new MatTableDataSource<any>(this.BOOK_ELEMENT_DATA);
		if (this.searchForm.value.search) {
			this.bookData = [];
			this.enteredVal = true;
			this.common.searchReservoir(this.searchForm.value).subscribe((res: any) => {
				if (res && res.data.resultData) {
					this.searchViaText = true;
					this.searchViaSearch = false;
					this.totalRecords = Number(res.data.totalRecords);
					localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
					for (const item of res.data.resultData) {
						item.book_container_class = 'book-title-container-default';
						
						this.BOOK_ELEMENT_DATA.push(item);
					}
					this.searchFlag = true;
					this.bookDataSource = new MatTableDataSource<any>(this.BOOK_ELEMENT_DATA);
					this.bookDataSource.paginator = this.paginator;
					this.bookDataSource.paginator.length = this.paginator.length = this.totalRecords;
					
				}
			});
		} else {
			this.searchForm.patchValue(
				{
					'search': ''
				}
			);
			this.enteredVal = false;
			this.BOOK_ELEMENT_DATA = [];
			this.bookDataSource = new MatTableDataSource<any>(this.BOOK_ELEMENT_DATA);
		}
	}
	searchBookFilter() {
		this.filters = {};
		this.searchFlag = false;
		this.BOOK_ELEMENT_DATA = [];
		this.bookDataSource = new MatTableDataSource<any>(this.BOOK_ELEMENT_DATA);
		if (this.searchForm.value.search) {
			this.bookData = [];
			this.enteredVal = true;
			this.common.searchReservoir(this.searchForm.value).subscribe((res: any) => {
				if (res && res.data.resultData) {
					this.searchViaText = true;
					this.searchViaSearch = false;
					this.totalRecords = Number(res.data.totalRecords);
					localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
					for (const item of res.data.resultData) {
						item.book_container_class = 'book-title-container-default';
						this.BOOK_ELEMENT_DATA.push(item);
					}
					this.searchFlag = true;
					this.bookDataSource = new MatTableDataSource<any>(this.BOOK_ELEMENT_DATA);
					this.bookDataSource.paginator.length = this.paginator.length = this.totalRecords;
					this.bookDataSource.paginator = this.paginator;
				}
			});
		} else {
			this.searchForm.patchValue(
				{
					'search': ''
				}
			);
			this.enteredVal = false;
			this.BOOK_ELEMENT_DATA = [];
			this.bookDataSource = new MatTableDataSource<any>(this.BOOK_ELEMENT_DATA);
		}
	}
	intitiateSearch() {
		document.getElementById('search_book').focus();
	}
	setView(flag) {
		this.gridView = flag;
		if (flag) {
			this.gridViewClass = 'btn-success-blue-btn';
			this.listViewClass = 'default-view-button btn-spacer';
		} else {
			this.gridViewClass = 'default-view-button';
			this.listViewClass = 'btn-success-blue-btn btn-spacer';
		}
	}
	openSearchDialog = (data) => {this.searchForm.patchValue({search: ''});this.searchModal.openModal(data);};
	showSecondDetailDiv(index) {
		this.BOOK_ELEMENT_DATA[index].book_container_class = 'book-title-container-clicked';
	}
	showFirstDetailDiv(index) {
		this.BOOK_ELEMENT_DATA[index].book_container_class = 'book-title-container-default';
	}
	getReserv_status(id) {
		const findex = this.statusArray.findIndex(f => f.type_id === id);
		if (findex !== -1) {
			return this.statusArray[findex].type_name;
		}
	}
	searchOk($event) {
		this.BOOK_ELEMENT_DATA = [];
		this.filteredFlag = false;
		this.searchFlag = false;
		this.filters = {};
		let i = 0;
		localStorage.removeItem('invoiceBulkRecords');
		this.bookDataSource = new MatTableDataSource<any>(this.BOOK_ELEMENT_DATA);
		if ($event) {
			this.filters = $event;
			this.filteredFlag = true;
			this.searchViaText = false;
			this.searchViaSearch = true;
			let inputJSON: any = {};
			if (Number(this.currentUser.role_id) === 2) {
				inputJSON = {
					filters: $event.filters,
					generalFilters: $event.generalFilters,
					page_index: this.bookpageindex,
					page_size: this.bookpagesize,
					search_from: 'master'
				};
			} else {
				inputJSON = {
					filters: $event.filters,
					generalFilters: $event.generalFilters,
					page_index: this.bookpageindex,
					page_size: this.bookpagesize
				};
			}
			this.common.getReservoirDataBasedOnFilter(inputJSON).subscribe((res: any) => {
				if (res && res.status === 'ok') {
					this.searchFlag = true;
					this.totalRecords = Number(res.data.totalRecords);
					localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
					for (const item of res.data.resultData) {
						let authName = '';
						for (const aut of item.authors) {
							authName = new TitleCasePipe().transform(aut) + ',';
						}
						authName = authName.substring(0, authName.length - 2);
						item.book_container_class = 'book-title-container-default';
						this.BOOK_ELEMENT_DATA.push(item);
						i++;
					}
					this.bookDataSource = new MatTableDataSource<any>(this.BOOK_ELEMENT_DATA);
					this.bookDataSource.paginator.length = this.paginator.length = this.totalRecords;
					this.bookDataSource.paginator = this.paginator;
				}
			});
		}
	}
	fetchData(event?: PageEvent) {
		this.bookpageindex = event.pageIndex;
		this.bookpagesize = event.pageSize;
		this.searchForm.patchValue({
			page_index: this.bookpageindex,
			page_size: this.bookpagesize
		});
		if (this.searchViaSearch) {
			this.getReservoirDataBasedOnFilter();
		} else {
			this.searchBookFilter();
		}
		return event;
	}
	getReservoirDataBasedOnFilter() {
		let i = 0;
		this.BOOK_ELEMENT_DATA = [];
		this.searchFlag = false;
		let inputJSON: any = {};
		if (Number(this.currentUser.role_id) === 2) {
			inputJSON = {
				filters: this.filters.filters,
				generalFilters: this.filters.generalFilters,
				page_index: this.bookpageindex,
				page_size: this.bookpagesize,
				search_from: 'master'
			};
		} else {
			inputJSON = {
				filters: this.filters.filters,
				generalFilters: this.filters.generalFilters,
				page_index: this.bookpageindex,
				page_size: this.bookpagesize
			};
		}
		this.common.getReservoirDataBasedOnFilter(inputJSON).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.searchFlag = true;
				this.searchViaText = false;
				this.searchViaSearch = true;
				this.totalRecords = Number(res.data.totalRecords);
				localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
				for (const item of res.data.resultData) {
					let authName = '';
					for (const aut of item.authors) {
						authName = new TitleCasePipe().transform(aut) + ',';
					}
					authName = authName.substring(0, authName.length - 2);
					item.book_container_class = 'book-title-container-default';
					this.BOOK_ELEMENT_DATA.push(item);
					i++;
				}
				this.bookDataSource = new MatTableDataSource<any>(this.BOOK_ELEMENT_DATA);
				this.bookDataSource.paginator.length = this.paginator.length = this.totalRecords;
				this.bookDataSource.paginator = this.paginator;
			}
		});
	}
}
