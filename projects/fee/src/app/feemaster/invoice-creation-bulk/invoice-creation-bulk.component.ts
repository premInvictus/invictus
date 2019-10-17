import { Component, OnInit, Inject, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { MatDialog } from '@angular/material';
import { InvoiceDetailsModalComponent } from '../invoice-details-modal/invoice-details-modal.component';
import { InvoiceSearchModalComponent } from '../invoice-search-modal/invoice-search-modal.component';
import { FilterModalComponent } from '../../common-filter/filter-modal/filter-modal.component';
import { FeeService, CommonAPIService, SisService, ProcesstypeFeeService } from '../../_services/index';
import { InvoiceElement } from './invoice-element.model';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginatorI18n } from '../../sharedmodule/customPaginatorClass';
import { saveAs } from 'file-saver';
import { ReceiptDetailsModalComponent } from '../../sharedmodule/receipt-details-modal/receipt-details-modal.component';
import { DatePipe, TitleCasePipe } from '@angular/common';
import * as XLSX from 'xlsx';
declare var require;
import * as Excel from 'exceljs/dist/exceljs';
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import { CapitalizePipe } from '../../../../../fee/src/app/_pipes';

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
	@ViewChild('searchModal') searchModal;
	@ViewChild('deleteWithReasonModal') deleteWithReasonModal;
	@ViewChild('recalculateModal') recalculateModal;
	searchparam: any;
	pageIndex = 0;
	pageSize = 10;
	ELEMENT_DATA: InvoiceElement[] = [];
	displayedColumns: string[] =
		['select', 'srno', 'admno',
			'studentname', 'classsection', 'invoiceno', 'feeperiod', 'invoicedate', 'duedate', 'feedue', 'status', 'action'];
	dataSource = new MatTableDataSource<InvoiceElement>(this.ELEMENT_DATA);
	selection = new SelectionModel<InvoiceElement>(true, []);
	filterResult: any[] = [];
	invoiceType: any[] = [];
	invoiceArray: any[] = [];
	excelArray: any[] = [];
	feePeriod: any[] = [];
	UserArray: any[] = [];
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
	dataArr: any[] = [];
	sessionArray: any[] = [];
	session: any;
	sessionName: any;
	length: any;
	currentUser: any;
	alphabetJSON = {
		1: 'A',
		2: 'B',
		3: 'C',
		4: 'D',
		5: 'E',
		6: 'F',
		7: 'G',
		8: 'H',
		9: 'I',
		10: 'J',
		11: 'K',
		12: 'L',
		13: 'M',
		14: 'N',
		15: 'O',
		16: 'P',
		17: 'Q',
		18: 'R',
		19: 'S',
		20: 'T',
		21: 'U',
		22: 'V',
		23: 'W',
		24: 'X',
		25: 'Y',
		26: 'Z',
		27: 'AA',
		28: 'AB',
		29: 'AC',
		30: 'AD',
		31: 'AE',
		32: 'AF',
		33: 'AG',
		34: 'AH',
		35: 'AI',
		36: 'AJ',
		37: 'AK',
		38: 'AL',
		39: 'AM',
		40: 'AN',
		41: 'AO',
		42: 'AP',
		43: 'AQ',
		44: 'AR',

	};
	schoolInfo: any;
	processTypeArray: any[] = [
		{ id: '1', name: 'Enquiry' },
		{ id: '2', name: 'Registration' },
		{ id: '3', name: 'Provisional Admission' },
		{ id: '4', name: 'Admission' }
	];
	// get session name by session id
	getSession() {
		this.sisService.getSession()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						for (const citem of result.data) {
							this.sessionArray[citem.ses_id] = citem.ses_name;
						}
						this.sessionName = this.sessionArray[this.session.ses_id];
					}
				});
	}
	// get end month and start month of school
	getSchool() {
		this.sisService.getSchool()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.schoolInfo = result.data[0];
					}
				});
	}
	// get user name and login id
	getUserName() {
		this.feeService.getUserName()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						for (const citem of result.data) {
							this.UserArray[citem.au_login_id] = citem.au_full_name;
						}
					}
				});
	}
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

	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
	}

	ngOnInit() {
		localStorage.removeItem('invoiceBulkRecords');
		this.buildForm();
		this.getCalculationMethods();
		this.getInvoiceFeeMonths();
		this.getInvoice(this.invoiceSearchForm.value);
		this.getClass();
		this.getSchool();
		this.getSession();
		const filterModal = document.getElementById('formFlag');
		filterModal.style.display = 'none';
		this.searchparam = {
			pageIndex: this.pageIndex,
			pageSize: this.pageSize,
		}
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
				this.excelArray = result.data.excelData;
				this.totalRecords = Number(result.data.totalRecords);
				console.log('excelArray', this.excelArray);
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
				srno: (this.searchparam.pageSize * this.searchparam.pageIndex) + (index + 1),
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
		//this.invoiceSearchForm.value.pageIndex = event.pageIndex;
		//this.invoiceSearchForm.value.pageSize = event.pageSize;
		this.searchparam.pageIndex = event.pageIndex;
		this.searchparam.pageSize = event.pageSize;
		//this.getInvoice(this.invoiceSearchForm.value);
		this.getInvoice(this.searchparam);
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
			inv_fm_id: '',
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
	openSearchDialog = (data) => { this.searchModal.openModal(data); }
	searchOk(value) {
		console.log(value);
		this.searchparam = {};
		this.searchparam.pageIndex = this.pageIndex;
		this.searchparam.pageSize = this.pageSize;
		this.paginator.pageSize = this.pageSize;
		Object.keys(value.generalFilters).forEach( key => {
			if(value.generalFilters[key]) {
				this.searchparam[key] = value.generalFilters[key];
			}
		})
		value.filters.forEach(element => {
			if(element.filter_value) {
				this.searchparam[element.filter_type] = element.filter_value
			}
		});
		console.log('searchparam',this.searchparam);
		this.getInvoice(this.searchparam);
	}
	searchInvoice() {
		this.invoiceSearchForm.patchValue({
			'from_date': new DatePipe('en-in').transform(this.invoiceSearchForm.value['from_date'], 'yyyy-MM-dd'),
			'to_date': new DatePipe('en-in').transform(this.invoiceSearchForm.value['to_date'], 'yyyy-MM-dd'),
		});
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
		this.deleteWithReasonModal.openModal(value);
	}

	deleteInvoiceFinal(value) {
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
	// export excel code
	exportAsExcel() {
		let reportType: any = '';
		let reportType2: any = '';
		const columns: any = [];
		columns.push({
			key: 'inv_process_usr_no',
			width: this.checkWidth('inv_process_usr_no', 'Entrollment No.')
		});
		columns.push({
			key: 'au_full_name',
			width: this.checkWidth('au_full_name', 'Student Name')
		});
		columns.push({
			key: 'class_name',
			width: this.checkWidth('class_name', 'Class name')
		});
		columns.push({
			key: 'inv_invoice_no',
			width: this.checkWidth('inv_invoice_no', 'Invoice No.')
		});
		columns.push({
			key: 'fp_name',
			width: this.checkWidth('fp_name', 'Fp Name')
		});
		columns.push({
			key: 'inv_invoice_date',
			width: this.checkWidth('inv_invoice_date', 'Invoice date ')
		});
		columns.push({
			key: 'inv_due_date',
			width: this.checkWidth('inv_due_date', 'Due date')
		});
		columns.push({
			key: 'inv_fee_amount',
			width: this.checkWidth('inv_fee_amount', 'Fee due ')
		});
		columns.push({
			key: 'inv_paid_status',
			width: this.checkWidth('inv_paid_status', 'Status')
		});
		reportType2 = new TitleCasePipe().transform('Invoice repo_') + this.sessionName;
		reportType = new TitleCasePipe().transform('Invoice report: ') + this.sessionName;
		const fileName = reportType + '.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		worksheet.mergeCells('A1:' + this.alphabetJSON[7] + '1');
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[7] + '2');
		worksheet.getCell('A2').value = reportType;
		worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
		worksheet.getCell('A4').value = 'Entrollment No.';
		worksheet.getCell('B4').value = 'Student Name';
		worksheet.getCell('C4').value = 'Class Section';
		worksheet.getCell('D4').value = 'Invoice No';
		worksheet.getCell('E4').value = 'Fee Period';
		worksheet.getCell('F4').value = 'Invoice Date';
		worksheet.getCell('G4').value = 'Due Date';
		worksheet.getCell('H4').value = 'Fee Due';
		worksheet.getCell('I4').value = 'Status';
		worksheet.columns = columns;
		this.length = worksheet._rows.length;
		for (const dety of this.excelArray) {
			this.length++;
			worksheet.getCell('A' + this.length).value = dety.inv_process_usr_no;
			worksheet.getCell('B' + this.length).value = new TitleCasePipe().transform(dety.au_full_name);
			worksheet.getCell('C' + this.length).value = dety.class_name + '-' + dety.sec_name;
			worksheet.getCell('D' + this.length).value = dety.inv_invoice_no;
			worksheet.getCell('E' + this.length).value = dety.fp_name;
			worksheet.getCell('F' + this.length).value = new DatePipe('en-in').transform(dety.inv_invoice_date, 'd-MMM-y');
			worksheet.getCell('G' + this.length).value = new DatePipe('en-in').transform(dety.inv_due_date, 'd-MMM-y');
			worksheet.getCell('H' + this.length).value = this.checkReturn(dety.inv_fee_amount);
			worksheet.getCell('I' + this.length).value = dety.inv_paid_status;
		}
		worksheet.eachRow((row, rowNum) => {
			if (rowNum === 1) {
				row.font = {
					name: 'Arial',
					size: 16,
					bold: true
				};
			}
			if (rowNum === 2) {
				row.font = {
					name: 'Arial',
					size: 14,
					bold: true
				};
			}
			if (rowNum === 4) {
				row.eachCell(cell => {
					cell.font = {
						name: 'Arial',
						size: 10,
						bold: true,
						color: { argb: '636a6a' }
					};
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: 'c8d6e5' },
						bgColor: { argb: 'c8d6e5' },
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					cell.alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
				});
			}
			if (rowNum >= 5 && rowNum <= worksheet._rows.length) {
				row.eachCell(cell => {
					if (cell._address.charAt(0) !== 'A') {
						if (rowNum % 2 === 0) {
							cell.fill = {
								type: 'pattern',
								pattern: 'solid',
								fgColor: { argb: 'ffffff' },
								bgColor: { argb: 'ffffff' },
							};
						} else {
							cell.fill = {
								type: 'pattern',
								pattern: 'solid',
								fgColor: { argb: 'ffffff' },
								bgColor: { argb: 'ffffff' },
							};
						}
					}
					cell.font = {
						color: { argb: 'black' },
						bold: false,
						name: 'Arial',
						size: 10
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					cell.alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
				});
			}
		});
		worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
			this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
		worksheet.getCell('A' + worksheet._rows.length).value = 'No of records: ' + this.totalRecords;
		worksheet.getCell('A' + worksheet._rows.length).font = {
			name: 'Arial',
			size: 10,
			bold: true
		};
		worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
			this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
		worksheet.getCell('A' + worksheet._rows.length).value = 'Generated On: '
			+ new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
		worksheet.getCell('A' + worksheet._rows.length).font = {
			name: 'Arial',
			size: 10,
			bold: true
		};
		worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
			this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
		worksheet.getCell('A' + worksheet._rows.length).value = 'Generated By: ' + this.currentUser.full_name;
		worksheet.getCell('A' + worksheet._rows.length).font = {
			name: 'Arial',
			size: 10,
			bold: true
		};
		// });
		workbook.xlsx.writeBuffer().then(data => {
			const blob = new Blob([data], { type: 'application/octet-stream' });
			saveAs(blob, fileName);
		});

	}
	// check the max  width of the cell
	checkWidth(id, header) {
		const res = this.excelArray.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
	}
	checkReturn(data) {
		if (Number(data)) {
			return Number(data);
		} else {
			return data;
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
