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
	selector: 'app-feeadj-report',
	templateUrl: './feeadj-report.component.html',
	styleUrls: ['./feeadj-report.component.css']
})
export class FeeadjReportComponent implements OnInit {

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
		this.getFeeAdjReport(this.reportFilterForm.value);
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
			'downloadAll': true,
			'login_id': value.login_id,
			'orderBy': value.orderBy
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
				width: 4,
				groupTotalsFormatter: this.srnTotalsFormatter
			},
			{
				id: 'stu_full_name', name: 'Student Name', field: 'stu_full_name', filterable: true, width: 6,
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
				id: 'stu_class_name', name: 'Class-Section', field: 'stu_class_name', sortable: true, width: 4,
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
				id: 'invoice_no',
				name: 'Invoice No..',
				field: 'invoice_no',
				sortable: true,
				width: 1,
				filterable: true,
				cssClass: 'fee-ledger-no',
				formatter: this.checkReceiptFormatter
			},
			{
				id: 'invg_fh_name',
				name: 'Fee Head',
				field: 'invg_fh_name',
				sortable: true,
				filterable: true,
			},
			{
				id: 'adjustment_date', name: 'Adj. Date', field: 'adjustment_date', sortable: true, width: 4,
				filterable: true,
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
				filterable: true,
				groupTotalsFormatter: this.sumTotalsFormatter,
				formatter: this.checkFeeFormatter
			},
			{
				id: 'adjusted_by',
				name: 'Adj. By',
				field: 'adjusted_by',
				sortable: true,
				filterable: true
			},
			{
				id: 'inv_remark',
				name: 'Adj. Remark',
				field: 'inv_remark',
				sortable: true,
				filterable: true
			}];
		this.feeService.getFeeAdjustmentReport(collectionJSON).subscribe((result: any) => {
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
					obj['stu_admission_no'] = repoArray[Number(index)]['au_admission_no'] ?
						repoArray[Number(index)]['au_admission_no'] : '-';
					obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(index)]['au_full_name']);
					if (repoArray[Number(index)]['sec_id'] !== '0') {
						obj['stu_class_name'] = repoArray[Number(index)]['class_name'] + '-' +
							repoArray[Number(index)]['sec_name'];
					} else {
						obj['stu_class_name'] = repoArray[Number(index)]['class_name'];
					}
					obj['inv_id'] = item['inv_id'];
					obj['invoice_no'] = item['inv_invoice_no'] ? item['inv_invoice_no'] : '-';
					obj['invg_fh_name'] = item['invg_fh_name'] ? item['invg_fh_name'] : '-';
					obj['invg_fh_amount'] = item['invg_fh_amount'] ?
						Number(item['invg_fh_amount']) : 0;
					obj['adjusted_by'] = item['adjusted_by'] ? new CapitalizePipe().transform(item['adjusted_by']) : '-';
					obj['adjustment_date'] = item['adjustment_date'];
					obj['invg_adj_amount'] = item['invg_adj_amount'] ?
						Number(item['invg_adj_amount']) : 0;
					obj['inv_remark'] = item['inv_remark'] ? new CapitalizePipe().transform(item['inv_remark']) : '-';
					this.dataset.push(obj);
					index++;
				}
				this.aggregatearray.push(new Aggregators.Sum('invg_adj_amount'));
				const obj3: any = {};
				obj3['id'] = 'footer';
				obj3['srno'] = '';
				obj3['stu_admission_no'] = this.common.htmlToText('<b>Grand Total</b>');
				obj3['stu_full_name'] =  '';
				obj3['stu_class_name'] = '';
				obj3['inv_id'] = '';
				obj3['invoice_no'] = '';
				obj3['invg_fh_name'] =  '';
				obj3['invg_fh_amount'] = '';
				obj3['adjusted_by'] =  '';
				obj3['adjustment_date'] = '';
				obj3['invg_adj_amount'] = this.dataset.map(t => t['invg_adj_amount']).reduce((acc, val) => acc + val, 0);
				obj3['inv_remark'] = '';
				this.dataset.push(obj3);
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

}
