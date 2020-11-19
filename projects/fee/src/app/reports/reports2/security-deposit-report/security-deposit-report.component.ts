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
	selector: 'app-security-deposit-report',
	templateUrl: './security-deposit-report.component.html',
	styleUrls: ['./security-deposit-report.component.css']
})
export class SecurityDepositReportComponent implements OnInit {
	reportdate = new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
	gridHeight: any;
	totalRow: any;
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
	schoolInfo: any;
	activeReport = 1;
	currentSession;
	constructor(translate: TranslateService,
		private feeService: FeeService,
		private common: CommonAPIService,
		private sisService: SisService,
		public dialog: MatDialog,
		private fbuild: FormBuilder) { }

	ngOnInit() {
		this.getSchool();
		this.getSession();
		this.buildForm();
		this.getClassData();
		this.filterFlag = true;
		this.getSecurityFeeReport(this.reportFilterForm.value);
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

	getSecurityFeeReport(value: any) {
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
			defaultColumnWidth:100,
			forceFitColumns:false,
			enableAutoResize:false,
			autoFitColumnsOnFirstLoad:false,
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
			{
				id: 'invoice_created_date', name: 'Invoice Date', field: 'invoice_created_date', sortable: true, width: 4,
				filterable: true,
				formatter: this.checkDateFormatter,
				grouping: {
					getter: 'invoice_created_date',
					formatter: (g) => {
						return `${new DatePipe('en-in').transform(g.value, 'd-MMM-y')}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false,
				},
			},
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
			// {
			// 	id: 'invoice_no',
			// 	name: 'Invoice No.',
			// 	field: 'invoice_no',
			// 	sortable: true,
			// 	filterable: true,
			// 	formatter: this.checkReceiptFormatter
			// },
			// {
			// 	id: 'receipt_no',
			// 	name: 'Receipt No.',
			// 	field: 'receipt_no',
			// 	sortable: true,
			// 	filterable: true,
			// 	formatter: this.checkReceiptFormatter
			// },
			{
				id: 'fh_amount',
				name: 'Fee Amount',
				field: 'fh_amount',
				sortable: true,
				filterable: true,
				type:FieldType.number,
				filterSearchType: FieldType.number,
				filter: { model: Filters.compoundInputNumber },
				// formatter: this.checkFeeFormatter,
				// groupTotalsFormatter: this.sumTotalsFormatter
			},
			{
				id: 'refund_status',
				name: 'Refund Status',
				field: 'refund_status',
				sortable: true,
				filterable: true
			},
			{
				id: 'refund_date',
				name: 'Refund Date',
				field: 'refund_date',
				sortable: true, width: 4,
				filterable: true,
				formatter: this.checkDateFormatter,
				grouping: {
					getter: 'refund_date',
					formatter: (g) => {
						if (g.value !== '-') {
							return `${new DatePipe('en-in').transform(g.value, 'd-MMM-y')}  <span style="color:green">(${g.count})</span>`;
						} else {
							return '-';
						}
						
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false,
				},
				
			}];
		this.feeService.getAdvanceSecurityDepositReport(collectionJSON).subscribe((result: any) => {
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
					obj['invoice_created_date'] = repoArray[Number(index)]['invoice_created_date'];
					obj['stu_admission_no'] = repoArray[Number(index)]['stu_admission_no'] ?
						repoArray[Number(index)]['stu_admission_no'] : '-';
					obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(index)]['stu_full_name']);
					if (repoArray[Number(index)]['stu_sec_name']) {
						obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'] + '-' +
							repoArray[Number(index)]['stu_sec_name'];
					} else {
						obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'];
					}
					obj['invoice_no'] = repoArray[Number(index)]['invoice_no'] ?
						repoArray[Number(index)]['invoice_no'] : '-';
					obj['receipt_no'] = repoArray[Number(index)]['receipt_no'] ?
						repoArray[Number(index)]['receipt_no'] : '-';
					obj['fh_amount'] = item['fh_amount'] ?
						Number(item['fh_amount']) : 0;
					obj['refund_date'] = item['fsd_status'] === '2' ? item['fsd_created_date'] : '-';
					obj['refund_status'] = item['fsd_status'] === '2' ? 'Paid' : item['fsd_status'] === '3' ? 'Forfeited' : 'Active';
					this.dataset.push(obj);
					index++;
				}
				this.totalRow = {};
				const obj3: any = {};
				obj3['id'] = 'footer';
				obj3['srno'] = this.common.htmlToText('<b>Grand Total</b>');
				obj3['invoice_created_date'] = this.common.htmlToText('');
				obj3['stu_admission_no'] = '';
				obj3['stu_full_name'] = '';
				obj3['stu_class_name'] = '';
				obj3['invoice_no'] = '';
				obj3['receipt_no'] = '';
				obj3['fh_amount'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t.fh_amount).reduce((acc, val) => acc + val, 0));
				obj3['refund_date'] = this.common.htmlToText('');
				obj3['refund_status'] = '';	
				obj3['total'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t.fh_amount).reduce((acc, val) => acc + val, 0));
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


	getBulkSecurityFeeReport(value: any) {
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
			defaultColumnWidth:100,
			forceFitColumns:false,
			enableAutoResize:false,
			autoFitColumnsOnFirstLoad:false,
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
			{
				id: 'invoice_created_date', name: 'Invoice Date', field: 'invoice_created_date', sortable: true, width: 4,
				filterable: true,
				formatter: this.checkDateFormatter,
				grouping: {
					getter: 'invoice_created_date',
					formatter: (g) => {
						return `${new DatePipe('en-in').transform(g.value, 'd-MMM-y')}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false,
				},
			},
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
			// {
			// 	id: 'invoice_no',
			// 	name: 'Invoice No.',
			// 	field: 'invoice_no',
			// 	sortable: true,
			// 	filterable: true,
			// 	formatter: this.checkReceiptFormatter
			// },
			// {
			// 	id: 'receipt_no',
			// 	name: 'Receipt No.',
			// 	field: 'receipt_no',
			// 	sortable: true,
			// 	filterable: true,
			// 	formatter: this.checkReceiptFormatter
			// },
			{
				id: 'fh_amount',
				name: 'Fee Amount',
				field: 'fh_amount',
				sortable: true,
				filterable: true,
				// formatter: this.checkFeeFormatter,
				// groupTotalsFormatter: this.sumTotalsFormatter
			},
			{
				id: 'refund_status',
				name: 'Refund Status',
				field: 'refund_status',
				sortable: true,
				filterable: true
			},
			{
				id: 'refund_date',
				name: 'Refund Date',
				field: 'refund_date',
				sortable: true, width: 4,
				filterable: true,
				formatter: this.checkDateFormatter,
				grouping: {
					getter: 'refund_date',
					formatter: (g) => {
						if (g.value !== '-') {
							return `${new DatePipe('en-in').transform(g.value, 'd-MMM-y')}  <span style="color:green">(${g.count})</span>`;
						} else {
							return '-';
						}
						
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false,
				},
				
			}];
		this.feeService.getBulkSecurityDepositReport(collectionJSON).subscribe((result: any) => {
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
					obj['invoice_created_date'] = repoArray[Number(index)]['invoice_created_date'];
					obj['stu_admission_no'] = repoArray[Number(index)]['stu_admission_no'] ?
						repoArray[Number(index)]['stu_admission_no'] : '-';
					obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(index)]['stu_full_name']);
					if (repoArray[Number(index)]['stu_sec_name']) {
						obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'] + '-' +
							repoArray[Number(index)]['stu_sec_name'];
					} else {
						obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'];
					}
					obj['invoice_no'] = repoArray[Number(index)]['invoice_no'] ?
						repoArray[Number(index)]['invoice_no'] : '-';
					obj['receipt_no'] = repoArray[Number(index)]['receipt_no'] ?
						repoArray[Number(index)]['receipt_no'] : '-';
					obj['fh_amount'] = item['fh_amount'] ?
						Number(item['fh_amount']) : 0;
					obj['refund_date'] = item['fsd_status'] === '2' ? item['fsd_created_date'] : '-';
					obj['refund_status'] = item['fsd_status'] === '2' ? 'Paid' : item['fsd_status'] === '3' ? 'Forfeited' : 'Active';
					this.dataset.push(obj);
					index++;
				}
				this.totalRow = {};
				const obj3: any = {};
				obj3['id'] = 'footer';
				obj3['srno'] = this.common.htmlToText('<b>Grand Total</b>');
				obj3['invoice_created_date'] = this.common.htmlToText('');
				obj3['stu_admission_no'] = '';
				obj3['stu_full_name'] = '';
				obj3['stu_class_name'] = '';
				obj3['invoice_no'] = '';
				obj3['receipt_no'] = '';
				obj3['fh_amount'] =
					new DecimalPipe('en-in').transform(this.dataset.map(t => t.fh_amount).reduce((acc, val) => acc + val, 0));
				obj3['refund_date'] = this.common.htmlToText('');
				obj3['refund_status'] = '';	
				obj3['total'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t.fh_amount).reduce((acc, val) => acc + val, 0));
			//	this.dataset.push(obj3);					

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
				this.tableFlag = true;
			} else {
				this.tableFlag = true;
			}
		});
	}

	getSecurityDeposit(event) {
		this.dataset = [];
		if (event.value === 1) {
			this.activeReport = 1;
			
		} else {
			this.activeReport = 2;
			
		}
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
		if (this.activeReport == 1) {
			this.getSecurityFeeReport(this.reportFilterForm.value);
		} else {
			this.getBulkSecurityFeeReport(this.reportFilterForm.value);
		}
	}
}
