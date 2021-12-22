
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {
	GridOption, Column, AngularGridInstance, Grouping, Aggregators,
	FieldType,
	Filters,
	Formatters,
	Sorters,
	SortDirectionNumber,
	DelimiterType,
	FileType
} from 'angular-slickgrid';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import * as Excel from 'exceljs/dist/exceljs';
import * as ExcelProper from 'exceljs';
import { TranslateService } from '@ngx-translate/core';
import { FeeService, CommonAPIService, SisService } from '../../../_services';
import { DecimalPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { CapitalizePipe, IndianCurrency } from '../../../_pipes';
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
	selector: 'app-fee-outstanding-summary-report',
	templateUrl: './fee-outstanding-summary-report.component.html',
	styleUrls: ['./fee-outstanding-summary-report.component.css']
})
export class FeeOutstandingSummaryReportComponent implements OnInit {
	reportdate = new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
	@Input() userName: any = '';
	groupColumns: any[] = [];
	exportColumnDefinitions: any[] = [];
	feeHeadJSON: any[] = [];
	groupLength: any;
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
		44: 'AR'
	};
	sessionArray: any[] = [];
	totalRow: any;
	session: any = {};
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
	sessionName: any;
	filteredAs: any = {};
	currentUser: any;
	pdfrowdata: any[] = [];
	levelHeading: any[] = [];
	levelTotalFooter: any[] = [];
	levelSubtotalFooter: any[] = [];
	notFormatedCellArray: any[] = [];
	@Output() displyRep = new EventEmitter();
	gridHeight: number;
	constructor(translate: TranslateService,
		private feeService: FeeService,
		private common: CommonAPIService,
		private sisService: SisService,
		public dialog: MatDialog,
		private fbuild: FormBuilder) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
		this.getSchool();
		this.getSession();
		this.buildForm();
		this.getFeeHeads();

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
		this.updateClassSort(angularGrid.slickGrid, angularGrid.dataView);
		this.updateTotalRow(angularGrid.slickGrid);
	}
	parseRoman(s) {
		var val = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
		return s.toUpperCase().split('').reduce((r, a, i, aa) => {
			return val[a] < val[aa[i + 1]] ? r - val[a] : r + val[a];
		}, 0);
	}
	isRoman(s) {
		// http://stackoverflow.com/a/267405/1447675
		return /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i.test(s);
	}
	updateClassSort(grid: any, dataView: any) {
		let columnIdx = grid.getColumns().length;
		while (columnIdx--) {
			const columnId = grid.getColumns()[columnIdx];
			if (columnId['name'] == 'Class Name' || columnId['name'] == 'Class-Section') {
				grid.onSort.subscribe((e, args) => {


					// We'll use a simple comparer function here.
					args = args.sortCols[0];
					var comparer = (a, b) => {
						if (this.isRoman(a[args.sortCol.field].split(" ")[0]) || this.isRoman(b[args.sortCol.field].split(" ")[0])) {

							return (this.parseRoman(a[args.sortCol.field].split(" ")[0]) > this.parseRoman(b[args.sortCol.field].split(" ")[0])) ? 1 : -1;


						} else if (this.isRoman(a[args.sortCol.field].split("-")[0]) || this.isRoman(b[args.sortCol.field].split("-")[0])) {

							return (this.parseRoman(a[args.sortCol.field].split("-")[0]) > this.parseRoman(b[args.sortCol.field].split("-")[0])) ? 1 : -1;


						} else {

							return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
						}

					}
					dataView.sort(comparer, args.sortAsc);
				});
			}
		}
	}
	updateTotalRow(grid: any) {
		let columnIdx = grid.getColumns().length;
		// console.log("-------------------------",grid.getColumns(), columnIdx, grid.getColumns()[columnIdx]);
		
		while (columnIdx--) {
			
			const columnId = grid.getColumns()[columnIdx].id;
			// console.log("-------------------------",this.totalRow[columnId], grid.getColumns(),columnId, columnIdx, grid.getColumns()[columnIdx]);
			if (columnId && (grid.getFooterRowColumn(columnId) || grid.getFooterRowColumn(columnId.toString()))) {
				console.log("--___", grid.getFooterRowColumn(columnId), columnId, this.totalRow[columnId]);
				if(grid.getFooterRowColumn(columnId)) {
					const columnElement: HTMLElement = grid.getFooterRowColumn(columnId);
					columnElement.innerHTML = '<b>' + this.totalRow[columnId] + '<b>';
				} else {
					const columnElement: HTMLElement = grid.getFooterRowColumn(columnId.toString());
					columnElement.innerHTML = '<b>' + this.totalRow[columnId] + '<b>';
				}
				
			}
		}
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
			'order_by': '',
			'month': ''
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
			footerRowHeight: 35,
			enableExcelCopyBuffer: true,
			fullWidthRows: true,
			enableAutoTooltip: true,
			enableCellNavigation: true,
			rowHeight: 65,
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
						this.exportAsPDF(this.dataset);
					}
					if (args.command === 'expandGroup') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.expandAllGroups();
					}
					if (args.command === 'collapseGroup') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.collapseAllGroups();
					}
					if (args.command === 'exportAsExcel') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.exportToExcel(this.dataset);
					}
					if (args.command === 'cleargroup') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.clearGrouping();
					}
					if (args.command === 'export-csv') {
						this.exportToFile('csv');
					}
				},
				onColumnsChanged: (e, args) => {
					console.log('Column selection changed from Grid Menu, visible columns: ', args.columns);
					this.updateTotalRow(this.angularGrid.slickGrid);
				},
			},
			draggableGrouping: {
				dropPlaceHolderText: 'Drop a column header here to group by the column',
				// groupIconCssClass: 'fa fa-outdent',
				deleteIconCssClass: 'fa fa-times',
				onGroupChanged: (e, args) => {
					this.groupColumns = [];
					this.groupColumns = args.groupColumns;
					this.onGroupChanged(args && args.groupColumns);
					setTimeout(() => {
						this.updateTotalRow(this.angularGrid.slickGrid);
					}, 100);
				},
				onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
			}
		};
		let repoArray = [];
		this.columnDefinitions = [];
		this.dataset = [];
		const collectionJSON: any = {
			'admission_no': '',
			'studentName': '',
			'report_type': this.reportType,
			'routeId': value.fee_value,
			'from_date': value.from_date,
			'to_date': value.to_date,
			'pageSize': '10',
			'pageIndex': '0',
			'filterReportBy': 'collection',
			'login_id': value.login_id,
			'orderBy': value.orderBy,
			'downloadAll': true,
			'month': value.month
		};
		this.feeService.getFeeSummaryPeriodWiseReport(collectionJSON).subscribe((res: any) => {
			if (res.status) {
				if (res.data.length > 0) {
					if (this.reportType == "daily") {
						this.columnDefinitions = [
							{
								id: 'id',
								name: 'SNo.',
								field: 'id',
								sortable: true,
								width: 4
							},
							{
								id: 'fh_name',
								name: 'Fee Head',
								field: 'fh_name',
								sortable: true,
								width: 4
							},
							{
								id: 'fh_amount',
								name: 'Amount',
								field: 'fh_amount',
								sortable: true,
								width: 4,
								formatter: this.checkFeeFormatter,
							},
						];
						let pos = 1;
						res.data.forEach(element => {
							let obj: any = {};
							obj.id = pos;
							obj.fh_name = element.fh_name;
							obj.fh_amount = element.fh_amount;
							this.dataset.push(obj);
							pos++;
						});
						this.totalRow = this.dataset[this.dataset.length - 1];
						console.log("i am total roe", this.totalRow);
						
						this.dataset.pop();
						// this.aggregatearray.push(new Aggregators.Sum('fh_amount'));
						
						this.tableFlag = true
					} else if (this.reportType == "monthly") {
						this.columnDefinitions = [
							{
								id: 'id',
								name: 'SNo.',
								field: 'id',
								sortable: true,
							},
							{
								id: 'day',
								name: 'Day',
								field: 'day',
								sortable: true,
								formatter: this.checkDateFormatter

							},
						];
						let aa = Object.keys(res.data[0]);
						console.log(res.data);
						let month_days = [];

						aa.forEach(element => {
							if (element != "id" && element != "fh_id" && element != "fh_name") {
								month_days.push(element)
							}
						});
						console.log("i am month", month_days);

						res.data.forEach(element => {

							let obj = {
								id: element.fh_id != "null" && element.fh_id != null ? element.fh_id.toString() : 'Total',
								name: element.fh_name,
								field: element.fh_id != "null" && element.fh_id != null ? element.fh_id.toString() : 'Total',
								sortable: true,
								formatter: this.checkFeeFormatter,
							}
							this.columnDefinitions.push(obj);

						});
						let i = 1
						month_days.forEach(element => {
							let obj = {}
							obj['id'] = i;
							obj['srno'] = i;
							i += 1;
							obj['day'] = element
							res.data.forEach(element1 => {
								// console.log(element1, '------------------------------');
								if (element1['fh_id']) {
									obj[element1['fh_id'].toString()] = element1[element]
								} else {
									obj['Total'] = element1[element]
								}

							});
							this.dataset.push(obj)
						});
						console.log("i am here", this.columnDefinitions, this.dataset);
						this.totalRow = this.dataset[this.dataset.length - 1];
						console.log("i am total roe", this.totalRow);
						// this.dataset.pop();
						// this.aggregatearray.push(new Aggregators.Sum('fh_amount'));
						// this.dataset = res.data;
						this.tableFlag = true
					} else if (this.reportType == "yearly") {
						this.columnDefinitions = this.valueArray;
						let data_total = {};
						data_total['id'] = 'grand';
						let insert = false;
						this.valueArray.forEach((e) => {
							if (e.id == 'srno') {
								data_total[e.id] = ''
							} else if (e.id == "mnth") {
								data_total[e.id] = 'Grand Total'
							} else {
								data_total[e.id.toString()] = 0
							}
						})


						let year1 = Number(this.sessionName.split('-')[0]) - 1;
						let year2 = Number(this.sessionName.split('-')[0]);
						let year3 = Number(this.sessionName.split('-')[1]);

						let obj = {};
						obj['id'] = 1
						obj['srno'] = 1
						obj['mnth'] = "October-" + year1
						res.data.forEach(element => {
							if (element[obj['mnth']]) {
								obj[element.fh_id] = Number(element[obj['mnth']])
								data_total[element.fh_id] += Number(element[obj['mnth']]);
								insert = true;
							} else {
								obj[element.fh_id] = 0;
							}
						});
						if (insert) {
							this.dataset.push(obj);
						}
						insert = false
						obj = {};
						obj['id'] = 2
						obj['srno'] = 2
						obj['mnth'] = "November-" + year1
						res.data.forEach(element => {
							if (element[obj['mnth']]) {
								obj[element.fh_id] = Number(element[obj['mnth']]);
								data_total[element.fh_id] += Number(element[obj['mnth']]);
								insert = true;
							} else {
								obj[element.fh_id] = 0;
							}
						});

						if (insert) {
							this.dataset.push(obj);
						}
						obj = {};
						obj['id'] = 3
						obj['srno'] = 3
						obj['mnth'] = "December-" + year1
						res.data.forEach(element => {
							if (element[obj['mnth']]) {
								obj[element.fh_id] = Number(element[obj['mnth']]);
								data_total[element.fh_id] += Number(element[obj['mnth']]);
								insert = true;
							} else {
								obj[element.fh_id] = 0;
							}
						});

						if (insert) {
							this.dataset.push(obj);
						}
						obj = {};
						obj['id'] = 4
						obj['srno'] = 4
						obj['mnth'] = "January-" + year2
						res.data.forEach(element => {
							if (element[obj['mnth']]) {
								obj[element.fh_id] = Number(element[obj['mnth']]);
								data_total[element.fh_id] += Number(element[obj['mnth']]);
								insert = true;
							} else {
								obj[element.fh_id] = 0;
							}
						});

						if (insert) {
							this.dataset.push(obj);
						}
						obj = {};
						obj['id'] = 5
						obj['srno'] = 5
						obj['mnth'] = "February-" + year2
						res.data.forEach(element => {
							if (element[obj['mnth']]) {
								obj[element.fh_id] = Number(element[obj['mnth']]);
								data_total[element.fh_id] += Number(element[obj['mnth']]);
								insert = true;
							} else {
								obj[element.fh_id] = 0;
							}
						});

						if (insert) {
							this.dataset.push(obj);
						}
						obj = {};
						obj['id'] = 6
						obj['srno'] = 6
						obj['mnth'] = "March-" + year2
						res.data.forEach(element => {
							if (element[obj['mnth']]) {
								obj[element.fh_id] = Number(element[obj['mnth']]);
								data_total[element.fh_id] += Number(element[obj['mnth']]);
								insert = true;
							} else {
								obj[element.fh_id] = 0;
							}
						});

						if (insert) {
							this.dataset.push(obj);
						}
						obj = {};
						obj['id'] = 7
						obj['srno'] = 7
						obj['mnth'] = "April-" + year2
						res.data.forEach(element => {
							if (element[obj['mnth']]) {
								obj[element.fh_id] = Number(element[obj['mnth']])
								data_total[element.fh_id] += Number(element[obj['mnth']])
							} else {
								obj[element.fh_id] = 0;
							}
						});

						this.dataset.push(obj);
						obj = {};
						obj['id'] = 8
						obj['srno'] = 8
						obj['mnth'] = "May-" + year2
						res.data.forEach(element => {
							if (element[obj['mnth']]) {
								obj[element.fh_id] = Number(element[obj['mnth']])
								data_total[element.fh_id] += Number(element[obj['mnth']])
							} else {
								obj[element.fh_id] = 0;
							}
						});

						this.dataset.push(obj);
						obj = {};
						obj['id'] = 9
						obj['srno'] = 9
						obj['mnth'] = "June-" + year2
						res.data.forEach(element => {
							if (element[obj['mnth']]) {
								obj[element.fh_id] = Number(element[obj['mnth']])
								data_total[element.fh_id] += Number(element[obj['mnth']])
							} else {
								obj[element.fh_id] = 0;
							}
						});

						this.dataset.push(obj);
						obj = {};
						obj['id'] = 10
						obj['srno'] = 10
						obj['mnth'] = "July-" + year2
						res.data.forEach(element => {
							if (element[obj['mnth']]) {
								obj[element.fh_id] = Number(element[obj['mnth']])
								data_total[element.fh_id] += Number(element[obj['mnth']])
							} else {
								obj[element.fh_id] = 0;
							}
						});

						this.dataset.push(obj);
						obj = {};
						obj['id'] = 11
						obj['srno'] = 11
						obj['mnth'] = "August-" + year2
						res.data.forEach(element => {
							if (element[obj['mnth']]) {
								obj[element.fh_id] = Number(element[obj['mnth']])
								data_total[element.fh_id] += Number(element[obj['mnth']])
							} else {
								obj[element.fh_id] = 0;
							}
						});

						this.dataset.push(obj);
						obj = {};
						obj['id'] = 12
						obj['srno'] = 12
						obj['mnth'] = "September-" + year2
						res.data.forEach(element => {
							if (element[obj['mnth']]) {
								obj[element.fh_id] = Number(element[obj['mnth']])
								data_total[element.fh_id] += Number(element[obj['mnth']])
							} else {
								obj[element.fh_id] = 0;
							}
						});

						this.dataset.push(obj);
						obj = {};
						obj['id'] = 13
						obj['srno'] = 13
						obj['mnth'] = "October-" + year2
						res.data.forEach(element => {
							if (element[obj['mnth']]) {
								obj[element.fh_id] = Number(element[obj['mnth']])
								data_total[element.fh_id] += Number(element[obj['mnth']])
							} else {
								obj[element.fh_id] = 0;
							}
						});

						this.dataset.push(obj);
						obj = {};
						obj['id'] = 14
						obj['srno'] = 14
						obj['mnth'] = "November-" + year2
						res.data.forEach(element => {
							if (element[obj['mnth']]) {
								obj[element.fh_id] = Number(element[obj['mnth']])
								data_total[element.fh_id] += Number(element[obj['mnth']])
							} else {
								obj[element.fh_id] = 0;
							}
						});

						this.dataset.push(obj);
						obj = {};
						obj['id'] = 15
						obj['srno'] = 15
						obj['mnth'] = "December-" + year2
						res.data.forEach(element => {
							if (element[obj['mnth']]) {
								obj[element.fh_id] = Number(element[obj['mnth']])
								data_total[element.fh_id] += Number(element[obj['mnth']])
							} else {
								obj[element.fh_id] = 0;
							}
						});

						this.dataset.push(obj);
						obj = {};
						obj['id'] = 16
						obj['srno'] = 16
						obj['mnth'] = "January-" + year3
						res.data.forEach(element => {
							if (element[obj['mnth']]) {
								obj[element.fh_id] = Number(element[obj['mnth']])
								data_total[element.fh_id] += Number(element[obj['mnth']])
							} else {
								obj[element.fh_id] = 0;
							}
						});

						this.dataset.push(obj);
						obj = {};
						obj['id'] = 17
						obj['srno'] = 17
						obj['mnth'] = "February-" + year3
						res.data.forEach(element => {
							if (element[obj['mnth']]) {
								obj[element.fh_id] = Number(element[obj['mnth']])
								data_total[element.fh_id] += Number(element[obj['mnth']])
							} else {
								obj[element.fh_id] = 0;
							}
						});

						this.dataset.push(obj);

						obj = {};
						obj['id'] = 19
						obj['srno'] = 19
						obj['mnth'] = "April-" + year3
						res.data.forEach(element => {
							if (element[obj['mnth']]) {
								obj[element.fh_id] = Number(element[obj['mnth']])
								data_total[element.fh_id] += Number(element[obj['mnth']])
							} else {
								obj[element.fh_id] = 0;
							}
						});

						this.dataset.push(obj);
						this.dataset.push(data_total);
						console.log("i am total", data_total, this.valueArray, this.dataset);
						// this.totalRow = data_total;
						this.totalRow = data_total
						// console.log("i am total roe", this.totalRow);
						this.tableFlag = true
					}
				}

			} else {
				this.tableFlag = true;
			}
		})


	}
	clearGroupsAndSelects() {
		this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = '');
		this.clearGrouping();
	}
	checkReturn(data) {
		if (Number(data)) {
			return Number(data);
		} else {
			return data;
		}
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
				this.openDialogReceipt(item['receipt_id'], false);
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
			if (value > 0) {
				return new IndianCurrency().transform(value);
			} else {
				if (value && value != '-') {
					return '-' + new IndianCurrency().transform(-value);
				}
			}

		}
	}
	// checkFeeFormatter(row, cell, value, columnDef, dataContext) {
	// 	if (value === 0) {
	// 		return '-';
	// 	} else {
	// 		if (value) {
	// 			return new DecimalPipe('en-in').transform(value);
	// 		} else {
	// 			return '-';
	// 		}
	// 	}
	// }
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
		if (value !== '<b>Grand Total</b>' && value !== 'Total' && value !== '-' && value !== '') {
			return new DatePipe('en-in').transform(value, 'd-MMM-y');
		} else {
			return value;
		}
	}
	checkDateFormatter2(row, cell, value, columnDef, dataContext) {
		if (value !== 'Grand Total' && value !== '-' && value !== '') {
			return new DatePipe('en-in').transform('01-' + value, 'MMM-yy');
		} else {
			return value;
		}
	}
	srnTotalsFormatter(totals, columnDef) {
		if (totals.group.level === 0) {
			return '<b class="total-footer-report">Total</b>';
		}
		if (totals.group.level > 0) {
			return '<b class="total-footer-report">Sub Total (' + totals.group.value + ') </b>';
		}
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
				rpt_id: invoiceNo,
				edit: edit
			},
			hasBackdrop: true
		});
	}
	getFeeHeads() {
		this.valueArray = [];
		this.valueArray.push({
			id: 'srno',
			name: "Sr. No",
			field: 'srno',
			sortable: true,
			width: 4,
		});
		this.valueArray.push({
			id: 'mnth',
			name: "Month",
			field: 'mnth',
			sortable: true,
			width: 4,
			formatter: this.checkDateFormatter2
		});
		this.feeService.getFeeHeads({ fh_is_hostel_fee: '' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				for (const item of result.data) {
					this.valueArray.push({
						id: Number(item.fh_id),
						name: item.fh_name,
						field: Number(item.fh_id),
						sortable: true,
						width: 4,
						formatter: this.checkFeeFormatter,
					});
				}
				this.valueArray.push({
					id: 'transport',
					name: "Transport",
					field: 'transport',
					sortable: true,
					width: 4,
					formatter: this.checkFeeFormatter,
				});
				this.valueArray.push({
					id: 'adhoc',
					name: "Adhoc",
					field: 'adhoc',
					sortable: true,
					width: 4,
					formatter: this.checkFeeFormatter,
				});
				this.valueArray.push({
					id: 'fine',
					name: "Fine",
					field: 'fine',
					sortable: true,
					width: 4,
					formatter: this.checkFeeFormatter,
				});
				this.valueArray.push({
					id: 'fh_id',
					name: "Total",
					field: 'fh_id',
					sortable: true,
					width: 4,
					formatter: this.checkFeeFormatter,
				});
			}

		});

		console.log("i am value----------", this.valueArray);


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
		this.reportType = $event.value;
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
			if($event.value) {
				this.reportFilterForm.patchValue({
					'from_date': new Date()
				})
			}
			this.displyRep.emit({ report_index: 15, report_id: $event.value, report_name: this.getReportName($event.value) });
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
			this.displyRep.emit({ report_index: 15, report_id: '', report_name: 'Transport Report' });
			this.filterFlag = false;
		}
	}
	getReportName(value) {
		const findex = this.reportTypeArray.findIndex(f => f.report_type === value);
		if (findex !== -1) {
			return this.reportTypeArray[findex].report_name;
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
	getSessionName(id) {
		const findex = this.sessionArray.findIndex(f => f.ses_id === id);
		if (findex !== -1) {
			return this.sessionArray[findex].ses_name;
		}
	}
	getSession() {
		this.sisService.getSession().subscribe((result2: any) => {
			if (result2.status === 'ok') {
				this.sessionArray = result2.data;


				this.sessionName = this.getSessionName(this.session.ses_id);
				console.log("i am session data", this.sessionName);
			}
		});
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
	exportToFile(type = 'csv') {
		let reportType: any = '';
		this.sessionName = this.getSessionName(this.session.ses_id);
		if (this.reportType === 'routewisecoll') {
			reportType = new TitleCasePipe().transform('route wise collection report: ') + this.sessionName;
		} else if (this.reportType === 'routewiseout') {
			reportType = new TitleCasePipe().transform('route wise outstanding report: ') + this.sessionName;
		} else if (this.reportType === 'transportAlloted') {
			reportType = new TitleCasePipe().transform('Transport allotee report: ') + this.sessionName;
		} else if (this.reportType === 'routeslabstopwise') {
			reportType = new TitleCasePipe().transform('route slab stoppage wise collection report: ') + this.sessionName;
		}
		this.angularGrid.exportService.exportToFile({
			delimiter: (type === 'csv') ? DelimiterType.comma : DelimiterType.tab,
			filename: reportType + '_' + new Date(),
			format: (type === 'csv') ? FileType.csv : FileType.txt
		});
	}
	filtered(event) {
		let commonFilter: any = '';
		for (const item of event.source.selected) {
			commonFilter = commonFilter + item.viewValue + ',';
		}
		this.filteredAs[event.source.ngControl.name] = event.source._placeholder + ' - ' + commonFilter.substring(0, commonFilter.length - 1);
	}
	getParamValue() {
		const filterArr = [];
		Object.keys(this.filteredAs).forEach(key => {
			filterArr.push(this.filteredAs[key]);
		});
		filterArr.push(
			this.common.dateConvertion(this.reportFilterForm.value.from_date, 'd-MMM-y') + ' - ' +
			this.common.dateConvertion(this.reportFilterForm.value.to_date, 'd-MMM-y'));
		return filterArr;
	}
	exportToExcel(json: any[]) {
		this.notFormatedCellArray = [];
		let reportType: any = '';
		const columns: any[] = [];
		const columValue: any[] = [];
		this.exportColumnDefinitions = [];
		this.exportColumnDefinitions = this.angularGrid.slickGrid.getColumns();
		for (const item of this.exportColumnDefinitions) {
			columns.push({
				key: item.id,
				width: this.checkWidth(item.id, item.name)
			});
			columValue.push(item.name);
		}
		this.sessionName = this.getSessionName(this.session.ses_id);
		if (this.reportType === 'yearly') {
			reportType = new TitleCasePipe().transform('Yearly_Fee_Summary_Report_') + this.sessionName;
		} else if (this.reportType === 'monthly') {
			reportType = new TitleCasePipe().transform('Monthly_Fee_Summary_Report_') + this.sessionName;
		} else if (this.reportType === 'daily') {
			reportType = new TitleCasePipe().transform('Daily_Fee_Summary_Report_') + this.sessionName;
		}
		let reportType2: any = '';
		this.sessionName = this.getSessionName(this.session.ses_id);
		if (this.reportType === 'yearly') {
			reportType2 = new TitleCasePipe().transform('Yearly Fee Summary Report: ') + this.sessionName;
		} else if (this.reportType === 'monthly') {
			reportType2 = new TitleCasePipe().transform('Monthly Fee Summary Report: ') + this.sessionName;
		} else if (this.reportType === 'daily') {
			reportType2 = new TitleCasePipe().transform('Daily Fee Summary Report: ') + this.sessionName;
		}
		const fileName = reportType + '_' + this.reportdate + '.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		worksheet.mergeCells('A1:' + this.alphabetJSON[columns.length] + '1'); // Extend cell over all column headers
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[columns.length] + '2');
		worksheet.getCell('A2').value = reportType2;
		worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
		worksheet.getRow(4).values = columValue;
		worksheet.columns = columns;
		if (this.dataviewObj.getGroups().length === 0) {
			Object.keys(json).forEach(key => {
				const obj: any = {};
				for (const item2 of this.exportColumnDefinitions) {

					if (item2.id !== 'fp_name' && item2.id !== 'invoice_created_date') {
						obj[item2.id] = this.checkReturn(this.common.htmlToText(json[key][item2.id]));
					}
					if (item2.id !== 'fp_name' && (item2.id === 'invoice_created_date' ||
						item2.id === 'applicable_from' || item2.id === 'applicable_to') &&
						this.dataset[key][item2.id] !== '-') {
						obj[item2.id] = new DatePipe('en-in').transform((json[key][item2.id]), 'd-MMM-y');
					}
					if (item2.id !== 'fp_name' && item2.id === 'invoice_created_date') {
						obj[item2.id] = this.common.htmlToText(json[key][item2.id]);
					}
					if (item2.id !== 'invoice_created_date' && item2.id === 'fp_name') {
						obj[item2.id] = this.common.htmlToText(json[key][item2.id]);
					}
				}
				worksheet.addRow(obj);
			});
		} else {
			// iterate all groups
			this.checkGroupLevel(this.dataviewObj.getGroups(), worksheet);
		}
		if (this.totalRow) {
			worksheet.addRow(this.totalRow);
		}
		// style grand total
		worksheet.getRow(worksheet._rows.length).eachCell(cell => {
			this.columnDefinitions.forEach(element => {
				cell.font = {
					color: { argb: 'ffffff' },
					bold: true,
					name: 'Arial',
					size: 10
				};
				cell.alignment = { wrapText: true, horizontal: 'center' };
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
					cell.alignment = { horizontal: 'center' };
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
		if (this.groupColumns.length > 0) {
			worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
				this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
			worksheet.getCell('A' + worksheet._rows.length).value = 'Groupded As: ' + this.getGroupColumns(this.groupColumns);
			worksheet.getCell('A' + worksheet._rows.length).font = {
				name: 'Arial',
				size: 10,
				bold: true
			};
		}

		// worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
		// 	this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
		// worksheet.getCell('A' + worksheet._rows.length).value = 'Report Filtered as:' + this.getParamValue();
		// worksheet.getCell('A' + worksheet._rows.length).font = {
		// 	name: 'Arial',
		// 	size: 10,
		// 	bold: true
		// };

		worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
			this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
		worksheet.getCell('A' + worksheet._rows.length).value = 'No of records: ' + json.length;
		worksheet.getCell('A' + worksheet._rows.length).font = {
			name: 'Arial',
			size: 10,
			bold: true
		};

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
			saveAs(blob, fileName);
		});
	}
	getLevelFooter(level, groupItem) {
		if (level === 0) {
			return 'Total';
		}
		if (level > 0) {
			return 'Sub Total (' + groupItem.value + ')';
		}
	}
	checkGroupLevel(item, worksheet) {
		if (item.length > 0) {
			for (const groupItem of item) {
				worksheet.addRow({});
				this.notFormatedCellArray.push(worksheet._rows.length);
				// style for groupeditem level heading
				worksheet.mergeCells('A' + (worksheet._rows.length) + ':' +
					this.alphabetJSON[this.exportColumnDefinitions.length] + (worksheet._rows.length));
				worksheet.getCell('A' + worksheet._rows.length).value = this.common.htmlToText(groupItem.title);
				worksheet.getCell('A' + worksheet._rows.length).fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'c8d6e5' },
					bgColor: { argb: 'ffffff' },
				};
				worksheet.getCell('A' + worksheet._rows.length).border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' }
				};
				worksheet.getCell('A' + worksheet._rows.length).font = {
					name: 'Arial',
					size: 10,
					bold: true
				};

				if (groupItem.groups) {
					this.checkGroupLevel(groupItem.groups, worksheet);
					const obj3: any = {};

					if (this.reportType === 'routewisecoll' || this.reportType === 'routewiseout') {
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['transport_amount'] = groupItem.rows.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0);
						obj3['route_name'] = '';
						obj3['stoppages_name'] = '';
						obj3['slab_name'] = '';
					}
					worksheet.addRow(obj3);
					this.notFormatedCellArray.push(worksheet._rows.length);
					// style row having total
					if (groupItem.level === 0) {
						worksheet.getRow(worksheet._rows.length).eachCell(cell => {
							this.exportColumnDefinitions.forEach(element => {
								cell.font = {
									name: 'Arial',
									size: 10,
									bold: true,
									color: { argb: 'ffffff' }
								};
								cell.alignment = { wrapText: true, horizontal: 'center' };
								cell.fill = {
									type: 'pattern',
									pattern: 'solid',
									fgColor: { argb: '004261' },
									bgColor: { argb: '004261' },
								};
								cell.border = {
									top: { style: 'thin' },
									left: { style: 'thin' },
									bottom: { style: 'thin' },
									right: { style: 'thin' }
								};
							});
						});
					} else if (groupItem.level > 0) {
						worksheet.getRow(worksheet._rows.length).eachCell(cell => {
							this.exportColumnDefinitions.forEach(element => {
								cell.font = {
									name: 'Arial',
									size: 10,
								};
								cell.alignment = { wrapText: true, horizontal: 'center' };
								cell.border = {
									top: { style: 'thin' },
									left: { style: 'thin' },
									bottom: { style: 'thin' },
									right: { style: 'thin' }
								};
							});
						});
					}
				} else {
					Object.keys(groupItem.rows).forEach(key => {
						const obj = {};
						for (const item2 of this.exportColumnDefinitions) {
							if (item2.id !== 'fp_name' && item2.id !== 'invoice_created_date') {
								obj[item2.id] = this.checkReturn(this.common.htmlToText(groupItem.rows[key][item2.id]));
							}
							if (item2.id !== 'fp_name' && (item2.id === 'invoice_created_date' ||
								item2.id === 'applicable_from' || item2.id === 'applicable_to')) {
								obj[item2.id] = new DatePipe('en-in').transform((groupItem.rows[key][item2.id]), 'd-MMM-y');
							}
							if (item2.id !== 'fp_name' && item2.id === 'invoice_created_date') {
								obj[item2.id] = this.common.htmlToText(groupItem.rows[key][item2.id]);
							}
							if (item2.id !== 'invoice_created_date' && item2.id === 'fp_name') {
								obj[item2.id] = this.common.htmlToText(groupItem.rows[key][item2.id]);
							}
						}
						worksheet.addRow(obj);
					});
					const obj3: any = {};
					if (this.reportType === 'routewisecoll' || this.reportType === 'routewiseout') {
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['transport_amount'] = groupItem.rows.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0);
						obj3['route_name'] = '';
						obj3['stoppages_name'] = '';
						obj3['slab_name'] = '';
					}
					worksheet.addRow(obj3);
					this.notFormatedCellArray.push(worksheet._rows.length);
					if (groupItem.level === 0) {
						worksheet.getRow(worksheet._rows.length).eachCell(cell => {
							this.exportColumnDefinitions.forEach(element => {
								cell.font = {
									name: 'Arial',
									size: 10,
									bold: true,
									color: { argb: 'ffffff' }
								};
								cell.alignment = { wrapText: true, horizontal: 'center' };
								cell.fill = {
									type: 'pattern',
									pattern: 'solid',
									fgColor: { argb: '004261' },
									bgColor: { argb: '004261' },
								};
								cell.border = {
									top: { style: 'thin' },
									left: { style: 'thin' },
									bottom: { style: 'thin' },
									right: { style: 'thin' }
								};
							});
						});
					} else if (groupItem.level > 0) {
						worksheet.getRow(worksheet._rows.length).eachCell(cell => {
							this.exportColumnDefinitions.forEach(element => {
								cell.font = {
									name: 'Arial',
									size: 10,
								};
								cell.alignment = { wrapText: true, horizontal: 'center' };
								cell.border = {
									top: { style: 'thin' },
									left: { style: 'thin' },
									bottom: { style: 'thin' },
									right: { style: 'thin' }
								};
							});
						});
					}
				}
			}
		}
	}
	getGroupColumns(columns) {
		let grName = '';
		for (const item of columns) {
			for (const titem of this.exportColumnDefinitions) {
				if (item.getter === titem.id) {
					grName = grName + titem.name + ',';
					break;
				}
			}
		}
		return grName.substring(0, grName.length - 1);
	}
	checkWidth(id, header) {
		const res = this.dataset.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
	}
	exportAsPDF(json: any[]) {
		const headerData: any[] = [];
		this.pdfrowdata = [];
		this.levelHeading = [];
		this.levelTotalFooter = [];
		this.levelSubtotalFooter = [];
		this.exportColumnDefinitions = [];
		this.exportColumnDefinitions = this.angularGrid.slickGrid.getColumns();
		let reportType: any = '';
		this.sessionName = this.getSessionName(this.session.ses_id);
		this.sessionName = this.getSessionName(this.session.ses_id);
		if (this.reportType === 'yearly') {
			reportType = new TitleCasePipe().transform('Yearly Fee Summary Report: ') + this.sessionName;
		} else if (this.reportType === 'monthly') {
			reportType = new TitleCasePipe().transform('Monthly Fee Summary Report: ') + this.sessionName;
		} else if (this.reportType === 'daily') {
			reportType = new TitleCasePipe().transform('Daily Fee Summary Report: ') + this.sessionName;
		}
		const doc = new jsPDF('l', 'mm', 'a4');
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [[new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state]],
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 12,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.autoTable({
			head: [[reportType]],
			startY: doc.previousAutoTable.finalY + 0.5,
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 10,
			},
			useCss: true,
			theme: 'striped'
		});
		const rowData: any[] = [];
		for (const item of this.exportColumnDefinitions) {
			headerData.push(item.name);
		}
		if (this.dataviewObj.getGroups().length === 0) {
			Object.keys(this.dataset).forEach((key: any) => {
				const arr: any[] = [];
				for (const item2 of this.exportColumnDefinitions) {
					if (item2.id !== 'fp_name' && item2.id !== 'invoice_created_date') {
						arr.push(this.common.htmlToText(this.dataset[key][item2.id] != undefined && this.dataset[key][item2.id] != 'undefined' ? this.dataset[key][item2.id] : 0));
					}
					if (item2.id !== 'fp_name' && (item2.id === 'invoice_created_date' ||
						item2.id === 'applicable_from' || item2.id === 'applicable_to')) {
						arr.push(new DatePipe('en-in').transform((this.dataset[key][item2.id]), 'd-MMM-y'));
					}
					if (item2.id !== 'fp_name' && item2.id === 'invoice_created_date') {
						arr.push(this.common.htmlToText(this.dataset[key][item2.id] != undefined && this.dataset[key][item2.id] != 'undefined' ? this.dataset[key][item2.id] : 0));
					}
					if (item2.id !== 'invoice_created_date' && item2.id === 'fp_name') {
						arr.push(this.common.htmlToText(this.dataset[key][item2.id] != undefined && this.dataset[key][item2.id] != 'undefined' ? this.dataset[key][item2.id] : 0));
					}
				}
				rowData.push(arr);
				this.pdfrowdata.push(arr);
			});
		} else {
			// iterate all groups
			this.checkGroupLevelPDF(this.dataviewObj.getGroups(), doc, headerData);
		}
		if (this.totalRow) {
			const arr: any[] = [];
			for (const item of this.exportColumnDefinitions) {
				arr.push(this.totalRow[item.id]);
			}
			rowData.push(arr);
			this.pdfrowdata.push(arr);
		}
		doc.levelHeading = this.levelHeading;
		doc.levelTotalFooter = this.levelTotalFooter;
		doc.levelSubtotalFooter = this.levelSubtotalFooter;
		doc.autoTable({
			head: [headerData],
			body: this.pdfrowdata,
			startY: doc.previousAutoTable.finalY + 0.5,
			tableLineColor: 'black',
			didDrawPage: function (data) {
				doc.setFontStyle('bold');

			},
			willDrawCell: function (data) {
				// tslint:disable-next-line:no-shadowed-variable
				const doc = data.doc;
				const rows = data.table.body;

				// level 0
				const lfIndex = doc.levelTotalFooter.findIndex(item => item === data.row.index);
				if (lfIndex !== -1) {
					doc.setFontStyle('bold');
					doc.setFontSize('6');
					doc.setTextColor('#ffffff');
					doc.setFillColor(0, 62, 120);
				}

				// level more than 0
				const lsfIndex = doc.levelSubtotalFooter.findIndex(item => item === data.row.index);
				if (lsfIndex !== -1) {
					doc.setFontStyle('bold');
					doc.setFontSize('6');
					doc.setTextColor('#ffffff');
					doc.setFillColor(229, 136, 67);
				}

				// group heading
				const lhIndex = doc.levelHeading.findIndex(item => item === data.row.index);
				if (lhIndex !== -1) {
					doc.setFontStyle('bold');
					doc.setFontSize('6');
					doc.setTextColor('#5e666d');
					doc.setFillColor('#c8d6e5');
				}

				// grand total
				if (data.row.index === rows.length - 1) {
					doc.setFontStyle('bold');
					doc.setFontSize('6');
					doc.setTextColor('#ffffff');
					doc.setFillColor(67, 160, 71);
				}
			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#c8d6e5',
				textColor: '#5e666d',
				fontSize: 6,
			},
			alternateRowStyles: {
				fillColor: '#f1f4f7'
			},
			useCss: true,
			styles: {
				fontSize: 6,
				cellWidth: 'auto',
				textColor: 'black',
				lineColor: '#89a8c8',
			},
			theme: 'grid'
		});
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [['No of records: ' + json.length]],
			startY: doc.previousAutoTable.finalY + 0.1,
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 10,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [['Generated On: '
				+ new DatePipe('en-in').transform(new Date(), 'd-MMM-y')]],
			startY: doc.previousAutoTable.finalY + 0.1,
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 10,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [['Generated By: ' + new TitleCasePipe().transform(this.currentUser.full_name)]],
			startY: doc.previousAutoTable.finalY + 0.1,
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 10,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.save(reportType + '_' + this.reportdate + '.pdf');
	}
	checkGroupLevelPDF(item, doc, headerData) {
		if (item.length > 0) {
			for (const groupItem of item) {
				// add and style for groupeditem level heading
				this.pdfrowdata.push([groupItem.value + ' (' + groupItem.rows.length + ')']);
				this.levelHeading.push(this.pdfrowdata.length - 1);
				if (groupItem.groups) {
					this.checkGroupLevelPDF(groupItem.groups, doc, headerData);
					const levelArray: any[] = [];
					if (this.reportType === 'routewisecoll' || this.reportType === 'routewiseout') {
						const obj3: any = {};
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['transport_amount'] = groupItem.rows.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0);
						obj3['route_name'] = '';
						obj3['stoppages_name'] = '';
						obj3['slab_name'] = '';

						for (const col of this.exportColumnDefinitions) {
							Object.keys(obj3).forEach((key: any) => {
								if (col.id === key) {
									levelArray.push(obj3[key]);
								}
							});
						}
					}
					if (groupItem.level === 0) {
						this.pdfrowdata.push(levelArray);
						this.levelTotalFooter.push(this.pdfrowdata.length - 1);
					} else if (groupItem.level > 0) {
						this.pdfrowdata.push(levelArray);
						this.levelSubtotalFooter.push(this.pdfrowdata.length - 1);
					}

				} else {
					const rowData: any[] = [];
					Object.keys(groupItem.rows).forEach(key => {
						const arr: any = [];
						for (const item2 of this.exportColumnDefinitions) {
							if (item2.id !== 'fp_name' && item2.id !== 'invoice_created_date') {
								arr.push(this.common.htmlToText(groupItem.rows[key][item2.id]));
							}
							if (item2.id !== 'fp_name' && (item2.id === 'invoice_created_date' ||
								item2.id === 'applicable_from' || item2.id === 'applicable_to')) {
								arr.push(new DatePipe('en-in').transform((groupItem.rows[key][item2.id]), 'd-MMM-y'));
							}
							if (item2.id !== 'fp_name' && item2.id === 'invoice_created_date') {
								arr.push(this.common.htmlToText(groupItem.rows[key][item2.id]));
							}
							if (item2.id !== 'invoice_created_date' && item2.id === 'fp_name') {
								arr.push(this.common.htmlToText(groupItem.rows[key][item2.id]));
							}
						}
						rowData.push(arr);
						this.pdfrowdata.push(arr);
					});
					const levelArray: any[] = [];
					if (this.reportType === 'routewisecoll' || this.reportType === 'routewiseout') {
						const obj3: any = {};
						const arr: any[] = [];
						obj3['id'] = 'footer';
						obj3['srno'] = '';
						obj3['invoice_created_date'] = this.getLevelFooter(groupItem.level, groupItem);
						obj3['stu_admission_no'] = '';
						obj3['stu_full_name'] = '';
						obj3['stu_class_name'] = '';
						obj3['fp_name'] = '';
						obj3['receipt_no'] = '';
						obj3['transport_amount'] = groupItem.rows.map(t => t['transport_amount']).reduce((acc, val) => acc + val, 0);
						obj3['route_name'] = '';
						obj3['stoppages_name'] = '';
						obj3['slab_name'] = '';
						for (const col of this.exportColumnDefinitions) {
							Object.keys(obj3).forEach((key: any) => {
								if (col.id === key) {
									levelArray.push(obj3[key]);
								}
							});
						}
					}
					if (groupItem.level === 0) {
						this.pdfrowdata.push(levelArray);
						this.levelTotalFooter.push(this.pdfrowdata.length - 1);
					} else if (groupItem.level > 0) {
						this.pdfrowdata.push(levelArray);
						this.levelSubtotalFooter.push(this.pdfrowdata.length - 1);
					}
				}
			}
		}
	}
}
