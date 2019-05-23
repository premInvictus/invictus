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
	ELEMENT_DATA: InvoiceElement[] = [];
	displayedColumns: string[] =
		['select', 'srno', 'invoiceno', 'feeperiod', 'feedue', 'status', 'action'];
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
	minDueDate = new Date();
	pageEvent: PageEvent;

	getCalculationMethods() {
		this.invoiceType = [];
		this.feeService.getCalculationMethods({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.invoiceType = result.data;
				console.log(this.invoiceType);
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
				console.log(this.feePeriod);
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
		this.studentRouteMoveStoreService.getRouteStore().then((data: any) => {
			if (data.adm_no && data.login_id) {
				this.lastRecordAdmno = data.adm_no;
				this.currentAdmno = data.adm_no;
				this.currentLoginId = data.login_id;
				this.getInvoice({ admission_no: this.currentAdmno });
			} else {
				this.getLastRecordAdmno();
			}

		});
	}
	getLastRecordAdmno() {
		this.processtypeService.setProcesstype('4');
		this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.lastRecordAdmno = result.data[0].last_record;
				this.currentAdmno = result.data[0].last_record;
				this.currentLoginId = result.data[0].au_login_id;
				this.getInvoice({ admission_no: this.currentAdmno });
			}
		});
	}
	key(event) {
		this.currentLoginId = event;
		console.log(event);
	}
	next(event) {
		this.currentLoginId = event;
		console.log(event);
	}
	prev(event) {
		this.currentLoginId = event;
		console.log(event);
	}
	first(event) {
		this.currentLoginId = event;
		console.log(event);
	}
	last(event) {
		this.currentLoginId = event;
		console.log(event);
	}
	key2(event) {
		this.currentAdmno = event;
		console.log(event);
		this.getInvoice({ admission_no: event });
	}
	next2(event) {
		this.currentAdmno = event;
		console.log(event);
		this.getInvoice({ admission_no: event });
	}
	prev2(event) {
		this.currentAdmno = event;
		console.log(event);
		this.getInvoice({ admission_no: event });
	}
	first2(event) {
		this.currentAdmno = event;
		console.log(event);
		this.getInvoice({ admission_no: event });
	}
	last2(event) {
		this.currentAdmno = event;
		console.log(event);
		this.getInvoice({ admission_no: event });
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	getInvoice(value: any) {
		this.invoiceArray = [];
		this.selection.clear();
		value.pageIndex = 0;
		value.pageSize = 1000;
		this.feeService.getInvoice(value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log(result);
				this.invoiceArray = result.data.invoiceData;
				this.invoiceTableData(this.invoiceArray);
			} else {
				this.invoiceTableData();
			}
		});
	}
	invoiceTableData(invoicearr = []) {
		this.ELEMENT_DATA = [];
		invoicearr.forEach((element, index) => {
			this.ELEMENT_DATA.push({
				srno: index + 1,
				admno: element.au_admission_no,
				studentname: element.au_full_name,
				classsection: element.class_name + ' - ' + element.sec_name,
				invoiceno: element.inv_invoice_no,
				inv_id: element.inv_id,
				feeperiod: element.fp_name,
				feedue: element.inv_fee_amount,
				remark: element.inv_remark,
				status: element.inv_paid_status,
				statuscolor: element.inv_paid_status === 'paid' ? 'green' : 'red',
				selectionDisable: element.inv_paid_status === 'paid' ? true : false,
				action: element
			});

		});
		this.dataSource = new MatTableDataSource<InvoiceElement>(this.ELEMENT_DATA);
		this.dataSource.paginator = this.paginator;
		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
		this.dataSource.sort = this.sort;
	}
	addTo(row) {
		console.log(row);
		console.log(this.selection);
	}
	fetchData(event?: PageEvent) {
		console.log(event);
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
			const formData: any = await this.insertInvoiceData(Object.assign({}, this.invoiceCreationForm.value));
			const arrAdmno = [this.currentLoginId];
			formData.login_id = arrAdmno;
			console.log('formData', formData);
			console.log('arrAdmno', arrAdmno);
			this.feeService.insertInvoice(formData).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
					this.invoiceCreationForm.reset();
					this.getInvoice({ admission_no: this.currentAdmno });
				}
			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please fill all required field', 'error');
		}
	}
	recalculateInvoice() {
		console.log(this.invoiceCreationForm.value);
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

	openDialog(invoiceNo, edit): void {
		const dialogRef = this.dialog.open(InvoiceDetailsModalComponent, {
			width: '100%',
			data: {
				invoiceNo: invoiceNo,
				edit: edit
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');

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
			console.log(result);
		});
		dialogRefFilter.componentInstance.filterResult.subscribe((data: any) => {
			this.filterResult = data;
			console.log('data in parent', this.filterResult);
		});
	}
	openDeleteDialog = (data) => this.deleteModal.openModal(data);
	openRecalculateDialog = (data) => this.recalculateModal.openModal(data);
	openConsolidateDialog = (data) => this.consolidateModal.openModal(data);
	deleteConfirm(value) {
		console.log(value);
		this.feeService.deleteInvoice(value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.getInvoice({ admission_no: this.currentAdmno });
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	recalculateConfirm(value) {
		console.log(value);
		this.invoiceCreationForm.patchValue({
			inv_id: this.fetchInvId(),
			recalculation_flag: '1'
		});
		this.feeService.recalculateInvoice(this.invoiceCreationForm.value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.getInvoice({ admission_no: this.currentAdmno });
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});

	}
	consolidateConfirm(value) {
		console.log(value);
		this.feeService.consolidateInvoice({ inv_id: this.fetchInvId() }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.getInvoice({ admission_no: this.currentAdmno });
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
	setMinDueDate(event) {
		const tdate = event.value;
		tdate.add(1, 'days');
		console.log(tdate);
		this.minDueDate = tdate;
	}

}
