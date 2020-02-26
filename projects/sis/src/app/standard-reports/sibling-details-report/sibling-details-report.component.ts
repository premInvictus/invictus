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
	selector: 'app-sibling-details-report',
	templateUrl: './sibling-details-report.component.html',
	styleUrls: ['./sibling-details-report.component.scss']
})
export class SiblingDetailsReportComponent implements OnInit, AfterViewInit {


	showDate = true;
	showDateRange = false;
	events: any;
	@ViewChild('TABLE') table: ElementRef;

	studentSiblingsReportForm: FormGroup;

	displayedSiblingsColumns: string[] = [
		'counter',
		'class_name',
		'sec_name',
		'admission_no',
		'full_name',
		'gender',
		'admission_date',
		'alumini_date',
		'enrollment_status',
		'email',
		'mobile',
		'father_name',
		'mother_name',
		'guardian_name',
		'transport_required',
		// 'parent_data',
		// 'sibling_details'
	];

	studentSiblingData: any[] = [];
	SIBLING_REPORT_ELEMENT_DATA: any[] = [];
	studentSiblingDataSource = new MatTableDataSource<Element>(this.SIBLING_REPORT_ELEMENT_DATA);
	@ViewChild(MatSort) sort: MatSort;
	constructor(private fbuild: FormBuilder, public sanitizer: DomSanitizer,
		private notif: CommonAPIService, private sisService: SisService,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit() {
		this.buildForm();
	}

	ngAfterViewInit() {
		this.studentSiblingDataSource.sort = this.sort;
	}

	buildForm() {
		this.studentSiblingsReportForm = this.fbuild.group({
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
		this.studentSiblingData = [];
		this.SIBLING_REPORT_ELEMENT_DATA = [];
		this.studentSiblingDataSource = new MatTableDataSource(this.SIBLING_REPORT_ELEMENT_DATA);
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

	prepareDataSource() {
		this.studentSiblingDataSource = new MatTableDataSource<Element>(this.SIBLING_REPORT_ELEMENT_DATA);
		let counter = 1;
		const total = 0;
		for (let i = 0; i < Object.keys(this.studentSiblingData).length; i++) {

			const tempObj = {};
			const key = Object.keys(this.studentSiblingData)[i];
			// let total_sec_student = this.countSecStudent(this.studentSiblingData[key]['student_data']);
			tempObj['counter'] = counter;
			tempObj['class_name'] = this.studentSiblingData[key]['class_name'];
			tempObj['sec_name'] = this.studentSiblingData[key]['sec_name'];
			tempObj['login_id'] = this.studentSiblingData[key]['au_login_id'];
			tempObj['admission_no'] = this.studentSiblingData[key]['au_admission_no'];
			tempObj['full_name'] = this.studentSiblingData[key]['au_full_name'];
			tempObj['gender'] = this.studentSiblingData[key]['upd_gender'];
			tempObj['admission_date'] = this.studentSiblingData[key]['em_admission_date'];
			tempObj['alumini_date'] = this.studentSiblingData[key]['em_alumini_date'];
			tempObj['enrollment_status'] = this.studentSiblingData[key]['au_enrollment_status'];
			tempObj['email'] = this.studentSiblingData[key]['au_email'];
			tempObj['mobile'] = this.studentSiblingData[key]['au_mobile'];
			tempObj['transport_required'] = this.studentSiblingData[key]['ead_transport_required'];
			// tempObj['parent_data'] = this.studentSiblingData[key]['student_parent_data'];

			console.log(this.studentSiblingData[key]['student_parent_data']);

			let father_honorific = this.getParentHonorific(this.studentSiblingData[key]['student_parent_data'] &&
			this.studentSiblingData[key]['student_parent_data'][2] ? this.studentSiblingData[key]['student_parent_data'][2]['epd_parent_honorific']  : '');

			let mother_honorific = this.getParentHonorific(this.studentSiblingData[key]['student_parent_data'] &&
			this.studentSiblingData[key]['student_parent_data'][2] ? this.studentSiblingData[key]['student_parent_data'][1]['epd_parent_honorific']  : '');

			let guardian_honorific = this.getParentHonorific(this.studentSiblingData[key]['student_parent_data'] &&
			this.studentSiblingData[key]['student_parent_data'][2] ? this.studentSiblingData[key]['student_parent_data'][1]['epd_parent_honorific']  : '');

			tempObj['father_name'] = this.studentSiblingData[key]['student_parent_data'] &&
				this.studentSiblingData[key]['student_parent_data'][2] ? father_honorific + this.studentSiblingData[key]['student_parent_data'][2]['epd_parent_name'] : '';
			tempObj['mother_name'] = this.studentSiblingData[key]['student_parent_data'] &&
				this.studentSiblingData[key]['student_parent_data'][1] ? mother_honorific + this.studentSiblingData[key]['student_parent_data'][1]['epd_parent_name'] : '';
			
			tempObj['guardian_name'] = this.studentSiblingData[key]['student_parent_data'] &&
				this.studentSiblingData[key]['student_parent_data'][0] ? guardian_honorific + this.studentSiblingData[key]['student_parent_data'][0]['epd_parent_name'] : '';
			// tempObj['sibling_details'] = this.studentSiblingData[key]['student_sibling_details'];
			// tempObj['Total'] = total_sec_student;
			// total = total+total_sec_student;
			this.SIBLING_REPORT_ELEMENT_DATA.push(tempObj);
			for (let j = 0; j < Object.keys(this.studentSiblingData[key]['student_sibling_details']).length; j++) {
				const sibtempObj = {};
				const sibkey = Object.keys(this.studentSiblingData[key]['student_sibling_details'])[j];
				sibtempObj['counter'] = counter;
				sibtempObj['class_name'] = this.studentSiblingData[key]['student_sibling_details'][sibkey]['class_name'];
				sibtempObj['sec_name'] = this.studentSiblingData[key]['student_sibling_details'][sibkey]['sec_name'];
				sibtempObj['login_id'] = this.studentSiblingData[key]['student_sibling_details'][sibkey]['au_login_id'];
				sibtempObj['admission_no'] = this.studentSiblingData[key]['student_sibling_details'][sibkey]['au_admission_no'];
				sibtempObj['full_name'] = this.studentSiblingData[key]['student_sibling_details'][sibkey]['au_full_name'];
				sibtempObj['gender'] = this.studentSiblingData[key]['student_sibling_details'][sibkey]['upd_gender'];
				sibtempObj['admission_date'] = this.studentSiblingData[key]['student_sibling_details'][sibkey]['em_admission_date'];
				sibtempObj['alumini_date'] = this.studentSiblingData[key]['student_sibling_details'][sibkey]['em_alumini_date'];
				sibtempObj['enrollment_status'] = this.studentSiblingData[key]['student_sibling_details'][sibkey]['au_enrollment_status'];
				sibtempObj['email'] = this.studentSiblingData[key]['student_sibling_details'][sibkey]['au_email'];
				sibtempObj['mobile'] = this.studentSiblingData[key]['student_sibling_details'][sibkey]['au_mobile'];
				sibtempObj['transport_required'] = this.studentSiblingData[key]['student_sibling_details'][sibkey]['ead_transport_required'];

				let sibling_father_honorific = this.getParentHonorific(this.studentSiblingData[key]['student_sibling_details'] &&
				this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][2] ?
				this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][2]['epd_parent_honorific']  : '');

				let sibnling_mother_honorific = this.getParentHonorific(this.studentSiblingData[key]['student_sibling_details'] &&
				this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][1] ?
				this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][1]['epd_parent_honorific']  : '');

				let sibling_guardian_honorific = this.getParentHonorific(this.studentSiblingData[key]['student_sibling_details'] &&
				this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][0] ?
				this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][0]['epd_parent_honorific']  : '');



				sibtempObj['father_name'] = this.studentSiblingData[key]['student_sibling_details'] &&
					this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][2] ?
					sibling_father_honorific+this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][2]['epd_parent_name'] : '';
				sibtempObj['mother_name'] = this.studentSiblingData[key]['student_sibling_details'] &&
					this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][1] ?
					sibnling_mother_honorific+this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][1]['epd_parent_name'] : '';
				sibtempObj['guardian_name'] = this.studentSiblingData[key]['student_sibling_details'] &&
					this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][0] ?
					sibling_guardian_honorific+this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'][0]['epd_parent_name'] : '';
				// sibtempObj['parent_data'] = this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_parent_data'];
				// sibtempObj['sibling_details'] = this.studentSiblingData[key]['student_sibling_details'][sibkey]['student_sibling_details'];
				counter++;
				this.SIBLING_REPORT_ELEMENT_DATA.push(sibtempObj);
			}
			counter++;
		}

		// const blankTempObj = {};
		//   blankTempObj['counter'] = '';
		//   blankTempObj['class_name'] = '';
		//   blankTempObj['student_data'] = '';
		//   blankTempObj['Total'] = '<b>'+ total +'</b>';
		// this.SIBLING_REPORT_ELEMENT_DATA.push(blankTempObj);
		this.studentSiblingDataSource = new MatTableDataSource(this.SIBLING_REPORT_ELEMENT_DATA);
		this.studentSiblingDataSource.sort = this.sort;
	}

	// countSecStudent(secArr) {
	// 	let count = 0;
	// 	for(let i=0;i<secArr.length;i++) {
	// 		count = count+secArr[i]['student_ids'];
	// 	}
	// 	return count;
	// }

	applyFilterUser(filterValue: string) {
		this.studentSiblingDataSource.filter = filterValue.trim().toLowerCase();
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
