import { Component, OnInit } from '@angular/core';
import {
	GridOption, Column, AngularGridInstance, Grouping, Aggregators,
	FieldType,
	Filters,
	Formatters,
	DelimiterType,
	FileType
} from 'angular-slickgrid';
import * as XLSX from 'xlsx';
import { TranslateService } from '@ngx-translate/core';
import { FeeService, CommonAPIService, SisService } from '../../../_services';
import { DecimalPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { CapitalizePipe } from '../../../_pipes';
import { ReceiptDetailsModalComponent } from '../../../sharedmodule/receipt-details-modal/receipt-details-modal.component';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportFilterComponent } from '../../reports-filter-sort/report-filter/report-filter.component';
import { ReportSortComponent } from '../../reports-filter-sort/report-sort/report-sort.component';
import { InvoiceDetailsModalComponent } from '../../../feemaster/invoice-details-modal/invoice-details-modal.component';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';
@Component({
	selector: 'app-chequeclearance-report',
	templateUrl: './chequeclearance-report.component.html',
	styleUrls: ['./chequeclearance-report.component.css']
})
export class ChequeclearanceReportComponent implements OnInit {
	sessionArray: any[] = [];
	session: any = {};
	columnDefinitions1: Column[] = [];
	columnDefinitions2: Column[] = [];
	gridOptions1: GridOption;
	gridOptions2: GridOption;
	tableFlag = false;
	dataset1: any[];
	dataset2: any[];
	initgrid = false;
	columnDefinitions: Column[] = [];
	gridOptions: GridOption = {};
	dataset: any[] = [];
	angularGrid: AngularGridInstance;
	dataviewObj: any;
	draggableGroupingPlugin: any;
	durationOrderByCount = false;
	gridObj: any;
	processing = false;
	selectedGroupingFields: string[] = ['', '', ''];
	totalRecords: number;
	aggregatearray: any[] = [];
	reportFilterForm: FormGroup;
	valueArray: any[] = [];
	classDataArray: any[] = [];
	reportTypeArray: any[] = [];
	valueLabel: any = '';
	reportType = '1';
	filterFlag = false;
	filterResult: any[] = [];
	sortResult: any[] = [];
	dataArr: any[] = [];
	sectionArray: any[] = [];
	schoolInfo: any;
	gridHeight: number;
	sessionName: any;
	constructor(translate: TranslateService,
		private feeService: FeeService,
		private common: CommonAPIService,
		private sisService: SisService,
		public dialog: MatDialog,
		private fbuild: FormBuilder) { }

	ngOnInit() {
		this.session = JSON.parse(localStorage.getItem('session'));
		this.getSession();
		this.getSchool();
		this.buildForm();
		this.getClassData();
		this.filterFlag = true;
		this.getChequeReport(this.reportFilterForm.value);
	}
	angularGridReady(angularGrid: AngularGridInstance) {
		this.angularGrid = angularGrid;
		this.gridObj = angularGrid.slickGrid; // grid object
		this.dataviewObj = angularGrid.dataView;
	}
	buildForm() {
		this.reportFilterForm = this.fbuild.group({
			'report_type': '',
			'fee_value': '',
			'from_date': '',
			'to_date': '',
			'downloadAll': true,
			'hidden_value': '',
			'hidden_value2': '',
			'hidden_value3': '',
			'hidden_value4': '',
			'hidden_value5': '',
			'filterReportBy': '',
			'admission_no': '',
			'au_full_name': '',
			'pageSize': '10',
			'pageIndex': '0',
			'login_id': '',
			'order_by': ''
		});
	}

	getChequeReport(value: any) {
		value.from_date = new DatePipe('en-in').transform(value.from_date, 'yyyy-MM-dd');
		value.to_date = new DatePipe('en-in').transform(value.to_date, 'yyyy-MM-dd');
		this.dataArr = [];
		this.aggregatearray = [];
		this.columnDefinitions = [];
		this.dataset = [];
		this.tableFlag = false;
		this.gridOptions = {
			enableDraggableGrouping: true,
			createPreHeaderPanel: true,
			showPreHeaderPanel: true,
			enableHeaderMenu: true,
			preHeaderPanelHeight: 40,
			enableFiltering: true,
			enableSorting: true,
			enableColumnReorder: true,
			createFooterRow: true,
			showFooterRow: true,
			footerRowHeight: 21,
			enableExcelCopyBuffer: true,
			fullWidthRows: true,
			enableAutoTooltip: true,
			enableCellNavigation: true,
			headerMenu: {
				iconColumnHideCommand: 'fas fa-times',
				iconSortAscCommand: 'fas fa-sort-up',
				iconSortDescCommand: 'fas fa-sort-down',
				title: 'Sort'
			},
			exportOptions: {
				sanitizeDataExport: true,
				exportWithFormatter: true
			},
			gridMenu: {
				customItems: [{
					title: 'pdf',
					titleKey: 'Export as PDF',
					command: 'exportAsPDF',
					iconCssClass: 'fas fa-download'
				},
				{
					title: 'excel',
					titleKey: 'Export Excel',
					command: 'exportAsExcel',
					iconCssClass: 'fas fa-download'
				},
				{
					title: 'expand',
					titleKey: 'Expand Groups',
					command: 'expandGroup',
					iconCssClass: 'fas fa-expand-arrows-alt'
				},
				{
					title: 'collapse',
					titleKey: 'Collapse Groups',
					command: 'collapseGroup',
					iconCssClass: 'fas fa-compress'
				},
				{
					title: 'cleargroup',
					titleKey: 'Clear Groups',
					command: 'cleargroup',
					iconCssClass: 'fas fa-eraser'
				}
				],
				onCommand: (e, args) => {
					if (args.command === 'toggle-preheader') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.clearGrouping();
					}
					if (args.command === 'exportAsPDF') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.exportAsPDF();
					}
					if (args.command === 'expandGroup') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.expandAllGroups();
					}
					if (args.command === 'collapseGroup') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.collapseAllGroups();
					}
					if (args.command === 'cleargroup') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.clearGrouping();
					}
					if (args.command === 'exportAsExcel') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.exportToExcel(this.dataset, 'myfile');
					}
					if (args.command === 'export-csv') {
						this.exportToFile('csv');
					}
				},
				onColumnsChanged: (e, args) => {
					console.log('Column selection changed from Grid Menu, visible columns: ', args.columns);
				},
			},
			draggableGrouping: {
				dropPlaceHolderText: 'Drop a column header here to group by the column',
				// groupIconCssClass: 'fa fa-outdent',
				deleteIconCssClass: 'fa fa-times',
				onGroupChanged: (e, args) => this.onGroupChanged(args && args.groupColumns),
				onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
			}
		};
		let repoArray = [];
		this.columnDefinitions = [];
		this.dataset = [];
		const collectionJSON: any = {
			'from_date': value.from_date,
			'to_date': value.to_date,
			'pageSize': value.pageSize,
			'pageIndex': value.pageIndex,
			'classId': value.fee_value,
			'secId': value.hidden_value,
			'login_id': value.login_id,
			'orderBy': value.orderBy,
			'downloadAll': true,
		};
		this.columnDefinitions = [
			{
				id: 'srno',
				name: 'SNo.',
				field: 'srno',
				sortable: true,
				maxWidth: 40
			},
			{
				id: 'stu_admission_no', name: 'Enrollment No', field: 'stu_admission_no', sortable: true,
				filterable: true,
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				width: 80,
				groupTotalsFormatter: this.srnTotalsFormatter
			},
			{
				id: 'stu_full_name', name: 'Student Name', field: 'stu_full_name', sortable: true,
				filterable: true,
				width: 120,
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				grouping: {
					getter: 'stu_full_name',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false
				},
			},
			{
				id: 'stu_class_name', name: 'Class-Section', field: 'stu_class_name', sortable: true,
				filterable: true,
				width: 80,
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				grouping: {
					getter: 'stu_class_name',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false,
				},
			},
			{
				id: 'cheque_date', name: 'Cheque Date', field: 'cheque_date', sortable: true,
				filterable: true,
				width: 120,
				filterSearchType: FieldType.dateIso,
				filter: { model: Filters.compoundDate },
				formatter: this.checkDateFormatter,
				grouping: {
					getter: 'cheque_date',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false,
				},
			},
			{
				id: 'deposite_date', name: 'Deposit Date', field: 'deposite_date', sortable: true,
				filterable: true,
				width: 120,
				filterSearchType: FieldType.dateIso,
				filter: { model: Filters.compoundDate },
				formatter: this.checkDateFormatter,
				grouping: {
					getter: 'deposite_date',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false,
				},
			},
			{
				id: 'dishonor_date', name: 'Dishonour/ Cleareance Date', field: 'dishonor_date', sortable: true,
				filterable: true,
				width: 150,
				filterSearchType: FieldType.dateIso,
				filter: { model: Filters.compoundDate },
				formatter: this.checkDateFormatter,
				grouping: {
					getter: 'dishonor_date',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false,
				},
			},
			{
				id: 'receipt_no',
				name: 'Receipt No.',
				width: 40,
				field: 'receipt_no',
				sortable: true,
				filterable: true,
				formatter: this.checkReceiptFormatter,
				cssClass: 'receipt_collection_report',
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
			},
			{
				id: 'receipt_amount',
				name: 'Receipt Amt.',
				width: 40,
				field: 'receipt_amount',
				sortable: true,
				filterable: true,
				cssClass: 'amount-report-fee',
				groupTotalsFormatter: this.sumTotalsFormatter,
				formatter: this.checkFeeFormatter
			},
			{
				id: 'bank_name',
				name: 'Bank Name',
				field: 'bank_name',
				sortable: true,
				width: 120,
				filterable: true,
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
			},
			{
				id: 'status',
				name: 'Status',
				field: 'status',
				width: 80,
				sortable: true,
				filterable: true,
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
			},
			{
				id: 'fcc_reason_id',
				name: 'Reason',
				field: 'fcc_reason_id',
				sortable: true,
				width: 80,
				filterable: true,
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
			},
			{
				id: 'fcc_remarks',
				name: 'Remarks',
				field: 'fcc_remarks',
				width: 40,
				sortable: true,
				filterable: true,
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
			}];
		this.feeService.getCheckControlReport(collectionJSON).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.common.showSuccessErrorMessage(result.message, 'success');
				repoArray = result.data.reportData;
				this.totalRecords = Number(result.data.totalRecords);
				localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
				let index = 0;
				for (const item of repoArray) {
					const obj: any = {};
					obj['id'] = (this.reportFilterForm.value.pageSize * this.reportFilterForm.value.pageIndex) +
						(index + 1);
					obj['srno'] = (this.reportFilterForm.value.pageSize * this.reportFilterForm.value.pageIndex) +
						(index + 1);
					obj['stu_admission_no'] = repoArray[Number(index)]['au_admission_no'] ?
						repoArray[Number(index)]['au_admission_no'] : '-';
					obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(index)]['au_full_name']);
					if (repoArray[Number(index)]['sec_id'] !== '0') {
						obj['stu_class_name'] = repoArray[Number(index)]['class_name'] + '-' +
							repoArray[Number(index)]['sec_name'];
					} else {
						obj['stu_class_name'] = repoArray[Number(index)]['class_name'];
					}
					obj['deposite_date'] = repoArray[Number(index)]['fcc_deposite_date'] ?
						repoArray[Number(index)]['fcc_deposite_date'] : '-';
					obj['cheque_date'] = repoArray[Number(index)]['cheque_date'] ? repoArray[Number(index)]['cheque_date'] : '-';
					obj['receipt_no'] = repoArray[Number(index)]['receipt_no'] ?
						repoArray[Number(index)]['receipt_no'] : '-';
					obj['receipt_id'] = repoArray[Number(index)]['receipt_id'] ?
						repoArray[Number(index)]['receipt_id'] : '0';
					obj['receipt_amount'] = repoArray[Number(index)]['receipt_amount'] ?
						Number(repoArray[Number(index)]['receipt_amount'])
						: 0;
					obj['bank_name'] = repoArray[Number(index)]['bank_name'] ?
						repoArray[Number(index)]['bank_name'] : '-';
					if (Number(repoArray[Number(index)]['status']) === 1) {
						obj['status'] = 'Cleared';
					} else if (Number(repoArray[Number(index)]['status']) === 2) {
						obj['status'] = 'Bounced';
					} else {
						obj['status'] = 'Pending';
					}
					obj['fcc_reason_id'] = repoArray[Number(index)]['reason_title'] ?
						repoArray[Number(index)]['reason_title'] : '-';
					obj['fcc_remarks'] = repoArray[Number(index)]['fcc_remarks'] ?
						repoArray[Number(index)]['fcc_remarks'] : '-';
					if (Number(repoArray[Number(index)]['status']) === 2) {
						obj['dishonor_date'] = repoArray[Number(index)]['dishonor_date'] ? repoArray[Number(index)]['dishonor_date'] : '-';
					} else if (Number(repoArray[Number(index)]['status']) === 1) {
						obj['dishonor_date'] = repoArray[Number(index)]['fcc_process_date'] ? repoArray[Number(index)]['fcc_process_date'] : '-';
					} else {
						obj['dishonor_date'] = '-';
					}
					this.dataset.push(obj);
					index++;
				}
				const obj3: any = {};
				obj3['id'] = '';
				obj3['srno'] = '';
				obj3['stu_admission_no'] = this.common.htmlToText('<b>Grand Total</b>');
				obj3['stu_full_name'] = '';
				obj3['stu_class_name'] = '';
				obj3['deposite_date'] = '';
				obj3['cheque_date'] = '';
				obj3['dishonor_date'] = '';
				obj3['invoice_id'] = '';
				obj3['invoice_no'] = '';
				obj3['receipt_no'] = '';
				obj3['receipt_id'] = '';
				obj3['receipt_amount'] = this.dataset.map(t => t['receipt_amount']).reduce((acc, val) => acc + val, 0);
				obj3['bank_name'] = '';
				obj3['status'] = '';
				obj3['fcc_reason_id'] = '';
				obj3['fcc_remarks'] = '';
				this.dataset.push(obj3);
				if (this.dataset.length < 5) {
					this.gridHeight = 300;
				} else if (this.dataset.length < 10 && this.dataset.length > 5) {
					this.gridHeight = 400;
				} else if (this.dataset.length > 10 && this.dataset.length < 20) {
					this.gridHeight = 550;
				} else if (this.dataset.length > 20) {
					this.gridHeight = 750;
				}
				this.tableFlag = true;
			} else {
				this.tableFlag = true;
			}
		});
	}
	clearGroupsAndSelects() {
		this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = '');
		this.clearGrouping();
	}

	clearGrouping() {
		if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
			this.draggableGroupingPlugin.clearDroppedGroups();
		}
	}

	collapseAllGroups() {
		this.dataviewObj.collapseAllGroups();
	}

	expandAllGroups() {
		this.dataviewObj.expandAllGroups();
	}
	onGroupChanged(groups: Grouping[]) {
		if (Array.isArray(this.selectedGroupingFields) && Array.isArray(groups) && groups.length > 0) {
			// update all Group By select dropdown
			this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = groups[i] && groups[i].getter || '');
		}
	}

	showPreHeader() {
		this.gridObj.setPreHeaderPanelVisibility(true);
	}

	selectTrackByFn(index, item) {
		return index;
	}

	toggleDraggableGroupingRow() {
		this.clearGrouping();
		this.gridObj.setPreHeaderPanelVisibility(!this.gridObj.getOptions().showPreHeaderPanel);
	}
	onCellClicked(e, args) {
		if (args.cell === args.grid.getColumnIndex('receipt_no')) {
			const item: any = args.grid.getDataItem(args.row);
			if (item['receipt_no'] !== '-') {
				this.openDialogReceipt(item['receipt_id'], false);
			}
		}
	}
	onCellChanged(e, args) {
		console.log(e);
		console.log(args);
	}
	sumTotalsFormatter(totals, columnDef) {
		console.log(totals);
		console.log(columnDef);
		const val = totals.sum && totals.sum[columnDef.field];
		if (val != null) {
			return '<b class="total-footer-report">' + new DecimalPipe('en-in').transform(((Math.round(parseFloat(val) * 100) / 100))) + '</b>';
		}
		return '';
	}
	checkFeeFormatter(row, cell, value, columnDef, dataContext) {
		if (value === 0) {
			return '-';
		} else {
			return new DecimalPipe('en-in').transform(value);
		}
	}
	checkTotalFormatter(row, cell, value, columnDef, dataContext) {
		if (value === 0) {
			return '-';
		} else {
			return new DecimalPipe('en-in').transform(value);
		}
	}
	checkReceiptFormatter(row, cell, value, columnDef, dataContext) {
		if (value === '-') {
			return '-';
		} else {
			return '<a>' + value + '</a>';
		}
	}
	checkDateFormatter(row, cell, value, columnDef, dataContext) {
		if (value !== '-') {
			return new DatePipe('en-in').transform(value, 'd-MMM-y');
		} else {
			return '-';
		}
	}
	srnTotalsFormatter(totals, columnDef) {
		return '<b class="total-footer-report">Total</b>';
	}
	openDialogReceipt(invoiceNo, edit): void {
		const dialogRef = this.dialog.open(ReceiptDetailsModalComponent, {
			width: '80%',
			data: {
				rpt_id: invoiceNo,
				edit: edit
			},
			hasBackdrop: true
		});
	}
	getFeeHeads() {
		this.valueArray = [];
		this.feeService.getFeeHeads({ fh_is_hostel_fee: '' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				for (const item of result.data) {
					this.valueArray.push({
						id: item.fh_id,
						name: item.fh_name
					});
				}
			}
		});
	}
	getClass() {
		this.valueArray = [];
		for (const item of this.classDataArray) {
			this.valueArray.push({
				id: item.class_id,
				name: item.class_name
			});
		}
	}
	getClassData() {
		this.sisService.getClass({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.classDataArray = result.data;
				this.getClass();
			}
		});
	}
	getModes() {
		this.valueArray = [];
		this.feeService.getPaymentMode({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				for (const item of result.data) {
					this.valueArray.push({
						id: item.pay_id,
						name: item.pay_name
					});
				}
			}
		});
	}
	getRoutes() {
		this.valueArray = [];
		this.feeService.getRoutes({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				for (const item of result.data) {
					this.valueArray.push({
						id: item.tr_id,
						name: item.tr_route_name
					});
				}
			}
		});
	}
	getSectionByClass($event) {
		this.sisService.getSectionsByClass({ class_id: $event.value }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				for (const item of result.data) {
					this.sectionArray.push({
						id: item.sec_id,
						name: item.sec_name
					});
				}
			}
		});
	}
	openFilterDialog() {
		const dialogRefFilter = this.dialog.open(ReportFilterComponent, {
			width: '70%',
			height: '80%',
			data: {
				filterResult: this.filterResult,
				pro_id: '3',
			}
		});
		dialogRefFilter.afterClosed().subscribe(result => {
		});
		dialogRefFilter.componentInstance.filterResult.subscribe((data: any) => {
			this.filterResult = [];
			this.filterResult = data;
			this.feeService.getStudentsForFilter({ filters: this.filterResult }).subscribe((res: any) => {
				if (res && res.status === 'ok') {
					this.reportFilterForm.patchValue({
						login_id: res.data
					});
				}
			});
		});
	}
	openSort() {
		const sortDialog = this.dialog.open(ReportSortComponent, {
			width: '60vh',
			height: '50vh',
			data: {}
		});
		sortDialog.afterClosed().subscribe((result: any) => {
			if (result) {
				this.sortResult = result;
				this.reportFilterForm.patchValue({
					'orderBy': this.sortResult.length > 0 ? [this.sortResult] : ''
				});
			}
		});
	}
	renderDialog(inv_id, edit) {
		const dialogRef = this.dialog.open(InvoiceDetailsModalComponent, {
			width: '80%',
			data: {
				invoiceNo: inv_id,
				edit: edit,
				paidStatus: 'paid'
			},
			hasBackdrop: true
		});
	}
	exportAsPDF() {
		let reportType: any = '';
		this.sessionName = this.getSessionName(this.session.ses_id);
		reportType = new TitleCasePipe().transform('cheque clearance report:') + this.sessionName;
		const headerData: any[] = [];
		let rowData: any[] = [];
		for (const item of this.columnDefinitions) {
			headerData.push(item.name);
		}
		if (this.dataviewObj.getGroups().length === 0) {
			Object.keys(this.dataset).forEach(key => {
				const arr: any[] = [];
				for (const item of this.columnDefinitions) {
					if (item.id !== 'cheque_date' && item.id !== 'deposite_date' && item.id !== 'dishonor_date') {
						arr.push(this.dataset[key][item.id]);
					} else if ((item.id === 'cheque_date' || item.id === 'deposite_date' || item.id === 'dishonor_date')
						&& this.dataset[key][item.id] !== '-') {
						arr.push(new DatePipe('en-in').transform(this.dataset[key][item.id], 'd-MMM-y'));
					}
				}
				rowData.push(arr);
			});
			const doc = new jsPDF('l', 'mm', 'a0');
			doc.autoTable({
				// tslint:disable-next-line:max-line-length
				head: [[new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state]],
				didDrawPage: function (data) {
					doc.setFont('Roboto');
				},
				headerStyles: {
					fontStyle: 'bold',
					fillColor: '#ffffff',
					textColor: 'black',
					halign: 'center',
					fontSize: 35,
				},
				useCss: true,
				theme: 'striped'
			});
			doc.autoTable({
				head: [[reportType]],
				margin: { top: 0 },
				didDrawPage: function (data) {
					doc.setFont('Roboto');
				},
				headerStyles: {
					fontStyle: 'bold',
					fillColor: '#ffffff',
					textColor: 'black',
					halign: 'center',
					fontSize: 35,
				},
				useCss: true,
				theme: 'striped'
			});
			doc.autoTable({
				head: [headerData],
				body: rowData,
				startY: 65,
				tableLineColor: 'black',
				didDrawPage: function (data) {
					doc.setFontSize(22);
					doc.setTextColor(0);
					doc.setFontStyle('bold');
					doc.setFont('Roboto');
				},
				headerStyles: {
					fontStyle: 'bold',
					fillColor: '#c8d6e5',
					textColor: '#5e666d',
					fontSize: 26,
				},
				alternateRowStyles: {
					fillColor: '#f1f4f7'
				},
				useCss: true,
				styles: {
					fontSize: 35,
					cellWidth: 'auto',
					textColor: 'black',
					lineColor: '#89a8c8',
				},
				theme: 'grid'
			});
			doc.save(reportType + '_' + new Date() + '.pdf');
		} else {
			const doc = new jsPDF('l', 'mm', 'a0');
			doc.autoTable({
				// tslint:disable-next-line:max-line-length
				head: [[new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state]],
				didDrawPage: function (data) {
					doc.setFont('Roboto');
				},
				headerStyles: {
					fontStyle: 'bold',
					fillColor: '#ffffff',
					textColor: 'black',
					halign: 'center',
					fontSize: 30,
				},
				useCss: true,
				theme: 'striped'
			});

			doc.autoTable({
				head: [[reportType]],
				margin: { top: 0 },
				didDrawPage: function (data) {
					doc.setFont('Roboto');
				},
				headerStyles: {
					fontStyle: 'bold',
					fillColor: '#ffffff',
					textColor: 'black',
					halign: 'center',
					fontSize: 30,
				},
				useCss: true,
				theme: 'striped'
			});
			doc.autoTable({
				head: [headerData],
				didDrawPage: function (data) {
					doc.setFontSize(22);
					doc.setTextColor(0);
					doc.setFontStyle('bold');
					doc.setFont('Roboto');
				},
				headerStyles: {
					fontStyle: 'bold',
					fillColor: '#c8d6e5',
					textColor: '#5e666d',
				},
				alternateRowStyles: {
					fillColor: '#f1f4f7'
				},
				useCss: true,
				styles: {
					fontSize: 22,
					cellWidth: 'auto',
				},
				theme: 'striped'
			});
			for (const item of this.dataviewObj.getGroups()) {
				rowData = [];
				Object.keys(item.rows).forEach(key => {
					const arr: any[] = [];
					for (const item2 of this.columnDefinitions) {
						if (item2.id !== 'cheque_date' && item2.id !== 'deposite_date' && item2.id !== 'dishonor_date') {
							arr.push(item.rows[key][item2.id]);
						} else if ((item2.id === 'cheque_date' || item2.id === 'deposite_date' || item2.id === 'dishonor_date')
							&& item.rows[key][item2.id] !== '-') {
							arr.push(new DatePipe('en-in').transform(item.rows[key][item2.id], 'd-MMM-y'));
						}
					}
					rowData.push(arr);
				});
				doc.autoTable({
					head: [[this.common.htmlToText(item.title)]],
					body: rowData,
					didDrawPage: function (data) {
						doc.setFontSize(22);
						doc.setTextColor(0);
						doc.setFontStyle('bold');
						doc.setFont('Roboto');
					},
					headerStyles: {
						fontStyle: 'bold',
						fillColor: '#c8d6e5',
						textColor: 'black',
						fontSize: 35,
						halign: 'left',
					},
					alternateRowStyles: {
						fillColor: '#f1f4f7'
					},
					useCss: true,
					styles: {
						fontSize: 35,
						cellWidth: 'auto',
						textColor: 'black',
						lineColor: '#89a8c8',
					},
					theme: 'grid',
				});
			}
			doc.save(reportType + '_' + new Date() + '.pdf');
		}
	}
	getSchool() {
		this.sisService.getSchool().subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.schoolInfo = res.data[0];
			}
		});
	}
	getFromDate(value) {
		this.reportFilterForm.patchValue({
			from_date: new DatePipe('en-in').transform(value, 'yyyy-MM-dd')
		});
	}
	getToDate(value) {
		this.reportFilterForm.patchValue({
			to_date: new DatePipe('en-in').transform(value, 'yyyy-MM-dd')
		});
	}
	getSessionName(id) {
		const findex = this.sessionArray.findIndex(f => f.ses_id === id);
		if (findex !== -1) {
			return this.sessionArray[findex].ses_name;
		}
	}
	getSession() {
		this.sisService.getSession().subscribe((result2: any) => {
			if (result2.status === 'ok') {
				this.sessionArray = result2.data;
				this.sessionName = this.getSessionName(this.session.ses_id);
			}
		});
	}
	exportToExcel(json: any[], excelFileName: string): void {
		let reportType: any = '';
		this.sessionName = this.getSessionName(this.session.ses_id);
		reportType = new TitleCasePipe().transform('cheque clearance:') + this.sessionName;
		const rowData: any[] = [];
		Object.keys(json).forEach(key => {
			const obj: any = {};
			for (const item2 of this.columnDefinitions) {
				if (item2.id !== 'cheque_date' && item2.id !== 'deposite_date' && item2.id !== 'dishonor_date') {
					obj[item2.name] = this.common.htmlToText(json[key][item2.id]);
				} else if ((item2.id === 'cheque_date' || item2.id === 'deposite_date' || item2.id === 'dishonor_date')
					&& json[key][item2.id] !== '-') {
					obj[item2.name] = new DatePipe('en-in').transform((json[key][item2.id]), 'd-MMM-y');
				}
			}
			rowData.push(obj);
		});
		const fileName = reportType + '.xlsx';
		const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rowData);
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, reportType);
		XLSX.writeFile(wb, fileName);
	}
	exportToFile(type = 'csv') {
		let reportType: any = '';
		this.sessionName = this.getSessionName(this.session.ses_id);
		reportType = new TitleCasePipe().transform('cheque clearance:') + this.sessionName;
		this.angularGrid.exportService.exportToFile({
			delimiter: (type === 'csv') ? DelimiterType.comma : DelimiterType.tab,
			filename: reportType + '_' + new Date(),
			format: (type === 'csv') ? FileType.csv : FileType.txt
		});
	}
}
