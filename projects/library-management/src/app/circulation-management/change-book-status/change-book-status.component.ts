import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SisService, SmartService } from '../../_services';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BarecodeScannerLivestreamComponent } from 'ngx-barcode-scanner';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-change-book-status',
	templateUrl: './change-book-status.component.html',
	styleUrls: ['./change-book-status.component.css']
})
export class ChangeBookStatusComponent implements OnInit, AfterViewInit {
	reasonArray: any[] = [];
	@ViewChild(BarecodeScannerLivestreamComponent) barecodeScanner: BarecodeScannerLivestreamComponent;
	@ViewChild('searchModal') searchModal;
	bookData: any[] = [];
	gridView = true;
	issuedFlag = false;
	barcodeValue;
	disableApiCall = false;
	enteredVal: any = false;
	changeStatusForm: FormGroup;
	searchForm: FormGroup;
	sectionArray: any[] = [];
	currentUser: any;
	classArray: any[] = [];
	booktypeArray: any[] = [{
		type_id: '1',
		type_name: 'General',
	},
	{
		type_id: '2',
		type_name: 'Reference',
	},
	{
		type_id: '3',
		type_name: 'Periodical',
	},
	{
		type_id: '4',
		type_name: 'Sample',
	}];
	accessionTypeArray: any[] = [{
		type_id: 'G',
		type_name: 'General',
	},
	{
		type_id: 'S',
		type_name: 'Specimen',
	}];
	filterArray: any[] = [
		{
			filter_type: '1',
			filter_name: 'Book Type'
		},
		{
			filter_type: '2',
			filter_name: 'Status'
		},
		{
			filter_type: '3',
			filter_name: 'Source'
		},
		{
			filter_type: '4',
			filter_name: 'Location'
		},
		{
			filter_type: '5',
			filter_name: 'Accession Type'
		}
	];
	sourceArray: any[] = [
		{
			type_id: 'Purchased',
			type_name: 'Purchased',
		},
		{
			type_id: 'Donated',
			type_name: 'Donated',
		},
		{
			type_id: 'Gifted',
			type_name: 'Gifted',
		},
		{
			type_id: 'Specimen',
			type_name: 'Specimen',
		}
	];

	constructor(private sis: SisService, private common: ErpCommonService,
		private smart: SmartService,
		private notif: CommonAPIService,
		private fbuild: FormBuilder) { }
	statusArray: any[] = [
		{
			type_id: 'available',
			type_name: 'Available'
		},
		{
			type_id: 'read-only',
			type_name: 'Read Only'
		},
		{
			type_id: 'damaged',
			type_name: 'Damaged'
		},
		{
			type_id: 'under-maintain',
			type_name: 'Under Maintanance'
		},
		{
			type_id: 'marked-return',
			type_name: 'Marked for return'
		}
	];
	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.getReasons();
		this.buildForm();
		this.getClass();
	}
	getSectionByClass($event) {
		this.sis.getSectionsByClass({
			'class_id': $event.value
		}).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.sectionArray = [];
				this.sectionArray = res.data;
			}
		});
	}
	ngAfterViewInit() {
		this.barecodeScanner.start();
	}
	getClass() {
		this.smart.getClass({}).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.classArray = [];
				this.classArray = res.data;
			}
		});
	}
	openSearchDialog = (data) => this.searchModal.openModal(data);
	buildForm() {
		this.changeStatusForm = this.fbuild.group({
			'changed_to': '',
			'reason_id': '',
			'reason_desc': '',
			'location_type': '',
			'location_class_id': '',
			'location_sec_id': '',
			'location_class_name': '',
			'location_sec_name': '',
			'stack': '',
			'row': '',
			'source': '',
			'category_id': '',
			'accession_type':'',
			'filters': ''

		});
		this.searchForm = this.fbuild.group({
			search: '',
			page_size: 1,
			page_index: 0,
			role_id: this.currentUser.role_id
		});
	}
	getReasons() {
		this.sis.getReason({ reason_type: 12 }).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.reasonArray = [];
				this.reasonArray = res.data;
			}
		});
	}
	onValueChanges(result) {
		this.barcodeValue = result.codeResult.code;
		this.searchForm.value.search = this.barcodeValue;
		const inputJson = {
			'filters': [{ 'filter_type': 'reserv_id', 'filter_value': Number(this.barcodeValue), 'type': 'number' }],
			'search_from': 'master',
			'generalFilters': {
				"reserv_status": this.issuedFlag ? [
					"issued"
				] : ["available",
						"flagged",],
			},
			'search_type': 'cbs'
		};
		this.common.getReservoirDataBasedOnFilter(inputJson).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				for (const item of res.data.resultData) {
					item.book_container_class = 'book-title-container-default';
					const findex = this.bookData.findIndex(f => Number(f.reserv_id) === Number(this.barcodeValue));
					if (findex === -1) {
						this.bookData.push(item);
					}
				}
				console.log(this.bookData);
				this.searchForm.patchValue(
					{
						search: ''
					}
				);
			} else {
				this.notif.showSuccessErrorMessage(res.message, 'error');
			}
		});
	}
	searchBook($event) {
		this.bookData = [];
		if ($event.target.value) {
			this.bookData = [];
			this.enteredVal = true;
			let inputJson = {
				'filters': [{ 'filter_type': 'reserv_no', 'filter_value': this.searchForm.value.search, 'type': 'text' }],
				'generalFilters': {
					"reserv_status": this.issuedFlag ? [
						"issued"
					] : ["available",
							"flagged",],
				},
				search_from: 'master'
			};
			this.common.getReservoirDataBasedOnFilter(inputJson).subscribe((res: any) => {
				if (res && res.status === 'ok') {
					for (const item of res.data.resultData) {
						item.book_container_class = 'book-title-container-default';
						const findex = this.bookData.findIndex(f => Number(f.reserv_id) === Number($event.target.value));
						if (findex === -1) {
							this.bookData.push(item);
						}
					}
					console.log(this.bookData);
					this.searchForm.patchValue({
						search: ''
					});
				} else {
					this.notif.showSuccessErrorMessage(res.message, 'error');
				}
			});
		} else {
			this.enteredVal = false;
			this.searchForm.patchValue({
				search: ''
			});
		}
	}
	searchOk($event) {
		this.bookData = [];
		let i = 0;
		if ($event) {
			this.common.getReservoirDataBasedOnFilter({
				filters: $event.filters,
				generalFilters: $event.generalFilters,
				search_from: 'master'
			}).subscribe((res: any) => {
				if (res && res.status === 'ok') {
					for (const item of res.data.resultData) {
						item.book_container_class = 'book-title-container-default';
						this.bookData.push(item);
					}
				}
			});
		}
	}
	issueOnly($event) {
		if ($event.checked) {
			this.issuedFlag = true;
			this.bookData = [];
			this.statusArray = [
				{
					type_id: 'available',
					type_name: 'Available'
				}
			];
		} else {
			this.issuedFlag = false;
			this.bookData = [];
			this.statusArray = [
				{
					type_id: 'available',
					type_name: 'Available'
				},
				{
					type_id: 'read-only',
					type_name: 'Read Only'
				},
				{
					type_id: 'damaged',
					type_name: 'Damaged'
				},
				{
					type_id: 'under-maintain',
					type_name: 'Under Maintanance'
				},
				{
					type_id: 'marked-return',
					type_name: 'Marked for return'
				}
			];
		}
	}
	intitiateSearch() {
		document.getElementById('search_book').focus();
	}
	showSecondDetailDiv(index) {
		this.bookData[index].book_container_class = 'book-title-container-clicked';
	}
	showFirstDetailDiv(index) {
		this.bookData[index].book_container_class = 'book-title-container-default';
	}
	changeReservoirStatus() {
		let valid = false;
		if (this.changeStatusForm.value.filters === '5') {
			if (this.changeStatusForm.value.accession_type
				&& this.changeStatusForm.value.reason_id
				&& this.changeStatusForm.value.reason_desc) {
				valid = true;
			} else {
				valid = false
			}
		} else if (this.changeStatusForm.value.filters === '1') {
			if (this.changeStatusForm.value.category_id
				&& this.changeStatusForm.value.reason_id
				&& this.changeStatusForm.value.reason_desc) {
				valid = true;
			} else {
				valid = false
			}
		}
		else if (this.changeStatusForm.value.filters === '2') {
			if (this.changeStatusForm.value.changed_to
				&& this.changeStatusForm.value.reason_id
				&& this.changeStatusForm.value.reason_desc) {
				valid = true;
			} else {
				valid = false
			}
		}
		else if (this.changeStatusForm.value.filters === '3') {
			if (this.changeStatusForm.value.source
				&& this.changeStatusForm.value.reason_id
				&& this.changeStatusForm.value.reason_desc) {
				valid = true;
			} else {
				valid = false
			}
		}
		else if (this.changeStatusForm.value.filters === '4') {
			if (this.changeStatusForm.value.location_type) {
				if (this.changeStatusForm.value.location_type === 'class') {
					if (this.changeStatusForm.value.location_class_id &&
						this.changeStatusForm.value.location_sec_id
						&& this.changeStatusForm.value.reason_id
						&& this.changeStatusForm.value.reason_desc) {
						valid = true;
					} else {
						valid = false
					}
				}
				if (this.changeStatusForm.value.location_type === 'library') {
					if (this.changeStatusForm.value.row &&
						this.changeStatusForm.value.stack
						&& this.changeStatusForm.value.reason_id
						&& this.changeStatusForm.value.reason_desc) {
						valid = true;
					} else {
						valid = false
					}
				}
			} else {
				valid = false;
			}
		}
		if (valid) {
			this.disableApiCall = true;
			const bookId: any[] = [];
			const bookStatus: any[] = [];
			for (const item of this.bookData) {
				bookId.push(Number(item.reserv_id));
				bookStatus.push(item.reserv_status);
			}
			this.common.changeReservoirStatus({
				bookDetails: bookId,
				changedDetails: this.changeStatusForm.value,
				bookStatus: bookStatus,
				returnDate: new DatePipe('en-in').transform(new Date(), 'yyyy-MM-dd'),
				retunedBy: {
					name: this.currentUser.full_name,
					login_id: this.currentUser.login_id
				}
			}).subscribe((res: any) => {
				if (res && res.status === 'ok') {
					this.notif.showSuccessErrorMessage(res.message, 'success');
					this.changeStatusForm.reset();
					this.bookData = [];
					this.disableApiCall = false;
				} else {
					this.notif.showSuccessErrorMessage(res.message, 'error');
					this.changeStatusForm.reset();
					this.bookData = [];
					this.disableApiCall = false;
				}
			});
		}
	}
	resetFilters() {
		this.changeStatusForm.patchValue({
			'changed_to': '',
			'reason_id': '',
			'reason_desc': '',
			'location_type': '',
			'location_class_id': '',
			'location_sec_id': '',
			'location_class_name': '',
			'location_sec_name': '',
			'stack': '',
			'row': '',
			'source': '',
			'category_id': '',
			'accession_type':''
		});
	}

	removeBookFromList(index) {
		this.bookData.splice(index, 1);
	}
	setClassLocation(event) {
		this.changeStatusForm.patchValue({
			'location_class_name': event ? event : ''
		});
	}

	setSectionLocation(event) {
		this.changeStatusForm.patchValue({
			'location_sec_name': event ? event : ''
		});
	}
}
