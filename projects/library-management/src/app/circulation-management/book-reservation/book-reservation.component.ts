import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ErpCommonService } from 'src/app/_services';
import { MatTableDataSource, MatPaginatorIntl, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { DatePipe } from '@angular/common';
import { MatPaginatorI18n } from '../../library-shared/customPaginatorClass';
import { CommonAPIService } from '../../_services';

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
	@ViewChild('deleteModal') deleteModal;
	bookpagesize = 10;
	bookpageindex = 0;
	pageEvent: PageEvent;
	bookpagesizeoptions = [10, 25, 50, 100];
	totalRecords: number;
	constructor(private erp: ErpCommonService, private common: CommonAPIService) { }
	bookdisplayedcolumns: any[] = ['sr_no', 'request_id', 'reserv_id', 'book_name', 'requested_by', 'request_user', 'request_on', 'priority', 'action'];
	RESERVATION_DATA: any[] = [];
	datasource = new MatTableDataSource<any>(this.RESERVATION_DATA);
	delMessage = '';
	delText = '';
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
		const iteml: any = {
			data: id,
			from: 'delete'
		}
		this.delMessage = 'Do you want to delete';
		this.delText = 'Delete Request';
		this.deleteModal.openModal(iteml);
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
						'request_id': item.requested_id,
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
				this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
				this.datasource.sort = this.sort;
				this.datasource.paginator.length = this.paginator.length = this.totalRecords;
				this.datasource.paginator = this.paginator;
			}
		});
	}
	filterVal(val: string) {
		this.datasource.filter = val.trim().toLowerCase();
	}
	fetchData(event?: PageEvent) {
		this.bookpageindex = event.pageIndex;
		this.bookpagesize = event.pageSize;
		this.getBookReservations();
		return event;
	}
	deleteOk($event) {
		if ($event && $event.from === 'delete') {
			this.erp.deleteReservationData({
				requested_id: $event.data
			}).subscribe((res: any) => {
				if (res && res.status === 'ok') {
					this.common.showSuccessErrorMessage(res.message, 'success');
					this.getBookReservations();
				}
			});
		} else {
			this.erp.updateReservationData({
				request_details: $event.data
			}).subscribe((res: any) => {
				this.common.showSuccessErrorMessage(res.message, 'success');
				this.getBookReservations();
			});
		}
	}
	deleteCancel($event) {
		if ($event) {
			this.deleteModal.closeDialog();
		}
	}
	approveRequest(item) {
		this.delMessage = 'Do you want to Approve';
		this.delText = 'Approve Request';
		const iteml: any = {
			data: item,
			from: 'approve'
		}
		this.deleteModal.openModal(iteml);
	}

}
