import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-comparitive',
	templateUrl: './comparitive.component.html',
	styleUrls: ['./comparitive.component.css']
})
export class ComparitiveComponent implements OnInit {

	toMin = new Date();
	editRequestFlag = false;
	finalDivFlag = true;
	headerDivFlag = false;
	comparitiveForm: FormGroup;
	classArray: any[];
	subjectArray: any[];
	finalSyllabusArray: any[];
	topicArray: any[];
	subtopicArray: any[];
	sectionArray: any[];
	finalSpannedArray: any[] = [];
	sessionArray: any[] = [];
	param: any = {};
	publishParam: any = {};
	editParam: any = {};
	processType: any = {};
	syl_id: any;
	currentUser: any;
	seesion_id: any;
	toDate: any;
	fromDate: any;
	constructor(
		public dialog: MatDialog,
		private fbuild: FormBuilder,
		private syllabusService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.seesion_id = JSON.parse(localStorage.getItem('session'));
	}
	buildForm() {
		this.comparitiveForm = this.fbuild.group({
			sc_from: '',
			sc_to: '',
			syl_class_id: '',
			syl_section_id:'',
			syl_sub_id: ''
		});
	}

	ngOnInit() {
		this.buildForm();
		this.getClass();
		this.getSession();
	}
	// set minimum date for from date
	setMinTo(event) {
		this.toMin = event.value;
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
		this.comparitiveForm.patchValue({
			'syl_sub_id': ''
		});
	}
		// get section list according to selected class
		getSectionsByClass() {
			this.comparitiveForm.patchValue({
				'syl_section_id': '',
				'syl_sub_id': ''
			});
			const sectionParam: any = {};
			sectionParam.class_id = this.comparitiveForm.value.syl_class_id;
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
	//  Get Subject By Class function
	getSubjectsByClass(): void {
		this.finalSpannedArray = [];
		this.finalDivFlag = true;
		const subjectParam: any = {};
		subjectParam.class_id = this.comparitiveForm.value.syl_class_id;
		this.axiomService.getSubjectsByClass(subjectParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.subjectArray = result.data;
					} else {
						this.subjectArray = [];
						this.commonService.showSuccessErrorMessage('No Record Found', 'error');
					}
				}
			);
	}

	//  Get Topic List function
	getTopicByClassSubject() {
		this.axiomService.getTopicByClassSubject(this.comparitiveForm.value.syl_class_id, this.comparitiveForm.value.syl_sub_id)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.topicArray = result.data;
					} else {
						this.topicArray = [];
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
	// get session year of the selected session
	getSession() {
		this.sisService.getSession()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						for (const citem of result.data) {
							this.sessionArray[citem.ses_id] = citem.ses_name;
						}
					}
				});
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
	// fetch syllabus details for table
	fetchSyllabusDetails() {
		this.finalDivFlag = false;
		this.headerDivFlag = true;
		const param: any = {};
		param.datefrom = this.commonService.dateConvertion(this.comparitiveForm.value.sc_from);
		param.class_id = this.comparitiveForm.value.syl_class_id;
		param.sec_id = this.comparitiveForm.value.syl_section_id;
		param.subject_id = this.comparitiveForm.value.syl_sub_id;
		this.syllabusService.getComparativeDetails(param)
			.subscribe(
				(result1: any) => {
					if (result1 && result1.status === 'ok') {
						this.finalSyllabusArray = result1.data;
						for (let i = 0; i < this.finalSyllabusArray.length; i++) {
							let sd_period_teacher: any = '';
							let sd_period_test: any = '';
							let sd_period_revision: any = '';
							let cw_period_teacher: any = '';
							let cw_period_test: any = '';
							let cw_period_revision: any = '';
							if (this.finalSyllabusArray[i].sd_ctr_id === '1') {
								sd_period_teacher = this.finalSyllabusArray[i].sd_period_req;
								cw_period_teacher = this.finalSyllabusArray[i].cw_period_req;
							} else if (this.finalSyllabusArray[i].sd_ctr_id === '2') {
								sd_period_test = this.finalSyllabusArray[i].sd_period_req;
								cw_period_test = this.finalSyllabusArray[i].cw_period_req;
							} else {
								sd_period_revision = this.finalSyllabusArray[i].sd_period_req;
								cw_period_revision = this.finalSyllabusArray[i].cw_period_req;
							}
							const spannArray: any[] = [];
							spannArray.push({
								sd_topic_id: this.finalSyllabusArray[i].sd_topic_id,
								sd_st_id: this.finalSyllabusArray[i].sd_st_id,
								sd_period_req: this.finalSyllabusArray[i].sd_period_req,
								sd_period_teacher: sd_period_teacher,
								sd_period_test: sd_period_test,
								sd_period_revision: sd_period_revision,
								cw_period_teacher: cw_period_teacher,
								cw_period_test: cw_period_test,
								cw_period_revision: cw_period_revision,
								sd_ctr_id: this.finalSyllabusArray[i].sd_ctr_id,
								sd_desc: this.finalSyllabusArray[i].sd_desc,
								sd_topic_name: this.finalSyllabusArray[i].topic_name,
								sd_st_name: this.finalSyllabusArray[i].st_name,
								sd_id: this.finalSyllabusArray[i].sd_id,
							});
							for (let j = i + 1; j < this.finalSyllabusArray.length; j++) {
								let sd_period_teacher1: any = '';
								let sd_period_test1: any = '';
								let sd_period_revision1: any = '';
								let cw_period_teacher1: any = '';
								let cw_period_test1: any = '';
								let cw_period_revision1: any = '';
								if (this.finalSyllabusArray[i].sd_topic_id === this.finalSyllabusArray[j].sd_topic_id) {
									if (this.finalSyllabusArray[j].sd_ctr_id === '1') {
										sd_period_teacher1 = this.finalSyllabusArray[j].sd_period_req;
										cw_period_teacher1 = this.finalSyllabusArray[j].cw_period_req;
									} else if (this.finalSyllabusArray[j].sd_ctr_id === '2') {
										sd_period_test1 = this.finalSyllabusArray[j].sd_period_req;
										cw_period_test1 = this.finalSyllabusArray[j].cw_period_req;
									} else {
										sd_period_revision1 = this.finalSyllabusArray[j].sd_period_req;
										cw_period_revision1 = this.finalSyllabusArray[j].cw_period_req;
									}
									spannArray.push({
										sd_topic_id: this.finalSyllabusArray[i].sd_topic_id,
										sd_st_id: this.finalSyllabusArray[j].sd_st_id,
										sd_period_req: this.finalSyllabusArray[j].sd_period_req,
										sd_period_teacher: sd_period_teacher1,
										sd_period_test: sd_period_test1,
										sd_period_revision: sd_period_revision1,
										sd_ctr_id: this.finalSyllabusArray[j].sd_ctr_id,
										cw_period_teacher: cw_period_teacher1,
										cw_period_test: cw_period_test1,
										cw_period_revision: cw_period_revision1,
										sd_desc: this.finalSyllabusArray[j].sd_desc,
										sd_topic_name: this.finalSyllabusArray[j].topic_name,
										sd_st_name: this.finalSyllabusArray[j].st_name,
										sd_id: this.finalSyllabusArray[j].sd_id,
									});
								}
							}
							const findex = this.finalSpannedArray.findIndex(f => f.sd_topic_id === this.finalSyllabusArray[i].sd_topic_id);
							if (findex === -1) {
								this.finalSpannedArray.push({
									sd_topic_id: this.finalSyllabusArray[i].sd_topic_id,
									details: spannArray,
									total: this.finalSyllabusArray[i].sd_period_req,
									total1: this.finalSyllabusArray[i].cw_period_req,
								});
							} else {
								// tslint:disable-next-line: max-line-length
								this.finalSpannedArray[findex].total = Number(this.finalSpannedArray[findex].total) + Number(this.finalSyllabusArray[i].sd_period_req);
								// tslint:disable-next-line: max-line-length
								this.finalSpannedArray[findex].total1 = Number(this.finalSpannedArray[findex].total1) + Number(this.finalSyllabusArray[i].cw_period_req);
							}
						}

					} else {
						this.finalSpannedArray = [];
						this.finalDivFlag = true;
						this.commonService.showSuccessErrorMessage('No Record Found', 'error');
					}
				});

	}



}
