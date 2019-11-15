import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, PageEvent, MatPaginatorIntl } from '@angular/material';
import { SecurityDepositElement, SecurityDepositBulkElement } from './security-deposit.model';
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
	selector: 'app-security-deposit',
	templateUrl: './security-deposit.component.html',
	styleUrls: ['./security-deposit.component.scss'],
	// providers: [
	// 	{ provide: MatPaginatorIntl, useClass: MatPaginatorI18n }
	// ]
})
export class SecurityDepositComponent implements OnInit, AfterViewInit {
	@ViewChild('inputFile') myInputVariable: ElementRef;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild('paginatorbulk') paginatorbulk: MatPaginator;
	@ViewChild('deleteModal') deleteModal;
	displayedColumns: string[] =
		['srno', 'stu_enrollment_no', 'stu_full_name', 'stu_class_name', 'stu_security_amt', 'stu_security_session', 'security_status', 'action'];
	SECURITY_DEPOST_ELEMENT_DATA: SecurityDepositElement[] = [];
	dataSource = new MatTableDataSource<SecurityDepositElement>(this.SECURITY_DEPOST_ELEMENT_DATA);


	BULK_SECURITY_DEPOST_ELEMENT_DATA: SecurityDepositBulkElement[] = [];
	bulkDataSource = new MatTableDataSource<SecurityDepositBulkElement>(this.BULK_SECURITY_DEPOST_ELEMENT_DATA);

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
	bulkTotalRecords: number;
	currentUser: any;
	grandTotal = 0;
	currentTab = 0;
	constructor(public feeService: FeeService,
		public sisService: SisService,
		private fbuild: FormBuilder,
		private common: CommonAPIService,
		public dialog: MatDialog) { }

	ngOnInit() {
		this.getSession();
		this.buildForm();
		
		this.getSecurityDepositListAll();
		this.getBulkSecurityDepositListAll();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.bulkDataSource.paginator = this.paginatorbulk;
	}
	applyFilter(value: any) {
		console.log('value',value);
		this.dataSource.filter = value.trim().toLowerCase();
	}

	applyBulkFilter(value: any) {
		this.bulkDataSource.filter = value.trim().toLowerCase();
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

	getSession() {
		this.sisService.getSession().subscribe((result3: any) => {
			if (result3.status === 'ok') {
				this.sessionArray = result3.data;
			}
		});
	}


	getUserSession(ses_id) {
		for (let i = 0; i < this.sessionArray.length; i++) {
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


	getSecurityDepositListAll() {
		this.formGroupArray = [];
		this.SECURITY_DEPOST_ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<SecurityDepositElement>(this.SECURITY_DEPOST_ELEMENT_DATA);
		this.feeService.getSecurityDepositList(this.filterForm.value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				let pos = 1;
				let total = 0;
				const temparray = result.data.reportData ? result.data.reportData : [];
				this.totalRecords = Number(result.data.totalRecords);
				for (const item of temparray) {
					this.SECURITY_DEPOST_ELEMENT_DATA.push({
						srno: pos,
						stu_enrollment_no: item && item.au_admission_no ? this.getProcessName(item.inv_process_type) + item.au_admission_no : '',
						stu_full_name: item && item.au_full_name ? item.au_full_name : '',
						stu_class_name: item.sec_id !== '0' ? (item.class_name + ' - ' + item.sec_name) : (item.class_name),
						stu_security_amt: item && item.invg_fh_amount ? Number(item.invg_fh_amount).toLocaleString('en-IN') : '',
						stu_security_session: item && item.fsd_ses_name ? item.fsd_ses_name : this.getUserSession(item.flgr_ses_id),
						security_status: item && item.fsd_status ? item.fsd_status : '1',
						action: item,
					});
					total = total + Number(item && item.invg_fh_amount ? item.invg_fh_amount : 0)
					pos++;

					console.log(item.fsd_ses_id, this.getUserSession(item.fsd_ses_id));
				}

				var lastRow = {
					srno: 'Total',
					stu_enrollment_no: '',
					stu_full_name: '',
					stu_class_name: '',
					stu_security_amt: '<b>' + total.toLocaleString('en-IN') + '</b>',
					stu_security_session: '',
					security_status: '',
					action: ''
				}
				this.SECURITY_DEPOST_ELEMENT_DATA.push(lastRow);
				this.grandTotal = this.grandTotal + total;

				this.dataSource = new MatTableDataSource<SecurityDepositElement>(this.SECURITY_DEPOST_ELEMENT_DATA);
				this.dataSource.paginator.length = this.paginator.length = this.totalRecords;
				this.dataSource.paginator = this.paginator;
			}
		});
	}


	getBulkSecurityDepositListAll() {
		this.formGroupArray = [];
		this.BULK_SECURITY_DEPOST_ELEMENT_DATA = [];
		this.bulkDataSource = new MatTableDataSource<SecurityDepositBulkElement>(this.BULK_SECURITY_DEPOST_ELEMENT_DATA);
		this.feeService.getBulkSecurityDepositList(this.filterForm.value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				let pos = 1;
				let total = 0;
				const temparray = result.data.reportData ? result.data.reportData : [];
				this.bulkTotalRecords = Number(result.data.totalRecords);
				for (const item of temparray) {
					this.BULK_SECURITY_DEPOST_ELEMENT_DATA.push({
						srno: pos,
						stu_enrollment_no: item && item.au_admission_no ? this.getProcessName('4') + item.au_admission_no : '',
						stu_full_name: item && item.au_full_name ? item.au_full_name : '',
						stu_class_name: item.sec_id !== '0' ? (item.class_name + ' - ' + item.sec_name) : (item.class_name),
						stu_security_amt: item && item.fsd_security_amt ? Number(item.fsd_security_amt).toLocaleString('en-IN') : '',
						stu_security_session: item && item.fsd_ses_name ? item.fsd_ses_name : '',
						security_status: item && item.fsd_status ? item.fsd_status : '',
						action: item,
					});
					total = total + Number(item && item.fsd_security_amt ? item.fsd_security_amt : 0)
					pos++;
					console.log(item.fsd_ses_id, this.getUserSession(item.fsd_ses_id));
				}

				var lastRow = {
					srno: 'Total',
					stu_enrollment_no: '',
					stu_full_name: '',
					stu_class_name: '',
					stu_security_amt: '<b>' + total.toLocaleString('en-IN') + '</b>',
					stu_security_session: '',
					security_status: '',
					action: ''
				}
				this.BULK_SECURITY_DEPOST_ELEMENT_DATA.push(lastRow);
				
				this.grandTotal = this.grandTotal + total;
				
				this.bulkDataSource = new MatTableDataSource<SecurityDepositBulkElement>(this.BULK_SECURITY_DEPOST_ELEMENT_DATA);
				this.bulkDataSource.paginator.length = this.paginatorbulk.length = this.bulkTotalRecords;
				this.bulkDataSource.paginator = this.paginatorbulk;
			}
		});
	}

	changeTab(event) {
		console.log('change tab', event.index);
		this.currentTab = event.index;

		if (this.currentTab) {
			this.getBulkSecurityDepositListAll();
		} else {
			this.getSecurityDepositListAll();
		}
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

	fetchData(event?: PageEvent) {
		this.filterForm.value.pageIndex = event.pageIndex;
		this.filterForm.value.pageSize = event.pageSize;
		this.getSecurityDepositListAll();
		return event;
	}

	fetchBulkData(event?: PageEvent) {
		this.filterForm.value.pageIndex = event.pageIndex;
		this.filterForm.value.pageSize = event.pageSize;
		this.getBulkSecurityDepositListAll();
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
		this.getSecurityDepositListAll();
	}
	openDeleteModal(item) {
		this.deleteModal.openModal(item);
	}
	approvePay(item) {
		console.log(item);
		var inputJson = {};
		if (this.currentTab) {
			
			inputJson['fsd_enrollment_no'] = 1;
			inputJson['fsd_enrollment_no'] = item.au_admission_no;
			inputJson['fsd_login_id'] = item.au_login_id;
			inputJson['fsd_class_id'] = item.au_class_id;
			inputJson['fsd_security_amt'] = item.invg_fh_amount;
			inputJson['fsd_ses_id'] = item.flgr_ses_id;
			inputJson['fsd_ses_name'] = this.getUserSession(item.flgr_ses_id);
			inputJson['fsd_status'] = '2';
			inputJson['fsd_in_system_status'] = 1;

			this.feeService.insertSecurityDeposit(inputJson).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.message, 'success');
					this.getSecurityDepositListAll();
				} else {
					this.common.showSuccessErrorMessage(result.message, 'error');
				}
			});

		} else {

			inputJson['fsd_id'] = item.fsd_id;
			inputJson['fsd_enrollment_no'] = item.fsd_enrollment_no;
			inputJson['fsd_login_id'] = item.fsd_login_id;
			inputJson['fsd_class_id'] = item.fsd_class_id;
			inputJson['fsd_security_amt'] = item.fsd_security_amt;
			inputJson['fsd_ses_id'] = item.fsd_ses_id;
			inputJson['fsd_ses_name'] = item.fsd_ses_name;
			inputJson['fsd_status'] = '2';
			inputJson['fsd_in_system_status'] = 0;

			this.feeService.updateSecurityDeposit(inputJson).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.message, 'success');
					this.getBulkSecurityDepositListAll();
				} else {
					this.common.showSuccessErrorMessage(result.message, 'error');
				}
			});


			
		}

		console.log('inputjson', inputJson);
	}

	uploadBulkSecurityDeposit(event) {
		const file = event.target.files[0];
			// const fileReader = new FileReader();
			const formData = new FormData();
			const component = 'securitydeposit';
			formData.append('uploadFile', file, file.name);
			formData.append('module' , 'auxillary');
			formData.append('component', component);
			const options = { content: formData,  module : 'auxillary', component : component };
			this.feeService.uploadBulkSecurityDeposit(formData).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.common.showSuccessErrorMessage('Uploaded Successfully', 'success');
					this.myInputVariable.nativeElement.value = '';
				} else {
					this.common.showSuccessErrorMessage('Error While Uploading File', 'error');
					this.myInputVariable.nativeElement.value = '';
				}
			});
	}

	downloadBulkSecurityDepositTemplate() {
		this.feeService.downloadBulkSecurityDepositTemplate({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.common.showSuccessErrorMessage('Download Successfully', 'success');
				const length = result.data.split('/').length;
				saveAs(result.data, result.data.split('/')[length - 1]);
			} else {
				this.common.showSuccessErrorMessage('Error While Downloading File', 'error');
			}
		});
	}

	viewReceipt(item) {
		console.log('item', item);
		var inputJson = {};
		if (this.currentTab) {
			inputJson['fsd_id'] = item.fsd_id;
			inputJson['fsd_in_system_status'] = 1;
		} else {
			inputJson['fsd_id'] = item.fsd_id;
			inputJson['fsd_in_system_status'] = 0;
		}
		this.feeService.viewReceipt(inputJson).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.common.showSuccessErrorMessage('Download Successfully', 'success');
				const length = result.data.split('/').length;
				saveAs(result.data, result.data.split('/')[length - 1]);
			} else {
				this.common.showSuccessErrorMessage('Error While Downloading File', 'error');
			}
		});
	}


}
