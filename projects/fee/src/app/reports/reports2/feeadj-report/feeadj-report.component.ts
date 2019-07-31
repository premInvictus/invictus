import { Component, OnInit, Input } from '@angular/core';
import {
	GridOption, Column, AngularGridInstance, Grouping, Aggregators,
	FieldType,
	Filters,
	Formatters,
	DelimiterType,
	FileType
} from 'angular-slickgrid';
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
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as ExcelProper from 'exceljs';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';
@Component({
	selector: 'app-feeadj-report',
	templateUrl: './feeadj-report.component.html',
	styleUrls: ['./feeadj-report.component.css']
})
export class FeeadjReportComponent implements OnInit {
	@Input() userName: any = '';
	feeHeadJson: any[] = [];
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
	groupColumns: any[] = [];
	groupLength: any;
	sessionName: any;
	schoolInfo: any = {};
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
		this.filterFlag = true;
		this.getFeeAdjReport(this.reportFilterForm.value);
	}
	angularGridReady(angularGrid: AngularGridInstance) {
		this.angularGrid = angularGrid;
		this.gridObj = angularGrid.slickGrid; // grid object
		this.dataviewObj = angularGrid.dataView;
	}
	getSchool() {
		this.sisService.getSchool().subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.schoolInfo = res.data[0];
				console.log(this.schoolInfo);
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
			}
		});
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

	getFeeAdjReport(value: any) {
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
			'secId': value.hidden_value,
			'downloadAll': true,
			'login_id': value.login_id,
			'orderBy': value.orderBy
		};
		this.feeService.getFeeAdjustmentReport(collectionJSON).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.common.showSuccessErrorMessage(result.message, 'success');
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
								maxWidth: 40
							},
							{
								id: 'stu_admission_no', name: 'Enrollment No', field: 'stu_admission_no',
								sortable: true,
								filterable: true,
								grouping: {
									getter: 'stu_admission_no',
									formatter: (g) => {
										return `${g.value}  <span style="color:green"> [${g.count} records]</span>`;
									},
									aggregators: this.aggregatearray,
									aggregateCollapsed: true,
									collapsed: false,
								},
								filterSearchType: FieldType.string,
								filter: { model: Filters.compoundInput },
								width: 80,
								groupTotalsFormatter: this.srnTotalsFormatter
							},
							{
								id: 'stu_full_name', name: 'Student Name', field: 'stu_full_name',
								sortable: true,
								filterable: true,
								width: 140,
								filterSearchType: FieldType.string,
								filter: { model: Filters.compoundInput },
								grouping: {
									getter: 'stu_full_name',
									formatter: (g) => {
										return `${g.value}  <span style="color:green">(${g.count} items)</span>`;
									},
									aggregators: this.aggregatearray,
									aggregateCollapsed: true,
									collapsed: false
								},
							},
							{
								id: 'stu_class_name', name: 'Class-Section', field: 'stu_class_name', sortable: true,
								filterable: true,
								width: 100,
								filterSearchType: FieldType.number,
								filter: { model: Filters.compoundInputNumber },
								grouping: {
									getter: 'stu_class_name',
									formatter: (g) => {
										return `${g.value}  <span style="color:green">(${g.count} items)</span>`;
									},
									aggregators: this.aggregatearray,
									aggregateCollapsed: true,
									collapsed: false,
								},
							},
							{
								id: 'invoice_no',
								name: 'Invoice No..',
								field: 'invoice_no',
								sortable: true,
								filterable: true,
								width: 40,
								grouping: {
									getter: 'invoice_no',
									formatter: (g) => {
										return `${g.value}  <span style="color:green"> [${g.count} records]</span>`;
									},
									aggregators: this.aggregatearray,
									aggregateCollapsed: true,
									collapsed: false,
								},
								filterSearchType: FieldType.number,
								filter: { model: Filters.compoundInputNumber },
								cssClass: 'fee-ledger-no',
								formatter: this.checkReceiptFormatter
							}];
					}
					if (repoArray[Number(keys)]['student_adjustment_fee_heads_data']) {
						let k = 0;
						let tot = 0;
						for (const titem of repoArray[Number(keys)]['student_adjustment_fee_heads_data']) {
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
										groupTotalsFormatter: this.sumTotalsFormatter
									});
									feeObj['fh_name' + j] = '';
									feeHead.push(feeObj);
									this.feeHeadJson.push(feeObj);
									this.aggregatearray.push(new Aggregators.Sum('fh_name' + j));
									j++;
								}
								if (key2 === 'fh_name') {
									obj['id'] = repoArray[Number(keys)]['au_admission_no'] + keys +
										repoArray[Number(keys)]['inv_id'];
									obj['srno'] = (collectionJSON.pageSize * collectionJSON.pageIndex) +
										(Number(keys) + 1);
									obj['stu_admission_no'] = repoArray[Number(keys)]['au_admission_no'] ?
										repoArray[Number(keys)]['au_admission_no'] : '-';
									obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(keys)]['au_full_name']);
									if (repoArray[Number(keys)]['au_sec_id'] !== '0') {
										obj['stu_class_name'] = repoArray[Number(keys)]['class_name'] + '-' +
											repoArray[Number(keys)]['sec_name'];
									} else {
										obj['stu_class_name'] = repoArray[Number(keys)]['class_name'];
									}
									obj['inv_id'] = repoArray[Number(keys)]['inv_id'];
									obj['invoice_no'] = repoArray[Number(keys)]['inv_invoice_no'] ? repoArray[Number(keys)]['inv_invoice_no'] : '-';
									obj[key2 + k] = titem['invg_adj_amount'] ? Number(titem['invg_adj_amount']) : 0;
									tot = tot + (titem['invg_adj_amount'] ? Number(titem['invg_adj_amount']) : 0);
									obj['adjusted_by'] =
										repoArray[Number(keys)]['adjusted_by'] ? new CapitalizePipe().transform(repoArray[Number(keys)]['adjusted_by']) : '-';
									obj['adjustment_date'] = repoArray[Number(keys)]['adjustment_date'];
									obj['invg_adj_amount'] = repoArray[Number(keys)]['invg_adj_amount'] ?
										Number(repoArray[Number(keys)]['invg_adj_amount']) : 0;
									obj['inv_remark'] =
										repoArray[Number(keys)]['inv_remark'] ? new CapitalizePipe().transform(repoArray[Number(keys)]['inv_remark']) : '-';
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
						id: 'adjustment_date', name: 'Adj. Date', field: 'adjustment_date', sortable: true,
						filterable: true,
						width: 100,
						formatter: this.checkDateFormatter,
						filter: { model: Filters.compoundDate },
						filterSearchType: FieldType.dateIso,
						grouping: {
							getter: 'adjustment_date',
							formatter: (g) => {
								return `${new DatePipe('en-in').transform(g.value, 'd-MMM-y')}  <span style="color:green">(${g.count} items)</span>`;
							},
							aggregators: this.aggregatearray,
							aggregateCollapsed: true,
							collapsed: false,
						},
					},
					{
						id: 'invg_adj_amount',
						name: 'Adj. Amount',
						field: 'invg_adj_amount',
						sortable: true,
						width: 70,
						cssClass: 'amount-report-fee',
						filterable: true,
						filterSearchType: FieldType.number,
						filter: { model: Filters.compoundInputNumber },
						groupTotalsFormatter: this.sumTotalsFormatter,
						formatter: this.checkFeeFormatter
					},
					{
						id: 'adjusted_by',
						name: 'Adj. By',
						field: 'adjusted_by',
						sortable: true,
						filterable: true,
						width: 60,
						filterSearchType: FieldType.string,
						filter: { model: Filters.compoundInput },
						grouping: {
							getter: 'adjusted_by',
							formatter: (g) => {
								return `${g.value}  <span style="color:green"> [${g.count} records]</span>`;
							},
							aggregateCollapsed: true,
							collapsed: false,
						},

					},
					{
						id: 'inv_remark',
						name: 'Adj. Remark',
						field: 'inv_remark',
						sortable: true,
						width: 60,
						filterable: true,
						filterSearchType: FieldType.string,
						filter: { model: Filters.compoundInput },
					}
				);
				this.aggregatearray.push(new Aggregators.Sum('invg_adj_amount'));
				const obj3: any = {};
				obj3['id'] = 'footer';
				obj3['srno'] = '';
				obj3['stu_admission_no'] = this.common.htmlToText('<b>Grand Total</b>');
				obj3['stu_full_name'] = '';
				obj3['stu_class_name'] = '';
				obj3['inv_id'] = '';
				obj3['invoice_no'] = '';
				Object.keys(feeHead).forEach((key: any) => {
					Object.keys(feeHead[key]).forEach(key2 => {
						Object.keys(this.dataset).forEach(key3 => {
							Object.keys(this.dataset[key3]).forEach(key4 => {
								if (key4 === key2) {
									obj3[key2] = this.dataset.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
								}
							});
						});
					});
				});
				obj3['total'] = this.dataset.map(t => t.total).reduce((acc, val) => acc + val, 0);
				obj3['adjusted_by'] = '';
				obj3['adjustment_date'] = '';
				obj3['invg_adj_amount'] = this.dataset.map(t => t['invg_adj_amount']).reduce((acc, val) => acc + val, 0);
				obj3['inv_remark'] = '';
				this.dataset.push(obj3);
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
		if (args.cell === args.grid.getColumnIndex('invoice_no')) {
			const item: any = args.grid.getDataItem(args.row);
			if (item['invoice_no'] !== '-') {
				this.renderDialog(item['inv_id'], false);
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
		return new DatePipe('en-in').transform(value, 'd-MMM-y');
	}
	srnTotalsFormatter(totals, columnDef) {
		return '<b class="total-footer-report">Total</b>';
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
		const headerData: any[] = [];
		let reportType: any = '';
		this.sessionName = this.getSessionName(this.session.ses_id);
		reportType = new TitleCasePipe().transform('fee adjustment report: ') + this.sessionName;
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
						if (item2.id === 'inv_invoice_date' || item2.id === 'adjustment_date'
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
						const obj23: any = {};
						const arr2: any[] = [];
						obj23['id'] = 'footer';
						obj23['srno'] = '';
						obj23['stu_admission_no'] = 'Total';
						obj23['stu_full_name'] = '';
						obj23['stu_class_name'] = '';
						obj23['inv_id'] = '';
						obj23['invoice_no'] = '';
						Object.keys(this.feeHeadJson).forEach((key: any) => {
							Object.keys(this.feeHeadJson[key]).forEach(key2 => {
								Object.keys(item.rows).forEach(key3 => {
									Object.keys(item.rows[key3]).forEach(key4 => {
										if (key4 === key2) {
											obj23[key2] = item.rows.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
										}
									});
								});
							});
						});
						obj23['total'] = item.rows.map(t => t.total).reduce((acc, val) => acc + val, 0);
						obj23['adjusted_by'] = '';
						obj23['adjustment_date'] = '';
						obj23['invg_adj_amount'] = item.rows.map(t => t['invg_adj_amount']).reduce((acc, val) => acc + val, 0);
						obj23['inv_remark'] = '';
						for (const itemJ of this.columnDefinitions) {
							Object.keys(obj23).forEach((key: any) => {
								if (itemJ.id === key) {
									arr2.push(obj23[key]);
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
		const obj5: any = {};
		const arr: any[] = [];
		obj5['id'] = 'footer';
		obj5['srno'] = '';
		obj5['stu_admission_no'] = 'Grand Total';
		obj5['stu_full_name'] = '';
		obj5['stu_class_name'] = '';
		obj5['inv_id'] = '';
		obj5['invoice_no'] = '';
		Object.keys(this.feeHeadJson).forEach((key: any) => {
			Object.keys(this.feeHeadJson[key]).forEach(key2 => {
				Object.keys(this.dataset).forEach(key3 => {
					Object.keys(this.dataset[key3]).forEach(key4 => {
						if (key4 === key2) {
							obj5[key2] = this.dataset.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
						}
					});
				});
			});
		});
		obj5['total'] = this.dataset.map(t => t.total).reduce((acc, val) => acc + val, 0);
		obj5['adjusted_by'] = '';
		obj5['adjustment_date'] = '';
		obj5['invg_adj_amount'] = this.dataset.map(t => t['invg_adj_amount']).reduce((acc, val) => acc + val, 0);
		obj5['inv_remark'] = '';
		for (const itemj of this.columnDefinitions) {
			Object.keys(obj5).forEach((key: any) => {
				if (itemj.id === key) {
					arr.push(obj5[key]);
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
		reportType = new TitleCasePipe().transform('fee adj_') + this.sessionName;
		let reportType2: any = '';
		reportType2 = new TitleCasePipe().transform('fee adjustment report: ') + this.sessionName;
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
					if (Number(key) < this.dataset.length - 1) {
						if (item2.id === 'inv_invoice_date' || item2.id === 'adjustment_date'
							|| item2.id === 'rpt_receipt_date') {
							obj[item2.id] = new DatePipe('en-in').transform((json[key][item2.id]));
						} else {
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
							if (Number(key) < this.dataset.length - 1) {
								if (item2.id === 'inv_invoice_date' || item2.id === 'adjustment_date'
									|| item2.id === 'rpt_receipt_date') {
									obj[item2.id] = new DatePipe('en-in').transform((item.rows[key][item2.id]));
								} else {
									obj[item2.id] = this.common.htmlToText(item.rows[key][item2.id]);
								}
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
						obj5['srno'] = '';
						obj5['stu_admission_no'] = 'Total';
						obj5['stu_full_name'] = '';
						obj5['stu_class_name'] = '';
						obj5['inv_id'] = '';
						obj5['invoice_no'] = '';
						Object.keys(this.feeHeadJson).forEach((key: any) => {
							Object.keys(this.feeHeadJson[key]).forEach(key2 => {
								Object.keys(item.rows).forEach(key3 => {
									Object.keys(item.rows[key3]).forEach(key4 => {
										if (key4 === key2) {
											obj5[key2] = item.rows.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
										}
									});
								});
							});
						});
						obj5['total'] = item.rows.map(t => t.total).reduce((acc, val) => acc + val, 0);
						obj5['adjusted_by'] = '';
						obj5['adjustment_date'] = '';
						obj5['invg_adj_amount'] = item.rows.map(t => t['invg_adj_amount']).reduce((acc, val) => acc + val, 0);
						obj5['inv_remark'] = '';
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
		obj3['srno'] = '';
		obj3['stu_admission_no'] = 'Grand Total';
		obj3['stu_full_name'] = '';
		obj3['stu_class_name'] = '';
		obj3['inv_id'] = '';
		obj3['invoice_no'] = '';
		Object.keys(this.feeHeadJson).forEach((key: any) => {
			Object.keys(this.feeHeadJson[key]).forEach(key2 => {
				Object.keys(this.dataset).forEach(key3 => {
					Object.keys(this.dataset[key3]).forEach(key4 => {
						if (key4 === key2) {
							obj3[key2] = this.dataset.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
						}
					});
				});
			});
		});
		obj3['total'] = this.dataset.map(t => t.total).reduce((acc, val) => acc + val, 0);
		obj3['adjusted_by'] = '';
		obj3['adjustment_date'] = '';
		obj3['invg_adj_amount'] = this.dataset.map(t => t['invg_adj_amount']).reduce((acc, val) => acc + val, 0);
		obj3['inv_remark'] = '';
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
		reportType = new TitleCasePipe().transform('fee adjustment  report: ') + this.sessionName;
		this.angularGrid.exportService.exportToFile({
			delimiter: (type === 'csv') ? DelimiterType.comma : DelimiterType.tab,
			filename: reportType + '_' + new Date(),
			format: (type === 'csv') ? FileType.csv : FileType.txt
		});
	}
	checkWidth(id, header) {
		const res = this.dataset.map((f) => f[id] !== '-' ? f[id].toString().length : 1);
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
							if (item2.id === 'inv_invoice_date' || item2.id === 'adjustment_date'
								|| item2.id === 'rpt_receipt_date') {
								obj[item2.id] = new DatePipe('en-in').transform((groupItem.rows[key][item2.id]));
							} else {
								obj[item2.id] = this.common.htmlToText(groupItem.rows[key][item2.id]);
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
					obj3['srno'] = '';
					obj3['stu_admission_no'] = 'Sub Total';
					obj3['stu_full_name'] = '';
					obj3['stu_class_name'] = '';
					obj3['inv_id'] = '';
					obj3['invoice_no'] = '';
					Object.keys(this.feeHeadJson).forEach((key: any) => {
						Object.keys(this.feeHeadJson[key]).forEach(key2 => {
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
					obj3['adjusted_by'] = '';
					obj3['adjustment_date'] = '';
					obj3['invg_adj_amount'] = groupItem.rows.map(t => t['invg_adj_amount']).reduce((acc, val) => acc + val, 0);
					obj3['inv_remark'] = '';
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
		obj3['srno'] = '';
		obj3['stu_admission_no'] = 'Total';
		obj3['stu_full_name'] = '';
		obj3['stu_class_name'] = '';
		obj3['inv_id'] = '';
		obj3['invoice_no'] = '';
		Object.keys(this.feeHeadJson).forEach((key: any) => {
			Object.keys(this.feeHeadJson[key]).forEach(key2 => {
				Object.keys(item.rows).forEach(key3 => {
					Object.keys(item.rows[key3]).forEach(key4 => {
						if (key4 === key2) {
							obj3[key2] = item.rows.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
						}
					});
				});
			});
		});
		obj3['total'] = item.rows.map(t => t.total).reduce((acc, val) => acc + val, 0);
		obj3['adjusted_by'] = '';
		obj3['adjustment_date'] = '';
		obj3['invg_adj_amount'] = item.rows.map(t => t['invg_adj_amount']).reduce((acc, val) => acc + val, 0);
		obj3['inv_remark'] = '';
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
					obj3['srno'] = '';
					obj3['stu_admission_no'] = 'Sub Total';
					obj3['stu_full_name'] = '';
					obj3['stu_class_name'] = '';
					obj3['inv_id'] = '';
					obj3['invoice_no'] = '';
					Object.keys(this.feeHeadJson).forEach((key: any) => {
						Object.keys(this.feeHeadJson[key]).forEach(key2 => {
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
					obj3['adjusted_by'] = '';
					obj3['adjustment_date'] = '';
					obj3['invg_adj_amount'] = groupItem.rows.map(t => t['invg_adj_amount']).reduce((acc, val) => acc + val, 0);
					obj3['inv_remark'] = '';
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
		obj3['srno'] = '';
		obj3['stu_admission_no'] = 'Total';
		obj3['stu_full_name'] = '';
		obj3['stu_class_name'] = '';
		obj3['inv_id'] = '';
		obj3['invoice_no'] = '';
		Object.keys(this.feeHeadJson).forEach((key: any) => {
			Object.keys(this.feeHeadJson[key]).forEach(key2 => {
				Object.keys(group2.rows).forEach(key3 => {
					Object.keys(group2.rows[key3]).forEach(key4 => {
						if (key4 === key2) {
							obj3[key2] = group2.rows.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
						}
					});
				});
			});
		});
		obj3['total'] = group2.rows.map(t => t.total).reduce((acc, val) => acc + val, 0);
		obj3['adjusted_by'] = '';
		obj3['adjustment_date'] = '';
		obj3['invg_adj_amount'] = group2.rows.map(t => t['invg_adj_amount']).reduce((acc, val) => acc + val, 0);
		obj3['inv_remark'] = '';
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
