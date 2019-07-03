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
				report_type: 'modewise', report_name: 'Mode Wise'
			},
			{
				report_type: 'defaulter', report_name: 'Defaulter\'s List'
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
			'order_by': ''
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
				sanitizeDataExport: true
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
									id: 'invoice_created_date', name: 'Invoice Date', field: 'invoice_created_date', sortable: true,
									filterable: true,
									formatter: this.checkDateFormatter,
									filterSearchType: FieldType.dateIso,
									filter: { model: Filters.compoundDate },
									grouping: {
										getter: 'invoice_created_date',
										formatter: (g) => {
											return `${g.value}  <span style="color:green">(${g.count} items)</span>`;
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
								}];
						}
						if (repoArray[Number(keys)]['fee_head_data']) {
							let k = 0;
							let tot = 0;
							for (const titem of repoArray[Number(keys)]['fee_head_data']) {
								Object.keys(titem).forEach((key2: any) => {
									if (key2 === 'fh_name' && Number(keys) === 0) {
										this.columnDefinitions.push({
											id: 'fh_name' + j,
											name: titem[key2],
											field: 'fh_name' + j,
											filterable: true,
											formatter: this.checkFeeFormatter,
											groupTotalsFormatter: this.sumTotalsFormatter
										});
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
										obj['receipt_no'] = repoArray[Number(keys)]['invoice_no'] ?
											repoArray[Number(keys)]['invoice_no'] : '-';
										obj[key2 + k] = titem['fh_amt'] ? Number(titem['fh_amt']) : 0;
										tot = tot + (titem['fh_amt'] ? Number(titem['fh_amt']) : 0);
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
							filter: { model: Filters.compoundInput },
							sortable: true,
							formatter: this.checkTotalFormatter,
							groupTotalsFormatter: this.sumTotalsFormatter
						}
					);
					this.aggregatearray.push(new Aggregators.Sum('total'));
					this.aggregatearray.push(new Aggregators.Sum('srno'));
					console.log(this.columnDefinitions);
					console.log(this.dataset);
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
							return `${g.value}  <span style="color:green">(${g.count} items)</span>`;
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
						obj['receipt_no'] = repoArray[Number(index)]['invoice_no'] ?
							repoArray[Number(index)]['invoice_no'] : '-';
						obj['rpt_amount'] = repoArray[Number(index)]['rpt_amount'] ?
							repoArray[Number(index)]['rpt_amount'] : 0;
						obj['fp_name'] = repoArray[Number(index)]['fp_name'] ?
							repoArray[Number(index)]['fp_name'] : '-';
						this.dataset.push(obj);
						index++;
					}
					this.aggregatearray.push(new Aggregators.Sum('rpt_amount'));
					this.aggregatearray.push(new Aggregators.Sum('srno'));
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
					id: 'invoice_created_date', name: 'Invoice Date', field: 'invoice_created_date', sortable: true,
					filterable: true,
					formatter: this.checkDateFormatter,
					filterSearchType: FieldType.dateIso,
					filter: { model: Filters.compoundDate },
					grouping: {
						getter: 'invoice_created_date',
						formatter: (g) => {
							return `${g.value}  <span style="color:green">(${g.count} items)</span>`;
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
				}];
			this.feeService.getHeadWiseCollection(collectionJSON).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.message, 'success');
					repoArray = result.data.reportData;
					this.totalRecords = Number(result.data.totalRecords);
					localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
					let i = 0;
					let j = 0;
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
									id: 'invoice_created_date', name: 'Invoice Date', field: 'invoice_created_date', sortable: true,
									filterable: true,
									formatter: this.checkDateFormatter,
									filterSearchType: FieldType.dateIso,
									filter: { model: Filters.compoundDate },
									grouping: {
										getter: 'invoice_created_date',
										formatter: (g) => {
											return `${g.value}  <span style="color:green">(${g.count} items)</span>`;
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
											filterable: true,
											formatter: this.checkFeeFormatter,
											groupTotalsFormatter: this.sumTotalsFormatter
										});
										this.aggregatearray.push(new Aggregators.Sum('pay_name' + j));
										j++;
									}
									if (key2 === 'pay_name') {
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
										obj['receipt_no'] = repoArray[Number(keys)]['invoice_no'] ?
											repoArray[Number(keys)]['invoice_no'] : '-';
										obj[key2 + k] = titem['pay_amount'] ? Number(titem['pay_amount']) : 0;
										tot = tot + (titem['pay_amount'] ? Number(titem['pay_amount']) : 0);
										obj['total'] = tot;
										obj['rpt_amount'] = repoArray[Number(keys)]['rpt_amount'] ?
											repoArray[Number(keys)]['rpt_amount'] : 0;
										obj['fp_name'] = repoArray[Number(keys)]['fp_name'] ?
											repoArray[Number(keys)]['fp_name'] : '-';
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
							filter: { model: Filters.compoundInput },
							sortable: true,
							formatter: this.checkTotalFormatter,
							groupTotalsFormatter: this.sumTotalsFormatter
						},
						{
							id: 'rpt_amount',
							name: 'Reciept Amt.',
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
						}
					);
					this.aggregatearray.push(new Aggregators.Sum('total'));
					this.aggregatearray.push(new Aggregators.Sum('srno'));
					console.log(this.columnDefinitions);
					console.log(this.dataset);
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
							return `${g.value}  <span style="color:green">(${g.count} items)</span>`;
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
						obj['receipt_no'] = repoArray[Number(index)]['invoice_no'] ?
							repoArray[Number(index)]['invoice_no'] : '-';
						obj['rpt_amount'] = repoArray[Number(index)]['rpt_amount'] ?
							repoArray[Number(index)]['rpt_amount'] : 0;
						obj['fp_name'] = repoArray[Number(index)]['fp_name'] ?
							repoArray[Number(index)]['fp_name'] : '-';
						this.dataset.push(obj);
						index++;
					}
					this.aggregatearray.push(new Aggregators.Sum('rpt_amount'));
					this.aggregatearray.push(new Aggregators.Sum('srno'));
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
				this.renderDialog(item['receipt_no'], false);
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
			if ($event.value === 'headwise') {
				this.valueLabel = 'Fee Heads';
				this.getFeeHeads();
			} else if ($event.value === 'classwise') {
				this.valueLabel = 'Class';
				this.getClass();
			} else if ($event.value === 'modewise') {
				this.valueLabel = 'Modes';
				this.getModes();
			} else if ($event.value === 'defaulter') {
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
}
