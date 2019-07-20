import { Component, OnInit } from '@angular/core';
import {
	GridOption, Column, AngularGridInstance, Grouping, Aggregators,
	FieldType,
	Filters,
	Formatters,
	Sorters,
	SortDirectionNumber
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
	selector: 'app-transport-report',
	templateUrl: './transport-report.component.html',
	styleUrls: ['./transport-report.component.css']
})
export class TransportReportComponent implements OnInit {

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
				// {
				// 	id: 'invoice_created_date', name: 'Invoice. Date', field: 'invoice_created_date', sortable: true,
				// 	filterable: true,
				// 	width: 120,
				// 	formatter: this.checkDateFormatter,
				// 	filterSearchType: FieldType.dateIso,
				// 	filter: { model: Filters.compoundDate },
				// 	grouping: {
				// 		getter: 'invoice_created_date',
				// 		formatter: (g) => {
				// 			if (g.value !== '-' && g.value !== '' && g.value !== '<b>Grand Total</b>') {
				// 				return `${new DatePipe('en-in').transform(g.value, 'd-MMM-y')}  <span style="color:green">(${g.count})</span>`;
				// 			} else {
				// 				return `${''}`;
				// 			}
				// 		},
				// 		aggregators: this.aggregatearray,
				// 		aggregateCollapsed: true,
				// 		collapsed: false
				// 	},
				// 	groupTotalsFormatter: this.srnTotalsFormatter,
				// },
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
				// {
				// 	id: 'receipt_no',
				// 	name: 'Invoice No.',
				// 	field: 'receipt_no',
				// 	sortable: true,
				// 	width: 60,
				// 	filterable: true,
				// 	filterSearchType: FieldType.number,
				// 	filter: { model: Filters.compoundInputNumber },
				// 	formatter: this.checkReceiptFormatter,
				// 	cssClass: 'receipt_collection_report'
				// },
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
						obj['fp_name'] = repoArray[Number(index)]['fp_name'][0] ?
							new CapitalizePipe().transform(repoArray[Number(index)]['fp_name'][0]) : '-';
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
					const obj3: any = {};
					obj3['id'] = 'footer';
					obj3['route_name'] = this.common.htmlToText('<b>Grand Total</b>');
					obj3['stoppages_name'] = '';
					obj3['slab_name'] = '';
					obj3['slab_amount'] = this.dataset.map(t => t['slab_amount']).reduce((acc, val) => acc + val, 0);
					this.dataset.push(obj3);
					this.tableFlag = true;
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
}
