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
	selector: 'app-skill-and-awards-report',
	templateUrl: './skill-and-awards-report.component.html',
	styleUrls: ['./skill-and-awards-report.component.scss']
})
export class SkillAndAwardsReportComponent implements OnInit, AfterViewInit {
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

	skillAwardsReportForm: FormGroup;
	activityArray: any[] = [];
	eventArray: any[] = [];
	levelOfIntrestArray: any[] = [];
	displayedColumns: string[] = [
		'counter',
		'class_name',
		'sec_name',
		'admission_no',
		'skill_name',
		'level_of_interest',
		'awards_name',
		'awards_event_level'
	];

	reportSkillAwardWiseData: any[] = [];
	constructor(private fbuild: FormBuilder, public sanitizer: DomSanitizer,
		private notif: CommonAPIService, private sisService: SisService,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit() {
		// this.userDataSource.sort = this.sort;
		this.buildForm();
		this.getActivity();
		this.getEventLevel();
		this.getLevelOfInterest();
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
			{ id: 'skill_name', name: 'Skill', field: 'skill_name', sortable: true, filterable: true },
			{ id: 'level_of_interest', name: 'Level of Interest', field: 'level_of_interest', sortable: true, filterable: true },
			{ id: 'awards_name', name: 'Awards', field: 'awards_name', sortable: true, filterable: true },
			{ id: 'awards_event_level', name: 'Level', field: 'awards_event_level', sortable: true, filterable: true },
		];
	}

	ngAfterViewInit() {
	}

	buildForm() {
		this.skillAwardsReportForm = this.fbuild.group({
			skill_id: '',
			award_id: '',
			award_event_id: '',
			loe_id: ''
		});
	}
	checkDateFormatter(row, cell, value, columnDef, dataContext) {
		if (value && value !== '-') {
			return new DatePipe('en-in').transform(value, 'd-MMM-y');
		} else {
			return '-';
		}
	}
	getActivity() {
		this.sisService.getActivity().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.activityArray = result.data;
			} else {
				this.notif.showSuccessErrorMessage(result.data, 'error');
			}
		});
	}

	getEventLevel() {
		this.sisService.getEventLevel().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.eventArray = result.data;
			} else {
				this.notif.showSuccessErrorMessage(result.data, 'error');
			}
		});
	}

	getLevelOfInterest() {
		this.sisService.getLevelOfInterest().subscribe((result: any) => {
			if (result) {
				this.levelOfIntrestArray = result.data;
			}
		});
	}

	resetGrid() {
		this.reportSkillAwardWiseData = [];
		this.dataset = [];
	}

	reset() {
		this.skillAwardsReportForm.reset();
		this.resetGrid();
	}

	submit() {
		this.resetGrid();
		const inputJson = {
			skill_id: this.skillAwardsReportForm.value.skill_id,
			award_id: this.skillAwardsReportForm.value.award_id,
			award_event_id: this.skillAwardsReportForm.value.award_event_id,
			loe_id: this.skillAwardsReportForm.value.loe_id
		};
		this.sisService.getSkillAwardsReportDetails(inputJson).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.reportSkillAwardWiseData = result.data;
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
		for (let i = 0; i < this.reportSkillAwardWiseData.length; i++) {
			const tempObj = {};
			tempObj['id'] = this.reportSkillAwardWiseData[i]['au_login_id'] + counter;
			tempObj['counter'] = counter;
			tempObj['class_name'] = this.reportSkillAwardWiseData[i]['sec_name'] ?
			this.reportSkillAwardWiseData[i]['class_name'] + '-' + this.reportSkillAwardWiseData[i]['sec_name'] :
			this.reportSkillAwardWiseData[i]['class_name'] ;
			tempObj['login_id'] = this.reportSkillAwardWiseData[i]['au_login_id'];
			tempObj['admission_no'] = this.valueAndDash(this.reportSkillAwardWiseData[i]['au_admission_no']);
			tempObj['full_name'] = this.valueAndDash(this.reportSkillAwardWiseData[i]['au_full_name']);
			tempObj['awards_event_level'] = this.valueAndDash(this.reportSkillAwardWiseData[i]['awards_event_level']);
			tempObj['awards_name'] = this.valueAndDash(this.reportSkillAwardWiseData[i]['awards_name']);
			tempObj['skill_name'] = this.valueAndDash(this.reportSkillAwardWiseData[i]['skill_name']);
			tempObj['level_of_interest'] = this.valueAndDash(this.reportSkillAwardWiseData[i]['loi_name']);

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
		XLSX.writeFile(wb, 'SkillAndAwardReport_' + (new Date).getTime() + '.xlsx');

	}

	print() {
		const printModal2 = document.getElementById('skillAwardReportPrint');
		const popupWin = window.open('', '_blank', 'width=' + screen.width + ',height=' + screen.height);
		popupWin.document.open();
		popupWin.document.write('<html> <link rel="stylesheet" href="/assets/css/print.css">' +
		'<style>.tab-margin-button-bottom{display:none !important}</style>' +
			'<body onload="window.print()"> <div class="headingDiv"><center><h2>Skills And Awards Report</h2></center></div>' +
			printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}


}
