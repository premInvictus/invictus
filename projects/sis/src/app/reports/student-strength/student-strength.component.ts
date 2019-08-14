import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonAPIService, SisService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, TitleCasePipe, DecimalPipe } from '@angular/common';
import * as XLSX from 'xlsx';

import { saveAs } from 'file-saver';
import * as Excel from 'exceljs/dist/exceljs';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';

import {
	GridOption, Column, AngularGridInstance, Grouping, Aggregators,
	FieldType,
	Filters,
	Formatters,
	DelimiterType,
	FileType
} from 'angular-slickgrid';

@Component({
	selector: 'app-student-strength',
	templateUrl: './student-strength.component.html',
	styleUrls: ['./student-strength.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class StudentStrengthComponent implements OnInit, AfterViewInit {
	columnDefinitions: Column[] = [];
	gridOptions: GridOption = {};
	dataset: any[] = [];
	angularGrid: AngularGridInstance;
	dataviewObj: any;
	gridObj: any;
	gridHeight: any;
	tableFlag = false;
	totalRow: any;
	groupColumns: any[] = [];
	aggregatearray: any[] = [];
	selectedGroupingFields: string[] = [];
	draggableGroupingPlugin: any;

	showDate = true;
	showDateRange = false;
	events: any;
	@ViewChild('TABLE') table: ElementRef;

	studentStrengthReportForm: FormGroup;

	reportSummaryData: any[] = [];
	reportDetailData: any[] = [];
	schoolInfo;
	currentSession;
	currentUser;
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
		26: 'Z'
	};
	constructor(private fbuild: FormBuilder, public sanitizer: DomSanitizer,
		private notif: CommonAPIService, private sisService: SisService,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit() {
		// this.summaryDataSource.sort = this.sort;
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.getSchool();
		this.getSession();
		this.buildForm();
		this.gridOptions = {
			enableDraggableGrouping: true,
			enableGrouping: true,
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
				}
				],
				onCommand: (e, args) => {
					if (args.command === 'exportAsPDF') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.exportAsPDF(this.dataset);
					}
					if (args.command === 'exportAsExcel') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.exportToExcel(this.dataset);
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
	}

	ngAfterViewInit() {
	}

	buildForm() {
		this.studentStrengthReportForm = this.fbuild.group({
			fdate: new Date(),
			cdate: new Date(),
			tdate: new Date(),
			reviewReport: '0'
		});
	}
	onGroupChanged(groups: Grouping[]) {
		if (Array.isArray(this.selectedGroupingFields) && Array.isArray(groups) && groups.length > 0) {
			// update all Group By select dropdown
			this.selectedGroupingFields.forEach((g, i) => {
				this.selectedGroupingFields[i] = groups[i] && groups[i].getter || '';
			});
		}
	}
	updateTotalRow(grid: any) {
		let columnIdx = grid.getColumns().length;
		while (columnIdx--) {
			const columnId = grid.getColumns()[columnIdx].id;
			const columnElement: HTMLElement = grid.getFooterRowColumn(columnId);
			columnElement.innerHTML = '<b>' + this.totalRow[columnId] + '<b>';
		}
	}

	angularGridReady(angularGrid: AngularGridInstance) {
		this.angularGrid = angularGrid;
		const grid = angularGrid.slickGrid; // grid object
		this.updateTotalRow(angularGrid.slickGrid);
	}
	exportAsPDF(json: any[]) {
		const headerData: any[] = [];
		const reportType = this.getReportHeader() + ' : ' + this.currentSession.ses_name;
		const doc = new jsPDF('p', 'mm', 'a0');
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [[new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state]],
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 35,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.autoTable({
			head: [[reportType]],
			margin: { top: 0 },
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 35,
			},
			useCss: true,
			theme: 'striped'
		});
		const rowData: any[] = [];
		for (const item of this.columnDefinitions) {
			headerData.push(item.name);
		}
		json.forEach(element => {
			const arr: any[] = [];
			this.columnDefinitions.forEach(element1 => {
				arr.push(element[element1.id]);
			});
			rowData.push(arr);
		});
		if (this.totalRow) {
			const arr: any[] = [];
			for (const item of this.columnDefinitions) {
				arr.push(this.totalRow[item.id]);
			}
			rowData.push(arr);
		}
		doc.autoTable({
			head: [headerData],
			body: rowData,
			startY: 65,
			tableLineColor: 'black',
			didDrawPage: function (data) {
				doc.setFontStyle('bold');

			},
			willDrawCell: function (data) {
				const doc = data.doc;
				const rows = data.table.body;
				if (rows.length === 1) {
				} else if (data.row.index === rows.length - 1) {
					doc.setFontStyle('bold');
					doc.setFontSize('22');
					doc.setTextColor('#ffffff');
					doc.setFillColor(67, 160, 71);
				}
			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#c8d6e5',
				textColor: '#5e666d',
				fontSize: 22,
			},
			alternateRowStyles: {
				fillColor: '#f1f4f7'
			},
			useCss: true,
			styles: {
				fontSize: 22,
				cellWidth: 'auto',
				textColor: 'black',
				lineColor: '#89a8c8',
			},
			theme: 'grid'
		});
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [['Report Filtered as:  ' + this.getParamValue()]],
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 22,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [['No of records: ' + json.length]],
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 22,
			},
			useCss: true,
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
				fontSize: 22,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [['Generated By: ' + this.currentUser.full_name]],
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 22,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.save(reportType + '_' + new Date() + '.pdf');
	}
	getSchool() {
		this.sisService.getSchool().subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.schoolInfo = res.data[0];
			}
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
	checkWidth(id, header) {
		const res = this.dataset.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
	}
	getNumberWithZero(value: string) {
		if (value === '0') {
			return 0;
		} else {
			return Number(value) ? Number(value) : value;
		}
	}
	exportToExcel(json: any[]) {
		console.log('excel json', json);
		const reportType = this.getReportHeader() + ' : ' + this.currentSession.ses_name;
		const columns: any[] = [];
		const columValue: any[] = [];
		for (const item of this.columnDefinitions) {
			columns.push({
				key: item.id,
				width: this.checkWidth(item.id, item.name)
			});
			columValue.push(item.name);
		}
		const fileName = reportType + '.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } }, { pageSetup: { fitToWidth: 7 } });
		worksheet.mergeCells('A1:' + this.alphabetJSON[columns.length] + '1');
		worksheet.getCell('A1').value = new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city +
			', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };

		worksheet.mergeCells('A2:' + this.alphabetJSON[columns.length] + '2');
		worksheet.getCell('A2').value = reportType;
		worksheet.getCell('A2').alignment = { horizontal: 'left' };

		worksheet.getRow(4).values = columValue;

		worksheet.columns = columns;

		json.forEach(element => {
			const excelobj: any = {};
			this.columnDefinitions.forEach(element1 => {
				excelobj[element1.id] = this.getNumberWithZero(element[element1.id]);
			});
			worksheet.addRow(excelobj);
		});
		worksheet.addRow(this.totalRow);
		worksheet.mergeCells('A' + (worksheet._rows.length + 2) + ':' +
			this.alphabetJSON[columns.length] + (worksheet._rows.length + 2));
		worksheet.getCell('A' + worksheet._rows.length).value = 'Report Filtered as: ' + this.getParamValue();
		worksheet.getCell('A' + worksheet._rows.length).font = {
			name: 'Arial',
			size: 10,
			bold: true
		};

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
	getParamValue() {
		const paramArr: any[] = [];
		if (this.showDateRange) {
			paramArr.push(
				this.notif.dateConvertion(this.studentStrengthReportForm.value.fdate, 'd-MMM-y') + ' - ' +
				this.notif.dateConvertion(this.studentStrengthReportForm.value.tdate, 'd-MMM-y'));
		} else {
			paramArr.push(
				this.notif.dateConvertion(this.studentStrengthReportForm.value.cdate, 'd-MMM-y'));
		}
		return paramArr;
	}
	getReportHeader() {
		return this.studentStrengthReportForm.value.reviewReport === '0' ? 'Student Strength' + ' Summarised Report' :
		'Student Strength' + ' Detailed Report';
	}
	exportToFile(type) {
		const reportType = this.getReportHeader();
		this.angularGrid.exportService.exportToFile({
			delimiter: (type === 'csv') ? DelimiterType.comma : DelimiterType.tab,
			filename: reportType + '_' + new Date(),
			format: (type === 'csv') ? FileType.csv : FileType.txt
		});
	}
	showDateToggle() {
		this.showDate = !this.showDate;
		this.showDateRange = !this.showDateRange;
	}
	resetDataset() {
		this.reportSummaryData = [];
		this.dataset = [];
		this.columnDefinitions = [];
		this.reportDetailData = [];
		this.tableFlag = false;
	}
	resetGrid() {
		this.reportSummaryData = [];
		this.dataset = [];
		this.columnDefinitions = [];
		this.reportDetailData = [];
	}

	submit() {
		this.resetGrid();
		const inputJson = {};
		if (this.showDate) {
			inputJson['from_date'] = this.notif.dateConvertion(this.studentStrengthReportForm.value.cdate, 'yyyy-MM-dd');
		} else {
			inputJson['from_date'] = this.notif.dateConvertion(this.studentStrengthReportForm.value.fdate, 'yyyy-MM-dd');
			inputJson['to_date'] = this.notif.dateConvertion(this.studentStrengthReportForm.value.tdate, 'yyyy-MM-dd');
		}
		if (this.studentStrengthReportForm.value.reviewReport === '0') {
			const validateFlag = this.checkValidation();
			if (validateFlag) {
				this.sisService.generateStudentStrengthSummaryReport(inputJson).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.reportSummaryData = result.data;
						this.prepareDataSource();
						this.tableFlag = true;
					} else {
						this.notif.showSuccessErrorMessage(result.data, 'error');
						this.resetGrid();
						this.tableFlag = true;
					}
				});
			}

		} else if (this.studentStrengthReportForm.value.reviewReport === '1') {
			const validateFlag = this.checkValidation();
			if (validateFlag) {
				this.sisService.generateStudentStrengthDetailReport(inputJson).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.reportDetailData = result.data;
						this.prepareDetailDataSource();
						this.tableFlag = true;
					} else {
						this.notif.showSuccessErrorMessage(result.data, 'error');
						this.resetGrid();
						this.tableFlag = true;
					}
				});
			}
		}
	}

	checkValidation() {
		let validateFlag = 0;
		if (this.showDate) {
			if (!this.studentStrengthReportForm.value.cdate) {
				this.notif.showSuccessErrorMessage('Please Choose Date', 'error');
			} else {
				validateFlag = 1;
			}
		} else {
			if (!this.studentStrengthReportForm.value.fdate) {
				this.notif.showSuccessErrorMessage('Please Choose From Date', 'error');
			} else {
				validateFlag = 1;
			}
		}

		return validateFlag;
	}
	valueAndDash(value) {
		return value && value !== '0' ? value : '-';
	}
	srnTotalsFormatter(totals, columnDef) {
		console.log('totals ', totals);
		console.log('columnDef ', columnDef);
		if (totals.group.groups) {
			if (totals.group.level === 0) {
				return '<b class="total-footer-report">Total</b>';
			}
		} else {
			return '<b class="total-footer-report">Total</b>';
		}
	}
	sumTotalsFormatter(totals, columnDef) {
		console.log('totals ', totals);
		console.log('columnDef ', columnDef);
		const val = totals.sum && totals.sum[columnDef.field];
		if (val != null && totals.group.rows[0].class_name !== '<b>Grand Total</b>') {
			return '<b class="total-footer-report">' + new DecimalPipe('en-in').transform(((Math.round(parseFloat(val) * 100) / 100))) + '</b>';
		}
		return '';
	}
	countTotalsFormatter(totals, columnDef) {
		console.log('countTotalsFormatter totals ', totals);
		console.log('countTotalsFormatter columnDef ', columnDef);
		return '<b class="total-footer-report">' + totals.group.rows.length + '</b>';
	}
	prepareDataSource() {
		this.columnDefinitions = [
			/* { id: 'counter', name: 'S.No.', field: 'counter', sortable: true, filterable: true }, */
			{ id: 'class_name', name: 'Class', field: 'class_name', sortable: true, filterable: true, resizable: false, width: 100,
			grouping: {
				getter: 'class_name',
				formatter: (g) => {
					return `${g.value}  <span style="color:green">(${g.count})</span>`;
				},
				aggregators: this.aggregatearray,
				aggregateCollapsed: true,
				collapsed: false,
			},
			groupTotalsFormatter: this.srnTotalsFormatter,
			 },
			{ id: 'student_strength', name: 'Student Strength', field: 'student_strength', sortable: true, filterable: true,
			groupTotalsFormatter: this.sumTotalsFormatter }
		];
		let counter = 1;
		let total = 0;
		for (let i = 0; i < Object.keys(this.reportSummaryData).length; i++) {

			const tempObj = {};
			const key = Object.keys(this.reportSummaryData)[i];
			const total_sec_student = this.reportSummaryData[key]['student_login_ids'].split(',').length;
			tempObj['id'] = counter;
			tempObj['counter'] = counter;
			tempObj['class_name'] = this.reportSummaryData[key]['sec_name'] ?
			this.reportSummaryData[key]['class_name'] + '-' + this.reportSummaryData[key]['sec_name'] : this.reportSummaryData[key]['class_name'];
			tempObj['student_strength'] = this.reportSummaryData[key]['student_login_ids'].split(',').length;
			total = total + total_sec_student;
			this.dataset.push(tempObj);
			counter++;
		}

		const blankTempObj = {};
		blankTempObj['id'] = counter;
		blankTempObj['counter'] = '';
		blankTempObj['class_name'] = 'Grand Total';
		blankTempObj['student_strength'] = total;
		this.totalRow = blankTempObj;
		// this.dataset.push(blankTempObj);

		console.log('dataset  ', this.dataset);
		if (this.dataset.length > 20) {
			this.gridHeight = 750;
		} else if (this.dataset.length > 10) {
			this.gridHeight = 550;
		} else if (this.dataset.length > 5) {
			this.gridHeight = 400;
		} else {
			this.gridHeight = 300;
		}
		this.aggregatearray.push(new Aggregators.Sum('student_strength'));
	}

	countSecStudent(secArr) {
		let count = 0;
		for (let i = 0; i < secArr.length; i++) {
			count = count + secArr[i]['student_ids'];
		}
		return count;
	}

	prepareDetailDataSource() {
		this.columnDefinitions = [
			/* { id: 'counter', name: 'S.No.', field: 'counter', sortable: true, filterable: true }, */
			{ id: 'class_name', name: 'Class', field: 'class_name', sortable: true, filterable: true, resizable: false,
			grouping: {
				getter: 'class_name',
				formatter: (g) => {
					return `${g.value}  <span style="color:green">(${g.count})</span>`;
				},
				aggregators: this.aggregatearray,
				aggregateCollapsed: true,
				collapsed: false,
			},
			groupTotalsFormatter: this.srnTotalsFormatter},
			{ id: 'admission_no', name: 'Adm.No.', field: 'admission_no', sortable: true, filterable: true, resizable: false,
			groupTotalsFormatter: this.countTotalsFormatter},
			{ id: 'student_name', name: 'Student Name', field: 'student_name', sortable: true, filterable: true, resizable: false },
			{ id: 'gender', name: 'Gender', field: 'gender', sortable: true, filterable: true, resizable: false },
			{ id: 'process_type', name: 'Process Type', field: 'process_type', sortable: true, filterable: true }
		];
		let counter = 1;
		let total = 0;
		this.totalRow = null;
		for (let i = 0; i < this.reportDetailData.length; i++) {
			const tempObj = {};
			tempObj['id'] = counter;
			tempObj['counter'] = counter;
			tempObj['class_name'] = this.reportDetailData[i]['section'] ?
			this.reportDetailData[i]['class'] + '-' + this.reportDetailData[i]['section'] : this.reportDetailData[i]['class'];
			tempObj['admission_no'] = this.valueAndDash(this.reportDetailData[i]['admission_no']);
			tempObj['student_name'] = this.valueAndDash(this.reportDetailData[i]['student_name']);
			tempObj['gender'] = this.valueAndDash(this.reportDetailData[i]['gender']);
			tempObj['process_type'] = this.reportDetailData[i]['processType'] === '3' ? 'Provisional' : 'Admission';
			total = total + this.reportDetailData[i]['Total'];
			this.dataset.push(tempObj);
			counter++;
		}
		console.log('dataset  ', this.dataset);
		if (this.dataset.length > 20) {
			this.gridHeight = 750;
		} else if (this.dataset.length > 10) {
			this.gridHeight = 550;
		} else if (this.dataset.length > 5) {
			this.gridHeight = 400;
		} else {
			this.gridHeight = 300;
		}
		this.aggregatearray.push(new Aggregators.Sum('admission_no'));

	}

	exportAsExcel() {
		const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement); // converts a DOM TABLE element to a worksheet
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

		/* save to file */
		XLSX.writeFile(wb, 'StudentStrengthReport_' + (new Date).getTime() + '.xlsx');

	}

	print() {
		const printModal2 = document.getElementById('studentStrengthReportPrint');
		const popupWin = window.open('', '_blank', 'width=' + screen.width + ',height=' + screen.height);
		popupWin.document.open();
		popupWin.document.write('<html> <link rel="stylesheet" href="/assets/css/print.css">' +
		'<style>.tab-margin-button-bottom{display:none !important}</style>' +
			'<body onload="window.print()"> <div class="headingDiv"><center><h2>Student Strength Report</h2></center></div>' +
			printModal2.innerHTML + '</body></html>');
		popupWin.document.close();
	}


}
