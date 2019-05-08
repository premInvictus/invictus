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
	selector: 'app-student-strength',
	templateUrl: './student-strength.component.html',
	styleUrls: ['./student-strength.component.scss']
})
export class StudentStrengthComponent implements OnInit, AfterViewInit {

	showDate = true;
	showDateRange = false;
	events: any;
	@ViewChild('TABLE') table: ElementRef;

	studentStrengthReportForm: FormGroup;

	displayedSummarizeColumns: string[] = [
		'counter',
		'class_name',
		'section_name',
		'student_strength'
	];

	displayedDetailColumns: string[] = [
		'counter',
		'class_name',
		'section',
		'admission_no',
		'student_name',
		'gender',
		'process_type',
		// 'Total'
	];
	reportSummaryData: any[] = [];
	reportDetailData: any[] = [];
	REPORT_SUMMARY_ELEMENT_DATA: any[] = [];
	REPORT_DETAIL_ELEMENT_DATA: any[] = [];
	summaryDataSource = new MatTableDataSource<Element>(this.REPORT_SUMMARY_ELEMENT_DATA);
	detailDataSource = new MatTableDataSource<Element>(this.REPORT_DETAIL_ELEMENT_DATA);
	@ViewChild(MatSort) sort: MatSort;
	constructor(private fbuild: FormBuilder, public sanitizer: DomSanitizer,
		private notif: CommonAPIService, private sisService: SisService,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit() {
		// this.summaryDataSource.sort = this.sort;
		this.buildForm();
	}

	ngAfterViewInit() {
		this.summaryDataSource.sort = this.sort;
		this.detailDataSource.sort = this.sort;
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

	resetGrid() {
		this.reportSummaryData = [];
		this.REPORT_SUMMARY_ELEMENT_DATA = [];
		this.summaryDataSource = new MatTableDataSource(this.REPORT_SUMMARY_ELEMENT_DATA);
		this.reportDetailData = [];
		this.REPORT_DETAIL_ELEMENT_DATA = [];
		this.detailDataSource = new MatTableDataSource(this.REPORT_DETAIL_ELEMENT_DATA);
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
					} else {
						this.notif.showSuccessErrorMessage(result.data, 'error');
						this.resetGrid();
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
					} else {
						this.notif.showSuccessErrorMessage(result.data, 'error');
						this.resetGrid();
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

	prepareDataSource() {
		this.summaryDataSource = new MatTableDataSource<Element>(this.REPORT_SUMMARY_ELEMENT_DATA);
		let counter = 1;
		let total = 0;
		for (let i = 0; i < Object.keys(this.reportSummaryData).length; i++) {

			const tempObj = {};
			const key = Object.keys(this.reportSummaryData)[i];
			const total_sec_student = this.reportSummaryData[key]['student_login_ids'].split(',').length;
			tempObj['counter'] = counter;
			tempObj['class_name'] = this.reportSummaryData[key]['class_name'];
			tempObj['section_name'] = this.reportSummaryData[key]['sec_name'];
			tempObj['student_strength'] = this.reportSummaryData[key]['student_login_ids'].split(',').length;
			// tempObj['Total'] = total_sec_student;
			total = total + total_sec_student;
			this.REPORT_SUMMARY_ELEMENT_DATA.push(tempObj);
			counter++;
		}

		const blankTempObj = {};
		blankTempObj['counter'] = '<b>Total</b>';
		blankTempObj['class_name'] = '';
		blankTempObj['section_name'] = '';
		// blankTempObj['student_strength'] = '';
		blankTempObj['student_strength'] = '<b>' + total + '</b>';
		this.REPORT_SUMMARY_ELEMENT_DATA.push(blankTempObj);
		this.summaryDataSource = new MatTableDataSource(this.REPORT_SUMMARY_ELEMENT_DATA);
		this.summaryDataSource.sort = this.sort;
	}

	countSecStudent(secArr) {
		let count = 0;
		for (let i = 0; i < secArr.length; i++) {
			count = count + secArr[i]['student_ids'];
		}
		return count;
	}

	prepareDetailDataSource() {
		this.detailDataSource = new MatTableDataSource<Element>(this.REPORT_DETAIL_ELEMENT_DATA);
		let counter = 1;
		let total = 0;
		for (let i = 0; i < this.reportDetailData.length; i++) {
			const tempObj = {};
			tempObj['counter'] = counter;
			tempObj['class_name'] = this.reportDetailData[i]['class'];
			tempObj['section'] = this.reportDetailData[i]['section'];
			tempObj['admission_no'] = this.reportDetailData[i]['admission_no'];
			tempObj['student_name'] = this.reportDetailData[i]['student_name'];
			tempObj['gender'] = this.reportDetailData[i]['gender'];
			tempObj['process_type'] = this.reportDetailData[i]['processType'] === '3' ? 'Provisional' : 'Admission';
			// tempObj['Total'] = '';
			total = total + this.reportDetailData[i]['Total'];
			this.REPORT_DETAIL_ELEMENT_DATA.push(tempObj);
			counter++;
		}

		// const blankTempObj = {};
		//   blankTempObj['counter'] = '';
		//   blankTempObj['class_name'] = '';
		//   blankTempObj['section'] = '';
		//   blankTempObj['admission_no'] = '';
		//   blankTempObj['student_name'] = '';
		//   blankTempObj['gender'] = '';
		//   blankTempObj['process_type'] = '';
		//   blankTempObj['Total'] = '<b>'+ total +'</b>';
		//   this.REPORT_DETAIL_ELEMENT_DATA.push(blankTempObj);
		this.detailDataSource = new MatTableDataSource(this.REPORT_DETAIL_ELEMENT_DATA);
		this.detailDataSource.sort = this.sort;
	}

	applyFilterUser(filterValue: string) {
		this.summaryDataSource.filter = filterValue.trim().toLowerCase();
		this.detailDataSource.filter = filterValue.trim().toLowerCase();
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
		popupWin.document.write('<html> <link rel="stylesheet" href="./../../assets/css/print.css">' +
			'<body onload="window.print()"> <div class="headingDiv"><center><h2>Student Strength Report</h2></center></div>' +
			printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}


}
