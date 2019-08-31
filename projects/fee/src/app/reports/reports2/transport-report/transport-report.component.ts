import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {
	GridOption, Column, AngularGridInstance, Grouping, Aggregators,
	FieldType,
	Filters,
	Formatters,
	Sorters,
	SortDirectionNumber,
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
	selector: 'app-transport-report',
	templateUrl: './transport-report.component.html',
	styleUrls: ['./transport-report.component.css']
})
export class TransportReportComponent implements OnInit {
	@Input() userName: any = '';
	groupColumns: any[] = [];
	exportColumnDefinitions: any[] = [];
	feeHeadJSON: any[] = [];
	groupLength: any;
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
		44: 'AR'
	};
	sessionArray: any[] = [];
	totalRow: any;
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
	hiddenValueArray5: any[] = [];
	hiddenValueArray4: any[] = [];
	schoolInfo: any;
	sessionName: any;
	@Output() displyRep = new EventEmitter();
	gridHeight: number;
	constructor(translate: TranslateService,
		private feeService: FeeService,
		private common: CommonAPIService,
		private sisService: SisService,
		public dialog: MatDialog,
		private fbuild: FormBuilder) { }

	ngOnInit() {
		this.session = JSON.parse(localStorage.getItem('session'));
		this.getSchool();
		this.getSession();
		this.buildForm();
		this.getClassData();
		this.getStoppages();
		this.reportTypeArray.push(
			{
				report_type: 'transportAlloted', report_name: 'Transport Allotee'
			},
			{
				report_type: 'routewisecoll', report_name: 'Route Wise Collection'
			},
			{
				report_type: 'routewiseout', report_name: 'Route Wise Outstanding'
			},
			{
				report_type: 'routeslabstopwise', report_name: 'Route Wise '
			});
	}
	getSchool() {
		this.sisService.getSchool().subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.schoolInfo = res.data[0];
				console.log(this.schoolInfo);
			}
		});
	}
	angularGridReady(angularGrid: AngularGridInstance) {
		this.angularGrid = angularGrid;
		this.gridObj = angularGrid.slickGrid; // grid object
		this.dataviewObj = angularGrid.dataView;
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
			'downloadAll': '',
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

	getTransportReport(value: any) {
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
					if (args.command === 'exportAsExcel') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.exportToExcel(this.dataset, 'myfile');
					}
					if (args.command === 'cleargroup') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.clearGrouping();
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
		if (this.reportType === 'routewisecoll') {
			const collectionJSON: any = {
				'admission_no': '',
				'studentName': '',
				'report_type': 'routewise',
				'routeId': value.fee_value,
				'from_date': value.from_date,
				'to_date': value.to_date,
				'pageSize': '10',
				'pageIndex': '0',
				'filterReportBy': 'collection',
				'login_id': value.login_id,
				'orderBy': value.orderBy,
				'downloadAll': true
			};
			this.columnDefinitions = [
				{
					id: 'srno',
					name: 'SNo.',
					field: 'srno',
					sortable: true,
					width: 1
				},
				{
					id: 'stu_admission_no', name: 'Enrollment No', field: 'stu_admission_no', sortable: true,
					filterable: true,
					width: 60,
					grouping: {
						getter: 'stu_admission_no',
						formatter: (g) => {
							return `${g.value} <span style="color:green"> [${g.count} records]</span>`;
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false
					},
					filterSearchType: FieldType.string,
					filter: { model: Filters.compoundInput },
				},
				{
					id: 'stu_full_name', name: 'Student Name', field: 'stu_full_name', sortable: true,
					filterable: true,
					width: 140,
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
					width: 60,
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
					id: 'invoice_created_date', name: 'Trans. Date', field: 'invoice_created_date', sortable: true,
					filterable: true,
					width: 120,
					formatter: this.checkDateFormatter,
					filterSearchType: FieldType.dateIso,
					filter: { model: Filters.compoundDate },
					grouping: {
						getter: 'invoice_created_date',
						formatter: (g) => {
							if (g.value !== '-' && g.value !== '' && g.value !== '<b>Grand Total</b>') {
								return `${new DatePipe('en-in').transform(g.value, 'd-MMM-y')}  <span style="color:green">(${g.count})</span>`;
							} else {
								return `${''}`;
							}
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false
					},
					groupTotalsFormatter: this.srnTotalsFormatter,
				},
				{
					id: 'fp_name', name: 'Fee Period', field: 'fp_name', sortable: true,
					filterable: true,
					width: 120,
					filterSearchType: FieldType.string,
					filter: { model: Filters.compoundInput },
					grouping: {
						getter: 'fp_name',
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
					name: 'Reciept No.',
					field: 'receipt_no',
					sortable: true,
					width: 60,
					filterable: true,
					filterSearchType: FieldType.number,
					filter: { model: Filters.compoundInputNumber },
					formatter: this.checkReceiptFormatter,
					cssClass: 'receipt_collection_report'
				},
				{
					id: 'transport_amount',
					name: 'Transport Amt.',
					field: 'transport_amount',
					width: 60,
					cssClass: 'amount-report-fee',
					sortable: true,
					filterable: true,
					filterSearchType: FieldType.number,
					filter: { model: Filters.compoundInputNumber },
					formatter: this.checkFeeFormatter,
					groupTotalsFormatter: this.sumTotalsFormatter
				},
				{
					id: 'route_name',
					name: 'Route',
					field: 'route_name',
					sortable: true,
					width: 100,
					filterable: true,
					filterSearchType: FieldType.string,
					filter: { model: Filters.compoundInput },
					grouping: {
						getter: 'route_name',
						formatter: (g) => {
							return `${g.value}  <span style="color:green">(${g.count})</span>`;
						},
						comparer: (a, b) => {
							// (optional) comparer is helpful to sort the grouped data
							// code below will sort the grouped value in ascending order
							return Sorters.string(a.value, b.value, SortDirectionNumber.desc);
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false,
					},
				},
				{
					id: 'stoppages_name',
					name: 'Stoppage',
					width: 100,
					field: 'stoppages_name',
					sortable: true,
					filterable: true,
					filterSearchType: FieldType.string,
					filter: { model: Filters.compoundInput },
					grouping: {
						getter: 'stoppages_name',
						formatter: (g) => {
							return `${g.value}  <span style="color:green">(${g.count})</span>`;
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false,
					},
				},
				{
					id: 'slab_name',
					name: 'Slab',
					field: 'slab_name',
					width: 100,
					sortable: true,
					filterable: true,
					filterSearchType: FieldType.string,
					filter: { model: Filters.compoundInput },
					grouping: {
						getter: 'slab_name',
						formatter: (g) => {
							return `${g.value}  <span style="color:green">(${g.count})</span>`;
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false,
					},
				}];
			this.feeService.getHeadWiseCollection(collectionJSON).subscribe((result: any) => {
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
						obj['stu_admission_no'] = repoArray[Number(index)]['stu_admission_no'] ?
							repoArray[Number(index)]['stu_admission_no'] : '-';
						obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(index)]['stu_full_name']);
						if (repoArray[Number(index)]['stu_sec_id'] !== '0') {
							obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'] + '-' +
								repoArray[Number(index)]['stu_sec_name'];
						} else {
							obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'];
						}
						obj['invoice_created_date'] = repoArray[Number(index)]['ftr_transaction_date'];
						obj['fp_name'] = repoArray[Number(index)]['fp_name'] ?
							repoArray[Number(index)]['fp_name'] : '-';
						obj['receipt_id'] = repoArray[Number(index)]['rpt_id'] ?
							repoArray[Number(index)]['rpt_id'] : '0';
						obj['receipt_no'] = repoArray[Number(index)]['receipt_no'] ?
							repoArray[Number(index)]['receipt_no'] : '-';
						obj['transport_amount'] = repoArray[Number(index)]['transport_amount'] ?
							Number(repoArray[Number(index)]['transport_amount']) : 0;
						obj['route_name'] = repoArray[Number(index)]['route_name'] ?
							repoArray[Number(index)]['route_name'] : '-';
						obj['stoppages_name'] = repoArray[Number(index)]['stoppages_name'] ?
							repoArray[Number(index)]['stoppages_name'] : '-';
						obj['slab_name'] = repoArray[Number(index)]['slab_name'] ?
							repoArray[Number(index)]['slab_name'] : '-';
						this.dataset.push(obj);
						index++;
					}
					this.totalRow = {};
					const obj3: any = {};
					obj3['id'] = 'footer';
					obj3['srno'] = '';
					obj3['invoice_created_date'] = '<b>Grand Total</b>';
					obj3['stu_admission_no'] = '';
					obj3['stu_full_name'] = '';
					obj3['stu_class_name'] = '';
					obj3['fp_name'] = '';
					obj3['receipt_no'] = '';
					obj3['transport_amount'] =
						new DecimalPipe('en-in').transform(this.dataset.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0));
					obj3['route_name'] = '';
					obj3['stoppages_name'] = '';
					obj3['slab_name'] = '';
					this.totalRow = obj3;
					this.aggregatearray.push(new Aggregators.Sum('transport_amount'));
					this.aggregatearray.push(new Aggregators.Sum('srno'));
					this.tableFlag = true;
					if (this.dataset.length <= 5) {
						this.gridHeight = 300;
					} else if (this.dataset.length <= 10 && this.dataset.length > 5) {
						this.gridHeight = 400;
					} else if (this.dataset.length > 10 && this.dataset.length <= 20) {
						this.gridHeight = 550;
					} else if (this.dataset.length > 20) {
						this.gridHeight = 750;
					}
					setTimeout(() => this.groupByRoute(), 2);
				} else {
					this.tableFlag = true;
				}
			});
		} else if (this.reportType === 'routewiseout') {
			const collectionJSON: any = {
				'admission_no': '',
				'studentName': '',
				'report_type': 'routewise',
				'routeId': value.fee_value,
				// 'from_date': value.from_date,
				'to_date': value.to_date,
				'pageSize': '10',
				'pageIndex': '0',
				'filterReportBy': 'outstanding',
				'login_id': value.login_id,
				'orderBy': value.orderBy,
				'downloadAll': true
			};
			this.columnDefinitions = [
				{
					id: 'srno',
					name: 'SNo.',
					field: 'srno',
					sortable: true,
					width: 1
				},
				{
					id: 'stu_admission_no', name: 'Enrollment No', field: 'stu_admission_no', sortable: true,
					filterable: true,
					grouping: {
						getter: 'stu_admission_no',
						formatter: (g) => {
							return `${g.value} <span style="color:green"> [${g.count} records]</span>`;
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false
					},
					width: 60,
					filterSearchType: FieldType.string,
					filter: { model: Filters.compoundInput },
				},
				{
					id: 'stu_full_name', name: 'Student Name', field: 'stu_full_name', sortable: true,
					filterable: true,
					width: 140,
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
					width: 60,
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
					id: 'fp_name', name: 'Fee Period', field: 'fp_name', sortable: true,
					filterable: true,
					width: 120,
					filterSearchType: FieldType.string,
					filter: { model: Filters.compoundInput },
					grouping: {
						getter: 'fp_name',
						formatter: (g) => {
							return `${g.value}  <span style="color:green">(${g.count})</span>`;
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false,
					},
				},
				{
					id: 'transport_amount',
					name: 'Transport Amt.',
					field: 'transport_amount',
					width: 60,
					cssClass: 'amount-report-fee',
					sortable: true,
					filterable: true,
					filterSearchType: FieldType.number,
					filter: { model: Filters.compoundInputNumber },
					formatter: this.checkFeeFormatter,
					groupTotalsFormatter: this.sumTotalsFormatter
				},
				{
					id: 'route_name',
					name: 'Route',
					field: 'route_name',
					sortable: true,
					width: 100,
					filterable: true,
					filterSearchType: FieldType.string,
					filter: { model: Filters.compoundInput },
					grouping: {
						getter: 'route_name',
						formatter: (g) => {
							return `${g.value}  <span style="color:green">(${g.count})</span>`;
						},
						comparer: (a, b) => {
							// (optional) comparer is helpful to sort the grouped data
							// code below will sort the grouped value in ascending order
							return Sorters.string(a.value, b.value, SortDirectionNumber.desc);
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false,
					},
				},
				{
					id: 'stoppages_name',
					name: 'Stoppage',
					width: 100,
					field: 'stoppages_name',
					sortable: true,
					filterable: true,
					filterSearchType: FieldType.string,
					filter: { model: Filters.compoundInput },
					grouping: {
						getter: 'stoppages_name',
						formatter: (g) => {
							return `${g.value}  <span style="color:green">(${g.count})</span>`;
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false,
					},
				},
				{
					id: 'slab_name',
					name: 'Slab',
					field: 'slab_name',
					width: 100,
					sortable: true,
					filterable: true,
					filterSearchType: FieldType.string,
					filter: { model: Filters.compoundInput },
					grouping: {
						getter: 'slab_name',
						formatter: (g) => {
							return `${g.value}  <span style="color:green">(${g.count})</span>`;
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false,
					},
				}];
			this.feeService.getHeadWiseCollection(collectionJSON).subscribe((result: any) => {
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
						obj['stu_admission_no'] = repoArray[Number(index)]['stu_admission_no'] ?
							repoArray[Number(index)]['stu_admission_no'] : '-';
						obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(index)]['stu_full_name']);
						if (repoArray[Number(index)]['stu_sec_id'] !== '0') {
							obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'] + '-' +
								repoArray[Number(index)]['stu_sec_name'];
						} else {
							obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'];
						}
						obj['invoice_created_date'] = repoArray[Number(index)]['invoice_created_date'];
						obj['fp_name'] = repoArray[Number(index)]['fp_name'] ?
							repoArray[Number(index)]['fp_name'] : '-';
						obj['receipt_id'] = repoArray[Number(index)]['invoice_id'] ?
							repoArray[Number(index)]['invoice_id'] : '0';
						obj['receipt_no'] = repoArray[Number(index)]['invoice_no'] ?
							repoArray[Number(index)]['invoice_no'] : '-';
						obj['transport_amount'] = repoArray[Number(index)]['transport_amount'] ?
							Number(repoArray[Number(index)]['transport_amount']) : 0;
						obj['route_name'] = repoArray[Number(index)]['route_name'] ?
							repoArray[Number(index)]['route_name'] : '-';
						obj['stoppages_name'] = repoArray[Number(index)]['stoppages_name'] ?
							repoArray[Number(index)]['stoppages_name'] : '-';
						obj['slab_name'] = repoArray[Number(index)]['slab_name'] ?
							repoArray[Number(index)]['slab_name'] : '-';
						this.dataset.push(obj);
						index++;
					}
					this.totalRow = {};
					const obj3: any = {};
					obj3['id'] = 'footer';
					obj3['srno'] = '';
					obj3['invoice_created_date'] = '<b>Grand Total</b>';
					obj3['stu_admission_no'] = this.common.htmlToText('<b>Grand Total</b>');
					obj3['stu_full_name'] = '';
					obj3['stu_class_name'] = '';
					obj3['fp_name'] = '';
					obj3['receipt_no'] = '';
					obj3['transport_amount'] =
						new DecimalPipe('en-in').transform(this.dataset.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0));
					obj3['route_name'] = '';
					obj3['stoppages_name'] = '';
					obj3['slab_name'] = '';
					this.totalRow = obj3;
					this.aggregatearray.push(new Aggregators.Sum('transport_amount'));
					this.aggregatearray.push(new Aggregators.Sum('srno'));
					this.tableFlag = true;
					if (this.dataset.length <= 5) {
						this.gridHeight = 300;
					} else if (this.dataset.length <= 10 && this.dataset.length > 5) {
						this.gridHeight = 400;
					} else if (this.dataset.length > 10 && this.dataset.length <= 20) {
						this.gridHeight = 550;
					} else if (this.dataset.length > 20) {
						this.gridHeight = 750;
					}
					setTimeout(() => this.groupByRoute(), 2);
				} else {
					this.tableFlag = true;
				}
			});
		} else if (this.reportType === 'transportAlloted') {
			const collectionJSON: any = {
				'from_date': value.from_date,
				'to_date': value.to_date,
				'pageSize': value.pageSize,
				'pageIndex': value.pageIndex,
				'routeId': value.fee_value,
				'slabId': value.hidden_value4,
				'stoppageId': value.hidden_value5,
				'admission_no': value.admission_no,
				'studentName': value.au_full_name,
				'login_id': value.login_id,
				'orderBy': value.orderBy,
				'downloadAll': true
			};
			this.columnDefinitions = [
				{
					id: 'srno',
					name: 'SNo.',
					field: 'srno',
					sortable: true,
					width: 1
				},
				{
					id: 'stu_admission_no', name: 'Enrollment No', field: 'stu_admission_no', filterable: true,
					sortable: true,
					filterSearchType: FieldType.string,
					filter: { model: Filters.compoundInput },
					grouping: {
						getter: 'stu_admission_no',
						formatter: (g) => {
							return `${g.value} <span style="color:green"> [${g.count} records]</span>`;
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false
					},
				},
				{
					id: 'stu_full_name', name: 'Student Name', field: 'stu_full_name', filterable: true,
					sortable: true,
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
					filterSearchType: FieldType.string,
					filter: { model: Filters.compoundInput },
					filterable: true,
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
					id: 'route_name',
					name: 'Route',
					field: 'route_name',
					sortable: true,
					filterSearchType: FieldType.string,
					filter: { model: Filters.compoundInput },
					filterable: true,
					grouping: {
						getter: 'route_name',
						formatter: (g) => {
							return `${g.value}  <span style="color:green">(${g.count})</span>`;
						},
						comparer: (a, b) => {
							// (optional) comparer is helpful to sort the grouped data
							// code below will sort the grouped value in ascending order
							return Sorters.string(a.value, b.value, SortDirectionNumber.desc);
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false,
					},
				},
				{
					id: 'stoppages_name',
					name: 'Stoppage',
					field: 'stoppages_name',
					sortable: true,
					filterable: true,
					filterSearchType: FieldType.string,
					filter: { model: Filters.compoundInput },
					grouping: {
						getter: 'stoppages_name',
						formatter: (g) => {
							return `${g.value}  <span style="color:green">(${g.count})</span>`;
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false,
					},
				},
				{
					id: 'slab_name',
					name: 'Slab',
					field: 'slab_name',
					sortable: true,
					filterable: true,
					filterSearchType: FieldType.string,
					filter: { model: Filters.compoundInput },
					grouping: {
						getter: 'slab_name',
						formatter: (g) => {
							return `${g.value}  <span style="color:green">(${g.count})</span>`;
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false,
					},
				},
				{
					id: 'applicable_from', name: 'Applicable From', field: 'applicable_from', sortable: true,
					filterable: true,
					formatter: this.checkDateFormatter,
					filterSearchType: FieldType.dateIso,
					filter: { model: Filters.compoundDate },
					grouping: {
						getter: 'applicable_from',
						formatter: (g) => {
							if (g.value !== '') {
								return `${new DatePipe('en-in').transform(g.value, 'd-MMM-y')}  <span style="color:green">(${g.count})</span>`;
							} else {
								return `${g.value}  <span style="color:green">(${g.count})</span>`;
							}
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false
					},
					groupTotalsFormatter: this.srnTotalsFormatter,
				},
				{
					id: 'applicable_to', name: 'Applicable To', field: 'applicable_to', sortable: true,
					filterable: true,
					formatter: this.checkDateFormatter,
					filterSearchType: FieldType.dateIso,
					filter: { model: Filters.compoundDate },
					grouping: {
						getter: 'applicable_to',
						formatter: (g) => {
							if (g.value !== '') {
								return `${new DatePipe('en-in').transform(g.value, 'd-MMM-y')}  <span style="color:green">(${g.count})</span>`;
							} else {
								return `${g.value}  <span style="color:green">(${g.count})</span>`;
							}
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false
					},
					groupTotalsFormatter: this.srnTotalsFormatter,
				}];
			this.feeService.getTransportReport(collectionJSON).subscribe((result: any) => {
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
						obj['stu_admission_no'] = repoArray[Number(index)]['stu_admission_no'] ?
							repoArray[Number(index)]['stu_admission_no'] : '-';
						obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(index)]['stu_full_name']);
						if (repoArray[Number(index)]['stu_sec_id'] !== '0') {
							obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'] + '-' +
								repoArray[Number(index)]['stu_sec_name'];
						} else {
							obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'];
						}
						obj['route_name'] = repoArray[Number(index)]['route_name'] ?
							new CapitalizePipe().transform(repoArray[Number(index)]['route_name']) : '-';
						obj['slab_name'] = repoArray[Number(index)]['slab_name'] ?
							new CapitalizePipe().transform(repoArray[Number(index)]['slab_name']) : '-';
						obj['stoppages_name'] = repoArray[Number(index)]['stoppages_name'] ?
							new CapitalizePipe().transform(repoArray[Number(index)]['stoppages_name']) : '-';
						obj['applicable_from'] = repoArray[Number(index)]['applicable_from'] ? repoArray[Number(index)]['applicable_from'] : '-';
						obj['applicable_to'] = repoArray[Number(index)]['applicable_to'] ? repoArray[Number(index)]['applicable_to'] : '-';
						this.dataset.push(obj);
						index++;
					}
					this.tableFlag = true;
					if (this.dataset.length <= 5) {
						this.gridHeight = 300;
					} else if (this.dataset.length <= 10 && this.dataset.length > 5) {
						this.gridHeight = 400;
					} else if (this.dataset.length > 10 && this.dataset.length <= 20) {
						this.gridHeight = 550;
					} else if (this.dataset.length > 20) {
						this.gridHeight = 750;
					}
					setTimeout(() => this.groupByRoute(), 2);
				} else {
					this.tableFlag = true;
				}
			});
		} else if (this.reportType === 'routeslabstopwise') {
			const collectionJSON: any = {
				'from_date': value.from_date,
				'to_date': value.to_date,
				'pageSize': value.pageSize,
				'pageIndex': value.pageIndex,
				'routeId': value.fee_value,
				'slabId': value.hidden_value4,
				'stoppageId': value.hidden_value5,
				'admission_no': value.admission_no,
				'studentName': value.au_full_name,
				'login_id': value.login_id,
				'orderBy': value.orderBy,
				'downloadAll': true
			};
			this.columnDefinitions = [
				{
					id: 'route_name',
					name: 'Route',
					field: 'route_name',
					sortable: true,
					filterSearchType: FieldType.string,
					filter: { model: Filters.compoundInput },
					filterable: true,
					grouping: {
						getter: 'route_name',
						formatter: (g) => {
							return `${g.value}  <span style="color:green">(${g.count})</span>`;
						},
						comparer: (a, b) => {
							// (optional) comparer is helpful to sort the grouped data
							// code below will sort the grouped value in ascending order
							return Sorters.string(a.value, b.value, SortDirectionNumber.desc);
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false,
					},
				},
				{
					id: 'stoppages_name',
					name: 'Stoppage',
					field: 'stoppages_name',
					sortable: true,
					filterable: true,
					filterSearchType: FieldType.string,
					filter: { model: Filters.compoundInput },
					grouping: {
						getter: 'stoppages_name',
						formatter: (g) => {
							return `${g.value}  <span style="color:green">(${g.count})</span>`;
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false,
					},
					groupTotalsFormatter: this.srnTotalsFormatter
				},
				{
					id: 'slab_name',
					name: 'Slab',
					field: 'slab_name',
					sortable: true,
					filterable: true,
					filterSearchType: FieldType.string,
					filter: { model: Filters.compoundInput },
					grouping: {
						getter: 'slab_name',
						formatter: (g) => {
							return `${g.value}  <span style="color:green">(${g.count})</span>`;
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false,
					},
				},
				{
					id: 'slab_amount',
					name: 'Slab Amount.',
					field: 'slab_amount',
					sortable: true,
					filterSearchType: FieldType.number,
					filter: { model: Filters.compoundInputNumber },
					filterable: true,
					width: 1,
					cssClass: 'amount-report-fee',
					groupTotalsFormatter: this.sumTotalsFormatter,
					formatter: this.checkFeeFormatter
				}];
			this.feeService.getRouteWiseTransportReport(collectionJSON).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.message, 'success');
					repoArray = result.data.reportData[0];
					this.totalRecords = Number(result.data.totalRecords);
					let index = 0;
					localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
					for (const item of repoArray) {
						let j = 0;
						for (const titem of item['stoppages_data']) {
							const obj: any = {};
							obj['id'] = item['tr_route_name'] + item['tr_id'] + titem['tsp_id'] +
								titem['tsp_name'];
							obj['route_name'] = item['tr_route_name'];
							obj['stoppages_name'] = titem['tsp_name'];
							obj['slab_name'] = titem['slab_data'][0]['ts_name'];
							obj['slab_amount'] = titem['slab_data'][0]['ts_cost'] ? Number(titem['slab_data'][0]['ts_cost']) : 0;
							j++;
							this.dataset.push(obj);
						}
						index++;
					}
					this.aggregatearray.push(new Aggregators.Sum('slab_amount'));
					this.totalRow = {};
					const obj3: any = {};
					obj3['id'] = 'footer';
					obj3['route_name'] = this.common.htmlToText('<b>Grand Total</b>');
					obj3['stoppages_name'] = '';
					obj3['slab_name'] = '';
					obj3['slab_amount'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t['slab_amount']).reduce((acc, val) => acc + val, 0));
					this.totalRow = obj3;
					this.tableFlag = true;
					if (this.dataset.length <= 5) {
						this.gridHeight = 300;
					} else if (this.dataset.length <= 10 && this.dataset.length > 5) {
						this.gridHeight = 400;
					} else if (this.dataset.length > 10 && this.dataset.length <= 20) {
						this.gridHeight = 550;
					} else if (this.dataset.length > 20) {
						this.gridHeight = 750;
					}
					setTimeout(() => this.groupByRoute(), 2);
				} else {
					this.tableFlag = false;
				}
			});
		}
	}
	clearGroupsAndSelects() {
		this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = '');
		this.clearGrouping();
	}
	checkReturn(data) {
		if (Number(data)) {
			return Number(data);
		} else {
			return data;
		}
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
		if (e.target.className === 'invoice-span-mfr') {
			const inv_id = Number(e.target.innerHTML);
			this.renderDialog(inv_id, false);
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
		if (value === '-') {
			return '-';
		} else {
			return '<a>' + value + '</a>';
		}
	}
	checkDateFormatter(row, cell, value, columnDef, dataContext) {
		if (value !== '<b>Grand Total</b>' && value !== '-' && value !== '') {
			return new DatePipe('en-in').transform(value, 'd-MMM-y');
		} else {
			return value;
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
	getMFRFormatter(row, cell, value, columnDef, dataContext) {
		if (value.status === 'unpaid') {
			return '<div style="background-color:#f93435 !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
				+ '<span class="invoice-span-mfr">' + value.invoice_id + '</span>' + '</div>';
		} else if (value.status === 'paid') {
			return '<div style="background-color:#27de80 !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
				+ '<span class="invoice-span-mfr">' + value.invoice_id + '</span>' + '</div>';
		} else if (value.status === 'Not Generated') {
			return '<div style="background-color:#d2d8e0 !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;' +
				'border-right: 1px solid #89a8c8; border-top: 0px !important;' +
				'border-bottom: 0px !important; border-left: 0px !important; margin: auto;">'
				+ '<span class="invoice-span-mfr">' + value.invoice_id + '</span>' + '</div>';
		} else if (value.status === 'Unpaid with fine') {
			return '<div style="background-color:#4a7bec !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
				+ '<span class="invoice-span-mfr">' + value.invoice_id + '</span>' + '</div>';
		} else {
			return '<div style="background-color:#7bd450 !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
				+ '<span class="invoice-span-mfr">' + value.invoice_id + '</span>' + '</div>';
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
		this.sisService.getClass({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.classDataArray = result.data;
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
	changeReportType($event) {
		this.filterResult = [];
		this.sortResult = [];
		this.tableFlag = false;
		this.reportType = $event.value,
			this.reportFilterForm.patchValue({
				'admission_no': '',
				'studentName': '',
				'fee_value': '',
				'feeHeadId': '',
				'classId': '',
				'secId': '',
				'from_date': '',
				'to_date': '',
				'pageSize': '10',
				'pageIndex': '0',
				'filterReportBy': 'collection',
				'login_id': '',
				'orderBy': '',
				'downloadAll': true
			});
		if ($event.value) {
			this.displyRep.emit({ report_index: 15, report_id: $event.value, report_name: this.getReportName($event.value) });
			if ($event.value === 'routewisecoll' || $event.value === 'routewiseout') {
				this.valueLabel = 'Routes';
				this.getRoutes();
			} else if ($event.value === 'transportAlloted') {
				this.valueLabel = 'Routes';
				this.getRoutes();
				this.getRoutes();
				this.getSlabs();
			} else if ($event.value === 'routeslabstopwise') {
				this.valueLabel = 'Routes';
				this.getRoutes();
				this.getRoutes();
				this.getSlabs();
			}
			this.filterFlag = true;
		} else {
			this.displyRep.emit({ report_index: 15, report_id: '', report_name: 'Transport Report' });
			this.filterFlag = false;
		}
	}
	getReportName(value) {
		const findex = this.reportTypeArray.findIndex(f => f.report_type === value);
		if (findex !== -1) {
			return this.reportTypeArray[findex].report_name;
		}
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
	getSlabs() {
		this.hiddenValueArray4 = [];
		this.feeService.getSlabs({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				for (const item of result.data) {
					this.hiddenValueArray4.push({
						id: item.ts_id,
						name: item.ts_name
					});
				}
			}
		});
	}
	getStoppages() {
		this.hiddenValueArray5 = [];
		this.feeService.getStoppages({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				for (const item of result.data) {
					this.hiddenValueArray5.push({
						id: item.tsp_id,
						name: item.tsp_name
					});
				}
			}
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
		if (this.reportType === 'routewisecoll') {
			reportType = new TitleCasePipe().transform('route wise collection report: ') + this.sessionName;
		} else if (this.reportType === 'routewiseout') {
			reportType = new TitleCasePipe().transform('route wise outstanding report: ') + this.sessionName;
		} else if (this.reportType === 'transportAlloted') {
			reportType = new TitleCasePipe().transform('transport allotee report: ') + this.sessionName;
		} else if (this.reportType === 'routeslabstopwise') {
			reportType = new TitleCasePipe().transform('route slab stopwise report: ') + this.sessionName;
		}
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
				const arr: any[] = [];
				for (const item2 of this.columnDefinitions) {
					if (this.reportType !== 'mfr' && Number(key) < this.dataset.length - 1) {
						if (item2.id !== 'fp_name' && item2.id !== 'invoice_created_date') {
							arr.push(this.common.htmlToText(this.dataset[key][item2.id]));
						}
						if (item2.id !== 'fp_name' && (item2.id === 'invoice_created_date' ||
							item2.id === 'applicable_from' || item2.id === 'applicable_to')
							&& this.dataset[key][item2.id] !== '<b>Grand Total</b>') {
							arr.push(new DatePipe('en-in').transform((this.dataset[key][item2.id]), 'd-MMM-y'));
						}
						if (item2.id !== 'fp_name' && item2.id === 'invoice_created_date'
							&& this.dataset[key][item2.id] === '<b>Grand Total</b>') {
							arr.push(this.common.htmlToText(this.dataset[key][item2.id]));
						}
						if (item2.id !== 'invoice_created_date' && item2.id === 'fp_name') {
							arr.push(this.common.htmlToText(this.dataset[key][item2.id]));
						}
					} else if (this.reportType === 'mfr' && Number(key) < this.dataset.length - 1) {
						if (item2.id.toString().match(/Q/)) {
							arr.push(this.dataset[key][item2.id].status);
						} else {
							arr.push(this.dataset[key][item2.id]);
						}
					}
				}
				rowData.push(arr);
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
						const arr: any[] = [];
						for (const item2 of this.columnDefinitions) {
							if (this.reportType !== 'mfr') {
								if (item2.id !== 'fp_name' && item2.id !== 'invoice_created_date') {
									arr.push(this.common.htmlToText(item.rows[key][item2.id]));
								}
								if (item2.id !== 'fp_name' && (item2.id === 'invoice_created_date' ||
									item2.id === 'applicable_from' || item2.id === 'applicable_to')
									&& item.rows[key][item2.id] !== '<b>Grand Total</b>') {
									arr.push(new DatePipe('en-in').transform((item.rows[key][item2.id]), 'd-MMM-y'));
								}
								if (item2.id !== 'fp_name' && item2.id === 'invoice_created_date'
									&& item.rows[key][item2.id] === '<b>Grand Total</b>') {
									arr.push(this.common.htmlToText(item.rows[key][item2.id]));
								}
								if (item2.id !== 'invoice_created_date' && item2.id === 'fp_name') {
									arr.push(this.common.htmlToText(item.rows[key][item2.id]));
								}
							} else {
								if (item2.id.toString().match(/Q/)) {
									arr.push(item.rows[key][item2.id].status);
								} else {
									arr.push(item.rows[key][item2.id]);
								}
							}
						}
						rowData2.push(arr);
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
						if (this.reportType === 'routewisecoll' || this.reportType === 'routewiseout') {
							const obj3: any = {};
							const arr: any[] = [];
							obj3['id'] = 'footer';
							obj3['srno'] = '';
							obj3['invoice_created_date'] = 'Total';
							obj3['stu_admission_no'] = '';
							obj3['stu_full_name'] = '';
							obj3['stu_class_name'] = '';
							obj3['fp_name'] = '';
							obj3['receipt_no'] = '';
							obj3['transport_amount'] = item.rows.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0);
							obj3['route_name'] = '';
							obj3['stoppages_name'] = '';
							obj3['slab_name'] = '';
							for (const itemJ of this.columnDefinitions) {
								Object.keys(obj3).forEach((key: any) => {
									if (itemJ.id === key) {
										arr.push(obj3[key]);
									}
								});
							}
							headerArr.push(arr);
						}
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
		if (this.reportType === 'routewiseout' || this.reportType === 'routewisecoll') {
			const obj3: any = {};
			const arr: any[] = [];
			obj3['id'] = 'footer';
			obj3['srno'] = '';
			obj3['invoice_created_date'] = 'Grand Total';
			obj3['stu_admission_no'] = '';
			obj3['stu_full_name'] = '';
			obj3['stu_class_name'] = '';
			obj3['fp_name'] = '';
			obj3['receipt_no'] = '';
			obj3['transport_amount'] = (this.dataset.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0));
			obj3['route_name'] = '';
			obj3['stoppages_name'] = '';
			obj3['slab_name'] = '';
			for (const item of this.columnDefinitions) {
				Object.keys(obj3).forEach((key: any) => {
					if (item.id === key) {
						arr.push(obj3[key]);
					}
				});
			}
			headerArr2.push(arr);
		}
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
	groupByRoute() {
		this.dataviewObj.setGrouping({
			getter: 'route_name',
			formatter: (g) => {
				return `<b>${g.value}</b><span style="color:green"> (${g.count})</span>`;
			},
			comparer: (a, b) => {
				// (optional) comparer is helpful to sort the grouped data
				// code below will sort the grouped value in ascending order
				return Sorters.string(a.value, b.value, SortDirectionNumber.desc);
			},
			aggregators: this.aggregatearray,
			aggregateCollapsed: true,
			collapsed: false,
		});
		this.draggableGroupingPlugin.setDroppedGroups('route_name');
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
	exportToFile(type = 'csv') {
		let reportType: any = '';
		this.sessionName = this.getSessionName(this.session.ses_id);
		if (this.reportType === 'routewisecoll') {
			reportType = new TitleCasePipe().transform('route wise collection report: ') + this.sessionName;
		} else if (this.reportType === 'routewiseout') {
			reportType = new TitleCasePipe().transform('route wise outstanding report: ') + this.sessionName;
		} else if (this.reportType === 'transportAlloted') {
			reportType = new TitleCasePipe().transform('Transport allotee report: ') + this.sessionName;
		} else if (this.reportType === 'routeslabstopwise') {
			reportType = new TitleCasePipe().transform('route slab stoppage wise collection report: ') + this.sessionName;
		}
		this.angularGrid.exportService.exportToFile({
			delimiter: (type === 'csv') ? DelimiterType.comma : DelimiterType.tab,
			filename: reportType + '_' + new Date(),
			format: (type === 'csv') ? FileType.csv : FileType.txt
		});
	}
	exportToExcel(json: any[], excelFileName: string) {
		let reportType: any = '';
		const columns: any[] = [];
		const columValue: any[] = [];
		this.exportColumnDefinitions = [];
		this.exportColumnDefinitions = this.angularGrid.slickGrid.getColumns();
		for (const item of this.exportColumnDefinitions) {
			columns.push({
				key: item.id,
				width: this.checkWidth(item.id, item.name)
			});
			columValue.push(item.name);
		}
		this.sessionName = this.getSessionName(this.session.ses_id);
		if (this.reportType === 'routewisecoll') {
			reportType = new TitleCasePipe().transform('routewisecoll_') + this.sessionName;
		} else if (this.reportType === 'routewiseout') {
			reportType = new TitleCasePipe().transform('routewiseout_') + this.sessionName;
		} else if (this.reportType === 'transportAlloted') {
			reportType = new TitleCasePipe().transform('transportAlloted_') + this.sessionName;
		} else if (this.reportType === 'routeslabstopwise') {
			reportType = new TitleCasePipe().transform('routeslabstopwise_') + this.sessionName;
		}
		let reportType2: any = '';
		this.sessionName = this.getSessionName(this.session.ses_id);
		if (this.reportType === 'routewisecoll') {
			reportType2 = new TitleCasePipe().transform('route wise collection report: ') + this.sessionName;
		} else if (this.reportType === 'routewiseout') {
			reportType2 = new TitleCasePipe().transform('route wise outstanding report: ') + this.sessionName;
		} else if (this.reportType === 'transportAlloted') {
			reportType2 = new TitleCasePipe().transform('transport allotee report: ') + this.sessionName;
		} else if (this.reportType === 'routeslabstopwise') {
			reportType2 = new TitleCasePipe().transform('route slab stopwise report: ') + this.sessionName;
		}
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
				for (const item2 of this.exportColumnDefinitions) {
					if (this.reportType !== 'mfr' && this.dataset[key][item2.id] !== '<b>Grand Total</b>') {
						if (item2.id !== 'fp_name' && item2.id !== 'invoice_created_date') {
							obj[item2.id] = this.checkReturn(this.common.htmlToText(json[key][item2.id]));
						}
						if (item2.id !== 'fp_name' && (item2.id === 'invoice_created_date' ||
							item2.id === 'applicable_from' || item2.id === 'applicable_to')
							&& this.dataset[key][item2.id] !== '<b>Grand Total</b>' &&
							this.dataset[key][item2.id] !== '-') {
							obj[item2.id] = new DatePipe('en-in').transform((json[key][item2.id]), 'd-MMM-y');
						}
						if (item2.id !== 'fp_name' && item2.id === 'invoice_created_date'
							&& json[key][item2.id] === '<b>Grand Total</b>') {
							obj[item2.id] = this.common.htmlToText(json[key][item2.id]);
						}
						if (item2.id !== 'invoice_created_date' && item2.id === 'fp_name') {
							obj[item2.id] = this.common.htmlToText(json[key][item2.id]);
						}
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
						for (const item2 of this.exportColumnDefinitions) {
							if (this.reportType !== 'mfr' && Number(key) < this.dataset.length - 1) {
								if (item2.id !== 'fp_name' && item2.id !== 'invoice_created_date') {
									obj[item2.id] = this.checkReturn(this.common.htmlToText(item.rows[key][item2.id]));
								}
								if (item2.id !== 'fp_name' && (item2.id === 'invoice_created_date' ||
									item2.id === 'applicable_from' || item2.id === 'applicable_to')
									&& item.rows[key][item2.id] !== '<b>Grand Total</b>' &&
									item.rows[key][item2.id] !== '-') {
									obj[item2.id] = new DatePipe('en-in').transform((item.rows[key][item2.id]), 'd-MMM-y');
								}
								if (item2.id !== 'fp_name' && item2.id === 'invoice_created_date'
									&& item.rows[key][item2.id] === '<b>Grand Total</b>') {
									obj[item2.id] = this.common.htmlToText(item.rows[key][item2.id]);
								}
								if (item2.id !== 'invoice_created_date' && item2.id === 'fp_name') {
									obj[item2.id] = this.common.htmlToText(item.rows[key][item2.id]);
								}
							}
						}
						worksheet.addRow(obj);
						length++;
						worksheet.eachRow((row, rowNum) => {
							if (rowNum === length) {
								row.eachCell((cell) => {
									cell.border = {
										top: { style: 'thin' },
										left: { style: 'thin' },
										bottom: { style: 'thin' },
										right: { style: 'thin' }
									};
									cell.fill = {
										type: 'pattern',
										pattern: 'solid',
										fgColor: { argb: 'ffffff' },
										bgColor: { argb: 'ffffff' },
									};
									cell.font = {
										name: 'Arial',
										size: 10,
									};
									cell.alignment = { horizontal: 'center' };
								});
							}
						});
						indexPage++;
					});
					if (indexPage === item.rows.length) {
						if (this.reportType === 'routewisecoll') {
							const obj3: any = {};
							obj3['id'] = 'footer';
							obj3['srno'] = '';
							obj3['invoice_created_date'] = 'Total';
							obj3['stu_admission_no'] = '';
							obj3['stu_full_name'] = '';
							obj3['stu_class_name'] = '';
							obj3['fp_name'] = '';
							obj3['receipt_no'] = '';
							obj3['transport_amount'] = item.rows.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0);
							obj3['route_name'] = '';
							obj3['stoppages_name'] = '';
							obj3['slab_name'] = '';
							worksheet.addRow(obj3);
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
										cell.border = {
											top: { style: 'thin' },
											left: { style: 'thin' },
											bottom: { style: 'thin' },
											right: { style: 'thin' }
										};
									});
								}
							});
						}
						if (this.reportType === 'routewiseout') {
							const obj3: any = {};
							obj3['id'] = 'footer';
							obj3['srno'] = '';
							obj3['invoice_created_date'] = '';
							obj3['stu_admission_no'] = this.common.htmlToText('<b>Total</b>');
							obj3['stu_full_name'] = '';
							obj3['stu_class_name'] = '';
							obj3['fp_name'] = '';
							obj3['receipt_no'] = '';
							obj3['transport_amount'] = item.rows.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0);
							obj3['route_name'] = '';
							obj3['stoppages_name'] = '';
							obj3['slab_name'] = '';
							worksheet.addRow(obj3);
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
										cell.border = {
											top: { style: 'thin' },
											left: { style: 'thin' },
											bottom: { style: 'thin' },
											right: { style: 'thin' }
										};
									});
								}
							});
						}
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
		if (this.reportType === 'routewisecoll') {
			const obj3: any = {};
			obj3['id'] = 'footer';
			obj3['srno'] = '';
			obj3['invoice_created_date'] = 'Grand Total';
			obj3['stu_admission_no'] = '';
			obj3['stu_full_name'] = '';
			obj3['stu_class_name'] = '';
			obj3['fp_name'] = '';
			obj3['receipt_no'] = '';
			obj3['transport_amount'] = (this.dataset.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0));
			obj3['route_name'] = '';
			obj3['stoppages_name'] = '';
			obj3['slab_name'] = '';
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
		}
		if (this.reportType === 'routewiseout') {
			const obj3: any = {};
			obj3['id'] = 'footer';
			obj3['srno'] = '';
			obj3['invoice_created_date'] = '';
			obj3['stu_admission_no'] = this.common.htmlToText('<b>Grand Total</b>');
			obj3['stu_full_name'] = '';
			obj3['stu_class_name'] = '';
			obj3['fp_name'] = '';
			obj3['receipt_no'] = '';
			obj3['transport_amount'] = (this.dataset.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0));
			obj3['route_name'] = '';
			obj3['stoppages_name'] = '';
			obj3['slab_name'] = '';
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
		}
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
	checkGroupLevel(item, worksheet) {
		worksheet.mergeCells('A' + (this.groupLength) + ':' +
			this.alphabetJSON[this.exportColumnDefinitions.length] + (this.groupLength));
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
							if (this.reportType !== 'mfr') {
								if (item2.id !== 'fp_name' && item2.id !== 'invoice_created_date') {
									obj[item2.id] = this.checkReturn(this.common.htmlToText(groupItem.rows[key][item2.id]));
								}
								if (item2.id !== 'fp_name' && (item2.id === 'invoice_created_date' ||
									item2.id === 'applicable_from' || item2.id === 'applicable_to')
									&& item.rows[key][item2.id] !== '<b>Grand Total</b>') {
									obj[item2.id] = new DatePipe('en-in').transform((groupItem.rows[key][item2.id]), 'd-MMM-y');
								}
								if (item2.id !== 'fp_name' && item2.id === 'invoice_created_date'
									&& item.rows[key][item2.id] === '<b>Grand Total</b>') {
									obj[item2.id] = this.common.htmlToText(groupItem.rows[key][item2.id]);
								}
								if (item2.id !== 'invoice_created_date' && item2.id === 'fp_name') {
									obj[item2.id] = this.common.htmlToText(groupItem.rows[key][item2.id]);
								}
							}
						}
						worksheet.addRow(obj);
						this.groupLength++;
						worksheet.eachRow((row, rowNum) => {
							if (rowNum === this.groupLength) {
								row.eachCell((cell: any) => {
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
									cell.font = {
										name: 'Arial',
										size: 10,
									};
									cell.alignment = { horizontal: 'center' };
								});
							}
						});
					});
					if (this.reportType === 'routewisecoll' || this.reportType === 'routewiseout') {
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = 'Sub Total';
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['transport_amount'] = groupItem.rows.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0);
						obj3['route_name'] = '';
						obj3['stoppages_name'] = '';
						obj3['slab_name'] = '';
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
									cell.border = {
										top: { style: 'thin' },
										left: { style: 'thin' },
										bottom: { style: 'thin' },
										right: { style: 'thin' }
									};
								});
							}
						});
					}
				}
				index++;
			}
		}
	}
	checkLastTot(item, worksheet) {
		if (this.reportType === 'routewiseout' || this.reportType === 'routewisecoll') {
			const obj3: any = {};
			obj3['id'] = 'footer';
			obj3['srno'] = '';
			obj3['invoice_created_date'] = 'Total';
			obj3['stu_admission_no'] = '';
			obj3['stu_full_name'] = '';
			obj3['stu_class_name'] = '';
			obj3['fp_name'] = '';
			obj3['receipt_no'] = '';
			obj3['transport_amount'] = item.rows.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0);
			obj3['route_name'] = '';
			obj3['stoppages_name'] = '';
			obj3['slab_name'] = '';
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
						cell.border = {
							top: { style: 'thin' },
							left: { style: 'thin' },
							bottom: { style: 'thin' },
							right: { style: 'thin' }
						};
					});
				}
			});
		}
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
	checkWidth(id, header) {
		const res = this.dataset.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
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
						const arr: any = [];
						for (const item2 of this.columnDefinitions) {
							if (this.reportType !== 'mfr') {
								if (item2.id !== 'fp_name' && item2.id !== 'invoice_created_date') {
									arr.push(this.common.htmlToText(groupItem.rows[key][item2.id]));
								}
								if (item2.id !== 'fp_name' && (item2.id === 'invoice_created_date' ||
									item2.id === 'applicable_from' || item2.id === 'applicable_to')
									&& item.rows[key][item2.id] !== '<b>Grand Total</b>') {
									arr.push(new DatePipe('en-in').transform((groupItem.rows[key][item2.id]), 'd-MMM-y'));
								}
								if (item2.id !== 'fp_name' && item2.id === 'invoice_created_date'
									&& item.rows[key][item2.id] === '<b>Grand Total</b>') {
									arr.push(this.common.htmlToText(groupItem.rows[key][item2.id]));
								}
								if (item2.id !== 'invoice_created_date' && item2.id === 'fp_name') {
									arr.push(this.common.htmlToText(groupItem.rows[key][item2.id]));
								}
							} else {
								if (item2.id.toString().match(/Q/)) {
									arr.push(groupItem.rows[key][item2.id].status);
								} else {
									arr.push(groupItem.rows[key][item2.id]);
								}
							}
						}
						rowData.push(arr);
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
					if (this.reportType === 'routewisecoll' || this.reportType === 'routewiseout') {
						const obj3: any = {};
						const arr: any[] = [];
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = 'Sub Total';
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['transport_amount'] = groupItem.rows.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0);
						obj3['route_name'] = '';
						obj3['stoppages_name'] = '';
						obj3['slab_name'] = '';
						for (const col of this.columnDefinitions) {
							Object.keys(obj3).forEach((key: any) => {
								if (col.id === key) {
									arr.push(obj3[key]);
								}
							});
						}
						headerArr2.push(arr);
					}
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
		if (this.reportType === 'routewisecoll' || this.reportType === 'routewiseout') {
			const obj3: any = {};
			const arr: any[] = [];
			obj3['id'] = 'footer';
			obj3['srno'] = '';
			obj3['invoice_created_date'] = 'Total';
			obj3['stu_admission_no'] = '';
			obj3['stu_full_name'] = '';
			obj3['stu_class_name'] = '';
			obj3['fp_name'] = '';
			obj3['receipt_no'] = '';
			obj3['transport_amount'] = group2.rows.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0);
			obj3['route_name'] = '';
			obj3['stoppages_name'] = '';
			obj3['slab_name'] = '';
			for (const item of this.columnDefinitions) {
				Object.keys(obj3).forEach((key: any) => {
					if (item.id === key) {
						arr.push(obj3[key]);
					}
				});
			}
			headerArr2.push(arr);
		}
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
