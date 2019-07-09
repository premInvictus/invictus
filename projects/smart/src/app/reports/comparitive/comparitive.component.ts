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
	comparitiveForm: FormGroup;
	public classArray: any[];
	public subjectArray: any[];
	public finalSyllabusArray: any[];
	public topicArray: any[];
	public subtopicArray: any[];
	finalSpannedArray: any[] = [];
	editRequestFlag = false;
	finalDivFlag = true;
	param: any = {};
	publishParam: any = {};
	editParam: any = {};
	processType: any = {};
	syl_id: any;
	currentUser: any;
	constructor(
		public dialog: MatDialog,
		private fbuild: FormBuilder,
		private syllabusService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}
	buildForm() {
		this.comparitiveForm = this.fbuild.group({
			syl_class_id: '',
			syl_sub_id: ''
		});
	}

	ngOnInit() {
		this.buildForm();
		this.getClass();
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

	//  Get Subject By Class function
	getSubjectsByClass(): void {
		this.finalSpannedArray = [];
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

	//  Get Topic Name from existion Array for details table
	getTopicName(value) {
		const topIndex = this.topicArray.findIndex(f => Number(f.topic_id) === Number(value));
		if (topIndex !== -1) {
			return this.topicArray[topIndex].topic_name;
		}
	}

	//  Get Sub Topic Name
	getSubTopicName(value): void {
		this.axiomService.getSubtopicByTopic(value)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						return result.data.st_name;
					}
				});
	}
	// fetch syllabus details for table
	fetchSyllabusDetails() {
		this.finalDivFlag = false;
		this.syllabusService.getSylIdByClassSubject(this.comparitiveForm.value.syl_class_id, this.comparitiveForm.value.syl_sub_id)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.getTopicByClassSubject();
						const param: any = {};
						param.syl_id = result.data[0].syl_id;
						param.sd_status = 0;
						if (param.syl_id !== '') {
							this.syllabusService.getSyllabusDetails(param)
								.subscribe(
									(result1: any) => {
										if (result1 && result1.status === 'ok') {
											this.finalSyllabusArray = result1.data;
											if (!this.editRequestFlag) {
												this.finalSpannedArray = [];
											}
											for (let i = 0; i < this.finalSyllabusArray.length; i++) {
												let sd_period_teacher: any = '';
												let sd_period_test: any = '';
												let sd_period_revision: any = '';

												if (this.finalSyllabusArray[i].sd_ctr_id === '1') {
													sd_period_teacher = this.finalSyllabusArray[i].sd_period_req;
												} else if (this.finalSyllabusArray[i].sd_ctr_id === '2') {
													sd_period_test = this.finalSyllabusArray[i].sd_period_req;
												} else {
													sd_period_revision = this.finalSyllabusArray[i].sd_period_req;
												}
												const spannArray: any[] = [];
												spannArray.push({
													sd_topic_id: this.finalSyllabusArray[i].sd_topic_id,
													sd_st_id: this.finalSyllabusArray[i].sd_st_id,
													sd_period_req: this.finalSyllabusArray[i].sd_period_req,
													sd_period_teacher: sd_period_teacher,
													sd_period_test: sd_period_test,
													sd_period_revision: sd_period_revision,
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
													if (this.finalSyllabusArray[i].sd_topic_id === this.finalSyllabusArray[j].sd_topic_id) {
														if (this.finalSyllabusArray[j].sd_ctr_id === '1') {
															sd_period_teacher1 = this.finalSyllabusArray[j].sd_period_req;
														} else if (this.finalSyllabusArray[j].sd_ctr_id === '2') {
															sd_period_test1 = this.finalSyllabusArray[j].sd_period_req;
														} else {
															sd_period_revision1 = this.finalSyllabusArray[j].sd_period_req;
														}
														spannArray.push({
															sd_topic_id: this.finalSyllabusArray[i].sd_topic_id,
															sd_st_id: this.finalSyllabusArray[j].sd_st_id,
															sd_period_req: this.finalSyllabusArray[j].sd_period_req,
															sd_period_teacher: sd_period_teacher1,
															sd_period_test: sd_period_test1,
															sd_period_revision: sd_period_revision1,
															sd_ctr_id: this.finalSyllabusArray[j].sd_ctr_id,
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
														syl_id: param.syl_id
													});
												} else {
													// tslint:disable-next-line: max-line-length
													this.finalSpannedArray[findex].total = Number(this.finalSpannedArray[findex].total) + Number(this.finalSyllabusArray[i].sd_period_req);
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
				}
			);

	}

}
