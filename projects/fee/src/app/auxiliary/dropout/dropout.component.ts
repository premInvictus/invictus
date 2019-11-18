import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, PageEvent, MatPaginatorIntl } from '@angular/material';
import { DropoutElement, DropoutZeroElement } from './dropout.model';
import { FeeService, CommonAPIService, SisService } from '../../_services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatPaginatorI18n } from '../../sharedmodule/customPaginatorClass';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InvoiceDetailsModalComponent } from '../../feemaster/invoice-details-modal/invoice-details-modal.component';
import { ReceiptDetailsModalComponent } from '../../sharedmodule/receipt-details-modal/receipt-details-modal.component';
import { CapitalizePipe } from '../../_pipes';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-dropout',
	templateUrl: './dropout.component.html',
	styleUrls: ['./dropout.component.scss'],
	// providers: [
	// 	{ provide: MatPaginatorIntl, useClass: MatPaginatorI18n }
	// ]
})
export class DropoutComponent implements OnInit, AfterViewInit {
	@ViewChild('inputFile') myInputVariable: ElementRef;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild('zeroPaginator') zeroPaginator: MatPaginator;
	@ViewChild('transactionModal') transactionModal;
	displayedColumns: string[] = [];
	displayedZeroColumns:string[] = [];
	DROP_OUT_ELEMENT_DATA: DropoutElement[] = [];
	dataSource = new MatTableDataSource<DropoutElement>(this.DROP_OUT_ELEMENT_DATA);

	DROP_OUT_ZERO_ELEMENT_DATA: DropoutElement[] = [];
	zeroDataSource = new MatTableDataSource<DropoutZeroElement>(this.DROP_OUT_ZERO_ELEMENT_DATA);

	formGroupArray: any[] = [];
	filterForm: FormGroup;
	status: any[] = [{ status: '0', value: 'Pending' }, { status: '1', value: 'Paid' }, { status: '2', value: 'Expired' }];
	toggleSearch = false;
	pageEvent: PageEvent;
	sessionArray: any[] = [];
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
		public sisService: SisService,
		private fbuild: FormBuilder,
		private common: CommonAPIService,
		public dialog: MatDialog) { }

	ngOnInit() {
		this.buildForm();
		this.getSession();
		this.getDropoutListAll();
		this.getZeroDropoutListAll();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		const filterModal = document.getElementById('formFlag');
		filterModal.style.display = 'none';
	}


	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.zeroDataSource.paginator = this.paginator;
	}
	applyFilter(value: any) {
		this.dataSource.filter = value.trim().toLowerCase();
	}
	applyZeroFilter(value: any) {
		this.zeroDataSource.filter = value.trim().toLowerCase();
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
			'status': '',
			'downloadAll' : true
		});
	}

	getSession() {
		this.sisService.getSession().subscribe((result3: any) => {
			if (result3.status === 'ok') {
				this.sessionArray = result3.data;
			}
		});
	}


	getUserSession(ses_id) {
		
		for (let i = 0; i < this.sessionArray.length; i++) {
			console.log(Number(this.sessionArray[i]['ses_id']) , Number(ses_id))	;
			if (Number(this.sessionArray[i]['ses_id']) === Number(ses_id)) {
				return this.sessionArray[i]['ses_name'];
			}
		}
	}

	getProcessName(process_id) {
		if (process_id == '1') {
			return 'Enq - ';
		}
		if (process_id == '2') {
			return 'Reg - ';
		}
		if (process_id == '3') {
			return 'Pro Adm - ';
		}
		if (process_id == '4') {
			return 'A - ';
		}
		if (process_id == '5') {
			return 'Alumini - ';
		}
	}


	getDropoutListAll() {
		this.formGroupArray = [];
		this.DROP_OUT_ELEMENT_DATA = [];
		this.displayedColumns = ['srno', 'stu_enrollment_no', 'stu_full_name', 'stu_class_name', 'stu_security_amt', 'stu_security_session', 'security_status', 'action'];
		this.dataSource = new MatTableDataSource<DropoutElement>(this.DROP_OUT_ELEMENT_DATA);
		this.filterForm.value['showZero'] = false;
		this.feeService.getDropoutStudentList(this.filterForm.value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				let pos = 1;
				let total = 0;
				const temparray = result.data.reportData ? result.data.reportData : [];
				this.totalRecords = Number(result.data.reportData.length);
				for (const item of temparray) {
					this.DROP_OUT_ELEMENT_DATA.push({
						srno: pos,
						stu_enrollment_no: item && item.au_admission_no ? this.getProcessName(item.flgr_process_type) + item.au_admission_no : '',
						stu_full_name: item && item.au_full_name ? item.au_full_name : '',
						stu_class_name: item.sec_id !== '0' ? (item.class_name + ' - ' + item.sec_name) : (item.class_name),
						stu_security_amt: item && item.inv_fee_amount ? Number(item.inv_fee_amount).toLocaleString('en-IN') : '',
						stu_security_session: item && item.flgr_ses_id ? this.getUserSession(item.flgr_ses_id) : '',
						security_status: item && item.inv_paid_status ? item.inv_paid_status : '',
						action: item,
					});
					total = total + Number(item && item.inv_fee_amount ? item.inv_fee_amount : 0)
					pos++;
				}

				var lastRow = {
					srno: 'Total',
					stu_enrollment_no: '',
					stu_full_name: '',
					stu_class_name: '',
					stu_security_amt: '<b>' + Number(total).toLocaleString('en-IN') + '</b>',
					stu_security_session: '',
					security_status: '',
					action: ''
				}
				this.DROP_OUT_ELEMENT_DATA.push(lastRow);
				

				this.dataSource = new MatTableDataSource<DropoutElement>(this.DROP_OUT_ELEMENT_DATA);
				// this.dataSource.paginator.length = this.paginator.length = this.totalRecords;
				this.dataSource.paginator = this.paginator;
			}
		});
	}

	getZeroDropoutListAll() {
		this.formGroupArray = [];
		this.DROP_OUT_ZERO_ELEMENT_DATA = [];
		this.displayedZeroColumns = ['srno', 'stu_enrollment_no', 'stu_full_name', 'stu_class_name', 'stu_security_amt', 'stu_security_session', 'security_status'];
		this.zeroDataSource = new MatTableDataSource<DropoutZeroElement>(this.DROP_OUT_ZERO_ELEMENT_DATA);
		this.filterForm.value['showZero'] = true;
		this.feeService.getDropoutStudentList(this.filterForm.value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				let pos = 1;
				let total = 0;
				const temparray = result.data.reportData ? result.data.reportData : [];
				this.totalRecords = Number(result.data.reportData.length);
				for (const item of temparray) {
					this.DROP_OUT_ZERO_ELEMENT_DATA.push({
						srno: pos,
						stu_enrollment_no: item && item.au_admission_no ? this.getProcessName(item.flgr_process_type) + item.au_admission_no : '',
						stu_full_name: item && item.au_full_name ? item.au_full_name : '',
						stu_class_name: item.sec_id !== '0' ? (item.class_name + ' - ' + item.sec_name) : (item.class_name),
						stu_security_amt: item && item.inv_fee_amount ? Number(item.inv_fee_amount).toLocaleString('en-IN') : '',
						stu_security_session: item && item.flgr_ses_id ? this.getUserSession(item.flgr_ses_id) : '',
						security_status: item && item.inv_paid_status ? item.inv_paid_status : '',
						action: item,
					});
					total = total + Number(item && item.inv_fee_amount ? item.inv_fee_amount : 0)
					pos++;
				}

				var lastRow = {
					srno: 'Total',
					stu_enrollment_no: '',
					stu_full_name: '',
					stu_class_name: '',
					stu_security_amt: '<b>' + Number(total).toLocaleString('en-IN') + '</b>',
					stu_security_session: '',
					security_status: '',
					action: ''
				}
				this.DROP_OUT_ZERO_ELEMENT_DATA.push(lastRow);
				

				this.zeroDataSource = new MatTableDataSource<DropoutZeroElement>(this.DROP_OUT_ZERO_ELEMENT_DATA);
				//this.zeroDataSource.paginator.length = this.zeroPaginator.length = this.totalRecords;
				this.zeroDataSource.paginator = this.zeroPaginator;

				
			}
		});
	}

	openTransactionModal(item) {
		this.transactionModal.openModal(item);
	}
	
	// fetchData(event?: PageEvent) {
	// 	this.filterForm.value.pageIndex = event.pageIndex;
	// 	this.filterForm.value.pageSize = event.pageSize;
	// 	this.getDropoutListAll();
	// 	return event;
	// }
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
		this.getDropoutListAll();
		this.getZeroDropoutListAll();
	}

	changeTab(event) {
		console.log('change tab', event.index);
		var currentTab = event.index;

		if (currentTab) {
			this.getZeroDropoutListAll();
		} else {
			this.getDropoutListAll();
		}
	}
	
}
