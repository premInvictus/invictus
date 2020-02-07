import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonAPIService, SisService } from '../../_services/index';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
	selector: 'app-student-details-report',
	templateUrl: './student-details-report.component.html',
	styleUrls: ['./student-details-report.component.scss']
})
export class StudentDetailsReportComponent implements OnInit, AfterViewInit {

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

	displayedColumns: string[] = [
		'counter',
		'class_name',
		'sec_name',
		'admission_no',
		'dob',
		'father_name',
		'mother_name',
		'guardian_name',
		'gender',
		'tag_name',
		'full_name',
		'admission_date',
		'email',
		'contact',
		'category',
		'rel_name'

	];

	reportProcessWiseData: any[] = [];
	REPORT_PROCESS_WISE_ELEMENT_DATA: any[] = [];
	userDataSource = new MatTableDataSource<Element>(this.REPORT_PROCESS_WISE_ELEMENT_DATA);
	@ViewChild(MatSort) sort: MatSort;
	constructor(private fbuild: FormBuilder, public sanitizer: DomSanitizer,
		private notif: CommonAPIService, private sisService: SisService,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit() {
		// this.userDataSource.sort = this.sort;
		this.buildForm();
	}

	ngAfterViewInit() {
		this.userDataSource.sort = this.sort;
	}

	buildForm() {
		this.studentDetailReportForm = this.fbuild.group({
			enrolment_type: '',
			fdate: new Date(),
			cdate: new Date(),
			tdate: new Date()
		});
	}

	showDateToggle() {
		this.showDate = !this.showDate;
		this.showDateRange = !this.showDateRange;
	}

	resetGrid() {
		this.reportProcessWiseData = [];
		this.REPORT_PROCESS_WISE_ELEMENT_DATA = [];
		this.userDataSource = new MatTableDataSource(this.REPORT_PROCESS_WISE_ELEMENT_DATA);
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
		this.userDataSource = new MatTableDataSource<Element>(this.REPORT_PROCESS_WISE_ELEMENT_DATA);
		let counter = 1;
		const total = 0;
		for (let i = 0; i < Object.keys(this.reportProcessWiseData).length; i++) {
			const tempObj = {};
			const key = Object.keys(this.reportProcessWiseData)[i];
			tempObj['counter'] = counter;
			tempObj['class_name'] = this.reportProcessWiseData[key]['class_name'];
			tempObj['sec_name'] = this.reportProcessWiseData[key]['sec_name'];
			tempObj['admission_no'] = this.reportProcessWiseData[key]['au_admission_no'];
			tempObj['dob'] = this.reportProcessWiseData[key]['dob'];

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
				this.reportProcessWiseData[key]['student_parent_data'][0] ?
				this.reportProcessWiseData[key]['student_parent_data'][0]['epd_parent_name'] : '';
			tempObj['mother_name'] = mother_honorific + this.reportProcessWiseData[key]['student_parent_data'] &&
				this.reportProcessWiseData[key]['student_parent_data'][1] ?
				this.reportProcessWiseData[key]['student_parent_data'][1]['epd_parent_name'] : '';
			tempObj['guardian_name'] = guardian_honorific + this.reportProcessWiseData[key]['student_parent_data'] &&
				this.reportProcessWiseData[key]['student_parent_data'][2] ?
				this.reportProcessWiseData[key]['student_parent_data'][2]['epd_parent_name'] : '';
			tempObj['gender'] = this.reportProcessWiseData[key]['upd_gender'];
			tempObj['full_name'] = this.reportProcessWiseData[key]['au_full_name'];
			tempObj['admission_date'] = this.reportProcessWiseData[key]['em_admission_date'];
			tempObj['email'] = this.reportProcessWiseData[key]['au_email'];
			tempObj['contact'] = this.reportProcessWiseData[key]['au_mobile'];
			tempObj['category'] = this.reportProcessWiseData[key]['category'];
			tempObj['rel_name'] = this.reportProcessWiseData[key]['rel_name'];
			tempObj['tag_name'] = this.reportProcessWiseData[key]['tag_name'] ? this.reportProcessWiseData[key]['tag_name'] : '';

			this.REPORT_PROCESS_WISE_ELEMENT_DATA.push(tempObj);

			counter++;
		}

		// const blankTempObj = {};
		//   blankTempObj['counter'] = '';
		//   blankTempObj['class_name'] = '';
		//   blankTempObj['Boys'] = '';
		//   blankTempObj['Girls'] = '';
		//   blankTempObj['Other'] = '';
		//   blankTempObj['Total'] = '<b>'+ total +'</b>';
		//   this.REPORT_PROCESS_WISE_ELEMENT_DATA.push(blankTempObj);
		this.userDataSource = new MatTableDataSource(this.REPORT_PROCESS_WISE_ELEMENT_DATA);
		this.userDataSource.sort = this.sort;
	}


	applyFilterUser(filterValue: string) {
		this.userDataSource.filter = filterValue.trim().toLowerCase();
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
