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
	selector: 'app-withdrawal-report',
	templateUrl: './withdrawal-report.component.html',
	styleUrls: ['./withdrawal-report.component.scss']
})
export class WithdrawalReportComponent implements OnInit, AfterViewInit {
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


	admissionReportForm: FormGroup;

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
			addNewRowCssClass: 'row-border',
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
			{ id: 'class_name', name: 'Class', field: 'class_name', sortable: true, filterable: true },
			{ id: 'Boys', name: 'Boys', field: 'Boys', sortable: true, filterable: true },
			{ id: 'Girls', name: 'Girls', field: 'Girls', sortable: true, filterable: true },
			{ id: 'Other', name: 'Other', field: 'Other', sortable: true, filterable: true },
			{ id: 'Total', name: 'Total', field: 'Total', sortable: true, filterable: true },
		];
	}

	ngAfterViewInit() {
	}

	buildForm() {
		this.admissionReportForm = this.fbuild.group({
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
		inputJson['enrollment_type'] = '5';
		if (this.showDate) {
			inputJson['from_date'] = this.notif.dateConvertion(this.admissionReportForm.value.cdate, 'yyyy-MM-dd');
		} else {
			inputJson['from_date'] = this.notif.dateConvertion(this.admissionReportForm.value.fdate, 'yyyy-MM-dd');
			inputJson['to_date'] = this.notif.dateConvertion(this.admissionReportForm.value.tdate, 'yyyy-MM-dd');
		}

		const validateFlag = this.checkValidation();
		if (validateFlag) {
			this.sisService.generateReportProcessWise(inputJson).subscribe((result: any) => {
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
			if (!this.admissionReportForm.value.cdate) {
				this.notif.showSuccessErrorMessage('Please Choose Date', 'error');
			} else {
				validateFlag = 1;
			}
		} else {
			if (!this.admissionReportForm.value.fdate) {
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
		let counter = 1;
		let total = 0;
		for (let i = 0; i < this.reportProcessWiseData.length; i++) {
			const tempObj = {};
			tempObj['id'] = counter;
			tempObj['counter'] = counter;
			tempObj['class_name'] = this.reportProcessWiseData[i]['class_name'];
			tempObj['Boys'] = this.reportProcessWiseData[i]['Boys'];
			tempObj['Girls'] = this.reportProcessWiseData[i]['Girls'];
			tempObj['Other'] = this.reportProcessWiseData[i]['Other'];
			tempObj['Total'] = this.reportProcessWiseData[i]['Total'];
			total = total + this.reportProcessWiseData[i]['Total'];
			this.dataset.push(tempObj);
			counter++;
		}

		const blankTempObj = {};
		blankTempObj['id'] = counter;
		blankTempObj['counter'] = 'Total';
		blankTempObj['class_name'] = '';
		blankTempObj['Boys'] = '';
		blankTempObj['Girls'] = '';
		blankTempObj['Other'] = '';
		blankTempObj['Total'] = this.dataset.map(t => t.Total).reduce((acc, val) => acc + val);
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


	exportAsExcel() {
		const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement); // converts a DOM TABLE element to a worksheet
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

		/* save to file */
		XLSX.writeFile(wb, 'WithdrawalReport_' + (new Date).getTime() + '.xlsx');

	}

	print() {
		const printModal2 = document.getElementById('withdrawalReportPrint');
		const popupWin = window.open('', '_blank', 'width=' + screen.width + ',height=' + screen.height);
		popupWin.document.open();
		popupWin.document.write('<html> <link rel="stylesheet" href=".//assets/css/print.css">' +
		'<style>.tab-margin-button-bottom{display:none !important}</style>' +
			'<body onload="window.print()"> <div class="headingDiv"><center><h2>Withdrawal Report</h2></center></div>' +
			printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}


}
