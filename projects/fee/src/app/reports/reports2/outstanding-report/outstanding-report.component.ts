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

@Component({
	selector: 'app-outstanding-report',
	templateUrl: './outstanding-report.component.html',
	styleUrls: ['./outstanding-report.component.css']
})
export class OutstandingReportComponent implements OnInit {

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
	constructor(translate: TranslateService,
		private feeService: FeeService,
		private common: CommonAPIService,
		private sisService: SisService,
		public dialog: MatDialog,
		private fbuild: FormBuilder) { }

	ngOnInit() {
		this.buildForm();
		this.getClassData();
		this.reportTypeArray.push({
			report_type: 'headwise', report_name: 'Head Wise'
		},
			{
				report_type: 'classwise', report_name: 'Class Wise'
			},
			{
				report_type: 'defaulter', report_name: 'Defaulter\'s List'
			});
		this.reportType = 'headwise';
		const date = new Date();
		const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		this.reportFilterForm.patchValue({
			'report_type': 'headwise',
			'from_date': firstDay,
			'to_date': new Date()
		});
		this.filterFlag = true;
		this.valueLabel = 'Fee Heads';
		this.getFeeHeads();
		this.getOutstandingReport(this.reportFilterForm.value);
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

	getOutstandingReport(value: any) {
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
				onCommand: (e, args) => {
					if (args.command === 'toggle-preheader') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.clearGrouping();
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
				'filterReportBy': 'outstanding',
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
									id: 'invoice_created_date', name: 'Trans. Date', field: 'invoice_created_date', sortable: true,
									filterable: true,
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
								{ id: 'stu_admission_no', name: 'Enrollment No', field: 'stu_admission_no', filterable: true },
								{
									id: 'stu_full_name', name: 'Student Name', field: 'stu_full_name', filterable: true,
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
									id: 'fp_name', name: 'Fee Period', field: 'fp_name', sortable: true,
									filterable: true,
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
									name: 'Invoice No.',
									field: 'receipt_no',
									sortable: true,
									filterable: true,
									formatter: this.checkReceiptFormatter,
									cssClass: 'receipt_collection_report'
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
											name: titem[key2],
											field: 'fh_name' + j,
											filterable: true,
											formatter: this.checkFeeFormatter,
											groupTotalsFormatter: this.sumTotalsFormatter
										});
										feeObj['fh_name' + j] = '';
										feeHead.push(feeObj);
										this.aggregatearray.push(new Aggregators.Sum('fh_name' + j));
										j++;
									}
									if (key2 === 'fh_name') {
										obj['id'] = (collectionJSON.pageSize * collectionJSON.pageIndex) +
											(Number(keys) + 1);
										obj['srno'] = (collectionJSON.pageSize * collectionJSON.pageIndex) +
											(Number(keys) + 1);
										obj['invoice_created_date'] = repoArray[Number(keys)]['invoice_date'];
										obj['stu_admission_no'] = repoArray[Number(keys)]['stu_admission_no'] ?
											repoArray[Number(keys)]['stu_admission_no'] : '-';
										obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(keys)]['stu_full_name']);
										if (repoArray[Number(keys)]['stu_sec_id'] !== '0') {
											obj['stu_class_name'] = repoArray[Number(keys)]['stu_class_name'] + '-' +
												repoArray[Number(keys)]['stu_sec_name'];
										} else {
											obj['stu_class_name'] = repoArray[Number(keys)]['stu_class_name'];
										}
										obj['receipt_id'] = repoArray[Number(keys)]['invoice_id'] ?
											repoArray[Number(keys)]['invoice_id'] : '0';
										obj['fp_name'] = repoArray[Number(keys)]['fp_name'][0] ?
											new CapitalizePipe().transform(repoArray[Number(keys)]['fp_name'][0]) : '-';
										obj['receipt_no'] = repoArray[Number(keys)]['invoice_no'] ?
											repoArray[Number(keys)]['invoice_no'] : '-';
										obj[key2 + k] = titem['fh_amt'] ? Number(titem['fh_amt']) : 0;
										tot = tot + (titem['fh_amt'] ? Number(titem['fh_amt']) : 0);
										obj['inv_opening_balance'] = titem['inv_opening_balance'] ? Number(titem['inv_opening_balance']) : 0;
										obj['invoice_fine_amount'] = titem['invoice_fine_amount'] ? Number(titem['invoice_fine_amount']) : 0;
										obj['total'] = tot;
										k++;
									}
								});
							}
						}
						i++;
						this.dataset.push(obj);
					});
					this.columnDefinitions.push({
						id: 'inv_opening_balance', name: 'Opening Balance', field: 'inv_opening_balance',
						filterable: true,
						filterSearchType: FieldType.number,
						filter: { model: Filters.compoundInput },
						sortable: true,
						formatter: this.checkTotalFormatter,
						groupTotalsFormatter: this.sumTotalsFormatter
					},
						{
							id: 'invoice_fine_amount', name: 'Fine Amount', field: 'invoice_fine_amount',
							filterable: true,
							filterSearchType: FieldType.number,
							filter: { model: Filters.compoundInput },
							sortable: true,
							formatter: this.checkTotalFormatter,
							groupTotalsFormatter: this.sumTotalsFormatter
						},
						{
							id: 'total', name: 'Total', field: 'total',
							filterable: true,
							filterSearchType: FieldType.number,
							filter: { model: Filters.compoundInput },
							sortable: true,
							formatter: this.checkTotalFormatter,
							groupTotalsFormatter: this.sumTotalsFormatter
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
					width: 2
				},
				{
					id: 'invoice_created_date', name: 'Invoice Date', field: 'invoice_created_date', sortable: true,
					filterable: true,
					formatter: this.checkDateFormatter,
					filterSearchType: FieldType.dateIso,
					filter: { model: Filters.compoundDate },
					grouping: {
						getter: 'invoice_created_date',
						formatter: (g) => {
							return `${new DatePipe('en-in').transform(g.value, 'd-MMM-y')}  <span style="color:green">(${g.count} items)</span>`;
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false
					},
					groupTotalsFormatter: this.srnTotalsFormatter,
				},
				{ id: 'stu_admission_no', name: 'Enrollment No', field: 'stu_admission_no', filterable: true },
				{
					id: 'stu_full_name', name: 'Student Name', field: 'stu_full_name', filterable: true,
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
					id: 'receipt_no',
					name: 'Invoice No.',
					field: 'receipt_no',
					sortable: true,
					filterable: true,
					formatter: this.checkReceiptFormatter,
					cssClass: 'receipt_collection_report'
				},
				{
					id: 'rpt_amount',
					name: 'Invoice Amount',
					field: 'rpt_amount',
					sortable: true,
					filterable: true,
					formatter: this.checkFeeFormatter,
					groupTotalsFormatter: this.sumTotalsFormatter
				},
				{
					id: 'fp_name',
					name: 'Fee Period',
					field: 'fp_name',
					sortable: true,
					filterable: true,
					grouping: {
						getter: 'fp_name',
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
						obj['invoice_created_date'] = repoArray[Number(index)]['invoice_date'];
						obj['stu_admission_no'] = repoArray[Number(index)]['stu_admission_no'] ?
							repoArray[Number(index)]['stu_admission_no'] : '-';
						obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(index)]['stu_full_name']);
						if (repoArray[Number(index)]['stu_sec_id'] !== '0') {
							obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'] + '-' +
								repoArray[Number(index)]['stu_sec_name'];
						} else {
							obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'];
						}
						obj['receipt_id'] = repoArray[Number(index)]['invoice_id'] ?
							repoArray[Number(index)]['invoice_id'] : '0';
						obj['receipt_no'] = repoArray[Number(index)]['invoice_no'] ?
							repoArray[Number(index)]['invoice_no'] : '-';
						obj['rpt_amount'] = repoArray[Number(index)]['invoice_amount'] ?
							Number(repoArray[Number(index)]['invoice_amount']) : 0;
						obj['fp_name'] = repoArray[Number(index)]['fp_name'] ?
							repoArray[Number(index)]['fp_name'] : '-';
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
		} else if (this.reportType === 'defaulter' && value.to_date) {
			const collectionJSON: any = {
				'admission_no': '',
				'studentName': '',
				'report_type': 'classwise',
				'classId': value.fee_value,
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
					width: 2
				},
				{
					id: 'invoice_created_date', name: 'Invoice Date', field: 'invoice_created_date', sortable: true,
					filterable: true,
					formatter: this.checkDateFormatter,
					filterSearchType: FieldType.dateIso,
					filter: { model: Filters.compoundDate },
					grouping: {
						getter: 'invoice_created_date',
						formatter: (g) => {
							return `${new DatePipe('en-in').transform(g.value, 'd-MMM-y')}  <span style="color:green">(${g.count} items)</span>`;
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false
					},
					groupTotalsFormatter: this.srnTotalsFormatter,
				},
				{ id: 'stu_admission_no', name: 'Enrollment No', field: 'stu_admission_no', filterable: true },
				{
					id: 'stu_full_name', name: 'Student Name', field: 'stu_full_name', filterable: true,
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
					id: 'receipt_no',
					name: 'Invoice No.',
					field: 'receipt_no',
					sortable: true,
					filterable: true,
					formatter: this.checkReceiptFormatter,
					cssClass: 'receipt_collection_report'
				},
				{
					id: 'rpt_amount',
					name: 'Invoice Amount',
					field: 'rpt_amount',
					sortable: true,
					filterable: true,
					formatter: this.checkFeeFormatter,
					groupTotalsFormatter: this.sumTotalsFormatter
				},
				{
					id: 'fp_name',
					name: 'Fee Period',
					field: 'fp_name',
					sortable: true,
					filterable: true,
					grouping: {
						getter: 'fp_name',
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
						obj['invoice_created_date'] = repoArray[Number(index)]['invoice_date'];
						obj['stu_admission_no'] = repoArray[Number(index)]['stu_admission_no'] ?
							repoArray[Number(index)]['stu_admission_no'] : '-';
						obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(index)]['stu_full_name']);
						if (repoArray[Number(index)]['stu_sec_id'] !== '0') {
							obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'] + '-' +
								repoArray[Number(index)]['stu_sec_name'];
						} else {
							obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'];
						}
						obj['receipt_id'] = repoArray[Number(index)]['invoice_id'] ?
							repoArray[Number(index)]['invoice_id'] : '0';
						obj['receipt_no'] = repoArray[Number(index)]['invoice_no'] ?
							repoArray[Number(index)]['invoice_no'] : '-';
						obj['rpt_amount'] = repoArray[Number(index)]['invoice_amount'] ?
							Number(repoArray[Number(index)]['invoice_amount']) : 0;
						obj['fp_name'] = repoArray[Number(index)]['fp_name'] ?
							repoArray[Number(index)]['fp_name'] : '-';
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
		} else {
			this.common.showSuccessErrorMessage('Please select date also', 'error');
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
				this.renderDialog(item['receipt_id'], false);
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
			} else if ($event.value === 'defaulter') {
				this.reportFilterForm.patchValue({
					'to_date': new Date()
				});
				this.valueLabel = 'Class';
				this.getClass();
			}
			this.filterFlag = true;
		} else {
			this.filterFlag = false;
		}
	}
	resetValues () {
		this.reportFilterForm.patchValue({
			'login_id': '',
			'orderBy': ''
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
}
