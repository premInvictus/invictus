import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
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
import { DecimalPipe, DatePipe, TitleCasePipe, CurrencyPipe } from '@angular/common';
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
import { group } from '@angular/animations';
import { arrayObjectToCsvFormatter } from 'angular-slickgrid/app/modules/angular-slickgrid/formatters/arrayObjectToCsvFormatter';
@Component({
	selector: 'app-collection-report',
	templateUrl: './collection-report.component.html',
	styleUrls: ['./collection-report.component.css']
})
export class CollectionReportComponent implements OnInit {
	sessionArray: any[] = [];
	session: any = {};
	notFormatedCellArray: any[] = [];
	totalRow: any;
	columnDefinitions1: Column[] = [];
	columnDefinitions2: Column[] = [];
	gridOptions1: GridOption;
	gridOptions2: GridOption;
	tableFlag = false;
	dataset1: any[];
	gridHeight: any;
	exportColumnDefinitions: any[] = [];
	dataset2: any[];
	initgrid = false;
	columnDefinitions: Column[] = [];
	gridOptions: GridOption = {};
	dataset: any[] = [];
	angularGrid: AngularGridInstance;
	dataviewObj: any;
	draggableGroupingPlugin: any;
	durationOrderByCount = false;
	pdfrowdata: any[] = [];
	levelHeading: any[] = [];
	levelTotalFooter: any[] = [];
	levelSubtotalFooter: any[] = [];
	gridObj: any;
	@Input() userName: any = '';
	@Output() displyRep = new EventEmitter();
	processing = false;
	selectedGroupingFields: string[] = ['', '', ''];
	totalRecords: number;
	aggregatearray: any[] = [];
	reportFilterForm: FormGroup;
	valueArray: any[] = [];
	feeHeadJSON: any[] = [];
	classDataArray: any[] = [];
	reportTypeArray: any[] = [];
	valueLabel: any = '';
	reportType = '1';
	filterFlag = false;
	filterResult: any[] = [];
	sortResult: any[] = [];
	dataArr: any[] = [];
	schoolInfo: any = {};
	groupColumns: any[] = [];
	sessionName: any;
	filteredAs: any = {};
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
		44: 'AR',

	};
	currentUser: any;
	constructor(translate: TranslateService,
		private feeService: FeeService,
		private common: CommonAPIService,
		private sisService: SisService,
		public dialog: MatDialog,
		private fbuild: FormBuilder) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.getSchool();
		this.session = JSON.parse(localStorage.getItem('session'));
		this.getSession();
		this.buildForm();
		this.getClassData();
		this.reportTypeArray.push({
			report_type: 'headwise', report_name: 'Head Wise'
		},
			{
				report_type: 'classwise', report_name: 'Class Wise'
			},
			{
				report_type: 'modewise', report_name: 'Mode Wise'
			},
			{
				report_type: 'routewise', report_name: 'Route Wise'
			},
			{
				report_type: 'mfr', report_name: 'Monthly Fee Report (MFR)'
			},
			{
				report_type: 'summary', report_name: 'Collection Summary'
			},
			{
				report_type: 'cumulativeheadwise', report_name: 'Cumulative Head Wise'
			});
		this.reportType = 'headwise';
		if (this.sessionName) {
			const date = new Date(this.sessionName.split('-')[0], new Date().getMonth(), new Date().getDate());
			const firstDay = new Date(this.sessionName.split('-')[0], new Date().getMonth(), 1);
			this.reportFilterForm.patchValue({
				'from_date': firstDay,
				'to_date': date
			});
		}
		
		this.filterFlag = true;
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
			columnElement.innerHTML = '<b>' + (this.totalRow[columnId] ? this.totalRow[columnId] : '') + '<b>';
		}
	}
	getSchool() {
		this.sisService.getSchool().subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.schoolInfo = res.data[0];
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
			'orderBy': ''
		});
	}
	getHeadWiseCollectionReport(value: any) {
		value.from_date = new DatePipe('en-in').transform(value.from_date, 'yyyy-MM-dd');
		value.to_date = new DatePipe('en-in').transform(value.to_date, 'yyyy-MM-dd');
		this.dataArr = [];
		this.aggregatearray = [];
		this.columnDefinitions = [];
		this.dataset = [];
		this.tableFlag = false;
		this.gridOptions = {
			enableDraggableGrouping: this.reportType !== 'summary' ? true : false,
			createPreHeaderPanel: true,
			showPreHeaderPanel: this.reportType !== 'summary' ? true : false,
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
				const collectionJSON: any = {
					'admission_no': '',
					'studentName': '',
					'report_type': value.report_type,
					'feeHeadId': value.fee_value,
					'from_date': value.from_date,
					'to_date': value.to_date,
					'pageSize': '10',
					'pageIndex': '0',
					'filterReportBy': 'collection',
					'login_id': value.login_id,
					'orderBy': value.orderBy,
					'downloadAll': true
				};
				this.feeService.getHeadWiseCollection(collectionJSON).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.common.showSuccessErrorMessage('Report Data Fetched Successfully', 'success');
						repoArray = result.data.reportData;
						this.totalRecords = Number(result.data.totalRecords);
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
										id: 'invoice_created_date', name: 'Trans. Date', field: 'invoice_created_date',
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
										name: 'Reciept No.',
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
										id: 'inv_opening_balance', name: 'Opening Balance (₹)', field: 'inv_opening_balance',
										filterable: true,
										cssClass: 'amount-report-fee',
										filterSearchType: FieldType.number,
										filter: { model: Filters.compoundInputNumber },
										sortable: true,
										formatter: this.checkFeeFormatter,
										groupTotalsFormatter: this.sumTotalsFormatter
									}];
							}
							if (repoArray[Number(keys)]['fee_head_data'].length > 0) {
								let k = 0;
								let tot = 0;
								for (const titem of repoArray[Number(keys)]['fee_head_data']) {
									Object.keys(titem).forEach((key2: any) => {
										if (key2 === 'fh_name' && Number(keys) === 0) {
											const feeObj: any = {};
											this.columnDefinitions.push({
												id: 'fh_name' + j,
												name: new CapitalizePipe().transform(titem[key2]) + ' (₹)',
												field: 'fh_name' + j,
												cssClass: 'amount-report-fee',
												sortable: true,
												filterable: true,
												filterSearchType: FieldType.number,
												filter: { model: Filters.compoundInput },
												formatter: this.checkFeeFormatter,
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
											obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(keys)]['stu_full_name']);
											if (repoArray[Number(keys)]['stu_sec_id'] !== '0') {
												obj['stu_class_name'] = repoArray[Number(keys)]['stu_class_name'] + '-' +
													repoArray[Number(keys)]['stu_sec_name'];
											} else {
												obj['stu_class_name'] = repoArray[Number(keys)]['stu_class_name'];
											}
											//obj['tag_name'] = repoArray[Number(keys)]['tag_name'] ? repoArray[Number(keys)]['tag_name'] : ''
											obj['tag_name'] = repoArray[Number(keys)]['tag_name'] ? new CapitalizePipe().transform(repoArray[Number(keys)]['tag_name']) : '-';
											obj['receipt_id'] = repoArray[Number(keys)]['rpt_id'] ?
												repoArray[Number(keys)]['rpt_id'] : '-';
											obj['invoice_created_date'] = repoArray[Number(keys)]['ftr_transaction_date'];
											obj['fp_name'] = repoArray[Number(keys)]['fp_name'] ?
												repoArray[Number(keys)]['fp_name'] : '-';
											obj['receipt_no'] = repoArray[Number(keys)]['receipt_no'] ?
												repoArray[Number(keys)]['receipt_no'] : '-';
											obj[key2 + k] = titem['fh_amt'] ? Number(titem['fh_amt']) : 0;
											tot = tot + (titem['fh_amt'] ? Number(titem['fh_amt']) : 0);
											obj['inv_opening_balance'] = repoArray[Number(keys)]['inv_opening_balance']
												? Number(repoArray[Number(keys)]['inv_opening_balance']) : 0;
											obj['invoice_fine_amount'] = repoArray[Number(keys)]['invoice_fine_amount']
												? Number(repoArray[Number(keys)]['invoice_fine_amount']) : 0;
											obj['additional_amt'] = Number(repoArray[Number(keys)]['invoice_amount']
												? Number(repoArray[Number(keys)]['invoice_amount']) : 0) - Number(tot) - Number(repoArray[Number(keys)]['inv_opening_balance']
													? Number(repoArray[Number(keys)]['inv_opening_balance']) : 0) - (repoArray[Number(keys)]['invoice_fine_amount']
														? Number(repoArray[Number(keys)]['invoice_fine_amount']) : 0);
											obj['total'] = repoArray[Number(keys)]['invoice_amount']
												? Number(repoArray[Number(keys)]['invoice_amount']) : 0;
											obj['receipt_mode_name'] = repoArray[Number(keys)]['pay_name'] ?
												repoArray[Number(keys)]['pay_name'] : '-';
											obj['tb_name'] = repoArray[Number(keys)]['tb_name'] ?
												repoArray[Number(keys)]['tb_name'] : '-';

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
								id: 'invoice_fine_amount', name: 'Fine Amount (₹)', field: 'invoice_fine_amount',
								filterable: true,
								filterSearchType: FieldType.number,
								filter: { model: Filters.compoundInputNumber },
								sortable: true,
								formatter: this.checkFeeFormatter,
								groupTotalsFormatter: this.sumTotalsFormatter
							},
							{
								id: 'additional_amt', name: 'Short / Access (₹)', field: 'additional_amt',
								filterable: true,
								filterSearchType: FieldType.number,
								filter: { model: Filters.compoundInputNumber },
								sortable: true,
								formatter: this.checkFeeFormatter,
								groupTotalsFormatter: this.sumTotalsFormatter
							},
							{
								id: 'total', name: 'Total (₹)', field: 'total',
								filterable: true,
								filterSearchType: FieldType.number,
								filter: { model: Filters.compoundInputNumber },
								sortable: true,
								formatter: this.checkTotalFormatter,
								cssClass: 'amount-report-fee',
								groupTotalsFormatter: this.sumTotalsFormatter
							},
							{
								id: 'receipt_mode_name', name: 'Mode', field: 'receipt_mode_name', sortable: true, filterable: true,
								filterSearchType: FieldType.string,
								filter: { model: Filters.compoundInputText },
								width: 100,
								grouping: {
									getter: 'receipt_mode_name',
									formatter: (g) => {
										return `${g.value}  <span style="color:green">(${g.count})</span>`;
									},
									aggregators: this.aggregatearray,
									aggregateCollapsed: true,
									collapsed: false
								},
							},
							{
								id: 'tb_name', name: 'Bank Name', field: 'tb_name', sortable: true, filterable: true,
								filterSearchType: FieldType.string,
								filter: { model: Filters.compoundInputText },
								width: 100,
								grouping: {
									getter: 'tb_name',
									formatter: (g) => {
										return `${g.value}  <span style="color:green">(${g.count})</span>`;
									},
									aggregators: this.aggregatearray,
									aggregateCollapsed: true,
									collapsed: false
								},
							}
						);
						this.aggregatearray.push(new Aggregators.Sum('inv_opening_balance'));
						this.aggregatearray.push(new Aggregators.Sum('inv_prev_balance'));
						this.aggregatearray.push(new Aggregators.Sum('invoice_fine_amount'));
						this.aggregatearray.push(new Aggregators.Sum('total'));
						this.aggregatearray.push(new Aggregators.Sum('srno'));
						this.totalRow = {};
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = 'Grand Total';
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_id'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['inv_opening_balance'] =
							new IndianCurrency().transform(this.dataset.map(t => t.inv_opening_balance).reduce((acc, val) => acc + val, 0));
						obj3['invoice_fine_amount'] =
							new IndianCurrency().transform(this.dataset.map(t => t.invoice_fine_amount).reduce((acc, val) => acc + val, 0));
						Object.keys(feeHead).forEach((key: any) => {
							Object.keys(feeHead[key]).forEach(key2 => {
								Object.keys(this.dataset).forEach(key3 => {
									Object.keys(this.dataset[key3]).forEach(key4 => {
										if (key4 === key2) {
											obj3[key2] = new IndianCurrency().transform(this.dataset.map(t => t[key2]).reduce((acc, val) => acc + val, 0));
										}
									});
								});
							});
						});
						obj3['additional_amt'] = new IndianCurrency().transform(this.dataset.map(t => t.additional_amt).reduce((acc, val) => acc + val, 0));
						obj3['total'] = new IndianCurrency().transform(this.dataset.map(t => t.total).reduce((acc, val) => acc + val, 0));
						obj3['receipt_mode_name'] = '';
						obj3['tb_name'] = '';
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
						width: 2,
						maxWidth: 40,
					},
					{
						id: 'stu_admission_no', name: 'Enrollment No', field: 'stu_admission_no',
						sortable: true,
						filterable: true,
						width: 20,
						grouping: {
							getter: 'stu_admission_no',
							formatter: (g) => {
								return `${g.value} <span style="color:green"> (${g.count})</span>`;
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
						id: 'invoice_created_date', name: 'Trans. Date', field: 'invoice_created_date', sortable: true,
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
								return `${g.value}  <span style="color:green">(${g.count} items)</span>`;
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
						name: 'Reciept Amt.',
						field: 'rpt_amount',
						sortable: true,
						width: 20,
						cssClass: 'amount-report-fee',
						filterable: true,
						filterSearchType: FieldType.number,
						filter: { model: Filters.compoundInputNumber },
						formatter: this.checkFeeFormatter,
						groupTotalsFormatter: this.sumTotalsFormatter
					}];
				this.feeService.getHeadWiseCollection(collectionJSON).subscribe((result: any) => {
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
							obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(index)]['stu_full_name']);
							if (repoArray[Number(index)]['stu_sec_id'] !== '0') {
								obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'] + '-' +
									repoArray[Number(index)]['stu_sec_name'];
							} else {
								obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'];
							}
							
							obj['tag_name'] = repoArray[Number(index)]['tag_name'] ?
							new CapitalizePipe().transform(repoArray[Number(index)]['tag_name']) : '-';
							obj['receipt_id'] = repoArray[Number(index)]['rpt_id'] ?
								repoArray[Number(index)]['rpt_id'] : '-';
							obj['invoice_created_date'] = repoArray[Number(index)]['ftr_transaction_date'];
							obj['fp_name'] = repoArray[Number(index)]['fp_name'] ?
								repoArray[Number(index)]['fp_name'] : '-';
							obj['receipt_no'] = repoArray[Number(index)]['receipt_no'] ?
								repoArray[Number(index)]['receipt_no'] : '-';
							obj['rpt_amount'] = repoArray[Number(index)]['rpt_amount'] ?
								Number(repoArray[Number(index)]['rpt_amount']) : 0;
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
						obj3['receipt_no'] = '';
						obj3['rpt_amount'] = new IndianCurrency().transform(this.dataset.map(t => t['rpt_amount']).reduce((acc, val) => acc + val, 0));
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
			} else if (this.reportType === 'modewise') {
				const collectionJSON: any = {
					'admission_no': '',
					'studentName': '',
					'report_type': value.report_type,
					'modeId': value.fee_value,
					'from_date': value.from_date,
					'to_date': value.to_date,
					'pageSize': '10',
					'pageIndex': '0',
					'filterReportBy': 'collection',
					'login_id': value.login_id,
					'orderBy': value.orderBy,
					'downloadAll': true
				};
				this.feeService.getHeadWiseCollection(collectionJSON).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.common.showSuccessErrorMessage('Report Data Fetched Successfully', 'success');
						repoArray = result.data.reportData;
						this.totalRecords = Number(result.data.totalRecords);
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
										width: 3
									},
									{
										id: 'stu_admission_no', name: 'Enrollment No', field: 'stu_admission_no', sortable: true,
										filterable: true,
										width: 70,
										grouping: {
											getter: 'stu_admission_no',
											formatter: (g) => {
												return `${g.value} <span style="color:green"> (${g.count})</span>`;
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
										width: 160,
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
										width: 40,
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
										width: 40,
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
										id: 'invoice_created_date', name: 'Trans. Date', field: 'invoice_created_date', sortable: true,
										filterable: true,
										formatter: this.checkDateFormatter,
										width: 80,
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
										width: 90,
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
										name: 'Reciept No.',
										field: 'receipt_no',
										width: 30,
										sortable: true,
										filterable: true,
										filterSearchType: FieldType.number,
										filter: { model: Filters.compoundInputNumber },
										formatter: this.checkReceiptFormatter,
										cssClass: 'receipt_collection_report'
									}];
							}
							if (repoArray[Number(keys)]['pay_data']) {
								let k = 0;
								let tot = 0;
								for (const titem of repoArray[Number(keys)]['pay_data']) {
									Object.keys(titem).forEach((key2: any) => {
										if (key2 === 'pay_name' && Number(keys) === 0) {
											this.columnDefinitions.push({
												id: 'pay_name' + j,
												name: titem[key2],
												field: 'pay_name' + j,
												cssClass: 'amount-report-fee',
												sortable: true,
												filterable: true,
												filterSearchType: FieldType.string,
												filter: { model: Filters.compoundInput },
												formatter: this.checkFeeFormatter,
												groupTotalsFormatter: this.sumTotalsFormatter
											});
											this.aggregatearray.push(new Aggregators.Sum('pay_name' + j));
											const payObj: any = {};
											payObj['pay_name' + j] = '';
											feeHead.push(payObj);
											this.feeHeadJSON.push(payObj);
											j++;
										}
										if (key2 === 'pay_name') {
											obj['id'] = (collectionJSON.pageSize * collectionJSON.pageIndex) +
												(Number(keys) + 1);
											obj['srno'] = (collectionJSON.pageSize * collectionJSON.pageIndex) +
												(Number(keys) + 1);
											obj['stu_admission_no'] = repoArray[Number(keys)]['stu_admission_no'] ?
												repoArray[Number(keys)]['stu_admission_no'] : '-';
											obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(keys)]['stu_full_name']);
											if (repoArray[Number(keys)]['stu_sec_id'] !== '0') {
												obj['stu_class_name'] = repoArray[Number(keys)]['stu_class_name'] + '-' +
													repoArray[Number(keys)]['stu_sec_name'];
											} else {
												obj['stu_class_name'] = repoArray[Number(keys)]['stu_class_name'];
											}
											obj['tag_name'] = repoArray[Number(keys)]['tag_name'] ? new CapitalizePipe().transform(repoArray[Number(keys)]['tag_name']) : '-';
											obj['receipt_id'] = repoArray[Number(keys)]['rpt_id'] ?
												repoArray[Number(keys)]['rpt_id'] : '0';
											obj['invoice_created_date'] = repoArray[Number(keys)]['ftr_transaction_date'];
											obj['fp_name'] = repoArray[Number(keys)]['fp_name'] ?
												repoArray[Number(keys)]['fp_name'] : '-';
											obj['receipt_no'] = repoArray[Number(keys)]['receipt_no'] ?
												repoArray[Number(keys)]['receipt_no'] : '-';
											obj[key2 + k] = titem['pay_amount'] ? Number(titem['pay_amount']) : 0;
											tot = tot + (titem['pay_amount'] ? Number(titem['pay_amount']) : 0);
											obj['bank_name'] = repoArray[Number(keys)]['bank_name'] ?
												repoArray[Number(keys)]['bank_name'] : '-';
											obj['total'] = tot;
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
								id: 'bank_name', name: 'Bank Name', field: 'bank_name',
								filterable: true,
								filterSearchType: FieldType.string,
								filter: { model: Filters.compoundInput },
								sortable: true,
								width: 120,
								grouping: {
									getter: 'bank_name',
									formatter: (g) => {
										return `${g.value}  <span style="color:green">(${g.count})</span>`;
									},
									aggregators: this.aggregatearray,
									aggregateCollapsed: true,
									collapsed: false
								},
							},
							{
								id: 'total', name: 'Total', field: 'total',
								filterable: true,
								filterSearchType: FieldType.number,
								filter: { model: Filters.compoundInput },
								sortable: true,
								cssClass: 'amount-report-fee',
								width: 50,
								formatter: this.checkTotalFormatter,
								groupTotalsFormatter: this.sumTotalsFormatter
							},
						);
						this.totalRow = {};
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = '<b>Grand Total</b>';
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_id'] = '';
						obj3['receipt_no'] = '';
						Object.keys(feeHead).forEach((key: any) => {
							Object.keys(feeHead[key]).forEach(key2 => {
								Object.keys(this.dataset).forEach(key3 => {
									Object.keys(this.dataset[key3]).forEach(key4 => {
										if (key4 === key2) {
											obj3[key4] = new IndianCurrency().transform(this.dataset.map(t => t[key4]).reduce((acc, val) => acc + val, 0));
										}
									});
								});
							});
						});
						obj3['bank_name'] = '';
						obj3['total'] = new IndianCurrency().transform(this.dataset.map(t => t['total']).reduce((acc, val) => acc + val, 0));
						obj3['fp_name'] = '';
						this.totalRow = obj3;
						this.aggregatearray.push(new Aggregators.Sum('total'));
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
								return `${g.value} <span style="color:green"> (${g.count})</span>`;
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
							obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(index)]['stu_full_name']);
							if (repoArray[Number(index)]['stu_sec_id'] !== '0') {
								obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'] + '-' +
									repoArray[Number(index)]['stu_sec_name'];
							} else {
								obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'];
							}
							obj['tag_name'] = repoArray[Number(index)]['tag_name'] ? new CapitalizePipe().transform(repoArray[Number(index)]['tag_name']) : '-';
							
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
							new IndianCurrency().transform(this.dataset.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0));
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
						this.tableFlag = true;
					} else {
						this.tableFlag = true;
					}
				});
			} else if (this.reportType === 'mfr') {
				const collectionJSON: any = {
					'admission_no': '',
					'studentName': '',
					'report_type': value.report_type,
					'classId': value.fee_value,
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
						maxWidth: 40
					},
					{
						id: 'stu_admission_no', name: 'Enrollment No', field: 'stu_admission_no', sortable: true,
						width: 140,
						filterable: true,
						grouping: {
							getter: 'stu_admission_no',
							formatter: (g) => {
								return `${g.value} <span style="color:green"> (${g.count})</span>`;
							},
							aggregators: this.aggregatearray,
							aggregateCollapsed: true,
							collapsed: false
						},
						filterSearchType: FieldType.string,
						filter: { model: Filters.compoundInput },
						groupTotalsFormatter: this.srnTotalsFormatter
					},
					{
						id: 'stu_full_name', name: 'Student Name', field: 'stu_full_name', sortable: true,
						filterable: true,
						width: 200,
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
						groupTotalsFormatter: this.countTotalsFormatter
					},
					{
						id: 'stu_class_name', name: 'Class-Section', field: 'stu_class_name', sortable: true,
						filterable: true,
						width: 200,
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
						width: 200,
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
						id: 'stu_opening_balance',
						name: 'Opening Bal.',
						field: 'stu_opening_balance',
						filterSearchType: FieldType.number,
						filter: { model: Filters.compoundInputNumber },
						filterable: true,
						sortable: true,
						width: 160,
						formatter: this.checkFeeFormatter,
						cssClass: 'amount-report-fee',
						groupTotalsFormatter: this.sumTotalsFormatter
					}];
				this.feeService.getMFRReport(collectionJSON).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.common.showSuccessErrorMessage('Report Data Fetched Successfully', 'success');
						repoArray = result.data.reportData;
						this.totalRecords = Number(result.data.totalRecords);
						localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
						let index = 0;
						let qindex = 1;
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
							obj['tag_name'] = repoArray[Number(index)]['tag_name'] ? new CapitalizePipe().transform(repoArray[Number(index)]['tag_name']) : '-';
							obj['stu_opening_balance'] = repoArray[Number(index)]['stu_opening_balance'] ?
								Number(repoArray[Number(index)]['stu_opening_balance']) : 0;
							obj['inv_fp_id'] = repoArray[Number(index)]['inv_fp_id'];
							for (const titem of item['inv_invoice_generated_status']) {
								Object.keys(titem).forEach((key: any) => {
									if (key === 'fm_name' && index === 0 &&
										Number(item.inv_fp_id) === 2) {
										this.columnDefinitions.push({
											id: 'Q' + qindex,
											name: titem[key],
											field: 'Q' + qindex,
											formatter: this.getMFRFormatter
										});
										qindex++;
									} else if (key === 'fm_name' && index === 0 &&
										Number(item.inv_fp_id) === 1) {
										this.columnDefinitions.push({
											id: 'Q' + qindex,
											name: titem[key],
											field: 'Q' + qindex,
											formatter: this.getMFRFormatter
										});
										qindex++;
									} else if (key === 'fm_name' && index === 0 &&
										Number(item.inv_fp_id) === 3) {
										this.columnDefinitions.push({
											id: 'Q' + qindex,
											name: titem[key],
											field: 'Q' + qindex,
											formatter: this.getMFRFormatter
										});
										qindex++;
									} else if (key === 'fm_name' && index === 0 &&
										Number(item.inv_fp_id) === 4) {
										this.columnDefinitions.push({
											id: 'Q' + qindex,
											name: titem[key],
											field: 'Q' + qindex,
											formatter: this.getMFRFormatter
										});
										qindex++;
									}
									if (key === 'fm_name' &&
										Number(item.inv_fp_id) === 2) {
										obj['Q1'] = {
											status: item['inv_invoice_generated_status'][0]['invoice_paid_status'],
											invoice_id: item['inv_invoice_generated_status'][0]['invoice_id'],
											inv_invoice_no: item['inv_invoice_generated_status'][0]['inv_invoice_no']
										};
										obj['Q2'] = {
											status: item['inv_invoice_generated_status'][1]['invoice_paid_status'],
											invoice_id: item['inv_invoice_generated_status'][1]['invoice_id'],
											inv_invoice_no: item['inv_invoice_generated_status'][1]['inv_invoice_no']
										};
										obj['Q3'] = {
											status: item['inv_invoice_generated_status'][2]['invoice_paid_status'],
											invoice_id: item['inv_invoice_generated_status'][2]['invoice_id'],
											inv_invoice_no: item['inv_invoice_generated_status'][2]['inv_invoice_no']
										};
										obj['Q4'] = {
											status: item['inv_invoice_generated_status'][3]['invoice_paid_status'],
											invoice_id: item['inv_invoice_generated_status'][3]['invoice_id'],
											inv_invoice_no: item['inv_invoice_generated_status'][3]['inv_invoice_no']
										};
									} else if (key === 'fm_name' &&
										Number(item.inv_fp_id) === 1) {
										obj['Q1'] = {
											status: item['inv_invoice_generated_status'][0]['invoice_paid_status'],
											invoice_id: item['inv_invoice_generated_status'][0]['invoice_id'],
											inv_invoice_no: item['inv_invoice_generated_status'][0]['inv_invoice_no']
										};
										obj['Q2'] = {
											status: item['inv_invoice_generated_status'][1]['invoice_paid_status'],
											invoice_id: item['inv_invoice_generated_status'][1]['invoice_id'],
											inv_invoice_no: item['inv_invoice_generated_status'][1]['inv_invoice_no']
										};
										obj['Q3'] = {
											status: item['inv_invoice_generated_status'][2]['invoice_paid_status'],
											invoice_id: item['inv_invoice_generated_status'][2]['invoice_id'],
											inv_invoice_no: item['inv_invoice_generated_status'][2]['inv_invoice_no']
										};
										obj['Q4'] = {
											status: item['inv_invoice_generated_status'][3]['invoice_paid_status'],
											invoice_id: item['inv_invoice_generated_status'][3]['invoice_id'],
											inv_invoice_no: item['inv_invoice_generated_status'][3]['inv_invoice_no']
										};
										obj['Q5'] = {
											status: item['inv_invoice_generated_status'][4]['invoice_paid_status'],
											invoice_id: item['inv_invoice_generated_status'][4]['invoice_id'],
											inv_invoice_no: item['inv_invoice_generated_status'][4]['inv_invoice_no']
										};
										obj['Q6'] = {
											status: item['inv_invoice_generated_status'][5]['invoice_paid_status'],
											invoice_id: item['inv_invoice_generated_status'][5]['invoice_id'],
											inv_invoice_no: item['inv_invoice_generated_status'][5]['inv_invoice_no']
										};
										obj['Q7'] = {
											status: item['inv_invoice_generated_status'][6]['invoice_paid_status'],
											invoice_id: item['inv_invoice_generated_status'][6]['invoice_id'],
											inv_invoice_no: item['inv_invoice_generated_status'][6]['inv_invoice_no']
										};
										obj['Q8'] = {
											status: item['inv_invoice_generated_status'][7]['invoice_paid_status'],
											invoice_id: item['inv_invoice_generated_status'][7]['invoice_id'],
											inv_invoice_no: item['inv_invoice_generated_status'][7]['inv_invoice_no']
										};
										obj['Q9'] = {
											status: item['inv_invoice_generated_status'][8]['invoice_paid_status'],
											invoice_id: item['inv_invoice_generated_status'][8]['invoice_id'],
											inv_invoice_no: item['inv_invoice_generated_status'][8]['inv_invoice_no']
										};
										obj['Q10'] = {
											status: item['inv_invoice_generated_status'][9]['invoice_paid_status'],
											invoice_id: item['inv_invoice_generated_status'][9]['invoice_id'],
											inv_invoice_no: item['inv_invoice_generated_status'][9]['inv_invoice_no']
										};
										obj['Q11'] = {
											status: item['inv_invoice_generated_status'][10]['invoice_paid_status'],
											invoice_id: item['inv_invoice_generated_status'][10]['invoice_id'],
											inv_invoice_no: item['inv_invoice_generated_status'][10]['inv_invoice_no']
										};
										obj['Q12'] = {
											status: item['inv_invoice_generated_status'][11]['invoice_paid_status'],
											invoice_id: item['inv_invoice_generated_status'][11]['invoice_id'],
											inv_invoice_no: item['inv_invoice_generated_status'][11]['inv_invoice_no']
										};
									} else if (key === 'fm_name' &&
										Number(item.inv_fp_id) === 3) {
										obj['Q1'] = {
											status: item['inv_invoice_generated_status'][0]['invoice_paid_status'],
											invoice_id: item['inv_invoice_generated_status'][0]['invoice_id'],
											inv_invoice_no: item['inv_invoice_generated_status'][0]['inv_invoice_no']
										};
										obj['Q2'] = {
											status: item['inv_invoice_generated_status'][1]['invoice_paid_status'],
											invoice_id: item['inv_invoice_generated_status'][1]['invoice_id'],
											inv_invoice_no: item['inv_invoice_generated_status'][1]['inv_invoice_no']
										};
									} else if (key === 'fm_name' &&
										Number(item.inv_fp_id) === 4) {
										obj['Q1'] = {
											status: item['inv_invoice_generated_status'][0]['invoice_paid_status'],
											invoice_id: item['inv_invoice_generated_status'][0]['invoice_id'],
											inv_invoice_no: item['inv_invoice_generated_status'][0]['inv_invoice_no']
										};
									}
								});
							}
							this.dataset.push(obj);
							index++;
						}
						this.aggregatearray.push(new Aggregators.Sum('stu_opening_balance'));
						if (this.dataset.length <= 5) {
							this.gridHeight = 300;
						} else if (this.dataset.length <= 10 && this.dataset.length > 5) {
							this.gridHeight = 400;
						} else if (this.dataset.length > 10 && this.dataset.length <= 20) {
							this.gridHeight = 550;
						} else if (this.dataset.length > 20) {
							this.gridHeight = 750;
						}
						this.totalRow = {};
						const obj2: any = {};
						obj2['id'] = '';
						obj2['srno'] = '';
						obj2['au_login_id'] = '';
						obj2['stu_opening_balance'] = this.dataset.map(f => f.stu_opening_balance).reduce((acc, val) => acc + val, 0);
						obj2['stu_admission_no'] = this.common.htmlToText('<b>Grand Total</b>');
						obj2['stu_full_name'] = this.dataset.length;
						obj2['stu_class_name'] = '';
						obj2['fp_name'] = '';
						this.totalRow = obj2;
						this.tableFlag = true;
						setTimeout(() => this.groupByClass(), 2);
						this.selectedGroupingFields.push('stu_class_name');
					} else {
						this.tableFlag = true;
					}
				});
			} else if (this.reportType === 'summary') {
				const collectionJSON: any = {
					'from_date': value.from_date,
					'to_date': value.to_date
				};
				this.feeService.getFeeCollectionSummaryReport(collectionJSON).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.common.showSuccessErrorMessage('Report Data Fetched Successfully', 'success');
						repoArray = result.data.reportData;
						var payModeArray = result.data.payment_mode_data;
						console.log('repoArray', repoArray);

						let i = 0;
						let j = 0;
						const feeHead: any[] = [];
						Object.keys(repoArray).forEach((keys: any) => {
							const obj: any = {};
							if (Number(keys) === 0) {
								this.columnDefinitions = [
									{
										id: 'fh_name',
										name: 'Fee Heads',
										field: 'fh_name',
										filterable: true,
										filterSearchType: FieldType.string,
										filter: { model: Filters.compoundInputText },
										sortable: true,
										width: 300,
										groupTotalsFormatter: this.srnTotalsFormatter
									}];
							}
							if (repoArray[Number(keys)]['modes_arr'].length > 0) {
								let k = 0;
								let tot = 0;
								for (const titem of repoArray[Number(keys)]['modes_arr']) {
									if (titem && titem.pay_name !== "Other Payment" && titem.pay_name !== "Fine Payment") {
										Object.keys(titem).forEach((key2: any) => {
											var total_row_amt = 0;
											if (key2 === 'pay_name' && Number(keys) === 0) {
												const feeObj: any = {};
												this.columnDefinitions.push({
													id: 'pay_name' + j,
													name: new CapitalizePipe().transform(titem[key2]) + ' (₹)',
													field: 'pay_name' + j,
													cssClass: 'amount-report-fee',
													sortable: true,
													filterable: true,
													formatter: this.checkFeeFormatter,
													filterSearchType: FieldType.number,
													filter: { model: Filters.compoundInput },
													groupTotalsFormatter: this.sumTotalsFormatter
												});
												feeObj['pay_name' + j] = '';
												feeHead.push(feeObj);
												this.feeHeadJSON.push(feeObj);
												this.aggregatearray.push(new Aggregators.Sum('fh_name' + j));
												j++;
											}
											if (key2 === 'pay_name') {
												obj['id'] = repoArray[Number(keys)]['pay_name'] + keys;
												obj['fh_name'] = repoArray[Number(keys)]['fh_name'] ?
													repoArray[Number(keys)]['fh_name'] : '-';
												obj[key2 + k] = titem['total_amount'] ? Number(titem['total_amount']) : 0;
												k++;
												total_row_amt = total_row_amt + titem['total_amount'] ? Number(titem['total_amount']) : 0;
											}


										});
									}

								}
							}
							i++;
							this.dataset.push(obj);
						});
						this.totalRow = {};
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['fh_name'] = this.common.htmlToText('<div class="grand_total_class"><b>Grand Total</b></div>');;
						Object.keys(feeHead).forEach((key: any) => {
							Object.keys(feeHead[key]).forEach(key2 => {
								Object.keys(this.dataset).forEach(key3 => {
									Object.keys(this.dataset[key3]).forEach(key4 => {
										if (key4 === key2) {
											obj3[key2] = new IndianCurrency().transform(this.dataset.map(t => t[key2]).reduce((acc, val) => acc + val, 0));
										}
									});
								});
							});
						});

						this.totalRow = obj3;
						if (this.dataset.length <= 5) {
							this.gridHeight = 350;
						} else if (this.dataset.length <= 10 && this.dataset.length > 5) {
							this.gridHeight = 450;
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
			} else if (this.reportType === "cumulativeheadwise") {
				const collectionJSON: any = {
					'admission_no': '',
					'studentName': '',
					'report_type': value.report_type,
					'feeHeadId': value.fee_value,
					//'from_date': value.from_date,
					//'to_date': value.to_date,
					'pageSize': '10',
					'pageIndex': '0',
					'filterReportBy': 'collection',
					'login_id': value.login_id,
					'orderBy': value.orderBy,
					'downloadAll': true
				};
				this.feeService.getHeadWiseCollection(collectionJSON).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.common.showSuccessErrorMessage('Report Data Fetched Successfully', 'success');
						repoArray = result.data.reportData;
						this.totalRecords = Number(result.data.totalRecords);
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
										id: 'invoice_created_date', name: 'Trans. Date', field: 'invoice_created_date',
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
										name: 'Reciept No.',
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
										id: 'inv_opening_balance', name: 'Opening Balance (₹)', field: 'inv_opening_balance',
										filterable: true,
										cssClass: 'amount-report-fee',
										filterSearchType: FieldType.number,
										filter: { model: Filters.compoundInputNumber },
										sortable: true,
										formatter: this.checkFeeFormatter,
										groupTotalsFormatter: this.sumTotalsFormatter
									}];
							}
							if (repoArray[Number(keys)]['fee_head_data'].length > 0) {
								let k = 0;
								let tot = 0;
								for (const titem of repoArray[Number(keys)]['fee_head_data']) {
									Object.keys(titem).forEach((key2: any) => {
										if (key2 === 'fh_name' && Number(keys) === 0) {
											const feeObj: any = {};
											this.columnDefinitions.push({
												id: 'fh_name' + j,
												name: new CapitalizePipe().transform(titem[key2]) + ' (₹)',
												field: 'fh_name' + j,
												cssClass: 'amount-report-fee',
												sortable: true,
												filterable: true,
												filterSearchType: FieldType.number,
												filter: { model: Filters.compoundInput },
												formatter: this.checkFeeFormatter,
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
											obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(keys)]['stu_full_name']);
											obj['tag_name'] = repoArray[Number(keys)]['tag_name'] ? new CapitalizePipe().transform(repoArray[Number(keys)]['tag_name']) : '-';
											if (repoArray[Number(keys)]['stu_sec_id'] !== '0') {
												obj['stu_class_name'] = repoArray[Number(keys)]['stu_class_name'] + '-' +
													repoArray[Number(keys)]['stu_sec_name'];
											} else {
												obj['stu_class_name'] = repoArray[Number(keys)]['stu_class_name'];
											}
											obj['receipt_id'] = repoArray[Number(keys)]['rpt_id'] ?
												repoArray[Number(keys)]['rpt_id'] : '-';
											obj['invoice_created_date'] = repoArray[Number(keys)]['ftr_transaction_date'];
											obj['fp_name'] = repoArray[Number(keys)]['fp_name'] ?
												repoArray[Number(keys)]['fp_name'] : '-';
											obj['receipt_no'] = repoArray[Number(keys)]['receipt_no'] ?
												repoArray[Number(keys)]['receipt_no'] : '-';
											obj[key2 + k] = titem['fh_amt'] ? Number(titem['fh_amt']) : 0;
											tot = tot + (titem['fh_amt'] ? Number(titem['fh_amt']) : 0);
											obj['inv_opening_balance'] = repoArray[Number(keys)]['inv_opening_balance']
												? Number(repoArray[Number(keys)]['inv_opening_balance']) : 0;
											obj['invoice_fine_amount'] = repoArray[Number(keys)]['invoice_fine_amount']
												? Number(repoArray[Number(keys)]['invoice_fine_amount']) : 0;
											obj['total'] = repoArray[Number(keys)]['invoice_amount']
												? Number(repoArray[Number(keys)]['invoice_amount']) : 0;
											obj['receipt_mode_name'] = repoArray[Number(keys)]['pay_name'] ?
												repoArray[Number(keys)]['pay_name'] : '-';
											obj['tb_name'] = repoArray[Number(keys)]['tb_name'] ?
												repoArray[Number(keys)]['tb_name'] : '-';

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
								id: 'invoice_fine_amount', name: 'Fine Amount (₹)', field: 'invoice_fine_amount',
								filterable: true,
								filterSearchType: FieldType.number,
								filter: { model: Filters.compoundInputNumber },
								sortable: true,
								formatter: this.checkFeeFormatter,
								groupTotalsFormatter: this.sumTotalsFormatter
							},
							{
								id: 'total', name: 'Total (₹)', field: 'total',
								filterable: true,
								filterSearchType: FieldType.number,
								filter: { model: Filters.compoundInputNumber },
								sortable: true,
								formatter: this.checkTotalFormatter,
								cssClass: 'amount-report-fee',
								groupTotalsFormatter: this.sumTotalsFormatter
							},
							{
								id: 'receipt_mode_name', name: 'Mode', field: 'receipt_mode_name', sortable: true, filterable: true,
								filterSearchType: FieldType.string,
								filter: { model: Filters.compoundInputText },
								width: 100,
								grouping: {
									getter: 'receipt_mode_name',
									formatter: (g) => {
										return `${g.value}  <span style="color:green">(${g.count})</span>`;
									},
									aggregators: this.aggregatearray,
									aggregateCollapsed: true,
									collapsed: false
								},
							},
							{
								id: 'tb_name', name: 'Bank Name', field: 'tb_name', sortable: true, filterable: true,
								filterSearchType: FieldType.string,
								filter: { model: Filters.compoundInputText },
								width: 100,
								grouping: {
									getter: 'tb_name',
									formatter: (g) => {
										return `${g.value}  <span style="color:green">(${g.count})</span>`;
									},
									aggregators: this.aggregatearray,
									aggregateCollapsed: true,
									collapsed: false
								},
							}
						);
						this.aggregatearray.push(new Aggregators.Sum('inv_opening_balance'));
						this.aggregatearray.push(new Aggregators.Sum('inv_prev_balance'));
						this.aggregatearray.push(new Aggregators.Sum('invoice_fine_amount'));
						this.aggregatearray.push(new Aggregators.Sum('total'));
						this.aggregatearray.push(new Aggregators.Sum('srno'));
						this.totalRow = {};
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = 'Grand Total';
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_id'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['inv_opening_balance'] =
							new IndianCurrency().transform(this.dataset.map(t => t.inv_opening_balance).reduce((acc, val) => acc + val, 0));
						obj3['invoice_fine_amount'] =
							new IndianCurrency().transform(this.dataset.map(t => t.invoice_fine_amount).reduce((acc, val) => acc + val, 0));
						Object.keys(feeHead).forEach((key: any) => {
							Object.keys(feeHead[key]).forEach(key2 => {
								Object.keys(this.dataset).forEach(key3 => {
									Object.keys(this.dataset[key3]).forEach(key4 => {
										if (key4 === key2) {
											obj3[key2] = new IndianCurrency().transform(this.dataset.map(t => t[key2]).reduce((acc, val) => acc + val, 0));
										}
									});
								});
							});
						});
						obj3['total'] = new IndianCurrency().transform(this.dataset.map(t => t.total).reduce((acc, val) => acc + val, 0));
						obj3['receipt_mode_name'] = '';
						obj3['tb_name'] = '';
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
			this.selectedGroupingFields.forEach((g, i) => {
				this.selectedGroupingFields[i] = groups[i] && groups[i].getter || '';
			});
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
			if (item['receipt_id'] !== '-') {
				this.openDialogReceipt(item['receipt_id'], false);
			}
		}
		if (e.target.className === 'invoice-span-mfr2') {
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
		if (val != null && totals.group.rows[0].invoice_created_date !== '<b>Grand Total</b>') {
			return '<b class="total-footer-report">' + new IndianCurrency().transform(((Math.round(parseFloat(val) * 100) / 100))) + '</b>';
		}
		return '';
	}
	checkFeeFormatter(row, cell, value, columnDef, dataContext) {
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
	checkTotalFormatter(row, cell, value, columnDef, dataContext) {
		if (value === 0) {
			return '-';
		} else {
			return new IndianCurrency().transform(value);
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
		if (value) {
			if (value.status === 'unpaid') {
				return '<div style="background-color:#4a7bec !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
					+ '<span class="invoice-span-mfr">' + value.inv_invoice_no + '</span>' +
					'<span class="invoice-span-mfr2">' + value.invoice_id + '</span>' + '</div>';
			} else if (value.status === 'paid') {
				return '<div style="background-color:#29A341 !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
					+ '<span class="invoice-span-mfr">' + value.inv_invoice_no + '</span>' +
					'<span class="invoice-span-mfr2">' + value.invoice_id + '</span>' + '</div>';
			} else if (value.status === 'Not Generated') {
				return '<div style="background-color:#d2d8e0 !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;' +
					'border-right: 1px solid #89a8c8; border-top: 0px !important;' +
					'border-bottom: 0px !important; border-left: 0px !important; margin: auto;">'
					+ '<span style="margin-left:40px">' + '-' + '</span>' +
					'<span>' + '' + '</span>' + '</div>';
			} else if (value.status === 'Unpaid with fine') {
				return '<div style="background-color:#f93435 !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
					+ '<span class="invoice-span-mfr">' + value.inv_invoice_no + '</span>' +
					'<span class="invoice-span-mfr2">' + value.invoice_id + '</span>' + '</div>';
			} else {
				return '<div style="background-color:#7bd450 !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
					+ '<span class="invoice-span-mfr">' + value.inv_invoice_no + '</span>' +
					'<span class="invoice-span-mfr2">' + value.invoice_id + '</span>' + '</div>';
			}
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
		
		//console.log('this.sessionName', this.sessionName);
		//Number(this.sessionName.split('-')[0]) < Number(new Date().getFullYear())
		var currentYear = Number(new Date().getFullYear());
		var sessionStartYear = Number(this.sessionName.split('-')[0]);
		var sessionEndYear = Number(this.sessionName.split('-')[1]);
		var sessionStartMonth = Number(this.schoolInfo.session_start_month);
		var sessionEndMonth = Number(this.schoolInfo.session_end_month);
		var sessionStartDate = sessionStartYear+'-'+this.schoolInfo.session_start_month+'-'+'01';
		var sessionEndMonthLastDay = new Date(sessionEndYear, sessionEndMonth, 0).getDate();
		var sessionEndDate = sessionEndYear+'-'+this.schoolInfo.session_start_month+'-'+sessionEndMonthLastDay;
		var currentDate = new Date().getFullYear()+'-'+new Date().getMonth()+'-'+new Date().getDate();
		// console.log(currentYear);
		// console.log(sessionStartYear);
		// console.log(sessionEndYear);
		// console.log(sessionStartMonth);
		// console.log(sessionEndMonth);
		// console.log(sessionStartDate);
		// console.log(sessionEndMonthLastDay);
		// console.log(sessionEndDate);
		// console.log(currentDate, (new Date(currentDate) >= new Date(sessionStartDate))), (new Date(currentDate) <= new Date(sessionEndDate));
		if ((new Date(currentDate).getTime() >= new Date(sessionStartDate).getTime()) && (new Date(currentDate).getTime() <= new Date(sessionEndDate).getTime())) {
			console.log('in');
			var currentMonth = new Date().getMonth();
			var currentSessionYear = '';
			if (currentMonth >= 1 && currentMonth <= sessionEndMonth) {
				currentSessionYear = this.sessionName.split('-')[1];
			} else {
				currentSessionYear = this.sessionName.split('-')[0];
			}
			const date = new Date(Number(currentSessionYear), new Date().getMonth(), new Date().getDate());
			const firstDay = new Date(Number(currentSessionYear), new Date().getMonth(), 1);
			this.reportFilterForm.patchValue({
				'from_date': firstDay,
				'to_date': date
			});
		} else {
			console.log('in1');
			const date2 = new Date(Number(this.sessionName.split('-')[0]) + 1, Number(this.schoolInfo.session_end_month), 0);
			const firstDay2 = new Date(this.sessionName.split('-')[0], Number(this.schoolInfo.session_start_month) - 1, 1);
			this.reportFilterForm.patchValue({
				'from_date': firstDay2,
				'to_date': date2
			});
		}
		// if () {
		// 	const date2 = new Date(Number(this.sessionName.split('-')[0]) + 1, Number(this.schoolInfo.session_end_month), 0);
		// 	const firstDay2 = new Date(this.sessionName.split('-')[0], Number(this.schoolInfo.session_start_month) - 1, 1);
		// 	this.reportFilterForm.patchValue({
		// 		'from_date': firstDay2,
		// 		'to_date': date2
		// 	});
		// } else {
		// 	const date = new Date(this.sessionName.split('-')[0], new Date().getMonth(), new Date().getDate());
		// 	const firstDay = new Date(this.sessionName.split('-')[0], new Date().getMonth(), 1);
		// 	this.reportFilterForm.patchValue({
		// 		'from_date': firstDay,
		// 		'to_date': date
		// 	});
		// }
		if ($event.value) {
			this.displyRep.emit({ report_index: 1, report_id: $event.value, report_name: this.getReportName($event.value) });
			if ($event.value === 'headwise' || $event.value === 'cumulativeheadwise') {
				this.filterFlag = true;
				this.valueLabel = 'Fee Heads';
				this.getFeeHeads();
			} else if ($event.value === 'classwise') {
				this.filterFlag = true;
				this.valueLabel = 'Class';
				this.getClass();
			} else if ($event.value === 'modewise') {
				this.filterFlag = true;
				this.valueLabel = 'Modes';
				this.getModes();
			} else if ($event.value === 'routewise') {
				this.filterFlag = true;
				this.valueLabel = 'Routes';
				this.getRoutes();
			} else if ($event.value === 'mfr') {
				this.filterFlag = true;
				this.reportFilterForm.patchValue({
					'from_date': '',
					'to_date': ''
				});
				this.valueLabel = 'Class';
				this.getClass();
			} else {
				this.filterFlag = false;
			}
		} else {
			this.displyRep.emit({ report_index: 1, report_id: '', report_name: 'Collection Report' });
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
	getLevelFooter(level, groupItem) {
		if (level === 0) {
			return 'Total';
		} else if (level > 0) {
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
						obj3['tb_name'] = '';
					}
					if (this.reportType === 'modewise') {
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_id'] = '';
						obj3['receipt_no'] = '';
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
						obj3['fp_name'] = '';
					}
					if (this.reportType === 'classwise') {
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_no'] = '';
						obj3['rpt_amount'] = groupItem.rows.map(t => t['rpt_amount']).reduce((acc, val) => acc + val, 0);
						obj3['fp_name'] = '';
					}
					if (this.reportType === 'routewise') {
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['transport_amount'] = groupItem.rows.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0);
						obj3['route_name'] = '';
						obj3['stoppages_name'] = '';
						obj3['slab_name'] = '';
					}
					if (this.reportType === 'mfr') {
						obj3['id'] = '';
						obj3['srno'] = '';
						obj3['au_login_id'] = '';
						obj3['stu_opening_balance'] = groupItem.rows.map(t => t['stu_opening_balance']).reduce((acc, val) => acc + val, 0);
						obj3['stu_admission_no'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_full_name'] = groupItem.rows.length;
						obj3['stu_class_name'] = '';
						obj3['fp_name'] = '';
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
								if (item2.id !== 'invoice_created_date' && item2.id === 'fp_name') {
									obj[item2.id] = this.common.htmlToText(groupItem.rows[key][item2.id]);
								}
							} else {
								if (item2.id.toString().match(/Q/)) {
									obj[item2.id] = groupItem.rows[key][item2.id].status !== 'Not Generated' ? groupItem.rows[key][item2.id].status
										: '-';
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
						obj3['tb_name'] = '';
					}
					if (this.reportType === 'modewise') {
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_id'] = '';
						obj3['receipt_no'] = '';
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
						obj3['fp_name'] = '';
					}
					if (this.reportType === 'classwise') {
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_no'] = '';
						obj3['rpt_amount'] = groupItem.rows.map(t => t['rpt_amount']).reduce((acc, val) => acc + val, 0);
						obj3['fp_name'] = '';
					}
					if (this.reportType === 'routewise') {
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['transport_amount'] = groupItem.rows.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0);
						obj3['route_name'] = '';
						obj3['stoppages_name'] = '';
						obj3['slab_name'] = '';
					}
					if (this.reportType === 'mfr') {
						obj3['id'] = '';
						obj3['srno'] = '';
						obj3['au_login_id'] = '';
						obj3['stu_opening_balance'] = groupItem.rows.map(t => t['stu_opening_balance']).reduce((acc, val) => acc + val, 0);
						obj3['stu_admission_no'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_full_name'] = groupItem.rows.length;
						obj3['stu_class_name'] = '';
						obj3['fp_name'] = '';
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
		if (this.reportType === 'headwise') {
			reportType = new TitleCasePipe().transform('head wise_') + this.sessionName;
		} else if (this.reportType === 'classwise') {
			reportType = new TitleCasePipe().transform('class wise_') + this.sessionName;
		} else if (this.reportType === 'modewise') {
			reportType = new TitleCasePipe().transform('mode wise_') + this.sessionName;
		} else if (this.reportType === 'routewise') {
			reportType = new TitleCasePipe().transform('route wise_') + this.sessionName;
		} else if (this.reportType === 'mfr') {
			reportType = new TitleCasePipe().transform('monthly fee_') + this.sessionName;
		}
		else if (this.reportType === 'summary') {
			reportType = new TitleCasePipe().transform('summaryfee_') + this.sessionName;
		}
		let reportType2: any = '';
		this.sessionName = this.getSessionName(this.session.ses_id);
		if (this.reportType === 'headwise') {
			reportType2 = new TitleCasePipe().transform('head wise collection report: ') + this.sessionName;
		} else if (this.reportType === 'classwise') {
			reportType2 = new TitleCasePipe().transform('class wise collection report: ') + this.sessionName;
		} else if (this.reportType === 'modewise') {
			reportType2 = new TitleCasePipe().transform('mode wise collection report: ') + this.sessionName;
		} else if (this.reportType === 'routewise') {
			reportType2 = new TitleCasePipe().transform('route wise collection report: ') + this.sessionName;
		} else if (this.reportType === 'mfr') {
			reportType2 = new TitleCasePipe().transform('monthly fee report: ') + this.sessionName;
		}
		else if (this.reportType === 'summary') {
			reportType2 = new TitleCasePipe().transform('collection summary report: ') + this.sessionName;
		}
		const fileName = reportType + '.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } });
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
					//console.log(item2, 'item2');
					if (this.reportType === 'summary' && this.dataset[key][item2.id] !== '<b>Grand Total</b>') {
						if (item2.id !== 'fh_name' && this.dataset[key][item2.id] !== '<b>Grand Total</b>') {
							obj[item2.id] = new IndianCurrency().transform(Number(json[key][item2.id]));
						}
						if (item2.id !== 'invoice_created_date' && item2.id === 'fh_name') {
							obj[item2.id] = this.common.htmlToText(json[key][item2.id]);
						}

					}
					if (this.reportType !== 'mfr' && this.reportType !== 'summary' && this.dataset[key][item2.id] !== '<b>Grand Total</b>') {
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
					} else if (this.reportType === 'mfr' && this.dataset[key][item2.id] !== '<b>Grand Total</b>') {
						if (item2.id.toString().match(/Q/)) {
							obj[item2.id] = json[key][item2.id].status !== 'Not Generated' ? json[key][item2.id].status : '-';
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
					cell.alignment = { horizontal: 'center' };
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
	exportToFile(type = 'csv') {
		let reportType: any = '';
		this.sessionName = this.getSessionName(this.session.ses_id);
		if (this.reportType === 'headwise') {
			reportType = new TitleCasePipe().transform('head wise collection report: ') + this.sessionName;
		} else if (this.reportType === 'classwise') {
			reportType = new TitleCasePipe().transform('class wise collection report: ') + this.sessionName;
		} else if (this.reportType === 'modewise') {
			reportType = new TitleCasePipe().transform('mode wise collection report: ') + this.sessionName;
		} else if (this.reportType === 'routewise') {
			reportType = new TitleCasePipe().transform('route wise collection report: ') + this.sessionName;
		} else if (this.reportType === 'mfr') {
			reportType = new TitleCasePipe().transform('monthly fee report: ') + this.sessionName;
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
	checkWidth(id, header) {
		const res = this.dataset.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
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
			reportType = new TitleCasePipe().transform('head wise collection report: ') + this.sessionName;
		} else if (this.reportType === 'classwise') {
			reportType = new TitleCasePipe().transform('class wise collection report: ') + this.sessionName;
		} else if (this.reportType === 'modewise') {
			reportType = new TitleCasePipe().transform('mode wise collection report: ') + this.sessionName;
		} else if (this.reportType === 'routewise') {
			reportType = new TitleCasePipe().transform('route wise collection report: ') + this.sessionName;
		} else if (this.reportType === 'mfr') {
			reportType = new TitleCasePipe().transform('monthly fee report: ') + this.sessionName;
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
					if (this.reportType === 'summary') {
						if (item2.id !== 'fh_name' && this.dataset[key][item2.id] !== '<b>Grand Total</b>') {
							arr.push(new IndianCurrency().transform(Number(json[key][item2.id])));
						}
						if (item2.id !== 'invoice_created_date' && item2.id === 'fh_name') {
							arr.push(this.common.htmlToText(json[key][item2.id]));
						}
					}
					if (this.reportType !== 'mfr' && this.reportType !== 'summary') {
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
					} else if (this.reportType === 'mfr') {
						if (item2.id.toString().match(/Q/)) {
							arr.push(this.dataset[key][item2.id].status);
						} else {
							arr.push(this.dataset[key][item2.id]);
						}
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
		doc.save(reportType + '_' + new Date() + '.pdf');
	}
	countTotalsFormatter(totals, columnDef) {
		return '<b class="total-footer-report">' + totals.group.rows.length + '</b>';
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
						obj3['bank_name'] = '';
						obj3['total'] = groupItem.rows.map(t => t.total).reduce((acc, val) => acc + val, 0);
						obj3['receipt_mode_name'] = '';
						obj3['tb_name'] = '';
						for (const col of this.exportColumnDefinitions) {
							Object.keys(obj3).forEach((key: any) => {
								if (col.id === key) {
									levelArray.push(obj3[key]);
								}
							});
						}
					}
					if (this.reportType === 'modewise') {
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_id'] = '';
						obj3['receipt_no'] = '';
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
						obj3['fp_name'] = '';
						for (const col of this.exportColumnDefinitions) {
							Object.keys(obj3).forEach((key: any) => {
								if (col.id === key) {
									levelArray.push(obj3[key]);
								}
							});
						}
					}
					if (this.reportType === 'classwise') {
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_no'] = '';
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
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
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
						obj3['bank_name'] = '';
						obj3['total'] = groupItem.rows.map(t => t.total).reduce((acc, val) => acc + val, 0);
						obj3['receipt_mode_name'] = '';
						obj3['tb_name'] = '';
						for (const col of this.exportColumnDefinitions) {
							Object.keys(obj3).forEach((key: any) => {
								if (col.id === key) {
									levelArray.push(obj3[key]);
								}
							});
						}
					}
					if (this.reportType === 'modewise') {
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_id'] = '';
						obj3['receipt_no'] = '';
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
						obj3['fp_name'] = '';
						for (const col of this.exportColumnDefinitions) {
							Object.keys(obj3).forEach((key: any) => {
								if (col.id === key) {
									levelArray.push(obj3[key]);
								}
							});
						}
					}
					if (this.reportType === 'classwise') {
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_no'] = '';
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
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
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
					// style row having total
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
