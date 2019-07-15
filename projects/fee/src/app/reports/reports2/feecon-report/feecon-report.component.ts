import { Component, OnInit } from '@angular/core';
import {
	GridOption, Column, AngularGridInstance, Grouping, Aggregators,
	FieldType,
	Filters,
	Formatters
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
import * as XLSX from 'xlsx';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';
@Component({
	selector: 'app-feecon-report',
	templateUrl: './feecon-report.component.html',
	styleUrls: ['./feecon-report.component.css']
})
export class FeeconReportComponent implements OnInit {

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
	sessionArray: any[] = [];
	schoolInfo: any = {};
	session: any = {};
	sessionName: any;
	constructor(translate: TranslateService,
		private feeService: FeeService,
		private common: CommonAPIService,
		private sisService: SisService,
		public dialog: MatDialog,
		private fbuild: FormBuilder) { }

	ngOnInit() {
		this.getSchool();
		this.session = JSON.parse(localStorage.getItem('session'));
		this.buildForm();
		this.getClassData();
		this.reportTypeArray.push({
			report_type: 'concession', report_name: 'Concession Report'
		},
			{
				report_type: 'concessionAlloted', report_name: 'Concession Allotee Report'
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
	getClassName(classArray) {
		let className = '';
		for (const item of classArray) {
			for (const titem of this.classDataArray) {
				if (item === titem.class_id) {
					className = className + titem.class_name + ',';
				}
			}
		}
		return className;
	}
	getConReport(value: any) {
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
		value.from_date = new DatePipe('en-in').transform(value.from_date, 'yyyy-MM-dd');
		value.to_date = new DatePipe('en-in').transform(value.to_date, 'yyyy-MM-dd');
		this.dataArr = [];
		this.aggregatearray = [];
		this.columnDefinitions = [];
		this.dataset = [];
		this.tableFlag = false;
		let repoArray = [];
		this.columnDefinitions = [];
		this.dataset = [];
		if (this.reportType === 'concession') {
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
			this.feeService.getFeeConcessionReport(collectionJSON).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.message, 'success');
					repoArray = result.data.reportData;
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
									maxWidth: 280
								},
								{
									id: 'fcg_name',
									name: 'Concession Group.',
									field: 'fcg_name',
									sortable: true,
									filterable: true,
									filterSearchType: FieldType.string,
									filter: { model: Filters.compoundInput },
									width: 350,
									grouping: {
										getter: 'fcg_name',
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
									id: 'fcg_description',
									name: 'Description',
									field: 'fcg_description',
									sortable: true,
									filterable: true,
									filterSearchType: FieldType.string,
									filter: { model: Filters.compoundInput },
									width: 180,
								}];
						}
						if (repoArray[Number(keys)]['fcgr_fcc_id']) {
							let k = 0;
							let tot = 0;
							for (const titem of repoArray[Number(keys)]['fcgr_fcc_id']) {
								Object.keys(titem).forEach((key2: any) => {
									if (key2 === 'fcc_name' && Number(keys) === 0) {
										const feeObj: any = {};
										this.columnDefinitions.push({
											id: 'fcc_name' + j,
											name: new CapitalizePipe().transform(titem[key2]),
											field: 'fcc_name' + j,
											cssClass: 'amount-report-fee',
											sortable: true,
											filterable: true,
											filterSearchType: FieldType.number,
											filter: { model: Filters.compoundInput },
											formatter: this.checkFeeFormatter,
											groupTotalsFormatter: this.sumTotalsFormatter
										});
										feeObj['fcc_name' + j] = '';
										feeHead.push(feeObj);
										this.aggregatearray.push(new Aggregators.Sum('fcc_name' + j));
										j++;
									}
									if (key2 === 'fcc_name') {
										obj['id'] = repoArray[Number(keys)]['fcg_name'] + keys +
											repoArray[Number(keys)]['fcg_id'];
										obj['srno'] = (collectionJSON.pageSize * collectionJSON.pageIndex) +
											(Number(keys) + 1);
										obj['fcg_name'] = repoArray[Number(keys)]['fcg_name'];
										obj['fcg_description'] = repoArray[Number(keys)]['fcg_description'];
										obj[key2 + k] = titem['fcc_amount'] ? Number(titem['fcc_amount']) : 0;
										tot = tot + (titem['fcc_amount'] ? Number(titem['fcc_amount']) : 0);
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
							id: 'total', name: 'Total', field: 'total',
							filterable: true,
							filterSearchType: FieldType.number,
							filter: { model: Filters.compoundInputNumber },
							sortable: true,
							formatter: this.checkTotalFormatter,
							cssClass: 'amount-report-fee',
							groupTotalsFormatter: this.sumTotalsFormatter
						},
					);
					console.log(this.dataset);
					const obj3: any = {};
					obj3['id'] = 'footer';
					obj3['srno'] = this.common.htmlToText('<b>Grand Total</b>');
					obj3['fcg_name'] = '';
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
					this.dataset.push(obj3);
					this.tableFlag = true;
				} else {
					this.tableFlag = true;
				}
			});
		} else if (this.reportType === 'concessionAlloted') {
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
			this.feeService.getFeeConcessionAllotedReport(collectionJSON).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.message, 'success');
					this.totalRecords = Number(result.data.totalRecords);
					localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
					repoArray = result.data.reportData;
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
									width: 80
								},
								{
									id: 'stu_admission_no', name: 'Enrollment No', field: 'stu_admission_no',
									sortable: true,
									filterable: true,
									filterSearchType: FieldType.string,
									filter: { model: Filters.compoundInput },
									grouping: {
										getter: 'stu_admission_no',
										formatter: (g) => {
											return `${g.value}  <span style="color:green">(${g.count})</span>`;
										},
										aggregators: this.aggregatearray,
										aggregateCollapsed: true,
										collapsed: false,
									},
									width: 140,
								},
								{
									id: 'stu_full_name', name: 'Student Name', field: 'stu_full_name',
									sortable: true,
									filterable: true,
									filterSearchType: FieldType.string,
									filter: { model: Filters.compoundInput },
									grouping: {
										getter: 'stu_full_name',
										formatter: (g) => {
											return `${g.value}  <span style="color:green">(${g.count})</span>`;
										},
										aggregators: this.aggregatearray,
										aggregateCollapsed: true,
										collapsed: false,
									},
									width: 140,
								},
								{
									id: 'stu_class_name', name: 'Class-Section', field: 'stu_class_name',
									sortable: true,
									filterable: true,
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
									width: 140,
								},
								{
									id: 'fcg_name',
									name: 'Concession Group.',
									field: 'fcg_name',
									sortable: true,
									filterable: true,
									filterSearchType: FieldType.string,
									filter: { model: Filters.compoundInput },
									width: 350,
									grouping: {
										getter: 'fcg_name',
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
									id: 'fcg_description',
									name: 'Description',
									field: 'fcg_description',
									sortable: true,
									filterable: true,
									filterSearchType: FieldType.string,
									filter: { model: Filters.compoundInput },
									width: 180,
								}];
						}
						if (repoArray[Number(keys)]['stu_concession_arr']['fcgr_fcc_id']) {
							let k = 0;
							let tot = 0;
							for (const titem of repoArray[Number(keys)]['stu_concession_arr']['fcgr_fcc_id']) {
								Object.keys(titem).forEach((key2: any) => {
									if (key2 === 'fcc_name' && Number(keys) === 0) {
										const feeObj: any = {};
										this.columnDefinitions.push({
											id: 'fcc_name' + j,
											name: new CapitalizePipe().transform(titem[key2]),
											field: 'fcc_name' + j,
											cssClass: 'amount-report-fee',
											sortable: true,
											filterable: true,
											filterSearchType: FieldType.number,
											filter: { model: Filters.compoundInput },
											formatter: this.checkFeeFormatter,
											groupTotalsFormatter: this.sumTotalsFormatter
										});
										feeObj['fcc_name' + j] = '';
										feeHead.push(feeObj);
										this.aggregatearray.push(new Aggregators.Sum('fcc_name' + j));
										j++;
									}
									if (key2 === 'fcc_name') {
										obj['id'] = repoArray[Number(keys)]['fcg_name'] + keys +
											repoArray[Number(keys)]['fcg_id'];
										obj['srno'] = (collectionJSON.pageSize * collectionJSON.pageIndex) +
											(Number(keys) + 1);
										obj['stu_admission_no'] = repoArray[Number(keys)]['stu_admission_no'];
										obj['stu_admission_no'] = repoArray[Number(keys)]['stu_admission_no'];
										obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(keys)]['stu_full_name']);
										if (repoArray[Number(keys)]['stu_sec_id'] !== '0') {
											obj['stu_class_name'] = repoArray[Number(keys)]['stu_class_name'] + '-' +
												repoArray[Number(keys)]['stu_sec_name'];
										} else {
											obj['stu_class_name'] = repoArray[Number(keys)]['stu_class_name'];
										}
										obj['fcg_name'] = repoArray[Number(keys)]['stu_concession_arr']['fcg_name'];
										obj['fcg_description'] = repoArray[Number(keys)]['stu_concession_arr']['fcg_description'];
										obj[key2 + k] = titem['fcc_amount'] ? Number(titem['fcc_amount']) : 0;
										tot = tot + (titem['fcc_amount'] ? Number(titem['fcc_amount']) : 0);
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
							id: 'total', name: 'Total', field: 'total',
							filterable: true,
							filterSearchType: FieldType.number,
							filter: { model: Filters.compoundInputNumber },
							sortable: true,
							formatter: this.checkTotalFormatter,
							cssClass: 'amount-report-fee',
							groupTotalsFormatter: this.sumTotalsFormatter
						},
					);
					const obj3: any = {};
					obj3['id'] = 'footer';
					obj3['srno'] = this.common.htmlToText('<b>Grand Total</b>');
					obj3['stu_admission_no'] = '';
					obj3['stu_full_name'] = '';
					obj3['stu_class_name'] = '';
					obj3['fcg_name'] = '';
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
					this.dataset.push(obj3);
					this.tableFlag = true;
				} else {
					this.tableFlag = true;
				}
			});
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
				this.openDialogReceipt(item['receipt_no'], false);
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
	checkFeeHeadFormatter(row, cell, value, columnDef, dataContext) {
		console.log(value);
		return value;
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
			return value;
		}
	}
	srnTotalsFormatter(totals, columnDef) {
		return '<b class="total-footer-report">Total</b>';
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
				for (const item of this.classDataArray) {
					this.valueArray.push({
						id: item.class_id,
						name: item.class_name
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
			if ($event.value === 'concession') {
				this.filterFlag = false;
				this.getConReport(this.reportFilterForm.value);
			} else if ($event.value === 'concessionAlloted') {
				this.valueLabel = 'Class';
				this.filterFlag = true;
				this.getClassData();
			}
		} else {
			this.filterFlag = false;
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
	getSectionByClass($event) {
		this.hiddenValueArray4 = [];
		this.sisService.getSectionsByClass({ class_id: $event.value }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				for (const item of result.data) {
					this.hiddenValueArray4.push({
						id: item.sec_id,
						name: item.sec_name
					});
				}
			}
		});
	}
	exportToExcel(json: any[], excelFileName: string): void {
		const rowData: any[] = [];
		Object.keys(json).forEach(key => {
			const obj: any = {};
			Object.keys(json[key]).forEach(key2 => {
				if (key2 !== 'id' && key2 !== 'receipt_id' && key2 !== 'fp_name') {
					obj[key2] = json[key][key2];
				} else if (key2 !== 'id' && key2 !== 'receipt_id' && key2 === 'fp_name') {
					obj[key2] = json[key][key2];
				}
			});
			rowData.push(obj);
		});
		console.log(rowData);
		console.log(XLSX.utils.json_to_sheet(rowData));
		const fileName = 'test.xlsx';
		const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rowData);
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'test');

		XLSX.writeFile(wb, fileName);
	}
	exportAsPDF() {
		const headerData: any[] = [];
		let reportType: any = '';
		this.sessionName = this.getSessionName(this.session.ses_id);
		if (this.reportType === 'concession') {
			reportType = new TitleCasePipe().transform('concession report: ') + this.sessionName;
		} else if (this.reportType === 'concessionAlloted') {
			reportType = new TitleCasePipe().transform('concession allottee report: ') + this.sessionName;
		}
		let rowData: any[] = [];
		for (const item of this.columnDefinitions) {
			headerData.push(item.name);
		}
		if (this.dataviewObj.getGroups().length === 0) {
			Object.keys(this.dataset).forEach(key => {
				const arr: any[] = [];
				Object.keys(this.dataset[key]).forEach(key2 => {
					console.log(key2);
					if (key2 !== 'id' && key2 !== 'receipt_id') {
						arr.push(this.common.htmlToText(this.dataset[key][key2]));
					}
				});
				rowData.push(arr);
			});
			console.log(headerData);
			console.log(rowData);
			const doc = new jsPDF('l', 'mm', 'a0');
			doc.autoTable({
				head: [[new TitleCasePipe().transform(this.schoolInfo.school_name)]],
				didDrawPage: function (data) {
					doc.setFont('Roboto');
				},
				headerStyles: {
					fontStyle: 'bold',
					fillColor: '#ffffff',
					textColor: 'black',
					halign: 'center',
					fontSize: 60,
				},
				useCss: true,
				theme: 'striped'
			});
			doc.autoTable({
				head: [[this.schoolInfo.school_city + ',' + this.schoolInfo.school_state]],
				margin: { top: 20 },
				didDrawPage: function (data) {
					doc.setFont('Roboto');
				},
				headerStyles: {
					fontStyle: 'normal',
					fillColor: '#ffffff',
					textColor: 'black',
					halign: 'center',
					fontSize: 45,
				},
				useCss: true,
				theme: 'striped'
			});
			doc.autoTable({
				head: [[reportType]],
				margin: { top: 20 },
				didDrawPage: function (data) {
					doc.setFont('Roboto');
				},
				headerStyles: {
					fontStyle: 'bold',
					fillColor: '#ffffff',
					textColor: 'black',
					halign: 'center',
					fontSize: 60,
				},
				useCss: true,
				theme: 'striped'
			});
			doc.autoTable({
				head: [headerData],
				body: rowData,
				startY: 120,
				margin: { top: 80 },
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
					fontSize: 26,
				},
				alternateRowStyles: {
					fillColor: '#f3f3f3'
				},
				useCss: true,
				styles: {
					fontSize: 35,
					cellWidth: 'auto',
					textColor: 'black',
					lineColor: 'red',
				},
				theme: 'striped'
			});
			doc.save(reportType + '_' + new Date() + '.pdf');
		} else {
			const doc = new jsPDF('l', 'mm', 'a0');
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
			for (const item of this.dataviewObj.getGroups()) {
				rowData = [];
				Object.keys(item.rows).forEach(key => {
					const arr: any[] = [];
					Object.keys(item.rows[key]).forEach(key2 => {
						if (key2 !== 'id' && key2 !== 'receipt_id' && key2 !== 'fp_name' && key2 !== 'invoice_created_date') {
							arr.push(item.rows[key][key2]);
						} else if (key2 !== 'id' && key2 !== 'receipt_id' &&
							key2 !== 'invoice_created_date' && key2 === 'fp_name') {
							arr.push(item.rows[key][key2][0]);
						}
					});
					rowData.push(arr);
				});
				doc.autoTable({
					head: [[this.common.htmlToText(item.title)]],
					body: rowData,
					headerStyles: {
						fontStyle: 'bold',
						fillColor: '#bebebe',
						textColor: 'black',
						halign: 'left',
					},
					alternateRowStyles: {
						fillColor: '#f3f3f3'
					},
					useCss: true,
					styles: {
						fontSize: 22,
						cellWidth: 4,
					},
					theme: 'striped',
				});
			}
			doc.save('table.pdf');
			console.log(rowData);
		}
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

}
