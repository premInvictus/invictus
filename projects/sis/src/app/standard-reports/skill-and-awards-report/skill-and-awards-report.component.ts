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
	selector: 'app-skill-and-awards-report',
	templateUrl: './skill-and-awards-report.component.html',
	styleUrls: ['./skill-and-awards-report.component.scss']
})
export class SkillAndAwardsReportComponent implements OnInit, AfterViewInit {

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
	REPORT_SKILL_AWARD_WISE_ELEMENT_DATA: any[] = [];
	userDataSource = new MatTableDataSource<Element>(this.REPORT_SKILL_AWARD_WISE_ELEMENT_DATA);
	@ViewChild(MatSort) sort: MatSort;
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
	}

	ngAfterViewInit() {
		this.userDataSource.sort = this.sort;
	}

	buildForm() {
		this.skillAwardsReportForm = this.fbuild.group({
			skill_id: '',
			award_id: '',
			award_event_id: '',
			loe_id: ''
		});
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
		this.REPORT_SKILL_AWARD_WISE_ELEMENT_DATA = [];
		this.userDataSource = new MatTableDataSource(this.REPORT_SKILL_AWARD_WISE_ELEMENT_DATA);
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
			} else {
				this.notif.showSuccessErrorMessage(result.data, 'error');
				this.resetGrid();
			}
		});
	}



	prepareDataSource() {
		this.userDataSource = new MatTableDataSource<Element>(this.REPORT_SKILL_AWARD_WISE_ELEMENT_DATA);
		let counter = 1;
		const total = 0;
		for (let i = 0; i < this.reportSkillAwardWiseData.length; i++) {
			const tempObj = {};
			tempObj['counter'] = counter;
			tempObj['class_name'] = this.reportSkillAwardWiseData[i]['class_name'];
			tempObj['sec_name'] = this.reportSkillAwardWiseData[i]['sec_name'];
			tempObj['login_id'] = this.reportSkillAwardWiseData[i]['au_login_id'];
			tempObj['admission_no'] = this.reportSkillAwardWiseData[i]['au_admission_no'];
			tempObj['awards_event_level'] = this.reportSkillAwardWiseData[i]['awards_event_level'];
			tempObj['awards_name'] = this.reportSkillAwardWiseData[i]['awards_name'];
			tempObj['skill_name'] = this.reportSkillAwardWiseData[i]['skill_name'];
			tempObj['level_of_interest'] = this.reportSkillAwardWiseData[i]['loi_name'];

			this.REPORT_SKILL_AWARD_WISE_ELEMENT_DATA.push(tempObj);
			counter++;
		}

		// const blankTempObj = {};
		//   blankTempObj['counter'] = '';
		//   blankTempObj['class_name'] = '';
		//   blankTempObj['Boys'] = '';
		//   blankTempObj['Girls'] = '';
		//   blankTempObj['Other'] = '';
		//   blankTempObj['Total'] = '<b>'+ total +'</b>';
		//   this.REPORT_SKILL_AWARD_WISE_ELEMENT_DATA.push(blankTempObj);
		this.userDataSource = new MatTableDataSource(this.REPORT_SKILL_AWARD_WISE_ELEMENT_DATA);
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
