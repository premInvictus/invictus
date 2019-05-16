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
	selector: 'app-document-report',
	templateUrl: './document-report.component.html',
	styleUrls: ['./document-report.component.scss']
})
export class DocumentReportComponent implements OnInit, AfterViewInit {

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
		'full_name'
	];
	requiredDocData: any[] = [];
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
		// this.getRequiredDocument();
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

	getRequiredDocument() {
		this.sisService.getDocumentRequired().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.requiredDocData = result.data;
				for (let i = 0; i < result.data.length; i++) {
					this.displayedColumns.push(result.data[i]['docreq_name']);
				}
			} else {
				this.requiredDocData = [];
			}
		});


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
		this.sisService.getStudentDocumentReport(inputJson).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.reportProcessWiseData = result.data;
				this.displayedColumns = [];
				this.displayedColumns = ['counter',
					'class_name',
					'sec_name',
					'admission_no',
					'full_name'];
				for (let i = 0; i < result.data[1].length; i++) {
					this.displayedColumns.push(result.data[1][i]['docreq_name']);
				}
				this.displayedColumns.push('total_document_required');
				this.displayedColumns.push('total_uploaded_document');
				this.requiredDocData = result.data[1];
				this.prepareDataSource();
			} else {
				this.notif.showSuccessErrorMessage(result.data, 'error');
				this.resetGrid();
			}
		});
	}

	prepareDataSource() {
		this.userDataSource = new MatTableDataSource<Element>(this.REPORT_PROCESS_WISE_ELEMENT_DATA);
		let counter = 1;
		const total = 0;

		for (let i = 0; i < this.reportProcessWiseData[0].length; i++) {
			const tempObj = {};
			tempObj['counter'] = counter;
			tempObj['class_name'] = this.reportProcessWiseData[0][i]['class_name'];
			tempObj['sec_name'] = this.reportProcessWiseData[0][i]['sec_name'];
			tempObj['login_id'] = this.reportProcessWiseData[0][i]['au_login_id'];
			tempObj['admission_no'] = this.reportProcessWiseData[0][i]['au_admission_no'];
			tempObj['full_name'] = this.reportProcessWiseData[0][i]['au_full_name'];
			tempObj['admission_date'] = this.reportProcessWiseData[0][i]['em_admission_date'];
			tempObj['req_doc'] = this.reportProcessWiseData[0][i]['req_doc'];
			tempObj['total_document_required'] = this.reportProcessWiseData[1].length;
			let total_uploaded_document = 0;
			for (let k = 0; k < this.requiredDocData.length; k++) {
				if (tempObj['req_doc'] && (tempObj['req_doc']).indexOf(this.requiredDocData[k].docreq_id) !== -1) {
					total_uploaded_document++;
				}
			}
			tempObj['total_uploaded_document'] = total_uploaded_document;
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
		XLSX.writeFile(wb, 'DocumentsReport_' + (new Date).getTime() + '.xlsx');

	}

	print() {
		const printModal2 = document.getElementById('documentReportPrint');
		const popupWin = window.open('', '_blank', 'width=' + screen.width + ',height=' + screen.height);
		popupWin.document.open();
		popupWin.document.write('<html> <link rel="stylesheet" href=".//assets/css/print.css">' +
			'<body onload="window.print()"> <div class="headingDiv"><center><h2>Student Document Report</h2></center></div>' +
			printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}


}
