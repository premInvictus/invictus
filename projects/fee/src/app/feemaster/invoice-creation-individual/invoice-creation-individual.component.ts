import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import { InvoiceDetailsModalComponent } from '../invoice-details-modal/invoice-details-modal.component';
import { FilterModalComponent } from '../../common-filter/filter-modal/filter-modal.component';
import { FeeService, CommonAPIService, SisService, ProcesstypeFeeService } from '../../_services/index';
import { InvoiceElement } from './invoice-element.model';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentRouteMoveStoreService } from '../student-route-move-store.service';
import { CommonStudentProfileComponent } from '../common-student-profile/common-student-profile.component';
import { ReceiptDetailsModalComponent } from '../../sharedmodule/receipt-details-modal/receipt-details-modal.component';


@Component({
	selector: 'app-invoice-creation-individual',
	templateUrl: './invoice-creation-individual.component.html',
	styleUrls: ['./invoice-creation-individual.component.scss']
})
export class InvoiceCreationIndividualComponent implements OnInit, AfterViewInit {

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('deleteModal') deleteModal;
	@ViewChild('recalculateModal') recalculateModal;
	@ViewChild('consolidateModal') consolidateModal;
	@ViewChild('unconsolidateModal') unconsolidateModal;
	@ViewChild('detachReceiptModal') detachReceiptModal;
	@ViewChild(CommonStudentProfileComponent) commonStu: CommonStudentProfileComponent;
	@ViewChild('deleteWithReasonModal') deleteWithReasonModal;
	@ViewChild('searchModal') searchModal;

	ELEMENT_DATA: InvoiceElement[] = [];
	displayedColumns: string[] =
		['select', 'srno', 'invoiceno', 'feeperiod', 'invoicedate', 'duedate', 'feedue', 'status', 'action'];
	dataSource = new MatTableDataSource<InvoiceElement>(this.ELEMENT_DATA);
	selection = new SelectionModel<InvoiceElement>(true, []);
	filterResult: any[] = [];
	invoiceType: any[] = [];
	invoiceArray: any[] = [];
	feePeriod: any[] = [];
	invoicepagelength = 100;
	invoiceCreationForm: FormGroup;
	lastRecordAdmno: string;
	currentAdmno: string;
	currentLoginId: string;
	minInvoiceDate = new Date();
	pageEvent: PageEvent;
	type: any = '';
	feeRenderId: any;
	btnDisable = false;
	getCalculationMethods() {
		this.invoiceType = [];
		this.feeService.getCalculationMethods({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.invoiceType = result.data;
			}
		});
	}

	getInvoiceFeeMonths() {
		this.feePeriod = [];
		this.feeService.getInvoiceFeeMonths({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feePeriod = result.data.fm_data;
				this.invoiceCreationForm.patchValue({
					inv_fp_id: result.data.fp_id
				});
			}
		});
	}
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		let numRows = 0;
		this.dataSource.data.forEach(row => {
			if (row.selectionDisable === false) {
				numRows++;
			}
		});
		return numSelected === numRows;
	}

	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() :
			this.dataSource.data.forEach(row => {
				if (row.selectionDisable === false) {
					this.selection.select(row);
				}
			});
	}

	checkboxLabel(row?: InvoiceElement): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.srno + 1}`;
	}

	constructor(
		public dialog: MatDialog,
		private feeService: FeeService,
		private sisService: SisService,
		private fb: FormBuilder,
		public commonAPIService: CommonAPIService,
		private route: ActivatedRoute,
		private router: Router,
		private processtypeService: ProcesstypeFeeService,
		private studentRouteMoveStoreService: StudentRouteMoveStoreService

	) { }

	ngOnInit() {
		this.buildForm();
		this.getCalculationMethods();
		this.getInvoiceFeeMonths();
		if (this.studentRouteMoveStoreService.getProcesRouteType()) {
			this.type = this.studentRouteMoveStoreService.getProcesRouteType();
		} else {
			this.type = '4';
		}
		this.studentRouteMoveStoreService.getRouteStore().then((data: any) => {
			if (data.adm_no && data.login_id) {
				this.lastRecordAdmno = data.adm_no;
				this.currentAdmno = data.adm_no;
				this.currentLoginId = data.login_id;
				this.getInvoice({ inv_process_usr_no: this.currentAdmno });
				this.invoiceCreationForm.patchValue({
					recalculation_flag: '',
					inv_id: [],
					inv_title: '',
					login_id: [],
					inv_calm_id: '',
					inv_fm_id: [],
					inv_invoice_date: '',
					inv_due_date: '',
					inv_activity: ''
				});
			} else {
				this.getLastRecordAdmno();
			}

		});
	}
	getLastRecordAdmno() {
		this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.lastRecordAdmno = result.data[0].last_record;
				this.currentAdmno = result.data[0].last_record;
				this.currentLoginId = result.data[0].au_login_id;
				this.getInvoice({ inv_process_usr_no: this.currentAdmno });
				this.invoiceCreationForm.patchValue({
					recalculation_flag: '',
					inv_id: [],
					inv_title: '',
					login_id: [],
					inv_calm_id: '',
					inv_fm_id: [],
					inv_invoice_date: '',
					inv_due_date: '',
					inv_activity: ''
				});
			}
		});
	}
	checkEmit(process_type) {
		if (process_type) {
			this.type = process_type;
			this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
				if (result.status === 'ok') {
					if (result.data[0].last_record && result.data[0].au_login_id) {
						this.lastRecordAdmno = result.data[0].last_record;
						this.currentAdmno = result.data[0].last_record;
						this.currentLoginId = result.data[0].au_login_id;
						this.getInvoice({ inv_process_usr_no: this.currentAdmno });
						this.invoiceCreationForm.patchValue({
							recalculation_flag: '',
							inv_id: [],
							inv_title: '',
							login_id: [],
							inv_calm_id: '',
							inv_fm_id: [],
							inv_invoice_date: '',
							inv_due_date: '',
							inv_activity: ''
						});
					}
				}
			});
		}
	}
	key(event) {
		this.currentLoginId = event;
	}
	next(event) {
		this.currentLoginId = event;
	}
	prev(event) {
		this.currentLoginId = event;
	}
	first(event) {
		this.currentLoginId = event;
	}
	last(event) {
		this.currentLoginId = event;
	}
	key2(event) {
		this.currentAdmno = event;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
			this.getInvoice({ inv_process_usr_no: event });
		} else {
			this.getInvoice({ inv_process_usr_no: event });
		}
	}
	next2(event) {
		this.currentAdmno = event;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
			this.getInvoice({ inv_process_usr_no: event });
		} else {
			this.getInvoice({ inv_process_usr_no: event });
		}
	}
	prev2(event) {
		this.currentAdmno = event;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
			this.getInvoice({ inv_process_usr_no: event });
		} else {
			this.getInvoice({ inv_process_usr_no: event });
		}
	}
	first2(event) {
		this.currentAdmno = event;
		this.getInvoice({ inv_process_usr_no: event });
	}
	last2(event) {
		this.currentAdmno = event;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
			this.getInvoice({ inv_process_usr_no: event });
		} else {
			this.getInvoice({ inv_process_usr_no: event });
		}
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	getInvoice(value: any) {
		this.invoiceArray = [];
		this.selection.clear();
		value.processType = this.type;
		value.pageIndex = 0;
		value.pageSize = 1000;
		this.feeService.getInvoice(value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.invoiceArray = result.data.invoiceData;
				this.invoiceTableData(this.invoiceArray);
				this.invoiceCreationForm.patchValue({
					recalculation_flag: '',
					inv_id: [],
					inv_title: '',
					login_id: [],
					inv_calm_id: '',
					inv_fm_id: [],
					inv_invoice_date: '',
					inv_due_date: '',
					inv_activity: ''
				});
			} else {
				this.invoiceTableData();
			}
		});
	}
	invoiceTableData(invoicearr = []) {
		this.ELEMENT_DATA = [];
		invoicearr.forEach((element, index) => {
			let status = '';
			let statusColor = '';
			if (element.inv_paid_status !== 'paid' && element.inv_activity !== '') {
				status = element.inv_activity;
			} else {
				status = element.inv_paid_status;
			}

			if (element.inv_paid_status !== 'paid' && element.inv_activity !== '') {
				if (element.inv_activity === 'consolidated') {
					statusColor = '#ec398e';
				} else if (element.inv_activity === 'modified') {
					statusColor = '#0e7d9e';
				} else if (element.inv_activity === 'recalculated') {
					statusColor = '#ff962e';
				}
			} else {
				if (element.inv_paid_status === 'paid') {
					statusColor = 'green';
				} else {
					statusColor = 'red';
				}
			}
			this.ELEMENT_DATA.push({
				srno: index + 1,
				admno: element.au_admission_no,
				studentname: element.au_full_name,
				classsection: element.class_name + ' - ' + element.sec_name,
				invoiceno: element.inv_invoice_no,
				inv_id: element.inv_id,
				feeperiod: element.fp_name,
				invoicedate: element.inv_invoice_date,
				duedate: element.inv_due_date,
				feedue: element.inv_fee_amount,
				remark: element.inv_remark,
				status: status,
				statuscolor: statusColor,
				selectionDisable: status === 'paid' ? true : false,
				action: element
			});

		});
		this.dataSource = new MatTableDataSource<InvoiceElement>(this.ELEMENT_DATA);
		this.dataSource.paginator = this.paginator;
		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
		this.dataSource.sort = this.sort;
	}
	addTo(row) {
	}
	fetchData(event?: PageEvent) {
		return event;
	}
	fetchInvId() {
		const inv_id_arr = [];
		this.selection.selected.forEach(element => {
			inv_id_arr.push(element.inv_id);
		});
		return inv_id_arr;
	}
	insertInvoiceData(value) {
		return new Promise(resolve => {
			value.recalculation_flag = value.recalculation_flag ? '1' : '0';
			value.inv_invoice_date = value.inv_invoice_date ? value.inv_invoice_date.format('YYYY-MM-DD') : '';
			value.inv_due_date = value.inv_due_date ? value.inv_due_date.format('YYYY-MM-DD') : '';
			resolve(value);
		});
	}
	async insertInvoice() {		
		if (this.invoiceCreationForm.valid) {
			this.btnDisable = true;
			const formData: any = await this.insertInvoiceData(Object.assign({}, this.invoiceCreationForm.value));
			const arrAdmno = [this.currentLoginId];
			formData.login_id = arrAdmno;
			this.feeService.insertInvoice(formData).subscribe((result: any) => {
				this.btnDisable = false;
				if (result && result.status === 'ok') {					
					this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
					this.getInvoice({ inv_process_usr_no: this.currentAdmno });
					this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
					this.invoiceCreationForm.patchValue({
						recalculation_flag: '',
						inv_id: [],
						inv_title: '',
						login_id: [],
						inv_calm_id: '',
						inv_fm_id: [],
						inv_invoice_date: '',
						inv_due_date: '',
						inv_activity: ''
					});
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
		} else {
			this.btnDisable = false;
			this.commonAPIService.showSuccessErrorMessage('Please fill all required field', 'error');
		}
	}
	recalculateInvoice() {
	}
	buildForm() {
		this.invoiceCreationForm = this.fb.group({
			recalculation_flag: '',
			inv_id: [],
			inv_title: '',
			login_id: [],
			inv_calm_id: '',
			inv_fp_id: '',
			inv_fm_id: [],
			inv_invoice_date: '',
			inv_due_date: '',
			inv_activity: ''
		});
	}

	openDialog(invoiceNo, details, edit): void {
		const dialogRef = this.dialog.open(InvoiceDetailsModalComponent, {
			width: '80%',
			height: '80vh',
			data: {
				invoiceNo: invoiceNo,
				edit: edit,
				paidStatus: details.status
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			this.getInvoice({ inv_process_usr_no: this.currentAdmno });

		});
	}

	openFilterDialog() {
		const dialogRefFilter = this.dialog.open(FilterModalComponent, {
			width: '80%',
			data: {
				filterResult: this.filterResult,
				pro_id: '3'
			}
		});
		dialogRefFilter.afterClosed().subscribe(result => {
		});
		dialogRefFilter.componentInstance.filterResult.subscribe((data: any) => {
			this.filterResult = data;
		});
	}
	openDeleteDialog = (data) => this.deleteModal.openModal(data);
	openRecalculateDialog = (data) => this.recalculateModal.openModal(data);
	openConsolidateDialog = (data) => this.consolidateModal.openModal(data);
	openUnConsolidateDialog = (data) => this.unconsolidateModal.openModal(data);
	openDetachReceiptDialog = (data) => this.detachReceiptModal.openModal(data);
	openAttachDialog = (data) => this.searchModal.openModal(data);
	deleteConfirm(value) {
		// this.feeService.deleteInvoice(value).subscribe((result: any) => {
		// 	if (result && result.status === 'ok') {
		// 		this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
		// 		this.getInvoice({ inv_process_usr_no: this.currentAdmno });
		// 		this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
		// 		this.invoiceCreationForm.patchValue({
		// 			recalculation_flag: '',
		// 			inv_id: [],
		// 			inv_title: '',
		// 			login_id: [],
		// 			inv_calm_id: '',
		// 			inv_fm_id: [],
		// 			inv_invoice_date: '',
		// 			inv_due_date: '',
		// 			inv_activity: ''
		// 		});
		// 	} else {
		// 		this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
		// 	}
		// });
		this.deleteWithReasonModal.openModal(value);
	}

	deleteInvoiceFinal(value) {
		this.feeService.deleteInvoice(value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.getInvoice({ inv_process_usr_no: this.currentAdmno });
				this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
				this.invoiceCreationForm.patchValue({
					recalculation_flag: '',
					inv_id: [],
					inv_title: '',
					login_id: [],
					inv_calm_id: '',
					inv_fm_id: [],
					inv_invoice_date: '',
					inv_due_date: '',
					inv_activity: ''
				});
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	recalculateConfirm(value) {
		this.invoiceCreationForm.patchValue({
			inv_id: this.fetchInvId(),
			recalculation_flag: '1'
		});
		this.feeService.recalculateInvoice(this.invoiceCreationForm.value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.getInvoice({ inv_process_usr_no: this.currentAdmno });
				this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
				this.invoiceCreationForm.patchValue({
					recalculation_flag: '',
					inv_id: [],
					inv_title: '',
					login_id: [],
					inv_calm_id: '',
					inv_fm_id: [],
					inv_invoice_date: '',
					inv_due_date: '',
					inv_activity: ''
				});
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});

	}
	consolidateConfirm(value) {
		this.feeService.consolidateInvoice({ inv_id: this.fetchInvId() }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.getInvoice({ inv_process_usr_no: this.currentAdmno });
				this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
				this.invoiceCreationForm.patchValue({
					recalculation_flag: '',
					inv_id: [],
					inv_title: '',
					login_id: [],
					inv_calm_id: '',
					inv_fm_id: [],
					inv_invoice_date: '',
					inv_due_date: '',
					inv_activity: ''
				});
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});

	}

	unconsolidateConfirm(value) {
		this.feeService.unconsolidateInvoice({ inv_consolidate_id: this.fetchInvId() }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.getInvoice({ inv_process_usr_no: this.currentAdmno });
				this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
				this.invoiceCreationForm.patchValue({
					recalculation_flag: '',
					inv_id: [],
					inv_title: '',
					login_id: [],
					inv_calm_id: '',
					inv_fm_id: [],
					inv_invoice_date: '',
					inv_due_date: '',
					inv_activity: ''
				});
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	detachReceiptConfirm(value) {
		console.log('value--', value);
		this.feeService.detachReceipt({ inv_id: value }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.getInvoice({ inv_process_usr_no: this.currentAdmno });
				this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
				this.invoiceCreationForm.patchValue({
					recalculation_flag: '',
					inv_id: [],
					inv_title: '',
					login_id: [],
					inv_calm_id: '',
					inv_fm_id: [],
					inv_invoice_date: '',
					inv_due_date: '',
					inv_activity: ''
				});
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	attachReceipt(value) {
		console.log('receipt value', value);
		this.feeService.attachReceipt(value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.getInvoice({ inv_process_usr_no: this.currentAdmno });
				this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
				this.invoiceCreationForm.patchValue({
					recalculation_flag: '',
					inv_id: [],
					inv_title: '',
					login_id: [],
					inv_calm_id: '',
					inv_fm_id: [],
					inv_invoice_date: '',
					inv_due_date: '',
					inv_activity: ''
				});
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	navigateBulk() {
		this.router.navigate(['../invoice-creation'], { relativeTo: this.route });
	}
	applyFilter(filtervalue: string) {
		this.dataSource.filter = filtervalue.trim().toLowerCase();
	}
	checkStatus() {
		if (this.commonStu.studentdetails.editable_status === '1') {
			return true;
		} else {
			return false;
		}
	}
	openDialog2(inv_id, editFlag) {
		const dialogRef = this.dialog.open(ReceiptDetailsModalComponent, {
			width: '80%',
			data: {
				invoiceNo: inv_id,
				edit: editFlag,
				from: 'invoice'
			},
			hasBackdrop: true
		});
	}
}
