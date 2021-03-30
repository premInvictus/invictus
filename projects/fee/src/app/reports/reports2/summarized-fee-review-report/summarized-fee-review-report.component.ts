import { Component, OnInit } from '@angular/core';
import {
	GridOption, Column, AngularGridInstance, Grouping, Aggregators,
	FieldType,
	Filters,
	Formatters
} from 'angular-slickgrid';
import { saveAs } from 'file-saver';
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
import * as Excel from 'exceljs/dist/exceljs';

declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';
@Component({
	selector: 'app-summarized-fee-review-report',
	templateUrl: './summarized-fee-review-report.component.html',
	styleUrls: ['./summarized-fee-review-report.component.css']
})
export class SummarizedFeeReviewReportComponent implements OnInit {
	reportdate = new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
	gridHeight: any;
	totalRow: any;
	columnDefinitions1: Column[] = [];
	columnDefinitions2: Column[] = [];
	gridOptions1: GridOption;
	gridOptions2: GridOption;
	tableFlag = false;
	dataset1: any[];
	notFormatedCellArray: any[] = [];
	currentUser: any;
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
	schoolInfo: any;
	activeReport = 1;
	currentSession;
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
	constructor(translate: TranslateService,
		private feeService: FeeService,
		private common: CommonAPIService,
		private sisService: SisService,
		public dialog: MatDialog,
		private fbuild: FormBuilder) { }

	ngOnInit() {

		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.getSchool();
		this.getSession();
		this.buildForm();
		this.getClassData();
		this.filterFlag = true;
		// this.getSummarizedFeeReviewReport(this.reportFilterForm.value);
	}
	angularGridReady(angularGrid: AngularGridInstance) {
		this.angularGrid = angularGrid;
		this.gridObj = angularGrid.slickGrid; // grid object
		this.dataviewObj = angularGrid.dataView;
		this.updateTotalRow(angularGrid.slickGrid);
		this.updateClassSort(angularGrid.slickGrid, angularGrid.dataView);
	}

	parseRoman(s) {
        var val = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
        return s.toUpperCase().split('').reduce( (r, a, i, aa) => {
            return val[a] < val[aa[i + 1]] ? r - val[a] : r + val[a];
        }, 0);
	}
	isRoman(s) {
        // http://stackoverflow.com/a/267405/1447675
        return /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i.test(s);
	}
	updateClassSort(grid:any,dataView:any) {
		let columnIdx = grid.getColumns().length;
		while (columnIdx--) {
			const columnId = grid.getColumns()[columnIdx];
			if (columnId['name'] == 'Class Name' || columnId['name'] == 'Class-Section') {
				grid.onSort.subscribe((e, args)=> {
					console.log('in, args', args);
					// args.multiColumnSort indicates whether or not this is a multi-column sort.
					// If it is, args.sortCols will have an array of {sortCol:..., sortAsc:...} objects.
					// If not, the sort column and direction will be in args.sortCol & args.sortAsc.
				  
					// We'll use a simple comparer function here.
					args = args.sortCols[0];
					var comparer = (a, b) =>{
						if (this.isRoman(a[args.sortCol.field].split(" ")[0]) || this.isRoman(b[args.sortCol.field].split(" ")[0])) {
							
							return (this.parseRoman(a[args.sortCol.field].split(" ")[0]) > this.parseRoman(b[args.sortCol.field].split(" ")[0])) ? 1 : -1;
							
							
						} else if (this.isRoman(a[args.sortCol.field].split("-")[0]) || this.isRoman(b[args.sortCol.field].split("-")[0])) {
							
							return (this.parseRoman(a[args.sortCol.field].split("-")[0]) > this.parseRoman(b[args.sortCol.field].split("-")[0])) ? 1 : -1;
						
						
						} else {
							
							return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
						}
					
					}
				  
					// Delegate the sorting to DataView.
					// This will fire the change events and update the grid.
					dataView.sort(comparer, args.sortAsc);
				  });
			}
		}
	}

	updateTotalRow(grid: any) {
		let columnIdx = grid.getColumns().length;
		while (columnIdx--) {
			const columnId = grid.getColumns()[columnIdx].id;
			const columnElement: HTMLElement = grid.getFooterRowColumn(columnId);
			columnElement.innerHTML = '<center><b>' + this.totalRow[columnId] + '<b></center>';
		}
	}
	buildForm() {
		this.reportFilterForm = this.fbuild.group({
			'report_type': '',
			'sd_type_value' : '1',
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
			'order_by': ''
		});
	}

	getSummarizedFeeReviewReport(value: any) {
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
			enableAutoTooltip: true,

			enableCellNavigation: true,
			rowHeight:65,
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
					if (args.command === 'exportAsExcel') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.exportToExcel();
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
		const collectionJSON: any = {
			'from_date': new DatePipe('en-in').transform(value.from_date, 'yyyy-MM-dd'),
			'to_date': new DatePipe('en-in').transform(value.to_date, 'yyyy-MM-dd'),
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
				id: 'srno',
				name: 'SNo.',
				field: 'srno',
				sortable: true,
				width: 1
			},
			// {
			// 	id: 'invoice_created_date', name: 'Invoice Date', field: 'invoice_created_date', sortable: true, width: 4,
			// 	filterable: true,
			// 	formatter: this.checkDateFormatter,
			// 	grouping: {
			// 		getter: 'invoice_created_date',
			// 		formatter: (g) => {
			// 			return `${new DatePipe('en-in').transform(g.value, 'd-MMM-y')}  <span style="color:green">(${g.count})</span>`;
			// 		},
			// 		aggregators: this.aggregatearray,
			// 		aggregateCollapsed: true,
			// 		collapsed: false,
			// 	},
			// },
			{
				id: 'stu_admission_no', name: 'Enrollment No', field: 'stu_admission_no', filterable: true,
				width: 4
			},
			{
				id: 'stu_full_name', name: 'Student Name', field: 'stu_full_name', filterable: true, width: 6,
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
				id: 'stu_class_name', name: 'Class-Section', field: 'stu_class_name', sortable: true, width: 4,
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
				id: 'opening_outstanding',
				name: 'Opening Outstanding',
				field: 'opening_outstanding',
				sortable: true,
				filterable: true,
				
			},
			{
				id: 'opening_advances',
				name: 'Opening Advances',
				field: 'opening_advances',
				sortable: true,
				filterable: true,
				
			},
			{
				id: 'due_for_period',
				name: 'Due for the Period',
				field: 'due_for_period',
				sortable: true,
				filterable: true,
				
			},
			{
				id: 'total_receivables',
				name: 'Total Receivables',
				field: 'total_receivables',
				sortable: true,
				filterable: true,
				
			},
			{
				id: 'receipt_during_the_period',
				name: 'Receipt During The Period',
				field: 'receipt_during_the_period',
				sortable: true,
				filterable: true,
				
			},
			{
				id: 'balance',
				name: 'Balance',
				field: 'balance',
				sortable: true,
				filterable: true,
				
			},
			{
				id: 'outstanding_end_of_period',
				name: 'O/S End of the period',
				field: 'outstanding_end_of_period',
				sortable: true,
				filterable: true,
				
			},
			{
				id: 'adv_end_of_period',
				name: 'Adv end of the period',
				field: 'adv_end_of_period',
				sortable: true,
				filterable: true,
				
			}
			];
		this.feeService.getSummarizedFeeReport(collectionJSON).subscribe((result: any) => {
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
						obj['opening_advances'] = 0;
						obj['opening_outstanding'] = 0;
						obj['adv_end_of_period'] = 0;
						obj['outstanding_end_of_period']=0;
					if (repoArray[Number(index)]['inv_opening_balance'] > 0)
						obj['opening_outstanding'] = Number(repoArray[Number(index)]['inv_opening_balance'] ? repoArray[Number(index)]['inv_opening_balance'] : 0);
					else 
						obj['opening_advances'] = -Number(repoArray[Number(index)]['opening_advances'] ? repoArray[Number(index)]['opening_advances'] : 0);
					
					obj['due_for_period'] = Number(repoArray[Number(index)]['defaulter_inv_group_amount']);
					obj['total_receivables'] = (repoArray[Number(index)]['defaulter_inv_group_amount'] ? Number(repoArray[Number(index)]['defaulter_inv_group_amount']) : 0) + (repoArray[Number(index)]['inv_opening_balance'] ? Number(repoArray[Number(index)]['inv_opening_balance']) : 0) + (repoArray[Number(index)]['opening_advances'] ? Number(repoArray[Number(index)]['opening_advances']) : 0 );
					obj['receipt_during_the_period'] = repoArray[Number(index)]['rpt_net_amount'] ? Number(repoArray[Number(index)]['rpt_net_amount']) : 0;
					obj['balance'] = ((repoArray[Number(index)]['defaulter_inv_group_amount'] ? Number(repoArray[Number(index)]['defaulter_inv_group_amount']) : 0) + (repoArray[Number(index)]['inv_opening_balance']  ?  Number(repoArray[Number(index)]['inv_opening_balance'])  : 0)+ (repoArray[Number(index)]['opening_advances'] ? Number(repoArray[Number(index)]['opening_advances']) : 0) - (repoArray[Number(index)]['rpt_net_amount'] ? Number(repoArray[Number(index)]['rpt_net_amount']) : 0));
					if(Number(obj['balance']) > 0)
						obj['outstanding_end_of_period'] = Number(obj['balance']);
					else 
						obj['adv_end_of_period'] = -Number(obj['balance']);
					
					
					obj['stu_admission_no'] = repoArray[Number(index)]['stu_admission_no'] ?
						repoArray[Number(index)]['stu_admission_no'] : '-';
					obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(index)]['stu_full_name']);
					if (repoArray[Number(index)]['stu_sec_name']) {
						obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'] + '-' +
							repoArray[Number(index)]['stu_sec_name'];
					} else {
						obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'];
					}
					
					this.dataset.push(obj);
					index++;
				}
				this.totalRow = {};
				const obj3: any = {};
				obj3['id'] = 'footer';
				obj3['srno'] = this.common.htmlToText('<b>Grand Total</b>');
				
				obj3['stu_admission_no'] = '';
				obj3['stu_full_name'] = '';
				obj3['stu_class_name'] = '';
				obj3['opening_outstanding'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t.opening_outstanding).reduce((acc, val) => acc + val, 0));
				obj3['opening_advances'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t.opening_advances).reduce((acc, val) => acc + val, 0));
				obj3['due_for_period'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t.due_for_period).reduce((acc, val) => acc + val, 0));
				obj3['total_receivables'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t.total_receivables).reduce((acc, val) => acc + val, 0));
				obj3['receipt_during_the_period'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t.receipt_during_the_period).reduce((acc, val) => acc + val, 0));
				obj3['outstanding_end_of_period'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t.outstanding_end_of_period).reduce((acc, val) => acc + val, 0));
				obj3['adv_end_of_period'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t.adv_end_of_period).reduce((acc, val) => acc + val, 0));
				obj3['balance'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t.balance).reduce((acc, val) => acc + val, 0));
				
				obj3['total'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t.balance).reduce((acc, val) => acc + val, 0));
				//this.dataset.push(obj3);

				this.totalRow = obj3;
				if (this.dataset.length <= 5) {
					this.gridHeight = 300;
				} else if (this.dataset.length <= 10 && this.dataset.length > 5) {
					this.gridHeight = 400;
				} else if (this.dataset.length > 10 && this.dataset.length <= 20) {
					this.gridHeight = 550;
				} else if (this.dataset.length > 20) {
					this.gridHeight = 750;
				}

				console.log(obj3);
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
		this.updateTotalRow(this.angularGrid.slickGrid);
	}

	expandAllGroups() {
		this.dataviewObj.expandAllGroups();
		this.updateTotalRow(this.angularGrid.slickGrid);
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
			if (new DecimalPipe('en-in').transform(((Math.round(parseFloat(val) * 100) / 100)))) {
				return '<b class="total-footer-report">' + new DecimalPipe('en-in').transform(((Math.round(parseFloat(val) * 100) / 100))) + '</b>';
			} else {
				return '';
			}
			
		}
		return '';
	}
	checkFeeFormatter(row, cell, value, columnDef, dataContext) {
		if (value === 0) {
			return '-';
		} else {
			if (value) {
				return new DecimalPipe('en-in').transform(Number(value));
			} else {
				return '-';
			}
			
		}
	}
	checkTotalFormatter(row, cell, value, columnDef, dataContext) {
		if (value === 0) {
			return '-';
		} else {
			if (value) {
				return new DecimalPipe('en-in').transform(Number(value));
			} else {
				return '-';
			}
		}
	}
	checkReceiptFormatter(row, cell, value, columnDef, dataContext) {
		if (value === '-') {
			return '-';
		} else {
			if (value) {
				return '<a>' + value + '</a>';
			} else {
				return '-';
			}
			
		}
	}
	checkDateFormatter(row, cell, value, columnDef, dataContext) {
		if (value != '-') {
			return new DatePipe('en-in').transform(value, 'd-MMM-y');
		} else {
			return "-";
		}
		
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
		this.common.getClassData({}).subscribe((result: any) => {
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
	getReportHeader() {
		return this.reportFilterForm.value.sd_type_value === '1' ? 'Security Deposite' + ' With in System' :
			'Security Deposite' + ' Out of System';
	}
	exportAsPDF() {
		const reportType = this.getReportHeader() + ' : ' + this.currentSession.ses_name;
		const headerData: any[] = [];
		let rowData: any[] = [];
		for (const item of this.columnDefinitions) {
			headerData.push(item.name);
		}
		console.log("=====================", this.dataset);
		// console.log(this.dataviewObj.getGrouping());
		if (this.dataviewObj.getGroups().length === 0) {
			this.dataset.forEach(key => {
				const arr: any[] = [];
				// Object.keys(this.dataset).forEach(key2 => {
				// 	if (key2 !== 'id' && key2 !== 'receipt_id' && key2 !== 'fp_name') {
				// 		arr.push(this.dataset[key][key2]);
				// 	} else if (key2 !== 'id' && key2 !== 'receipt_id' && key2 === 'fp_name') {
				// 		arr.push(this.dataset[key][key2][0]);
				// 	}
				// });
				arr.push(key['srno']);
				arr.push(key['stu_admission_no']);
				arr.push(key['stu_full_name']);
				arr.push(key['stu_class_name']);
				arr.push(key['opening_outstanding']);
				arr.push(key['opening_advances']);
				arr.push(key['due_for_period']);
				arr.push(key['total_receivables']);
				arr.push(key['receipt_during_the_period']);
				arr.push(key['balance']);
				arr.push(key['outstanding_end_of_period']);
				arr.push(key['adv_end_of_period']);


				rowData.push(arr);
			});
			let arr = [];
			arr.push(this.totalRow['srno']);
			arr.push(this.totalRow['stu_admission_no']);
			arr.push(this.totalRow['stu_full_name']);
			arr.push(this.totalRow['stu_class_name']);
			arr.push(this.totalRow['opening_outstanding']);
			arr.push(this.totalRow['opening_advances']);
			arr.push(this.totalRow['due_for_period']);
			arr.push(this.totalRow['total_receivables']);
			arr.push(this.totalRow['receipt_during_the_period']);
			arr.push(this.totalRow['balance']);
			arr.push(this.totalRow['outstanding_end_of_period']);
			arr.push(this.totalRow['adv_end_of_period']);
			rowData.push(arr);
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
					fontSize: 20,
				},
				useCss: true,
				theme: 'striped'
			});
			doc.autoTable({
				// tslint:disable-next-line:max-line-length
				head: [['Generated By: ' + new TitleCasePipe().transform(this.currentUser.full_name)]],
				didDrawPage: function (data) {
	
				},
				headStyles: {
					fontStyle: 'bold',
					fillColor: '#ffffff',
					textColor: 'black',
					halign: 'left',
					fontSize: 20,
				},
				useCss: true,
				theme: 'striped'
			});
			//doc.save('table.pdf');
			doc.save(reportType + '_' + this.reportdate + '.pdf');
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
			//doc.save('table.pdf');
			doc.save(reportType + '_' + this.reportdate + '.pdf');
			console.log(rowData);
		}
	}

	exportToExcel() {
		const columns: any[] = [];
		const columValue: any[] = [];
		for (const item of this.columnDefinitions) {
			// console.log("i am item --------------", item);
			columns.push({
				key: item.id,
				width: 8
			});
			
			columValue.push(item.name);
		}
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet("Summarized Fee Review Report", { properties: { showGridLines: true } });
		worksheet.mergeCells('A1:' + this.alphabetJSON[columns.length] + '1'); // Extend cell over all column headers
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[columns.length] + '2');
		worksheet.getCell('A2').value = 'Summarized Fee Review Report';
		worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
		worksheet.getRow(4).values = columValue;
		worksheet.columns = columns;

		this.dataset.forEach(e => {
			worksheet.addRow(e);
		});

		worksheet.addRow(this.totalRow);

		worksheet.getRow(worksheet._rows.length).eachCell(cell => {
			this.columnDefinitions.forEach(element => {
				cell.font = {
					color: { argb: 'ffffff' },
					bold: true,
					name: 'Arial',
					size: 10
				};
				cell.alignment = { wrapText: true, horizontal: 'center', vertical: 'middle' };
				cell.fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '439f47' },
					bgColor: { argb: '439f47' }
				};
				cell.border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' }
				};
			});
		});
		// style all row of excel
		worksheet.eachRow((row, rowNum) => {
			if (rowNum === 1) {
				row.font = {
					name: 'Arial',
					size: 14,
					bold: true
				};
			} else if (rowNum === 2) {
				row.font = {
					name: 'Arial',
					size: 12,
					bold: true
				};
			} else if (rowNum === 4) {
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
					cell.alignment = { horizontal: 'center', wrapText: true };
				});
			} else if (rowNum > 4 && rowNum < worksheet._rows.length) {
				const cellIndex = this.notFormatedCellArray.findIndex(item => item === rowNum);
				if (cellIndex === -1) {
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
					}

				}
			}
		});

		worksheet.addRow({});
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
		worksheet.getCell('A' + worksheet._rows.length).value = 'Generated By: ' + this.currentUser.full_name;
		worksheet.getCell('A' + worksheet._rows.length).font = {
			name: 'Arial',
			size: 10,
			bold: true
		};

		workbook.xlsx.writeBuffer().then(data => {
			const blob = new Blob([data], { type: 'application/octet-stream' });
			saveAs(blob, 'Summarized_fee_review.xlsx');
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


	

	getSession() {
		this.sisService.getSession().subscribe((result2: any) => {
			if (result2.status === 'ok') {
				const sessionArray = result2.data;
				const ses_id = JSON.parse(localStorage.getItem('session')).ses_id;
				sessionArray.forEach(element => {
					if (element.ses_id === ses_id) {
						this.currentSession = element;
					}
				});
			}
		});
	}

	generate() {
		this.getSummarizedFeeReviewReport(this.reportFilterForm.value);
	}
}
