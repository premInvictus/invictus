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
	selector: 'app-slctc-report',
	templateUrl: './slctc-report.component.html',
	styleUrls: ['./slctc-report.component.css']
})
export class SlctcReportComponent implements OnInit, AfterViewInit {

	reportdate = new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
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
	groupLength: any;
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
	notFormatedCellArray: any[] = [];

	pdfrowdata: any[] = [];
	levelHeading: any[] = [];
	levelTotalFooter: any[] = [];
	levelSubtotalFooter: any[] = [];

	showDate = true;
	showDateRange = false;
	events: any;
	@ViewChild('TABLE') table: ElementRef;
	enrollMentTypeArray: any[] = [{
		au_process_type: '0', au_process_name: 'Pending'
	},
	{
		au_process_type: '1', au_process_name: 'Approved'
	},
	{
		au_process_type: '2', au_process_name: 'Issued'
	},
	{
		au_process_type: '3', au_process_name: 'Reissued'
	},
	{
		au_process_type: '4', au_process_name: 'Cancel'
	},
	{
		au_process_type: '5', au_process_name: 'Print'
	}
	];


	studentDetailReportForm: FormGroup;

	reportProcessWiseData: any[] = [];
	constructor(private fbuild: FormBuilder, public sanitizer: DomSanitizer,
		private notif: CommonAPIService, private sisService: SisService,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit() {
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
						this.exportAsPDF(this.angularGrid.dataView.getFilteredItems());
					}
					if (args.command === 'exportAsExcel') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.exportToExcel(this.angularGrid.dataView.getFilteredItems());
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
		this.columnDefinitions = [
			{
				id: 'admission_no', name: 'Erl.No.', field: 'admission_no', sortable: true, filterable: true,
				groupTotalsFormatter: this.srnTotalsFormatter
			},
			{
				id: 'full_name', name: 'Student Name', field: 'full_name', sortable: true, filterable: true,
				groupTotalsFormatter: this.countTotalsFormatter
			},
			{
				id: 'class_name', name: 'Class', field: 'class_name', sortable: true, filterable: true, maxWidth: 150,
				grouping: {
					getter: 'class_name',
					formatter: (g) => {
						return `${g.value}  <span style="color:green">(${g.count})</span>`;
					},
					aggregators: this.aggregatearray,
					aggregateCollapsed: true,
					collapsed: false,
				}
			},
			{ id: 'contact', name: 'Contact', field: 'contact', sortable: true, filterable: true },
			{ id: 'father_name', name: 'Father Name', field: 'father_name', sortable: true, filterable: true },
			{ id: 'mother_name', name: 'Mother Name', field: 'mother_name', sortable: true, filterable: true },
			{ id: 'request_no', name: 'Request No', field: 'request_no', sortable: true, filterable: true },
			{ id: 'transfern_no', name: 'Transfer No', field: 'transfern_no', sortable: true, filterable: true },
			{
				id: 'tc_request_date', name: 'Request Date', field: 'tc_request_date', sortable: true, filterable: true,
				formatter: this.checkDateFormatter
			},
			{
				id: 'tc_approval_date', name: 'Approval Date', field: 'tc_approval_date', sortable: true, filterable: true,
				formatter: this.checkDateFormatter
			},
			{ id: 'approval_status', name: 'Status', field: 'approval_status', sortable: true, filterable: true },
			{ id: 'tc_remark', name: 'Remarks', field: 'tc_remark', sortable: true, filterable: true },
		];
	}

	ngAfterViewInit() {
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
	onGroupChanged(groups: Grouping[]) {
		if (Array.isArray(this.selectedGroupingFields) && Array.isArray(groups) && groups.length > 0) {
			// update all Group By select dropdown
			this.selectedGroupingFields.forEach((g, i) => {
				this.selectedGroupingFields[i] = groups[i] && groups[i].getter || '';
			});
		}
		console.log('dataviewObj', this.dataviewObj.getGroups());
	}
	updateTotalRow(grid: any) {
		console.log('this.groupColumns', this.groupColumns);
		let columnIdx = grid.getColumns().length;
		while (columnIdx--) {
			const columnId = grid.getColumns()[columnIdx].id;
			const columnElement: HTMLElement = grid.getFooterRowColumn(columnId);
			columnElement.innerHTML = '<b>' + this.totalRow[columnId] + '<b>';
		}
	}
	getGroupColumns(columns) {
		let grName = '';
		for (const item of columns) {
			for (const titem of this.columnDefinitions) {
				if (item.getter === titem.id) {
					grName = grName + titem.name + ',';
					break;
				}
			}
		}
		return grName.substring(0, grName.length - 1);
	}
	angularGridReady(angularGrid: AngularGridInstance) {
		this.angularGrid = angularGrid;
		const grid = angularGrid.slickGrid; // grid object
		this.gridObj = angularGrid.slickGrid; // grid object
		this.dataviewObj = angularGrid.dataView;
		console.log('dataviewObj', this.dataviewObj);
		this.updateTotalRow(angularGrid.slickGrid);
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
	exportAsPDF(json: any[]) {
		const headerData: any[] = [];
		this.pdfrowdata = [];
		this.levelHeading = [];
		this.levelTotalFooter = [];
		this.levelSubtotalFooter = [];
		const reportType = this.getReportHeader() + ' : ' + this.currentSession.ses_name;
		const doc = new jsPDF('l', 'mm', 'a0');
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
				fontSize: 22,
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
				halign: 'left',
				fontSize: 20,
			},
			useCss: true,
			theme: 'striped'
		});
		const rowData: any[] = [];
		for (const item of this.columnDefinitions) {
			headerData.push(item.name);
		}
		if (this.dataviewObj.getGroups().length === 0) {
			json.forEach(element => {
				const arr: any[] = [];
				this.columnDefinitions.forEach(element1 => {
					arr.push(element[element1.id]);
				});
				rowData.push(arr);
				this.pdfrowdata.push(arr);
			});
		} else {
			// iterate all groups
			this.checkGroupLevelPDF(this.dataviewObj.getGroups(), doc, headerData);
		}
		if (this.totalRow) {
			const arr: any[] = [];
			for (const item of this.columnDefinitions) {
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
				const doc = data.doc;
				const rows = data.table.body;

				// level 0
				const lfIndex = doc.levelTotalFooter.findIndex(item => item === data.row.index);
				if (lfIndex !== -1) {
					doc.setFontStyle('bold');
					doc.setFontSize('18');
					doc.setTextColor('#ffffff');
					doc.setFillColor(0, 62, 120);
				}

				// level more than 0
				const lsfIndex = doc.levelSubtotalFooter.findIndex(item => item === data.row.index);
				if (lsfIndex !== -1) {
					doc.setFontStyle('bold');
					doc.setFontSize('18');
					doc.setTextColor('#ffffff');
					doc.setFillColor(229, 136, 67);
				}

				// group heading
				const lhIndex = doc.levelHeading.findIndex(item => item === data.row.index);
				if (lhIndex !== -1) {
					doc.setFontStyle('bold');
					doc.setFontSize('18');
					doc.setTextColor('#5e666d');
					doc.setFillColor('#c8d6e5');
				}

				// grand total
				if (data.row.index === rows.length - 1) {
					doc.setFontStyle('bold');
					doc.setFontSize('18');
					doc.setTextColor('#ffffff');
					doc.setFillColor(67, 160, 71);
				}
			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#c8d6e5',
				textColor: '#5e666d',
				fontSize: 18,
			},
			alternateRowStyles: {
				fillColor: '#f1f4f7'
			},
			useCss: true,
			styles: {
				fontSize: 18,
				cellWidth: 'auto',
				textColor: 'black',
				lineColor: '#89a8c8',
			},
			theme: 'grid'
		});
		if (this.groupColumns.length > 0) {
			doc.autoTable({
				// tslint:disable-next-line:max-line-length
				head: [['Groupded As:  ' + this.getGroupColumns(this.groupColumns)]],
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
		}
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
				fontSize: 20,
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
				fontSize: 20,
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
					for (const item2 of this.columnDefinitions) {
						if (item2.id === 'admission_no') {
							levelArray.push(this.getLevelFooter(groupItem.level));
						} else if (item2.id === 'full_name') {
							levelArray.push(groupItem.rows.length);
						} else {
							levelArray.push('');
						}
					}
					// style row having total
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
						const earr: any[] = [];
						for (const item2 of this.columnDefinitions) {
							earr.push(groupItem.rows[key][item2.id]);
						}
						rowData.push(earr);
						this.pdfrowdata.push(earr);
					});
					const levelArray: any[] = [];
					for (const item2 of this.columnDefinitions) {
						if (item2.id === 'admission_no') {
							levelArray.push(this.getLevelFooter(groupItem.level));
						} else if (item2.id === 'full_name') {
							levelArray.push(groupItem.rows.length);
						} else {
							levelArray.push('');
						}
					}
					// style row having total
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
	checkGroupLevel(item, worksheet) {
		console.log('checkGroupLevel item ', item);
		// console.log('checkGroupLevel worksheet ', worksheet);
		if (item.length > 0) {
			for (const groupItem of item) {
				worksheet.addRow({});
				this.notFormatedCellArray.push(worksheet._rows.length);
				// style for groupeditem level heading
				worksheet.mergeCells('A' + (worksheet._rows.length) + ':' +
					this.alphabetJSON[this.columnDefinitions.length] + (worksheet._rows.length));
				worksheet.getCell('A' + worksheet._rows.length).value = groupItem.value + ' (' + groupItem.rows.length + ')';
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
					const blankTempObj = {};
					this.columnDefinitions.forEach(element => {
						if (element.id === 'admission_no') {
							blankTempObj[element.id] = this.getLevelFooter(groupItem.level);
						} else if (element.id === 'full_name') {
							blankTempObj[element.id] = groupItem.rows.length;
						} else {
							blankTempObj[element.id] = '';
						}
					});
					worksheet.addRow(blankTempObj);
					this.notFormatedCellArray.push(worksheet._rows.length);
					// style row having total
					if (groupItem.level === 0) {
						worksheet.getRow(worksheet._rows.length).eachCell(cell => {
							this.columnDefinitions.forEach(element => {
								cell.font = {
									name: 'Arial',
									size: 10,
									bold: true
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
							this.columnDefinitions.forEach(element => {
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
						for (const item2 of this.columnDefinitions) {
							obj[item2.id] = groupItem.rows[key][item2.id];
						}
						worksheet.addRow(obj);
					});
					const blankTempObj = {};
					this.columnDefinitions.forEach(element => {
						if (element.id === 'admission_no') {
							blankTempObj[element.id] = this.getLevelFooter(groupItem.level);
						} else if (element.id === 'full_name') {
							blankTempObj[element.id] = groupItem.rows.length;
						} else {
							blankTempObj[element.id] = '';
						}
					});
					worksheet.addRow(blankTempObj);
					this.notFormatedCellArray.push(worksheet._rows.length);
					// style row having total
					if (groupItem.level === 0) {
						worksheet.getRow(worksheet._rows.length).eachCell(cell => {
							this.columnDefinitions.forEach(element => {
								cell.font = {
									name: 'Arial',
									size: 10,
									bold: true
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
							this.columnDefinitions.forEach(element => {
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
	exportToExcel(json: any[]) {
		this.notFormatedCellArray = [];
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
		const fileName = reportType + '_' + this.reportdate + '.xlsx';
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
		console.log('this.dataviewObj.getGroups()', this.dataviewObj.getGroups());
		if (this.dataviewObj.getGroups().length === 0) {
			
			json.forEach(element => {
				const excelobj: any = {};
				this.columnDefinitions.forEach(element1 => {
					excelobj[element1.id] = this.getNumberWithZero(element[element1.id]);
				});
				worksheet.addRow(excelobj);
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
					size: 16,
					bold: true
				};
			} else if (rowNum === 2) {
				row.font = {
					name: 'Arial',
					size: 14,
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
								fgColor: { argb: 'dedede' },
								bgColor: { argb: 'dedede' },
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

		worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
			this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
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
		if (this.studentDetailReportForm.value.enrolment_type) {
			paramArr.push(this.enrollMentTypeArray.find(e => e.au_process_type === this.studentDetailReportForm.value.enrolment_type).au_process_name);
		}
		if (this.showDateRange) {
			paramArr.push(
				this.notif.dateConvertion(this.studentDetailReportForm.value.fdate, 'd-MMM-y') + ' - ' +
				this.notif.dateConvertion(this.studentDetailReportForm.value.tdate, 'd-MMM-y'));
		} else {
			paramArr.push(
				this.notif.dateConvertion(this.studentDetailReportForm.value.cdate, 'd-MMM-y'));
		}
		return paramArr;
	}
	getReportHeader() {
		return 'Slc/tc Report';
	}
	exportToFile(type) {
		const reportType = this.getReportHeader();
		this.angularGrid.exportService.exportToFile({
			delimiter: (type === 'csv') ? DelimiterType.comma : DelimiterType.tab,
			filename: reportType + '_' + new Date(),
			format: (type === 'csv') ? FileType.csv : FileType.txt
		});
	}
	getLevelFooter(level) {
		if (level === 0) {
			return 'Total';
		} else if (level > 0) {
			return 'Sub Total (level ' + level + ')';
		}
	}
	srnTotalsFormatter(totals, columnDef) {
		console.log('srnTotalsFormatter ', totals);
		if (totals.group.level === 0) {
			return '<b class="total-footer-report">Total</b>';
		}
		if (totals.group.level > 0) {
			return '<b class="total-footer-report">Sub Total level ' + totals.group.level + ' </b>';
		}
	}
	sumTotalsFormatter(totals, columnDef) {
		// console.log('totals ', totals);
		// console.log('columnDef ', columnDef);
		const val = totals.sum && totals.sum[columnDef.field];
		if (val != null && totals.group.rows[0].class_name !== '<b>Grand Total</b>') {
			return '<b class="total-footer-report">' + new DecimalPipe('en-in').transform(((Math.round(parseFloat(val) * 100) / 100))) + '</b>';
		}
		return '';
	}
	countTotalsFormatter(totals, columnDef) {
		console.log('countTotalsFormatter ', totals);
		return '<b class="total-footer-report">' + totals.group.rows.length + '</b>';
	}

	buildForm() {
		this.studentDetailReportForm = this.fbuild.group({
			tc_approval_status: '1',
			fdate: new Date(),
			cdate: new Date(),
			tdate: new Date()
		});
	}
	checkDateFormatter(row, cell, value, columnDef, dataContext) {
		if (value && value !== '-') {
			return new DatePipe('en-in').transform(value, 'd-MMM-y');
		} else {
			return '-';
		}
	}

	showDateToggle() {
		this.showDate = !this.showDate;
		this.showDateRange = !this.showDateRange;
	}

	resetGrid() {
		this.reportProcessWiseData = [];
		this.dataset = [];
	}

	submit() {
		this.resetGrid();

		const inputJson = {};
		if (this.showDate) {
			inputJson['tc_todate'] = this.notif.dateConvertion(this.studentDetailReportForm.value.cdate, 'yyyy-MM-dd');
		} else {
			inputJson['tc_fromdate'] = this.notif.dateConvertion(this.studentDetailReportForm.value.fdate, 'yyyy-MM-dd');
			inputJson['tc_todate'] = this.notif.dateConvertion(this.studentDetailReportForm.value.tdate, 'yyyy-MM-dd');
		}
		inputJson['tc_approval_status'] = this.studentDetailReportForm.value.tc_approval_status;
		const validateFlag = this.checkValidation();
		if (validateFlag) {
			this.sisService.getSlcTc(inputJson).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.reportProcessWiseData = result.data;
					this.prepareDataSource(inputJson['tc_approval_status']);
					this.tableFlag = true;
				} else {
					this.notif.showSuccessErrorMessage(result.data, 'error');
					this.resetGrid();
					this.tableFlag = true;
				}
			});
		}

	}

	checkValidation() {
		let validateFlag = 0;
		if (this.showDate) {
			if (!this.studentDetailReportForm.value.cdate) {
				this.notif.showSuccessErrorMessage('Please Choose Date', 'error');
			} else {
				validateFlag = 1;
			}
		} else {
			if (!this.studentDetailReportForm.value.fdate) {
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

	getParentHonorific(value) {

		// console.log('value', value);
		let honorific = '';
		if (value === '1') {
			honorific = 'Mr.';
		} else if (value === '2') {
			honorific = 'Mrs.';
		} else if (value === '3') {
			honorific = 'Miss.';
		} else if (value === '4') {
			honorific = 'Ms.';
		} else if (value === '5') {
			honorific = 'Mx.';
		} else if (value === '6') {
			honorific = 'Sir.';
		} else if (value === '7') {
			honorific = 'Dr.';
		} else if (value === '8') {
			honorific = 'Lady';
		} else if (value === '9') {
			honorific = 'Late';
		} else if (value === '10') {
			honorific = 'Md.';
		}

		return honorific;
	}

	prepareDataSource(process_type) {
		let counter = 1;
		const total = 0;
		for (let i = 0; i < this.reportProcessWiseData.length; i++) {
			const tempObj = {}; tempObj['id'] = counter;
			tempObj['counter'] = counter;

			tempObj['class_name'] = this.reportProcessWiseData[i]['sec_name'] ?
				this.reportProcessWiseData[i]['class_name'] + '-' + this.reportProcessWiseData[i]['sec_name'] :
				this.reportProcessWiseData[i]['class_name'];
			tempObj['admission_no'] = this.valueAndDash(this.reportProcessWiseData[i]['tc_admission_no']);
			tempObj['full_name'] = new TitleCasePipe().transform(this.valueAndDash(this.reportProcessWiseData[i]['au_full_name']));
			let status = '';
			if (this.reportProcessWiseData[i].tc_approval_status === '1') {
				status = 'Approved';
			} else if (this.reportProcessWiseData[i].tc_approval_status === '2') {
				status = 'Issued';
			} else if (this.reportProcessWiseData[i].tc_approval_status === '3') {
				status = 'Reissued';
			} else if (this.reportProcessWiseData[i].tc_approval_status === '0') {
				status = 'Pending';
			}
			tempObj['contact'] = this.valueAndDash(this.reportProcessWiseData[i]['au_mobile']);
			tempObj['transfern_no'] = this.valueAndDash(this.reportProcessWiseData[i]['certificate_no']);
			tempObj['request_no'] = this.valueAndDash(this.reportProcessWiseData[i]['tc_id']);
			tempObj['father_name'] = new TitleCasePipe().transform(this.valueAndDash(this.reportProcessWiseData[i]['father_name']));
			tempObj['approval_status'] = status;
			tempObj['mother_name'] = new TitleCasePipe().transform(this.valueAndDash(this.reportProcessWiseData[i]['mother_name']));
			tempObj['tc_remark'] = new TitleCasePipe().transform(this.valueAndDash(this.reportProcessWiseData[i]['tc_remark']));

			tempObj['tc_request_date'] = this.valueAndDash(new DatePipe('en-in').transform(this.reportProcessWiseData[i]['tc_request_date'], 'd-MMM-y'));

			tempObj['tc_approval_date'] = this.valueAndDash(new DatePipe('en-in').transform(this.reportProcessWiseData[i]['tc_approval_date'], 'd-MMM-y'));;
			this.dataset.push(tempObj);

			counter++;
		}
		const blankTempObj = {};
		this.columnDefinitions.forEach(element => {
			if (element.id === 'admission_no') {
				blankTempObj[element.id] = 'Grand Total';
			} else if (element.id === 'full_name') {
				blankTempObj[element.id] = '  ' + this.dataset.length;
			} else {
				blankTempObj[element.id] = '';
			}
		});
		this.totalRow = blankTempObj;
		console.log('dataset  ', this.dataset);
		if (this.dataset.length > 20) {
			this.gridHeight = 800;
		} else if (this.dataset.length > 10) {
			this.gridHeight = 650;
		} else if (this.dataset.length > 5) {
			this.gridHeight = 500;
		} else {
			this.gridHeight = 400;
		}
		this.aggregatearray.push(new Aggregators.Sum('admission_no'));
	}
	exportAsExcel() {
		const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement); // converts a DOM TABLE element to a worksheet
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

		/* save to file */
		XLSX.writeFile(wb, 'StudentDetailReport_' + (new Date).getTime() + '.xlsx');

	}

	print() {
		const printModal2 = document.getElementById('studentDetailReportPrint');
		const popupWin = window.open('', '_blank', 'width=' + screen.width + ',height=' + screen.height);
		popupWin.document.open();
		popupWin.document.write('<html> <link rel="stylesheet" href="/assets/css/print.css">' +
			'<style>.tab-margin-button-bottom{display:none !important}</style>' +
			+ '<body onload="window.print()"> <div class="headingDiv"><center><h2>Student Detail Report</h2></center></div>'
			+ printModal2.innerHTML + '</body></html>');
		popupWin.document.close();
	}


}
