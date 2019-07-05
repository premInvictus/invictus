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
	selector: 'app-feestruc-report',
	templateUrl: './feestruc-report.component.html',
	styleUrls: ['./feestruc-report.component.css']
})
export class FeestrucReportComponent implements OnInit {

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
			report_type: 'feestructure',
			report_name: 'Fee Structure Report'
		},
			{
				report_type: 'feestructurealloted',
				report_name: 'Fee Structure Alloted Report'
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

	getFeeStrucReport(value: any) {
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
		if (this.reportType === 'feestructure') {
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
					id: 'fs_name',
					name: 'Fee Structure',
					field: 'fs_name',
					sortable: true,
				},
				{
					id: 'fs_structure',
					name: 'Fee Head',
					field: 'fs_structure',
					sortable: true,
					formatter: this.checkFeeHeadFormatter
				},
				{
					id: 'fs_description',
					name: 'Description',
					field: 'fs_description',
					sortable: true,
				}];
			this.feeService.getFeeStructureReport(collectionJSON).subscribe((result: any) => {
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
						obj['fs_name'] = new CapitalizePipe().transform(repoArray[Number(index)]['fs_name']);
						let feeHead = '';
						let feeHead2 = '';
						if (item.fs_structure && item.fs_structure.length > 0) {
							for (const item1 of item.fs_structure) {
								if (item1.fc_classfication === 'head') {
									feeHead = feeHead + '<b><u>' + new CapitalizePipe().transform(item1.fh_name) + '(' + item1.ft_name + ')' + '</u></b><br>';
									let classAmt = '';
									if (item1.fh_class_amount_detail &&
										JSON.parse(item1.fh_class_amount_detail).length > 0) {
										for (const titem of JSON.parse(item1.fh_class_amount_detail)) {
											classAmt = classAmt + 'Class ' +
												titem.class_name + ' :' + new DecimalPipe('en-us').transform(Number(titem.head_amt) *
													item1.fh_fm_id.length) + ', ';
										}
										classAmt = classAmt.substring(0, classAmt.length - 2);
									}
									feeHead = feeHead + classAmt + '<br>';
								} else if (item1.fc_classfication === 'group') {
									if (item1.fee_groups && item1.fee_groups.length > 0) {
										for (const item2 of item1.fee_groups) {
											let classAmt = '';
											feeHead2 = feeHead2 + '<b><u>' + new CapitalizePipe().transform(item2.fh_name) + '(' + item2.ft_name + ')' + '</u></b><br>';
											if (item2.fh_class_amount_detail &&
												JSON.parse(item2.fh_class_amount_detail).length > 0) {
												for (const titem of JSON.parse(item2.fh_class_amount_detail)) {
													classAmt = classAmt + 'Class ' +
														titem.class_name + ' :' + new DecimalPipe('en-us').transform(Number(titem.head_amt) *
															item2.fh_fm_id.length) + ', ';
												}
												classAmt = classAmt.substring(0, classAmt.length - 2);
											}
											feeHead2 = feeHead2 + classAmt + '<br>';
										}
									}
								}
							}
						}
						obj['fs_structure'] = feeHead + feeHead2;
						obj['fs_description'] = item['fs_description'];
						this.dataset.push(obj);
						index++;
					}
					this.tableFlag = true;
				} else {
					this.tableFlag = true;
				}
			});
		} else if (this.reportType === 'feestructurealloted') {
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
				{ id: 'stu_admission_no', name: 'Enrollment No', field: 'stu_admission_no', filterable: true,
			width: 2},
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
					width: 2,
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
					width: 4,
				},
				{
					id: 'fs_structure',
					name: 'Fee Head',
					field: 'fs_structure',
					sortable: true,
					formatter: this.checkFeeHeadFormatter
				}];
			this.feeService.getFeeStructureAllotedReport(collectionJSON).subscribe((result: any) => {
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
						if (repoArray[Number(index)]['au_sec_id'] !== '0') {
							obj['stu_class_name'] = repoArray[Number(index)]['class_name'] + '-' +
								repoArray[Number(index)]['sec_name'];
						} else {
							obj['stu_class_name'] = repoArray[Number(index)]['class_name'];
						}
						let feeHead = '';
						let feeHead2 = '';
						if (item.fee_structure_head_group && item.fee_structure_head_group.length > 0) {
							for (const item1 of item.fee_structure_head_group) {
								if (item1.fc_classfication === 'head') {
									feeHead = feeHead + '<b><u>' + new CapitalizePipe().transform(item1.fh_name) + '(' + item1.ft_name + ')' + '</u></b><br>';
									let classAmt = '';
									if (item1.fh_class_amount_detail &&
										JSON.parse(item1.fh_class_amount_detail).length > 0) {
										for (const titem of JSON.parse(item1.fh_class_amount_detail)) {
											classAmt = classAmt + 'Class ' +
												titem.class_name + ' :' + new DecimalPipe('en-us').transform(Number(titem.head_amt) *
													item1.fh_fm_id.length) + ', ';
										}
										classAmt = classAmt.substring(0, classAmt.length - 2);
									}
									feeHead = feeHead + classAmt + '<br>';
								} else if (item1.fc_classfication === 'group') {
									if (item1.fee_groups && item1.fee_groups.length > 0) {
										for (const item2 of item1.fee_groups) {
											let classAmt = '';
											feeHead2 = feeHead2 + '<b><u>' + new CapitalizePipe().transform(item2.fh_name) + '(' + item2.ft_name + ')' + '</u></b><br>';
											if (item2.fh_class_amount_detail &&
												JSON.parse(item2.fh_class_amount_detail).length > 0) {
												for (const titem of JSON.parse(item2.fh_class_amount_detail)) {
													classAmt = classAmt + 'Class ' +
														titem.class_name + ' :' + new DecimalPipe('en-us').transform(Number(titem.head_amt) *
															item2.fh_fm_id.length) + ', ';
												}
												classAmt = classAmt.substring(0, classAmt.length - 2);
											}
											feeHead2 = feeHead2 + classAmt + '<br>';
										}
									}
								}
							}
						}
						obj['fs_structure'] = feeHead + feeHead2;
						this.dataset.push(obj);
						this.tableFlag = true;
						index++;
					}
				} else {
					this.tableFlag = true;
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
			if ($event.value === 'feestructure') {
				this.filterFlag = false;
				this.gridOptions = {
					enableDraggableGrouping: false,
					createPreHeaderPanel: true,
					showPreHeaderPanel: false,
					enableHeaderMenu: false,
					preHeaderPanelHeight: 40,
					enableFiltering: true,
					enableSorting: true,
					enableColumnReorder: true,
					createFooterRow: true,
					showFooterRow: true,
					footerRowHeight: 21,
					enableAutoSizeColumns: true,
					enableAutoResize: true,
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
				this.getFeeStrucReport(this.reportFilterForm.value);
			} else if ($event.value === 'feestructurealloted') {
				this.valueLabel = 'Class';
				this.filterFlag = true;
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
					enableAutoSizeColumns: true,
					enableAutoResize: true,
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
}
