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
@Component({
	selector: 'app-collection-report',
	templateUrl: './collection-report.component.html',
	styleUrls: ['./collection-report.component.css']
})
export class CollectionReportComponent implements OnInit {
	columnDefinitions1: Column[];
	columnDefinitions2: Column[];
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
	receiptArray: any[] = [];
	aggregatearray: any[] = [];
	constructor(translate: TranslateService,
		private feeService: FeeService,
		private common: CommonAPIService,
		private sisService: SisService,
		public dialog: MatDialog) { }

	ngOnInit() {
		this.getHeadWiseCollectionReport();
	}
	angularGridReady(angularGrid: AngularGridInstance) {
		this.angularGrid = angularGrid;
		this.gridObj = angularGrid.slickGrid; // grid object
		this.dataviewObj = angularGrid.dataView;
	}

	getHeadWiseCollectionReport() {
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
		const collectionJSON: any = {
			'admission_no': '',
			'studentName': '',
			'report_type': 'headwise',
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
					const receiptObj: any = {};
					if (Number(keys) === 0) {
						this.columnDefinitions = [
							{
								id: 'srno',
								name: 'SNo.',
								field: 'srno',
								sortable: true,
								groupTotalsFormatter: this.srnTotalsFormatter,
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
										return `${g.value}  <span style="color:green">(${g.count} items)</span>`;
									},
									aggregators: this.aggregatearray,
									aggregateCollapsed: true,
									collapsed: false
								},
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
								name: 'Reciept No.',
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
									obj['invoice_created_date'] = repoArray[Number(keys)]['ftr_transaction_date'];
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
									obj['receipt_no'] = repoArray[Number(keys)]['receipt_no'] ?
										repoArray[Number(keys)]['receipt_no'] : '-';
									obj[key2 + k] = titem['fh_amt'] ? Number(titem['fh_amt']) : 0;
									tot = tot + (titem['fh_amt'] ? Number(titem['fh_amt']) : 0);
									obj['total'] = tot;
									obj['receipt_mode_name'] = repoArray[Number(keys)]['pay_name'] ?
										repoArray[Number(keys)]['pay_name'] : '-';
									receiptObj['receipt_no'] = repoArray[Number(keys)]['receipt_no'];
									receiptObj['receipt_id'] = repoArray[Number(keys)]['rpt_id'],
										k++;
								}
							});
						}
					}
					i++;
					this.dataset.push(obj);
					this.receiptArray.push(receiptObj);
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
						id: 'receipt_mode_name', name: 'Mode', field: 'receipt_mode_name', sortable: true, filterable: true,
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
				this.aggregatearray.push(new Aggregators.Sum('total'));
				this.aggregatearray.push(new Aggregators.Sum('srno'));
				console.log(this.columnDefinitions);
				console.log(this.dataset);
				console.log(this.receiptArray);
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
		if (args.cell === args.grid.getColumnIndex('receipt_no')) {
			const item: any = args.grid.getDataItem(args.row);
			if (item['receipt_no'] !== '-') {
				this.openDialogReceipt(item['receipt_no'], false);
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
}
