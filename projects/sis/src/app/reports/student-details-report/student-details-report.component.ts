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
	selector: 'app-student-details-report',
	templateUrl: './student-details-report.component.html',
	styleUrls: ['./student-details-report.component.scss']
})
export class StudentDetailsReportComponent implements OnInit, AfterViewInit {
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
	enrollMentTypeArray: any[] = [{
		au_process_type: '1', au_process_name: 'Enquiry'
	},
	{
		au_process_type: '2', au_process_name: 'Registration'
	},
	{
		au_process_type: '3', au_process_name: 'Provisional Admission'
	},
	{
		au_process_type: '4', au_process_name: 'Admission'
	},
	{
		au_process_type: '5', au_process_name: 'Alumini'
	}];


	studentDetailReportForm: FormGroup;

	reportProcessWiseData: any[] = [];
	constructor(private fbuild: FormBuilder, public sanitizer: DomSanitizer,
		private notif: CommonAPIService, private sisService: SisService,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit() {
		// this.userDataSource.sort = this.sort;
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
		this.columnDefinitions = [
			{ id: 'counter', name: 'S.No.', field: 'counter', sortable: true, filterable: true },
			{ id: 'admission_no', name: 'Adm.No.', field: 'admission_no', sortable: true, filterable: true },
			{ id: 'full_name', name: 'Student Name', field: 'full_name', sortable: true, filterable: true },
			{ id: 'class_name', name: 'Class', field: 'class_name', sortable: true, filterable: true },
			{ id: 'dob', name: 'DOB', field: 'dob', sortable: true, filterable: true,
			 	formatter: this.checkDateFormatter },
			{ id: 'gender', name: 'Gender', field: 'gender', sortable: true, filterable: true },
			{ id: 'admission_date', name: 'Adm.Date', field: 'admission_date', sortable: true, filterable: true,
			 	formatter: this.checkDateFormatter },
			{ id: 'email', name: 'Email', field: 'email', sortable: true, filterable: true },
			{ id: 'contact', name: 'Contact', field: 'contact', sortable: true, filterable: true },
			{ id: 'father_name', name: 'Father Name', field: 'father_name', sortable: true, filterable: true },
			{ id: 'mother_name', name: 'Mother Name', field: 'mother_name', sortable: true, filterable: true },
			{ id: 'guardian_name', name: 'Guardian Name', field: 'guardian_name', sortable: true, filterable: true },
			{ id: 'category', name: 'Category', field: 'category', sortable: true, filterable: true },
			{ id: 'rel_name', name: 'Religion', field: 'rel_name', sortable: true, filterable: true }
		];
	}

	ngAfterViewInit() {
	}

	buildForm() {
		this.studentDetailReportForm = this.fbuild.group({
			enrolment_type: '',
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
			inputJson['from_date'] = this.notif.dateConvertion(this.studentDetailReportForm.value.cdate, 'yyyy-MM-dd');
		} else {
			inputJson['from_date'] = this.notif.dateConvertion(this.studentDetailReportForm.value.fdate, 'yyyy-MM-dd');
			inputJson['to_date'] = this.notif.dateConvertion(this.studentDetailReportForm.value.tdate, 'yyyy-MM-dd');
		}

		const validateFlag = this.checkValidation();
		if (validateFlag) {
			this.sisService.getStudentReportDetails(inputJson).subscribe((result: any) => {
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
		}

		return honorific;
	}

	prepareDataSource() {
		let counter = 1;
		const total = 0;
		for (let i = 0; i < Object.keys(this.reportProcessWiseData).length; i++) {
			const tempObj = {};
			const key = Object.keys(this.reportProcessWiseData)[i];
			tempObj['id'] = key + counter;
			tempObj['counter'] = counter;

			tempObj['class_name'] = this.reportProcessWiseData[key]['sec_name'] ?
			this.reportProcessWiseData[key]['class_name'] + '-' + this.reportProcessWiseData[key]['sec_name'] :
			this.reportProcessWiseData[key]['class_name'];

			tempObj['admission_no'] = this.valueAndDash(this.reportProcessWiseData[key]['au_admission_no']);
			tempObj['dob'] = this.valueAndDash(this.reportProcessWiseData[key]['dob']);

			const father_honorific = this.getParentHonorific(this.reportProcessWiseData[key]['student_parent_data'] &&
			this.reportProcessWiseData[key]['student_parent_data'][0] ?
			this.reportProcessWiseData[key]['student_parent_data'][0]['epd_parent_honorific'] : '');

			const mother_honorific = this.getParentHonorific(this.reportProcessWiseData[key]['student_parent_data'] &&
			this.reportProcessWiseData[key]['student_parent_data'][1] ?
			this.reportProcessWiseData[key]['student_parent_data'][1]['epd_parent_honorific'] : '');

			const guardian_honorific = this.getParentHonorific(this.reportProcessWiseData[key]['student_parent_data'] &&
			this.reportProcessWiseData[key]['student_parent_data'][2] ?
			this.reportProcessWiseData[key]['student_parent_data'][2]['epd_parent_honorific'] : '');

			tempObj['father_name'] = father_honorific + this.reportProcessWiseData[key]['student_parent_data'] &&
				this.reportProcessWiseData[key]['student_parent_data'][0] &&
				this.reportProcessWiseData[key]['student_parent_data'][0]['epd_parent_name'] ?
				this.reportProcessWiseData[key]['student_parent_data'][0]['epd_parent_name'] : '-';
			tempObj['mother_name'] = mother_honorific + this.reportProcessWiseData[key]['student_parent_data'] &&
				this.reportProcessWiseData[key]['student_parent_data'][1] &&
				this.reportProcessWiseData[key]['student_parent_data'][1]['epd_parent_name'] ?
				this.reportProcessWiseData[key]['student_parent_data'][1]['epd_parent_name'] : '-';
			tempObj['guardian_name'] = guardian_honorific + this.reportProcessWiseData[key]['student_parent_data'] &&
				this.reportProcessWiseData[key]['student_parent_data'][2] &&
				this.reportProcessWiseData[key]['student_parent_data'][2]['epd_parent_name'] ?
				this.reportProcessWiseData[key]['student_parent_data'][2]['epd_parent_name'] : '-';
			tempObj['gender'] = this.valueAndDash(this.reportProcessWiseData[key]['upd_gender']);
			tempObj['full_name'] = this.valueAndDash(this.reportProcessWiseData[key]['au_full_name']);
			tempObj['admission_date'] = this.valueAndDash(this.reportProcessWiseData[key]['em_admission_date']);
			tempObj['email'] = this.valueAndDash(this.reportProcessWiseData[key]['au_email']);
			tempObj['contact'] = this.valueAndDash(this.reportProcessWiseData[key]['au_mobile']);
			tempObj['category'] = this.valueAndDash(this.reportProcessWiseData[key]['category']);
			tempObj['rel_name'] = this.valueAndDash(this.reportProcessWiseData[key]['rel_name']);
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
