import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
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
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { DecimalPipe, DatePipe, TitleCasePipe, CurrencyPipe } from '@angular/common';
import { CapitalizePipe, IndianCurrency } from 'src/app/_pipes';
//import { ReceiptDetailsModalComponent } from '../../../sharedmodule/receipt-details-modal/receipt-details-modal.component';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportFilterComponent } from '../../reports-filter-sort/report-filter/report-filter.component';
import { ReportSortComponent } from '../../reports-filter-sort/report-sort/report-sort.component';
//import { InvoiceDetailsModalComponent } from '../../../feemaster/invoice-details-modal/invoice-details-modal.component';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import { group } from '@angular/animations';
import { arrayObjectToCsvFormatter } from 'angular-slickgrid/app/modules/angular-slickgrid/formatters/arrayObjectToCsvFormatter';

import { AddVendorDialog } from './../../../catalogue-management/vendor-master/add-vendor-dialog/add-vendor-dialog.component';
@Component({
	selector: 'app-issue-return-report',
	templateUrl: './issue-return-report.component.html',
	styleUrls: ['./issue-return-report.component.css']
})
export class IssueReturnReportComponent implements OnInit {
	reportdate = new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
	sessionArray: any[] = [];
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
	vendorData = '';
	subjectDataArray: any[] = [];
	sectionDataArray: any[] = [];
	@Input() userName: any = '';
	@ViewChild('searchModal') searchModal;
	@ViewChild('bookDet') bookDet;
	constructor(translate: TranslateService,
		private common: CommonAPIService,
		private erpCommonService: ErpCommonService,
		public dialog: MatDialog,
		private fbuild: FormBuilder) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
		this.getSession();
		this.getSchool();
		this.buildForm();
		this.getClassData();
		this.getSectionData();
		this.getSubject();
		this.getVendorDetails('', false);
		const value = {viewAll: true};
		this.getUserReservoirData(value);
	}
	angularGridReady(angularGrid: AngularGridInstance) {
		this.angularGrid = angularGrid;
		this.gridObj = angularGrid.slickGrid; // grid object
		this.dataviewObj = angularGrid.dataView;
		this.updateTotalRow(angularGrid.slickGrid);
	}
	updateTotalRow(grid: any) {
		if (this.totalRow) {
			let columnIdx = grid.getColumns().length;
			while (columnIdx--) {
				const columnId = grid.getColumns()[columnIdx].id;
				const columnElement: HTMLElement = grid.getFooterRowColumn(columnId);
				columnElement.innerHTML = '<b>' + this.totalRow[columnId] + '<b>';
			}
		}

	}
	buildForm() {
		this.reportFilterForm = this.fbuild.group({
			'class_value': '',
			'role_value': '',
			'status_value': '',
			'from_date' : '',
			'to_date' : '',
			'report_type': '',
			'downloadAll': true,
		});
	}

	getUserReservoirData(value: any) {
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
		let accessionJSON: any;
		if (value) {
			accessionJSON = value;
		} else {
			accessionJSON = {viewAll: true}
		}

		const filterOptions =  {
			role_value : this.reportFilterForm.value.role_value,
			class_value : this.reportFilterForm.value.class_value,
			status_value : this.reportFilterForm.value.status_value,
			from_date : this.reportFilterForm.value.from_date,
			to_date: this.reportFilterForm.value.to_date
		}

		accessionJSON['filter_options'] = filterOptions;

		this.columnDefinitions = [
			{
				id: 'srno',
				name: 'SNo.',
				field: 'srno',
				sortable: true,
				maxWidth: 40
			},
			{
				id: 'user_login_id', name: 'Admission No.', field: 'user_login_id', sortable: true,
				filterable: true,
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				width: 80,
				grouping: {
					getter: 'user_login_id',
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
				id: 'class', name: 'Class', field: 'class', sortable: true,
				filterable: true,
				width: 120,
				filter: { model: Filters.compoundInput },
				grouping: {
					getter: 'class',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false,
				},
			},
			{
				id: 'section', name: 'Section', field: 'section', sortable: true,
				filterable: true,
				width: 120,
				filter: { model: Filters.compoundInput },
				grouping: {
					getter: 'section',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false,
				},
			},
			
			{
				id: 'book_no', name: 'Book No', field: 'book_no', sortable: true,
				filterable: true,
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				formatter: this.bookNoFormatter,
				width: 80,
				grouping: {
					getter: 'book_no',
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
				id: 'issued_to', name: 'Name', field: 'issued_to', sortable: true,
				filterable: true,
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				width: 80,
				grouping: {
					getter: 'issued_to',
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
				id: 'book_name', name: 'Book Name', field: 'book_name', sortable: true,
				filterable: true,
				width: 120,
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				grouping: {
					getter: 'book_name',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false
				},
			},
			// {
			// 	id: 'book_sub_title', name: 'Book Sub Title', field: 'book_sub_title', sortable: true,
			// 	filterable: true,
			// 	width: 120,
			// 	filterSearchType: FieldType.string,
			// 	filter: { model: Filters.compoundInput },
			// 	grouping: {
			// 		getter: 'book_sub_title',
			// 		formatter: (g) => {
			// 			return `${g.value}  <span style="color:green">(${g.count})</span>`;
			// 		},
			// 		aggregators: this.aggregatearray,
			// 		aggregateCollapsed: true,
			// 		collapsed: false
			// 	},
			// },
			
			
			{
				id: 'author', name: 'Author', field: 'author', sortable: true,
				filterable: true,
				width: 80,
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				grouping: {
					getter: 'author',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false,
				},
			},
			{
				id: 'publisher', name: 'Publisher', field: 'publisher', sortable: true,
				filterable: true,
				width: 120,
				filterSearchType: FieldType.dateIso,
				filter: { model: Filters.compoundInput },
				grouping: {
					getter: 'publisher',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false,
				},
			},
			// {
			// 	id: 'issued_to', name: 'Issued To', field: 'issued_to', sortable: true,
			// 	filterable: true,
			// 	width: 120,
			// 	filterSearchType: FieldType.string,
			// 	filter: { model: Filters.compoundInput },
			// 	grouping: {
			// 		getter: 'book_sub_title',
			// 		formatter: (g) => {
			// 			return `${g.value}  <span style="color:green">(${g.count})</span>`;
			// 		},
			// 		aggregators: this.aggregatearray,
			// 		aggregateCollapsed: true,
			// 		collapsed: false
			// 	},
			// },
			{
				id: 'issued_by', name: 'Issued By', field: 'issued_by', sortable: true,
				filterable: true,
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				width: 80,
				grouping: {
					getter: 'issued_by',
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
				id: 'issued_on', name: 'Issued Date', field: 'issued_on', sortable: true,
				filterable: true,
				width: 120,
				filter: { model: Filters.compoundDate },
				filterSearchType: FieldType.dateIso,
				formatter: this.checkDateFormatter,
				grouping: {
					getter: 'issued_on',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false
				},
			},
			{
				id: 'due_date', name: 'Due Date', field: 'due_date', sortable: true,
				filterable: true,
				width: 120,
				filter: { model: Filters.compoundDate },
				filterSearchType: FieldType.dateIso,
				formatter: this.checkDateFormatter,
				grouping: {
					getter: 'due_date',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false
				},
			},
			{
				id: 'returned_on', name: 'Returned On', field: 'returned_on', sortable: true,
				filterable: true,
				width: 120,
				filter: { model: Filters.compoundDate },
				filterSearchType: FieldType.dateIso,
				formatter: this.checkDateFormatter,
				grouping: {
					getter: 'returned_on',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false
				},
			},
			{
				id: 'returned_by', name: 'Returned By', field: 'returned_by', sortable: true,
				filterable: true,
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				width: 80,
				grouping: {
					getter: 'returned_by',
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
				id: 'due_by', name: 'Late By', field: 'due_by', sortable: true,
				filterable: true,
				width: 120,
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				grouping: {
					getter: 'due_by',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false
				},
			},
			{
				id: 'fine', name: 'Fine', field: 'fine', sortable: true,
				filterable: true,
				width: 120,
				filterSearchType: FieldType.string,
				filter: { model: Filters.compoundInput },
				grouping: {
					getter: 'fine',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false
				},
			},
			// {
			// 	id: 'genre', name: 'Genre', field: 'genre', sortable: true,
			// 	filterable: true,
			// 	width: 80,
			// 	filterSearchType: FieldType.string,
			// 	filter: { model: Filters.compoundInput },
			// 	grouping: {
			// 		getter: 'genre',
			// 		formatter: (g) => {
			// 			return `${g.value}  <span style="color:green">(${g.count})</span>`;
			// 		},
			// 		aggregators: this.aggregatearray,
			// 		aggregateCollapsed: true,
			// 		collapsed: false,
			// 	},
			// },
			// {
			// 	id: 'pages', name: 'Pages', field: 'pages', sortable: true,
			// 	filterable: true,
			// 	width: 80,
			// 	filterSearchType: FieldType.number,
			// 	filter: { model: Filters.compoundInput },
			// 	grouping: {
			// 		getter: 'pages',
			// 		formatter: (g) => {
			// 			return `${g.value}  <span style="color:green">(${g.count})</span>`;
			// 		},
			// 		aggregators: this.aggregatearray,
			// 		aggregateCollapsed: true,
			// 		collapsed: false,
			// 	},
			// },
			// {
			// 	id: 'price', name: 'Price', field: 'price', sortable: true,
			// 	filterable: true,
			// 	width: 80,
			// 	filterSearchType: FieldType.number,
			// 	filter: { model: Filters.compoundInput },
			// 	grouping: {
			// 		getter: 'price',
			// 		formatter: (g) => {
			// 			return `${g.value}  <span style="color:green">(${g.count})</span>`;
			// 		},
			// 		aggregators: this.aggregatearray,
			// 		aggregateCollapsed: true,
			// 		collapsed: false,
			// 	},
			// },
			
			// {
			// 	id: 'published_date', name: 'Publish Date', field: 'published_date', sortable: true,
			// 	filterable: true,
			// 	width: 120,
			// 	filterSearchType: FieldType.number,
			// 	grouping: {
			// 		getter: 'published_date',
			// 		formatter: (g) => {
			// 			return `${g.value}  <span style="color:green">(${g.count})</span>`;
			// 		},
			// 		aggregators: this.aggregatearray,
			// 		aggregateCollapsed: true,
			// 		collapsed: false,
			// 	},
			// },
			// {
			// 	id: 'tags', name: 'Tag', field: 'tags', sortable: true,
			// 	filterable: true,
			// 	width: 120,
			// 	filter: { model: Filters.compoundInput },
			// 	grouping: {
			// 		getter: 'tags',
			// 		formatter: (g) => {
			// 			return `${g.value}  <span style="color:green">(${g.count})</span>`;
			// 		},
			// 		aggregators: this.aggregatearray,
			// 		aggregateCollapsed: true,
			// 		collapsed: false,
			// 	},
			// },
			// {
			// 	id: 'volume_info', name: 'Volume Info', field: 'volume_info', sortable: true,
			// 	filterable: true,
			// 	width: 120,
			// 	filter: { model: Filters.compoundInput },
			// 	grouping: {
			// 		getter: 'volume_info',
			// 		formatter: (g) => {
			// 			return `${g.value}  <span style="color:green">(${g.count})</span>`;
			// 		},
			// 		aggregators: this.aggregatearray,
			// 		aggregateCollapsed: true,
			// 		collapsed: false,
			// 	},
			// },
			// {
			// 	id: 'language', name: 'Language', field: 'language', sortable: true,
			// 	filterable: true,
			// 	width: 120,
			// 	filter: { model: Filters.compoundInput },
			// 	grouping: {
			// 		getter: 'language',
			// 		formatter: (g) => {
			// 			return `${g.value}  <span style="color:green">(${g.count})</span>`;
			// 		},
			// 		aggregators: this.aggregatearray,
			// 		aggregateCollapsed: true,
			// 		collapsed: false,
			// 	},
			// },
			// {
			// 	id: 'print_type', name: 'Print Type', field: 'print_type', sortable: true,
			// 	filterable: true,
			// 	width: 120,
			// 	filter: { model: Filters.compoundInput },
			// 	grouping: {
			// 		getter: 'print_type',
			// 		formatter: (g) => {
			// 			return `${g.value}  <span style="color:green">(${g.count})</span>`;
			// 		},
			// 		aggregators: this.aggregatearray,
			// 		aggregateCollapsed: true,
			// 		collapsed: false,
			// 	},
			// },
			// {
			// 	id: 'book_type', name: 'Book Type', field: 'book_type', sortable: true,
			// 	filterable: true,
			// 	width: 120,
			// 	filter: { model: Filters.compoundInput },
			// 	grouping: {
			// 		getter: 'book_type',
			// 		formatter: (g) => {
			// 			return `${g.value}  <span style="color:green">(${g.count})</span>`;
			// 		},
			// 		aggregators: this.aggregatearray,
			// 		aggregateCollapsed: true,
			// 		collapsed: false,
			// 	},
			// },
			// {
			// 	id: 'location', name: 'Location', field: 'location', sortable: true,
			// 	filterable: true,
			// 	width: 120,
			// 	filter: { model: Filters.compoundInput },
			// 	grouping: {
			// 		getter: 'location',
			// 		formatter: (g) => {
			// 			return `${g.value}  <span style="color:green">(${g.count})</span>`;
			// 		},
			// 		aggregators: this.aggregatearray,
			// 		aggregateCollapsed: true,
			// 		collapsed: false,
			// 	},
			// },
			// {
			// 	id: 'class', name: 'Class', field: 'class', sortable: true,
			// 	filterable: true,
			// 	width: 120,
			// 	filter: { model: Filters.compoundInput },
			// 	grouping: {
			// 		getter: 'class',
			// 		formatter: (g) => {
			// 			return `${g.value}  <span style="color:green">(${g.count})</span>`;
			// 		},
			// 		aggregators: this.aggregatearray,
			// 		aggregateCollapsed: true,
			// 		collapsed: false,
			// 	},
			// },
			// {
			// 	id: 'subject', name: 'Subject', field: 'subject', sortable: true,
			// 	filterable: true,
			// 	width: 120,
			// 	filter: { model: Filters.compoundInput },
			// 	grouping: {
			// 		getter: 'subject',
			// 		formatter: (g) => {
			// 			return `${g.value}  <span style="color:green">(${g.count})</span>`;
			// 		},
			// 		aggregators: this.aggregatearray,
			// 		aggregateCollapsed: true,
			// 		collapsed: false,
			// 	},
			// },
			// {
			// 	id: 'vendor_name', name: 'Vendor Name', field: 'vendor_name', sortable: true,
			// 	filterable: true,
			// 	width: 120,
			// 	filter: { model: Filters.compoundInput },
			// 	formatter: this.vendorFormatter,
			// 	grouping: {
			// 		getter: 'vendor_name',
			// 		formatter: (g) => {
			// 			return `${g.value}  <span style="color:green">(${g.count})</span>`;
			// 		},
			// 		aggregators: this.aggregatearray,
			// 		aggregateCollapsed: true,
			// 		collapsed: false,
			// 	},
			// },
			// {
			// 	id: 'status', name: 'Status', field: 'status', sortable: true,
			// 	filterable: true,
			// 	width: 150,
			// 	filter: { model: Filters.compoundInput },
			// 	grouping: {
			// 		getter: 'status',
			// 		formatter: (g) => {
			// 			return `${g.value}  <span style="color:green">(${g.count})</span>`;
			// 		},
			// 		aggregators: this.aggregatearray,
			// 		aggregateCollapsed: true,
			// 		collapsed: false,
			// 	},
			// }
		];
		this.erpCommonService.getIssueReturnReport(accessionJSON).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.common.showSuccessErrorMessage(result.message, 'success');
				repoArray = result.data.all;
				this.totalRecords = Number(result.data.all.length);
				let index = 0;
				for (const item of repoArray) {

					let currentVendorName = '';
					let currentClassName = '';
					let currentSectionName = '';
					let currentSubjectName = '';
					for (let i =0; i < this.vendorData.length;i++) {
						if (this.vendorData[i]['ven_id'] === repoArray[Number(index)]['reserv_user_logs']['vendor_details']['vendor_id']) {
							currentVendorName = this.vendorData[i]['ven_name'];
							break;
						}
					}

					// for (let i =0; i < this.classDataArray.length;i++) { 
					// 	if (repoArray[Number(index)]['user_class_id']) {
					// 		var cindex = repoArray[Number(index)]['user_class_id'].indexOf(this.classDataArray[i]['class_id']);
					// 		if (cindex > -1) {
					// 			currentClassName += this.classDataArray[cindex]['class_name']+",";						
					// 		}						
					// 	}
						
					// }
					currentClassName = repoArray[Number(index)]['user_class_name'];
					
					// for (let i =0; i < this.sectionDataArray.length;i++) {
					// 	if (repoArray[Number(index)]['user_sec_id']) {
							
					// 		var cindex = repoArray[Number(index)]['user_sec_id'].indexOf(this.sectionDataArray[i]['sec_id']);
					// 		if (cindex > -1) {
					// 			currentSectionName += this.sectionDataArray[cindex]['sec_name'];						
					// 		}						
					// 	}						
					// }
					currentSectionName = repoArray[Number(index)]['user_sec_name'];

					for (let i =0; i < this.subjectDataArray.length;i++) {
						if (this.subjectDataArray[i]['sub_id'] === repoArray[Number(index)]['reserv_user_logs']['reserv_sub_id']) {
							currentSubjectName = this.subjectDataArray[i]['sub_name'];
							break;
						}
					}

					var login_id = '';

					if (repoArray[Number(index)]['user_role_id'] === '2') {
						login_id = repoArray[Number(index)]['user_login_id'] ? 'A - '+repoArray[Number(index)]['user_login_id'] : '';
					}
					if (repoArray[Number(index)]['user_role_id'] === '3') {
						login_id = repoArray[Number(index)]['user_login_id'] ? ' T - '+repoArray[Number(index)]['user_login_id']  : '';
					}
					if (repoArray[Number(index)]['user_role_id'] === '4') {
						login_id = repoArray[Number(index)]['user_admission_no'] ? ' S - ' +repoArray[Number(index)]['user_admission_no'] : '';
					}


					const obj: any = {};
					obj['id'] = (index + 1);
					obj['srno'] = (index + 1);
					obj['book_no'] = repoArray[Number(index)]['reserv_user_logs'] ?
						repoArray[Number(index)]['reserv_user_logs']['book_no'] : '-';
					obj['book_name'] = new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['title']) ? new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['title']) : '-';
					obj['user_login_id'] = login_id ? login_id : '-';					
					obj['book_sub_title'] = new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['subtitle']) ? new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['subtitle']) : '-';
					obj['issued_to'] = new CapitalizePipe().transform(repoArray[Number(index)]['user_full_name']) ? new CapitalizePipe().transform(repoArray[Number(index)]['user_full_name']) : '-';
					obj['issued_on'] = new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['issued_on']) ? new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['issued_on']) : '-';
					obj['due_date'] = new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['due_date']) ? new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['due_date']) : '-';
					obj['issued_by'] = new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['issued_by'] && repoArray[Number(index)]['reserv_user_logs']['issued_by']['name']) ? new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['issued_by']['name']) : '-';
					obj['returned_by'] = new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['returned_by'] && repoArray[Number(index)]['reserv_user_logs']['returned_by']['name']) ? new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['returned_by']['name']) : '-';
					obj['due_by'] = this.getDaysDiff(repoArray[Number(index)]['reserv_user_logs']['due_date']) > 0 ? this.getDaysDiff(repoArray[Number(index)]['reserv_user_logs']['due_date'])+' Days' : '-';
					obj['returned_on'] = new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['returned_on']) ? new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['returned_on']) : '-';
					obj['author'] = new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['authors'][0]) ? new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['authors'][0]) : '-';
					obj['genre'] = new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['genre']['genre_name']) ? new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['genre']['genre_name']) : '-';
					obj['pages'] = repoArray[Number(index)]['reserv_user_logs']['pages'] ? repoArray[Number(index)]['reserv_user_logs']['pages'] : '-';
					obj['price'] = repoArray[Number(index)]['reserv_user_logs']['price'] ? repoArray[Number(index)]['reserv_user_logs']['price'] : '-';
					obj['publisher'] = repoArray[Number(index)]['reserv_user_logs']['publisher'] ? repoArray[Number(index)]['reserv_user_logs']['publisher'] : '-';
					obj['published_date'] = repoArray[Number(index)]['reserv_user_logs']['published_date'] ? repoArray[Number(index)]['reserv_user_logs']['published_date'] : '-';
					obj['tags'] = new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['reserv_tags']) ? new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['reserv_tags']) : '-';
					obj['volume_info'] = repoArray[Number(index)]['reserv_user_logs']['edition'] ? repoArray[Number(index)]['reserv_user_logs']['edition'] : '-';
					obj['language'] = new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['language_details']['lang_name']) ? new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['language_details']['lang_name']) : '-';
					obj['print_type'] = new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['type_id']) ? new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['type_id']) : '-';
					obj['book_type'] = new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['category_id']) ? new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['category_id']) : '-';
					obj['location'] = new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['location']) ? new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['location']) : '-';
					obj['fine'] = repoArray[Number(index)]['reserv_user_logs']['fine'] > 0 ? repoArray[Number(index)]['reserv_user_logs']['fine'] :  '-';
					obj['class'] = new CapitalizePipe().transform(currentClassName.slice(0, -1)) ? new CapitalizePipe().transform(currentClassName.slice(0, -1)) : '-';
					obj['section'] = new CapitalizePipe().transform(currentSectionName) ? new CapitalizePipe().transform(currentSectionName) : '-';
					obj['subject'] = new CapitalizePipe().transform(currentSubjectName) ? new CapitalizePipe().transform(currentSubjectName) : '-';
					obj['vendor_id'] = repoArray[Number(index)]['reserv_user_logs']['vendor_details']['vendor_id'] ? repoArray[Number(index)]['reserv_user_logs']['vendor_details']['vendor_id'] : '-';
					obj['vendor_name'] = currentVendorName ? new CapitalizePipe().transform(currentVendorName ) :  '-'; 
					obj['status'] = new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['reserv_status']) ? new CapitalizePipe().transform(repoArray[Number(index)]['reserv_user_logs']['reserv_status']) : '-';


					this.dataset.push(obj);
					index++;
				}

				console.log('dataset', this.dataset);
				// this.totalRow = {};
				// const obj3: any = {};
				// obj3['id'] = '';
				// obj3['srno'] = '';
				// obj3['stu_admission_no'] = this.common.htmlToText('<b>Grand Total</b>');
				// obj3['stu_full_name'] = '';
				// obj3['stu_class_name'] = '';
				// obj3['deposite_date'] = '';
				// obj3['cheque_date'] = '';
				// obj3['dishonor_date'] = '';
				// obj3['invoice_id'] = '';
				// obj3['invoice_no'] = '';
				// obj3['receipt_no'] = '';
				// obj3['receipt_id'] = '';
				// obj3['receipt_amount'] =
				// 	new DecimalPipe('en-in').transform(this.dataset.map(t => t['receipt_amount']).reduce((acc, val) => acc + val, 0));
				// obj3['bank_name'] = '';
				// obj3['status'] = '';
				// obj3['fcc_reason_id'] = '';
				// obj3['fcc_remarks'] = '';
				// this.totalRow = obj3;
				// if (this.dataset.length <= 5) {
				// 	this.gridHeight = 300;
				// } else if (this.dataset.length <= 10 && this.dataset.length > 5) {
				// 	this.gridHeight = 400;
				// } else if (this.dataset.length > 10 && this.dataset.length <= 20) {
				// 	this.gridHeight = 550;
				// } else if (this.dataset.length > 20) {
				// 	this.gridHeight = 750;
				// }
				this.tableFlag = true;
			} else {
				this.tableFlag = true;
			}
		});
	}

	parseDate(str) {
		var mdy = str.split('-');
		return new Date(mdy[0], mdy[1] - 1, mdy[2]);
	}

	getDaysDiff(dueDate) {
		if (dueDate) {
			var date1 = this.common.dateConvertion(new Date(), 'yyyy-MM-dd');
			var date2 = this.common.dateConvertion(dueDate, 'yyyy-MM-dd');
			var parsedDate2: any = this.parseDate(date2);
			var parsedDate1: any = this.parseDate(date1);
			return Math.round((parsedDate1 - parsedDate2) / (1000 * 60 * 60 * 24));
		}
	}

	

	bookNoFormatter(row, cell, value, columnDef, dataContext) {
		if (value !== '-') {
			return '<div style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
					+ '<span class="book-no"><a href="javascript:void(0)">' + value + '</a></span>' + '</div>';
		} else {
			return '-';
		}
	}

	vendorFormatter(row, cell, value, columnDef, dataContext) {
		if (value !== '-') {
			return '<div style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
					+ '<span class="vendor-no"><a href="javascript:void(0)">' + value + '</a></span>' + '</div>';
		} else {
			return '-';
		}
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
		// if (args.cell === args.grid.getColumnIndex('receipt_no')) {
		// 	const item: any = args.grid.getDataItem(args.row);
		// 	if (item['receipt_no'] !== '-') {
		// 		this.openDialogReceipt(item['receipt_id'], false);
		// 	}
		// }
		if (args.cell === args.grid.getColumnIndex('book_no')) {
			const item: any = args.grid.getDataItem(args.row);
			console.log('item', item);
			if (item['book_no'] !== '-') {
				this.openBookModal(item['book_no']);
			}
		}
		if (args.cell === args.grid.getColumnIndex('vendor_name')) {
			const item: any = args.grid.getDataItem(args.row);
			console.log('item', item);
			if (item['vendor_id'] !== '-') {
				this.getVendorDetails(item['vendor_id'], true);
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
		if (totals.group.level === 0) {
			return '<b class="total-footer-report">Total</b>';
		}
		if (totals.group.level > 0) {
			return '<b class="total-footer-report">Sub Total (' + totals.group.value + ') </b>';
		}
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
		this.erpCommonService.getClass({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.classDataArray = result.data;
				this.getClass();
			}
		});
	}

	getSectionData() {
		this.erpCommonService.getSection({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.sectionDataArray = result.data;
				
			}
		});
	}

	getSectionByClass($event) {
		this.erpCommonService.getSectionsByClass({ class_id: $event.value }).subscribe((result: any) => {
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
	
	getSchool() {
		this.erpCommonService.getSchool().subscribe((res: any) => {
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
		this.erpCommonService.getSession().subscribe((result2: any) => {
			if (result2.status === 'ok') {
				this.sessionArray = result2.data;
				this.sessionName = this.getSessionName(this.session.ses_id);
			}
		});
	}

	getSubject() {
		this.erpCommonService.getSubject({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.subjectDataArray = result.data;
			}
		});
	}

	openBookModal(book_no) {
		this.bookDet.openModal(book_no);
	}

	getVendorDetails(ven_id, showDialog) {
		let inputJson = {};
		if (showDialog) {
			if (ven_id) {
				inputJson = {ven_id:ven_id};
			} else {
				inputJson = {};
			}
			this.erpCommonService.getVendor(inputJson).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					const element:any = result.data[0];
					console.log('element', element);
					const dialogRef = this.dialog.open(AddVendorDialog, {
						width: '750px',
						data: {
							ven_id: ven_id,
							ven_name: element.ven_name,
							ven_category: element.ven_category,
							ven_address: element.ven_address,
							ven_contact: element.ven_contact,
							ven_email: element.ven_email,
							ven_frequency: element.ven_frequency ? element.ven_frequency : '',
							ven_items_tags: element.ven_items_tags ? element.ven_items_tags : '',
							ven_authorised_person_detail_name : element.ven_authorised_person_detail_name ? element.ven_authorised_person_detail_name : '',
							ven_authorised_person_detail_designation : element.ven_authorised_person_detail_designation ? element.ven_authorised_person_detail_designation : '',
							ven_authorised_person_detail_contact : element.ven_authorised_person_detail_contact ? element.ven_authorised_person_detail_contact : '',
							ven_pan_no : element.ven_pan_no ? element.ven_pan_no : '',
							ven_gst_no : element.ven_gst_no ? element.ven_gst_no : '',
							ven_status: element.ven_status ? element.ven_status : '1',
							ven_created_date: element.ven_created_date ? element.ven_created_date : '',
							ven_updated_date: element.ven_updated_date ? element.ven_updated_date : '',
							showButtonStatus: false
						}
					  });
					
					  dialogRef.afterClosed().subscribe(result => {
				
					});
				}
			});
		} else {
			this.erpCommonService.getVendor({ven_id}).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					const element:any = result.data;
					this.vendorData = element;
			}});
		}
		

		
	}


	resetValues() {
		this.reportFilterForm.patchValue({
			'class_value': '',
			'role_value': '',
			'status_value': '',
			'from_date' : '',
			'to_date' : '',
			'report_type': '',
			'downloadAll': true,
		});
		this.getUserReservoirData('');
	}
	exportToFile(type = 'csv') {
		let reportType: any = '';
		this.sessionName = this.getSessionName(this.session.ses_id);
		reportType = new TitleCasePipe().transform('Accession Master:') + this.sessionName;
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
		for (const item of this.exportColumnDefinitions) {
			columns.push({
				key: item.id,
				width: this.checkWidth(item.id, item.name)
			});
			columValue.push(item.name);
		}
		this.sessionName = this.getSessionName(this.session.ses_id);
		reportType = new TitleCasePipe().transform('issue_return_report_') + this.sessionName;
		let reportType2: any = '';
		reportType2 = new TitleCasePipe().transform('Issue Return Report : ') + this.sessionName;
		const fileName =reportType + '_' + this.reportdate +'.xlsx';
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
					if ((item2.id === 'cheque_date' || item2.id === 'deposite_date'
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
					cell.alignment = { horizontal: 'center' };
				});
			} else if (rowNum > 4 && rowNum <= worksheet._rows.length) {
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
							if ((item2.id === 'cheque_date' || item2.id === 'deposite_date'
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
		reportType = new TitleCasePipe().transform('Issue Return report: ') + this.sessionName;
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
					// doc.setFontStyle('bold');
					// doc.setFontSize('18');
					// doc.setTextColor('#ffffff');
					// doc.setFillColor(67, 160, 71);
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
							if (groupItem.rows[key][item2.id] !== '-' && (item2.id === 'cheque_date' || item2.id === 'dishonor_date'
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
