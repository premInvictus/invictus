import { Component, OnInit } from '@angular/core';
import {
	GridOption, Column, AngularGridInstance, Grouping, Aggregators,
	FieldType,
	Filters,
	Formatters,
	SortDirectionNumber,
	Sorters
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
	selector: 'app-fee-ledger-report',
	templateUrl: './fee-ledger-report.component.html',
	styleUrls: ['./fee-ledger-report.component.css']
})
export class FeeLedgerReportComponent implements OnInit {

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
	constructor(translate: TranslateService,
		private feeService: FeeService,
		private common: CommonAPIService,
		private sisService: SisService,
		public dialog: MatDialog,
		private fbuild: FormBuilder) { }

	ngOnInit() {
		this.buildForm();
		this.getClassData();
		this.filterFlag = true;
		this.dataArr = [];
		this.aggregatearray = [];
		this.columnDefinitions = [];
		this.dataset = [];
		this.getFeeLedgerReport(this.reportFilterForm.value);
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

	getFeeLedgerReport(value: any) {
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
		const collectionJSON: any = {
			'from_date': value.from_date,
			'to_date': value.to_date,
			'pageSize': value.pageSize,
			'pageIndex': value.pageIndex,
			'classId': value.fee_value,
			'secId': value.hidden_value,
			'login_id': value.login_id,
			'orderBy': value.orderBy,
			'downloadAll': true,
		};
		this.columnDefinitions = [
			{
				id: 'flgr_created_date', name: 'Date', field: 'flgr_created_date', sortable: true, width: 4,
				filterable: true,
				formatter: this.checkDateFormatter,
				filterSearchType: FieldType.dateIso,
				filter: { model: Filters.compoundDate },
				groupTotalsFormatter: this.srnTotalsFormatter
			},
			{
				id: 'flgr_particulars',
				name: 'Particulars',
				field: 'flgr_particulars',
				sortable: true,
				width: 3,
				filterable: true,
			},
			{
				id: 'flgr_invoice_receipt_no',
				name: 'Invoice/Receipt No.',
				field: 'flgr_invoice_receipt_no',
				formatter: this.checkReceiptFormatter,
				sortable: true,
				filterable: true,
				width: 1,
				cssClass: 'fee-ledger-no'
			},
			{
				id: 'flgr_amount',
				name: 'Amount Due',
				field: 'flgr_amount',
				sortable: true,
				width: 1,
				filterable: true,
				groupTotalsFormatter: this.sumTotalsFormatter,
				formatter: this.checkFeeFormatter
			},
			{
				id: 'flgr_concession',
				name: 'Concession',
				field: 'flgr_concession',
				sortable: true,
				width: 1,
				filterable: true,
				groupTotalsFormatter: this.sumTotalsFormatter,
				formatter: this.checkFeeFormatter
			},
			{
				id: 'flgr_receipt',
				name: 'Receipt Amount',
				field: 'flgr_receipt',
				sortable: true,
				filterable: true,
				width: 1,
				groupTotalsFormatter: this.sumTotalsFormatter,
				formatter: this.checkFeeFormatter
			},
			{
				id: 'flgr_balance',
				name: 'Balance',
				field: 'flgr_balance',
				sortable: true,
				filterable: true,
				width: 1,
				groupTotalsFormatter: this.sumTotalsFormatter,
				formatter: this.checkFeeFormatter
			}];
		this.feeService.getFeeLedgerReport(collectionJSON).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				repoArray = result.data.reportData;
				this.totalRecords = Number(result.data.totalRecords);
				localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
				let index = 0;
				for (const item of repoArray) {
					let j = 0;
					for (const stu_arr of item.stu_ledger_arr) {
						const obj: any = {};
						obj['id'] = repoArray[Number(index)]['au_admission_no'] + j;
						obj['flgr_created_date'] = stu_arr['flgr_created_date'];
						if (repoArray[Number(index)]['sec_id'] !== '0') {
							obj['stu_class_name'] = repoArray[Number(index)]['au_admission_name']  +
								',' + new CapitalizePipe().transform(repoArray[Number(index)]['au_full_name']) + ', ' +
								(repoArray[Number(index)]['class_name'] + '-' +
									repoArray[Number(index)]['sec_name']);
						} else {
							obj['stu_class_name'] = repoArray[Number(index)]['au_admission_name']  +
								',' + new CapitalizePipe().transform(repoArray[Number(index)]['au_full_name']) + ', ' +
								repoArray[Number(index)]['class_name'];
						}
						obj['flgr_particulars'] = stu_arr['flgr_particulars'] ?
							stu_arr['flgr_particulars'] : '-';
						obj['flgr_inv_id'] = stu_arr['flgr_inv_id'] ?
							stu_arr['flgr_inv_id'] : '-';
						obj['flgr_invoice_type'] = stu_arr['flgr_invoice_type'];
						if (stu_arr['flgr_invoice_receipt_no']) {
							if (stu_arr['flgr_invoice_type'] === 'R' && Number(stu_arr['flgr_invoice_receipt_no']) !== 0) {
								obj['flgr_invoice_receipt_no'] = 'R-' + (stu_arr['flgr_invoice_receipt_no'] ?
									stu_arr['flgr_invoice_receipt_no'] : '-');
							} else if (stu_arr['flgr_invoice_type'] === 'I' && Number(stu_arr['flgr_invoice_receipt_no']) !== 0) {
								obj['flgr_invoice_receipt_no'] = 'I-' + (stu_arr['flgr_invoice_receipt_no'] ?
									stu_arr['flgr_invoice_receipt_no'] : '-');
							}
						}
						obj['flgr_invoice_type'] = stu_arr['flgr_invoice_type'];
						obj['flgr_amount'] = stu_arr['flgr_amount'] ?
							Number(stu_arr['flgr_amount']) : 0;
						obj['flgr_concession'] = stu_arr['flgr_concession'] ?
							stu_arr['flgr_concession'] : 0;
						obj['flgr_receipt'] = stu_arr['flgr_receipt'] ?
							Number(stu_arr['flgr_receipt']) : '0';
						obj['receipt_id'] = stu_arr['receipt_id'];
						obj['flgr_balance'] = stu_arr['flgr_balance'] ?
							Number(stu_arr['flgr_balance']) : 0;
						this.dataset.push(obj);
						j++;
					}
					index++;
				}
				this.aggregatearray.push(new Aggregators.Sum('flgr_amount'));
				this.aggregatearray.push(new Aggregators.Sum('flgr_concession'));
				this.aggregatearray.push(new Aggregators.Sum('flgr_receipt'));
				this.aggregatearray.push(new Aggregators.Sum('flgr_balance'));
				this.tableFlag = true;
				setTimeout(() => this.groupByClass(), 2);
			} else {
				this.tableFlag = false;
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
	resetValues () {
		this.reportFilterForm.patchValue({
			'login_id': '',
			'orderBy': ''
		});
		this.sortResult = [];
		this.filterResult = [];
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
		if (args.cell === args.grid.getColumnIndex('flgr_invoice_receipt_no')) {
			const item: any = args.grid.getDataItem(args.row);
			if (item['flgr_invoice_receipt_no']) {
				const noArray: any[] = item['flgr_invoice_receipt_no'].split('-');
				if (noArray[0] === 'I') {
					this.renderDialog(Number(item['flgr_inv_id']), false);
				} else if (noArray[0] === 'R') {
					this.openDialogReceipt (Number(item['receipt_id']), false);
				}
			}
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
		if (value) {
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
	groupByClass() {
		this.dataviewObj.setGrouping({
			getter: 'stu_class_name',
			formatter: (g) => {
				return `<b>${g.value}</b><span style="color:green"> [ ${g.count} records]</span>`;
			},
			aggregators: this.aggregatearray,
			aggregateCollapsed: true,
			collapsed: false,
		});
	}

}
