import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, PageEvent, MatPaginatorIntl } from '@angular/material';
import { SecurityDepositElement, SecurityDepositBulkElement } from './security-deposit.model';
import { FeeService, CommonAPIService, SisService } from '../../_services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
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
	@ViewChild('bulkuploadmodel') bulkuploadmodel;
	displayedColumns: string[] =
		['select', 'srno', 'stu_enrollment_no', 'stu_alumni_no', 'stu_full_name', 'stu_class_name', 'au_status', 'stu_security_amt', 'stu_rpt_date', 'stu_security_session', 'security_status', 'action'];
	SECURITY_DEPOST_ELEMENT_DATA: SecurityDepositElement[] = [];
	dataSource = new MatTableDataSource<SecurityDepositElement>(this.SECURITY_DEPOST_ELEMENT_DATA);

	selection = new SelectionModel<SecurityDepositElement>(true, []);
	BULK_SECURITY_DEPOST_ELEMENT_DATA: SecurityDepositBulkElement[] = [];
	bulkDataSource = new MatTableDataSource<SecurityDepositBulkElement>(this.BULK_SECURITY_DEPOST_ELEMENT_DATA);
	public classArray: any[];
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
	showPdf = false;
	grandSecurityTotal: any;
	grandBulkTotal: any;
	currentTab = 0;
	selectedItem: any;
	constructor(public feeService: FeeService,
		public sisService: SisService,
		private fbuild: FormBuilder,
		private common: CommonAPIService,
		public dialog: MatDialog) { }

	ngOnInit() {
		this.getSession();
		this.buildForm();
		this.getClass();
		this.getSecurityDepositListAll();
		this.getBulkSecurityDepositListAll();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		// const filterModal = document.getElementById('formFlag');
		// filterModal.style.display = 'none';
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.bulkDataSource.paginator = this.paginatorbulk;
	}
	getClass() {
		const classParam: any = {};
		classParam.class_status = '1';
		this.common.getClassData(classParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.classArray = result.data;
					} else {
						this.classArray = [];
					}
				}
			);

	}
	applyFilter(value: any) {
		this.dataSource.filter = value.trim().toLowerCase();
	}

	applyBulkFilter(value: any) {
		this.bulkDataSource.filter = value.trim().toLowerCase();
	}
	buildForm() {
		this.filterForm = this.fbuild.group({
			'tt_ses_id': '',
			'tt_class_id': '',
			'tt_payment_status': '',
			'pageSize': '100',
			'pageIndex': '0',
			'tt_status': ''
		});
		// const filterModal = document.getElementById('formFlag');
		// filterModal.style.display = 'none';
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
		this.grandSecurityTotal = 0;
		this.formGroupArray = [];
		this.SECURITY_DEPOST_ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<SecurityDepositElement>(this.SECURITY_DEPOST_ELEMENT_DATA);
		this.feeService.getSecurityDepositList(this.filterForm.value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				let pos = 1;
				let total = 0;
				const temparray = result.data.reportData ? result.data.reportData : [];
				this.totalRecords = Number(result.data.totalRecords);
				this.grandSecurityTotal = Number(result.data.total_amount).toLocaleString('en-IN');
				for (const item of temparray) {
					this.SECURITY_DEPOST_ELEMENT_DATA.push({
						srno: pos,
						stu_rpt_date: item && item.rpt_receipt_date ? new DatePipe('en-us').transform(item.rpt_receipt_date, 'dd-MMM-yyyy') : '-',
						stu_alumni_no: item && item.au_alumni_no ? item.au_alumni_no : '',
						stu_enrollment_no: item && item.au_admission_no ? this.getProcessName(item.inv_process_type) + item.au_admission_no : '',
						stu_full_name: item && item.au_full_name ? item.au_full_name : '',
						stu_class_name: item.sec_name ? (item.class_name + ' - ' + item.sec_name) : (item.class_name),
						stu_security_amt: item && item.invg_fh_amount ? Number(item.invg_fh_amount).toLocaleString('en-IN') : '',
						stu_security_session: item && item.fsd_ses_name ? item.fsd_ses_name : this.getUserSession(item.flgr_ses_id),
						au_status: item && item.au_status ? item.au_status : '0',
						au_process_type: item && item.au_process_type ? item.au_process_type : '4',
						security_status: item && item.fsd_status ? item.fsd_status : '1',
						action: item,
						selectionDisable: item && item.security_status && (item.security_status === '2' || item.security_status === '3') ? true : false

					});
					total = total + Number(item && item.invg_fh_amount ? item.invg_fh_amount : 0)
					pos++;


				}

				var lastRow = {
					srno: 'Total',
					stu_enrollment_no: '',
					stu_alumni_no: '',
					stu_rpt_date: '',
					stu_full_name: '',
					stu_class_name: '',
					stu_security_amt: '<b>' + total.toLocaleString('en-IN') + '</b>',
					stu_security_session: '',
					security_status: '',
					au_status: '',
					au_process_type: '',
					action: '',
					selectionDisable: true
				}
				this.SECURITY_DEPOST_ELEMENT_DATA.push(lastRow);

				this.dataSource = new MatTableDataSource<SecurityDepositElement>(this.SECURITY_DEPOST_ELEMENT_DATA);
				this.dataSource.paginator.length = this.paginator.length = this.totalRecords;
				this.dataSource.paginator = this.paginator;
			}
		});
	}


	getBulkSecurityDepositListAll() {
		this.grandBulkTotal = 0;
		this.formGroupArray = [];
		this.BULK_SECURITY_DEPOST_ELEMENT_DATA = [];
		this.bulkDataSource = new MatTableDataSource<SecurityDepositBulkElement>(this.BULK_SECURITY_DEPOST_ELEMENT_DATA);
		this.feeService.getBulkSecurityDepositList(this.filterForm.value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				let pos = 1;
				let total = 0;
				const temparray = result.data.reportData ? result.data.reportData : [];
				this.bulkTotalRecords = Number(result.data.totalRecords);
				this.grandBulkTotal = Number(result.data.total_amount).toLocaleString('en-IN');
				for (const item of temparray) {
					this.BULK_SECURITY_DEPOST_ELEMENT_DATA.push({
						srno: pos,
						stu_rpt_date: item && item.rpt_receipt_date ? new DatePipe('en-us').transform(item.rpt_receipt_date, 'dd-MMM-yyyy') : '-',
						stu_alumni_no: item && item.au_alumni_no ? item.au_alumni_no : '',
						stu_enrollment_no: item && item.fsd_enrollment_no ? this.getProcessName('4') + item.fsd_enrollment_no : '',
						stu_full_name: item && item.fsd_stu_name ? item.fsd_stu_name : '',
						stu_class_name: item.sec_id ? (item.class_name + ' - ' + item.sec_name) : (item.class_name),
						stu_security_amt: item && item.fsd_security_amt ? Number(item.fsd_security_amt).toLocaleString('en-IN') : '',
						stu_security_session: item && item.fsd_ses_name ? item.fsd_ses_name : '',
						security_status: item && item.fsd_status ? item.fsd_status : '',
						au_status: item && item.au_status ? item.au_status : '0',
						au_process_type: item && item.au_process_type ? item.au_process_type : '4',
						action: item,
						selectionDisable: item && item.security_status && (item.security_status === '2' || item.security_status === '3') ? true : false
					});
					total = total + Number(item && item.fsd_security_amt ? item.fsd_security_amt : 0)
					pos++;
					console.log(item.fsd_ses_id, this.getUserSession(item.fsd_ses_id));
				}

				var lastRow = {
					srno: 'Total',
					stu_enrollment_no: '',
					stu_alumni_no: '',
					stu_rpt_date: '',
					stu_full_name: '',
					stu_class_name: '',
					stu_security_amt: '<b>' + total.toLocaleString('en-IN') + '</b>',
					stu_security_session: '',
					security_status: '',
					au_status: '',
					au_process_type: '',
					action: '',
					selectionDisable: true
				}
				this.BULK_SECURITY_DEPOST_ELEMENT_DATA.push(lastRow);



				this.bulkDataSource = new MatTableDataSource<SecurityDepositBulkElement>(this.BULK_SECURITY_DEPOST_ELEMENT_DATA);
				this.bulkDataSource.paginator.length = this.paginatorbulk.length = this.bulkTotalRecords;
				this.bulkDataSource.paginator = this.paginatorbulk;
			}
		});
	}

	changeTab(event) {
		console.log('change tab -----------', event, '--------', event.index);
		this.currentTab = event.index;

		if (this.currentTab) {
			this.grandBulkTotal = 0;
			this.getBulkSecurityDepositListAll();
		} else {
			this.grandSecurityTotal = 0;
			this.getSecurityDepositListAll();
		}
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
				// if (row.selectionDisable === false) {
					this.selection.select(row);
				
			});
	}

	/** The label for the checkbox on the passed row */
	checkboxLabel(row?: SecurityDepositElement): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.srno + 1}`;
	}

	enableSearch() {
		// const filter = document.getElementById('formFlag');
		// if (filter.style.display === 'none') {
		// 	filter.style.display = 'block';
		// } else {
		// 	filter.style.display = 'none';
		// 	this.reset();
		// }
		if (this.showPdf == true) {
			this.showPdf = false;
			this.reset()
		} else {
			this.showPdf = true
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
			'tt_ses_id': '',
			'tt_class_id': '',
			'tt_payment_status': '',
			'pageSize': '100',
			'pageIndex': '0',
			'tt_status': ''
		});
		this.getSecurityDepositListAll();
	}
	openDeleteModal(item) {
		this.selectedItem = item;
		this.deleteModal.openModal(item);
	}
	openAddAttachmentDialog(item) {
		this.bulkuploadmodel.openModal(item);
	}
	approvePay(item) {
		var inputJson = {};
		console.log("i am item", item);

		if (!this.currentTab && item.fsd_status != '4') {


			inputJson['fsd_enrollment_no'] = this.selectedItem.au_admission_no;
			inputJson['fsd_stu_name'] = this.selectedItem.au_full_name;
			inputJson['fsd_login_id'] = this.selectedItem.au_login_id;
			inputJson['fsd_class_id'] = this.selectedItem.au_class_id;
			inputJson['fsd_security_amt'] = this.selectedItem.invg_fh_amount;
			inputJson['fsd_ses_id'] = this.selectedItem.flgr_ses_id;
			inputJson['fsd_ses_name'] = this.getUserSession(this.selectedItem.flgr_ses_id);
			inputJson['fsd_status'] = item.fsd_status;
			inputJson['fsd_payment_type'] = item.fsd_payment_type
			inputJson['fsd_created_date'] = item.fsd_created_date;
			inputJson['fsd_remarks'] = item.fsd_remarks
			inputJson['fsd_in_system_status'] = 1;

			this.feeService.insertSecurityDeposit(inputJson).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.message, 'success');
					this.getSecurityDepositListAll();
				} else {
					this.common.showSuccessErrorMessage(result.message, 'error');
				}
			});

		} else if (!this.currentTab && item.fsd_status == '4') {
			console.log("i am selected item", this.selectedItem);
			if (item.adj_amount > 0) {
				console.log("in jhere");

				this.feeService.updateSecurityInvoice({ inv_id: this.selectedItem.inv_id, final_amt: this.selectedItem.invg_fh_amount - item.adj_amount, adj_amount: item.adj_amount, fh_ft_id: this.selectedItem.fh_ft_id }).subscribe((res: any) => {
					this.common.showSuccessErrorMessage(res.message, 'success');
					this.getSecurityDepositListAll();
				})
			}


		}
		else {

			inputJson['fsd_id'] = this.selectedItem.fsd_id;
			inputJson['fsd_enrollment_no'] = this.selectedItem.fsd_enrollment_no;
			inputJson['fsd_stu_name'] = this.selectedItem.au_full_name;
			inputJson['fsd_login_id'] = this.selectedItem.fsd_login_id;
			inputJson['fsd_class_id'] = this.selectedItem.fsd_class_id;
			inputJson['fsd_security_amt'] = this.selectedItem.fsd_security_amt;
			inputJson['fsd_ses_id'] = this.selectedItem.fsd_ses_id;
			inputJson['fsd_ses_name'] = this.selectedItem.fsd_ses_name;
			inputJson['fsd_status'] = item.fsd_status;
			inputJson['fsd_payment_type'] = item.fsd_payment_type
			inputJson['fsd_created_date'] = item.fsd_created_date;
			inputJson['fsd_remarks'] = item.fsd_remarks
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
		formData.append('module', 'auxillary');
		formData.append('component', component);
		const options = { content: formData, module: 'auxillary', component: component };
		this.feeService.uploadBulkSecurityDeposit(formData).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.common.showSuccessErrorMessage('Uploaded Successfully', 'success');
				this.myInputVariable.nativeElement.value = '';
				this.getBulkSecurityDepositListAll();
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
			inputJson['fsd_in_system_status'] = item.fsd_in_system_status ? item.fsd_in_system_status : 0;
		} else {
			inputJson['fsd_id'] = item.fsd_id;
			inputJson['fsd_in_system_status'] = item.fsd_in_system_status ? item.fsd_in_system_status : 0;
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

	checkStatusBulk(item) {

		// let obj: any = item;
		let arr = [];
		// obj.selected = ;
		console.log("-----------------------", this.selection.selected, item);

		this.selection.selected.map((element: any) => {
			if (!element.action.fsd_id) {
				let inputJson: any = {};
				// inputJson['fsd_id'] = element.action.fsd_id;
				
				
				inputJson['fsd_enrollment_no'] = element.action.au_process_type == '5' ? element.action.au_alumni_no : element.action.au_admission_no;
				inputJson['fsd_stu_name'] = element.action.au_full_name;
				inputJson['fsd_login_id'] = element.action.au_login_id;
				inputJson['fsd_class_id'] = element.action.au_class_id;
				inputJson['fsd_security_amt'] = parseInt(element.stu_security_amt.replace(",",''));
				inputJson['fsd_ses_id'] = item.flgr_ses_id;
				inputJson['fsd_ses_name'] = this.getUserSession(item.flgr_ses_id);
				inputJson['fsd_status'] = item.fsd_status;
				inputJson['fsd_payment_type'] = item.fsd_payment_type;
				inputJson['fsd_in_system_status'] = 1;
				inputJson['fsd_remarks'] = item.fsd_remarks;
				inputJson['fsd_created_date'] = item.fsd_created_date;
				arr.push(inputJson);
			}

		});
		this.feeService.insertSecurityDepositBulk({ data_arr: arr }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.common.showSuccessErrorMessage(result.message, 'success');
				this.getSecurityDepositListAll();
			} else {
				this.common.showSuccessErrorMessage(result.message, 'error');
			}
		});

		// console.log("i am item", obj);


	}


}
