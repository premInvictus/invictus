import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';

@Component({
	templateUrl: './syllabus-progress-report.component.html',
	styleUrls: ['./syllabus-progress-report.component.css']
})
export class SyllabusProgressReportComponent implements OnInit {
	@ViewChild('remarkModel') remarkModel;

	editRequestFlag = false;
	finalDivFlag = true;
	headerDivFlag = false;
	todaydate = new Date();
	progressReportForm: FormGroup;
	classArray: any[];
	subjectArray: any[];
	subCountArray: any[] = [];
	finalArray: any[];
	classwisetableArray: any[];
	periodCompletionArray: any[] = [];
	remarkArray: any[] = [];
	createdByArray: any[] = [];
	UserArray: any[] = [];
	sectionArray: any[];
	finalSpannedArray: any[] = [];
	sessionArray: any[] = [];
	currentUser: any;
	seesion_id: any;
	sessionName: any;
	startMonth: any;
	endMonth: any;
	yeararray: any;
	currentYear: any;
	nextYear: any;
	tt_id: any;
	totalCompletion = 0;
	totalAvailed = 0;
	totalAvailable = 0;
	remarkParam: any = {};
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
	// Add remark open modal function
	openRemarkModal(tt_id, sub_id) {
		this.remarkParam.tt_id = tt_id;
		this.remarkParam.sub_id = sub_id;
		this.remarkParam.type = 'add';
		this.remarkModel.openRemarkModal(this.remarkParam);
	}
	// edit remark open modal function
	editRemarkModal(tt_id, sub_id) {
		this.remarkParam.tt_id = tt_id;
		this.remarkParam.sub_id = sub_id;
		this.remarkParam.type = 'edit';
		this.remarkModel.openRemarkModal(this.remarkParam);
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
		this.getUserName();
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
	// get Class name from existing array
	getClassName(value) {
		const classIndex = this.classArray.findIndex(f => Number(f.class_id) === Number(value));
		if (classIndex !== -1) {
			return this.classArray[classIndex].class_name;
		}
	}
	// get section from existing array
	getSectionName(value) {
		const sectionIndex = this.sectionArray.findIndex(f => Number(f.sec_id) === Number(value));
		if (sectionIndex !== -1) {
			return this.sectionArray[sectionIndex].sec_name;
		}
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
						this.currentYear = this.yeararray[0];
						this.nextYear = this.yeararray[1];
					}
				});
	}
	// get end month and start month of school
	getSchool() {
		this.sisService.getSchool()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.startMonth = result.data[0].session_start_month;
						this.endMonth = result.data[0].session_end_month;
					}
				});
	}
	// export excel code
	exportAsExcel() {
		// tslint:disable-next-line:max-line-length
		const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('report_table')); // converts a DOM TABLE element to a worksheet
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
		XLSX.writeFile(wb, 'Report_' + (new Date).getTime() + '.xlsx');

	}
	// pdf download
	pdfDownload() {
		const doc = new jsPDF('landscape');
		doc.autoTable({
			head: [['Syllabus Progress Report of ' + this.getClassName(this.progressReportForm.value.syl_class_id) + '-' +
				this.getSectionName(this.progressReportForm.value.syl_section_id)]],
			didDrawPage: function (data) {
				doc.setFont('Roboto');
			},
			headerStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 15,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.autoTable({
			html: '#report_table',
			headerStyles: {
				fontStyle: 'normal',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 14,
			},
			useCss: true,
			styles: {
				fontSize: 14,
				cellWidth: 'auto',
				textColor: 'black',
				lineColor: 'red',
			},
			theme: 'grid'
		});
		doc.save('table.pdf');
	}

	// get user name and login id
	getUserName() {
		this.smartService.getUserName()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						for (const citem of result.data) {
							this.UserArray[citem.au_login_id] = citem.au_full_name;
						}
					}
				});
	}
	// delete remark entry from database
	deleteremark($event) {
		if ($event) {
			const param: any = {};
			param.rm_tt_id = $event.tt_id;
			param.rm_subject_id = $event.sub_id;
			this.smartService.deleteProgressReportRemarks(param)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.fetchDetails();
							this.commonService.showSuccessErrorMessage('Remark deleted Successfully', 'success');
						}
					});
		}
	}
	// get background color according to value range
	getcolor(value) {
		if (Number(value) === 0) {
			return '#ffffff';
		} else if (Number(value) > 0) {
			return '#28a7456b';
		} else {
			return '#dc3545a6';
		}
	}
	// add remarks to database
	addremark($event) {
		if ($event) {
			const param: any = {};
			param.rm_tt_id = $event.tt_id;
			param.rm_subject_id = $event.sub_id;
			param.rm_remark = $event.remark;
			param.rm_created_by = this.currentUser.login_id;
			this.smartService.getProgressReportRemarks(param).subscribe((remark_r: any) => {
				if (remark_r && remark_r.status === 'ok') {
					this.smartService.updateProgressReportRemarks(param)
						.subscribe(
							(result: any) => {
								if (result && result.status === 'ok') {
									this.fetchDetails();
									this.commonService.showSuccessErrorMessage('Remark Updated Successfully', 'success');
								}
							});
				} else {
					this.smartService.insertProgressReportRemarks(param)
						.subscribe(
							(result: any) => {
								if (result && result.status === 'ok') {
									this.fetchDetails();
									this.commonService.showSuccessErrorMessage('Remark added Successfully', 'success');
								}
							});
				}

			});

		}
	}
	// fetch details for table 
	fetchDetails() {
		this.totalAvailable = 0;
		this.totalCompletion = 0;
		this.totalAvailed = 0;
		this.headerDivFlag = true;
		this.finalDivFlag = false;
		this.subCountArray = [];
		this.remarkArray = [];
		this.createdByArray = [];
		this.periodCompletionArray = [];
		const timetableparam: any = {};
		timetableparam.tt_class_id = this.progressReportForm.value.syl_class_id;
		timetableparam.tt_section_id = this.progressReportForm.value.syl_section_id;
		this.smartService.getTimeTableId(timetableparam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.tt_id = result.data[0].tt_id;
						if (result.data[0].tt_id !== '') {
							const param: any = {};
							param.rm_tt_id = this.tt_id;
							this.smartService.getProgressReportRemarks(param).subscribe((remark_r: any) => {
								if (remark_r && remark_r.status === 'ok') {
									for (const citem of remark_r.data) {
										this.remarkArray[citem.rm_subject_id] = citem.rm_remark;
										this.createdByArray[citem.rm_subject_id] = citem.rm_created_by;
									}
								}
							});
							const dateParam: any = {};
							dateParam.datefrom = this.currentYear + '-' + this.startMonth + '-1';
							dateParam.dateyear = this.nextYear + '-' + this.endMonth + '-31';
							dateParam.dateto = this.commonService.dateConvertion(this.todaydate);
							dateParam.class_id = this.progressReportForm.value.syl_class_id;
							dateParam.td_tt_id = result.data[0].tt_id;
							dateParam.sec_id = this.progressReportForm.value.syl_section_id;
							this.smartService.cwSyllabusProgessReport(dateParam).subscribe((cwSyllabus_r: any) => {
								if (cwSyllabus_r && cwSyllabus_r.status === 'ok') {
									for (const citem of cwSyllabus_r.data) {
										this.totalAvailed = this.totalAvailed + Number(citem.cw_period_req);
										this.periodCompletionArray[citem.cw_sub_id] = citem.cw_period_req;
									}
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
									for (const item of this.classwisetableArray) {
										for (const titem of item.dataArr) {
											const findex = this.subCountArray.findIndex(f => f.subject_name === titem.subject_name);
											if (findex === -1) {
												if (titem.day !== '-') {
													this.totalCompletion = this.totalCompletion + titem.count * titem.daycount;
													this.totalAvailable = this.totalAvailable + titem.count * titem.daycountYear;
													this.subCountArray.push({
														'subject_id': titem.subject_id,
														'subject_name': titem.subject_name,
														'count': titem.count * titem.daycount,
														'countYear': titem.count * titem.daycountYear,
													});
												}
											} else {
												this.subCountArray[findex].count = this.subCountArray[findex].count + titem.count * titem.daycount;
												this.subCountArray[findex].countYear = this.subCountArray[findex].countYear + titem.count * titem.daycountYear;
												this.totalCompletion = this.totalCompletion + titem.count * titem.daycount;
												this.totalAvailable = this.totalAvailable + titem.count * titem.daycountYear;
											}
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

