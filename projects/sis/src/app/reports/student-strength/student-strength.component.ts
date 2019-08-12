import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonAPIService, SisService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';

import {
	GridOption, Column, AngularGridInstance, Grouping, Aggregators,
	FieldType,
	Filters,
	Formatters
} from 'angular-slickgrid';

@Component({
	selector: 'app-student-strength',
	templateUrl: './student-strength.component.html',
	styleUrls: ['./student-strength.component.scss']
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

	showDate = true;
	showDateRange = false;
	events: any;
	@ViewChild('TABLE') table: ElementRef;

	studentStrengthReportForm: FormGroup;

	reportSummaryData: any[] = [];
	reportDetailData: any[] = [];
	constructor(private fbuild: FormBuilder, public sanitizer: DomSanitizer,
		private notif: CommonAPIService, private sisService: SisService,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit() {
		// this.summaryDataSource.sort = this.sort;
		this.buildForm();
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
			footerRowHeight: 21,
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
	prepareDataSource() {
		this.columnDefinitions = [
			{ id: 'counter', name: 'S.No.', field: 'counter', sortable: true, filterable: true },
			{ id: 'class_name', name: 'Class', field: 'class_name', sortable: true, filterable: true },
			{ id: 'student_strength', name: 'Student Strength', field: 'student_strength', sortable: true, filterable: true }
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
		blankTempObj['counter'] = 'Total';
		blankTempObj['class_name'] = '';
		blankTempObj['student_strength'] = total;
		this.dataset.push(blankTempObj);

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
			{ id: 'counter', name: 'S.No.', field: 'counter', sortable: true, filterable: true },
			{ id: 'class_name', name: 'Class', field: 'class_name', sortable: true, filterable: true },
			{ id: 'admission_no', name: 'Adm.No.', field: 'admission_no', sortable: true, filterable: true },
			{ id: 'student_name', name: 'Student Name', field: 'student_name', sortable: true, filterable: true },
			{ id: 'gender', name: 'Gender', field: 'gender', sortable: true, filterable: true },
			{ id: 'process_type', name: 'Process Type', field: 'process_type', sortable: true, filterable: true }
		];
		let counter = 1;
		let total = 0;
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
