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
	selector: 'app-admission-report',
	templateUrl: './admission-report.component.html',
	styleUrls: ['./admission-report.component.scss']
})
export class AdmissionReportComponent implements OnInit, AfterViewInit {
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

	admissionReportForm: FormGroup;

	displayedColumns: string[] = [
		'counter',
		'class_name',
		'Boys',
		'Girls',
		'Other',
		'Total'
	];

	displayedEnrolmentColumns: string[] = [
		'counter',
		'class_name',
		'Enquiry',
		'Registration',
		'Proadmission',
		'Admission',
		'Alumini',
		'Total'
	];
	reportProcessWiseData: any[] = [];
	reportEnrolmentWiseData: any[] = [];
	REPORT_PROCESS_WISE_ELEMENT_DATA: any[] = [];
	REPORT_ENROLMENT_WISE_ELEMENT_DATA: any[] = [];
	userDataSource = new MatTableDataSource<Element>(this.REPORT_PROCESS_WISE_ELEMENT_DATA);
	enrolmentDataSource = new MatTableDataSource<Element>(this.REPORT_ENROLMENT_WISE_ELEMENT_DATA);
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
		this.enrolmentDataSource.sort = this.sort;
	}

	buildForm() {
		this.admissionReportForm = this.fbuild.group({
			enrolment_type: '',
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
		this.reportProcessWiseData = [];
		this.REPORT_PROCESS_WISE_ELEMENT_DATA = [];
		this.userDataSource = new MatTableDataSource(this.REPORT_PROCESS_WISE_ELEMENT_DATA);
		this.reportEnrolmentWiseData = [];
		this.REPORT_ENROLMENT_WISE_ELEMENT_DATA = [];
		this.enrolmentDataSource = new MatTableDataSource(this.REPORT_ENROLMENT_WISE_ELEMENT_DATA);
	}

	submit() {
		this.resetGrid();
		const inputJson = {};
		inputJson['enrollment_type'] = this.admissionReportForm.value.enrolment_type;
		if (this.showDate) {
			inputJson['from_date'] = this.notif.dateConvertion(this.admissionReportForm.value.cdate, 'yyyy-MM-dd');

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
					} else {
						this.notif.showSuccessErrorMessage(result.data, 'error');
						this.resetGrid();
					}
				});
			} else if (this.admissionReportForm.value.reviewReport === '1') {
				this.sisService.generateReportClassWise(inputJson).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.reportEnrolmentWiseData = result.data;
						this.prepareEnrolmentDataSource();
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

	prepareDataSource() {
		this.userDataSource = new MatTableDataSource<Element>(this.REPORT_PROCESS_WISE_ELEMENT_DATA);
		let counter = 1;
		let total = 0;
		let boyTotal = 0;
		let girlTotal = 0;
		let otherTotal = 0;
		for (let i = 0; i < this.reportProcessWiseData.length; i++) {
			const tempObj = {};
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
			this.REPORT_PROCESS_WISE_ELEMENT_DATA.push(tempObj);
			counter++;
		}

		const blankTempObj = {};
		blankTempObj['counter'] = '<b>Total</b>';
		blankTempObj['class_name'] = '';
		blankTempObj['Boys'] = '<b>' + boyTotal + '</b>';
		blankTempObj['Girls'] = '<b>' + girlTotal + '</b>';
		blankTempObj['Other'] = '<b>' + otherTotal + '</b>';
		blankTempObj['Total'] = '<b>' + total + '</b>';
		this.REPORT_PROCESS_WISE_ELEMENT_DATA.push(blankTempObj);
		this.userDataSource = new MatTableDataSource(this.REPORT_PROCESS_WISE_ELEMENT_DATA);
		this.userDataSource.sort = this.sort;
	}

	prepareEnrolmentDataSource() {
		this.enrolmentDataSource = new MatTableDataSource<Element>(this.REPORT_ENROLMENT_WISE_ELEMENT_DATA);
		let counter = 1;
		let total = 0;
		let enqTotal = 0;
		let regTotal = 0;
		let proTotal = 0;
		let admTotal = 0;
		let almTotal = 0;
		for (let i = 0; i < this.reportEnrolmentWiseData.length; i++) {
			const tempObj = {};
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
			admTotal = admTotal + parseInt(this.reportEnrolmentWiseData[i]['Alumini'], 10);
			almTotal = almTotal + parseInt(this.reportEnrolmentWiseData[i]['Alumini'], 10);
			this.REPORT_ENROLMENT_WISE_ELEMENT_DATA.push(tempObj);
			counter++;
		}

		const blankTempObj = {};
		blankTempObj['counter'] = '<b>Total</b>';
		blankTempObj['class_name'] = '';
		blankTempObj['Enquiry'] = '<b>' + enqTotal + '</b>';
		blankTempObj['Registration'] = '<b>' + regTotal + '</b>';
		blankTempObj['Proadmission'] = '<b>' + proTotal + '</b>';
		blankTempObj['Admission'] = '<b>' + admTotal + '</b>';
		blankTempObj['Alumini'] = '<b>' + almTotal + '</b>';
		blankTempObj['Total'] = '<b>' + total + '</b>';
		this.REPORT_ENROLMENT_WISE_ELEMENT_DATA.push(blankTempObj);
		this.enrolmentDataSource = new MatTableDataSource(this.REPORT_ENROLMENT_WISE_ELEMENT_DATA);
		this.enrolmentDataSource.sort = this.sort;
	}

	applyFilterUser(filterValue: string) {
		this.userDataSource.filter = filterValue.trim().toLowerCase();
		this.enrolmentDataSource.filter = filterValue.trim().toLowerCase();
	}


	exportAsExcel() {
		const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement); // converts a DOM TABLE element to a worksheet
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

		/* save to file */
		XLSX.writeFile(wb, 'AdmissionReport_' + (new Date).getTime() + '.xlsx');

	}



	print() {
		const printModal2 = document.getElementById('admissionReportPrint');
		const popupWin = window.open('', '_blank', 'width=' + screen.width + ',height=' + screen.height);
		popupWin.document.open();
		popupWin.document.write('<html> <link rel="stylesheet" href="/assets/css/print.css">' +
		'<style>.tab-margin-button-bottom{display:none !important}</style>' +
			'<body onload="window.print()"> <div class="headingDiv"><center><h2>Admission Report</h2></center></div>'
			+ printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}

}


