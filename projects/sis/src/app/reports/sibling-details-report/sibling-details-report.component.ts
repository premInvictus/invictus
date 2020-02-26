import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonAPIService, SisService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe, DatePipe, TitleCasePipe } from '@angular/common';
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
	selector: 'app-sibling-details-report',
	templateUrl: './sibling-details-report.component.html',
	styleUrls: ['./sibling-details-report.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SiblingDetailsReportComponent implements OnInit, AfterViewInit {

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

	studentSiblingsReportForm: FormGroup;

	studentSiblingData: any[] = [];

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
		this.columnDefinitions = [
			{ id: 'admission_no', name: 'Adm.No.', field: 'admission_no', sortable: true, filterable: true,
			grouping: {
				getter: 'admission_no',
				formatter: (g) => {
					return `${g.value}  <span style="color:green">(${g.count})</span>`;
				},
				aggregators: this.aggregatearray,
				aggregateCollapsed: true,
				collapsed: false,
			},
			groupTotalsFormatter: this.srnTotalsFormatter },
			{ id: 'full_name', name: 'Student Name', field: 'full_name', sortable: true, filterable: true,
			groupTotalsFormatter: this.countTotalsFormatter },
			{ id: 'class_name', name: 'Class', field: 'class_name', sortable: true, filterable: true, maxWidth: 150,
			grouping: {
				getter: 'class_name',
				formatter: (g) => {
					return `${g.value}  <span style="color:green">(${g.count})</span>`;
				},
				aggregators: this.aggregatearray,
				aggregateCollapsed: true,
				collapsed: false,
			}},
			{ id: 'gender', name: 'Gender', field: 'gender', sortable: true, filterable: true, maxWidth: 100,
			grouping: {
				getter: 'gender',
				formatter: (g) => {
					return `${g.value}  <span style="color:green">(${g.count})</span>`;
				},
				aggregators: this.aggregatearray,
				aggregateCollapsed: true,
				collapsed: false,
			} },
			{ id: 'admission_date', name: 'Adm.Date', field: 'admission_date', sortable: true, filterable: true,
			 	formatter: this.checkDateFormatter },
			{ id: 'alumini_date', name: 'Left Date', field: 'alumini_date', sortable: true, filterable: true, formatter: this.checkDateFormatter },
			{ id: 'enrollment_status', name: 'Enrollment Status', field: 'enrollment_status', sortable: true, filterable: true },
			{ id: 'email', name: 'Email', field: 'email', sortable: true, filterable: true },
			{ id: 'mobile', name: 'Mobile', field: 'mobile', sortable: true, filterable: true },
			{ id: 'father_name', name: 'Father Name', field: 'father_name', sortable: true, filterable: true },
			{ id: 'mother_name', name: 'Mother Name', field: 'mother_name', sortable: true, filterable: true },
			{ id: 'guardian_name', name: 'Guardian Name', field: 'guardian_name', sortable: true, filterable: true }
		];
	}

	ngAfterViewInit() {
	}

	buildForm() {
		this.studentSiblingsReportForm = this.fbuild.group({
			fdate: new Date(),
			cdate: new Date(),
			tdate: new Date()
		});
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
		doc.save(reportType + '_' + new Date() + '.pdf');
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
							levelArray.push( groupItem.rows.length);
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
							levelArray.push( groupItem.rows.length);
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
		worksheet.getCell('A' + worksheet._rows.length).value = 'Generated By: ' + new TitleCasePipe().transform(this.currentUser.full_name);
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
				this.notif.dateConvertion(this.studentSiblingsReportForm.value.fdate, 'd-MMM-y') + ' - ' +
				this.notif.dateConvertion(this.studentSiblingsReportForm.value.tdate, 'd-MMM-y'));
		} else {
			paramArr.push(
				this.notif.dateConvertion(this.studentSiblingsReportForm.value.cdate, 'd-MMM-y'));
		}
		return paramArr;
	}
	getReportHeader() {
		return 'List Of Sibling Students';
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
			return 'Sub Total (level ' + level + ')' ;
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
		this.studentSiblingData = [];
		this.dataset = [];
	}

	submit() {
		this.resetGrid();
		const inputJson = {};
		if (this.showDate) {
			inputJson['from_date'] = this.notif.dateConvertion(this.studentSiblingsReportForm.value.cdate, 'yyyy-MM-dd');
		} else {
			inputJson['from_date'] = this.notif.dateConvertion(this.studentSiblingsReportForm.value.fdate, 'yyyy-MM-dd');
			inputJson['to_date'] = this.notif.dateConvertion(this.studentSiblingsReportForm.value.tdate, 'yyyy-MM-dd');
		}

		const validateFlag = this.checkValidation();
		if (validateFlag) {
			this.tableFlag = true;
			this.sisService.getStudentSiblingDetails(inputJson).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.studentSiblingData = result.data;
					this.prepareDataSource();
				} else {
					this.notif.showSuccessErrorMessage(result.data, 'error');
					this.resetGrid();
				}
			});
		}


	}

	checkValidation() {
		let validateFlag = 0;
		if (this.showDate) {
			if (!this.studentSiblingsReportForm.value.cdate) {
				this.notif.showSuccessErrorMessage('Please Choose Date', 'error');
			} else {
				validateFlag = 1;
			}
		} else {
			if (!this.studentSiblingsReportForm.value.fdate) {
				this.notif.showSuccessErrorMessage('Please Choose From Date', 'error');
			} else {
				validateFlag = 1;
			}
		}

		return validateFlag;
	}

	getParentHonorific(value) {

		console.log('value', value);
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
		}

		return honorific;
	}

	valueAndDash(value) {
		return value && value !== '0' ? value : '-';
	}

	prepareDataSource() {
		let counter = 0;
		const total = 0;
		console.log('studentSiblingData  ', this.studentSiblingData);
		for (let i = 0; i < Object.keys(this.studentSiblingData).length; i++) {
			counter++;
			const tempObj = {};
			const key = Object.keys(this.studentSiblingData)[i];
			// let total_sec_student = this.countSecStudent(this.studentSiblingData[key]['student_data']);
			tempObj['id'] = key + counter;
			tempObj['counter'] = counter;
			tempObj['class_name'] = this.studentSiblingData[key]['sec_name'] ?
			this.studentSiblingData[key]['class_name'] + '-' + this.studentSiblingData[key]['sec_name'] : this.studentSiblingData[key]['class_name'];
			tempObj['login_id'] = this.studentSiblingData[key]['au_login_id'];
			tempObj['admission_no'] = this.studentSiblingData[key]['au_admission_no'];
			tempObj['full_name'] = new TitleCasePipe().transform(this.studentSiblingData[key]['au_full_name']);
			tempObj['gender'] = this.valueAndDash(this.studentSiblingData[key]['upd_gender']);
			tempObj['admission_date'] = this.valueAndDash(this.studentSiblingData[key]['em_admission_date']);
			tempObj['alumini_date'] = this.valueAndDash(this.studentSiblingData[key]['em_alumini_date']);
			tempObj['enrollment_status'] = this.valueAndDash(this.studentSiblingData[key]['au_enrollment_status']);
			tempObj['email'] = this.valueAndDash(this.studentSiblingData[key]['au_email']);
			tempObj['mobile'] = this.valueAndDash(this.studentSiblingData[key]['au_mobile']);

			const father_honorific = this.getParentHonorific(this.studentSiblingData[key]['student_parent_data'] &&
			this.studentSiblingData[key]['student_parent_data'][2] ?
			 this.studentSiblingData[key]['student_parent_data'][2]['epd_parent_honorific']  : '');

			const mother_honorific = this.getParentHonorific(this.studentSiblingData[key]['student_parent_data'] &&
			this.studentSiblingData[key]['student_parent_data'][2] ?
			 this.studentSiblingData[key]['student_parent_data'][1]['epd_parent_honorific']  : '');

			const guardian_honorific = this.getParentHonorific(this.studentSiblingData[key]['student_parent_data'] &&
			this.studentSiblingData[key]['student_parent_data'][2] ?
			 this.studentSiblingData[key]['student_parent_data'][1]['epd_parent_honorific']  : '');

			tempObj['father_name'] = new TitleCasePipe().transform(this.studentSiblingData[key]['student_parent_data'] &&
				this.studentSiblingData[key]['student_parent_data'][2] &&
				this.studentSiblingData[key]['student_parent_data'][2]['epd_parent_name'] ?
				 father_honorific + this.studentSiblingData[key]['student_parent_data'][2]['epd_parent_name'] : '-');
			tempObj['mother_name'] = new TitleCasePipe().transform(this.studentSiblingData[key]['student_parent_data'] &&
				this.studentSiblingData[key]['student_parent_data'][1] &&
				this.studentSiblingData[key]['student_parent_data'][1]['epd_parent_name'] ?
				 mother_honorific + this.studentSiblingData[key]['student_parent_data'][1]['epd_parent_name'] : '-');

			tempObj['guardian_name'] = new TitleCasePipe().transform(this.studentSiblingData[key]['student_parent_data'] &&
			this.studentSiblingData[key]['student_parent_data'][0] &&
				this.studentSiblingData[key]['student_parent_data'][0]['epd_parent_name'] ?
				 guardian_honorific + this.studentSiblingData[key]['student_parent_data'][0]['epd_parent_name'] : '-');

			this.dataset.push(tempObj);
			for (let j = 0; j < Object.keys(this.studentSiblingData[key]['student_sibling_details']).length; j++) {
				counter++;
				const sibtempObj = {};
				const sibkey = Object.keys(this.studentSiblingData[key]['student_sibling_details'])[j];
				sibtempObj['id'] = sibkey + counter;
				sibtempObj['counter'] = counter;

				sibtempObj['class_name'] = this.studentSiblingData[key]['student_sibling_details'][sibkey]['sec_name'] ?
				this.studentSiblingData[key]['student_sibling_details'][sibkey]['class_name'] + '-' +
				this.studentSiblingData[key]['student_sibling_details'][sibkey]['sec_name'] :
				this.studentSiblingData[key]['student_sibling_details'][sibkey]['class_name'];

				sibtempObj['login_id'] = this.studentSiblingData[key]['student_sibling_details'][sibkey]['au_login_id'];
				sibtempObj['admission_no'] = this.studentSiblingData[key]['student_sibling_details'][sibkey]['au_admission_no'];
				sibtempObj['full_name'] =
				new TitleCasePipe().transform(this.studentSiblingData[key]['student_sibling_details'][sibkey]['au_full_name']);
				sibtempObj['gender'] = this.valueAndDash(this.studentSiblingData[key]['student_sibling_details'][sibkey]['upd_gender']);
				sibtempObj['admission_date'] = this.valueAndDash(this.studentSiblingData[key]['student_sibling_details'][sibkey]['em_admission_date']);
				sibtempObj['alumini_date'] = this.valueAndDash(this.studentSiblingData[key]['student_sibling_details'][sibkey]['em_alumini_date']);
				sibtempObj['enrollment_status'] =
					this.valueAndDash(this.studentSiblingData[key]['student_sibling_details'][sibkey]['au_enrollment_status']);
				sibtempObj['email'] = this.valueAndDash(this.studentSiblingData[key]['student_sibling_details'][sibkey]['au_email']);
				sibtempObj['mobile'] = this.valueAndDash(this.studentSiblingData[key]['student_sibling_details'][sibkey]['au_mobile']);

				const sibling_father_honorific = this.getParentHonorific(this.studentSiblingData[key]['student_sibling_details'] &&
				this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][2] ?
				this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][2]['epd_parent_honorific']  : '');

				const sibnling_mother_honorific = this.getParentHonorific(this.studentSiblingData[key]['student_sibling_details'] &&
				this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][1] ?
				this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][1]['epd_parent_honorific']  : '');

				const sibling_guardian_honorific = this.getParentHonorific(this.studentSiblingData[key]['student_sibling_details'] &&
				this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][0] ?
				this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][0]['epd_parent_honorific']  : '');



				sibtempObj['father_name'] = new TitleCasePipe().transform(this.studentSiblingData[key]['student_sibling_details'] &&
					this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][2] &&
					this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][2]['epd_parent_name'] ?
					sibling_father_honorific +
					this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][2]['epd_parent_name'] : '-');
				sibtempObj['mother_name'] = new TitleCasePipe().transform(this.studentSiblingData[key]['student_sibling_details'] &&
					this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][1] &&
					this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][1]['epd_parent_name'] ?
					sibnling_mother_honorific +
					this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][1]['epd_parent_name'] : '-');
				sibtempObj['guardian_name'] = new TitleCasePipe().transform(this.studentSiblingData[key]['student_sibling_details'] &&
					this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][0] &&
					this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][0]['epd_parent_name']  ?
					sibling_guardian_honorific +
					this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][0]['epd_parent_name'] : '-');
				this.dataset.push(sibtempObj);
			}
		}
		const blankTempObj = {};
		this.columnDefinitions.forEach(element => {
			if (element.id === 'admission_no') {
				blankTempObj[element.id] = 'Grand Total';
			} else if (element.id === 'full_name') {
				blankTempObj[element.id] = this.dataset.length;
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
		XLSX.writeFile(wb, 'SiblingReport_' + (new Date).getTime() + '.xlsx');

	}

	print() {
		const printModal2 = document.getElementById('siblingReportPrint');
		const popupWin = window.open('', '_blank', 'width=' + screen.width + ',height=' + screen.height);
		popupWin.document.open();
		popupWin.document.write('<html> <link rel="stylesheet" href="/assets/css/print.css">' +
		'<style>.tab-margin-button-bottom{display:none !important}</style>' +
			'<body onload="window.print()"> <div class="headingDiv"><center><h2>Student Sibling Report</h2></center></div>' +
			printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}



}
