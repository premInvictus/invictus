import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonAPIService, SisService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, TitleCasePipe } from '@angular/common';
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
import { count } from 'rxjs/operators';

@Component({
	selector: 'app-admission-report',
	templateUrl: './admission-report.component.html',
	styleUrls: ['./admission-report.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AdmissionReportComponent implements OnInit, AfterViewInit {
	reportdate = new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
	columnDefinitions: Column[] = [];
	gridOptions: GridOption = {};
	dataset: any[] = [];
	notFormatedCellArray: any[] = [];
	angularGrid: AngularGridInstance;
	dataviewObj: any;
	gridObj: any;
	gridHeight: any;
	tableFlag = false;
	totalRow: any;

	showDate = true;
	showDateRange = false;
	events: any;
	@ViewChild('TABLE') table: ElementRef;
	enrollMentTypeArray: any[] = [];

	admissionReportForm: FormGroup;
	reportProcessWiseData: any[] = [];
	reportEnrolmentWiseData: any[] = [];
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
		public notif: CommonAPIService, private sisService: SisService,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit() {
		// this.userDataSource.sort = this.sort;
		this.buildForm();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.getSchool();
		this.getSession();
		this.gridOptions = {
			enableDraggableGrouping: false,
			createPreHeaderPanel: true,
			showPreHeaderPanel: false,
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
			}
		};
	}

	ngAfterViewInit() {
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
			head: [['Generated By: ' + new TitleCasePipe().transform(this.currentUser.full_name)]],
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
		doc.save(reportType + '_' + this.reportdate + '.pdf');
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
		const fileName =reportType + '_' + this.reportdate +'.xlsx';
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
				this.notif.dateConvertion(this.admissionReportForm.value.fdate, 'd-MMM-y') + ' - ' +
				this.notif.dateConvertion(this.admissionReportForm.value.tdate, 'd-MMM-y'));
		} else {
			paramArr.push(
				this.notif.dateConvertion(this.admissionReportForm.value.cdate, 'd-MMM-y'));
		}
		return paramArr;
	}
	getReportHeader() {
		let reportheader='';
		if(this.admissionReportForm.value.reviewReport === '0'){
			reportheader = 'Enrollment Review' + ' Gender Wise';
		} else if(this.admissionReportForm.value.reviewReport === '1'){
			reportheader = 'Enrollment Review' + ' Enrollment Type Wise';
		} else if(this.admissionReportForm.value.reviewReport === '2'){
			reportheader = 'Enrollment Review' + ' Deleted Enrollment';
		} else if(this.admissionReportForm.value.reviewReport === '3'){
			reportheader = 'Enrollment Review' + ' New Enrollment';
		} else if(this.admissionReportForm.value.reviewReport === '4'){
			reportheader = 'Enrollment Review' + 'Dropout';
		}
		return reportheader;
	}
	exportToFile(type) {
		const reportType = this.getReportHeader();
		this.angularGrid.exportService.exportToFile({
			delimiter: (type === 'csv') ? DelimiterType.comma : DelimiterType.tab,
			filename: reportType + '_' + new Date(),
			format: (type === 'csv') ? FileType.csv : FileType.txt
		});
	}
	resetDataset() {
		this.reportProcessWiseData = [];
		this.dataset = [];
		this.reportEnrolmentWiseData = [];
		this.columnDefinitions = [];
		this.tableFlag = false;
	}
	buildForm() {
		this.admissionReportForm = this.fbuild.group({
			enrolment_type: '',
			fdate: new Date(),
			cdate: new Date(),
			tdate: new Date(),
			reviewReport: '0'
		});
		this.setProcessArray();
	}

	showDateToggle() {
		this.showDate = !this.showDate;
		this.showDateRange = !this.showDateRange;
	}

	resetGrid() {
		this.reportProcessWiseData = [];
		this.dataset = [];
		this.reportEnrolmentWiseData = [];
		this.columnDefinitions = [];
	}
	setProcessArray(){
		this.enrollMentTypeArray = [];
		if(this.admissionReportForm.value.reviewReport === '0'){
			this.enrollMentTypeArray.push({au_process_type: '1', au_process_name: 'Enquiry'});
			this.enrollMentTypeArray.push({au_process_type: '2', au_process_name: 'Registration'});
			this.enrollMentTypeArray.push({au_process_type: '3', au_process_name: 'Provisional Admission'});
			this.enrollMentTypeArray.push({au_process_type: '4', au_process_name: 'Admission'});
			this.enrollMentTypeArray.push({au_process_type: '5', au_process_name: 'Alumini'});
		} else if(this.admissionReportForm.value.reviewReport === '2' || this.admissionReportForm.value.reviewReport === '3'){
			this.enrollMentTypeArray.push({au_process_type: '1', au_process_name: 'Enquiry'});
			this.enrollMentTypeArray.push({au_process_type: '2', au_process_name: 'Registration'});
			// this.enrollMentTypeArray.push({au_process_type: '3', au_process_name: 'Provisional Admission'});
			this.enrollMentTypeArray.push({au_process_type: '4', au_process_name: 'Admission'});
		}
	}

	submit() {
		this.resetGrid();
		const inputJson = {};
		inputJson['enrollment_type'] = this.admissionReportForm.value.enrolment_type;
		if (this.showDate) {
			inputJson['to_date'] = this.notif.dateConvertion(this.admissionReportForm.value.cdate, 'yyyy-MM-dd');

		} else {
			inputJson['from_date'] = this.notif.dateConvertion(this.admissionReportForm.value.fdate, 'yyyy-MM-dd');
			inputJson['to_date'] = this.notif.dateConvertion(this.admissionReportForm.value.tdate, 'yyyy-MM-dd');
		}

		const validateFlag = this.checkValidation();

		if (validateFlag) {
			if (this.admissionReportForm.value.reviewReport === '0') {
				this.sisService.generateReportProcessWise(inputJson).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.reportProcessWiseData = result.data;
						this.prepareDataSource();
						this.tableFlag = true;
					} else {
						this.notif.showSuccessErrorMessage(result.data, 'error');
						this.resetGrid();
						this.tableFlag = true;
					}
				});
			} else if (this.admissionReportForm.value.reviewReport === '1') {
				this.sisService.generateReportClassWise(inputJson).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.reportEnrolmentWiseData = result.data;
						this.prepareEnrolmentDataSource();
						this.tableFlag = true;
					} else {
						this.notif.showSuccessErrorMessage(result.data, 'error');
						this.resetGrid();
						this.tableFlag = true;
					}
				});
			} else if (this.admissionReportForm.value.reviewReport === '2') {
				inputJson['au_status'] = 6;
				this.sisService.getEnrollmentDetialedReport(inputJson).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.reportEnrolmentWiseData = result.data;
						this.prepareEnrolmentDataSource();
						this.tableFlag = true;
					} else {
						this.notif.showSuccessErrorMessage(result.data, 'error');
						this.resetGrid();
						this.tableFlag = true;
					}
				});
			} else if (this.admissionReportForm.value.reviewReport === '3') {
				inputJson['au_status'] = 1;
				inputJson['accd_fo_id'] = 1;
				this.sisService.getNewEnrollment(inputJson).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.reportEnrolmentWiseData = result.data;
						this.prepareEnrolmentDataSource();
						this.tableFlag = true;
					} else {
						this.notif.showSuccessErrorMessage(result.data, 'error');
						this.resetGrid();
						this.tableFlag = true;
					}
				});
			} else if (this.admissionReportForm.value.reviewReport === '4') {
				// inputJson['au_status'] = 6;
				inputJson['au_enrollment_status'] = 'left';
				this.sisService.getEnrollmentDetialedReport(inputJson).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.reportEnrolmentWiseData = result.data;
						this.prepareEnrolmentDataSource();
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
			if (this.admissionReportForm.value.reviewReport === '0' && !this.admissionReportForm.value.enrolment_type) {
				this.notif.showSuccessErrorMessage('Please Choose Enrolment Type', 'error');
				if (!this.admissionReportForm.value.cdate) {
					this.notif.showSuccessErrorMessage('Please Choose Date', 'error');
				}
			} else if (this.admissionReportForm.value.reviewReport === '1' && !this.admissionReportForm.value.cdate) {
				this.notif.showSuccessErrorMessage('Please Choose Date', 'error');
			} else {
				validateFlag = 1;
			}
		} else {
			if (this.admissionReportForm.value.reviewReport === '0' && !this.admissionReportForm.value.enrolment_type) {
				this.notif.showSuccessErrorMessage('Please Choose Enrolment Type', 'error');
				if (!this.admissionReportForm.value.fdate) {
					this.notif.showSuccessErrorMessage('Please Choose From Date', 'error');
				}
			} else if (this.admissionReportForm.value.reviewReport === '1' && !this.admissionReportForm.value.fdate) {
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
	prepareDataSource() {
		this.columnDefinitions = [
			{ id: 'class_name', name: 'Class', field: 'class_name', sortable: true, filterable: true, resizable: false },
			{ id: 'Boys', name: 'Boys', field: 'Boys', sortable: true, filterable: true, resizable: false },
			{ id: 'Girls', name: 'Girls', field: 'Girls', sortable: true, filterable: true, resizable: false },
			{ id: 'Other', name: 'Other', field: 'Other', sortable: true, filterable: true, resizable: false },
			{ id: 'Total', name: 'Total', field: 'Total', sortable: true, filterable: true }
		];
		let counter = 1;
		let total = 0;
		let boyTotal = 0;
		let girlTotal = 0;
		let otherTotal = 0;
		for (let i = 0; i < this.reportProcessWiseData.length; i++) {
			const tempObj = {};
			tempObj['id'] = counter;
			tempObj['counter'] = counter;
			tempObj['class_name'] = this.reportProcessWiseData[i]['class_name'];
			tempObj['Boys'] = this.reportProcessWiseData[i]['Boys'];
			tempObj['Girls'] = this.reportProcessWiseData[i]['Girls'];
			tempObj['Other'] = this.reportProcessWiseData[i]['Other'];
			tempObj['Total'] = this.reportProcessWiseData[i]['Total'];
			total = total + this.reportProcessWiseData[i]['Total'];
			boyTotal = boyTotal + parseInt(this.reportProcessWiseData[i]['Boys'], 10);
			girlTotal = girlTotal + parseInt(this.reportProcessWiseData[i]['Girls'], 10);
			otherTotal = otherTotal + parseInt(this.reportProcessWiseData[i]['Other'], 10);
			this.dataset.push(tempObj);
			counter++;
		}

		const blankTempObj = {};
		blankTempObj['counter'] = '';
		blankTempObj['class_name'] = 'Grand Total';
		blankTempObj['Boys'] = boyTotal;
		blankTempObj['Girls'] = girlTotal;
		blankTempObj['Other'] = otherTotal;
		blankTempObj['Total'] = total;
		// this.dataset.push(blankTempObj);
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
	}
	checkDateFormatter(row, cell, value, columnDef, dataContext) {
		if (value && value !== '-') {
			return new DatePipe('en-in').transform(value, 'd-MMM-y');
		} else {
			return '-';
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

	prepareEnrolmentDataSource() {
		if ( this.admissionReportForm.value.reviewReport === '1') {
			this.columnDefinitions = [
				{ id: 'class_name', name: 'Class', field: 'class_name', sortable: true, filterable: true, resizable: false },
				{ id: 'Enquiry', name: 'Enquiry', field: 'Enquiry', sortable: true, filterable: true, resizable: false },
				{ id: 'Registration', name: 'Registration', field: 'Registration', sortable: true, filterable: true, resizable: false },
				{ id: 'Proadmission', name: 'Pro.Adm', field: 'Proadmission', sortable: true, filterable: true, resizable: false },
				{ id: 'Admission', name: 'Admission', field: 'Admission', sortable: true, filterable: true, resizable: false },
				{ id: 'Alumini', name: 'Alumini', field: 'Alumini', sortable: true, filterable: true, resizable: false },
				{ id: 'Total', name: 'Total', field: 'Total', sortable: true, filterable: true }
			];
			let counter = 1;
			let total = 0;
			let enqTotal = 0;
			let regTotal = 0;
			let proTotal = 0;
			let admTotal = 0;
			let almTotal = 0;
			for (let i = 0; i < this.reportEnrolmentWiseData.length; i++) {
				const tempObj = {};
				tempObj['id'] = counter;
				tempObj['counter'] = counter;
				tempObj['class_name'] = this.reportEnrolmentWiseData[i]['class_name'];
				tempObj['Enquiry'] = this.reportEnrolmentWiseData[i]['Enquiry'];
				tempObj['Registration'] = this.reportEnrolmentWiseData[i]['Registration'];
				tempObj['Proadmission'] = this.reportEnrolmentWiseData[i]['Proadmission'];
				tempObj['Admission'] = this.reportEnrolmentWiseData[i]['Admission'];
				tempObj['Alumini'] = this.reportEnrolmentWiseData[i]['Alumini'];
				tempObj['Total'] = this.reportEnrolmentWiseData[i]['Total'];
				total = total + this.reportEnrolmentWiseData[i]['Total'];
				enqTotal = enqTotal + parseInt(this.reportEnrolmentWiseData[i]['Enquiry'], 10);
				regTotal = regTotal + parseInt(this.reportEnrolmentWiseData[i]['Registration'], 10);
				proTotal = proTotal + parseInt(this.reportEnrolmentWiseData[i]['Proadmission'], 10);
				admTotal = admTotal + parseInt(this.reportEnrolmentWiseData[i]['Admission'], 10);
				almTotal = almTotal + parseInt(this.reportEnrolmentWiseData[i]['Alumini'], 10);
				this.dataset.push(tempObj);
				counter++;
			}
	
			const blankTempObj = {};
			blankTempObj['counter'] = '';
			blankTempObj['class_name'] = 'Grand Total';
			blankTempObj['Enquiry'] = enqTotal;
			blankTempObj['Registration'] = regTotal;
			blankTempObj['Proadmission'] = proTotal;
			blankTempObj['Admission'] = admTotal;
			blankTempObj['Alumini'] = almTotal;
			blankTempObj['Total'] = total;
			// this.dataset.push(blankTempObj);
			this.totalRow = blankTempObj;
			console.log('dataset  ', this.dataset);
		} else if (this.admissionReportForm.value.reviewReport === '2' || this.admissionReportForm.value.reviewReport === '3') {
			let process_type_name='';
			let process_type_field_no='';
			let process_type_field_date='';
			if (this.admissionReportForm.value.enrolment_type === '1'){
				process_type_name = 'Enq. ';
				process_type_field_no = 'em_enq_no';
				process_type_field_date = 'em_enq_date';
			} else if (this.admissionReportForm.value.enrolment_type === '2'){
				process_type_name = 'Regn. ';
				process_type_field_no = 'em_regd_no';
				process_type_field_date = 'em_regd_date';
			} else if (this.admissionReportForm.value.enrolment_type === '3'){
				process_type_name = 'Pro Admn. ';
				process_type_field_no = 'em_provisional_admission_no';
				process_type_field_date = 'em_provisional_admission_date';
			} else if (this.admissionReportForm.value.enrolment_type === '4'){
				process_type_name = 'Admn. ';
				process_type_field_no = 'em_admission_no';
				process_type_field_date = 'em_admission_date';
			} 
			if (this.admissionReportForm.value.reviewReport === '4'){
				process_type_name = 'Admn. ';
				process_type_field_no = 'em_admission_no';
				process_type_field_date = 'em_admission_date';
			} 
			this.columnDefinitions = [
				{ id: 'pos', name: 'S. No', field: 'pos', sortable: true, filterable: true, resizable: true },
				{ id: 'au_full_name', name: 'Name', field: 'au_full_name', sortable: true, filterable: true, resizable: true },
				{ id: 'em_no', name: process_type_name+'No', field: 'em_no', sortable: true, filterable: true, resizable: true },
				{ id: 'em_date', name: process_type_name+'Date', field: 'em_date', sortable: true, filterable: true, resizable: true,
				formatter: this.checkDateFormatter },
		 		{ id: 'class_name', name: 'Class', field: 'class_name', sortable: true, filterable: true, resizable: true }	
			];
			let counter = 1;
			for (let i = 0; i < this.reportEnrolmentWiseData.length; i++) {
				const tempObj = {};
		  		tempObj['id'] = counter;
				tempObj['pos'] = counter;
				tempObj['au_full_name'] = this.reportEnrolmentWiseData[i]['au_full_name'] ? this.reportEnrolmentWiseData[i]['au_full_name'] : '' ;
				tempObj['em_no'] = this.reportEnrolmentWiseData[i]['au_process_type'] == '1' ? this.reportEnrolmentWiseData[i]['em_enq_no']: this.reportEnrolmentWiseData[i]['au_process_type'] == '2' ? this.reportEnrolmentWiseData[i]['em_regd_no']: this.reportEnrolmentWiseData[i]['au_process_type'] == '3' ? this.reportEnrolmentWiseData[i]['em_provisional_admission_no']:this.reportEnrolmentWiseData[i]['em_admission_no'] ;
				tempObj['em_date'] = this.reportEnrolmentWiseData[i][process_type_field_date] ? this.reportEnrolmentWiseData[i][process_type_field_date]: '';
				tempObj['class_name'] = this.reportEnrolmentWiseData[i]['class_name'] ? this.reportEnrolmentWiseData[i]['class_name']: '';
				this.dataset.push(tempObj);
				counter++;
			}
	
			const blankTempObj = {};
			blankTempObj['id'] = 'footer';
			blankTempObj['pos'] = 'Grand Total';
			blankTempObj['au_full_name'] = this.dataset.length;
			blankTempObj['em_no'] = '';
			blankTempObj['em_date'] = '';
			blankTempObj['class_name'] = '';
			// this.dataset.push(blankTempObj);
			this.totalRow = blankTempObj;
			console.log(this.admissionReportForm.value.reviewReport, 'dataset ------------------- ', this.dataset);
		} else if(this.admissionReportForm.value.reviewReport === '4') {
			let process_type_name='';
			let process_type_field_no='';
			let process_type_field_date='';
			
			if (this.admissionReportForm.value.reviewReport === '4'){
				process_type_name = 'Admn. ';
				process_type_field_no = 'em_admission_no';
				process_type_field_date = 'em_admission_date';
			} 
			this.columnDefinitions = [
				{ id: 'pos', name: 'S. No', field: 'pos', sortable: true, filterable: true, resizable: true },
				{ id: 'au_full_name', name: 'Name', field: 'au_full_name', sortable: true, filterable: true, resizable: true },
				{ id: 'em_no', name: process_type_name+'No', field: 'em_no', sortable: true, filterable: true, resizable: true },
				{ id: 'em_date', name: process_type_name+'Date', field: 'em_date', sortable: true, filterable: true, resizable: true,
				formatter: this.checkDateFormatter },
		 		{ id: 'class_name', name: 'Class', field: 'class_name', sortable: true, filterable: true, resizable: true }	,
				 { id: 'ces_enrollment_remark', name: 'Remark', field: 'ces_enrollment_remark', sortable: true, filterable: true, resizable: true }	
				
			];
			let counter = 1;
			for (let i = 0; i < this.reportEnrolmentWiseData.length; i++) {
				const tempObj = {};
		  		tempObj['id'] = counter;
				tempObj['pos'] = counter;
				tempObj['au_full_name'] = this.reportEnrolmentWiseData[i]['au_full_name'] ? this.reportEnrolmentWiseData[i]['au_full_name'] : '' ;
				tempObj['em_no'] = this.reportEnrolmentWiseData[i][process_type_field_no]? this.reportEnrolmentWiseData[i][process_type_field_no]: '';
				tempObj['em_date'] = this.reportEnrolmentWiseData[i][process_type_field_date] ? this.reportEnrolmentWiseData[i][process_type_field_date]: '';
				tempObj['class_name'] = this.reportEnrolmentWiseData[i]['class_name'] ? this.reportEnrolmentWiseData[i]['class_name'] + '-' + this.reportEnrolmentWiseData[i]['sec_name'] : '';
				tempObj['ces_enrollment_remark'] = this.reportEnrolmentWiseData[i]['ces_enrollment_remark']? this.reportEnrolmentWiseData[i]['ces_enrollment_remark']: '';
				this.dataset.push(tempObj);
				counter++;
			}
	
			const blankTempObj = {};
			blankTempObj['id'] = 'footer';
			blankTempObj['pos'] = 'Grand Total';
			blankTempObj['au_full_name'] = this.dataset.length;
			blankTempObj['em_no'] = '';
			blankTempObj['em_date'] = '';
			blankTempObj['class_name'] = '';
			blankTempObj['ces_enrollment_remark'] = '';
			// this.dataset.push(blankTempObj);
			this.totalRow = blankTempObj;
			console.log('dataset  ', this.dataset);
		} else {
			let process_type_name='';
			let process_type_field_no='';
			let process_type_field_date='';
			
			// if (this.admissionReportForm.value.reviewReport === '4'){
			// 	process_type_name = 'Admn. ';
			// 	process_type_field_no = 'em_admission_no';
			// 	process_type_field_date = 'em_admission_date';
			// } 
			this.columnDefinitions = [
				{ id: 'pos', name: 'S. No', field: 'pos', sortable: true, filterable: true, resizable: true },
				{ id: 'au_full_name', name: 'Name', field: 'au_full_name', sortable: true, filterable: true, resizable: true },
				{ id: 'em_no', name: process_type_name+'No', field: 'em_no', sortable: true, filterable: true, resizable: true },
				{ id: 'em_date', name: process_type_name+'Date', field: 'em_date', sortable: true, filterable: true, resizable: true,
				formatter: this.checkDateFormatter },
		 		{ id: 'class_name', name: 'Class', field: 'class_name', sortable: true, filterable: true, resizable: true }	,
				 { id: 'ces_enrollment_remark', name: 'Remark', field: 'ces_enrollment_remark', sortable: true, filterable: true, resizable: true }	
				
			];
			let counter = 1;
			for (let i = 0; i < this.reportEnrolmentWiseData.length; i++) {
				const tempObj = {};
		  		tempObj['id'] = counter;
				tempObj['pos'] = counter;
				tempObj['au_full_name'] = this.reportEnrolmentWiseData[i]['au_full_name'] ? this.reportEnrolmentWiseData[i]['au_full_name'] : '' ;
				tempObj['em_no'] = this.reportEnrolmentWiseData[i]['au_process_type'] == '1' ? this.reportEnrolmentWiseData[i]['em_enq_no']: this.reportEnrolmentWiseData[i]['au_process_type'] == '2' ? this.reportEnrolmentWiseData[i]['em_regd_no']: this.reportEnrolmentWiseData[i]['au_process_type'] == '3' ? this.reportEnrolmentWiseData[i]['em_provisional_admission_no']:this.reportEnrolmentWiseData[i]['em_admission_no'] ;
				tempObj['em_date'] = this.reportEnrolmentWiseData[i][process_type_field_date] ? this.reportEnrolmentWiseData[i][process_type_field_date]: '';
				tempObj['class_name'] = this.reportEnrolmentWiseData[i]['class_name'] ? this.reportEnrolmentWiseData[i]['class_name'] + '-' + this.reportEnrolmentWiseData[i]['sec_name'] : '';
				tempObj['ces_enrollment_remark'] = this.reportEnrolmentWiseData[i]['ces_enrollment_remark']? this.reportEnrolmentWiseData[i]['ces_enrollment_remark']: '';
				this.dataset.push(tempObj);
				counter++;
			}
	
			const blankTempObj = {};
			blankTempObj['id'] = 'footer';
			blankTempObj['pos'] = 'Grand Total';
			blankTempObj['au_full_name'] = this.dataset.length;
			blankTempObj['em_no'] = '';
			blankTempObj['em_date'] = '';
			blankTempObj['class_name'] = '';
			blankTempObj['ces_enrollment_remark'] = '';
			// this.dataset.push(blankTempObj);
			this.totalRow = blankTempObj;
			console.log('dataset  ', this.dataset);
		}
		if (this.dataset.length > 20) {
			this.gridHeight = 750;
		} else if (this.dataset.length > 10) {
			this.gridHeight = 550;
		} else if (this.dataset.length > 5) {
			this.gridHeight = 400;
		} else {
			this.gridHeight = 300;
		}
	}

}


