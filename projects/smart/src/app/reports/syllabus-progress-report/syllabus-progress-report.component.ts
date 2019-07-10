import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';

@Component({
	templateUrl: './syllabus-progress-report.component.html',
	styleUrls: ['./syllabus-progress-report.component.css']
})
export class SyllabusProgressReportComponent implements OnInit {
	todaydate = new Date();
	progressReportForm: FormGroup;
	classArray: any[];
	subjectArray: any[];
	subCountArray: any[] = [];
	finalArray: any[];
	classwisetableArray: any[];
	periodCompletionArray: any[] = [];
	sectionArray: any[];
	finalSpannedArray: any[] = [];
	sessionArray: any[] = [];
	editRequestFlag = false;
	finalDivFlag = true;
	headerDivFlag = false;
	currentUser: any;
	seesion_id: any;
	sessionName: any;
	month: any;
	yeararray: any;
	year: any;
	constructor(
		public dialog: MatDialog,
		private fbuild: FormBuilder,
		private smartService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.seesion_id = JSON.parse(localStorage.getItem('session'));
	}
	buildForm() {
		this.progressReportForm = this.fbuild.group({
			sc_from: '',
			sc_to: '',
			syl_class_id: '',
			syl_section_id: '',
			syl_sub_id: ''
		});
	}

	ngOnInit() {
		this.buildForm();
		this.getClass();
		this.getSession();
		this.getSchool();
	}
	//  Get Class List function
	getClass() {
		this.finalSpannedArray = [];
		const classParam: any = {};
		classParam.role_id = this.currentUser.role_id;
		classParam.login_id = this.currentUser.login_id;
		this.sisService.getClass(classParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.classArray = result.data;
					}
				}
			);
		this.progressReportForm.patchValue({
			'syl_sub_id': ''
		});
	}
	// get section list according to selected class
	getSectionsByClass() {
		this.finalDivFlag = false;
		this.progressReportForm.patchValue({
			'syl_section_id': ''
		});
		const sectionParam: any = {};
		sectionParam.class_id = this.progressReportForm.value.syl_class_id;
		this.sisService.getSectionsByClass(sectionParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.sectionArray = result.data;
					} else {
						this.sectionArray = [];
					}
				}
			);
	}
	// get session name by session id
	getSession() {
		this.sisService.getSession()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						for (const citem of result.data) {
							this.sessionArray[citem.ses_id] = citem.ses_name;
						}
						this.sessionName = this.sessionArray[this.seesion_id.ses_id];
						this.yeararray = this.sessionName.split('-');
						this.year = this.yeararray[0];
					}
				});
	}
	getSchool() {
		this.sisService.getSchool()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.month = result.data[0].session_start_month;
					}
				});
	}

	fetchDetails() {
		const timetableparam: any = {};
		timetableparam.tt_class_id = this.progressReportForm.value.syl_class_id;
		timetableparam.tt_section_id = this.progressReportForm.value.syl_section_id;
		this.smartService.getTimeTableId(timetableparam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						if (result.data[0].tt_id !== '') {
							const dateParam: any = {};
							dateParam.datefrom = this.year + '-' + this.month + '-1';
							dateParam.dateto = this.commonService.dateConvertion(this.todaydate);
							dateParam.class_id = this.progressReportForm.value.syl_class_id;
							dateParam.td_tt_id = result.data[0].tt_id;
							dateParam.sec_id = this.progressReportForm.value.syl_section_id;
							this.smartService.cwSyllabusProgessReport(dateParam).subscribe((cwSyllabus_r: any) => {
								if (cwSyllabus_r && cwSyllabus_r.status === 'ok') {
									console.log(cwSyllabus_r.data);
									for (const citem of cwSyllabus_r.data) {
										this.periodCompletionArray[citem.cw_sub_id] = citem.cw_period_req;
									}
									console.log(this.periodCompletionArray);
								}
							});
							this.smartService.syllabusProgessReport(dateParam).subscribe((report_r: any) => {
								if (report_r && report_r.status === 'ok') {
									this.classwisetableArray = [];
									this.finalArray = [];
									Object.keys(report_r.data).forEach(key => {
										if (key !== '-') {
											this.classwisetableArray.push({
												sub_id: key,
												dataArr: report_r.data[key]
											});
										}
									});
									//console.log('shgsa', this.classwisetableArray);
									for (const item of this.classwisetableArray) {
										for (const titem of item.dataArr) {
											const findex = this.subCountArray.findIndex(f => f.subject_name === titem.subject_name);
											if (findex === -1) {
												if (titem.day !== '-') {
													this.subCountArray.push({
														'subject_id': titem.subject_id,
														'subject_name': titem.subject_name,
														'count': titem.count * titem.daycount,
														'day': titem.day,
													});
												}
											} else {
												this.subCountArray[findex].count = this.subCountArray[findex].count + titem.count * titem.daycount;

											}
											console.log('sssss', this.subCountArray);
										}

									}
								}
							});
						}
					} else {
						this.commonService.showSuccessErrorMessage('No Record Found', 'error');
					}
				});
	}

}

