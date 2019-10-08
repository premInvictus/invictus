import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ErpCommonService } from 'src/app/_services';
import { MatTableDataSource, MatPaginatorIntl, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { DatePipe } from '@angular/common';
import { MatPaginatorI18n } from '../../library-shared/customPaginatorClass';

@Component({
	selector: 'app-book-reservation',
	templateUrl: './book-reservation.component.html',
	styleUrls: ['./book-reservation.component.css'],
	providers: [
		{ provide: MatPaginatorIntl, useClass: MatPaginatorI18n }
	]
})
export class BookReservationComponent implements OnInit, AfterViewInit {
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('bookDet') bookDet;
	@ViewChild('deleteModal')deleteModal;
	bookpagesize = 10;
	bookpageindex = 0;
	pageEvent: PageEvent;
	bookpagesizeoptions = [10, 25, 50, 100];
	totalRecords: number;
	constructor(private erp: ErpCommonService) { }
	bookdisplayedcolumns: any[] = ['sr_no', 'reserv_id', 'book_name', 'requested_by', 'request_user', 'request_on', 'priority', 'action'];
	RESERVATION_DATA: any[] = [];
	datasource = new MatTableDataSource<any>(this.RESERVATION_DATA);
	ngOnInit() {
		localStorage.removeItem('invoiceBulkRecords');
		this.getBookReservations();
	}
	ngAfterViewInit() {
		this.datasource.paginator = this.paginator;
		this.datasource.sort = this.sort;
	}
	openBookModal(book_no) {
		this.bookDet.openModal(book_no);
	}
	deleteRequest(id) {
		const item:any = {};
		item.id = id;
		item.text = '';
		this.deleteModal.openModal(item);
	}
	getBookReservations() {
		this.RESERVATION_DATA = [];
		this.datasource = new MatTableDataSource<any>(this.RESERVATION_DATA);
		let index = 0;
		this.erp.getBookReservations({
			page_size: this.bookpagesize,
			page_index: this.bookpageindex
		}).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.totalRecords = Number(res.data.totalRecords);
				localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
				for (const item of res.data.resultData) {
					let userRole = '';
					if (Number(item.request_user_role_id) === 2) {
						userRole = 'Staff';
					} else if (Number(item.request_user_role_id) === 3) {
						userRole = 'Teacher';
					} else {
						userRole = 'Student';
					}
					this.RESERVATION_DATA.push({
						'sr_no': index + 1,
						'reserv_id': item.book_details.req_reserv_id,
						'book_name': item.book_details.request_book_title,
						'requested_by': item.request_user_name,
						'request_user': userRole,
						'request_on': item.requested_on.date ? new DatePipe('en-in').transform(item.requested_on.date, 'd-MMM-y') : '-',
						'priority': '-',
						action: item

					});
					index++;
				}
				this.datasource = new MatTableDataSource<any>(this.RESERVATION_DATA);
				this.datasource.paginator.length = this.paginator.length = this.totalRecords;
				this.datasource.paginator = this.paginator;
			}
		});
	}
	fetchData(event?: PageEvent) {
		this.bookpageindex = event.pageIndex;
		this.bookpagesize = event.pageSize;
		this.getBookReservations();
		return event;
	}

}
