import { Component, OnInit, Inject, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { MatDialog } from '@angular/material';
import { InvoiceDetailsModalComponent } from '../invoice-details-modal/invoice-details-modal.component';
import { FilterModalComponent } from '../../common-filter/filter-modal/filter-modal.component';
import { FeeService, CommonAPIService, SisService, ProcesstypeFeeService } from '../../_services/index';
import { InvoiceElement } from './invoice-element.model';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginatorI18n } from '../../sharedmodule/customPaginatorClass';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { ReceiptDetailsModalComponent } from '../../sharedmodule/receipt-details-modal/receipt-details-modal.component';
@Component({
	selector: 'app-invoice-creation-bulk',
	templateUrl: './invoice-creation-bulk.component.html',
	styleUrls: ['./invoice-creation-bulk.component.scss'],
	providers: [
		{ provide: MatPaginatorIntl, useClass: MatPaginatorI18n }
	]
})
export class InvoiceCreationBulkComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('deleteModal') deleteModal;
	@ViewChild('recalculateModal') recalculateModal;
	ELEMENT_DATA: InvoiceElement[] = [];
	displayedColumns: string[] =
		['select', 'srno', 'admno',
			'studentname', 'classsection', 'invoiceno', 'feeperiod', 'invoicedate', 'duedate', 'feedue', 'status', 'action'];
	dataSource = new MatTableDataSource<InvoiceElement>(this.ELEMENT_DATA);
	selection = new SelectionModel<InvoiceElement>(true, []);
	filterResult: any[] = [];
	invoiceType: any[] = [];
	invoiceArray: any[] = [];
	feePeriod: any[] = [];
	invoicepagelength = 1000;
	invoicepagesize = 10;
	invoicepagesizeoptions = [10, 25, 50, 100];
	invoiceCreationForm: FormGroup;
	invoiceSearchForm: FormGroup;
	classArray: any[] = [];
	sectionArray: any[] = [];
	minInvoiceDate = new Date();
	totalRecords: any;
	pageEvent: PageEvent;
	processType: any = '';
	processTypeArray: any[] = [
		{ id: '1', name: 'Enquiry' },
		{ id: '2', name: 'Registration' },
		{ id: '3', name: 'Provisional Admission' },
		{ id: '4', name: 'Admission' }
	];
	getClass() {
		this.classArray = [];
		this.sisService.getClass({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.classArray = result.data;
			}
		});
	}
	getSectionsByClass() {
		this.sectionArray = [];
		this.sisService.getSectionsByClass({ class_id: this.invoiceSearchForm.value.class_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.sectionArray = result.data;
			}
		});
	}
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
		private fb: FormBuilder,
		public commonAPIService: CommonAPIService,
		private route: ActivatedRoute,
		private router: Router,
		private sisService: SisService,
		private processtypeService: ProcesstypeFeeService

	) { }

	ngOnInit() {
		localStorage.removeItem('invoiceBulkRecords');
		this.buildForm();
		this.getCalculationMethods();
		this.getInvoiceFeeMonths();
		this.getInvoice(this.invoiceSearchForm.value);
		this.getClass();
		const filterModal = document.getElementById('formFlag');
		filterModal.style.display = 'none';
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	getInvoice(value) {
		this.invoiceArray = [];
		this.selection.clear();
		this.feeService.getInvoice(value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.invoiceArray = result.data.invoiceData;
				this.totalRecords = Number(result.data.totalRecords);
				localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
				this.invoiceTableData(this.invoiceArray);
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
			if (element.inv_activity) {
				status = element.inv_activity;
			} else {
				status = element.inv_paid_status;
			}
			if (element.inv_activity) {
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
				srno: (this.invoiceSearchForm.value.pageSize * this.invoiceSearchForm.value.pageIndex) + (index + 1),
				admno: element.inv_process_usr_no,
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
		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
		this.dataSource.sort = this.sort;
		this.dataSource.paginator.length = this.paginator.length = this.totalRecords;
		this.dataSource.paginator = this.paginator;
	}
	addTo(row) {
	}
	fetchData(event?: PageEvent) {
		this.invoiceSearchForm.value.pageIndex = event.pageIndex;
		this.invoiceSearchForm.value.pageSize = event.pageSize;
		this.getInvoice(this.invoiceSearchForm.value);
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
		if (this.invoiceCreationForm.valid && this.processType) {
			const formData: any = await this.insertInvoiceData(Object.assign({}, this.invoiceCreationForm.value));
			let arrAdmno = [];
			if (this.filterResult.length > 0) {
				arrAdmno = await this.feeService.getStudentsForFilter({ filters: this.filterResult }).toPromise().then((result: any) => {
					if (result && result.status === 'ok') {
						return result.data;
					}
				});
			}
			formData.login_id = arrAdmno;
			if (arrAdmno.length > 0) {
				this.feeService.insertInvoice(formData).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
						this.reset();
						this.getInvoice(this.invoiceSearchForm.value);
					} else {
						this.commonAPIService.showSuccessErrorMessage(result.message, 'error');

					}
				});
			} else {
				this.commonAPIService.showSuccessErrorMessage('Please select filter', 'error');
			}
		} else {
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
		this.invoiceSearchForm = this.fb.group({
			class_id: '',
			sec_id: '',
			inv_process_usr_no: '',
			invoice_no: '',
			user_name: '',
			from_date: '',
			to_date: '',
			status: '',
			pageIndex: '0',
			pageSize: '10'
		});
	}
	advanceSearchToggle() {
		const filter = document.getElementById('formFlag');
		if (filter.style.display === 'none') {
			filter.style.display = 'block';
		} else {
			filter.style.display = 'none';
			this.resetSearch();
		}
	}
	searchInvoice() {
		this.getInvoice(this.invoiceSearchForm.value);
	}
	openDialog(invoiceNo, details, edit): void {
		const dialogRef = this.dialog.open(InvoiceDetailsModalComponent, {
			width: '80%',
			data: {
				invoiceNo: invoiceNo,
				edit: edit,
				paidStatus: details.status
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			this.getInvoice(this.invoiceSearchForm.value);
		});
	}

	openFilterDialog() {
		if (this.processType) {
			const dialogRefFilter = this.dialog.open(FilterModalComponent, {
				width: '70%',
				height: '80%',
				data: {
					filterResult: this.filterResult,
					pro_id: '3',
					process_type: this.processType
				}
			});
			dialogRefFilter.afterClosed().subscribe(result => {
			});
			dialogRefFilter.componentInstance.filterResult.subscribe((data: any) => {
				this.filterResult = data;
			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please choose a processtype first', 'error');
		}
	}
	openDeleteDialog = (data) => this.deleteModal.openModal(data);
	openRecalculateDialog = (data) => this.recalculateModal.openModal(data);
	deleteConfirm(value) {
		this.feeService.deleteInvoice(value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.getInvoice(this.invoiceSearchForm.value);
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
				this.getInvoice(this.invoiceSearchForm.value);
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});

	}
	printInvoice() {
		const printParam = {
			inv_id: this.fetchInvId()
		};
		if (printParam.inv_id.length > 0) {
			this.feeService.printInvoice(printParam).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
					const length = result.data.split('/').length;
					saveAs(result.data, result.data.split('/')[length - 1]);
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
		}
	}
	navigateIndividual() {
		this.router.navigate(['../invoice-creation-individual'], { relativeTo: this.route });
	}
	reset() {
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
		this.filterResult = [];
	}
	ngOnDestroy() {
		localStorage.removeItem('invoiceBulkRecords');
	}
	changeProcessType($event) {
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
		this.processType = $event.value;
		this.processtypeService.setProcesstype(this.processType);
	}
	resetSearch() {
		this.invoiceSearchForm.patchValue({
			class_id: '',
			sec_id: '',
			inv_process_usr_no: '',
			invoice_no: '',
			user_name: '',
			from_date: '',
			to_date: '',
			status: '',
			pageIndex: '0',
			pageSize: '10'
		});
		this.searchInvoice();
	}
	exportAsExcel() {
		// tslint:disable-next-line:max-line-length
		const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('report_table')); // converts a DOM TABLE element to a worksheet
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
		XLSX.writeFile(wb, 'Report_' + (new Date).getTime() + '.xlsx');

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
