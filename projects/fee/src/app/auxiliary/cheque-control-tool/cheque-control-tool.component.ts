import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, PageEvent, MatPaginatorIntl } from '@angular/material';
import { ChequeToolElement } from './cheque-control-tool.model';
import { SelectionModel } from '@angular/cdk/collections';
import { FeeService, CommonAPIService } from '../../_services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatPaginatorI18n } from '../../sharedmodule/customPaginatorClass';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BouncedChequeModalComponent } from './bounced-cheque-modal/bounced-cheque-modal.component';
import { InvoiceDetailsModalComponent } from '../../feemaster/invoice-details-modal/invoice-details-modal.component';
import { ReceiptDetailsModalComponent } from '../../sharedmodule/receipt-details-modal/receipt-details-modal.component';
import { CapitalizePipe } from '../../_pipes';
import { BouncedChequeMultipleComponent } from './bounced-cheque-multiple/bounced-cheque-multiple.component';
@Component({
	selector: 'app-cheque-control-tool',
	templateUrl: './cheque-control-tool.component.html',
	styleUrls: ['./cheque-control-tool.component.scss'],
	providers: [
		{ provide: MatPaginatorIntl, useClass: MatPaginatorI18n }
	]
})
export class ChequeControlToolComponent implements OnInit, AfterViewInit {
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild('deleteModal') deleteModal;
	displayedColumns: string[] =
		['srno', 'recieptdate', 'recieptno', 'amount', 'chequeno', 'bankname', 'bankdeposite',
			'processingdate', 'status',
			'entered_by', 'approved_by',
			'admno', 'studentnam', 'class_name',
			'action', 'remarks'];
	CHEQUE_ELEMENT_DATA: ChequeToolElement[] = [];
	dataSource = new MatTableDataSource<ChequeToolElement>(this.CHEQUE_ELEMENT_DATA);
	selection = new SelectionModel<ChequeToolElement>(true, []);
	formGroupArray: any[] = [];
	filterForm: FormGroup;
	status: any[] = [{ status: '0', value: 'Pending' }, { status: '1', value: 'Cleared' }, { status: '2', value: 'Dishonoured' }];
	toggleSearch = false;
	pageEvent: PageEvent;
	checkboxLength = 0;
	processTypeArray: any[] = [
		{ id: '1', name: 'Enquiry No.' },
		{ id: '2', name: 'Registration No.' },
		{ id: '3', name: 'Provisional Admission No.' },
		{ id: '4', name: 'Admission No.' },
		{ id: '5', name: 'Alumni No.' }
	];
	totalRecords: number;
	currentUser: any;
	constructor(public feeService: FeeService,
		private fbuild: FormBuilder,
		private common: CommonAPIService,
		public dialog: MatDialog) { }

	ngOnInit() {
		localStorage.removeItem('invoiceBulkRecords');
		this.buildForm();
		this.getChequeControlListAll();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		const filterModal = document.getElementById('formFlag');
		filterModal.style.display = 'none';
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
			'inv_process_usr_no': '',
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


	openCheckOperationModal(item): void {
		const dialogRef = this.dialog.open(BouncedChequeModalComponent, {
			data: item,
			width: '800px',
			height: '500px',
			hasBackdrop: true,
			disableClose: true
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result.status === '1') {
				this.getChequeControlListAll();
			}
		});
	}


	openMultipleBounced(item): void {
		const dialogRef = this.dialog.open(BouncedChequeMultipleComponent, {
			data: item,
			width: '800px',
			height: '30%',
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
						srno: item,
						class_name: item.sec_id !== '0' ? (item.class_name + ' - ' + item.sec_name) : (item.class_name),
						chequeno: item.cheque_no,
						admno: item.inv_process_usr_no,
						studentname: item.au_full_name,
						recieptno: item.receipt_no,
						amount: item.receipt_amount,
						bankname: item.bank_name,
						entered_by: item.created_by,
						approved_by: item.approved_by ? item.approved_by : '-',
						recieptdate: new DatePipe('en-in').transform(item.transaction_date, 'd-MMM-y'),
						bankdeposite: item.fcc_deposite_date ? this.common.dateConvertion(item.fcc_deposite_date, 'd-MMM-y') : '-',
						processingdate: item.fcc_process_date ? this.common.dateConvertion(item.fcc_process_date, 'd-MMM-y') : '-',
						remarks: item.fcc_remarks ? new CapitalizePipe().transform(item.fcc_remarks) : '-',
						action: item,
						ftr_family_number: item.ftr_family_number ? item.ftr_family_number : '',
						selectionDisable: item.fcc_status === 'c' || item.fcc_status === 'b' ? true : false,
					});
					this.formGroupArray.push({
						formGroup: this.fbuild.group({
							'fcc_ftr_id': '',
							'fcc_process_date': '',
							'fcc_deposite_date': '',
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
		this.formGroupArray[Number(index) - 1].formGroup.value.fcc_deposite_date = new DatePipe('en-in').
			transform(this.formGroupArray[Number(index) - 1].formGroup.value.fcc_deposite_date, 'yyyy-MM-dd');
		this.formGroupArray[Number(index) - 1].formGroup.value.fcc_ftr_id = value.fee_transaction_id;
		this.formGroupArray[Number(index) - 1].formGroup.value.fcc_inv_id = value.invoice_id;
		if (this.formGroupArray[Number(index) - 1].formGroup.value.fcc_process_date
			&& this.formGroupArray[Number(index) - 1].formGroup.value.fcc_deposite_date) {
			this.feeService.addCheckControlTool(this.formGroupArray[Number(index) - 1].formGroup.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.getChequeControlListAll();
				}
			});
		} else {
			this.common.showSuccessErrorMessage('Please choose date for cleareance and deposit', 'error');
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
						srno: item,
						class_name: item.class_name + ' ' + item.sec_name,
						chequeno: item.cheque_no,
						admno: item.inv_process_usr_no,
						studentname: item.au_full_name,
						recieptno: item.receipt_no,
						amount: item.receipt_amount,
						bankname: item.bank_name,
						entered_by: item.created_by,
						approved_by: item.approved_by ? item.approved_by : '-',
						recieptdate: new DatePipe('en-in').transform(item.transaction_date, 'd-MMM-y'),
						bankdeposite: item.fcc_deposite_date ? new DatePipe('en-in').transform(item.fcc_deposite_date, 'd-MMM-y') : '-',
						processingdate: item.fcc_process_date ? this.common.dateConvertion(item.fcc_process_date, 'd-MMM-y') : '-',
						remarks: item.fcc_remarks ? new CapitalizePipe().transform(item.fcc_remarks) : '-',
						action: item,
						ftr_family_number: item.ftr_family_number ? item.ftr_family_number : '-',
						selectionDisable: item.fcc_status === 'c' || item.fcc_status === 'b' ? true : false,
					});
					this.formGroupArray.push({
						formGroup: this.fbuild.group({
							'fcc_ftr_id': '',
							'fcc_process_date': '',
							'fcc_status': 'c',
							'fcc_deposite_date': '',
							'fcc_inv_id': ''
						})
					});
					pos++;
				}
				this.dataSource = new MatTableDataSource<ChequeToolElement>(this.CHEQUE_ELEMENT_DATA);
				this.dataSource.paginator.length = this.paginator && this.paginator.length;
				this.dataSource.paginator.length = this.totalRecords;
				this.dataSource.paginator = this.paginator;
			}
		});
	}
	enableSearch() {
		const filter = document.getElementById('formFlag');
		if (filter.style.display === 'none') {
			filter.style.display = 'block';
		} else {
			filter.style.display = 'none';
			this.reset();
		}
	}
	openDialog(invoiceNo, edit): void {
		const dialogRef = this.dialog.open(InvoiceDetailsModalComponent, {
			width: '80%',
			height: '80vh',
			data: {
				invoiceNo: invoiceNo,
				edit: edit,
				paidStatus: 'paid'
			},
			hasBackdrop: true
		});
	}
	openReceiptDialog(invoiceNo, edit): void {
		const dialogRef = this.dialog.open(ReceiptDetailsModalComponent, {
			width: '80%',
			height: '80vh',
			data: {
				rpt_id: invoiceNo,
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
	openDeleteModal(item) {
		this.deleteModal.openModal(item);
	}
	approveFTR(item) {
		const param: any = {};
		param.fcc_ftr_id = item.fee_transaction_id;
		param.fcc_status = '';
		param.ftr_status = '4';
		param.ftr_approved_by = this.currentUser.login_id;
		this.feeService.approveFeeTransaction(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.common.showSuccessErrorMessage(result.message, 'success');
				this.getChequeControlListAll();
			} else {
				this.common.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}
	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() :
			this.dataSource.data.forEach(row => {
				if (row.selectionDisable === false) {
					this.selection.select(row);
				}
				//this.selection.select(row);
				console.log(row);
			});
		this.checkboxLength = this.selection.selected.length;
	}
	fetchRecieptId() {
		const rec_id_arr = [];
		this.selection.selected.forEach(element => {
			rec_id_arr.push(element.srno);
		});
		return rec_id_arr;
	}
	checkboxLabel(row?: ChequeToolElement): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.srno + 1}`;
	}
	manipulateAction(row) {
		if (this.selection.selected.length > 0) {
			this.selection.select(row);
		} else {
			this.selection.toggle(row);
		}
		this.checkboxLength = this.selection.selected.length;
	}
}
