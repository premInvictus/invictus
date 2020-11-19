import { Component, OnInit, Input } from '@angular/core';
import {
	GridOption, Column, AngularGridInstance, Grouping, Aggregators,
	FieldType,
	Filters,
	Formatters,
	DelimiterType,
	FileType
} from 'angular-slickgrid';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import * as Excel from 'exceljs/dist/exceljs';
import * as ExcelProper from 'exceljs';
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
	reportdate = new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
	sessionArray: any[] = [];
	feeHeadJson: any[] = [];
	totalRow: any;
	groupColumns: any[] = [];
	groupLength: any;
	session: any = {};
	columnDefinitions1: Column[] = [];
	exportColumnDefinitions: any[] = [];
	columnDefinitions2: Column[] = [];
	gridOptions1: GridOption;
	gridOptions2: GridOption;
	tableFlag = false;
	dataset1: any[];
	@Input() userName: any = '';
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
	filteredAs: any = {};
	currentUser: any;
	pdfrowdata: any[] = [];
	levelHeading: any[] = [];
	levelTotalFooter: any[] = [];
	levelSubtotalFooter: any[] = [];
	notFormatedCellArray: any[] = [];
	chequeType: any[] = [
		{ name: 'Cheque Recieved', id: 'cp' },
		{ name: 'Cheque Clearance', id: 'cr' }
	];
	constructor(translate: TranslateService,
		private feeService: FeeService,
		private common: CommonAPIService,
		private sisService: SisService,
		public dialog: MatDialog,
		private fbuild: FormBuilder) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
		this.getSession();
		this.getSchool();
		this.buildForm();
		this.getClassData();
		this.filterFlag = true;
		//this.getChequeReport(this.reportFilterForm.value);
	}
	getChequeReportBasedOnValue() {
		if (this.reportFilterForm.value.c_type) {

			if (this.reportFilterForm.value.c_type === 'cr') {

				this.getChequeReport(this.reportFilterForm.value);
			}
			if (this.reportFilterForm.value.c_type === 'cp') {

				this.getChequeReport2(this.reportFilterForm.value);
			}
		} else {
			this.common.showSuccessErrorMessage('Please choose type', 'error');
		}
	}
	setCtype($event) {
		if ($event.value === 'cr') {

			this.getChequeReport(this.reportFilterForm.value);
		}
		if ($event.value === 'cp') {

			this.getChequeReport2(this.reportFilterForm.value);
		}
	}
	angularGridReady(angularGrid: AngularGridInstance) {
		this.angularGrid = angularGrid;
		this.gridObj = angularGrid.slickGrid; // grid object
		this.dataviewObj = angularGrid.dataView;
		this.updateTotalRow(angularGrid.slickGrid);
		this.updateClassSort(angularGrid.slickGrid, angularGrid.dataView);
	}
	updateTotalRow(grid: any) {
		let columnIdx = grid.getColumns().length;
		while (columnIdx--) {
			const columnId = grid.getColumns()[columnIdx].id;
			const columnElement: HTMLElement = grid.getFooterRowColumn(columnId);
			columnElement.innerHTML = '<b>' + this.totalRow[columnId] + '<b>';
		}
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
	buildForm() {
		this.reportFilterForm = this.fbuild.group({
			c_type: '',
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
			footerRowHeight: 35,
			enableExcelCopyBuffer: true,
			fullWidthRows: true,
			enableAutoTooltip: true,
			enableCellNavigation: true,
			defaultColumnWidth:100,
			forceFitColumns:false,
			enableAutoResize:false,
			autoFitColumnsOnFirstLoad:false,
			rowHeight:90,
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
			'from_date': value.from_date,
			'to_date': value.to_date,
			'pageSize': value.pageSize,
			'pageIndex': value.pageIndex,
			'classId': value.fee_value,
			'type' : value.c_type,
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
				width: 70,
				grouping: {
					getter: 'stu_admission_no',
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
				width: 70,
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
				width: 100,
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
				width: 100,
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
				width: 100,
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
				width: 100,
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
					if (Number(repoArray[Number(index)]['status']) === 2) {
						obj['dishonor_date'] = repoArray[Number(index)]['dishonor_date'] ? repoArray[Number(index)]['dishonor_date'] : '-';
					} else if (Number(repoArray[Number(index)]['status']) === 1) {
						obj['dishonor_date'] = repoArray[Number(index)]['fcc_process_date'] ? repoArray[Number(index)]['fcc_process_date'] : '-';
					} else {
						obj['dishonor_date'] = '-';
					}
					obj['receipt_no'] = repoArray[Number(index)]['receipt_no'] ?
						repoArray[Number(index)]['receipt_no'] : '-';
					obj['receipt_id'] = repoArray[Number(index)]['receipt_id'] ?
						repoArray[Number(index)]['receipt_id'] : '0';
					obj['receipt_amount'] = repoArray[Number(index)]['receipt_amount'] ?
						Number(repoArray[Number(index)]['receipt_amount'])
						: 0;
					obj['bank_name'] = repoArray[Number(index)]['bank_name'] ?
						repoArray[Number(index)]['bank_name'] : '-';
					if (repoArray[Number(index)]['status'] === 'c' || Number(repoArray[Number(index)]['status']) === 1) {
						obj['status'] = 'Cleared';
					} else if (repoArray[Number(index)]['status'] === 'b') {
						obj['status'] = 'Bounced';
					} else if (Number(repoArray[Number(index)]['status']) === 2) {
						obj['status'] = 'Dishonoured';
					} else if (Number(repoArray[Number(index)]['status']) === 3) {
						obj['status'] = 'Deposited';
					} else if (Number(repoArray[Number(index)]['status']) === 4) {
						obj['status'] = 'Approved';
					} else {
						obj['status'] = 'Pending';
					}
					obj['fcc_reason_id'] = repoArray[Number(index)]['reason_title'] ?
						repoArray[Number(index)]['reason_title'] : '-';
					obj['fcc_remarks'] = repoArray[Number(index)]['fcc_remarks'] ?
						repoArray[Number(index)]['fcc_remarks'] : '-';
					this.dataset.push(obj);
					index++;
				}
				this.totalRow = {};
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
				obj3['receipt_amount'] =
					new DecimalPipe('en-in').transform(this.dataset.map(t => t['receipt_amount']).reduce((acc, val) => acc + val, 0));
				obj3['bank_name'] = '';
				obj3['status'] = '';
				obj3['fcc_reason_id'] = '';
				obj3['fcc_remarks'] = '';
				this.totalRow = obj3;
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
			} else {
				this.tableFlag = true;
			}
		});
	}
	getChequeReport2(value: any) {
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
			fullWidthRows: true,
			enableAutoTooltip: true,
			enableCellNavigation: true,
			defaultColumnWidth:100,
			forceFitColumns:false,
			enableAutoResize:false,
			autoFitColumnsOnFirstLoad:false,
			rowHeight:70,
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
			'from_date': value.from_date,
			'to_date': value.to_date,
			'pageSize': value.pageSize,
			'pageIndex': value.pageIndex,
			'type' : value.c_type,
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
				width: 70,
				grouping: {
					getter: 'stu_admission_no',
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
				width: 70,
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
				id: 'invoice_no',
				name: 'Invoice No.',
				width: 40,
				field: 'invoice_no',
				sortable: true,
				filterable: true,
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
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
				id: 'cheque_no',
				name: 'Cheque No.',
				width: 60,
				field: 'cheque_no',
				sortable: true,
				filterable: true,
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
			},
			{
				id: 'cheque_date', name: 'Cheque Date', field: 'cheque_date', sortable: true,
				filterable: true,
				width: 100,
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
				id: 'transaction_date', name: 'Transaction Date', field: 'transaction_date', sortable: true,
				filterable: true,
				width: 100,
				filterSearchType: FieldType.dateIso,
				filter: { model: Filters.compoundDate },
				formatter: this.checkDateFormatter,
				grouping: {
					getter: 'transaction_date',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false,
				},
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
				id: 'branch',
				name: 'Branch',
				field: 'branch',
				sortable: true,
				width: 120,
				filterable: true,
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
			},
			{
				id: 'receipt_amount',
				name: ' Amount.',
				width: 40,
				field: 'receipt_amount',
				sortable: true,
				filterable: true,
				cssClass: 'amount-report-fee',
				groupTotalsFormatter: this.sumTotalsFormatter,
				formatter: this.checkFeeFormatter
			},
			{
				id: 'fcc_remarks',
				name: 'Remarks',
				field: 'fcc_remarks',
				width: 100,
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

					obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(index)]['au_full_name']);
					if (repoArray[Number(index)]['sec_id'] !== '0') {
						obj['stu_class_name'] = repoArray[Number(index)]['class_name'] + '-' +
							repoArray[Number(index)]['sec_name'];
					} else {
						obj['stu_class_name'] = repoArray[Number(index)]['class_name'];
					}
					obj['cheque_date'] = repoArray[Number(index)]['cheque_date'] ? repoArray[Number(index)]['cheque_date'] : '-';

					obj['transaction_date'] = repoArray[Number(index)]['transaction_date'] ? repoArray[Number(index)]['transaction_date'] : '-';
					obj['receipt_no'] = repoArray[Number(index)]['receipt_no'] ?
						repoArray[Number(index)]['receipt_no'] : '-';

					obj['cheque_no'] = repoArray[Number(index)]['cheque_no'] ?
						repoArray[Number(index)]['cheque_no'] : '-';
					obj['invoice_no'] = repoArray[Number(index)]['invoice_no'] ?
						repoArray[Number(index)]['invoice_no'] : '-';
					obj['receipt_id'] = repoArray[Number(index)]['receipt_id'] ?
						repoArray[Number(index)]['receipt_id'] : '0';
					obj['receipt_amount'] = repoArray[Number(index)]['receipt_amount'] ?
						Number(repoArray[Number(index)]['receipt_amount'])
						: 0;
					obj['bank_name'] = repoArray[Number(index)]['bank_name_received'] ?
						repoArray[Number(index)]['bank_name_received'] : '-';
					obj['branch'] = repoArray[Number(index)]['branch_id'] ?
						repoArray[Number(index)]['branch_id'] : '-';
					obj['fcc_remarks'] = repoArray[Number(index)]['remarks'] ?
						repoArray[Number(index)]['remarks'] : '-';
					this.dataset.push(obj);
					index++;
				}
				this.totalRow = {};
				const obj3: any = {};
				obj3['id'] = '';
				obj3['srno'] = '';
				obj3['stu_admission_no'] = this.common.htmlToText('<b>Grand Total</b>');
				obj3['stu_full_name'] = '';
				obj3['stu_class_name'] = '';
				obj3['cheque_date'] = '';
				obj3['transaction_date'] = '';
				obj3['invoice_no'] = '';
				obj3['receipt_no'] = '';
				obj3['cheque_no'] = '';
				obj3['receipt_id'] = '';
				obj3['receipt_amount'] =
					new DecimalPipe('en-in').transform(this.dataset.map(t => t['receipt_amount']).reduce((acc, val) => acc + val, 0));
				obj3['bank_name'] = '';
				obj3['branch'] = '';
				obj3['fcc_remarks'] = '';
				this.totalRow = obj3;
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
	checkReturn(data) {
		if (Number(data)) {
			return Number(data);
		} else {
			return data;
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
		if (value === '-') {
			return '-';
		} else {
			if (value)
				return '<a>' + value + '</a>';
			else
				return '-';
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
	resetValues() {
		this.reportFilterForm.patchValue({
			'login_id': '',
			'orderBy': '',
			'from_date': '',
			'to_date': '',
			'fee_value': '',
			'hidden_value': '',
			'hidden_value2': '',
			'hidden_value3': '',
			'hidden_value4': '',
			'hidden_value5': '',
		});
		this.sortResult = [];
		this.filterResult = [];
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
	checkWidth(id, header) {
		const res = this.dataset.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
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
	exportToExcel(json: any[]) {
		this.notFormatedCellArray = [];
		let reportType: any = '';
		const columns: any[] = [];
		const columValue: any[] = [];
		this.exportColumnDefinitions = [];
		this.exportColumnDefinitions = this.angularGrid.slickGrid.getColumns();
		
		this.sessionName = this.getSessionName(this.session.ses_id);
		reportType = new TitleCasePipe().transform('cheque clearance_') + this.sessionName;
		let reportType2: any = '';
		reportType2 = new TitleCasePipe().transform('cheque clearance report: ') + this.sessionName;
		const fileName =reportType + '_' + this.reportdate +'.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		// for (const item of this.exportColumnDefinitions) {
		// 	columns.push({
		// 		key: item.id,
		// 		width: this.checkWidth(item.id, item.name)
		// 	});
		// 	columValue.push(item.name);
		// }
		for (const item of this.exportColumnDefinitions) {
			if(!(item.id.includes('checkbox_select'))) {
			columns.push({
				key: item.id,
				//width: this.checkWidth(item.id, item.name)
			});
			columValue.push(item.name);}
		}
		worksheet.properties.defaultRowHeight =60;
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
					if ((item2.id === 'transaction_date' ||
					item2.id === 'cheque_date' || item2.id === 'deposite_date'
						|| item2.id === 'dishonor_date') && json[key][item2.id] !== '-') {
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
					cell.alignment = { wrapText:true,horizontal: 'center' };
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
		worksheet.getCell('A' + worksheet._rows.length).value = 'Report Filtered as:' + this.getParamValue();
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
	filtered(event) {
		this.filteredAs[event.source.ngControl.name] = event.source._placeholder + ' - ' + event.source.selected.viewValue;
	}
	getParamValue() {
		const filterArr = [];
		Object.keys(this.filteredAs).forEach(key => {
			filterArr.push(this.filteredAs[key]);
		});
		filterArr.push(
			this.common.dateConvertion(this.reportFilterForm.value.from_date, 'd-MMM-y') + ' - ' +
			this.common.dateConvertion(this.reportFilterForm.value.to_date, 'd-MMM-y'));
		return filterArr;
	}
	getLevelFooter(level, groupItem) {
		if (level === 0) {
			return 'Total';
		}
		if (level > 0) {
			return 'Sub Total (' + groupItem.value + ')';
		}
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
					obj3['id'] = '';
					obj3['srno'] = '';
					obj3['stu_admission_no'] = this.getLevelFooter(groupItem.level, groupItem);
					obj3['stu_full_name'] = '';
					obj3['stu_class_name'] = '';
					obj3['deposite_date'] = '';
					obj3['cheque_date'] = '';
					obj3['dishonor_date'] = '';
					obj3['invoice_id'] = '';
					obj3['invoice_no'] = '';
					obj3['receipt_no'] = '';
					obj3['receipt_id'] = '';
					obj3['receipt_amount'] = groupItem.rows.map(t => t['receipt_amount']).reduce((acc, val) => acc + val, 0);
					obj3['bank_name'] = '';
					obj3['status'] = '';
					obj3['fcc_reason_id'] = '';
					obj3['fcc_remarks'] = '';
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
							if ((item2.id === 'transaction_date' ||
							item2.id === 'cheque_date' || item2.id === 'deposite_date'
								|| item2.id === 'dishonor_date') && groupItem.rows[key][item2.id] !== '-') {
								obj[item2.id] = new DatePipe('en-in').transform((groupItem.rows[key][item2.id]));
							} else {
								obj[item2.id] = this.checkReturn(this.common.htmlToText(groupItem.rows[key][item2.id]));
							}

						}
						worksheet.addRow(obj);
					});
					const obj3: any = {};
					obj3['id'] = '';
					obj3['srno'] = '';
					obj3['stu_admission_no'] = this.getLevelFooter(groupItem.level, groupItem);
					obj3['stu_full_name'] = '';
					obj3['stu_class_name'] = '';
					obj3['deposite_date'] = '';
					obj3['cheque_date'] = '';
					obj3['dishonor_date'] = '';
					obj3['invoice_id'] = '';
					obj3['invoice_no'] = '';
					obj3['receipt_no'] = '';
					obj3['receipt_id'] = '';
					obj3['receipt_amount'] = groupItem.rows.map(t => t['receipt_amount']).reduce((acc, val) => acc + val, 0);
					obj3['bank_name'] = '';
					obj3['status'] = '';
					obj3['fcc_reason_id'] = '';
					obj3['fcc_remarks'] = '';
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
		reportType = new TitleCasePipe().transform('cheque clearance report: ') + this.sessionName;
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
					if (this.dataset[key][item2.id] !== '-' && (item2.id === 'cheque_date' || item2.id === 'dishonor_date'
					|| item2.id === 'transaction_date'
						|| item2.id === 'deposite_date')) {
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
				fontSize: 22,
				cellWidth: 50,
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
			head: [['Report Filtered as:  ' + this.getParamValue()]],
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
					obj3['id'] = '';
					obj3['srno'] = '';
					obj3['stu_admission_no'] = this.getLevelFooter(groupItem.level, groupItem);
					obj3['stu_full_name'] = '';
					obj3['stu_class_name'] = '';
					obj3['deposite_date'] = '';
					obj3['cheque_date'] = '';
					obj3['dishonor_date'] = '';
					obj3['invoice_id'] = '';
					obj3['invoice_no'] = '';
					obj3['receipt_no'] = '';
					obj3['receipt_id'] = '';
					obj3['receipt_amount'] = groupItem.rows.map(t => t['receipt_amount']).reduce((acc, val) => acc + val, 0);
					obj3['bank_name'] = '';
					obj3['status'] = '';
					obj3['fcc_reason_id'] = '';
					obj3['fcc_remarks'] = '';
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
							if (groupItem.rows[key][item2.id] !== '-' && (item2.id === 'cheque_date' || item2.id === 'dishonor_date' ||
							item2.id === 'transaction_date' 
								|| item2.id === 'deposite_date')) {
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
					obj3['id'] = '';
					obj3['srno'] = '';
					obj3['stu_admission_no'] = this.getLevelFooter(groupItem.level, groupItem);
					obj3['stu_full_name'] = '';
					obj3['stu_class_name'] = '';
					obj3['deposite_date'] = '';
					obj3['cheque_date'] = '';
					obj3['dishonor_date'] = '';
					obj3['invoice_id'] = '';
					obj3['invoice_no'] = '';
					obj3['receipt_no'] = '';
					obj3['receipt_id'] = '';
					obj3['receipt_amount'] = groupItem.rows.map(t => t['receipt_amount']).reduce((acc, val) => acc + val, 0);
					obj3['bank_name'] = '';
					obj3['status'] = '';
					obj3['fcc_reason_id'] = '';
					obj3['fcc_remarks'] = '';
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
}
