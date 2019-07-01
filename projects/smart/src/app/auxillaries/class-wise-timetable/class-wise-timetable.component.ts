import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';

@Component({
	selector: 'app-class-wise-timetable',
	templateUrl: './class-wise-timetable.component.html',
	styleUrls: ['./class-wise-timetable.component.css']
})
export class ClassWiseTimetableComponent implements OnInit {
	periodSup = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
	subjectwiseFlag = false;
	public classArray: any[];
	public sectionArray: any[];
	public subjectArray: any[];
	classwiseArray: any[] = [];
	classwisetableArray: any[] = [];
	subCountArray: any[] = [];
	finalCountArray: any[] = [];
	classwiseForm: FormGroup;
	currentUser: any;
	session: any;
	noOfDay: any;
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
		this.getClass();
	}
	buildForm() {
		this.classwiseForm = this.fbuild.group({
			tt_class_id: '',
			tt_section_id: '',
			tt_subject_id: '',
		});
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
						this.subjectwiseFlag = false;
					}
				}
			);
		this.classwiseForm.patchValue({
			'tt_section_id': ''
		});
		this.classwisetableArray = [];
		this.subCountArray = [];
		this.finalCountArray = [];
	}

	// get section list according to selected class
	getSectionsByClass() {
		const sectionParam: any = {};
		sectionParam.class_id = this.classwiseForm.value.tt_class_id;
		this.sisService.getSectionsByClass(sectionParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.sectionArray = result.data;
						this.subjectwiseFlag = true;
						this.subCountArray = [];
						this.finalCountArray = [];
						this.classwisetableArray = [];
						this.getSubjectsByClass();
					}
				}
			);
	}

	// get subject list according to selected class
	getSubjectsByClass() {
		const subjectParam: any = {};
		subjectParam.class_id = this.classwiseForm.value.tt_class_id;
		this.axiomService.getSubjectsByClass(subjectParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.subjectArray = result.data;
						console.log(this.subjectArray);
					}
				}
			);
	}

	// Timetable details based on class and section
	getclasswisedetails() {
		this.subCountArray = [];
		this.finalCountArray = [];
		this.classwisetableArray = [];
		const timetableparam: any = {};
		timetableparam.tt_class_id = this.classwiseForm.value.tt_class_id;
		timetableparam.tt_section_id = this.classwiseForm.value.tt_section_id;
		this.smartService.getTimeTableId(timetableparam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.noOfDay = result.data[0].no_of_day;
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
											console.log(this.classwisetableArray);
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
											for (const citem of this.subCountArray) {
												this.finalCountArray[citem.subject_name] = citem.count;
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
