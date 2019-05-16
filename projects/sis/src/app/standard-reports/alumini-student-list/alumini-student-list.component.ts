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
	selector: 'app-alumini-student-list',
	templateUrl: './alumini-student-list.component.html',
	styleUrls: ['./alumini-student-list.component.scss']
})
export class AluminiStudentListComponent implements OnInit, AfterViewInit {

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


	aluminiReportForm: FormGroup;

	displayedColumns: string[] = [
		'counter',
		'class_name',
		'sec_name',
		'admission_no',
		'alumini_no',
		'parent_name',
		'full_name',
		'admission_date',
		'contact'

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
		this.aluminiReportForm = this.fbuild.group({
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
			inputJson['from_date'] = this.notif.dateConvertion(this.aluminiReportForm.value.cdate, 'yyyy-MM-dd');
		} else {
			inputJson['from_date'] = this.notif.dateConvertion(this.aluminiReportForm.value.fdate, 'yyyy-MM-dd');
			inputJson['to_date'] = this.notif.dateConvertion(this.aluminiReportForm.value.tdate, 'yyyy-MM-dd');
		}

		const validateFlag = this.checkValidation();
		if (validateFlag) {
			this.sisService.getAluminiStudentDetails(inputJson).subscribe((result: any) => {
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
			if (!this.aluminiReportForm.value.cdate) {
				this.notif.showSuccessErrorMessage('Please Choose Date', 'error');
			} else {
				validateFlag = 1;
			}
		} else {
			if (!this.aluminiReportForm.value.fdate) {
				this.notif.showSuccessErrorMessage('Please Choose From Date', 'error');
			} else {
				validateFlag = 1;
			}
		}

		return validateFlag;
	}

	prepareDataSource() {
		this.userDataSource = new MatTableDataSource<Element>(this.REPORT_PROCESS_WISE_ELEMENT_DATA);
		let counter = 1;
		const total = 0;
		for (let i = 0; i < this.reportProcessWiseData.length; i++) {
			const tempObj = {};
			tempObj['counter'] = counter;
			tempObj['class_name'] = this.reportProcessWiseData[i]['class_name'];
			tempObj['sec_name'] = this.reportProcessWiseData[i]['sec_name'];

			tempObj['login_id'] = this.reportProcessWiseData[i]['au_login_id'];
			tempObj['admission_no'] = this.reportProcessWiseData[i]['au_admission_no'];
			tempObj['alumini_no'] = this.reportProcessWiseData[i]['em_alumini_no'];
			tempObj['parent_name'] = this.reportProcessWiseData[i]['epd_parent_name'];
			tempObj['gender'] = this.reportProcessWiseData[i]['upd_gender'];
			tempObj['full_name'] = this.reportProcessWiseData[i]['au_full_name'];
			tempObj['admission_date'] = this.reportProcessWiseData[i]['em_admission_date'];
			tempObj['alumini_date'] = this.reportProcessWiseData[i]['em_alumini_date'];
			tempObj['enrolment_status'] = this.reportProcessWiseData[i]['au_enrollment_status'];
			tempObj['email'] = this.reportProcessWiseData[i]['au_email'];
			tempObj['contact'] = this.reportProcessWiseData[i]['au_mobile'];
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
		XLSX.writeFile(wb, 'AluminiReport_' + (new Date).getTime() + '.xlsx');

	}

	print() {
		const printModal2 = document.getElementById('aluminiReportPrint');
		const popupWin = window.open('', '_blank', 'width=' + screen.width + ',height=' + screen.height);
		popupWin.document.open();
		popupWin.document.write('<html> <link rel="stylesheet" href=".//assets/css/print.css">' +
			'<body onload="window.print()"> <div class="headingDiv"><center><h2>Alumini Report</h2></center></div>' +
			printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}


}
