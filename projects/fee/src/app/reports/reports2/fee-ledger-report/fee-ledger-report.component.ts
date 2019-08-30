import { Component, OnInit, Input } from '@angular/core';
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
import { saveAs } from 'file-saver';
import * as Excel from 'exceljs/dist/exceljs';
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
	@Input() userName: any = '';
	totalRow: any;
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
	gridHeight: number;
	groupColumns: any[] = [];
	groupLength: any;
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
		this.updateTotalRow(angularGrid.slickGrid);
	}
	updateTotalRow(grid: any) {
		let columnIdx = grid.getColumns().length;
		while (columnIdx--) {
			const columnId = grid.getColumns()[columnIdx].id;
			const columnElement: HTMLElement = grid.getFooterRowColumn(columnId);
			columnElement.innerHTML = '<b>' + this.totalRow[columnId] + '<b>';
		}
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
			footerRowHeight: 35,
			enableExcelCopyBuffer: true,
			enableAutoTooltip: true,
			enableCellNavigation: true,
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
					this.updateTotalRow(this.angularGrid.slickGrid);
				},
			},
			draggableGrouping: {
				dropPlaceHolderText: 'Drop a column header here to group by the column',
				// groupIconCssClass: 'fa fa-outdent',
				deleteIconCssClass: 'fa fa-times',
				onGroupChanged: (e, args) => {
					this.groupColumns = [];
					this.groupColumns = args.groupColumns;
					this.onGroupChanged(args && args.groupColumns);
					setTimeout(() => {
						this.updateTotalRow(this.angularGrid.slickGrid);
					}, 100);
				},
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
				id: 'stu_admission_no',
				name: 'Enrollment No',
				field: 'stu_admission_no',
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				sortable: true,
				filterable: true,
				width: 20,
				grouping: {
					getter: 'stu_admission_no',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false
				},
			},
			{
				id: 'au_full_name',
				name: 'Student Name',
				field: 'au_full_name',
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				sortable: true,
				filterable: true,
				width: 1,
				cssClass: 'fee-ledger-no',
				grouping: {
					getter: 'au_full_name',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false
				},
			},
			{
				id: 'class_name',
				name: 'Class-Section',
				field: 'class_name',
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				sortable: true,
				filterable: true,
				width: 1,
				cssClass: 'fee-ledger-no',
				grouping: {
					getter: 'class_name',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false
				},
			},
			{
				id: 'inv_invoice_date', name: 'Inv. Date',
				field: 'inv_invoice_date', sortable: true, width: 4,
				filterable: true,
				formatter: this.checkDateFormatter,
				filterSearchType: FieldType.dateIso,
				filter: { model: Filters.compoundDate },
				grouping: {
					getter: 'inv_invoice_date',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false
				},
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
				grouping: {
					getter: 'flgr_fp_months',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false
				},
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
				grouping: {
					getter: 'flgr_particulars',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false
				},
			},
			{
				id: 'inv_due_date', name: 'Due Date',
				field: 'inv_due_date', sortable: true, width: 4,
				filterable: true,
				formatter: this.checkDateFormatter,
				filterSearchType: FieldType.dateIso,
				filter: { model: Filters.compoundDate },
				grouping: {
					getter: 'inv_due_date',
					formatter: (g) => {
						if (g.value && g.value !== '-') {
							return `${new DatePipe('en-in').transform(g.value, 'd-MMM-y')}  <span style="color:green">(${g.count})</span>`;
						} else {
							return `${''}`;
						}
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false
				},
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
				grouping: {
					getter: 'pay_name',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false
				},
				cssClass: 'fee-ledger-no'
			},
			{
				id: 'rpt_receipt_date', name: 'Receipt Date',
				field: 'rpt_receipt_date', sortable: true, width: 4,
				filterable: true,
				formatter: this.checkDateFormatter,
				filterSearchType: FieldType.dateIso,
				grouping: {
					getter: 'rpt_receipt_date',
					formatter: (g) => {
						if (g.value && g.value !== '-') {
							return `${new DatePipe('en-in').transform(g.value, 'd-MMM-y')}  <span style="color:green">(${g.count})</span>`;
						} else {
							return `${''}`;
						}
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false
				},
				filter: { model: Filters.compoundDate },
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
				let k = 0;
				for (const item of repoArray) {
					let j = 0;
					if (item.stu_ledger_arr && item.stu_ledger_arr.length > 0) {
						for (const stu_arr of item.stu_ledger_arr) {
							const obj: any = {};
							obj['id'] = repoArray[Number(index)]['au_admission_no'] + stu_arr['rpt_receipt_no'] + j + k +
								stu_arr['rpt_receipt_date'] + stu_arr['inv_due_date'];
							obj['stu_admission_no'] = repoArray[Number(index)]['au_admission_name'];
							obj['au_full_name'] = new CapitalizePipe().transform(repoArray[Number(index)]['au_full_name']);
							if (repoArray[Number(index)]['sec_id'] !== '0') {
								obj['class_name'] = repoArray[Number(index)]['class_name'] + '-' + repoArray[Number(index)]['sec_name'];
							} else {
								obj['class_name'] = repoArray[Number(index)]['class_name'];
							}
							obj['inv_invoice_date'] = stu_arr['inv_invoice_date'];
							obj['flgr_invoice_receipt_no'] = stu_arr['flgr_invoice_receipt_no'] && stu_arr['flgr_invoice_receipt_no'] !== '0'
								? stu_arr['flgr_invoice_receipt_no'] : '';
							obj['flgr_created_date'] = stu_arr['flgr_created_date'];
							obj['flgr_fp_months'] = stu_arr['flgr_fp_months'];
							obj['inv_due_date'] = stu_arr['inv_due_date'];
							obj['flgr_adj_amount'] = stu_arr['flgr_adj_amount'] ? Number(stu_arr['flgr_adj_amount']) : 0;
							obj['inv_fine_amount'] = stu_arr['inv_fine_amount'] ? Number(stu_arr['inv_fine_amount']) : 0;
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
								Number(stu_arr['flgr_concession']) : 0;
							obj['flgr_receipt'] = stu_arr['flgr_receipt'] ?
								Number(stu_arr['flgr_receipt']) : 0;
							obj['receipt_id'] = stu_arr['rpt_id'];
							obj['flgr_balance'] = stu_arr['flgr_balance'] ?
								Number(stu_arr['flgr_balance']) : 0;
							this.dataset.push(obj);
							j++;
						}
					}
					index++;
					k++;
				}
				this.totalRow = {};
				const obj3: any = {};
				obj3['id'] = 'footer';
				obj3['stu_admission_no'] = 'Grand Total';
				obj3['au_full_name'] = '';
				obj3['class_name'] = '';
				obj3['inv_invoice_date'] = '';
				obj3['flgr_invoice_receipt_no'] = '';
				obj3['flgr_created_date'] = '';
				obj3['flgr_fp_months'] = '';
				obj3['inv_due_date'] = '';
				obj3['flgr_adj_amount'] =
					new DecimalPipe('en-in').transform(this.dataset.map(t => t['flgr_adj_amount']).reduce((acc, val) => acc + val, 0));
				obj3['inv_fine_amount'] =
					new DecimalPipe('en-in').transform(this.dataset.map(t => t['inv_fine_amount']).reduce((acc, val) => acc + val, 0));
				obj3['rpt_receipt_date'] = '';
				obj3['rpt_receipt_no'] = '';
				obj3['pay_name'] = '';
				obj3['remarks'] = '';
				obj3['stu_class_name'] = '';
				obj3['flgr_particulars'] = '';
				obj3['flgr_inv_id'] = '';
				obj3['flgr_amount'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t['flgr_amount']).reduce((acc, val) => acc + val, 0));
				obj3['flgr_concession'] =
					new DecimalPipe('en-in').transform(this.dataset.map(t => t['flgr_concession']).reduce((acc, val) => acc + val, 0));
				obj3['flgr_receipt'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t['flgr_receipt']).reduce((acc, val) => acc + val, 0));
				obj3['receipt_id'] = '';
				obj3['flgr_balance'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t['flgr_balance']).reduce((acc, val) => acc + val, 0));
				this.totalRow = obj3;
				this.aggregatearray.push(new Aggregators.Sum('flgr_amount'));
				this.aggregatearray.push(new Aggregators.Sum('flgr_concession'));
				this.aggregatearray.push(new Aggregators.Sum('flgr_receipt'));
				this.aggregatearray.push(new Aggregators.Sum('flgr_balance'));
				if (this.dataset.length <= 5) {
					this.gridHeight = 300;
				} else if (this.dataset.length <= 10 && this.dataset.length > 5) {
					this.gridHeight = 400;
				} else if (this.dataset.length > 10 && this.dataset.length <= 20) {
					this.gridHeight = 550;
				} else if (this.dataset.length > 20) {
					this.gridHeight = 750;
				}
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
		this.updateTotalRow(this.angularGrid.slickGrid);
	}

	expandAllGroups() {
		this.dataviewObj.expandAllGroups();
		this.updateTotalRow(this.angularGrid.slickGrid);
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
		let reportType: any = '';
		this.sessionName = this.getSessionName(this.session.ses_id);
		reportType = new TitleCasePipe().transform('fee ledger report: ') + this.sessionName;
		const doc = new jsPDF('l', 'mm', 'a0');
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [[new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state]],
			didDrawPage: function (data) {

			},
			headStyles: {
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

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 35,
			},
			useCss: true,
			theme: 'striped'
		});
		const rowData: any[] = [];
		for (const item of this.columnDefinitions) {
			headerData.push(item.name);
		}
		if (this.dataviewObj.getGroups().length === 0) {
			Object.keys(this.dataset).forEach((key: any) => {
				const arr5: any[] = [];
				for (const item2 of this.columnDefinitions) {
					if (Number(key) < this.dataset.length - 1) {
						if (item2.id === 'inv_invoice_date' || item2.id === 'flgr_created_date'
							|| item2.id === 'rpt_receipt_date') {
							arr5.push(new DatePipe('en-in').transform((this.dataset[key][item2.id])));
						} else {
							arr5.push(this.common.htmlToText(this.dataset[key][item2.id]));
						}
					}
				}
				rowData.push(arr5);
			});
			doc.autoTable({
				head: [headerData],
				body: rowData,
				startY: 65,
				tableLineColor: 'black',
				didDrawPage: function (data) {
					doc.setFontStyle('bold');

				},
				headStyles: {
					fontStyle: 'bold',
					fillColor: '#c8d6e5',
					textColor: '#5e666d',
					fontSize: 22,
				},
				alternateRowStyles: {
					fillColor: '#f1f4f7'
				},
				useCss: true,
				styles: {
					fontSize: 22,
					cellWidth: 'auto',
					textColor: 'black',
					lineColor: '#89a8c8',
				},
				theme: 'grid'
			});
		} else {
			for (const item of this.dataviewObj.getGroups()) {
				const rowData2 = [];
				if (!item.groups && item.groupingKey && item.groupingKey !== '<b>Grand Total</b>') {
					let indexPage = 0;
					Object.keys(item.rows).forEach(key => {
						const arr6: any[] = [];
						for (const item2 of this.columnDefinitions) {
							if (item2.id === 'inv_invoice_date' || item2.id === 'flgr_created_date'
								|| item2.id === 'rpt_receipt_date') {
								arr6.push(new DatePipe('en-in').transform((item.rows[key][item2.id])));
							} else {
								arr6.push(this.common.htmlToText(item.rows[key][item2.id]));
							}
						}
						rowData2.push(arr6);
						indexPage++;
					});
					doc.autoTable({
						head: [[this.common.htmlToText(item.title)]],
						startY: doc.previousAutoTable.finalY + 1,
						didDrawPage: function (data) {
							doc.setTextColor(0);
							doc.setFontStyle('bold');

						},
						headStyles: {
							fontStyle: 'bold',
							fillColor: '#c8d6e5',
							textColor: '#5e666d',
							fontSize: 22,
						},
						alternateRowStyles: {
							fillColor: '#f1f4f7'
						},
						useCss: true,
						styles: {
							fontSize: 22,
							cellWidth: 'auto',
						},
						theme: 'grid'
					});
					doc.autoTable({
						head: [headerData],
						body: rowData2,
						startY: doc.previousAutoTable.finalY + 1,
						didDrawPage: function (data) {
							doc.setTextColor(0);
							doc.setFontStyle('bold');

						},
						headStyles: {
							fontStyle: 'bold',
							fillColor: '#c8d6e5',
							textColor: '#5e666d',
							fontSize: 22,
						},
						alternateRowStyles: {
							fillColor: '#f1f4f7'
						},
						useCss: true,
						styles: {
							fontSize: 22,
							cellWidth: 'auto',
						},
						theme: 'grid'
					});
					if (indexPage === item.rows.length) {
						const headerArr: any[] = [];
						const arr2: any[] = [];
						const obj5: any = {};
						obj5['id'] = 'footer';
						obj5['stu_admission_no'] = '';
						obj5['au_full_name'] = '';
						obj5['class_name'] = '';
						obj5['inv_invoice_date'] = 'Total';
						obj5['flgr_invoice_receipt_no'] = '';
						obj5['flgr_created_date'] = '';
						obj5['flgr_fp_months'] = '';
						obj5['inv_due_date'] = '';
						obj5['flgr_adj_amount'] = item.rows.map(t => t['flgr_adj_amount']).reduce((acc, val) => acc + val, 0);
						obj5['inv_fine_amount'] = item.rows.map(t => t['inv_fine_amount']).reduce((acc, val) => acc + val, 0);
						obj5['rpt_receipt_date'] = '';
						obj5['rpt_receipt_no'] = '';
						obj5['pay_name'] = '';
						obj5['remarks'] = '';
						obj5['stu_class_name'] = '';
						obj5['flgr_particulars'] = '';
						obj5['flgr_inv_id'] = '';
						obj5['flgr_amount'] = item.rows.map(t => t['flgr_amount']).reduce((acc, val) => acc + val, 0);
						obj5['flgr_concession'] = item.rows.map(t => t['flgr_concession']).reduce((acc, val) => acc + val, 0);
						obj5['flgr_receipt'] = item.rows.map(t => t['flgr_receipt']).reduce((acc, val) => acc + val, 0);
						obj5['receipt_id'] = '';
						obj5['flgr_balance'] = item.rows.map(t => t['flgr_balance']).reduce((acc, val) => acc + val, 0);
						for (const itemJ of this.columnDefinitions) {
							Object.keys(obj5).forEach((key: any) => {
								if (itemJ.id === key) {
									arr2.push(obj5[key]);
								}
							});
						}
						headerArr.push(arr2);
						doc.autoTable({
							head: [headerData],
							body: headerArr,
							tableLineColor: 'black',
							startY: doc.previousAutoTable.finalY + 0.5,
							didDrawPage: function (data) {
								doc.setFontStyle('bold');

							},
							headStyles: {
								fontStyle: 'normal',
								fillColor: '#c8d6e5',
								textColor: '#5e666d',
								fontSize: 22,
							},
							alternateRowStyles: {
								fillColor: '#004261',
								textColor: '#ffffff',
								fontStyle: 'bold',
							},
							useCss: true,
							styles: {
								fontSize: 22,
								cellWidth: 'auto',
								textColor: 'black',
								lineColor: '#89a8c8',
							},
							theme: 'grid'
						});
					}
				} else {
					if (item.groupingKey && item.groupingKey !== '<b>Grand Total</b>') {
						this.checkGroupLevelPDF(item, doc, headerData);
						this.checkLastTotPDF(item, doc, headerData);
					}
				}
			}
		}
		const headerArr2: any[] = [];
		const obj3: any = {};
		const arr: any[] = [];
		obj3['id'] = 'footer';
		obj3['stu_admission_no'] = '';
		obj3['au_full_name'] = '';
		obj3['class_name'] = '';
		obj3['inv_invoice_date'] = 'Grand Total';
		obj3['flgr_invoice_receipt_no'] = '';
		obj3['flgr_created_date'] = '';
		obj3['flgr_fp_months'] = '';
		obj3['inv_due_date'] = '';
		obj3['flgr_adj_amount'] = (this.dataset.map(t => t['flgr_adj_amount']).reduce((acc, val) => acc + val, 0));
		obj3['inv_fine_amount'] = (this.dataset.map(t => t['inv_fine_amount']).reduce((acc, val) => acc + val, 0));
		obj3['rpt_receipt_date'] = '';
		obj3['rpt_receipt_no'] = '';
		obj3['pay_name'] = '';
		obj3['remarks'] = '';
		obj3['stu_class_name'] = '';
		obj3['flgr_particulars'] = '';
		obj3['flgr_inv_id'] = '';
		obj3['flgr_amount'] = (this.dataset.map(t => t['flgr_amount']).reduce((acc, val) => acc + val, 0));
		obj3['flgr_concession'] = (this.dataset.map(t => t['flgr_concession']).reduce((acc, val) => acc + val, 0));
		obj3['flgr_receipt'] = (this.dataset.map(t => t['flgr_receipt']).reduce((acc, val) => acc + val, 0));
		obj3['receipt_id'] = '';
		obj3['flgr_balance'] = (this.dataset.map(t => t['flgr_balance']).reduce((acc, val) => acc + val, 0));
		for (const itemj of this.columnDefinitions) {
			Object.keys(obj3).forEach((key: any) => {
				if (itemj.id === key) {
					arr.push(obj3[key]);
				}
			});
		}
		headerArr2.push(arr);
		doc.autoTable({
			head: [headerData],
			body: headerArr2,
			tableLineColor: 'black',
			startY: doc.previousAutoTable.finalY + 0.5,
			didDrawPage: function (data) {
				doc.setFontStyle('bold');

			},
			headStyles: {
				fontStyle: 'normal',
				fillColor: '#c8d6e5',
				textColor: '#5e666d',
				fontSize: 22,
			},
			alternateRowStyles: {
				fillColor: '#43A047',
				textColor: '#ffffff',
				fontStyle: 'bold',
			},
			useCss: true,
			styles: {
				fontSize: 22,
				cellWidth: 'auto',
				textColor: 'black',
				lineColor: '#89a8c8',
			},
			theme: 'grid'
		});
		if (this.groupColumns.length > 0) {
			doc.autoTable({
				// tslint:disable-next-line:max-line-length
				head: [['Groupded As: ' + this.getGroupColumns(this.groupColumns)]],
				didDrawPage: function (data) {
				},
				headStyles: {
					fontStyle: 'bold',
					fillColor: '#ffffff',
					textColor: 'black',
					halign: 'left',
					fontSize: 22,
				},
				useCss: true,
				theme: 'striped'
			});
		}
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [['Report Filtered as: ' +
				new DatePipe('en-in').transform(this.reportFilterForm.value.from_date, 'd-MMM-y')
				+ ' - ' +
				new DatePipe('en-in').transform(this.reportFilterForm.value.to_date, 'd-MMM-y')]],
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 22,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [['No of records: ' + this.totalRecords]],
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 22,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [['Generated On: '
				+ new DatePipe('en-in').transform(new Date(), 'd-MMM-y')]],
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 22,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [['Generated By: ' + this.userName]],
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 22,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.save(reportType + '_' + new Date() + '.pdf');
	}
	getSchool() {
		this.sisService.getSchool().subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.schoolInfo = res.data[0];
			}
		});
	}
	checkReturn(data) {
		if (Number(data)) {
			return Number(data);
		} else {
			return data;
		}
	}
	exportToExcel(json: any[], excelFileName: string) {
		let reportType: any = '';
		const columns: any[] = [];
		const columValue: any[] = [];
		for (const item of this.columnDefinitions) {
			columns.push({
				key: item.id,
				width: this.checkWidth(item.id, item.name)
			});
			columValue.push(item.name);
		}
		this.sessionName = this.getSessionName(this.session.ses_id);
		reportType = new TitleCasePipe().transform('fee ledger_') + this.sessionName;
		let reportType2: any = '';
		reportType2 = new TitleCasePipe().transform('fee ledger report: ') + this.sessionName;
		const fileName = reportType + '.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		worksheet.mergeCells('A1:' + this.alphabetJSON[columns.length] + '1'); // Extend cell over all column headers
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[columns.length] + '2');
		worksheet.getCell('A2').value = reportType2;
		worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
		worksheet.getRow(4).values = columValue;
		worksheet.columns = columns;
		if (this.dataviewObj.getGroups().length === 0) {
			Object.keys(json).forEach(key => {
				const obj: any = {};
				for (const item2 of this.columnDefinitions) {
					if (item2.id === 'inv_invoice_date' || item2.id === 'flgr_created_date'
						|| item2.id === 'rpt_receipt_date') {
						obj[item2.id] = new DatePipe('en-in').transform((json[key][item2.id]));
					} else {
						obj[item2.id] = this.checkReturn(this.common.htmlToText(json[key][item2.id]));
					}
				}
				worksheet.addRow(obj);
			});
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
					row.eachCell((cell) => {
						cell.font = {
							name: 'Arial',
							size: 12,
							bold: true
						};
						cell.fill = {
							type: 'pattern',
							pattern: 'solid',
							fgColor: { argb: 'bdbdbd' },
							bgColor: { argb: 'bdbdbd' },
						};
						cell.border = {
							top: { style: 'thin' },
							left: { style: 'thin' },
							bottom: { style: 'thin' },
							right: { style: 'thin' }
						};
						cell.alignment = { horizontal: 'center' };
					});
				} else if (rowNum > 4 && rowNum < worksheet._rows.length) {
					row.eachCell((cell) => {
						cell.font = {
							name: 'Arial',
							size: 10,
						};
						cell.alignment = { wrapText: true, horizontal: 'center' };
					});
					if (rowNum % 2 === 0) {
						row.eachCell((cell) => {
							cell.fill = {
								type: 'pattern',
								pattern: 'solid',
								fgColor: { argb: 'ffffff' },
								bgColor: { argb: 'ffffff' },
							};
							cell.border = {
								top: { style: 'thin' },
								left: { style: 'thin' },
								bottom: { style: 'thin' },
								right: { style: 'thin' }
							};
						});
					} else {
						row.eachCell((cell) => {
							cell.fill = {
								type: 'pattern',
								pattern: 'solid',
								fgColor: { argb: 'dedede' },
								bgColor: { argb: 'dedede' },
							};
							cell.border = {
								top: { style: 'thin' },
								left: { style: 'thin' },
								bottom: { style: 'thin' },
								right: { style: 'thin' }
							};
						});
					}
				} else if (rowNum > 4 && rowNum === worksheet._rows.length) {
					row.eachCell((cell) => {
						cell.font = {
							name: 'Arial',
							size: 10,
							bold: true
						};
						cell.border = {
							top: { style: 'thin' },
							left: { style: 'thin' },
							bottom: { style: 'thin' },
							right: { style: 'thin' }
						};
						cell.alignment = { horizontal: 'center' };
					});
				}
			});
		} else {
			let obj = {};
			let length = worksheet._rows.length + 1;
			this.groupLength = length;
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
					row.eachCell((cell) => {
						cell.font = {
							name: 'Arial',
							size: 12,
							bold: true
						};
						cell.fill = {
							type: 'pattern',
							pattern: 'solid',
							fgColor: { argb: 'bdbdbd' },
							bgColor: { argb: 'bdbdbd' },
						};
						cell.border = {
							top: { style: 'thin' },
							left: { style: 'thin' },
							bottom: { style: 'thin' },
							right: { style: 'thin' }
						};
						cell.alignment = { horizontal: 'center' };
					});
				}
			});
			let index = 0;
			for (const item of this.dataviewObj.getGroups()) {
				if (!item.groups && item.groupingKey && item.groupingKey !== '<b>Grand Total</b>') {
					const length2 = length;
					const obj2: any = {};
					worksheet.mergeCells('A' + (length) + ':' +
						this.alphabetJSON[columns.length] + (length));
					worksheet.getCell('A' + length).value = this.common.htmlToText(item.title);
					worksheet.getCell('A' + length).fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: 'c8d6e5' },
						bgColor: { argb: 'ffffff' },
					};
					worksheet.getCell('A' + length).border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					worksheet.getCell('A' + length).font = {
						name: 'Arial',
						size: 10,
						bold: true
					};
					worksheet.getCell('A' + length2).alignment = { horizontal: 'left' };
					let indexPage = 0;
					Object.keys(item.rows).forEach(key => {
						obj = {};
						for (const item2 of this.columnDefinitions) {
							if (item2.id === 'inv_invoice_date' || item2.id === 'flgr_created_date'
								|| item2.id === 'rpt_receipt_date') {
								obj[item2.id] = new DatePipe('en-in').transform((item.rows[key][item2.id]));
							} else {
								obj[item2.id] = this.checkReturn(this.common.htmlToText(item.rows[key][item2.id]));
							}
						}
						worksheet.addRow(obj);
						length++;
						worksheet.getRow(length).fill = {
							type: 'pattern',
							pattern: 'solid',
							fgColor: { argb: 'ffffff' },
							bgColor: { argb: 'ffffff' },
						};
						worksheet.getRow(length).border = {
							top: { style: 'thin' },
							left: { style: 'thin' },
							bottom: { style: 'thin' },
							right: { style: 'thin' }
						};
						worksheet.getRow(length).font = {
							name: 'Arial',
							size: 10,
						};
						worksheet.getRow(length).alignment = { horizontal: 'center' };
						indexPage++;
					});
					if (indexPage === item.rows.length) {
						const obj5: any = {};
						obj5['id'] = 'footer';
						obj5['stu_admission_no'] = '';
						obj5['au_full_name'] = '';
						obj5['class_name'] = '';
						obj5['inv_invoice_date'] = 'Total';
						obj5['flgr_invoice_receipt_no'] = '';
						obj5['flgr_created_date'] = '';
						obj5['flgr_fp_months'] = '';
						obj5['inv_due_date'] = '';
						obj5['flgr_adj_amount'] = item.rows.map(t => t['flgr_adj_amount']).reduce((acc, val) => acc + val, 0);
						obj5['inv_fine_amount'] = item.rows.map(t => t['inv_fine_amount']).reduce((acc, val) => acc + val, 0);
						obj5['rpt_receipt_date'] = '';
						obj5['rpt_receipt_no'] = '';
						obj5['pay_name'] = '';
						obj5['remarks'] = '';
						obj5['stu_class_name'] = '';
						obj5['flgr_particulars'] = '';
						obj5['flgr_inv_id'] = '';
						obj5['flgr_amount'] = item.rows.map(t => t['flgr_amount']).reduce((acc, val) => acc + val, 0);
						obj5['flgr_concession'] = item.rows.map(t => t['flgr_concession']).reduce((acc, val) => acc + val, 0);
						obj5['flgr_receipt'] = item.rows.map(t => t['flgr_receipt']).reduce((acc, val) => acc + val, 0);
						obj5['receipt_id'] = '';
						obj5['flgr_balance'] = item.rows.map(t => t['flgr_balance']).reduce((acc, val) => acc + val, 0);
						worksheet.addRow(obj5);
						length++;
						worksheet.getRow(length).alignment = { horizontal: 'center' };
						worksheet.eachRow((row, rowNum) => {
							if (rowNum === length) {
								row.eachCell(cell => {
									cell.fill = {
										type: 'pattern',
										pattern: 'solid',
										fgColor: { argb: '004261' },
										bgColor: { argb: '004261' },
									};
									cell.font = {
										color: { argb: 'ffffff' },
										bold: true,
										name: 'Arial',
										size: 10
									};
								});
							}
						});
					}
					length++;
				} else {
					if (item.groupingKey && item.groupingKey !== '<b>Grand Total</b>') {
						this.checkGroupLevel(item, worksheet);
						this.checkLastTot(item, worksheet);
						this.groupLength++;
					}
				}
				index++;
			}
		}
		const obj3: any = {};
		obj3['id'] = 'footer';
		obj3['stu_admission_no'] = '';
		obj3['au_full_name'] = '';
		obj3['class_name'] = '';
		obj3['inv_invoice_date'] = 'Grand Total';
		obj3['flgr_invoice_receipt_no'] = '';
		obj3['flgr_created_date'] = '';
		obj3['flgr_fp_months'] = '';
		obj3['inv_due_date'] = '';
		obj3['flgr_adj_amount'] = (this.dataset.map(t => t['flgr_adj_amount']).reduce((acc, val) => acc + val, 0));
		obj3['inv_fine_amount'] = (this.dataset.map(t => t['inv_fine_amount']).reduce((acc, val) => acc + val, 0));
		obj3['rpt_receipt_date'] = '';
		obj3['rpt_receipt_no'] = '';
		obj3['pay_name'] = '';
		obj3['remarks'] = '';
		obj3['stu_class_name'] = '';
		obj3['flgr_particulars'] = '';
		obj3['flgr_inv_id'] = '';
		obj3['flgr_amount'] = (this.dataset.map(t => t['flgr_amount']).reduce((acc, val) => acc + val, 0));
		obj3['flgr_concession'] = (this.dataset.map(t => t['flgr_concession']).reduce((acc, val) => acc + val, 0));
		obj3['flgr_receipt'] = (this.dataset.map(t => t['flgr_receipt']).reduce((acc, val) => acc + val, 0));
		obj3['receipt_id'] = '';
		obj3['flgr_balance'] = (this.dataset.map(t => t['flgr_balance']).reduce((acc, val) => acc + val, 0));
		worksheet.addRow(obj3);
		worksheet.eachRow((row, rowNum) => {
			if (rowNum === worksheet._rows.length) {
				row.eachCell(cell => {
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: '439f47' },
						bgColor: { argb: '439f47' },
					};
					cell.font = {
						color: { argb: 'ffffff' },
						bold: true,
						name: 'Arial',
						size: 10
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					cell.alignment = { horizontal: 'center' };
				});
			}
		});
		if (this.groupColumns.length > 0) {
			worksheet.mergeCells('A' + (worksheet._rows.length + 2) + ':' +
				this.alphabetJSON[columns.length] + (worksheet._rows.length + 2));
			worksheet.getCell('A' + worksheet._rows.length).value = 'Groupded As: ' + this.getGroupColumns(this.groupColumns);
			worksheet.eachRow((row, rowNum) => {
				if (rowNum === worksheet._rows.length) {
					row.eachCell((cell: any) => {
						cell.font = {
							name: 'Arial',
							size: 10,
							bold: true
						};
					});
				}
			});
			worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
				this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
			worksheet.getCell('A' + worksheet._rows.length).value = 'Report Filtered as: ' +
				new DatePipe('en-in').transform(this.reportFilterForm.value.from_date, 'd-MMM-y')
				+ ' - ' +
				new DatePipe('en-in').transform(this.reportFilterForm.value.to_date, 'd-MMM-y');
		} else {
			worksheet.mergeCells('A' + (worksheet._rows.length + 2) + ':' +
				this.alphabetJSON[columns.length] + (worksheet._rows.length + 2));
			worksheet.getCell('A' + worksheet._rows.length).value = 'Report Filtered as: ' +
				new DatePipe('en-in').transform(this.reportFilterForm.value.from_date, 'd-MMM-y')
				+ ' - ' +
				new DatePipe('en-in').transform(this.reportFilterForm.value.to_date, 'd-MMM-y');
		}
		worksheet.getCell('A' + worksheet._rows.length).font = {
			name: 'Arial',
			size: 10,
			bold: true
		};
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
		worksheet.getCell('A' + worksheet._rows.length).value = 'Generated By: ' + this.userName;
		worksheet.getCell('A' + worksheet._rows.length).font = {
			name: 'Arial',
			size: 10,
			bold: true
		};
		workbook.xlsx.writeBuffer().then(data => {
			const blob = new Blob([data], { type: 'application/octet-stream' });
			saveAs(blob, fileName);
		});
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
	checkWidth(id, header) {
		const res = this.dataset.map((f) => (f[id] !== '-' && f[id]) ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
	}
	checkGroupLevel(item, worksheet) {
		worksheet.mergeCells('A' + (this.groupLength) + ':' +
			this.alphabetJSON[this.columnDefinitions.length] + (this.groupLength));
		worksheet.getCell('A' + this.groupLength).value = this.common.htmlToText(item.title);
		worksheet.getCell('A' + this.groupLength).fill = {
			type: 'pattern',
			pattern: 'solid',
			fgColor: { argb: 'c8d6e5' },
			bgColor: { argb: 'ffffff' },
		};
		worksheet.getCell('A' + this.groupLength).border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' }
		};
		worksheet.getCell('A' + this.groupLength).font = {
			name: 'Arial',
			size: 10,
			bold: true
		};
		if (item.groups) {
			let index = 0;
			for (const groupItem of item.groups) {
				if (groupItem.groups) {
					this.groupLength++;
					this.checkGroupLevel(groupItem, worksheet);
				} else {
					this.groupLength = this.groupLength + index + 1;
					worksheet.mergeCells('A' + (this.groupLength) + ':' +
						this.alphabetJSON[this.columnDefinitions.length] + (this.groupLength));
					worksheet.getCell('A' + this.groupLength).value = this.common.htmlToText(groupItem.title);
					worksheet.getCell('A' + this.groupLength).fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: 'c8d6e5' },
						bgColor: { argb: 'ffffff' },
					};
					worksheet.getCell('A' + this.groupLength).border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					worksheet.getCell('A' + this.groupLength).font = {
						name: 'Arial',
						size: 10,
						bold: true
					};
					Object.keys(groupItem.rows).forEach(key => {
						const obj = {};
						for (const item2 of this.columnDefinitions) {
							if (item2.id === 'inv_invoice_date' || item2.id === 'flgr_created_date'
								|| item2.id === 'rpt_receipt_date') {
								obj[item2.id] = new DatePipe('en-in').transform((groupItem.rows[key][item2.id]));
							} else {
								obj[item2.id] = this.checkReturn(this.common.htmlToText(groupItem.rows[key][item2.id]));
							}
						}
						worksheet.addRow(obj);
						this.groupLength++;
						worksheet.getRow(this.groupLength).fill = {
							type: 'pattern',
							pattern: 'solid',
							fgColor: { argb: 'ffffff' },
							bgColor: { argb: 'ffffff' },
						};
						worksheet.getRow(this.groupLength).border = {
							top: { style: 'thin' },
							left: { style: 'thin' },
							bottom: { style: 'thin' },
							right: { style: 'thin' }
						};
						worksheet.getRow(this.groupLength).font = {
							name: 'Arial',
							size: 10,
						};
						worksheet.getRow(this.groupLength).alignment = { horizontal: 'center' };
					});
					const obj3: any = {};
					obj3['id'] = 'footer';
					obj3['stu_admission_no'] = '';
					obj3['au_full_name'] = '';
					obj3['class_name'] = '';
					obj3['inv_invoice_date'] = 'Sub Total';
					obj3['flgr_invoice_receipt_no'] = '';
					obj3['flgr_created_date'] = '';
					obj3['flgr_fp_months'] = '';
					obj3['inv_due_date'] = '';
					obj3['flgr_adj_amount'] = groupItem.rows.map(t => t['flgr_adj_amount']).reduce((acc, val) => acc + val, 0);
					obj3['inv_fine_amount'] = groupItem.rows.map(t => t['inv_fine_amount']).reduce((acc, val) => acc + val, 0);
					obj3['rpt_receipt_date'] = '';
					obj3['rpt_receipt_no'] = '';
					obj3['pay_name'] = '';
					obj3['remarks'] = '';
					obj3['stu_class_name'] = '';
					obj3['flgr_particulars'] = '';
					obj3['flgr_inv_id'] = '';
					obj3['flgr_amount'] = groupItem.rows.map(t => t['flgr_amount']).reduce((acc, val) => acc + val, 0);
					obj3['flgr_concession'] = groupItem.rows.map(t => t['flgr_concession']).reduce((acc, val) => acc + val, 0);
					obj3['flgr_receipt'] = groupItem.rows.map(t => t['flgr_receipt']).reduce((acc, val) => acc + val, 0);
					obj3['receipt_id'] = '';
					obj3['flgr_balance'] = groupItem.rows.map(t => t['flgr_balance']).reduce((acc, val) => acc + val, 0);
					worksheet.addRow(obj3);
					this.groupLength++;
					worksheet.getRow(this.groupLength).alignment = { horizontal: 'center' };
					worksheet.eachRow((row, rowNum) => {
						if (rowNum === this.groupLength) {
							row.eachCell(cell => {
								cell.font = {
									bold: true,
									name: 'Arial',
									size: 10
								};
							});
						}
					});
				}
				index++;
			}
		}
	}
	checkLastTot(item, worksheet) {
		const obj3: any = {};
		obj3['id'] = 'footer';
		obj3['stu_admission_no'] = '';
		obj3['au_full_name'] = '';
		obj3['class_name'] = '';
		obj3['inv_invoice_date'] = 'Total';
		obj3['flgr_invoice_receipt_no'] = '';
		obj3['flgr_created_date'] = '';
		obj3['flgr_fp_months'] = '';
		obj3['inv_due_date'] = '';
		obj3['flgr_adj_amount'] = item.rows.map(t => t['flgr_adj_amount']).reduce((acc, val) => acc + val, 0);
		obj3['inv_fine_amount'] = item.rows.map(t => t['inv_fine_amount']).reduce((acc, val) => acc + val, 0);
		obj3['rpt_receipt_date'] = '';
		obj3['rpt_receipt_no'] = '';
		obj3['pay_name'] = '';
		obj3['remarks'] = '';
		obj3['stu_class_name'] = '';
		obj3['flgr_particulars'] = '';
		obj3['flgr_inv_id'] = '';
		obj3['flgr_amount'] = item.rows.map(t => t['flgr_amount']).reduce((acc, val) => acc + val, 0);
		obj3['flgr_concession'] = item.rows.map(t => t['flgr_concession']).reduce((acc, val) => acc + val, 0);
		obj3['flgr_receipt'] = item.rows.map(t => t['flgr_receipt']).reduce((acc, val) => acc + val, 0);
		obj3['receipt_id'] = '';
		obj3['flgr_balance'] = item.rows.map(t => t['flgr_balance']).reduce((acc, val) => acc + val, 0);
		worksheet.addRow(obj3);
		this.groupLength++;
		worksheet.getRow(this.groupLength).alignment = { horizontal: 'center' };
		worksheet.eachRow((row, rowNum) => {
			if (rowNum === this.groupLength) {
				row.eachCell(cell => {
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: '004261' },
						bgColor: { argb: '004261' },
					};
					cell.font = {
						color: { argb: 'ffffff' },
						bold: true,
						name: 'Arial',
						size: 10
					};
				});
			}
		});
	}
	getGroupColumns(columns) {
		let grName = '';
		for (const item of columns) {
			for (const titem of this.columnDefinitions) {
				if (item.getter === titem.id) {
					grName = grName + titem.name + ',';
					break;
				}
			}
		}
		return grName.substring(0, grName.length - 1);
	}
	checkGroupLevelPDF(item, doc, headerData) {
		doc.autoTable({
			head: [[this.common.htmlToText(item.title)]],
			startY: doc.previousAutoTable.finalY + 1,
			didDrawPage: function (data) {
				doc.setTextColor(0);
				doc.setFontStyle('bold');

			},
			headStyles: {
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
				fontSize: 22,
				cellWidth: 'auto',
			},
			theme: 'grid'
		});
		if (item.groups) {
			let index = 0;
			for (const groupItem of item.groups) {
				if (groupItem.groups) {
					this.checkGroupLevelPDF(groupItem, doc, headerData);
				} else {
					doc.autoTable({
						head: [[this.common.htmlToText(groupItem.title)]],
						startY: doc.previousAutoTable.finalY + 1,
						didDrawPage: function (data) {
							doc.setTextColor(0);
							doc.setFontStyle('bold');

						},
						headStyles: {
							fontStyle: 'bold',
							fillColor: '#c8d6e5',
							textColor: '#5e666d',
							fontSize: 22,
						},
						alternateRowStyles: {
							fillColor: '#f1f4f7'
						},
						useCss: true,
						styles: {
							fontSize: 22,
							cellWidth: 'auto',
						},
						theme: 'grid'
					});
					const rowData: any[] = [];
					Object.keys(groupItem.rows).forEach(key => {
						const arr8: any = [];
						for (const item2 of this.columnDefinitions) {
							if (item2.id === 'inv_invoice_date' || item2.id === 'flgr_created_date'
								|| item2.id === 'rpt_receipt_date') {
								arr8.push(new DatePipe('en-in').transform((groupItem.rows[key][item2.id])));
							} else {
								arr8.push(this.common.htmlToText(groupItem.rows[key][item2.id]));
							}
						}
						rowData.push(arr8);
					});
					doc.autoTable({
						head: [headerData],
						body: rowData,
						startY: doc.previousAutoTable.finalY + 1,
						didDrawPage: function (data) {
							doc.setTextColor(0);
							doc.setFontStyle('bold');

						},
						headStyles: {
							fontStyle: 'bold',
							fillColor: '#c8d6e5',
							textColor: '#5e666d',
							fontSize: 22,
						},
						alternateRowStyles: {
							fillColor: '#f1f4f7'
						},
						useCss: true,
						styles: {
							fontSize: 22,
							cellWidth: 'auto',
						},
						theme: 'grid'
					});
					const headerArr2: any[] = [];
					const obj3: any = {};
					const arr: any[] = [];
					obj3['id'] = 'footer';
					obj3['stu_admission_no'] = '';
					obj3['au_full_name'] = '';
					obj3['class_name'] = '';
					obj3['inv_invoice_date'] = 'Sub Total';
					obj3['flgr_invoice_receipt_no'] = '';
					obj3['flgr_created_date'] = '';
					obj3['flgr_fp_months'] = '';
					obj3['inv_due_date'] = '';
					obj3['flgr_adj_amount'] = groupItem.rows.map(t => t['flgr_adj_amount']).reduce((acc, val) => acc + val, 0);
					obj3['inv_fine_amount'] = groupItem.rows.map(t => t['inv_fine_amount']).reduce((acc, val) => acc + val, 0);
					obj3['rpt_receipt_date'] = '';
					obj3['rpt_receipt_no'] = '';
					obj3['pay_name'] = '';
					obj3['remarks'] = '';
					obj3['stu_class_name'] = '';
					obj3['flgr_particulars'] = '';
					obj3['flgr_inv_id'] = '';
					obj3['flgr_amount'] = groupItem.rows.map(t => t['flgr_amount']).reduce((acc, val) => acc + val, 0);
					obj3['flgr_concession'] = groupItem.rows.map(t => t['flgr_concession']).reduce((acc, val) => acc + val, 0);
					obj3['flgr_receipt'] = groupItem.rows.map(t => t['flgr_receipt']).reduce((acc, val) => acc + val, 0);
					obj3['receipt_id'] = '';
					obj3['flgr_balance'] = groupItem.rows.map(t => t['flgr_balance']).reduce((acc, val) => acc + val, 0);
					for (const col of this.columnDefinitions) {
						Object.keys(obj3).forEach((key: any) => {
							if (col.id === key) {
								arr.push(obj3[key]);
							}
						});
					}
					headerArr2.push(arr);
					doc.autoTable({
						head: [headerData],
						body: headerArr2,
						tableLineColor: 'black',
						startY: doc.previousAutoTable.finalY + 0.5,
						didDrawPage: function (data) {
							doc.setFontStyle('bold');

						},
						headStyles: {
							fontStyle: 'normal',
							fillColor: '#c8d6e5',
							textColor: '#5e666d',
							fontSize: 22,
						},
						alternateRowStyles: {
							fillColor: '#fd8468',
							textColor: '#ffffff',
							fontStyle: 'bold',
						},
						useCss: true,
						styles: {
							fontSize: 22,
							cellWidth: 'auto',
							textColor: 'black',
							lineColor: '#89a8c8',
						},
						theme: 'grid'
					});
				}
				index++;
			}
		}
	}
	checkLastTotPDF(group2, doc, headerData) {
		const headerArr2: any[] = [];
		const obj3: any = {};
		const arr: any[] = [];
		obj3['id'] = 'footer';
		obj3['stu_admission_no'] = '';
		obj3['au_full_name'] = '';
		obj3['class_name'] = '';
		obj3['inv_invoice_date'] = 'Total';
		obj3['flgr_invoice_receipt_no'] = '';
		obj3['flgr_created_date'] = '';
		obj3['flgr_fp_months'] = '';
		obj3['inv_due_date'] = '';
		obj3['flgr_adj_amount'] = group2.rows.map(t => t['flgr_adj_amount']).reduce((acc, val) => acc + val, 0);
		obj3['inv_fine_amount'] = group2.rows.map(t => t['inv_fine_amount']).reduce((acc, val) => acc + val, 0);
		obj3['rpt_receipt_date'] = '';
		obj3['rpt_receipt_no'] = '';
		obj3['pay_name'] = '';
		obj3['remarks'] = '';
		obj3['stu_class_name'] = '';
		obj3['flgr_particulars'] = '';
		obj3['flgr_inv_id'] = '';
		obj3['flgr_amount'] = group2.rows.map(t => t['flgr_amount']).reduce((acc, val) => acc + val, 0);
		obj3['flgr_concession'] = group2.rows.map(t => t['flgr_concession']).reduce((acc, val) => acc + val, 0);
		obj3['flgr_receipt'] = group2.rows.map(t => t['flgr_receipt']).reduce((acc, val) => acc + val, 0);
		obj3['receipt_id'] = '';
		obj3['flgr_balance'] = group2.rows.map(t => t['flgr_balance']).reduce((acc, val) => acc + val, 0);
		for (const item of this.columnDefinitions) {
			Object.keys(obj3).forEach((key: any) => {
				if (item.id === key) {
					arr.push(obj3[key]);
				}
			});
		}
		headerArr2.push(arr);
		doc.autoTable({
			head: [headerData],
			body: headerArr2,
			tableLineColor: 'black',
			startY: doc.previousAutoTable.finalY + 0.5,
			didDrawPage: function (data) {
				doc.setFontStyle('bold');

			},
			headStyles: {
				fontStyle: 'normal',
				fillColor: '#c8d6e5',
				textColor: '#5e666d',
				fontSize: 22,
			},
			alternateRowStyles: {
				fillColor: '#004261',
				textColor: '#ffffff',
				fontStyle: 'bold',
			},
			useCss: true,
			styles: {
				fontSize: 22,
				cellWidth: 'auto',
				textColor: 'black',
				lineColor: '#89a8c8',
			},
			theme: 'grid'
		});
	}

}
