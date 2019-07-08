import { Component, OnInit } from '@angular/core';
import {
	GridOption, Column, AngularGridInstance, Grouping, Aggregators,
	FieldType,
	Filters,
	Formatters
} from 'angular-slickgrid';
import { TranslateService } from '@ngx-translate/core';
import { FeeService, CommonAPIService, SisService } from '../../../_services';
import { DecimalPipe, DatePipe } from '@angular/common';
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
	selector: 'app-collection-report',
	templateUrl: './collection-report.component.html',
	styleUrls: ['./collection-report.component.css']
})
export class CollectionReportComponent implements OnInit {
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
	schoolInfo: any = {};
	constructor(translate: TranslateService,
		private feeService: FeeService,
		private common: CommonAPIService,
		private sisService: SisService,
		public dialog: MatDialog,
		private fbuild: FormBuilder) { }

	ngOnInit() {
		this.getSchool();
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
			});
		this.reportType = 'headwise';
		const date = new Date();
		const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		this.reportFilterForm.patchValue({
			'from_date': firstDay,
			'to_date': new Date()
		});
		this.filterFlag = true;
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
	resetValues() {
		this.reportFilterForm.patchValue({
			'login_id': '',
			'orderBy': ''
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
												return `${g.value} <span style="color:green"> [${g.count} records]</span>`;
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
												return `${g.value}  <span style="color:green">(${g.count} items)</span>`;
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
												return `${g.value}  <span style="color:green">(${g.count} items)</span>`;
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
													return `${new DatePipe('en-in').transform(g.value, 'd-MMM-y')}  <span style="color:green">(${g.count} items)</span>`;
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
										sortable: true,
										width: 70,
										filterable: true,
										filterSearchType: FieldType.number,
										filter: { model: Filters.compoundInputNumber },
										formatter: this.checkReceiptFormatter,
										cssClass: 'receipt_collection_report'
									},
									{
										id: 'inv_opening_balance', name: 'Opening Balance', field: 'inv_opening_balance',
										filterable: true,
										cssClass: 'amount-report-fee',
										filterSearchType: FieldType.number,
										filter: { model: Filters.compoundInputNumber },
										sortable: true,
										formatter: this.checkFeeFormatter,
										groupTotalsFormatter: this.sumTotalsFormatter
									}];
							}
							if (repoArray[Number(keys)]['fee_head_data']) {
								let k = 0;
								let tot = 0;
								for (const titem of repoArray[Number(keys)]['fee_head_data']) {
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
											obj['receipt_id'] = repoArray[Number(keys)]['rpt_id'] ?
												repoArray[Number(keys)]['rpt_id'] : '-';
											obj['invoice_created_date'] = repoArray[Number(keys)]['ftr_transaction_date'];
											obj['fp_name'] = repoArray[Number(keys)]['fp_name'][0] ?
												new CapitalizePipe().transform(repoArray[Number(keys)]['fp_name'][0]) : '-';
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
								formatter: this.checkFeeFormatter,
								groupTotalsFormatter: this.sumTotalsFormatter
							},
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
							{
								id: 'receipt_mode_name', name: 'Mode', field: 'receipt_mode_name', sortable: true, filterable: true,
								filterSearchType: FieldType.string,
								filter: { model: Filters.compoundInputText },
								width: 100,
								grouping: {
									getter: 'receipt_mode_name',
									formatter: (g) => {
										return `${g.value}  <span style="color:green">(${g.count} items)</span>`;
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
						console.log(this.columnDefinitions);
						console.log(this.dataset);
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = '<b>Grand Total</b>';
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_id'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['inv_opening_balance'] = this.dataset.map(t => t.inv_opening_balance).reduce((acc, val) => acc + val, 0);
						obj3['invoice_fine_amount'] = this.dataset.map(t => t.invoice_fine_amount).reduce((acc, val) => acc + val, 0);
						Object.keys(feeHead).forEach((key: any) => {
							Object.keys(feeHead[key]).forEach(key2 => {
								Object.keys(this.dataset).forEach(key3 => {
									Object.keys(this.dataset[key3]).forEach(key4 => {
										if (key4 === key2) {
											obj3[key4] = this.dataset.map(t => t[key4]).reduce((acc, val) => acc + val, 0);
										}
									});
								});
							});
						});
						obj3['total'] = this.dataset.map(t => t.total).reduce((acc, val) => acc + val, 0);
						obj3['receipt_mode_name'] = '';
						this.dataset.push(obj3);
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
						width: 90,
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
						width: 15,
						filterSearchType: FieldType.string,
						filter: { model: Filters.compoundInput },
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
									return `${new DatePipe('en-in').transform(g.value, 'd-MMM-y')}  <span style="color:green">(${g.count} items)</span>`;
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
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = '<b>Grand Total</b>';
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['receipt_no'] = '';
						obj3['rpt_amount'] = this.dataset.map(t => t['rpt_amount']).reduce((acc, val) => acc + val, 0);
						obj3['fp_name'] = '';
						this.dataset.push(obj3);
						this.aggregatearray.push(new Aggregators.Sum('rpt_amount'));
						this.aggregatearray.push(new Aggregators.Sum('srno'));
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
										width: 3
									},
									{
										id: 'stu_admission_no', name: 'Enrollment No', field: 'stu_admission_no', sortable: true,
										filterable: true,
										width: 70,
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
										width: 160,
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
										width: 40,
										filterSearchType: FieldType.string,
										filter: { model: Filters.compoundInput },
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
													return `${new DatePipe('en-in').transform(g.value, 'd-MMM-y')}  <span style="color:green">(${g.count} items)</span>`;
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
											obj['rpt_amount'] = repoArray[Number(keys)]['rpt_amount'] ?
												Number(repoArray[Number(keys)]['rpt_amount']) : 0;
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
										return `${g.value}  <span style="color:green">(${g.count} items)</span>`;
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
							{
								id: 'rpt_amount',
								name: 'Reciept Amt.',
								field: 'rpt_amount',
								sortable: true,
								cssClass: 'amount-report-fee',
								width: 50,
								filterable: true,
								formatter: this.checkFeeFormatter,
								groupTotalsFormatter: this.sumTotalsFormatter
							}
						);
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
											obj3[key4] = this.dataset.map(t => t[key4]).reduce((acc, val) => acc + val, 0);
										}
									});
								});
							});
						});
						obj3['total'] = this.dataset.map(t => t['total']).reduce((acc, val) => acc + val, 0);
						obj3['rpt_amount'] = this.dataset.map(t => t['rpt_amount']).reduce((acc, val) => acc + val, 0);
						obj3['fp_name'] = '';
						this.dataset.push(obj3);
						this.aggregatearray.push(new Aggregators.Sum('total'));
						this.aggregatearray.push(new Aggregators.Sum('srno'));
						console.log(this.columnDefinitions);
						console.log(this.dataset);
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
						width: 60,
						filterSearchType: FieldType.string,
						filter: { model: Filters.compoundInput },
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
									return `${new DatePipe('en-in').transform(g.value, 'd-MMM-y')}  <span style="color:green">(${g.count} items)</span>`;
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
								return `${g.value}  <span style="color:green">(${g.count} items)</span>`;
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
								return `${g.value}  <span style="color:green">(${g.count} items)</span>`;
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
								return `${g.value}  <span style="color:green">(${g.count} items)</span>`;
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
							obj['fp_name'] = repoArray[Number(index)]['fp_name'][0] ?
								new CapitalizePipe().transform(repoArray[Number(index)]['fp_name'][0]) : '-';
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
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = '<b>Grand Total</b>';
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['transport_amount'] = this.dataset.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0);
						obj3['route_name'] = '';
						obj3['stoppages_name'] = '';
						obj3['slab_name'] = '';
						this.dataset.push(obj3);
						this.aggregatearray.push(new Aggregators.Sum('transport_amount'));
						this.aggregatearray.push(new Aggregators.Sum('srno'));
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
						width: 1
					},
					{
						id: 'stu_admission_no', name: 'Enrollment No', field: 'stu_admission_no', sortable: true,
						width: 140,
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
						filterSearchType: FieldType.string,
						filter: { model: Filters.compoundInput },
					},
					{
						id: 'stu_full_name', name: 'Student Name', field: 'stu_full_name', sortable: true,
						filterable: true,
						width: 380,
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
						width: 220,
						filterSearchType: FieldType.string,
						filter: { model: Filters.compoundInput },
						grouping: {
							getter: 'stu_class_name',
							formatter: (g) => {
								return `${g.value}  <span style="color:green">(${g.count} items)</span>`;
							},
							aggregators: this.aggregatearray,
							aggregateCollapsed: true,
							collapsed: false,
						},
					}];
				this.feeService.getMFRReport(collectionJSON).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.common.showSuccessErrorMessage(result.message, 'success');
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
							this.tableFlag = true;
							index++;
						}
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
	}

	expandAllGroups() {
		this.dataviewObj.expandAllGroups();
	}
	onGroupChanged(groups: Grouping[]) {
		console.log(groups);
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
			if (item['receipt_id'] !== '-') {
				this.openDialogReceipt(item['receipt_id'], false);
			}
		}
		console.log(e.target);
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
		if (totals.group.rows[0].invoice_created_date !== '<b>Grand Total</b>') {
			return '<b class="total-footer-report">Total</b>';
		} else {
			return '';
		}
	}
	getMFRFormatter(row, cell, value, columnDef, dataContext) {
		if (value.status === 'unpaid') {
			return '<div style="background-color:#f93435 !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
				+ '<span class="invoice-span-mfr">' + value.inv_invoice_no + '</span>' +
				'<span class="invoice-span-mfr2">' + value.invoice_id + '</span>' + '</div>';
		} else if (value.status === 'paid') {
			return '<div style="background-color:#27de80 !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
				+ '<span class="invoice-span-mfr">' + value.inv_invoice_no + '</span>' +
				'<span class="invoice-span-mfr2">' + value.invoice_id + '</span>' + '</div>';
		} else if (value.status === 'Not Generated') {
			return '<div style="background-color:#d2d8e0 !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;' +
				'border-right: 1px solid #89a8c8; border-top: 0px !important;' +
				'border-bottom: 0px !important; border-left: 0px !important; margin: auto;">'
				+ '<span class="invoice-span-mfr">' + value.inv_invoice_no + '</span>' +
				'<span class="invoice-span-mfr2">' + value.invoice_id + '</span>' + '</div>';
		} else if (value.status === 'Unpaid with fine') {
			return '<div style="background-color:#4a7bec !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
				+ '<span class="invoice-span-mfr">' + value.inv_invoice_no + '</span>' +
				'<span class="invoice-span-mfr2">' + value.invoice_id + '</span>' + '</div>';
		} else {
			return '<div style="background-color:#7bd450 !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
				+ '<span class="invoice-span-mfr">' + value.inv_invoice_no + '</span>' +
				'<span class="invoice-span-mfr2">' + value.invoice_id + '</span>' + '</div>';
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
		const date = new Date();
		const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		this.reportFilterForm.patchValue({
			'from_date': firstDay,
			'to_date': new Date()
		});
		if ($event.value) {
			if ($event.value === 'headwise') {
				this.valueLabel = 'Fee Heads';
				this.getFeeHeads();
			} else if ($event.value === 'classwise') {
				this.valueLabel = 'Class';
				this.getClass();
			} else if ($event.value === 'modewise') {
				this.valueLabel = 'Modes';
				this.getModes();
			} else if ($event.value === 'routewise') {
				this.valueLabel = 'Routes';
				this.getRoutes();
			} else if ($event.value === 'mfr') {
				this.reportFilterForm.patchValue({
					'from_date': '',
					'to_date': ''
				});
				this.valueLabel = 'Class';
				this.getClass();
			}
			this.filterFlag = true;
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
	exportAsPDF() {
		const headerData: any[] = [];
		let rowData: any[] = [];
		for (const item of this.columnDefinitions) {
			headerData.push(item.name);
		}
		console.log(this.dataviewObj);
		console.log(this.dataviewObj.getGrouping());
		if (this.dataviewObj.getGroups().length === 0) {
			Object.keys(this.dataset).forEach(key => {
				const arr: any[] = [];
				Object.keys(this.dataset[key]).forEach(key2 => {
					if (key2 !== 'id' && key2 !== 'receipt_id' && key2 !== 'fp_name') {
						arr.push(this.dataset[key][key2]);
					} else if (key2 !== 'id' && key2 !== 'receipt_id' && key2 === 'fp_name') {
						arr.push(this.dataset[key][key2][0]);
					}
				});
				rowData.push(arr);
			});
			const doc = new jsPDF('l', 'mm', 'a0');
			doc.autoTable({
				head: [[new CapitalizePipe().transform(this.schoolInfo.school_name)]],
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
				head: [[this.schoolInfo.school_city + ',' + this.schoolInfo.school_state]],
				didDrawPage: function (data) {
					doc.setFont('Roboto');
				},
				headerStyles: {
					fontStyle: 'normal',
					fillColor: '#ffffff',
					textColor: 'black',
					halign: 'center',
					fontSize: 25,
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
			doc.save('table.pdf');
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
					theme: 'striped'
				});
			}
			doc.save('table.pdf');
			console.log(rowData);
		}
	}
}
