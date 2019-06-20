import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService } from '../../_services';
import { SyllabusserviceService } from './../syllabusservice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-browse-syllabus',
	templateUrl: './browse-syllabus.component.html',
	styleUrls: ['./browse-syllabus.component.css']
})
export class BrowseSyllabusComponent implements OnInit {
	@ViewChild('UnpublishModal') UnpublishModal;
	public classArray: any[];
	public subjectArray: any[];
	public finalSyllabusArray: any[];
	finalSpannedArray: any[] = [];
	public topicArray: any[];
	syl_id: any;
	sd_status: any;
	public reviewform: FormGroup;
	editRequestFlag = false;
	finaldivflag = true;
	param: any = {};
	currentUser: any;
	UnpublishParam: any = {};
	constructor(
		public dialog: MatDialog,
		private fbuild: FormBuilder,
		private syllabusservice: SyllabusserviceService,
		public common: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}
	buildForm() {
		this.reviewform = this.fbuild.group({
			syl_class_id: '',
			syl_sub_id: ''
		});
	}
	ngOnInit() {
		this.buildForm();
		this.getClass();
	}

	openunPublish(syl_id, topic_id) {
		this.UnpublishParam.syl_id = syl_id;
		this.UnpublishParam.topic_id = topic_id;
		this.UnpublishModal.openunpublishModal(this.UnpublishParam);
	}
	getClass() {
		this.finalSpannedArray = [];
		this.syllabusservice.getClass()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.classArray = result.data;
					}
				}
			);
		this.reviewform.patchValue({
			'syl_sub_id': ''
		});
	}
	getSubjectsByClass(): void {
		this.finalSpannedArray = [];
		this.syllabusservice.getSubjectsByClass(this.reviewform.value.syl_class_id)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.subjectArray = result.data;
					} else {
						this.subjectArray = [];
						this.common.showSuccessErrorMessage('No Record Found', 'error');
					}
				}
			);
	}
	getTopicByClassSubject() {
		this.axiomService.getTopicByClassSubject(this.reviewform.value.syl_class_id, this.reviewform.value.syl_sub_id)
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
	getTopicName(value) {
		for (const item of this.topicArray) {
			if (item.topic_id === value) {
				return item.topic_name;
			}
		}
	}
	getSubTopicName(value): void {
		this.axiomService.getSubtopicByTopic(value)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						return result.data.st_name;
					}
				});
	}
	unpublishSyllabus($event) {
		if ($event) {
			const param2: any = {};
			param2.sd_syl_id = this.UnpublishParam.syl_id;
			param2.sd_topic_id = this.UnpublishParam.topic_id;
			param2.sd_unpublish_reason_id = this.UnpublishParam.req_reason;
			param2.sd_unpublish_remark = this.UnpublishParam.req_reason_text;
			param2.sd_unpublish_by_user_id = this.currentUser.login_id;
			param2.sd_status = '0';
			this.syllabusservice.updatePublishStatus(param2)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							const param: any = {};
							param.mod_review_row_id = param2.sd_syl_id + '-' + param2.sd_topic_id;
							param.mod_review_by = this.currentUser.login_id;
							param.mod_review_remark = param2.sd_unpublish_remark;
							param.mod_review_reason_id = param2.sd_unpublish_reason_id;
							param.mod_review_status = '2';
							param.mod_title = '1';
							this.syllabusservice.insertPublishSyllabus(param)
								.subscribe(
									(result: any) => {
										if (result && result.status === 'ok') {
											this.fetchSyllabusDetails();
											this.common.showSuccessErrorMessage('Syllabus Unpublish Successfully', 'success');
										}
									});
						}
					});
		}
	}
	fetchSyllabusDetails() {
		this.finaldivflag = false;
		this.syllabusservice.getSylIdByClassSubject(this.reviewform.value.syl_class_id, this.reviewform.value.syl_sub_id)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.getTopicByClassSubject();
						const param: any = {};
						param.syl_id = result.data[0].syl_id;
						param.sd_status = 1;
						if (param.syl_id !== '') {
							this.syllabusservice.getSyllabusDetails(param)
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
												console.log('finalSpannedArray', this.finalSpannedArray);
											}
										} else {
											this.finalSyllabusArray = [];
											this.common.showSuccessErrorMessage('No Record Found', 'error');
										}
									});
						}
					}
				}
			);

	}

}

