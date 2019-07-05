import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
@Component({
	selector: 'app-subject-period-counter',
	templateUrl: './subject-period-counter.component.html',
	styleUrls: ['./subject-period-counter.component.css']
})
export class SubjectPeriodCounterComponent implements OnInit {

	toMin = new Date();
	subjectPeriodForm: FormGroup;
	classArray: any[];
	sectionArray: any[];
	subjectArray: any[];
	classwiseArray: any[] = [];
	classwisetableArray: any[] = [];
	subCountArray: any[] = [];
	currentUser: any;
	session: any;
	toDate: any;
	fromDate: any;
	week: any;
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
	getclasswisedetails() {
		this.subCountArray = [];
		this.classwisetableArray = [];
		this.fromDate = this.commonService.dateConvertion(this.subjectPeriodForm.value.sc_from);
		this.toDate = this.commonService.dateConvertion(this.subjectPeriodForm.value.sc_to);
		console.log(this.toDate);
		if (this.fromDate === null) {
			this.commonService.showSuccessErrorMessage('Please Select from Date', 'error');
			return false;
		}
		const dateParam: any = {};
		dateParam.datefrom = this.fromDate;
		dateParam.dateto = this.toDate;
		this.smartService.datediffInWeeks(dateParam).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.week = result.data;
			}
		});
		const timetableparam: any = {};
		timetableparam.tt_class_id = this.subjectPeriodForm.value.tt_class_id;
		timetableparam.tt_section_id = this.subjectPeriodForm.value.tt_section_id;
		this.smartService.getTimeTableId(timetableparam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
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
														this.subCountArray.push({
															'subject_name': titem.subject_name,
															'count': 1,
														});
													} else {
														this.subCountArray[findex].count = this.subCountArray[findex].count + 1;

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
