import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SisService } from '../../_services';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BarecodeScannerLivestreamComponent } from 'ngx-barcode-scanner';

@Component({
	selector: 'app-change-book-status',
	templateUrl: './change-book-status.component.html',
	styleUrls: ['./change-book-status.component.css']
})
export class ChangeBookStatusComponent implements OnInit, AfterViewInit {
	reasonArray: any[] = [];
	@ViewChild(BarecodeScannerLivestreamComponent) barecodeScanner: BarecodeScannerLivestreamComponent;
	bookData: any[] = [];
	gridView = true;
	barcodeValue;
	enteredVal: any = false;
	changeStatusForm: FormGroup;
	searchForm: FormGroup;
	currentUser: any;
	constructor(private sis: SisService, private common: ErpCommonService,
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
	}
	ngAfterViewInit() {
		this.barecodeScanner.start();
	}
	buildForm() {
		this.changeStatusForm = this.fbuild.group({
			'changed_to': '',
			'reason_id': '',
			'reason_desc': ''
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
		if ($event.target.value) {
			this.enteredVal = true;
			const inputJson = {
				'filters': [{ 'filter_type': 'reserv_id', 'filter_value': Number($event.target.value), 'type': 'number' }],
				'search_from': 'master',
				'search_type': 'cbs'
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
		if (this.changeStatusForm.valid) {
			const bookId: any[] = [];
			for (const item of this.bookData) {
				bookId.push(Number(item.reserv_id));
			}
			this.common.changeReservoirStatus({
				bookDetails: bookId,
				changedDetails: this.changeStatusForm.value
			}).subscribe((res: any) => {
				if (res && res.status === 'ok') {
					this.notif.showSuccessErrorMessage(res.message, 'success');
					this.changeStatusForm.reset();
					this.bookData = [];
				} else {
					this.notif.showSuccessErrorMessage(res.message, 'error');
					this.changeStatusForm.reset();
					this.bookData = [];
				}
			});
		}
	}

	removeBookFromList(index) {
		this.bookData.splice(index,1);
	}
}
