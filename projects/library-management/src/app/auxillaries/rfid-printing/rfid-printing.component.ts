import { Component, OnInit, ViewChild } from '@angular/core';
import { ErpCommonService } from 'src/app/_services';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { MatPaginatorI18n } from '../../library-shared/customPaginatorClass';
@Component({
	selector: 'app-rfid-printing',
	templateUrl: './rfid-printing.component.html',
	styleUrls: ['./rfid-printing.component.css']
})
export class RfidPrintingComponent implements OnInit {
	bookData: any[] = [];
	formGroupArray: any[] = [];
	finalDataArray: any[] = [];
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('bookDet') bookDet;
	@ViewChild('searchModal') searchModal;
	RFID_LIST_ELEMENT: RFIDListElement[] = [];
	rfidlistdataSource = new MatTableDataSource<RFIDListElement>(this.RFID_LIST_ELEMENT);
	displayedRFIDListColumns: string[] = ['srno', 'reserv_id', 'title', 'author', 'location', 'action'];
	constructor(private common: ErpCommonService, private fbuild: FormBuilder) { }
	ngOnInit() {
		this.getReservoirData();
	}
	openBookModal(book_no) {
		this.bookDet.openModal(book_no);
	}
	openSearchDialog = (data) => { this.searchModal.openModal(data);  }
	getReservoirData() {
		this.common.getReservoirData({}).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				let element: any = {};
				this.bookData = [];
				this.formGroupArray = [];
				this.bookData = res.data.resultData;
				
				for (const item of this.bookData) {
					this.formGroupArray.push({
						formGroup: this.fbuild.group({
							reserv_id: item.reserv_id,
							rfid: item.rfid ? item.rfid : ''
						})
					});
				}

				console.log('this.bookData', this.bookData);
				console.log('this.formGroupArray', this.formGroupArray);

				this.RFID_LIST_ELEMENT = [];
				this.rfidlistdataSource = new MatTableDataSource<RFIDListElement>(this.RFID_LIST_ELEMENT);

				let pos = 1;
				let returnedCount = 0;
				for (const item of this.bookData) {
					element = {
						srno: pos,
						reserv_id: item.reserv_id,
						title: item.title,
						author: item.authors,
						location: item.publisher,
						action: item
					};


					this.RFID_LIST_ELEMENT.push(element);
					pos++;

				}
				this.rfidlistdataSource = new MatTableDataSource<RFIDListElement>(this.RFID_LIST_ELEMENT);
				this.rfidlistdataSource.paginator = this.paginator;
				if (this.sort) {
					this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
					this.rfidlistdataSource.sort = this.sort;
				}

			}
		});
	}
	finalSubmit() {
		this.finalDataArray = [];
		for (const item of this.formGroupArray) {
			this.finalDataArray.push(item.formGroup.value);
		}
		this.common.updateRFIDMapping({ rfid_data: this.finalDataArray }).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.getReservoirData();
			}
		});
	}

	applyFilterRFID(filterValue: string) {
		this.rfidlistdataSource.filter = filterValue.trim().toLowerCase();
	}

	searchOk($event) {
		if ($event) {
			this.common.getReservoirDataBasedOnFilter({
				filters: $event.filters,
				generalFilters: $event.generalFilters,
				search_from: 'master'
			}).subscribe((res: any) => {
				if (res && res.status === 'ok') {
					let element: any = {};
					this.bookData = [];
					this.bookData = res.data.resultData;
					this.formGroupArray = [];
					for (const item of this.bookData) {
						this.formGroupArray.push({
							formGroup: this.fbuild.group({
								reserv_id: item.reserv_id,
								rfid: item.rfid ? item.rfid : ''
							})
						});
					}

					console.log('this.bookData', this.bookData);
					console.log('this.formGroupArray', this.formGroupArray);

					this.RFID_LIST_ELEMENT = [];
					this.rfidlistdataSource = new MatTableDataSource<RFIDListElement>(this.RFID_LIST_ELEMENT);

					let pos = 1;
					let returnedCount = 0;
					for (const item of this.bookData) {
						element = {
							srno: pos,
							reserv_id: item.reserv_id,
							title: item.title,
							author: item.authors,
							location: item.publisher,
							action: item
						};


						this.RFID_LIST_ELEMENT.push(element);
						pos++;

					}
					this.rfidlistdataSource = new MatTableDataSource<RFIDListElement>(this.RFID_LIST_ELEMENT);
					this.rfidlistdataSource.paginator = this.paginator;
					if (this.sort) {
						this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
						this.rfidlistdataSource.sort = this.sort;
					}
				}
			});
		}
	}

}

export interface RFIDListElement {
	srno: number;
	reserv_id: string;
	title: string;
	author: string;
	location: string;
	action: any;
}
