import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import {
	GridOption, Column, AngularGridInstance, Grouping, Aggregators,
	FieldType,
	Filters,
	OperatorType,
	Formatters,
	Sorters,
	SortDirectionNumber,
	DelimiterType,
	FileType
} from 'angular-slickgrid';
import { saveAs } from 'file-saver';
import * as Excel from 'exceljs/dist/exceljs';
import { TranslateService } from '@ngx-translate/core';
import { FeeService, CommonAPIService, SisService } from '../../../_services';
import { DecimalPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { CapitalizePipe, IndianCurrency } from '../../../_pipes';
import { ReceiptDetailsModalComponent } from '../../../sharedmodule/receipt-details-modal/receipt-details-modal.component';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportFilterComponent } from '../../reports-filter-sort/report-filter/report-filter.component';
import { ReportSortComponent } from '../../reports-filter-sort/report-sort/report-sort.component';
import { InvoiceDetailsModalComponent } from '../../../feemaster/invoice-details-modal/invoice-details-modal.component';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { group } from '@angular/animations';
import { findIndex } from 'rxjs/operators';
@Component({
	selector: 'app-outstanding-report',
	templateUrl: './outstanding-report.component.html',
	styleUrls: ['./outstanding-report.component.css']
})
export class OutstandingReportComponent implements OnInit {
	reportdate = new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
	@ViewChild('smsFeeModal') smsFeeModal;
	@Output() displyRep = new EventEmitter();
	rowsChosen: any[] = [];
	@Input() userName: any = '';
	totalRow: any;
	groupColumns: any[] = [];
	groupLength: any;
	feeHeadJSON: any[] = [];
	exportColumnDefinitions: any[] = [];
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
	sessionArray: any[] = [];
	session: any = {};
	gridHeight: any;
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
	schoolInfo: any;
	sessionName: any;
	filteredAs: any = {};
	currentUser: any;
	pdfrowdata: any[] = [];
	levelHeading: any[] = [];
	levelTotalFooter: any[] = [];
	levelSubtotalFooter: any[] = [];
	notFormatedCellArray: any[] = [];
	monthArray = [];
	rowChosenData: any[] = [];
	schoolBranchArray:any[] = [];
	showMultiSchool=0;
	multiBranchClass:any[] = [];
	multiBranchFeeHeads:any[] = [];
	multiBranchRoutes:any[] = [];
	multiValueArray:any[] = [];
	constructor(translate: TranslateService,
		private feeService: FeeService,
		private common: CommonAPIService,
		private sisService: SisService,
		public dialog: MatDialog,
		private fbuild: FormBuilder) { }

	ngOnInit() {

		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.checkForMultiBranch();
		this.getSchool();
		this.getInvoiceFeeMonths();
		this.session = JSON.parse(localStorage.getItem('session'));
		this.getSession();

		this.buildForm();
		this.getClassData();
		// this.reportTypeArray.push({
		// 	report_type: 'headwise', report_name: 'Head Wise'
		// },
		// 	{
		// 		report_type: 'headwisedetail', report_name: 'Head Wise Detail'
		// 	},
		// 	{
		// 		report_type: 'routewise', report_name: 'Route Wise'
		// 	},
		// 	{
		// 		report_type: 'defaulter', report_name: 'Defaulter\'s List'
		// 	},
		// 	{
		// 		report_type: 'feedue', report_name: 'Fee dues'
		// 	},
		// 	{
		// 		report_type: 'aging', report_name: 'Aging'
		// 	}
		// );
		if(this.common.isExistUserAccessMenu('656')) {
			this.reportTypeArray.push({report_type: 'headwise', report_name: 'Head Wise'});
		}
		if(this.common.isExistUserAccessMenu('657')) {
			this.reportTypeArray.push({report_type: 'headwisedetail', report_name: 'Head Wise Detail'});
		}
		if(this.common.isExistUserAccessMenu('658')) {
			this.reportTypeArray.push({report_type: 'routewise', report_name: 'Route Wise'});
		}
		if(this.common.isExistUserAccessMenu('659')) {
			this.reportTypeArray.push({report_type: 'defaulter', report_name: 'Defaulter\'s List'});
		}
		if(this.common.isExistUserAccessMenu('660')) {
			this.reportTypeArray.push({report_type: 'feedue', report_name: 'Fee dues'});
		}
		if(this.common.isExistUserAccessMenu('661')) {
			this.reportTypeArray.push({report_type: 'aging', report_name: 'Aging'});
		}
		if (this.sessionName) {
			const date = new Date(this.sessionName.split('-')[0], new Date().getMonth(), new Date().getDate());
			const firstDay = new Date(this.sessionName.split('-')[0], new Date().getMonth(), 1);
			this.reportFilterForm.patchValue({
				'from_date': firstDay,
				'to_date': date,
				'month_id': ''
			});
		}
		this.filterFlag = true;
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
			if (this.totalRow[columnId]) {
				columnElement.innerHTML = '<b>' + this.totalRow[columnId] + '<b>';
			}

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
	getClassOrder(cName) {
		var order = '';
		for (var i=0; i<this.classDataArray.length;i++) {
			if(this.classDataArray[i]['class_name'] === cName) {
				order = this.classDataArray[i]['class_order'];
				break;
			}
		}
		return order;
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
		let tempArray = [];
		console.log('this.currentUser',this.currentUser)
		tempArray.push(this.currentUser.Prefix);
		this.reportFilterForm = this.fbuild.group({
			'report_type': '',
			'fee_value': '',
			'from_date': '',
			'to_date': '',
			'month_id': '',
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
			'orderBy': '',
			'school_branch' : tempArray
		});
		this.reportFilterForm.patchValue({
			school_branch:tempArray
		})
	}

	getInvoiceFeeMonths() {
		this.monthArray = [];
		this.feeService.getInvoiceFeeMonths({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log('monthArray', result.data.fm_data);
				this.monthArray = result.data.fm_data;
			}
		});
	}

	getOutstandingReport(value: any) {

		value.to_date = new DatePipe('en-in').transform(value.to_date, 'yyyy-MM-dd');
		this.dataArr = [];
		this.aggregatearray = [];
		this.columnDefinitions = [];
		this.rowsChosen = [];
		this.rowChosenData = [];
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
			
			enableCheckboxSelector: this.reportType === 'aging' ? false : true,
			checkboxSelector: {
				columnId: 'checkbox_select'
			},
			rowSelectionOptions: {
				selectActiveRow: false
			},
			enableRowSelection: true,
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
					// console.log('Column selection changed from Grid Menu, visible columns: ', args.columns);
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
		if (this.reportFilterForm.value.report_type) {
			if (this.reportType === 'headwise') {
				this.gridOptions.rowHeight=65;
				const collectionJSON: any = {
					'admission_no': '',
					'studentName': '',
					'report_type': value.report_type,
					'feeHeadId': value.fee_value,
					// 'from_date': value.from_date,
					'to_date': value.to_date,
					'pageSize': '10',
					'pageIndex': '0',
					'filterReportBy': 'outstanding',
					'login_id': value.login_id,
					'orderBy': value.orderBy,
					'downloadAll': true,
					'school_branch': this.reportFilterForm.value.school_branch
				};
				this.feeService.geOutStandingHeadWiseCollection(collectionJSON).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.common.showSuccessErrorMessage('Report Data Fetched Successfully', 'success');
						repoArray = result.data.reportData;
						this.totalRecords = Number(result.data.totalRecords);
						localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
						
						var branchArray = this.reportFilterForm.value.school_branch;
						let i = 0;
						let j = 0;
						let stuFeeHeadArray = [];
						const feeHead: any[] = [];
						var tempHeadArray= [];
						var schoolArray = [];
						var commonHeadsArray = [];
						var tempCommonHeadsArray = [];
						
						for (var bi=0; bi<repoArray.length;bi++) {
							
							if (branchArray.indexOf(repoArray[bi]['school_prefix']) > -1 
								&& ((schoolArray.indexOf(repoArray[bi]['school_prefix']) ) == -1)) {
								
								schoolArray.push(repoArray[bi]['school_prefix']);
								for (var ji=0; ji< repoArray[bi]['fee_head_data'].length;ji++) {
									repoArray[bi]['fee_head_data'][ji]['fh_prefix'] = repoArray[bi]['school_prefix'];
									tempHeadArray.push(repoArray[bi]['fee_head_data'][ji]);
								}
								
							}
						}

						for(var ti=0; ti<tempHeadArray.length;ti++) {
							if(tempCommonHeadsArray.indexOf(tempHeadArray[ti]['fh_name']) == -1) {
								tempCommonHeadsArray.push(tempHeadArray[ti]['fh_name']);
								commonHeadsArray.push(tempHeadArray[ti]);
							}
						}
						Object.keys(repoArray).forEach((keys: any) => {
							const obj: any = {};
							if (Number(keys) === 0) {
								this.columnDefinitions = [
									{
										id: 'srno',
										name: 'SNo.',
										field: 'srno',
										sortable: true,
										width: 2
									},
									{
										id: 'stu_admission_no',
										name: 'Enrollment No.',
										field: 'stu_admission_no',
										filterable: true,
										filterSearchType: FieldType.string,
										filter: { model: Filters.compoundInputText },
										sortable: true,
										width: 90,
										grouping: {
											getter: 'stu_admission_no',
											formatter: (g) => {
												return `${g.value} <span style="color:green"> (${g.count})</span>`;
											},
											aggregators: this.aggregatearray,
											aggregateCollapsed: true,
											collapsed: false
										},
										groupTotalsFormatter: this.srnTotalsFormatter
									},
									{
										id: 'stu_full_name',
										name: 'Student Name',
										field: 'stu_full_name',
										filterable: true,
										sortable: true,
										width: 180,
										filterSearchType: FieldType.string,
										filter: { model: Filters.compoundInputText },
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
										id: 'stu_class_name',
										name: 'Class-Section',
										field: 'stu_class_name',
										sortable: true,
										filterable: true,
										width: 60,
										filterSearchType: FieldType.string,
										filter: { model: Filters.compoundInputText },
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
										id: 'tag_name',
										name: 'Tag',
										field: 'tag_name',
										sortable: true,
										filterable: true,
										width: 60,
										filterSearchType: FieldType.string,
										filter: { model: Filters.compoundInputText },
										grouping: {
											getter: 'tag_name',
											formatter: (g) => {
												return `${g.value}  <span style="color:green">(${g.count})</span>`;
											},
											aggregators: this.aggregatearray,
											aggregateCollapsed: true,
											collapsed: false,
										},
									},
									{
										id: 'fp_name',
										name: 'Fee Period',
										field: 'fp_name',
										sortable: true,
										filterable: true,
										width: 100,
										filterSearchType: FieldType.string,
										filter: { model: Filters.compoundInputText },
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
										id: 'inv_opening_balance', name: 'Previous Balance', field: 'inv_opening_balance',
										filterable: true,
										cssClass: 'amount-report-fee',
										filterSearchType: FieldType.number,
										filter: { model: Filters.compoundInputNumber },
										sortable: true,
										type:FieldType.number,
										formatter: this.checkFeeFormatter,
										groupTotalsFormatter: this.sumTotalsFormatter
									}];
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
										this.columnDefinitions.splice(1, 0, aColumn);
										
									}
							}
							if (repoArray[Number(keys)]['fee_head_data']) {
								let k = 0;
								let tot = 0;
								stuFeeHeadArray = [];
								for(let fij=0; fij < repoArray[Number(keys)]['fee_head_data'].length;fij++) {
									repoArray[Number(keys)]['fee_head_data'][fij]['fh_prefix'] = repoArray[Number(keys)]['school_prefix'];
									stuFeeHeadArray.push(repoArray[Number(keys)]['fee_head_data'][fij]);
									
								}
								for (const titem of commonHeadsArray) {
									Object.keys(titem).forEach((key2: any) => {
										if (key2 === 'fh_name' && Number(keys) === 0) {
											const feeObj: any = {};
											this.columnDefinitions.push({
												id: 'fh_name' + j,
												name: new CapitalizePipe().transform(titem[key2]),
												field: 'fh_name' + j,
												cssClass: 'amount-report-fee',
												sortable: true,
												filterable: true,
												filterSearchType: FieldType.number,
												filter: { model: Filters.compoundInput },
												formatter: this.checkFeeFormatter,
												type:FieldType.number,
												groupTotalsFormatter: this.sumTotalsFormatter
											});
											feeObj['fh_name' + j] = '';
											feeHead.push(feeObj);
											this.feeHeadJSON.push(feeObj);
											this.aggregatearray.push(new Aggregators.Sum('fh_name' + j));
											j++;
										}
										if (key2 === 'fh_name') {
											obj['id'] = repoArray[Number(keys)]['stu_admission_no'] + keys +
												repoArray[Number(keys)]['rpt_id'];
											obj['srno'] = (collectionJSON.pageSize * collectionJSON.pageIndex) +
												(Number(keys) + 1);
											obj['stu_admission_no'] = repoArray[Number(keys)]['stu_admission_no'] ?
												repoArray[Number(keys)]['stu_admission_no'] : '-';
											obj['school_prefix'] = repoArray[Number(keys)]['school_prefix'] ?
												repoArray[Number(keys)]['school_prefix'] : '-';
											obj['login_id'] = repoArray[Number(keys)]['login_id'] ?
												repoArray[Number(keys)]['login_id'] : '-';
											obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(keys)]['stu_full_name']);
											obj['tag_name'] = repoArray[Number(keys)]['tag_name'] ? new CapitalizePipe().transform(repoArray[Number(keys)]['tag_name']) : '-';
											if (repoArray[Number(keys)]['stu_sec_id'] !== '0') {
												obj['stu_class_name'] = repoArray[Number(keys)]['stu_class_name'] + '-' +
													repoArray[Number(keys)]['stu_sec_name'];
											} else {
												obj['stu_class_name'] = repoArray[Number(keys)]['stu_class_name'];
											}
											obj['receipt_id'] = repoArray[Number(keys)]['invoice_id'] ?
												repoArray[Number(keys)]['invoice_id'] : '-';
											obj['invoice_created_date'] = repoArray[Number(keys)]['invoice_created_date'];
											obj['fp_name'] = repoArray[Number(keys)]['fp_name'] ?
												repoArray[Number(keys)]['fp_name'] : '-';
											obj['receipt_no'] = repoArray[Number(keys)]['invoice_no'] ?
												repoArray[Number(keys)]['invoice_no'] : '-';
											for(var fi=0; fi<stuFeeHeadArray.length;fi++) {												
												if( ( stuFeeHeadArray[fi]['fh_name'] == titem['fh_name']) &&  (stuFeeHeadArray[fi]['fh_prefix'] == repoArray[Number(keys)]['school_prefix'])) {
													obj[key2 + k] = stuFeeHeadArray[fi]['fh_amt'] ? Number(stuFeeHeadArray[fi]['fh_amt']) : 0;
													tot = tot + (stuFeeHeadArray[fi]['fh_amt'] ? Number(stuFeeHeadArray[fi]['fh_amt']) : 0);
													console.log(key2 + k,'titem--',titem['fh_name'],titem['fh_amt'],stuFeeHeadArray, repoArray[Number(keys)]['school_prefix'], repoArray[Number(keys)]['stu_full_name']);
													break;
													
												} 
											}
											// obj[key2 + k] = titem['fh_amt'] ? Number(titem['fh_amt']) : 0;
											// tot = tot + (titem['fh_amt'] ? Number(titem['fh_amt']) : 0);
											obj['inv_opening_balance'] = repoArray[Number(keys)]['inv_opening_balance']
												? Number(repoArray[Number(keys)]['inv_opening_balance']) : 0;
											obj['invoice_fine_amount'] = repoArray[Number(keys)]['invoice_fine_amount']
												? Number(repoArray[Number(keys)]['invoice_fine_amount']) : 0;
											obj['total'] = repoArray[Number(keys)]['invoice_amount']
												? Number(repoArray[Number(keys)]['invoice_amount']) : 0;
											k++;
										}
									});
								}
							}
							i++;
							this.dataset.push(obj);
						});
						this.columnDefinitions.push(
							{
								id: 'invoice_fine_amount', name: 'Fine Amount', field: 'invoice_fine_amount',
								filterable: true,
								filterSearchType: FieldType.number,
								filter: { model: Filters.compoundInputNumber },
								sortable: true,
								type:FieldType.number,
								formatter: this.checkFeeFormatter,
								groupTotalsFormatter: this.sumTotalsFormatter
							},
							{
								id: 'total', name: 'Total', field: 'total',
								filterable: true,
								filterSearchType: FieldType.number,
								filter: { model: Filters.compoundInputNumber },
								sortable: true,
								type:FieldType.number,
								formatter: this.checkTotalFormatter,
								cssClass: 'amount-report-fee',
								groupTotalsFormatter: this.sumTotalsFormatter
							},
						);
						if (this.columnDefinitions.length > 18) {
							this.gridOptions.defaultColumnWidth =100;
							this.gridOptions.forceFitColumns=false;
							this.gridOptions.enableAutoResize=false;
							this.gridOptions.autoFitColumnsOnFirstLoad=false;
						}
						this.aggregatearray.push(new Aggregators.Sum('inv_opening_balance'));
						this.aggregatearray.push(new Aggregators.Sum('inv_prev_balance'));
						this.aggregatearray.push(new Aggregators.Sum('invoice_fine_amount'));
						this.aggregatearray.push(new Aggregators.Sum('total'));
						this.aggregatearray.push(new Aggregators.Sum('srno'));
						console.log(this.columnDefinitions);
						console.log(this.dataset);
						this.totalRow = {};
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['stu_admission_no'] = this.common.htmlToText('<b>Grand Total</b>');
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['inv_opening_balance'] =
							new DecimalPipe('en-in').transform(this.dataset.map(t => t.inv_opening_balance).reduce((acc, val) => acc + val, 0));
						Object.keys(feeHead).forEach((key: any) => {
							Object.keys(feeHead[key]).forEach(key2 => {
								Object.keys(this.dataset).forEach(key3 => {
									Object.keys(this.dataset[key3]).forEach(key4 => {
										if (key4 === key2) {
											obj3[key4] = new DecimalPipe('en-in').transform(this.dataset.map(t => t[key4]).reduce((acc, val) => acc + val, 0));
										}
									});
								});
							});
						});
						obj3['invoice_fine_amount'] =
							new DecimalPipe('en-in').transform(this.dataset.map(t => t.invoice_fine_amount).reduce((acc, val) => acc + val, 0));
						obj3['total'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t.total).reduce((acc, val) => acc + val, 0));
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
			} else if (this.reportType === 'headwisedetail') {
				this.gridOptions.rowHeight=65;
				const collectionJSON: any = {
					'admission_no': '',
					'studentName': '',
					'report_type': value.report_type,
					'feeHeadId': value.fee_value,
					// 'from_date': value.from_date,
					'to_date': value.to_date,
					'pageSize': '10',
					'pageIndex': '0',
					'filterReportBy': 'outstanding',
					'login_id': value.login_id,
					'orderBy': value.orderBy,
					'downloadAll': true,
					'school_branch': this.reportFilterForm.value.school_branch
				};
				this.feeService.geOutStandingHeadWiseCollection(collectionJSON).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.common.showSuccessErrorMessage('Report Data Fetched Successfully', 'success');
						repoArray = result.data.reportData;
						this.totalRecords = Number(result.data.totalRecords);
						var branchArray = this.reportFilterForm.value.school_branch;
						let stuFeeHeadArray = [];						
						var tempHeadArray= [];
						var schoolArray = [];
						var commonHeadsArray = [];
						var tempCommonHeadsArray = [];
						
						for (var bi=0; bi<repoArray.length;bi++) {
							
							if (branchArray.indexOf(repoArray[bi]['school_prefix']) > -1 
								&& ((schoolArray.indexOf(repoArray[bi]['school_prefix']) ) == -1)) {
								
								schoolArray.push(repoArray[bi]['school_prefix']);
								for (var ji=0; ji< repoArray[bi]['fee_head_data'].length;ji++) {
									repoArray[bi]['fee_head_data'][ji]['fh_prefix'] = repoArray[bi]['school_prefix'];
									tempHeadArray.push(repoArray[bi]['fee_head_data'][ji]);
								}
								
							}
						}

						for(var ti=0; ti<tempHeadArray.length;ti++) {
							if(tempCommonHeadsArray.indexOf(tempHeadArray[ti]['fh_name']) == -1) {
								tempCommonHeadsArray.push(tempHeadArray[ti]['fh_name']);
								commonHeadsArray.push(tempHeadArray[ti]);
							}
						}
						localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
						let i = 0;
						let j = 0;
						const feeHead: any[] = [];
						Object.keys(repoArray).forEach((keys: any) => {
							const obj: any = {};
							if (Number(keys) === 0) {
								this.columnDefinitions = [
									{
										id: 'srno',
										name: 'SNo.',
										field: 'srno',
										sortable: true,
										width: 2
									},
									{
										id: 'stu_admission_no',
										name: 'Enrollment No.',
										field: 'stu_admission_no',
										filterable: true,
										filterSearchType: FieldType.string,
										filter: { model: Filters.compoundInputText },
										sortable: true,
										width: 90,
										grouping: {
											getter: 'stu_admission_no',
											formatter: (g) => {
												return `${g.value} <span style="color:green"> (${g.count})</span>`;
											},
											aggregators: this.aggregatearray,
											aggregateCollapsed: true,
											collapsed: false
										},
									},
									{
										id: 'stu_full_name',
										name: 'Student Name',
										field: 'stu_full_name',
										filterable: true,
										sortable: true,
										width: 180,
										filterSearchType: FieldType.string,
										filter: { model: Filters.compoundInputText },
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
										id: 'stu_class_name',
										name: 'Class-Section',
										field: 'stu_class_name',
										sortable: true,
										filterable: true,
										width: 60,
										filterSearchType: FieldType.string,
										filter: { model: Filters.compoundInputText },
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
										id: 'tag_name',
										name: 'Tag',
										field: 'tag_name',
										sortable: true,
										filterable: true,
										width: 60,
										filterSearchType: FieldType.string,
										filter: { model: Filters.compoundInputText },
										grouping: {
											getter: 'tag_name',
											formatter: (g) => {
												return `${g.value}  <span style="color:green">(${g.count})</span>`;
											},
											aggregators: this.aggregatearray,
											aggregateCollapsed: true,
											collapsed: false,
										},
									},
									{
										id: 'invoice_created_date', name: 'Invoice. Date', field: 'invoice_created_date',
										sortable: true,
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
										id: 'fp_name',
										name: 'Fee Period',
										field: 'fp_name',
										sortable: true,
										filterable: true,
										width: 100,
										filterSearchType: FieldType.string,
										filter: { model: Filters.compoundInputText },
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
										name: 'Invoice No.',
										field: 'receipt_no',
										sortable: true,
										width: 70,
										filterable: true,
										filterSearchType: FieldType.number,
										filter: { model: Filters.compoundInputNumber },
										formatter: this.checkReceiptFormatter,
										cssClass: 'receipt_collection_report'
									},
									{
										id: 'inv_opening_balance', name: 'Previous Balance', field: 'inv_opening_balance',
										filterable: true,
										cssClass: 'amount-report-fee',
										filterSearchType: FieldType.number,
										filter: { model: Filters.compoundInputNumber },
										sortable: true,
										type:FieldType.number,
										formatter: this.checkFeeFormatter,
										groupTotalsFormatter: this.sumTotalsFormatter
									}];
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
										this.columnDefinitions.splice(1, 0, aColumn);
										
									}
							}
							if (repoArray[Number(keys)]['fee_head_data']) {
								let k = 0;
								let tot = 0;
								stuFeeHeadArray = [];
								for(let fij=0; fij < repoArray[Number(keys)]['fee_head_data'].length;fij++) {
									repoArray[Number(keys)]['fee_head_data'][fij]['fh_prefix'] = repoArray[Number(keys)]['school_prefix'];
									stuFeeHeadArray.push(repoArray[Number(keys)]['fee_head_data'][fij]);
									
								}
								for (const titem of commonHeadsArray) {
									Object.keys(titem).forEach((key2: any) => {
										if (key2 === 'fh_name' && Number(keys) === 0) {
											const feeObj: any = {};
											this.columnDefinitions.push({
												id: 'fh_name' + j,
												name: new CapitalizePipe().transform(titem[key2]),
												field: 'fh_name' + j,
												cssClass: 'amount-report-fee',
												sortable: true,
												filterable: true,
												filterSearchType: FieldType.number,
												type:FieldType.number,
												filter: { model: Filters.compoundInput },
												formatter: this.checkFeeFormatter,
												groupTotalsFormatter: this.sumTotalsFormatter
											});
											feeObj['fh_name' + j] = '';
											feeHead.push(feeObj);
											this.aggregatearray.push(new Aggregators.Sum('fh_name' + j));
											j++;
										}
										if (key2 === 'fh_name') {
											obj['id'] = repoArray[Number(keys)]['stu_admission_no'] + keys +
												repoArray[Number(keys)]['rpt_id'];
											obj['srno'] = (collectionJSON.pageSize * collectionJSON.pageIndex) +
												(Number(keys) + 1);
											obj['stu_admission_no'] = repoArray[Number(keys)]['stu_admission_no'] ?
												repoArray[Number(keys)]['stu_admission_no'] : '-';
											obj['school_prefix'] = repoArray[Number(keys)]['school_prefix'] ?
												repoArray[Number(keys)]['school_prefix'] : '-';
											obj['login_id'] = repoArray[Number(keys)]['login_id'] ?
												repoArray[Number(keys)]['login_id'] : '-';
											obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(keys)]['stu_full_name']);
											obj['tag_name'] = repoArray[Number(keys)]['tag_name'] ? new CapitalizePipe().transform(repoArray[Number(keys)]['tag_name']) : '-';
											if (repoArray[Number(keys)]['stu_sec_id'] !== '0') {
												obj['stu_class_name'] = repoArray[Number(keys)]['stu_class_name'] + '-' +
													repoArray[Number(keys)]['stu_sec_name'];
											} else {
												obj['stu_class_name'] = repoArray[Number(keys)]['stu_class_name'];
											}
											obj['receipt_id'] = repoArray[Number(keys)]['invoice_id'] ?
												repoArray[Number(keys)]['invoice_id'] : '-';
											obj['invoice_created_date'] = repoArray[Number(keys)]['invoice_created_date'];
											obj['fp_name'] = repoArray[Number(keys)]['fp_name'] ?
												repoArray[Number(keys)]['fp_name'] : '-';
											obj['receipt_no'] = repoArray[Number(keys)]['invoice_no'] ?
												repoArray[Number(keys)]['invoice_no'] : '-';
											// obj[key2 + k] = titem['fh_amt'] ? Number(titem['fh_amt']) : 0;
											// tot = tot + (titem['fh_amt'] ? Number(titem['fh_amt']) : 0);
											for(var fi=0; fi<stuFeeHeadArray.length;fi++) {												
												if( ( stuFeeHeadArray[fi]['fh_name'] == titem['fh_name']) &&  (stuFeeHeadArray[fi]['fh_prefix'] == repoArray[Number(keys)]['school_prefix'])) {
													obj[key2 + k] = stuFeeHeadArray[fi]['fh_amt'] ? Number(stuFeeHeadArray[fi]['fh_amt']) : 0;
													tot = tot + (stuFeeHeadArray[fi]['fh_amt'] ? Number(stuFeeHeadArray[fi]['fh_amt']) : 0);
													console.log(key2 + k,'titem--',titem['fh_name'],titem['fh_amt'],stuFeeHeadArray, repoArray[Number(keys)]['school_prefix'], repoArray[Number(keys)]['stu_full_name']);
													break;
													
												} 
											}
											obj['inv_opening_balance'] = repoArray[Number(keys)]['inv_opening_balance']
												? Number(repoArray[Number(keys)]['inv_opening_balance']) : 0;
											obj['invoice_fine_amount'] = repoArray[Number(keys)]['invoice_fine_amount']
												? Number(repoArray[Number(keys)]['invoice_fine_amount']) : 0;
											obj['total'] = repoArray[Number(keys)]['invoice_amount']
												? Number(repoArray[Number(keys)]['invoice_amount']) : 0;
											k++;
										}
									});
								}
							}
							i++;
							this.dataset.push(obj);
						});
						this.columnDefinitions.push(
							{
								id: 'invoice_fine_amount', name: 'Fine Amount', field: 'invoice_fine_amount',
								filterable: true,
								filterSearchType: FieldType.number,
								filter: { model: Filters.compoundInputNumber },
								sortable: true,
								type:FieldType.number,
								formatter: this.checkFeeFormatter,
								groupTotalsFormatter: this.sumTotalsFormatter
							},
							{
								id: 'total', name: 'Total', field: 'total',
								filterable: true,
								filterSearchType: FieldType.number,
								filter: { model: Filters.compoundInputNumber },
								sortable: true,
								type:FieldType.number,
								formatter: this.checkTotalFormatter,
								cssClass: 'amount-report-fee',
								groupTotalsFormatter: this.sumTotalsFormatter
							},
						);
						if (this.columnDefinitions.length > 18) {
							this.gridOptions.defaultColumnWidth =100;
							this.gridOptions.forceFitColumns=false;
							this.gridOptions.enableAutoResize=false;
							this.gridOptions.autoFitColumnsOnFirstLoad=false;
						}
						this.aggregatearray.push(new Aggregators.Sum('inv_opening_balance'));
						this.aggregatearray.push(new Aggregators.Sum('inv_prev_balance'));
						this.aggregatearray.push(new Aggregators.Sum('invoice_fine_amount'));
						this.aggregatearray.push(new Aggregators.Sum('total'));
						this.aggregatearray.push(new Aggregators.Sum('srno'));
						console.log(this.columnDefinitions);
						console.log(this.dataset);
						this.totalRow = {};
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.common.htmlToText('<b>Grand Total</b>');
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_id'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['inv_opening_balance'] =
							new DecimalPipe('en-in').transform(this.dataset.map(t => t.inv_opening_balance).reduce((acc, val) => acc + val, 0));
						obj3['invoice_fine_amount'] =
							new DecimalPipe('en-in').transform(this.dataset.map(t => t.invoice_fine_amount).reduce((acc, val) => acc + val, 0));
						Object.keys(feeHead).forEach((key: any) => {
							Object.keys(feeHead[key]).forEach(key2 => {
								Object.keys(this.dataset).forEach(key3 => {
									Object.keys(this.dataset[key3]).forEach(key4 => {
										if (key4 === key2) {
											obj3[key4] = new DecimalPipe('en-in').transform(this.dataset.map(t => t[key4]).reduce((acc, val) => acc + val, 0));
										}
									});
								});
							});
						});
						obj3['total'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t.total).reduce((acc, val) => acc + val, 0));
						obj3['receipt_mode_name'] = '';
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
			} else if (this.reportType === 'classwise') {
				const collectionJSON: any = {
					'admission_no': '',
					'studentName': '',
					'report_type': value.report_type,
					'classId': value.fee_value,
					'from_date': value.from_date,
					'to_date': value.to_date,
					'pageSize': '10',
					'pageIndex': '0',
					'filterReportBy': 'outstanding',
					'login_id': value.login_id,
					'orderBy': value.orderBy,
					'downloadAll': true,
					'school_branch': this.reportFilterForm.value.school_branch
				};
				this.columnDefinitions = [
					{
						id: 'srno',
						name: 'SNo.',
						field: 'srno',
						sortable: true,
						width: 2,
						maxWidth: 40,
					},
					{
						id: 'stu_admission_no', name: 'Enrollment No', field: 'stu_admission_no',
						sortable: true,
						grouping: {
							getter: 'stu_admission_no',
							formatter: (g) => {
								return `${g.value} <span style="color:green"> (${g.count})</span>`;
							},
							aggregators: this.aggregatearray,
							aggregateCollapsed: true,
							collapsed: false
						},
						filterable: true,
						width: 20,
						filterSearchType: FieldType.string,
						filter: { model: Filters.compoundInput },
					},
					{
						id: 'stu_full_name', name: 'Student Name', field: 'stu_full_name', sortable: true,
						filterable: true,
						width: 90,
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
						width: 15,
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
						id: 'tag_name', name: 'Tag', field: 'tag_name', sortable: true,
						filterable: true,
						width: 15,
						filterSearchType: FieldType.string,
						filter: { model: Filters.compoundInput },
						grouping: {
							getter: 'tag_name',
							formatter: (g) => {
								return `${g.value}  <span style="color:green">(${g.count})</span>`;
							},
							aggregators: this.aggregatearray,
							aggregateCollapsed: true,
							collapsed: false,
						},
					},
					{
						id: 'invoice_created_date', name: 'Invoice Date', field: 'invoice_created_date', sortable: true,
						filterable: true,
						width: 30,
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
						id: 'fp_name',
						name: 'Fee Period',
						field: 'fp_name',
						sortable: true,
						width: 30,
						filterable: true,
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
						name: 'Invoice No.',
						field: 'receipt_no',
						width: 15,
						sortable: true,
						filterable: true,
						filterSearchType: FieldType.number,
						filter: { model: Filters.compoundInputNumber },
						formatter: this.checkReceiptFormatter,
						cssClass: 'receipt_collection_report'
					},
					{
						id: 'rpt_amount',
						name: 'Invoice Amt.',
						field: 'rpt_amount',
						sortable: true,
						width: 20,
						cssClass: 'amount-report-fee',
						filterable: true,
						filterSearchType: FieldType.number,
						filter: { model: Filters.compoundInputNumber },
						type:FieldType.number,
						formatter: this.checkFeeFormatter,
						groupTotalsFormatter: this.sumTotalsFormatter
					}];
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
						this.columnDefinitions.splice(1, 0, aColumn);
						
					}
				this.feeService.geOutStandingHeadWiseCollection(collectionJSON).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.common.showSuccessErrorMessage('Report Data Fetched Successfully', 'success');
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
							obj['school_prefix'] = repoArray[Number(index)]['school_prefix'] ?
								repoArray[Number(index)]['school_prefix'] : '-';
							obj['stu_admission_no'] = repoArray[Number(index)]['stu_admission_no'] ?
								repoArray[Number(index)]['stu_admission_no'] : '-';
							obj['login_id'] = repoArray[Number(index)]['login_id'] ?
								repoArray[Number(index)]['login_id'] : '-';
							obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(index)]['stu_full_name']);
							obj['tag_name'] = repoArray[Number(index)]['tag_name'] ? new CapitalizePipe().transform(repoArray[Number(index)]['tag_name']) : '-';
							if (repoArray[Number(index)]['stu_sec_id'] !== '0') {
								obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'] + '-' +
									repoArray[Number(index)]['stu_sec_name'];
							} else {
								obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'];
							}
							obj['receipt_id'] = repoArray[Number(index)]['invoice_id'] ?
								repoArray[Number(index)]['invoice_id'] : '-';
							obj['invoice_created_date'] = repoArray[Number(index)]['invoice_created_date'];
							obj['fp_name'] = repoArray[Number(index)]['fp_name'] ?
								repoArray[Number(index)]['fp_name'] : '-';
							obj['receipt_no'] = repoArray[Number(index)]['invoice_no'] ?
								repoArray[Number(index)]['invoice_no'] : '-';
							obj['rpt_amount'] = repoArray[Number(index)]['invoice_amount'] ?
								Number(repoArray[Number(index)]['invoice_amount']) : 0;
							this.dataset.push(obj);
							index++;
						}
						this.totalRow = {};
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = '';
						obj3['stu_admission_no'] = this.common.htmlToText('<b>Grand Total</b>');
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_no'] = '';
						obj3['rpt_amount'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t['rpt_amount']).reduce((acc, val) => acc + val, 0));
						obj3['fp_name'] = '';
						this.totalRow = obj3;
						this.aggregatearray.push(new Aggregators.Sum('rpt_amount'));
						this.aggregatearray.push(new Aggregators.Sum('srno'));
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
			} else if (this.reportType === 'routewise') {
				const collectionJSON: any = {
					'admission_no': '',
					'studentName': '',
					'report_type': value.report_type,
					'routeId': value.fee_value,
					// 'from_date': value.from_date,
					'to_date': value.to_date,
					'pageSize': '10',
					'pageIndex': '0',
					'filterReportBy': 'outstanding',
					'login_id': value.login_id,
					'orderBy': value.orderBy,
					'downloadAll': true,
					'school_branch': this.reportFilterForm.value.school_branch
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
						groupTotalsFormatter: this.srnTotalsFormatter
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
						id: 'tag_name', name: 'Tag', field: 'tag_name', sortable: true,
						filterable: true,
						width: 60,
						filterSearchType: FieldType.string,
						filter: { model: Filters.compoundInput },
						grouping: {
							getter: 'tag_name',
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
						type:FieldType.number,
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
					this.columnDefinitions.splice(1, 0, aColumn);
					
				}
				this.feeService.geOutStandingHeadWiseCollection(collectionJSON).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.common.showSuccessErrorMessage('Report Data Fetched Successfully', 'success');
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
							obj['school_prefix'] = repoArray[Number(index)]['school_prefix'] ?
								repoArray[Number(index)]['school_prefix'] : '-';
							obj['login_id'] = repoArray[Number(index)]['login_id'] ?
								repoArray[Number(index)]['login_id'] : '-';
							obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(index)]['stu_full_name']);
							obj['tag_name'] = repoArray[Number(index)]['tag_name'] ? new CapitalizePipe().transform(repoArray[Number(index)]['tag_name']) : '-';

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
						this.tableFlag = true;
					} else {
						this.tableFlag = true;
					}
				});
			} else if (this.reportType === 'defaulter' && value.to_date) {
				const collectionJSON: any = {
					'admission_no': '',
					'studentName': '',
					'report_type': this.reportType,
					'classId': value.fee_value,
					'to_date': value.to_date,
					'pageSize': '10',
					'pageIndex': '0',
					'filterReportBy': 'outstanding',
					'login_id': value.login_id,
					'orderBy': value.orderBy,
					'downloadAll': true,
					'school_branch': this.reportFilterForm.value.school_branch
				};
				this.columnDefinitions = [
					{
						id: 'srno',
						name: 'SNo.',
						field: 'srno',
						sortable: true,
						width: 2
					},
					{
						id: 'stu_admission_no', name: 'Enrollment No', field: 'stu_admission_no', filterable: true,
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
						sortable: true,
						groupTotalsFormatter: this.srnTotalsFormatter
					},
					{
						id: 'stu_full_name', name: 'Student Name', field: 'stu_full_name', filterable: true,
						width: 180,
						filterSearchType: FieldType.string,
						filter: { model: Filters.compoundInput },
						sortable: true,
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
						id: 'stu_class_name', name: 'Class-Section', field: 'stu_class_name', filterable: true,
						filterSearchType: FieldType.string,
						width: 50,
						filter: { model: Filters.compoundInput },
						sortable: true,
						grouping: {
							getter: 'stu_class_name',
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
						id: 'tag_name', name: 'Tag', field: 'tag_name', filterable: true,
						filterSearchType: FieldType.string,
						width: 50,
						filter: { model: Filters.compoundInput },
						sortable: true,
						grouping: {
							getter: 'tag_name',
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
						id: 'rpt_amount',
						name: 'Amount Due',
						field: 'rpt_amount',
						width: 50,
						filterable: true,
						cssClass: 'amount-report-fee',
						filterSearchType: FieldType.number,
						type:FieldType.number,
						filter: { model: Filters.compoundInputNumber },
						sortable: true,
						formatter: this.checkFeeFormatter,
						groupTotalsFormatter: this.sumTotalsFormatter
					},
					{
						id: 'fp_name',
						name: 'Fee Period',
						width: 120,
						field: 'fp_name',
						filterable: true,
						filterSearchType: FieldType.string,
						filter: { model: Filters.compoundInput },
						sortable: true,
						grouping: {
							getter: 'fp_name',
							formatter: (g) => {
								return `${g.value}  <span style="color:green">(${g.count})</span>`;
							},
							aggregators: this.aggregatearray,
							aggregateCollapsed: true,
							collapsed: false,
						},
				}];
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
					this.columnDefinitions.splice(1, 0, aColumn);
					
				}
				this.feeService.getDefaulterList(collectionJSON).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.common.showSuccessErrorMessage('Report Data Fetched Successfully', 'success');
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
							obj['login_id'] = repoArray[Number(index)]['login_id'] ?
								repoArray[Number(index)]['login_id'] : '-';
							obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(index)]['stu_full_name']);
							obj['school_prefix'] = repoArray[Number(index)]['school_prefix'] ?
												repoArray[Number(index)]['school_prefix'] : '-';
							obj['tag_name'] = repoArray[Number(index)]['tag_name'] ? new CapitalizePipe().transform(repoArray[Number(index)]['tag_name']) : '-';

							if (repoArray[Number(index)]['stu_sec_id'] !== '0') {
								obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'] + '-' +
									repoArray[Number(index)]['stu_sec_name'];
							} else {
								obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'];
							}
							obj['rpt_amount'] = repoArray[Number(index)]['defaulter_inv_group_amount'] ?
								Number(repoArray[Number(index)]['defaulter_inv_group_amount']) : 0;
							obj['fp_name'] = repoArray[Number(index)]['fp_name'] ?
								repoArray[Number(index)]['fp_name'] : '-';
							this.dataset.push(obj);
							index++;
						}
						this.totalRow = {};
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['stu_admission_no'] = this.common.htmlToText('<b>Grand Total</b>');
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['rpt_amount'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t['rpt_amount']).reduce((acc, val) => acc + val, 0));
						obj3['fp_name'] = '';
						this.totalRow = obj3;
						this.aggregatearray.push(new Aggregators.Sum('rpt_amount'));
						this.aggregatearray.push(new Aggregators.Sum('srno'));
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
						this.tableFlag = true;
					}
				});
			} else if (this.reportType === 'feedue') {
				value.from_date = new DatePipe('en-in').transform(value.from_date, 'yyyy-MM-dd');
				const collectionJSON: any = {
					'admission_no': '',
					'studentName': '',
					'report_type': value.report_type,
					'feeHeadId': value.fee_value,
					// 'from_date': value.from_date,
					// 'to_date': value.to_date,
					'month_id': this.reportFilterForm.value.month_id,
					'pageSize': '10',
					'pageIndex': '0',
					'filterReportBy': 'outstanding',
					'login_id': value.login_id,
					'orderBy': value.orderBy,
					'downloadAll': true,
					'school_branch': this.reportFilterForm.value.school_branch
				};

				if (!(this.reportFilterForm.value.month_id)) {
					this.common.showSuccessErrorMessage('Please Choose a Month', 'error');
				} else {
					this.feeService.geOutStandingHeadWiseCollection(collectionJSON).subscribe((result: any) => {
						if (result && result.status === 'ok') {
							this.common.showSuccessErrorMessage('Report Data Fetched Successfully', 'success');
							repoArray = result.data.reportData;
							this.totalRecords = Number(result.data.totalRecords);
							localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
							let i = 0;
							let j = 0;
							const feeHead: any[] = [];
							var branchArray = this.reportFilterForm.value.school_branch;
							let stuFeeHeadArray = [];						
							var tempHeadArray= [];
							var schoolArray = [];
							var commonHeadsArray = [];
							var tempCommonHeadsArray = [];
						
						for (var bi=0; bi<repoArray.length;bi++) {
							
							if (branchArray.indexOf(repoArray[bi]['school_prefix']) > -1 
								&& ((schoolArray.indexOf(repoArray[bi]['school_prefix']) ) == -1)) {
								
								schoolArray.push(repoArray[bi]['school_prefix']);
								for (var ji=0; ji< repoArray[bi]['fee_head_data'].length;ji++) {
									repoArray[bi]['fee_head_data'][ji]['fh_prefix'] = repoArray[bi]['school_prefix'];
									tempHeadArray.push(repoArray[bi]['fee_head_data'][ji]);
								}
								
							}
						}

						for(var ti=0; ti<tempHeadArray.length;ti++) {
							if(tempCommonHeadsArray.indexOf(tempHeadArray[ti]['fh_name']) == -1) {
								tempCommonHeadsArray.push(tempHeadArray[ti]['fh_name']);
								commonHeadsArray.push(tempHeadArray[ti]);
							}
						}
							Object.keys(repoArray).forEach((keys: any) => {
								const obj: any = {};
								if (Number(keys) === 0) {
									this.columnDefinitions = [
										{
											id: 'srno',
											name: 'SNo.',
											field: 'srno',
											sortable: true,
											width: 2
										},
										{
											id: 'stu_admission_no',
											name: 'Enrollment No.',
											field: 'stu_admission_no',
											filterable: true,
											filterSearchType: FieldType.string,
											filter: { model: Filters.compoundInputText },
											sortable: true,
											width: 90,
											grouping: {
												getter: 'stu_admission_no',
												formatter: (g) => {
													return `${g.value} <span style="color:green"> (${g.count})</span>`;
												},
												aggregators: this.aggregatearray,
												aggregateCollapsed: true,
												collapsed: false
											},
										},
										{
											id: 'stu_full_name',
											name: 'Student Name',
											field: 'stu_full_name',
											filterable: true,
											sortable: true,
											width: 180,
											filterSearchType: FieldType.string,
											filter: { model: Filters.compoundInputText },
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
											id: 'stu_class_name',
											name: 'Class-Section',
											field: 'stu_class_name',
											sortable: true,
											filterable: true,
											width: 60,
											filterSearchType: FieldType.string,
											filter: { model: Filters.compoundInputText },
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
											id: 'tag_name',
											name: 'Tag',
											field: 'tag_name',
											sortable: true,
											filterable: true,
											width: 60,
											filterSearchType: FieldType.string,
											filter: { model: Filters.compoundInputText },
											grouping: {
												getter: 'tag_name',
												formatter: (g) => {
													return `${g.value}  <span style="color:green">(${g.count})</span>`;
												},
												aggregators: this.aggregatearray,
												aggregateCollapsed: true,
												collapsed: false,
											},
										},
										{
											id: 'invoice_created_date', name: 'Invoice. Date', field: 'invoice_created_date',
											sortable: true,
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
											id: 'fp_name',
											name: 'Fee Period',
											field: 'fp_name',
											sortable: true,
											filterable: true,
											width: 100,
											filterSearchType: FieldType.string,
											filter: { model: Filters.compoundInputText },
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
											id: 'invoice_due_date', name: 'Invoice Due Date', field: 'invoice_due_date',
											sortable: true,
											filterable: true,
											width: 120,
											formatter: this.checkDateFormatter,
											filterSearchType: FieldType.dateIso,
											filter: { model: Filters.compoundDate },
											grouping: {
												getter: 'invoice_due_date',
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
										// {
										// 	id: 'inv_opening_balance', name: 'Previous Balance', field: 'inv_opening_balance',
										// 	filterable: true,
										// 	cssClass: 'amount-report-fee',
										// 	filterSearchType: FieldType.number,
										// 	filter: { model: Filters.compoundInputNumber },
										// 	sortable: true,
										// 	formatter: this.checkFeeFormatter,
										// 	groupTotalsFormatter: this.sumTotalsFormatter
										// }
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
										this.columnDefinitions.splice(1, 0, aColumn);
										
									}
								}
								if (repoArray[Number(keys)] && repoArray[Number(keys)]['fee_head_data']) {
									let k = 0;
									let tot = 0;
									stuFeeHeadArray = [];
								for(let fij=0; fij < repoArray[Number(keys)]['fee_head_data'].length;fij++) {
									repoArray[Number(keys)]['fee_head_data'][fij]['fh_prefix'] = repoArray[Number(keys)]['school_prefix'];
									stuFeeHeadArray.push(repoArray[Number(keys)]['fee_head_data'][fij]);
									
								}
									for (const titem of commonHeadsArray) {
										Object.keys(titem).forEach((key2: any) => {
											if (key2 === 'fh_name' && Number(keys) === 0) {
												const feeObj: any = {};
												this.columnDefinitions.push({
													id: 'fh_name' + j,
													name: new CapitalizePipe().transform(titem[key2]),
													field: 'fh_name' + j,
													cssClass: 'amount-report-fee',
													sortable: true,
													filterable: true,
													filterSearchType: FieldType.number,
													type:FieldType.number,
													filter: { model: Filters.compoundInput },
													formatter: this.checkFeeFormatter,
													groupTotalsFormatter: this.sumTotalsFormatter
												});
												feeObj['fh_name' + j] = '';
												feeHead.push(feeObj);
												this.aggregatearray.push(new Aggregators.Sum('fh_name' + j));
												j++;
											}
											if (key2 === 'fh_name') {
												obj['id'] = repoArray[Number(keys)]['stu_admission_no'] + keys +
													repoArray[Number(keys)]['rpt_id'];
												obj['srno'] = (collectionJSON.pageSize * collectionJSON.pageIndex) +
													(Number(keys) + 1);
												obj['stu_admission_no'] = repoArray[Number(keys)]['stu_admission_no'] ?
													repoArray[Number(keys)]['stu_admission_no'] : '-';
													obj['school_prefix'] = repoArray[Number(keys)]['school_prefix'] ?
													repoArray[Number(keys)]['school_prefix'] : '-';
												obj['login_id'] = repoArray[Number(keys)]['login_id'] ?
													repoArray[Number(keys)]['login_id'] : '-';
												obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(keys)]['stu_full_name']);
												obj['tag_name'] = repoArray[Number(keys)]['tag_name'] ? new CapitalizePipe().transform(repoArray[Number(keys)]['tag_name']) : '-';
												if (repoArray[Number(keys)]['stu_sec_id'] !== '0') {
													obj['stu_class_name'] = repoArray[Number(keys)]['stu_class_name'] + '-' +
														repoArray[Number(keys)]['stu_sec_name'];
												} else {
													obj['stu_class_name'] = repoArray[Number(keys)]['stu_class_name'];
												}
												obj['receipt_id'] = repoArray[Number(keys)]['invoice_id'] ?
													repoArray[Number(keys)]['invoice_id'] : '-';
												obj['invoice_created_date'] = repoArray[Number(keys)]['invoice_created_date'];
												obj['fp_name'] = repoArray[Number(keys)]['fp_name'] ?
													repoArray[Number(keys)]['fp_name'] : '-';
												obj['receipt_no'] = repoArray[Number(keys)]['invoice_no'] ?
													repoArray[Number(keys)]['invoice_no'] : '-';
												obj['invoice_due_date'] = repoArray[Number(keys)]['invoice_due_date'] ?
													repoArray[Number(keys)]['invoice_due_date'] : '-';

												// obj[key2 + k] = titem['fh_amt'] ? Number(titem['fh_amt']) : 0;
												// tot = tot + (titem['fh_amt'] ? Number(titem['fh_amt']) : 0);
												for(var fi=0; fi<stuFeeHeadArray.length;fi++) {												
													if( ( stuFeeHeadArray[fi]['fh_name'] == titem['fh_name']) &&  (stuFeeHeadArray[fi]['fh_prefix'] == repoArray[Number(keys)]['school_prefix'])) {
														obj[key2 + k] = stuFeeHeadArray[fi]['fh_amt'] ? Number(stuFeeHeadArray[fi]['fh_amt']) : 0;
														tot = tot + (stuFeeHeadArray[fi]['fh_amt'] ? Number(stuFeeHeadArray[fi]['fh_amt']) : 0);
														console.log(key2 + k,'titem--',titem['fh_name'],titem['fh_amt'],stuFeeHeadArray, repoArray[Number(keys)]['school_prefix'], repoArray[Number(keys)]['stu_full_name']);
														break;
														
													} 
												}
												obj['inv_opening_balance'] = repoArray[Number(keys)]['inv_opening_balance']
													? Number(repoArray[Number(keys)]['inv_opening_balance']) : 0;
												obj['invoice_fine_amount'] = repoArray[Number(keys)]['invoice_fine_amount']
													? Number(repoArray[Number(keys)]['invoice_fine_amount']) : 0;
												obj['total'] = repoArray[Number(keys)]['inv_due_total_amt']
													? Number(repoArray[Number(keys)]['inv_due_total_amt']) : 0;
												k++;
											}
										});
									}
								}
								i++;
								this.dataset.push(obj);
							});
							this.columnDefinitions.push(
								// {
								// 	id: 'invoice_fine_amount', name: 'Fine Amount', field: 'invoice_fine_amount',
								// 	filterable: true,
								// 	filterSearchType: FieldType.number,
								// 	filter: { model: Filters.compoundInputNumber },
								// 	sortable: true,
								// 	formatter: this.checkFeeFormatter,
								// 	groupTotalsFormatter: this.sumTotalsFormatter
								// },
								{
									id: 'total', name: 'Total', field: 'total',
									filterable: true,
									filterSearchType: FieldType.number,
									filter: { model: Filters.compoundInputNumber },
									type:FieldType.number,
									sortable: true,
									formatter: this.checkTotalFormatter,
									cssClass: 'amount-report-fee',
									groupTotalsFormatter: this.sumTotalsFormatter
								},
							);
							if (this.columnDefinitions.length > 18) {
								this.gridOptions.defaultColumnWidth =100;
								this.gridOptions.forceFitColumns=false;
								this.gridOptions.enableAutoResize=false;
								this.gridOptions.autoFitColumnsOnFirstLoad=false;
							}
							this.aggregatearray.push(new Aggregators.Sum('inv_opening_balance'));
							this.aggregatearray.push(new Aggregators.Sum('inv_prev_balance'));
							this.aggregatearray.push(new Aggregators.Sum('invoice_fine_amount'));
							this.aggregatearray.push(new Aggregators.Sum('total'));
							this.aggregatearray.push(new Aggregators.Sum('srno'));
							console.log(this.columnDefinitions);
							console.log(this.dataset);
							this.totalRow = {};
							const obj3: any = {};
							obj3['id'] = 'footer';
							obj3['srno'] = '';
							obj3['invoice_created_date'] = this.common.htmlToText('<b>Grand Total</b>');
							obj3['invoice_due_date'] = this.common.htmlToText('<b></b>');
							obj3['stu_admission_no'] = '';
							obj3['stu_full_name'] = '';
							obj3['stu_class_name'] = '';
							obj3['receipt_id'] = '';
							obj3['fp_name'] = '';
							obj3['receipt_no'] = '';
							obj3['inv_opening_balance'] =
								new DecimalPipe('en-in').transform(this.dataset.map(t => t.inv_opening_balance).reduce((acc, val) => acc + val, 0));
							obj3['invoice_fine_amount'] =
								new DecimalPipe('en-in').transform(this.dataset.map(t => t.invoice_fine_amount).reduce((acc, val) => acc + val, 0));
							Object.keys(feeHead).forEach((key: any) => {
								Object.keys(feeHead[key]).forEach(key2 => {
									Object.keys(this.dataset).forEach(key3 => {
										Object.keys(this.dataset[key3]).forEach(key4 => {
											if (key4 === key2) {
												obj3[key4] = new DecimalPipe('en-in').transform(this.dataset.map(t => t[key4]).reduce((acc, val) => acc + val, 0));
											}
										});
									});
								});
							});
							obj3['total'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t.total).reduce((acc, val) => acc + val, 0));
							obj3['receipt_mode_name'] = '';
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

			} else if (this.reportType === 'aging') {
				// this.gridOptions.rowHeight = 35;
				this.columnDefinitions = [
					{
						id: 'srno', name: 'SNo.', field: 'srno',
						sortable: true,
						width: 2
					},
					{
						id: 'class_name', name: 'Class Name', field: 'class_name', filterable: true,
						width: 60,
						filterSearchType: FieldType.string,
						filter: { model: Filters.compoundInput },
						sortable: true,
					},
					{
						id: 'ltm', name: 'Less Than Month', field: 'ltm', filterable: true,
						width: 60,
						filterSearchType: FieldType.number,
						type:FieldType.number,
						filter: { model: Filters.compoundInputNumber,  operator: OperatorType.greaterThan },
						sortable: true,
						formatter: this.checkCurrencyFormatter
					},
					{
						id: 'm13', name: '1-3 Month', field: 'm13', filterable: true,
						width: 60,
						filterSearchType: FieldType.number,
						type:FieldType.number,
						filter: { model: Filters.compoundInputNumber,  operator: OperatorType.greaterThan },
						sortable: true,
						formatter: this.checkCurrencyFormatter
					},
					{
						id: 'm3', name: 'More Than 3 Months', field: 'm3', filterable: true,
						width: 60,
						filterSearchType: FieldType.number,
						type:FieldType.number,
						filter: { model: Filters.compoundInputNumber,  operator: OperatorType.greaterThan },
						sortable: true,
						formatter: this.checkCurrencyFormatter
					},
					{
						id: 'total', name: 'Total', field: 'total', filterable: true,
						width: 60,
						filterSearchType: FieldType.number,
						type:FieldType.number,
						filter: { model: Filters.compoundInputNumber,  operator: OperatorType.greaterThan },
						sortable: true,
						formatter: this.checkCurrencyFormatter
					}
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
					this.columnDefinitions.splice(1, 0, aColumn);
					
				}
				this.feeService.getClassWiseMonthWiseSeperation({ projectionType: 'yearly','school_branch': this.reportFilterForm.value.school_branch  }).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.common.showSuccessErrorMessage('Report Data Fetched Successfully', 'success');
						repoArray = result.data;
						let index = 0;
						var total = 0;
						for (const item of repoArray) {
							const obj: any = {};
							obj['id'] = (this.reportFilterForm.value.pageSize * this.reportFilterForm.value.pageIndex) +
								(index + 1);
							obj['srno'] = (this.reportFilterForm.value.pageSize * this.reportFilterForm.value.pageIndex) +
								(index + 1);
							obj['school_prefix'] = item['school_prefix'];
							obj['class_name'] = item.class_name;
							obj['ltm'] = Number(item.resultData.ltm.total_fee_amount);
							obj['m13'] = Number(item.resultData.m13.total_fee_amount);
							obj['m3'] = Number(item.resultData.m3.total_fee_amount);
							total = Number(item.resultData.ltm.total_fee_amount) + Number(item.resultData.m13.total_fee_amount) + Number(item.resultData.m3.total_fee_amount);
							obj['total'] = total;
							this.dataset.push(obj);
							index++;
						}
						this.totalRow = {};
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['class_name'] = this.common.htmlToText('<b>Grand Total</b>');
						obj3['ltm'] = new IndianCurrency().transform(this.dataset.map(t => t['ltm']).reduce((acc, val) => acc + val, 0));
						obj3['m13'] = new IndianCurrency().transform(this.dataset.map(t => t['m13']).reduce((acc, val) => acc + val, 0));
						obj3['m3'] = new IndianCurrency().transform(this.dataset.map(t => t['m3']).reduce((acc, val) => acc + val, 0));
						obj3['total'] = new IndianCurrency().transform(this.dataset.map(t => t['total']).reduce((acc, val) => acc + val, 0));
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
			else {
				this.common.showSuccessErrorMessage('Please select date also', 'error');
			}
		} else {
			this.common.showSuccessErrorMessage('Please choose report type', 'error');
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
		if (args.cell === args.grid.getColumnIndex('checkbox_select')) {
			const index = this.rowsChosen.indexOf(args.row);
			if (index === -1) {
				this.rowsChosen.push(args.row);
			} else {
				this.rowsChosen.splice(index, 1);
			}
			const item = args.grid.getDataItem(args.row);
			const index2 = this.rowChosenData.findIndex(f => Number(f.login_id) === Number(item['login_id']));
			if (index2 === -1) {
				this.rowChosenData.push({
					login_id: Number(item['login_id']),
					data: item,
					index: args.row
				});
			} else {
				this.rowChosenData.splice(index2, 1);
			}
			console.log(this.rowChosenData);
		}
		if (args.cell === args.grid.getColumnIndex('receipt_no')) {
			const item: any = args.grid.getDataItem(args.row);
			if (item['receipt_no'] !== '-') {
				this.renderDialog(item['receipt_id'], false);
			}
		}
	}
	onSelectedRowsChanged(e, args) {
		if (args.rows.length === this.dataset.length) {
			this.rowChosenData = [];
			this.rowsChosen = args.rows;
			for (const item of this.rowsChosen) {
				this.rowChosenData.push({
					login_id: this.dataset[item].login_id,
					data: this.dataset[item],
					index: item
				});
			}
			this.gridObj.setSelectedRows(this.rowsChosen);
		} else if (args.rows.length === 0) {
			this.rowsChosen = [];
			this.rowChosenData = [];
			this.gridObj.setSelectedRows(this.rowsChosen);
		} else {
			this.gridObj.setSelectedRows(this.rowsChosen);
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
		if (value === '-') {
			return '-';
		} else {
			if (value){
				return '<a>' + value + '</a>';
			} else {
				return '-';
			}
			
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
	openDialogReceipt(invoiceNo, edit): void {
		const dialogRef = this.dialog.open(ReceiptDetailsModalComponent, {
			width: '80%',
			data: {
				invoiceNo: invoiceNo,
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
						name: new CapitalizePipe().transform(item.fh_name)
					});
				}
				this.valueArray.push({
					id: '0',
					name: 'Transport'
				});
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
			}
		});
		console.log('this.classDataArray',this.classDataArray)
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
	getReportName(value) {
		const findex = this.reportTypeArray.findIndex(f => f.report_type === value);
		if (findex !== -1) {
			return this.reportTypeArray[findex].report_name;
		}
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
		if (Number(this.sessionName.split('-')[0]) < Number(new Date().getFullYear())) {
			const date2 = new Date(Number(this.sessionName.split('-')[0]) + 1, Number(this.schoolInfo.session_end_month), 0);
			const firstDay2 = new Date(this.sessionName.split('-')[0], Number(this.schoolInfo.session_start_month) - 1, 1);
			this.reportFilterForm.patchValue({
				'from_date': firstDay2,
				'to_date': date2
			});
		} else {
			const date = new Date(this.sessionName.split('-')[0], new Date().getMonth(), new Date().getDate());
			const firstDay = new Date(this.sessionName.split('-')[0], new Date().getMonth(), 1);
			this.reportFilterForm.patchValue({
				'from_date': firstDay,
				'to_date': date
			});
		}
		if ($event.value) {
			this.displyRep.emit({ report_index: 2, report_id: $event.value, report_name: this.getReportName($event.value) });
			if ($event.value === 'headwise') {
				this.valueLabel = 'Fee Heads';
				if (this.reportFilterForm.value.school_branch.length > 1) {
					this.getMultiBranchFeeHeads();
				} else {
					this.getFeeHeads();
				}
				
			} else if ($event.value === 'headwisedetail') {
				this.valueLabel = 'Fee Heads';
				if (this.reportFilterForm.value.school_branch.length > 1) {
					this.getMultiBranchFeeHeads();
				} else {
					this.getFeeHeads();
				}
			} else if ($event.value === 'classwise') {
				this.valueLabel = 'Class';
				if (this.reportFilterForm.value.school_branch.length > 1) {
					this.getMultiBranchClass();
				} else {
					this.getClass();
				}
			} else if ($event.value === 'routewise') {
				this.valueLabel = 'Routes';
				if (this.reportFilterForm.value.school_branch.length > 1) {
					this.getMultiBranchRoutes();
				} else {
					this.getRoutes();
				}
			} else if ($event.value === 'defaulter') {
				this.valueLabel = 'Class';
				if (this.reportFilterForm.value.school_branch.length > 1) {
					this.getMultiBranchClass();
				} else {
					this.getClass();
				}
			} else if ($event.value === 'feedue') {
				this.valueLabel = 'Fee Dues';
				if (this.reportFilterForm.value.school_branch.length > 1) {
					this.getMultiBranchFeeHeads();
				} else {
					this.getFeeHeads();
				}
			} else if ($event.value === 'aging') {
				this.valueLabel = '';
			}
			this.filterFlag = true;
		} else {
			this.displyRep.emit({ report_index: 2, report_id: '', report_name: 'Outstanding Report' });
			this.filterFlag = false;
		}
	}
	getMultiBranchFeeHeads() {
		this.multiValueArray=[];
		let inputJson = {school_branch:this.reportFilterForm.value.school_branch};
		console.log('inputJson--',inputJson)
		this.feeService.getMultiBranchFeeHeads(inputJson).subscribe((result:any)=>{
			if(result && result.data) {
				this.multiBranchFeeHeads = result.data;
				let  groupJson = {};
				let temp_array=[];
				for (const item of result.data) {
					temp_array=[{
						id: '0',
						name: 'Transport'
					}];
					groupJson = {};
					for (const it of item.items) {						
						temp_array.push({
							id: it.fh_id,
							name: new CapitalizePipe().transform(it.fh_name)
						});
					}
					
					groupJson = {name: item.name, items : temp_array };
					this.multiValueArray.push(groupJson);
					
				}
				
			} else {
				this.multiBranchFeeHeads = [];
			}			
		});

	}

	getMultiBranchRoutes() {
		this.multiValueArray = [];
		let inputJson = {school_branch:this.reportFilterForm.value.school_branch};
		console.log('multi branch route json', inputJson)
		this.feeService.getMultiBranchRoutes(inputJson).subscribe((result:any)=>{
			if(result && result.data) {
				this.multiBranchRoutes = result.data;
				
				let  groupJson = {};
				let temp_array=[];
				for (const item of result.data) {
					temp_array=[];
					groupJson = {};
					for (const it of item.items) {						
						temp_array.push({
							id: it.tr_id,
							name: new CapitalizePipe().transform(it.tr_route_name)
						});
					}
					
					groupJson = {name: item.name, items : temp_array };
					this.multiValueArray.push(groupJson);
					
				}
			} else {
				this.multiBranchRoutes = [];
			}			
		});
	}
	getMultiBranchClass() {
		this.feeService.getMultiBranchClass({school_branch:this.reportFilterForm.value.school_branch}).subscribe((result:any)=>{
			if(result && result.data) {
				this.multiBranchClass = result.data;
				let  groupJson = {};
				let temp_array=[];
				for (const item of result.data) {
					temp_array=[];
					groupJson = {};
					for (const it of item.items) {						
						temp_array.push({
							id: it.class_id,
							name: new CapitalizePipe().transform(it.class_name)
						});
					}
					
					groupJson = {name: item.name, items : temp_array };
					this.multiValueArray.push(groupJson);
					
				}
				
			} else {
				this.multiBranchClass = [];
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
				console.log('this.schoolInfo 202', this.schoolInfo)
				this.schoolInfo['disable'] = true;
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
	groupByClass() {
		this.dataviewObj.setGrouping({
			getter: 'stu_class_name',
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
		this.draggableGroupingPlugin.setDroppedGroups('stu_class_name');
	}
	checkReturn(data) {
		if (Number(data)) {
			return Number(data);
		} else {
			return data;
		}
	}
	filtered(event) {
		let commonFilter: any = '';
		for (const item of event.source.selected) {
			commonFilter = commonFilter + item.viewValue + ',';
		}
		this.filteredAs[event.source.ngControl.name] = event.source._placeholder + ' - ' + commonFilter.substring(0, commonFilter.length - 1);
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
	exportToExcel(json: any[]) {
		this.notFormatedCellArray = [];
		let reportType: any = '';
		const columns: any[] = [];
		const columValue: any[] = [];
		this.exportColumnDefinitions = [];
		this.exportColumnDefinitions = this.angularGrid.slickGrid.getColumns();
		console.log('this.exportColumnDefinitions-->',this.exportColumnDefinitions)
		// for (const item of this.exportColumnDefinitions) {
		// 	if(!(item.id.includes('checkbox_select'))) {
		// 	columns.push({
		// 		key: item.id,
		// 		//width: this.checkWidth(item.id, item.name)
		// 	});
		// 	columValue.push(item.name);}
		// }
		this.sessionName = this.getSessionName(this.session.ses_id);
		if (this.reportType === 'headwise') {
			reportType = new TitleCasePipe().transform('head wise outstanding report: ') + this.sessionName;
		} else if (this.reportType === 'headwisedetail') {
			reportType = new TitleCasePipe().transform('head wise detail outstanding report: ') + this.sessionName;
		} else if (this.reportType === 'routewise') {
			reportType = new TitleCasePipe().transform('route wise outstanding report: ') + this.sessionName;
		} else if (this.reportType === 'defaulter') {
			reportType = new TitleCasePipe().transform('defaulters list: ') + this.sessionName;
		} else if (this.reportType === 'feedue') {
			reportType = new TitleCasePipe().transform('Fee dues detail outstanding report: ') + this.sessionName;
		} else if (this.reportType === 'aging') {
			reportType = new TitleCasePipe().transform('Aging outstanding report: ') + this.sessionName;
		}
		let reportType2: any = '';
		this.sessionName = this.getSessionName(this.session.ses_id);
		
		const fileName =reportType + '_' + this.reportdate +'.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType2, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		if (this.reportType === 'headwise') {
			for (const item of this.exportColumnDefinitions) {
				if(!(item.id.includes('checkbox_select'))) {
				columns.push({
					key: item.id,
					//width: this.checkWidth(item.id, item.name)
				});
				columValue.push(item.name);}
			}
			worksheet.properties.defaultRowHeight =40;
			reportType2 = new TitleCasePipe().transform('head wise_') + this.sessionName;
		} else if (this.reportType === 'headwisedetail') {
			for (const item of this.exportColumnDefinitions) {
				if(!(item.id.includes('checkbox_select'))) {
				columns.push({
					key: item.id,
					//width: this.checkWidth(item.id, item.name)
				});
				columValue.push(item.name);}
			}
			worksheet.properties.defaultRowHeight =40;
			reportType2 = new TitleCasePipe().transform('head wise detail_') + this.sessionName;
		} else if (this.reportType === 'routewise') {
			for (const item of this.exportColumnDefinitions) {
				if(!(item.id.includes('checkbox_select'))) {
				columns.push({
					key: item.id,
					//width: this.checkWidth(item.id, item.name)
				});
				columValue.push(item.name);}
			}
			worksheet.properties.defaultRowHeight =40;
			
			reportType2 = new TitleCasePipe().transform('route wise_') + this.sessionName;
		} else if (this.reportType === 'defaulter') {
			for (const item of this.exportColumnDefinitions) {
				if(!(item.id.includes('checkbox_select'))) {
				columns.push({
					key: item.id,
					width: this.checkWidth(item.id, item.name)
				});
				columValue.push(item.name);}
			}
			reportType2 = new TitleCasePipe().transform('defaulter list_') + this.sessionName;
		} else if (this.reportType === 'feedue') {
			for (const item of this.exportColumnDefinitions) {
				if(!(item.id.includes('checkbox_select'))) {
				columns.push({
					key: item.id,
					width: this.checkWidth(item.id, item.name)
				});
				columValue.push(item.name);}
			}
			reportType2 = new TitleCasePipe().transform('fee dues detail_') + this.sessionName;
		} else if (this.reportType === 'aging') {
			for (const item of this.exportColumnDefinitions) {
				if(!(item.id.includes('checkbox_select'))) {
				columns.push({
					key: item.id,
					width: this.checkWidth(item.id, item.name)
				});
				columValue.push(item.name);}
			}
			reportType2 = new TitleCasePipe().transform('aging details_') + this.sessionName;
		}
		worksheet.mergeCells('A1:' + this.alphabetJSON[columns.length] + '1'); // Extend cell over all column headers
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[columns.length] + '2');
		worksheet.getCell('A2').value = reportType;
		worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
		worksheet.getRow(4).values = columValue;
		worksheet.columns = columns;
		for(var i=1; i<=columns.length;i++) {
			if (this.reportType === 'headwise' || this.reportType === 'headwisedetail' || this.reportType === 'routewise')  {
			worksheet.getColumn(i).alignment = {vertical: 'middle', horizontal: 'left',  wrapText: true};
			}
		}
		if (this.dataviewObj.getGroups().length === 0) {
			Object.keys(json).forEach(key => {
				const obj: any = {};
				for (const item2 of this.exportColumnDefinitions) {
					if (this.reportType !== 'mfr') {
						if (item2.id !== 'fp_name' && item2.id !== 'invoice_created_date') {
							obj[item2.id] = this.checkReturn(this.common.htmlToText(json[key][item2.id]));
						}
						if (item2.id !== 'fp_name' && item2.id === 'invoice_created_date'
							&& this.dataset[key][item2.id] !== '<b>Grand Total</b>') {
							obj[item2.id] = new DatePipe('en-in').transform((json[key][item2.id]), 'd-MMM-y');
						}
						if (item2.id !== 'fp_name' && item2.id === 'invoice_created_date'
							&& json[key][item2.id] === '<b>Grand Total</b>') {
							obj[item2.id] = this.common.htmlToText(json[key][item2.id]);
						}
						if (item2.id !== 'invoice_created_date' && item2.id === 'fp_name') {
							obj[item2.id] = this.common.htmlToText(json[key][item2.id]);
						}
					} else if (this.reportType === 'mfr') {
						if (item2.id.toString().match(/Q/)) {
							obj[item2.id] = json[key][item2.id].status;
						} else {
							obj[item2.id] = json[key][item2.id];
						}
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
					cell.alignment = { horizontal: 'center',wrapText:true };
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
					if (this.reportType === 'headwise') {
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['stu_admission_no'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['inv_opening_balance'] = groupItem.rows.map(t => t.inv_opening_balance).reduce((acc, val) => acc + val, 0);
						Object.keys(this.feeHeadJSON).forEach((key5: any) => {
							Object.keys(this.feeHeadJSON[key5]).forEach(key2 => {
								Object.keys(groupItem.rows).forEach(key3 => {
									Object.keys(groupItem.rows[key3]).forEach(key4 => {
										if (key4 === key2) {
											obj3[key2] = groupItem.rows.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
										}
									});
								});
							});
						});
						obj3['invoice_fine_amount'] = groupItem.rows.map(t => t.invoice_fine_amount).reduce((acc, val) => acc + val, 0);
						obj3['total'] = groupItem.rows.map(t => t.total).reduce((acc, val) => acc + val, 0);
					}
					if (this.reportType === 'headwisedetail') {
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_id'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['inv_opening_balance'] = groupItem.rows.map(t => t.inv_opening_balance).reduce((acc, val) => acc + val, 0);
						obj3['invoice_fine_amount'] = groupItem.rows.map(t => t.invoice_fine_amount).reduce((acc, val) => acc + val, 0);
						Object.keys(this.feeHeadJSON).forEach((key5: any) => {
							Object.keys(this.feeHeadJSON[key5]).forEach(key2 => {
								Object.keys(groupItem.rows).forEach(key3 => {
									Object.keys(groupItem.rows[key3]).forEach(key4 => {
										if (key4 === key2) {
											obj3[key2] = groupItem.rows.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
										}
									});
								});
							});
						});
						obj3['total'] = groupItem.rows.map(t => t.total).reduce((acc, val) => acc + val, 0);
						obj3['receipt_mode_name'] = '';
					}
					if (this.reportType === 'defaulter') {
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['stu_admission_no'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['rpt_amount'] = groupItem.rows.map(t => t['rpt_amount']).reduce((acc, val) => acc + val, 0);
						obj3['fp_name'] = '';
					}
					if (this.reportType === 'routewise') {
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['stu_admission_no'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['transport_amount'] = groupItem.rows.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0);
						obj3['route_name'] = '';
						obj3['stoppages_name'] = '';
						obj3['slab_name'] = '';
					}
					if (this.reportType === 'feedue') {
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_id'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['inv_opening_balance'] = groupItem.rows.map(t => t.inv_opening_balance).reduce((acc, val) => acc + val, 0);
						obj3['invoice_fine_amount'] = groupItem.rows.map(t => t.invoice_fine_amount).reduce((acc, val) => acc + val, 0);
						Object.keys(this.feeHeadJSON).forEach((key5: any) => {
							Object.keys(this.feeHeadJSON[key5]).forEach(key2 => {
								Object.keys(groupItem.rows).forEach(key3 => {
									Object.keys(groupItem.rows[key3]).forEach(key4 => {
										if (key4 === key2) {
											obj3[key2] = groupItem.rows.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
										}
									});
								});
							});
						});
						obj3['total'] = groupItem.rows.map(t => t.total).reduce((acc, val) => acc + val, 0);
						obj3['receipt_mode_name'] = '';
					}
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
							if (this.reportType !== 'mfr') {
								if (item2.id !== 'fp_name' && item2.id !== 'invoice_created_date') {
									obj[item2.id] = this.checkReturn(this.common.htmlToText(groupItem.rows[key][item2.id]));
								}
								if (item2.id !== 'fp_name' && item2.id === 'invoice_created_date') {
									obj[item2.id] = new DatePipe('en-in').transform((groupItem.rows[key][item2.id]), 'd-MMM-y');
								}
								if (item2.id !== 'fp_name' && item2.id === 'invoice_created_date') {
									obj[item2.id] = this.common.htmlToText(groupItem.rows[key][item2.id]);
								}
								if (item2.id !== 'invoice_created_date' && item2.id === 'fp_name') {
									obj[item2.id] = this.common.htmlToText(groupItem.rows[key][item2.id]);
								}
							} else {
								if (item2.id.toString().match(/Q/)) {
									obj[item2.id] = groupItem.rows[key][item2.id].status;
								} else {
									obj[item2.id] = groupItem.rows[key][item2.id];
								}
							}
						}
						worksheet.addRow(obj);
					});
					const obj3: any = {};
					if (this.reportType === 'headwise') {
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['stu_admission_no'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['inv_opening_balance'] = groupItem.rows.map(t => t.inv_opening_balance).reduce((acc, val) => acc + val, 0);
						Object.keys(this.feeHeadJSON).forEach((key5: any) => {
							Object.keys(this.feeHeadJSON[key5]).forEach(key2 => {
								Object.keys(groupItem.rows).forEach(key3 => {
									Object.keys(groupItem.rows[key3]).forEach(key4 => {
										if (key4 === key2) {
											obj3[key2] = groupItem.rows.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
										}
									});
								});
							});
						});
						obj3['invoice_fine_amount'] = groupItem.rows.map(t => t.invoice_fine_amount).reduce((acc, val) => acc + val, 0);
						obj3['total'] = groupItem.rows.map(t => t.total).reduce((acc, val) => acc + val, 0);
					}
					if (this.reportType === 'headwisedetail') {
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_id'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['inv_opening_balance'] = groupItem.rows.map(t => t.inv_opening_balance).reduce((acc, val) => acc + val, 0);
						obj3['invoice_fine_amount'] = groupItem.rows.map(t => t.invoice_fine_amount).reduce((acc, val) => acc + val, 0);
						Object.keys(this.feeHeadJSON).forEach((key5: any) => {
							Object.keys(this.feeHeadJSON[key5]).forEach(key2 => {
								Object.keys(groupItem.rows).forEach(key3 => {
									Object.keys(groupItem.rows[key3]).forEach(key4 => {
										if (key4 === key2) {
											obj3[key2] = groupItem.rows.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
										}
									});
								});
							});
						});
						obj3['total'] = groupItem.rows.map(t => t.total).reduce((acc, val) => acc + val, 0);
						obj3['receipt_mode_name'] = '';
					}
					if (this.reportType === 'defaulter') {
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['stu_admission_no'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['rpt_amount'] = groupItem.rows.map(t => t['rpt_amount']).reduce((acc, val) => acc + val, 0);
						obj3['fp_name'] = '';
					}
					if (this.reportType === 'routewise') {
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['stu_admission_no'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['transport_amount'] = groupItem.rows.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0);
						obj3['route_name'] = '';
						obj3['stoppages_name'] = '';
						obj3['slab_name'] = '';
					}
					if (this.reportType === 'feedue') {
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_id'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['inv_opening_balance'] = groupItem.rows.map(t => t.inv_opening_balance).reduce((acc, val) => acc + val, 0);
						obj3['invoice_fine_amount'] = groupItem.rows.map(t => t.invoice_fine_amount).reduce((acc, val) => acc + val, 0);
						Object.keys(this.feeHeadJSON).forEach((key5: any) => {
							Object.keys(this.feeHeadJSON[key5]).forEach(key2 => {
								Object.keys(groupItem.rows).forEach(key3 => {
									Object.keys(groupItem.rows[key3]).forEach(key4 => {
										if (key4 === key2) {
											obj3[key2] = groupItem.rows.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
										}
									});
								});
							});
						});
						obj3['total'] = groupItem.rows.map(t => t.total).reduce((acc, val) => acc + val, 0);
						obj3['receipt_mode_name'] = '';
					}
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
	exportToFile(type = 'csv') {
		let reportType: any = '';
		this.sessionName = this.getSessionName(this.session.ses_id);
		if (this.reportType === 'headwise') {
			reportType = new TitleCasePipe().transform('head wise collection report: ') + this.sessionName;
		} else if (this.reportType === 'classwise') {
			reportType = new TitleCasePipe().transform('class wise collection report: ') + this.sessionName;
		} else if (this.reportType === 'routewise') {
			reportType = new TitleCasePipe().transform('route wise collection report: ') + this.sessionName;
		} else if (this.reportType === 'defaulter') {
			reportType = new TitleCasePipe().transform('defaulter list: ') + this.sessionName;
		} else if (this.reportType === 'aging') {
			reportType = new TitleCasePipe().transform('aging repot: ') + this.sessionName;
		}
		this.angularGrid.exportService.exportToFile({
			delimiter: (type === 'csv') ? DelimiterType.comma : DelimiterType.tab,
			filename: reportType + '_' + new Date(),
			format: (type === 'csv') ? FileType.csv : FileType.txt
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
		if (this.reportType === 'headwise') {
			reportType = new TitleCasePipe().transform('head wise outstanding report: ') + this.sessionName;
		} else if (this.reportType === 'headwisedetail') {
			reportType = new TitleCasePipe().transform('head wise Detail outstanding report: ') + this.sessionName;
		} else if (this.reportType === 'routewise') {
			reportType = new TitleCasePipe().transform('route wise outstanding report: ') + this.sessionName;
		} else if (this.reportType === 'defaulter') {
			reportType = new TitleCasePipe().transform('defaulter list: ') + this.sessionName;
		} else if (this.reportType === 'feedue') {
			reportType = new TitleCasePipe().transform('Fee dues Detail outstanding report: ') + this.sessionName;
		} else if (this.reportType === 'aging') {
			reportType = new TitleCasePipe().transform('Aging outstanding report: ') + this.sessionName;
		}
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
					if (item2.id !== 'fp_name' && item2.id !== 'invoice_created_date') {
						arr.push(this.common.htmlToText(this.dataset[key][item2.id]));
					}
					if (item2.id !== 'fp_name' && item2.id === 'invoice_created_date'
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
					if (this.reportType === 'headwise') {
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['stu_admission_no'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['inv_opening_balance'] = groupItem.rows.map(t => t.inv_opening_balance).reduce((acc, val) => acc + val, 0);
						Object.keys(this.feeHeadJSON).forEach((key5: any) => {
							Object.keys(this.feeHeadJSON[key5]).forEach(key2 => {
								Object.keys(groupItem.rows).forEach(key3 => {
									Object.keys(groupItem.rows[key3]).forEach(key4 => {
										if (key4 === key2) {
											obj3[key2] = groupItem.rows.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
										}
									});
								});
							});
						});
						obj3['invoice_fine_amount'] = groupItem.rows.map(t => t.invoice_fine_amount).reduce((acc, val) => acc + val, 0);
						obj3['total'] = groupItem.rows.map(t => t.total).reduce((acc, val) => acc + val, 0);
						for (const col of this.exportColumnDefinitions) {
							Object.keys(obj3).forEach((key: any) => {
								if (col.id === key) {
									levelArray.push(obj3[key]);
								}
							});
						}
					}
					if (this.reportType === 'headwisedetail') {
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_id'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['inv_opening_balance'] = groupItem.rows.map(t => t.inv_opening_balance).reduce((acc, val) => acc + val, 0);
						obj3['invoice_fine_amount'] = groupItem.rows.map(t => t.invoice_fine_amount).reduce((acc, val) => acc + val, 0);
						Object.keys(this.feeHeadJSON).forEach((key5: any) => {
							Object.keys(this.feeHeadJSON[key5]).forEach(key2 => {
								Object.keys(groupItem.rows).forEach(key3 => {
									Object.keys(groupItem.rows[key3]).forEach(key4 => {
										if (key4 === key2) {
											obj3[key2] = groupItem.rows.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
										}
									});
								});
							});
						});
						obj3['total'] = groupItem.rows.map(t => t.total).reduce((acc, val) => acc + val, 0);
						obj3['receipt_mode_name'] = '';
						for (const col of this.exportColumnDefinitions) {
							Object.keys(obj3).forEach((key: any) => {
								if (col.id === key) {
									levelArray.push(obj3[key]);
								}
							});
						}
					}
					if (this.reportType === 'defaulter') {
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['stu_admission_no'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['rpt_amount'] = groupItem.rows.map(t => t['rpt_amount']).reduce((acc, val) => acc + val, 0);
						obj3['fp_name'] = '';
						for (const col of this.exportColumnDefinitions) {
							Object.keys(obj3).forEach((key: any) => {
								if (col.id === key) {
									levelArray.push(obj3[key]);
								}
							});
						}
					}
					if (this.reportType === 'routewise') {
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['stu_admission_no'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['transport_amount'] = groupItem.rows.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0);
						obj3['route_name'] = '';
						obj3['stoppages_name'] = '';
						obj3['slab_name'] = '';
						for (const col of this.exportColumnDefinitions) {
							Object.keys(obj3).forEach((key: any) => {
								if (col.id === key) {
									levelArray.push(obj3[key]);
								}
							});
						}
					}
					if (this.reportType === 'feedue') {
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_id'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['inv_opening_balance'] = groupItem.rows.map(t => t.inv_opening_balance).reduce((acc, val) => acc + val, 0);
						obj3['invoice_fine_amount'] = groupItem.rows.map(t => t.invoice_fine_amount).reduce((acc, val) => acc + val, 0);
						Object.keys(this.feeHeadJSON).forEach((key5: any) => {
							Object.keys(this.feeHeadJSON[key5]).forEach(key2 => {
								Object.keys(groupItem.rows).forEach(key3 => {
									Object.keys(groupItem.rows[key3]).forEach(key4 => {
										if (key4 === key2) {
											obj3[key2] = groupItem.rows.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
										}
									});
								});
							});
						});
						obj3['total'] = groupItem.rows.map(t => t.total).reduce((acc, val) => acc + val, 0);
						obj3['receipt_mode_name'] = '';
						for (const col of this.exportColumnDefinitions) {
							Object.keys(obj3).forEach((key: any) => {
								if (col.id === key) {
									levelArray.push(obj3[key]);
								}
							});
						}
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
						for (const item2 of this.exportColumnDefinitions) {
							if (this.reportType !== 'mfr') {
								if (item2.id !== 'fp_name' && item2.id !== 'invoice_created_date') {
									arr.push(this.common.htmlToText(groupItem.rows[key][item2.id]));
								}
								if (item2.id !== 'fp_name' && item2.id === 'invoice_created_date') {
									arr.push(new DatePipe('en-in').transform((groupItem.rows[key][item2.id]), 'd-MMM-y'));
								}
								if (item2.id !== 'fp_name' && item2.id === 'invoice_created_date') {
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
						this.pdfrowdata.push(arr);
					});
					const levelArray: any[] = [];
					if (this.reportType === 'headwise') {
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['stu_admission_no'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['inv_opening_balance'] = groupItem.rows.map(t => t.inv_opening_balance).reduce((acc, val) => acc + val, 0);
						Object.keys(this.feeHeadJSON).forEach((key5: any) => {
							Object.keys(this.feeHeadJSON[key5]).forEach(key2 => {
								Object.keys(groupItem.rows).forEach(key3 => {
									Object.keys(groupItem.rows[key3]).forEach(key4 => {
										if (key4 === key2) {
											obj3[key2] = groupItem.rows.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
										}
									});
								});
							});
						});
						obj3['invoice_fine_amount'] = groupItem.rows.map(t => t.invoice_fine_amount).reduce((acc, val) => acc + val, 0);
						obj3['total'] = groupItem.rows.map(t => t.total).reduce((acc, val) => acc + val, 0);
						for (const col of this.exportColumnDefinitions) {
							Object.keys(obj3).forEach((key: any) => {
								if (col.id === key) {
									levelArray.push(obj3[key]);
								}
							});
						}
					}
					if (this.reportType === 'headwisedetail') {
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_id'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['inv_opening_balance'] = groupItem.rows.map(t => t.inv_opening_balance).reduce((acc, val) => acc + val, 0);
						obj3['invoice_fine_amount'] = groupItem.rows.map(t => t.invoice_fine_amount).reduce((acc, val) => acc + val, 0);
						Object.keys(this.feeHeadJSON).forEach((key5: any) => {
							Object.keys(this.feeHeadJSON[key5]).forEach(key2 => {
								Object.keys(groupItem.rows).forEach(key3 => {
									Object.keys(groupItem.rows[key3]).forEach(key4 => {
										if (key4 === key2) {
											obj3[key2] = groupItem.rows.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
										}
									});
								});
							});
						});
						obj3['total'] = groupItem.rows.map(t => t.total).reduce((acc, val) => acc + val, 0);
						obj3['receipt_mode_name'] = '';
						for (const col of this.exportColumnDefinitions) {
							Object.keys(obj3).forEach((key: any) => {
								if (col.id === key) {
									levelArray.push(obj3[key]);
								}
							});
						}
					}
					if (this.reportType === 'defaulter') {
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['stu_admission_no'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['rpt_amount'] = groupItem.rows.map(t => t['rpt_amount']).reduce((acc, val) => acc + val, 0);
						obj3['fp_name'] = '';
						for (const col of this.exportColumnDefinitions) {
							Object.keys(obj3).forEach((key: any) => {
								if (col.id === key) {
									levelArray.push(obj3[key]);
								}
							});
						}
					}
					if (this.reportType === 'routewise') {
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['stu_admission_no'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['transport_amount'] = groupItem.rows.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0);
						obj3['route_name'] = '';
						obj3['stoppages_name'] = '';
						obj3['slab_name'] = '';
						for (const col of this.exportColumnDefinitions) {
							Object.keys(obj3).forEach((key: any) => {
								if (col.id === key) {
									levelArray.push(obj3[key]);
								}
							});
						}
					}
					if (this.reportType === 'feedue') {
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_id'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['inv_opening_balance'] = groupItem.rows.map(t => t.inv_opening_balance).reduce((acc, val) => acc + val, 0);
						obj3['invoice_fine_amount'] = groupItem.rows.map(t => t.invoice_fine_amount).reduce((acc, val) => acc + val, 0);
						Object.keys(this.feeHeadJSON).forEach((key5: any) => {
							Object.keys(this.feeHeadJSON[key5]).forEach(key2 => {
								Object.keys(groupItem.rows).forEach(key3 => {
									Object.keys(groupItem.rows[key3]).forEach(key4 => {
										if (key4 === key2) {
											obj3[key2] = groupItem.rows.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
										}
									});
								});
							});
						});
						obj3['total'] = groupItem.rows.map(t => t.total).reduce((acc, val) => acc + val, 0);
						obj3['receipt_mode_name'] = '';
						for (const col of this.exportColumnDefinitions) {
							Object.keys(obj3).forEach((key: any) => {
								if (col.id === key) {
									levelArray.push(obj3[key]);
								}
							});
						}
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
	sendMessage() {
		console.log(this.rowChosenData);
		this.smsFeeModal.openModal(this.rowChosenData);
		const change: any = this.smsFeeModal.subscribeModalChange();
		change.afterClosed().subscribe((res: any) => {
			if (res && res.data && res.data.length > 0) {
				this.rowsChosen = [];
				this.rowChosenData = [];
				for (const item of res.data) {
					this.rowsChosen.push(item.index);
				}
				this.gridObj.setSelectedRows(this.rowsChosen);
				this.rowChosenData = res.data;

			} else {
				this.rowsChosen = [];
				this.rowChosenData = [];
				this.gridObj.setSelectedRows(this.rowsChosen);
			}
		});
	}
	checkCurrencyFormatter(row, cell, value, columnDef, dataContext) {
		if (value === 0) {
			return '-';
		} else {
			if (value > 0) {
				return new IndianCurrency().transform(value);
			} else {
				return '-' + new IndianCurrency().transform(-value);
			}

		}
	}
}
