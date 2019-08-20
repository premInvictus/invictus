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
	selector: 'app-document-report',
	templateUrl: './document-report.component.html',
	styleUrls: ['./document-report.component.scss']
})
export class DocumentReportComponent implements OnInit, AfterViewInit {
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


	aluminiReportForm: FormGroup;
	requiredDocData: any[] = [];
	reportProcessWiseData: any[] = [];
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
	}

	ngAfterViewInit() {
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
		this.dataset = [];
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
				this.columnDefinitions = [
					{ id: 'counter', name: 'S.No.', field: 'counter', sortable: true, filterable: true },
					{ id: 'admission_no', name: 'Adm.No.', field: 'admission_no', sortable: true, filterable: true },
					{ id: 'full_name', name: 'Student Name', field: 'full_name', sortable: true, filterable: true },
					{ id: 'class_name', name: 'Class', field: 'class_name', sortable: true, filterable: true }
				];
				for (let i = 0; i < result.data[1].length; i++) {
					// this.displayedColumns.push(result.data[1][i]['docreq_name']);
					this.columnDefinitions.push({
						id: 'doc' + result.data[1][i]['docreq_id'],
						name: result.data[1][i]['docreq_name'],
						field: 'doc' + result.data[1][i]['docreq_id'],
						sortable: true,
						filterable: true
					});
				}
				this.columnDefinitions.push({
					id: 'total_document_required',
					name: 'Total Document Required',
					field: 'total_document_required',
					sortable: true,
					filterable: true
				});
				this.columnDefinitions.push({
					id: 'total_uploaded_document',
					name: 'Total Uploaded Document',
					field: 'total_uploaded_document',
					sortable: true,
					filterable: true
				});
				this.requiredDocData = result.data[1];
				this.prepareDataSource();
				this.tableFlag = true;
			} else {
				this.notif.showSuccessErrorMessage(result.data, 'error');
				this.resetGrid();
				this.tableFlag = true;
			}
		});
	}
	valueAndDash(value) {
		return value && value !== '0' ? value : '-';
	}
	prepareDataSource() {
		let counter = 1;
		const total = 0;

		for (let i = 0; i < this.reportProcessWiseData[0].length; i++) {
			const tempObj = {};
			tempObj['id'] = this.reportProcessWiseData[0][i]['ed_login_id'] + counter;
			tempObj['counter'] = counter;
			tempObj['class_name'] = this.reportProcessWiseData[0][i]['sec_name'] ?
			this.reportProcessWiseData[0][i]['class_name'] + '-' + this.reportProcessWiseData[0][i]['sec_name'] :
			this.reportProcessWiseData[0][i]['class_name'];

			tempObj['admission_no'] = this.reportProcessWiseData[0][i]['em_admission_no'];
			tempObj['full_name'] = this.reportProcessWiseData[0][i]['au_full_name'];
			tempObj['req_doc'] = this.reportProcessWiseData[0][i]['req_doc'];

			for (let k = 0; k < this.requiredDocData.length; k++) {
				tempObj['doc' + this.requiredDocData[k].docreq_id] =
				this.reportProcessWiseData[0][i]['req_doc'].indexOf(this.requiredDocData[k].docreq_id) !== -1 ? 'Yes' : 'No';
			}
			tempObj['total_document_required'] = this.reportProcessWiseData[1].length;
			let total_uploaded_document = 0;
			for (let k = 0; k < this.requiredDocData.length; k++) {
				if (tempObj['req_doc'] && (tempObj['req_doc']).indexOf(this.requiredDocData[k].docreq_id) !== -1) {
					total_uploaded_document++;
				}
			}
			tempObj['total_uploaded_document'] = total_uploaded_document;
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
		XLSX.writeFile(wb, 'DocumentsReport_' + (new Date).getTime() + '.xlsx');

	}

	print() {
		const printModal2 = document.getElementById('documentReportPrint');
		const popupWin = window.open('', '_blank', 'width=' + screen.width + ',height=' + screen.height);
		popupWin.document.open();
		popupWin.document.write('<html> <link rel="stylesheet" href="/assets/css/print.css">' +
		'<style>.tab-margin-button-bottom{display:none !important}</style>' +
			'<body onload="window.print()"> <div class="headingDiv"><center><h2>Student Document Report</h2></center></div>' +
			printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}


}
