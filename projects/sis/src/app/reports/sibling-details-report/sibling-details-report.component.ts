import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonAPIService, SisService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import {
	GridOption, Column, AngularGridInstance, Grouping, Aggregators,
	FieldType,
	Filters,
	Formatters
} from 'angular-slickgrid';

@Component({
	selector: 'app-sibling-details-report',
	templateUrl: './sibling-details-report.component.html',
	styleUrls: ['./sibling-details-report.component.scss']
})
export class SiblingDetailsReportComponent implements OnInit, AfterViewInit {

	columnDefinitions: Column[] = [];
	gridOptions: GridOption = {};
	dataset: any[] = [];
	angularGrid: AngularGridInstance;
	dataviewObj: any;
	gridObj: any;
	showDate = true;
	gridHeight: any;
	tableFlag = false;
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
			{ id: 'gender', name: 'Gender', field: 'gender', sortable: true, filterable: true },
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
	checkDateFormatter(row, cell, value, columnDef, dataContext) {
		if (value && value !== '-') {
			return new DatePipe('en-in').transform(value, 'd-MMM-y');
		} else {
			return '-';
		}
	}
	angularGridReady(angularGrid: AngularGridInstance) {
		this.angularGrid = angularGrid;
		this.gridObj = angularGrid.slickGrid; // grid object
		this.dataviewObj = angularGrid.dataView;
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
			tempObj['full_name'] = this.studentSiblingData[key]['au_full_name'];
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

			tempObj['father_name'] = this.studentSiblingData[key]['student_parent_data'] &&
				this.studentSiblingData[key]['student_parent_data'][2] &&
				this.studentSiblingData[key]['student_parent_data'][2]['epd_parent_name'] ?
				 father_honorific + this.studentSiblingData[key]['student_parent_data'][2]['epd_parent_name'] : '-';
			tempObj['mother_name'] = this.studentSiblingData[key]['student_parent_data'] &&
				this.studentSiblingData[key]['student_parent_data'][1] &&
				this.studentSiblingData[key]['student_parent_data'][1]['epd_parent_name'] ?
				 mother_honorific + this.studentSiblingData[key]['student_parent_data'][1]['epd_parent_name'] : '-';

			tempObj['guardian_name'] = this.studentSiblingData[key]['student_parent_data'] &&
			this.studentSiblingData[key]['student_parent_data'][0] &&
				this.studentSiblingData[key]['student_parent_data'][0]['epd_parent_name'] ?
				 guardian_honorific + this.studentSiblingData[key]['student_parent_data'][0]['epd_parent_name'] : '-';

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
				sibtempObj['full_name'] = this.studentSiblingData[key]['student_sibling_details'][sibkey]['au_full_name'];
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



				sibtempObj['father_name'] = this.studentSiblingData[key]['student_sibling_details'] &&
					this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][2] &&
					this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][2]['epd_parent_name'] ?
					sibling_father_honorific +
					this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][2]['epd_parent_name'] : '-';
				sibtempObj['mother_name'] = this.studentSiblingData[key]['student_sibling_details'] &&
					this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][1] &&
					this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][1]['epd_parent_name'] ?
					sibnling_mother_honorific +
					this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][1]['epd_parent_name'] : '-';
				sibtempObj['guardian_name'] = this.studentSiblingData[key]['student_sibling_details'] &&
					this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][0] &&
					this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][0]['epd_parent_name']  ?
					sibling_guardian_honorific +
					this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][0]['epd_parent_name'] : '-';
				this.dataset.push(sibtempObj);
			}
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
