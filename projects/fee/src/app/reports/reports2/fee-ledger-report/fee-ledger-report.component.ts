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
	reportdate = new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
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
	notFormatedCellArray: any[] = [];
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
	exportColumnDefinitions: any[];
	filteredAs: any = {};
	currentUser: any;
	pdfrowdata: any[] = [];
	levelHeading: any[] = [];
	levelTotalFooter: any[] = [];
	levelSubtotalFooter: any[] = [];
	schoolBranchArray:any[] = [];
	showMultiSchool = 0;
	constructor(translate: TranslateService,
		private feeService: FeeService,
		private common: CommonAPIService,
		private sisService: SisService,
		public dialog: MatDialog,
		private fbuild: FormBuilder) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
		this.checkForMultiBranch();
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
		this.updateClassSort(angularGrid.slickGrid, angularGrid.dataView);
	}
	parseRoman(s) {
        var val = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
        return s.toUpperCase().split('').reduce( (r, a, i, aa) => {
            return val[a] < val[aa[i + 1]] ? r - val[a] : r + val[a];
        }, 0);
	}
	isRoman(s) {
        // http://stackoverflow.com/a/267405/1447675
        return /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i.test(s);
	}
	updateClassSort(grid:any,dataView:any) {
		let columnIdx = grid.getColumns().length;
		while (columnIdx--) {
			const columnId = grid.getColumns()[columnIdx];
			if (columnId['name'] == 'Class Name' || columnId['name'] == 'Class-Section') {
				grid.onSort.subscribe((e, args)=> {
					console.log('in, args', args);
					// args.multiColumnSort indicates whether or not this is a multi-column sort.
					// If it is, args.sortCols will have an array of {sortCol:..., sortAsc:...} objects.
					// If not, the sort column and direction will be in args.sortCol & args.sortAsc.
				  
					// We'll use a simple comparer function here.
					args = args.sortCols[0];
					var comparer = (a, b) =>{
						if (this.isRoman(a[args.sortCol.field].split(" ")[0]) || this.isRoman(b[args.sortCol.field].split(" ")[0])) {
							
							return (this.parseRoman(a[args.sortCol.field].split(" ")[0]) > this.parseRoman(b[args.sortCol.field].split(" ")[0])) ? 1 : -1;
							
							
						} else if (this.isRoman(a[args.sortCol.field].split("-")[0]) || this.isRoman(b[args.sortCol.field].split("-")[0])) {
							
							return (this.parseRoman(a[args.sortCol.field].split("-")[0]) > this.parseRoman(b[args.sortCol.field].split("-")[0])) ? 1 : -1;
						
						
						} else {
							
							return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
						}
					
					}
				  
					// Delegate the sorting to DataView.
					// This will fire the change events and update the grid.
					dataView.sort(comparer, args.sortAsc);
				  });
			}
		}
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
		let tempArray = [];
		console.log('this.currentUser',this.currentUser)
		tempArray.push(this.currentUser.Prefix);
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
			'orderBy': '',
			'school_branch':''

		});
		this.reportFilterForm.patchValue({
			school_branch:tempArray
		})
	}
	checkForMultiBranch() {
		let param: any = {};
		param.gs_name = ['show_branch_on_reports'];
		this.feeService.getGlobalSetting(param).subscribe((result: any) => {
		if (result && result.status === 'ok' && result.data) {
			this.showMultiSchool = result.data[0]['gs_value'] == '1'? 1 : 0;
		
		} else {
			this.showMultiSchool = 0;
		}}
		);
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
			rowHeight:65,
			defaultColumnWidth:100,
			forceFitColumns:false,
			enableAutoResize:false,
			autoFitColumnsOnFirstLoad:false,
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
						this.exportAsPDF(this.dataset);
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
						this.exportToExcel(this.dataset);
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
			'school_branch': this.reportFilterForm.value.school_branch
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
				type: FieldType.dateIso,
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
				filterSearchType: FieldType.dateUsShort,
				filter: { model: Filters.compoundDate },
				type: FieldType.dateIso,
				exportWithFormatter: true,
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
				type:FieldType.number,
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
				type:FieldType.number,
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
				type:FieldType.number,
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
				type:FieldType.number,
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
				type:FieldType.number,
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
				type:FieldType.number,
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
				width: 75,
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
		if(this.reportFilterForm.value.school_branch.length > 1) {
			let aColumn = {
				id: 'school_prefix',
				name: 'School',
				field: 'school_prefix',
				filterable: true,
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInputText },
				sortable: true,
				width: 90,
				grouping: {
					getter: 'school_prefix',
					formatter: (g) => {
						return `${g.value} <span style="color:green"> (${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false
				},
			};
			this.columnDefinitions.splice(0, 0, aColumn);
			
		}
		this.feeService.getFeeLedgerReport(collectionJSON).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				repoArray = [];
				this.dataset = [];
				repoArray = result.data.reportData;
				this.totalRecords = Number(result.data.totalRecords);
				localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
				let index = 0;
				let k = 0;
				let balance = 0;
				for (const item of repoArray) {
					let j = 0;
					var dupInvoiceArr = [];
					
					if (item.stu_ledger_arr && item.stu_ledger_arr.length > 0) {
						for (const stu_arr of item.stu_ledger_arr) {
							const obj: any = {};
							var duplicateInvoiceCheck:any = this.checkDuplicateArr(stu_arr['flgr_invoice_receipt_no'], item.stu_ledger_arr);
							if (dupInvoiceArr.indexOf(stu_arr['flgr_invoice_receipt_no']) < 0) {
								balance = stu_arr['flgr_balance'] ;
								dupInvoiceArr.push(stu_arr['flgr_invoice_receipt_no']);
								obj['id'] = repoArray[Number(index)]['au_admission_no'] + stu_arr['rpt_receipt_no'] + j + k +
									stu_arr['rpt_receipt_date'] + stu_arr['inv_due_date'];
								obj['stu_admission_no'] = repoArray[Number(index)]['au_admission_name'];
								obj['school_prefix'] = repoArray[Number(index)]['school_prefix'] ? repoArray[Number(index)]['school_prefix'] : '-';
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
								obj['flgr_amount'] = stu_arr['flgr_amount'] ? Number(stu_arr['flgr_amount']) : 0;
								obj['flgr_concession'] = stu_arr['flgr_concession'] ?
									Number(stu_arr['flgr_concession']) : 0;
								obj['flgr_receipt'] = stu_arr['flgr_receipt'] ?
									Number(stu_arr['flgr_receipt']) : 0;
								obj['receipt_id'] = stu_arr['rpt_id'];
								obj['flgr_balance'] = duplicateInvoiceCheck ? 0 : (stu_arr['flgr_balance'] ?
									Number(stu_arr['flgr_balance']) : 0);
								this.dataset.push(obj);
								j++;
							} else {
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
									obj['flgr_adj_amount'] = 0;
									obj['inv_fine_amount'] = 0;
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
									obj['flgr_amount'] = 0;
									obj['flgr_concession'] = 0;
									obj['flgr_receipt'] = stu_arr['flgr_receipt'] ?
										Number(stu_arr['flgr_receipt']) : 0;
									obj['receipt_id'] = stu_arr['rpt_id'];
									

									if (duplicateInvoiceCheck.length > 0 && stu_arr['flgr_inv_id'] > 0) {
										balance = balance - (stu_arr['flgr_receipt'] ?
										Number(stu_arr['flgr_receipt']) : 0);

										obj['flgr_balance'] = balance;
										this.dataset[this.dataset.length - 1]['flgr_balance'] = 0;
									} else {
										obj['flgr_balance'] = (stu_arr['flgr_balance'] ? Number(stu_arr['flgr_balance']) : 0);
									}
									
									

									this.dataset.push(obj);
									j++;
							}
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
				this.common.showSuccessErrorMessage('Report Data Fetched Successfully', 'success');
			} else {
				this.tableFlag = false;
			}
		});
	}

	checkDuplicateArr(invoiceNo, larr) {
		var duplicateFlag = false;
		var dCount = [];
		for (var i = 0; i < larr.length; i++) {
			if (larr[i]['flgr_invoice_receipt_no'] === invoiceNo) {
				dCount.push(invoiceNo);
			}
		}
		return dCount.length > 1 ? dCount : false;
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
			if (new DecimalPipe('en-in').transform(((Math.round(parseFloat(val) * 100) / 100)))) {
				return '<b class="total-footer-report">' + new DecimalPipe('en-in').transform(((Math.round(parseFloat(val) * 100) / 100))) + '</b>';
			} else {
				return '';
			}
			
		}
		return '';
	}
	checkFeeFormatter(row, cell, value, columnDef, dataContext) {
		if (value === 0) {
			return '-';
		} else {
			if (value ) {
				return new DecimalPipe('en-in').transform(value);
			}else {
				return '-';
			}
		}
	}
	checkTotalFormatter(row, cell, value, columnDef, dataContext) {
		if (value === 0) {
			return '-';
		} else {
			if (value ) {
				return new DecimalPipe('en-in').transform(value);
			}else {
				return '-';
			}
		}
	}
	checkReceiptFormatter(row, cell, value, columnDef, dataContext) {
		if (value) {
			if (value)
				return '<a>' + value + '</a>';
			else 
				return '-';
		}
	}
	checkDateFormatter(row, cell, value, columnDef, dataContext) {
		return new DatePipe('en-in').transform(value, 'd-MMM-y');
	}
	srnTotalsFormatter(totals, columnDef) {
		if (totals.group.level === 0) {
			return '<b class="total-footer-report">Total</b>';
		}
		if (totals.group.level > 0) {
			return '<b class="total-footer-report">Sub Total (' + totals.group.value + ') </b>';
		}
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
		this.common.getClassData({}).subscribe((result: any) => {
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
	exportAsPDF(json: any[]) {
		const headerData: any[] = [];
		this.pdfrowdata = [];
		this.levelHeading = [];
		this.levelTotalFooter = [];
		this.levelSubtotalFooter = [];
		this.exportColumnDefinitions = [];
		this.exportColumnDefinitions = this.angularGrid.slickGrid.getColumns();
		let reportType: any = '';
		this.sessionName = this.getSessionName(this.session.ses_id);
		reportType = new TitleCasePipe().transform('fee ledger report: ') + this.sessionName;
		const doc = new jsPDF('p', 'mm', 'a0');
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [[new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state]],
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
			head: [[reportType]],
			margin: { top: 0 },
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 20,
			},
			useCss: true,
			theme: 'striped'
		});
		const rowData: any[] = [];
		for (const item of this.exportColumnDefinitions) {
			headerData.push(item.name);
		}
		if (this.dataviewObj.getGroups().length === 0) {
			Object.keys(this.dataset).forEach((key: any) => {
				const arr: any[] = [];
				for (const item2 of this.exportColumnDefinitions) {
					if (item2.id === 'inv_invoice_date' || item2.id === 'flgr_created_date'
						|| item2.id === 'rpt_receipt_date'
						|| item2.id === 'inv_due_date') {
						arr.push(new DatePipe('en-in').transform((this.dataset[key][item2.id])));
					} else {
						arr.push(this.common.htmlToText(this.dataset[key][item2.id]));
					}
				}
				rowData.push(arr);
				this.pdfrowdata.push(arr);
			});
		} else {
			// iterate all groups
			this.checkGroupLevelPDF(this.dataviewObj.getGroups(), doc, headerData);
		}
		if (this.totalRow) {
			const arr: any[] = [];
			for (const item of this.exportColumnDefinitions) {
				arr.push(this.totalRow[item.id]);
			}
			rowData.push(arr);
			this.pdfrowdata.push(arr);
		}
		doc.levelHeading = this.levelHeading;
		doc.levelTotalFooter = this.levelTotalFooter;
		doc.levelSubtotalFooter = this.levelSubtotalFooter;
		doc.autoTable({
			head: [headerData],
			body: this.pdfrowdata,
			startY: doc.previousAutoTable.finalY + 0.5,
			tableLineColor: 'black',
			didDrawPage: function (data) {
				doc.setFontStyle('bold');

			},
			willDrawCell: function (data) {
				// tslint:disable-next-line:no-shadowed-variable
				const doc = data.doc;
				const rows = data.table.body;

				// level 0
				const lfIndex = doc.levelTotalFooter.findIndex(item => item === data.row.index);
				if (lfIndex !== -1) {
					doc.setFontStyle('bold');
					doc.setFontSize('18');
					doc.setTextColor('#ffffff');
					doc.setFillColor(0, 62, 120);
				}

				// level more than 0
				const lsfIndex = doc.levelSubtotalFooter.findIndex(item => item === data.row.index);
				if (lsfIndex !== -1) {
					doc.setFontStyle('bold');
					doc.setFontSize('18');
					doc.setTextColor('#ffffff');
					doc.setFillColor(229, 136, 67);
				}

				// group heading
				const lhIndex = doc.levelHeading.findIndex(item => item === data.row.index);
				if (lhIndex !== -1) {
					doc.setFontStyle('bold');
					doc.setFontSize('18');
					doc.setTextColor('#5e666d');
					doc.setFillColor('#c8d6e5');
				}

				// grand total
				if (data.row.index === rows.length - 1) {
					doc.setFontStyle('bold');
					doc.setFontSize('18');
					doc.setTextColor('#ffffff');
					doc.setFillColor(67, 160, 71);
				}
			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#c8d6e5',
				textColor: '#5e666d',
				fontSize: 18,
			},
			alternateRowStyles: {
				fillColor: '#f1f4f7'
			},
			useCss: true,
			styles: {
				fontSize: 18,
				cellWidth: 'auto',
				textColor: 'black',
				lineColor: '#89a8c8',
			},
			theme: 'grid'
		});
		if (this.groupColumns.length > 0) {
			doc.autoTable({
				// tslint:disable-next-line:max-line-length
				head: [['Groupded As:  ' + this.getGroupColumns(this.groupColumns)]],
				didDrawPage: function (data) {

				},
				headStyles: {
					fontStyle: 'bold',
					fillColor: '#ffffff',
					textColor: 'black',
					halign: 'left',
					fontSize: 20,
				},
				useCss: true,
				theme: 'striped'
			});
		}
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [['Report Filtered as:']],
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 20,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [['No of records: ' + json.length]],
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 20,
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
				fontSize: 20,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [['Generated By: ' + new TitleCasePipe().transform(this.currentUser.full_name)]],
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 20,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.save(reportType + '_' + this.reportdate + '.pdf');
	}
	checkGroupLevelPDF(item, doc, headerData) {
		if (item.length > 0) {
			for (const groupItem of item) {
				// add and style for groupeditem level heading
				this.pdfrowdata.push([groupItem.value + ' (' + groupItem.rows.length + ')']);
				this.levelHeading.push(this.pdfrowdata.length - 1);
				if (groupItem.groups) {
					this.checkGroupLevelPDF(groupItem.groups, doc, headerData);
					const levelArray: any[] = [];
					const obj3: any = {};
					obj3['id'] = 'footer';
					obj3['stu_admission_no'] = '';
					obj3['au_full_name'] = '';
					obj3['class_name'] = '';
					obj3['inv_invoice_date'] = this.getLevelFooter(groupItem.level, groupItem);
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
					for (const col of this.exportColumnDefinitions) {
						Object.keys(obj3).forEach((key: any) => {
							if (col.id === key) {
								levelArray.push(obj3[key]);
							}
						});
					}
					if (groupItem.level === 0) {
						this.pdfrowdata.push(levelArray);
						this.levelTotalFooter.push(this.pdfrowdata.length - 1);
					} else if (groupItem.level > 0) {
						this.pdfrowdata.push(levelArray);
						this.levelSubtotalFooter.push(this.pdfrowdata.length - 1);
					}

				} else {
					const rowData: any[] = [];
					Object.keys(groupItem.rows).forEach(key => {
						const arr: any = [];
						for (const item2 of this.columnDefinitions) {
							if (item2.id === 'inv_invoice_date' || item2.id === 'flgr_created_date'
								|| item2.id === 'rpt_receipt_date'
								|| item2.id === 'inv_due_date') {
								arr.push(new DatePipe('en-in').transform((groupItem.rows[key][item2.id])));
							} else {
								arr.push(this.common.htmlToText(groupItem.rows[key][item2.id]));
							}
						}
						rowData.push(arr);
						this.pdfrowdata.push(arr);
					});
					const levelArray: any[] = [];
					const obj3: any = {};
					obj3['id'] = 'footer';
					obj3['stu_admission_no'] = '';
					obj3['au_full_name'] = '';
					obj3['class_name'] = '';
					obj3['inv_invoice_date'] = this.getLevelFooter(groupItem.level, groupItem);
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
					for (const col of this.exportColumnDefinitions) {
						Object.keys(obj3).forEach((key: any) => {
							if (col.id === key) {
								levelArray.push(obj3[key]);
							}
						});
					}
					if (groupItem.level === 0) {
						this.pdfrowdata.push(levelArray);
						this.levelTotalFooter.push(this.pdfrowdata.length - 1);
					} else if (groupItem.level > 0) {
						this.pdfrowdata.push(levelArray);
						this.levelSubtotalFooter.push(this.pdfrowdata.length - 1);
					}
				}
			}
		}
	}
	getSchool() {
		this.sisService.getSchool().subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.schoolInfo = res.data[0];
				this.schoolInfo['si_school_prefix'] = this.schoolInfo.school_prefix;
				this.schoolInfo['si_school_name'] = this.schoolInfo.school_name;
				this.schoolBranchArray  = [];
				this.schoolBranchArray.push(this.schoolInfo);
				this.getSchoolBranch();
			}
		});
	}

	getSchoolBranch() {
		
		
		this.feeService.getAllSchoolGroups({si_group:this.schoolInfo.si_group, si_school_prefix: this.schoolInfo.school_prefix}).subscribe((data:any)=>{
			if (data && data.status == 'ok') {
				//this.schoolGroupData = data.data;
				
				console.log('this.schoolGroupData--', data.data);
				this.feeService.getMappedSchoolWithUser({prefix: this.schoolInfo.school_prefix, group_name: this.schoolInfo.si_group, login_id: this.currentUser.login_id}).subscribe((result:any)=>{
					if (result && result.data && result.data.length > 0) {
						
						var userSchoolMappedData = [];
						console.log('result.data--', result.data	)
						for (var j=0; j< result.data.length; j++) {


							if (result.data[j]['sgm_mapped_status'] == "1" || result.data[j]['sgm_mapped_status'] == 1) {
								userSchoolMappedData.push(result.data[j]['sgm_si_prefix']);
							}
						}
						
						console.log('userSchoolMappedData', userSchoolMappedData)
						for (var i=0; i<data.data.length;i++) {
							if (userSchoolMappedData.indexOf(data.data[i]['si_school_prefix']) > -1) {
								this.schoolBranchArray.push(data.data[i]);
							}
						}
						console.log('userSchoolMappedData', this.schoolBranchArray);
					}
				})
			}
		})
	
}

	checkReturn(data) {
		if (Number(data)) {
			return Number(data);
		} else {
			return data;
		}
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
	getLevelFooter(level, groupItem) {
		if (level === 0) {
			return 'Total';
		}
		if (level > 0) {
			return 'Sub Total (' + groupItem.value + ')';
		}
	}
	exportToExcel(json: any[]) {
		this.notFormatedCellArray = [];
		let reportType: any = '';
		const columns: any[] = [];
		const columValue: any[] = [];
		this.exportColumnDefinitions = [];
		this.exportColumnDefinitions = this.angularGrid.slickGrid.getColumns();
		// for (const item of this.exportColumnDefinitions) {
		// 	columns.push({
		// 		key: item.id,
		// 		width: this.checkWidth(item.id, item.name)
		// 	});
		// 	columValue.push(item.name);
		// }
		this.sessionName = this.getSessionName(this.session.ses_id);
		reportType = new TitleCasePipe().transform('fee ledger_') + this.sessionName;
		let reportType2: any = '';
		reportType2 = new TitleCasePipe().transform('fee ledger report: ') + this.sessionName;
		const fileName =reportType + '_' + this.reportdate +'.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		for (const item of this.exportColumnDefinitions) {
			if(!(item.id.includes('checkbox_select'))) {
			columns.push({
				key: item.id,
				//width: this.checkWidth(item.id, item.name)
			});
			columValue.push(item.name);}
		}
		worksheet.properties.defaultRowHeight =40;
		worksheet.mergeCells('A1:' + this.alphabetJSON[columns.length] + '1'); // Extend cell over all column headers
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[columns.length] + '2');
		worksheet.getCell('A2').value = reportType2;
		worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
		worksheet.getRow(4).values = columValue;
		worksheet.columns = columns;
		for(var i=1; i<=columns.length;i++) {
			
			worksheet.getColumn(i).alignment = {vertical: 'middle', horizontal: 'left',  wrapText: true};
			
		}
		if (this.dataviewObj.getGroups().length === 0) {
			Object.keys(json).forEach(key => {
				const obj: any = {};
				for (const item2 of this.exportColumnDefinitions) {
					if (item2.id === 'inv_invoice_date' || item2.id === 'flgr_created_date'
						|| item2.id === 'inv_due_date'
						|| item2.id === 'rpt_receipt_date') {
						obj[item2.id] = new DatePipe('en-in').transform((json[key][item2.id]));
					} else {
						obj[item2.id] = this.checkReturn(this.common.htmlToText(json[key][item2.id]));
					}
				}
				worksheet.addRow(obj);
			});
		} else {
			// iterate all groups
			this.checkGroupLevel(this.dataviewObj.getGroups(), worksheet);
		}
		if (this.totalRow) {
			worksheet.addRow(this.totalRow);
		}
		// style grand total
		worksheet.getRow(worksheet._rows.length).eachCell(cell => {
			this.columnDefinitions.forEach(element => {
				cell.font = {
					color: { argb: 'ffffff' },
					bold: true,
					name: 'Arial',
					size: 10
				};
				cell.alignment = { wrapText: true, horizontal: 'center' };
				cell.fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '439f47' },
					bgColor: { argb: '439f47' }
				};
				cell.border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' }
				};
			});
		});
		// style all row of excel
		worksheet.eachRow((row, rowNum) => {
			if (rowNum === 1) {
				row.font = {
					name: 'Arial',
					size: 14,
					bold: true
				};
			} else if (rowNum === 2) {
				row.font = {
					name: 'Arial',
					size: 12,
					bold: true
				};
			} else if (rowNum === 4) {
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
					cell.alignment = { horizontal: 'center', wrapText: true };
				});
			} else if (rowNum > 4 && rowNum < worksheet._rows.length) {
				const cellIndex = this.notFormatedCellArray.findIndex(item => item === rowNum);
				if (cellIndex === -1) {
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
					}

				}
			}
		});

		worksheet.addRow({});
		if (this.groupColumns.length > 0) {
			worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
				this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
			worksheet.getCell('A' + worksheet._rows.length).value = 'Groupded As: ' + this.getGroupColumns(this.groupColumns);
			worksheet.getCell('A' + worksheet._rows.length).font = {
				name: 'Arial',
				size: 10,
				bold: true
			};
		}

		worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
			this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
		worksheet.getCell('A' + worksheet._rows.length).value = 'Report Filtered as:'
			;
		worksheet.getCell('A' + worksheet._rows.length).font = {
			name: 'Arial',
			size: 10,
			bold: true
		};

		worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
			this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
		worksheet.getCell('A' + worksheet._rows.length).value = 'No of records: ' + json.length;
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
		workbook.xlsx.writeBuffer().then(data => {
			const blob = new Blob([data], { type: 'application/octet-stream' });
			saveAs(blob, fileName);
		});
	}
	checkGroupLevel(item, worksheet) {
		if (item.length > 0) {
			for (const groupItem of item) {
				worksheet.addRow({});
				this.notFormatedCellArray.push(worksheet._rows.length);
				// style for groupeditem level heading
				worksheet.mergeCells('A' + (worksheet._rows.length) + ':' +
					this.alphabetJSON[this.exportColumnDefinitions.length] + (worksheet._rows.length));
				worksheet.getCell('A' + worksheet._rows.length).value = this.common.htmlToText(groupItem.title);
				worksheet.getCell('A' + worksheet._rows.length).fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'c8d6e5' },
					bgColor: { argb: 'ffffff' },
				};
				worksheet.getCell('A' + worksheet._rows.length).border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' }
				};
				worksheet.getCell('A' + worksheet._rows.length).font = {
					name: 'Arial',
					size: 10,
					bold: true
				};

				if (groupItem.groups) {
					this.checkGroupLevel(groupItem.groups, worksheet);
					const obj3: any = {};
					obj3['id'] = 'footer';
					obj3['stu_admission_no'] = '';
					obj3['au_full_name'] = '';
					obj3['class_name'] = '';
					obj3['inv_invoice_date'] = this.getLevelFooter(groupItem.level, groupItem);
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
					this.notFormatedCellArray.push(worksheet._rows.length);
					// style row having total
					if (groupItem.level === 0) {
						worksheet.getRow(worksheet._rows.length).eachCell(cell => {
							this.exportColumnDefinitions.forEach(element => {
								cell.font = {
									name: 'Arial',
									size: 10,
									bold: true,
									color: { argb: 'ffffff' }
								};
								cell.alignment = { wrapText: true, horizontal: 'center' };
								cell.fill = {
									type: 'pattern',
									pattern: 'solid',
									fgColor: { argb: '004261' },
									bgColor: { argb: '004261' },
								};
								cell.border = {
									top: { style: 'thin' },
									left: { style: 'thin' },
									bottom: { style: 'thin' },
									right: { style: 'thin' }
								};
							});
						});
					} else if (groupItem.level > 0) {
						worksheet.getRow(worksheet._rows.length).eachCell(cell => {
							this.exportColumnDefinitions.forEach(element => {
								cell.font = {
									name: 'Arial',
									size: 10,
								};
								cell.alignment = { wrapText: true, horizontal: 'center' };
								cell.border = {
									top: { style: 'thin' },
									left: { style: 'thin' },
									bottom: { style: 'thin' },
									right: { style: 'thin' }
								};
							});
						});
					}
				} else {
					Object.keys(groupItem.rows).forEach(key => {
						const obj = {};
						for (const item2 of this.exportColumnDefinitions) {
							if (item2.id === 'inv_invoice_date' || item2.id === 'flgr_created_date'
								|| item2.id === 'rpt_receipt_date'
								|| item2.id === 'inv_due_date') {
								obj[item2.id] = new DatePipe('en-in').transform((groupItem.rows[key][item2.id]));
							} else {
								obj[item2.id] = this.checkReturn(this.common.htmlToText(groupItem.rows[key][item2.id]));
							}
						}
						worksheet.addRow(obj);
					});
					const obj3: any = {};
					obj3['id'] = 'footer';
					obj3['stu_admission_no'] = '';
					obj3['au_full_name'] = '';
					obj3['class_name'] = '';
					obj3['inv_invoice_date'] = this.getLevelFooter(groupItem.level, groupItem);
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
					this.notFormatedCellArray.push(worksheet._rows.length);
					if (groupItem.level === 0) {
						worksheet.getRow(worksheet._rows.length).eachCell(cell => {
							this.exportColumnDefinitions.forEach(element => {
								cell.font = {
									name: 'Arial',
									size: 10,
									bold: true,
									color: { argb: 'ffffff' }
								};
								cell.alignment = { wrapText: true, horizontal: 'center' };
								cell.fill = {
									type: 'pattern',
									pattern: 'solid',
									fgColor: { argb: '004261' },
									bgColor: { argb: '004261' },
								};
								cell.border = {
									top: { style: 'thin' },
									left: { style: 'thin' },
									bottom: { style: 'thin' },
									right: { style: 'thin' }
								};
							});
						});
					} else if (groupItem.level > 0) {
						worksheet.getRow(worksheet._rows.length).eachCell(cell => {
							this.exportColumnDefinitions.forEach(element => {
								cell.font = {
									name: 'Arial',
									size: 10,
								};
								cell.alignment = { wrapText: true, horizontal: 'center' };
								cell.border = {
									top: { style: 'thin' },
									left: { style: 'thin' },
									bottom: { style: 'thin' },
									right: { style: 'thin' }
								};
							});
						});
					}
				}
			}
		}
	}
	checkWidth(id, header) {
		const res = this.dataset.map((f) => (f[id] !== '-' && f[id]) ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
	}
	getGroupColumns(columns) {
		let grName = '';
		for (const item of columns) {
			for (const titem of this.exportColumnDefinitions) {
				if (item.getter === titem.id) {
					grName = grName + titem.name + ',';
					break;
				}
			}
		}
		return grName.substring(0, grName.length - 1);
	}

}
