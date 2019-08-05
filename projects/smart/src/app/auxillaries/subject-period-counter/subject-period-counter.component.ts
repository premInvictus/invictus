import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
import * as XLSX from 'xlsx';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';

@Component({
	selector: 'app-subject-period-counter',
	templateUrl: './subject-period-counter.component.html',
	styleUrls: ['./subject-period-counter.component.css']
})
export class SubjectPeriodCounterComponent implements OnInit {

	finalDivFlag = false;
	defaultFlag = true;
	toMin = new Date();
	subjectPeriodForm: FormGroup;
	classArray: any[];
	sectionArray: any[];
	subjectArray: any[];
	classwiseArray: any[] = [];
	classwisetableArray: any[] = [];
	daywisetableArray: any[] = [];
	periodWiseArray: any[] = [];
	subCountArray: any[] = [];
	weekCounterArray: any[] = [];
	subjectCountArray: any[] = [];
	finalCountArray: any[] = [];
	currentUser: any;
	session: any;
	toDate: any;
	fromDate: any;
	sum = 0;
	monday = 0;
	tuesday = 0;
	wednesday = 0;
	thursday = 0;
	friday = 0;
	saturday = 0;
	sunday = 0;
	overallTotal = 0;
	constructor(
		private fbuild: FormBuilder,
		private smartService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
	}
	ngOnInit() {
		this.buildForm();
	}
	buildForm() {
		this.subjectPeriodForm = this.fbuild.group({
			sc_from: '',
			sc_to: '',
			tt_class_id: '',
			tt_section_id: '',
			tt_subject_id: '',
		});
	}
	// set minimum date for from date
	setMinTo(event) {
		this.toMin = event.value;
	}
	//  Get Class List function
	getClass() {
		const classParam: any = {};
		classParam.role_id = this.currentUser.role_id;
		classParam.login_id = this.currentUser.login_id;
		this.sisService.getClass(classParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.classArray = result.data;

					} else {
						this.classArray = [];
					}
				}
			);
	}
	// get section list according to selected class
	getSectionsByClass() {
		this.finalCountArray = [];
		this.defaultFlag = true;
		this.finalDivFlag = false;
		this.subjectPeriodForm.patchValue({
			'tt_section_id': ''
		});
		const sectionParam: any = {};
		sectionParam.class_id = this.subjectPeriodForm.value.tt_class_id;
		this.sisService.getSectionsByClass(sectionParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.sectionArray = result.data;
						this.getSubjectsByClass();
					} else {
						this.sectionArray = [];
					}
				}
			);
	}
	// get subject list according to selected class
	getSubjectsByClass() {
		const subjectParam: any = {};
		subjectParam.class_id = this.subjectPeriodForm.value.tt_class_id;
		this.axiomService.getSubjectsByClass(subjectParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.subjectArray = result.data;
					} else {
						this.subjectArray = [];
					}
				}
			);
	}
	// get subject name from existing array
	getSubjectName(value) {
		const ctrIndex = this.subjectArray.findIndex(f => Number(f.sub_id) === Number(value));
		if (ctrIndex !== -1) {
			return this.subjectArray[ctrIndex].sub_name;
		}
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
	// export excel code
	exportAsExcel() {
		// tslint:disable-next-line:max-line-length
		const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('daywise_table')); // converts a DOM TABLE element to a worksheet
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
		XLSX.writeFile(wb, 'subject-period-counter_' + (new Date).getTime() + '.xlsx');

	}
	// pdf download
	pdfDownload() {
		const doc = new jsPDF('landscape');
		doc.autoTable({
			head: [['Period Wise Summary Of Class ' + this.getClassName(this.subjectPeriodForm.value.tt_class_id) + '-' +
				this.getSectionName(this.subjectPeriodForm.value.tt_section_id)]],
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
			html: '#periodwise_table',
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
		doc.autoTable({
			head: [['Day Wise Summary Of Class ' + this.getClassName(this.subjectPeriodForm.value.tt_class_id) + '-' +
				this.getSectionName(this.subjectPeriodForm.value.tt_section_id)]],
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
			html: '#daywise_table',
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
		doc.autoTable({
			head: [['Subject Wise Summary Of Class ' + this.getClassName(this.subjectPeriodForm.value.tt_class_id) + '-' +
				this.getSectionName(this.subjectPeriodForm.value.tt_section_id)]],
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
			html: '#subjectwise_table',
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
		doc.save('subject-period-counter_' + (new Date).getTime() + '.pdf');
	}
	// get sum of total count of subject in week
	getSum(dety, index, sub_id) {
		this.sum = 0;
		this.subjectCountArray = [];
		for (const titem of dety) {
			if (titem.day !== '-') {
				this.sum = this.sum + (Number(titem.count) * Number(this.weekCounterArray[titem.day]));
			}
		}
		const findex = this.subjectCountArray.findIndex(f => Number(f.id) === Number(index));
		if (findex === -1) {
			this.subjectCountArray.push({
				id: index,
				sub_name: sub_id,
				count: this.sum
			});
		}
		for (const citem of this.subjectCountArray) {
			this.finalCountArray[citem.sub_name] = citem.count;
		}
		return this.sum;
	}
	// get class wise details
	getclasswisedetails() {
		this.daywisetableArray = [];
		this.subCountArray = [];
		this.classwisetableArray = [];
		this.fromDate = this.commonService.dateConvertion(this.subjectPeriodForm.value.sc_from);
		this.toDate = this.commonService.dateConvertion(this.subjectPeriodForm.value.sc_to);
		if (this.fromDate === null) {
			this.commonService.showSuccessErrorMessage('Please Select from Date', 'error');
			return false;
		}
		const dateParam: any = {};
		dateParam.datefrom = this.fromDate;
		dateParam.dateto = this.toDate;
		dateParam.class_id = this.subjectPeriodForm.value.tt_class_id;
		this.smartService.GetHolidayDays(dateParam).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.periodWiseArray = result.data;
				this.weekCounterArray = result.data.weekcountArray;
			}
		});
		const timetableparam: any = {};
		timetableparam.tt_class_id = this.subjectPeriodForm.value.tt_class_id;
		timetableparam.tt_section_id = this.subjectPeriodForm.value.tt_section_id;
		this.smartService.getTimeTableId(timetableparam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.finalDivFlag = true;
						this.defaultFlag = false;
						const param: any = {};
						param.td_tt_id = result.data[0].tt_id;
						if (param.td_tt_id !== '') {
							this.smartService.getClasswiseDetails(param)
								.subscribe(
									(final_result: any) => {
										if (final_result && final_result.status === 'ok') {
											this.classwisetableArray = [];
											this.classwiseArray = [];
											this.classwiseArray = final_result.data;
											for (let i = 0; i < this.classwiseArray.length; i++) {
												this.classwisetableArray.push({
													'classwise': JSON.parse(this.classwiseArray[i].td_no_of_day)
												});
											}
											for (const item of this.classwisetableArray) {
												for (const titem of item.classwise) {
													const findex = this.subCountArray.findIndex(f => f.subject_name === titem.subject_name);
													if (findex === -1) {
														if (titem.subject_id !== '-') {
															this.subCountArray.push({
																'subject_name': titem.subject_name,
																'subject_id': titem.subject_id,
																'count': 1,
																'day': titem.day,
															});
														}
													} else {
														this.subCountArray[findex].count = this.subCountArray[findex].count + 1;

													}
												}
											}
											const periodCounter: any = {};
											periodCounter.td_tt_id = param.td_tt_id;
											periodCounter.class_id = this.subjectPeriodForm.value.tt_class_id;
											this.smartService.subjectPeriodCounter(periodCounter).subscribe((periodCounter_result: any) => {
												if (periodCounter_result && periodCounter_result.status === 'ok') {
													Object.keys(periodCounter_result.data).forEach(key => {
														if (key !== '-') {
															this.daywisetableArray.push({
																sub_id: key,
																dataArr: periodCounter_result.data[key]
															});
														}
													});
													for (const item of this.daywisetableArray) {
														for (const titem of item.dataArr) {
															if (titem.day !== '-') {
																this.overallTotal = this.overallTotal + (Number(titem.count) * Number(this.weekCounterArray[titem.day]));
															}
															if (titem.day === 'Monday') {
																this.monday = this.monday + (Number(titem.count) * Number(this.weekCounterArray[titem.day]));
															}
															if (titem.day === 'Tuesday') {
																this.tuesday = this.tuesday + (Number(titem.count) * Number(this.weekCounterArray[titem.day]));
															}
															if (titem.day === 'Wednesday') {
																this.wednesday = this.wednesday + (Number(titem.count) * Number(this.weekCounterArray[titem.day]));
															}
															if (titem.day === 'Thursday') {
																this.thursday = this.thursday + (Number(titem.count) * Number(this.weekCounterArray[titem.day]));
															}
															if (titem.day === 'Friday') {
																this.friday = this.friday + (Number(titem.count) * Number(this.weekCounterArray[titem.day]));
															}
															if (titem.day === 'Saturday') {
																this.saturday = this.saturday + (Number(titem.count) * Number(this.weekCounterArray[titem.day]));
															}
															if (titem.day === 'Sunday') {
																this.sunday = this.sunday + (Number(titem.count) * Number(this.weekCounterArray[titem.day]));
															}
														}
													}
												}
											});
										}
									});

						}
					} else {
						this.commonService.showSuccessErrorMessage('No Record Found', 'error');
					}
				});

	}
}
