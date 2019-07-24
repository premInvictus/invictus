import { Component, OnInit } from '@angular/core';
import {
	GridOption, Column, AngularGridInstance, Grouping, Aggregators,
	FieldType,
	Filters,
	Formatters,
	SortDirectionNumber,
	Sorters,
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
	selector: 'app-fee-ledger-report',
	templateUrl: './fee-ledger-report.component.html',
	styleUrls: ['./fee-ledger-report.component.css']
})
export class FeeLedgerReportComponent implements OnInit {

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
	sessionArray: any[] = [];
	sessionName: any;
	session: any = {};
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
		this.dataArr = [];
		this.aggregatearray = [];
		this.columnDefinitions = [];
		this.dataset = [];
		this.getFeeLedgerReport(this.reportFilterForm.value);
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
			'orderBy': ''
		});
	}

	getFeeLedgerReport(value: any) {
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
				id: 'au_full_name',
				name: 'Student Name',
				field: 'au_full_name',
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				sortable: true,
				filterable: true,
				width: 1,
				cssClass: 'fee-ledger-no'
			},
			{
				id: 'class_name',
				name: 'Class',
				field: 'class_name',
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				sortable: true,
				filterable: true,
				width: 1,
				cssClass: 'fee-ledger-no'
			},
			{
				id: 'sec_name',
				name: 'Sec',
				field: 'sec_name',
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				sortable: true,
				filterable: true,
				width: 1,
				cssClass: 'fee-ledger-no'
			},
			{
				id: 'inv_invoice_date', name: 'Inv. Date',
				field: 'inv_invoice_date', sortable: true, width: 4,
				filterable: true,
				formatter: this.checkDateFormatter,
				filterSearchType: FieldType.dateIso,
				filter: { model: Filters.compoundDate },
				groupTotalsFormatter: this.srnTotalsFormatter
			},
			{
				id: 'flgr_invoice_receipt_no',
				name: 'Inv. No.',
				field: 'flgr_invoice_receipt_no',
				formatter: this.checkReceiptFormatter,
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				sortable: true,
				filterable: true,
				width: 1,
				cssClass: 'fee-ledger-no'
			},
			{
				id: 'flgr_fp_months',
				name: 'Fee Period',
				field: 'flgr_fp_months',
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				sortable: true,
				filterable: true,
				width: 3,
			},
			{
				id: 'flgr_particulars',
				name: 'Particulars',
				field: 'flgr_particulars',
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				sortable: true,
				filterable: true,
				width: 3,
			},
			{
				id: 'inv_due_date', name: 'Due Date',
				field: 'inv_due_date', sortable: true, width: 4,
				filterable: true,
				formatter: this.checkDateFormatter,
				filterSearchType: FieldType.dateIso,
				filter: { model: Filters.compoundDate },
				groupTotalsFormatter: this.srnTotalsFormatter
			},
			{
				id: 'flgr_amount',
				name: 'Amt. Due',
				field: 'flgr_amount',
				cssClass: 'amount-report-fee',
				filterSearchType: FieldType.number,
				filter: { model: Filters.compoundInputNumber },
				sortable: true,
				filterable: true,
				width: 1,
				groupTotalsFormatter: this.sumTotalsFormatter,
				formatter: this.checkFeeFormatter
			},
			{
				id: 'flgr_concession',
				name: 'Con.',
				field: 'flgr_concession',
				cssClass: 'amount-report-fee',
				filterSearchType: FieldType.number,
				filter: { model: Filters.compoundInputNumber },
				sortable: true,
				filterable: true,
				width: 1,
				groupTotalsFormatter: this.sumTotalsFormatter,
				formatter: this.checkFeeFormatter
			},
			{
				id: 'flgr_adj_amount',
				name: 'Adj.',
				field: 'flgr_adj_amount',
				cssClass: 'amount-report-fee',
				filterSearchType: FieldType.number,
				filter: { model: Filters.compoundInputNumber },
				sortable: true,
				filterable: true,
				width: 1,
				groupTotalsFormatter: this.sumTotalsFormatter,
				formatter: this.checkFeeFormatter
			},
			{
				id: 'inv_fine_amount',
				name: 'Fine',
				field: 'inv_fine_amount',
				cssClass: 'amount-report-fee',
				filterSearchType: FieldType.number,
				filter: { model: Filters.compoundInputNumber },
				sortable: true,
				filterable: true,
				width: 1,
				groupTotalsFormatter: this.sumTotalsFormatter,
				formatter: this.checkFeeFormatter
			},
			{
				id: 'flgr_receipt',
				name: 'Amt. Rec.',
				field: 'flgr_receipt',
				cssClass: 'amount-report-fee',
				filterSearchType: FieldType.number,
				filter: { model: Filters.compoundInputNumber },
				sortable: true,
				filterable: true,
				width: 1,
				groupTotalsFormatter: this.sumTotalsFormatter,
				formatter: this.checkFeeFormatter
			},
			{
				id: 'flgr_balance',
				name: 'Balance',
				filterable: true,
				cssClass: 'amount-report-fee',
				field: 'flgr_balance',
				filterSearchType: FieldType.number,
				filter: { model: Filters.compoundInputNumber },
				sortable: true,
				width: 1,
				groupTotalsFormatter: this.sumTotalsFormatter,
				formatter: this.checkFeeFormatter
			},
			{
				id: 'pay_name',
				name: 'MOP',
				field: 'pay_name',
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				sortable: true,
				filterable: true,
				width: 1,
				cssClass: 'fee-ledger-no'
			},
			{
				id: 'rpt_receipt_date', name: 'Receipt Date',
				field: 'rpt_receipt_date', sortable: true, width: 4,
				filterable: true,
				formatter: this.checkDateFormatter,
				filterSearchType: FieldType.dateIso,
				filter: { model: Filters.compoundDate },
				groupTotalsFormatter: this.srnTotalsFormatter
			},
			{
				id: 'rpt_receipt_no',
				name: 'Receipt No',
				field: 'rpt_receipt_no',
				formatter: this.checkReceiptFormatter,
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				sortable: true,
				filterable: true,
				width: 1,
				cssClass: 'fee-ledger-no'
			},
			{
				id: 'remarks',
				name: 'Remark',
				field: 'remarks',
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				sortable: true,
				filterable: true,
				width: 1,
				cssClass: 'fee-ledger-no'
			},
		];
		this.feeService.getFeeLedgerReport(collectionJSON).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				repoArray = [];
				this.dataset = [];
				repoArray = result.data.reportData;
				this.totalRecords = Number(result.data.totalRecords);
				localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
				let index = 0;
				for (const item of repoArray) {
					let j = 0;
					if (item.stu_ledger_arr && item.stu_ledger_arr.length > 0) {
						for (const stu_arr of item.stu_ledger_arr) {
							const obj: any = {};
							obj['id'] = repoArray[Number(index)]['au_admission_no'] + j;
							obj['au_full_name'] = new CapitalizePipe().transform(repoArray[Number(index)]['au_full_name']);
							obj['class_name'] = repoArray[Number(index)]['class_name'];
							obj['sec_name'] = repoArray[Number(index)]['sec_name'];
							obj['inv_invoice_date'] = stu_arr['inv_invoice_date'];
							obj['flgr_invoice_receipt_no'] = stu_arr['flgr_invoice_receipt_no'] && stu_arr['flgr_invoice_receipt_no'] !== '0'
								? stu_arr['flgr_invoice_receipt_no'] : '';
							obj['flgr_created_date'] = stu_arr['flgr_created_date'];
							obj['flgr_fp_months'] = stu_arr['flgr_fp_months'];
							obj['inv_due_date'] = stu_arr['inv_due_date'];
							obj['flgr_adj_amount'] = stu_arr['flgr_adj_amount'];
							obj['inv_fine_amount'] = stu_arr['inv_fine_amount'];
							obj['rpt_receipt_date'] = stu_arr['rpt_receipt_date'];
							obj['rpt_receipt_no'] = stu_arr['rpt_receipt_no'];
							obj['pay_name'] = stu_arr['tb_name'] !== '' ? stu_arr['tb_name'] : stu_arr['pay_name'];
							obj['remarks'] = stu_arr['remarks'];
							if (repoArray[Number(index)]['sec_id'] !== '0') {
								obj['stu_class_name'] = repoArray[Number(index)]['au_admission_name'] +
									',' + new CapitalizePipe().transform(repoArray[Number(index)]['au_full_name']) + ', ' +
									(repoArray[Number(index)]['class_name'] + '-' +
										repoArray[Number(index)]['sec_name']);
							} else {
								obj['stu_class_name'] = repoArray[Number(index)]['au_admission_name'] +
									',' + new CapitalizePipe().transform(repoArray[Number(index)]['au_full_name']) + ', ' +
									repoArray[Number(index)]['class_name'];
							}
							obj['flgr_particulars'] = stu_arr['flgr_particulars'] ?
								stu_arr['flgr_particulars'] : '-';
							obj['flgr_inv_id'] = stu_arr['flgr_inv_id'] ?
								stu_arr['flgr_inv_id'] : '-';
							obj['flgr_amount'] = stu_arr['flgr_amount'] ?
								Number(stu_arr['flgr_amount']) : 0;
							obj['flgr_concession'] = stu_arr['flgr_concession'] ?
								stu_arr['flgr_concession'] : 0;
							obj['flgr_receipt'] = stu_arr['flgr_receipt'] ?
								Number(stu_arr['flgr_receipt']) : '0';
							obj['receipt_id'] = stu_arr['rpt_id'];
							obj['flgr_balance'] = stu_arr['flgr_balance'] ?
								Number(stu_arr['flgr_balance']) : 0;
							this.dataset.push(obj);
							j++;
						}
					}
					index++;
				}
				this.aggregatearray.push(new Aggregators.Sum('flgr_amount'));
				this.aggregatearray.push(new Aggregators.Sum('flgr_concession'));
				this.aggregatearray.push(new Aggregators.Sum('flgr_receipt'));
				this.aggregatearray.push(new Aggregators.Sum('flgr_balance'));
				this.tableFlag = true;
				setTimeout(() => this.groupByClass(), 2);
			} else {
				this.tableFlag = false;
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
	resetValues() {
		this.reportFilterForm.patchValue({
			'login_id': '',
			'orderBy': ''
		});
		this.sortResult = [];
		this.filterResult = [];
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
		if (args.cell === args.grid.getColumnIndex('flgr_invoice_receipt_no')) {
			const item: any = args.grid.getDataItem(args.row);
			if (item['flgr_invoice_receipt_no']) {
				this.renderDialog(Number(item['flgr_inv_id']), false);
			}
		}
		if (args.cell === args.grid.getColumnIndex('rpt_receipt_no')) {
			const item: any = args.grid.getDataItem(args.row);
			console.log(item);
			if (item['rpt_receipt_no']) {
				this.openDialogReceipt(Number(item['receipt_id']), false);
			}
		}
	}
	onCellChanged(e, args) {
		console.log(e);
		console.log(args);
	}
	sumTotalsFormatter(totals, columnDef) {
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
		if (value) {
			return '<a>' + value + '</a>';
		}
	}
	checkDateFormatter(row, cell, value, columnDef, dataContext) {
		return new DatePipe('en-in').transform(value, 'd-MMM-y');
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
	groupByClass() {
		this.dataviewObj.setGrouping({
			getter: 'stu_class_name',
			formatter: (g) => {
				return `<b>${g.value}</b><span style="color:green"> (${g.count})</span>`;
			},
			aggregators: this.aggregatearray,
			aggregateCollapsed: true,
			collapsed: false,
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
	exportAsPDF() {
		const headerData: any[] = [];
		let rowData: any[] = [];
		for (const item of this.columnDefinitions) {
			headerData.push(item.name);
		}
		const reportType = 'Fee Ledger Report: ' + this.sessionName + new Date() + '.pdf';
		this.sessionName = this.getSessionName(this.session.ses_id);
		if (this.dataviewObj.getGroups().length === 0) {
			Object.keys(this.dataset).forEach(key => {
				const arr: any[] = [];
				for (const item of this.columnDefinitions) {
					if (item.id !== 'fp_name' && item.id !== 'inv_invoice_date' && item.id !== 'flgr_created_date') {
						arr.push(this.dataset[key][item.id]);
					}
					if (item.id !== 'fp_name' && (item.id === 'inv_invoice_date' || item.id === 'flgr_created_date')) {
						arr.push(new DatePipe('en-in').transform(this.dataset[key][item.id]), 'd-MMM-y');
					}
					if ((item.id !== 'inv_invoice_date' && item.id !== 'flgr_created_date') && item.id === 'fp_name') {
						arr.push(this.dataset[key][item.id][0]);
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
					fontSize: 40,
				},
				useCss: true,
				theme: 'striped'
			});
			doc.autoTable({
				head: [['Fee Ledger Report' + this.sessionName]],
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
				startY: 60,
				margin: { top: 40 },
				didDrawPage: function (data) {
					doc.setFontSize(22);
					doc.setTextColor(0);
					doc.setFontStyle('bold');
					doc.setFont('Roboto');
				},
				headerStyles: {
					fontStyle: 'bold',
					fillColor: '#bebebe',
					textColor: 'black',
				},
				alternateRowStyles: {
					fillColor: '#f3f3f3'
				},
				useCss: true,
				styles: {
					fontSize: 22,
					cellWidth: 'auto',
				},
				theme: 'striped'
			});
			doc.save(reportType);
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
				head: [['Fee Ledger Report: ' + this.sessionName]],
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
						if (item2.id !== 'fp_name') {
							arr.push(item.rows[key][item2.id]);
						}
						if (item2.id === 'fp_name') {
							arr.push(item.rows[key][item2.id][0]);
						}
					}
					rowData.push(arr);
				});
				doc.autoTable({
					head: [[this.common.htmlToText(item.title)]],
					body: rowData,
					didDrawPage: function (data) {
						doc.setTextColor(0);
						doc.setFontStyle('bold');
						doc.setFont('Roboto');
					},
					headerStyles: {
						fontStyle: 'bold',
						fillColor: '#c8d6e5',
						textColor: 'black',
						fontSize: 20,
						halign: 'left',
					},
					alternateRowStyles: {
						fillColor: '#f1f4f7'
					},
					useCss: true,
					styles: {
						fontSize: 20,
						cellWidth: 'auto',
						textColor: 'black',
						lineColor: '#89a8c8',
					},
					theme: 'grid',
				});
			}
			doc.save(reportType);
		}
	}
	getSchool() {
		this.sisService.getSchool().subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.schoolInfo = res.data[0];
			}
		});
	}
	exportToExcel(json: any[], excelFileName: string): void {
		let reportType: any = '';
		this.sessionName = this.getSessionName(this.session.ses_id);
		reportType = new TitleCasePipe().transform('fee ledger_') + this.sessionName;
		const rowData: any[] = [];
		Object.keys(json).forEach(key => {
			const obj: any = {};
			for (const item2 of this.columnDefinitions) {
				if (item2.id !== 'fp_name' && item2.id !== 'inv_invoice_date') {
					obj[item2.name] = this.common.htmlToText(json[key][item2.id]);
				}
				if (item2.id !== 'fp_name' && item2.id !== 'flgr_created_date') {
					obj[item2.name] = this.common.htmlToText(json[key][item2.id]);
				}
				if (item2.id !== 'fp_name' && item2.id === 'inv_invoice_date'
					&& this.dataset[key][item2.id] !== '<b>Grand Total</b>') {
					obj[item2.name] = new DatePipe('en-in').transform((json[key][item2.id]), 'd-MMM-y');
				}
				if (item2.id !== 'fp_name' && item2.id === 'flgr_created_date'
					&& this.dataset[key][item2.id] !== '<b>Grand Total</b>') {
					obj[item2.name] = new DatePipe('en-in').transform((json[key][item2.id]), 'd-MMM-y');
				}
				if (item2.id !== 'fp_name' && item2.id === 'invoice_created_date'
					&& json[key][item2.id] === '<b>Grand Total</b>') {
					obj[item2.name] = this.common.htmlToText(json[key][item2.id]);
				}
				if (item2.id !== 'fp_name' && item2.id === 'flgr_created_date'
					&& json[key][item2.id] === '<b>Grand Total</b>') {
					obj[item2.name] = this.common.htmlToText(json[key][item2.id]);
				}
				if (item2.id === 'fp_name') {
					obj[item2.name] = this.common.htmlToText(json[key][item2.id][0]);
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
		reportType = new TitleCasePipe().transform('Fee Ledger_: ') + this.sessionName;
		this.angularGrid.exportService.exportToFile({
			delimiter: (type === 'csv') ? DelimiterType.comma : DelimiterType.tab,
			filename: reportType + '_' + new Date(),
			format: (type === 'csv') ? FileType.csv : FileType.txt
		});
	}

}
