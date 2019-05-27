import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { ChequeToolElement } from './cheque-control-tool.model';
import { FeeService, CommonAPIService } from '../../_services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BouncedChequeModalComponent } from './bounced-cheque-modal/bounced-cheque-modal.component';
import { InvoiceDetailsModalComponent } from '../../feemaster/invoice-details-modal/invoice-details-modal.component';
import { ReceiptDetailsModalComponent } from '../../sharedmodule/receipt-details-modal/receipt-details-modal.component';
@Component({
	selector: 'app-cheque-control-tool',
	templateUrl: './cheque-control-tool.component.html',
	styleUrls: ['./cheque-control-tool.component.scss']
})
export class ChequeControlToolComponent implements OnInit, AfterViewInit {
	@ViewChild('paginator') paginator: MatPaginator;
	displayedColumns: string[] =
		['srno', 'invoiceno', 'chequeno', 'admno', 'studentname', 'recieptno', 'amount', 'bankname', 'recieptdate', 'processingdate', 'action'];
	CHEQUE_ELEMENT_DATA: ChequeToolElement[] = [];
	dataSource = new MatTableDataSource<ChequeToolElement>(this.CHEQUE_ELEMENT_DATA);
	formGroupArray: any[] = [];
	filterForm: FormGroup;
	status: any[] = [{ status: '0', value: 'Pending' }, { status: '1', value: 'Cleared' }, { status: '2', value: 'Bounced' }];
	toggleSearch = false;
	processTypeArray: any[] = [
		{ id: '1', name: 'Enquiry No.' },
		{ id: '2', name: 'Registration No.' },
		{ id: '3', name: 'Provisional Admission No.' },
		{ id: '4', name: 'Admission No.' },
		{ id: '5', name: 'Alumni No.' }
	];
	totalRecords: number;
	constructor(public feeService: FeeService,
		private fbuild: FormBuilder,
		private common: CommonAPIService,
		public dialog: MatDialog) { }

	ngOnInit() {
		this.buildForm();
		this.getChequeControlListAll();
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
	}
	applyFilter(value: any) {
		this.dataSource.filter = value.trim().toLowerCase();
	}
	buildForm() {
		this.filterForm = this.fbuild.group({
			'inv_process_type': '',
			'invoice_no': '',
			'pageSize': '10',
			'pageIndex': '0',
			'au_full_name': '',
			'from_date': '',
			'to_date': '',
			'status': ''
		});
	}

	openBounced(item): void {
		const dialogRef = this.dialog.open(BouncedChequeModalComponent, {
			data: item,
			width: '800px',
			height: '50%',
			hasBackdrop: true,
			disableClose: true
		});

		dialogRef.afterClosed().subscribe(result => {
			this.getChequeControlListAll();
		});


	}

	getChequeControlListAll() {
		this.formGroupArray = [];
		this.CHEQUE_ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<ChequeToolElement>(this.CHEQUE_ELEMENT_DATA);
		this.feeService.getCheckControlList(this.filterForm.value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				let pos = 1;
				const temparray = result.data.reportData ? result.data.reportData : [];
				this.totalRecords = Number(result.data.totalRecords);
				localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
				for (const item of temparray) {
					this.CHEQUE_ELEMENT_DATA.push({
						srno: pos,
						invoiceno: item.invoice_no ? item.invoice_no : 'NA',
						chequeno: item.cheque_no,
						admno: item.inv_process_usr_no,
						studentname: item.au_full_name,
						recieptno: item.receipt_id,
						amount: item.receipt_amount,
						bankname: item.bank_name,
						recieptdate: new DatePipe('en-in').transform(item.transaction_date, 'd-MMM-y'),
						processingdate: '',
						action: item
					});
					this.formGroupArray.push({
						formGroup: this.fbuild.group({
							'fcc_ftr_id': '',
							'fcc_process_date': '',
							'fcc_status': 'c',
							'fcc_inv_id': ''
						})
					});
					pos++;
				}
				this.dataSource = new MatTableDataSource<ChequeToolElement>(this.CHEQUE_ELEMENT_DATA);
				this.dataSource.paginator.length = this.paginator.length = this.totalRecords;
				this.dataSource.paginator = this.paginator;
			}
		});
	}
	clearCheck(index: any, value: any) {
		this.formGroupArray[Number(index) - 1].formGroup.value.fcc_process_date = new DatePipe('en-in').
			transform(this.formGroupArray[Number(index) - 1].formGroup.value.fcc_process_date, 'yyyy-MM-dd');
		this.formGroupArray[Number(index) - 1].formGroup.value.fcc_ftr_id = value.fee_transaction_id;
		this.formGroupArray[Number(index) - 1].formGroup.value.fcc_inv_id = value.invoice_id;
		if (this.formGroupArray[Number(index) - 1].formGroup.value.fcc_process_date) {
			this.feeService.addCheckControlTool(this.formGroupArray[Number(index) - 1].formGroup.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.getChequeControlListAll();
				}
			});
		} else {
			this.common.showSuccessErrorMessage('Please choose date for cleareance', 'error');
		}
	}
	getFilteredValue() {
		this.filterForm.value.from_date = new DatePipe('en-in').
			transform(this.filterForm.value.from_date, 'yyyy-MM-dd');
		this.filterForm.value.to_date = new DatePipe('en-in').
			transform(this.filterForm.value.to_date, 'yyyy-MM-dd');
		this.CHEQUE_ELEMENT_DATA = [];
		this.formGroupArray = [];
		this.dataSource = new MatTableDataSource<ChequeToolElement>(this.CHEQUE_ELEMENT_DATA);
		this.feeService.getCheckControlList(this.filterForm.value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				let pos = 1;
				const temparray = result.data.reportData ? result.data.reportData : [];
				this.totalRecords = Number(result.data.totalRecords);
				localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
				for (const item of temparray) {
					this.CHEQUE_ELEMENT_DATA.push({
						srno: pos,
						invoiceno: item.invoice_no ? item.invoice_no : 'NA',
						chequeno: item.cheque_no,
						admno: item.inv_process_usr_no,
						studentname: item.au_full_name,
						recieptno: item.receipt_id,
						amount: item.receipt_amount,
						bankname: item.bank_name,
						recieptdate: new DatePipe('en-in').transform(item.transaction_date, 'd-MMM-y'),
						processingdate: '',
						action: item
					});
					this.formGroupArray.push({
						formGroup: this.fbuild.group({
							'fcc_ftr_id': '',
							'fcc_process_date': '',
							'fcc_status': 'c',
							'fcc_inv_id': ''
						})
					});
					pos++;
				}
				this.dataSource = new MatTableDataSource<ChequeToolElement>(this.CHEQUE_ELEMENT_DATA);
				this.dataSource.paginator = this.paginator;
			}
		});
	}
	enableSearch($event) {
		if ($event.checked) {
			this.toggleSearch = true;
		} else {
			this.toggleSearch = false;
		}
	}
	openDialog(invoiceNo, edit): void {
		const dialogRef = this.dialog.open(InvoiceDetailsModalComponent, {
			width: '80%',
			height: '80vh',
			data: {
				invoiceNo: invoiceNo,
				edit: edit
			},
			hasBackdrop: true
		});
	}
	openReceiptDialog(invoiceNo, edit): void {
		const dialogRef = this.dialog.open(ReceiptDetailsModalComponent, {
			width: '80%',
			height: '80vh',
			data: {
				invoiceNo: invoiceNo,
				edit: edit
			},
			hasBackdrop: true
		});
	}
	fetchData(event?: PageEvent) {
		this.filterForm.value.pageIndex = event.pageIndex;
		this.filterForm.value.pageSize = event.pageSize;
		this.getChequeControlListAll();
		return event;
	}
	reset() {
		this.filterForm.patchValue({
			'inv_process_type': '',
			'invoice_no': '',
			'pageSize': '10',
			'pageIndex': '0',
			'au_full_name': '',
			'from_date': '',
			'to_date': '',
			'status': ''
		});
		this.getChequeControlListAll();
	}
}
