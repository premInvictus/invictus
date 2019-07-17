import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-review-syllabus',
	templateUrl: './review-syllabus.component.html',
	styleUrls: ['./review-syllabus.component.css']
})
export class ReviewSyllabusComponent implements OnInit {
	@ViewChild('editModal') editModal;
	@ViewChild('deleteModal') deleteModal;
	@ViewChild('publishModal') publishModal;
	public reviewForm: FormGroup;
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

	// Edit dialod open modal function
	openEditDialog(sd_id) {
		this.editParam.sd_id = sd_id;
		this.editModal.openEditModal(this.editParam);
	}

	// delete dialog open modal function
	openModal(i, j, sd_id) {
		this.param.indexi = i;
		this.param.indexj = j;
		this.param.sd_id = sd_id;
		this.param.text = 'Delete';
		this.deleteModal.openModal(this.param);
	}

	// Publish dialog open modal function
	openPublish(syl_id, topic_id) {
		this.publishParam.syl_id = syl_id;
		this.publishParam.topic_id = topic_id;
		this.publishModal.openpublishModal(this.publishParam);
	}
	buildForm() {
		this.reviewForm = this.fbuild.group({
			syl_class_id: '',
			syl_sub_id: ''
		});
	}
	ngOnInit() {
		this.buildForm();
		this.getClass();
		if (this.syllabusService.getProcesstype()) {
			this.processType = this.syllabusService.getProcesstype();
			this.reviewForm.patchValue({
				'syl_class_id': this.processType.class_id,
				'syl_sub_id': this.processType.sub_id,
			});
			this.getSubjectsByClass();
			this.fetchSyllabusDetails();
		}
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
		this.reviewForm.patchValue({
			'syl_sub_id': ''
		});
	}

	//  Get Subject By Class function
	getSubjectsByClass(): void {
		this.finalSpannedArray = [];
		const subjectParam: any = {};
		subjectParam.class_id = this.reviewForm.value.syl_class_id;
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
		this.axiomService.getTopicByClassSubject(this.reviewForm.value.syl_class_id, this.reviewForm.value.syl_sub_id)
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

	// delete syllabus list from database function 
	deleteSyllabusList($event) {
		if ($event) {
			if (this.finalSpannedArray[this.param.indexi].details.length > 1) {
				this.finalSpannedArray[this.param.indexi].details.splice(this.param.indexj, 1);
			} else {
				this.finalSpannedArray.splice(this.param.indexi, 1);
			}
			this.finalSyllabusArray.splice(this.param.indexi, 1);
			const param: any = {};
			param.sd_id = this.param.sd_id;
			param.sd_status = '5';
			this.syllabusService.deleteSyllabusDetails(param)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.fetchSyllabusDetails();
							this.commonService.showSuccessErrorMessage('Syllabus List Deleted Successfully', 'success');
						}
					});
		}
	}

	// publish syllabus list
	insertPublishSyllabus($event) {
		if ($event) {
			const publishParam: any = {};
			publishParam.sd_syl_id = this.publishParam.syl_id;
			publishParam.sd_topic_id = this.publishParam.topic_id;
			publishParam.sd_status = '1';
			this.syllabusService.updatePublishStatus(publishParam)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							const param: any = {};
							param.mod_review_row_id = publishParam.sd_syl_id + '-' + publishParam.sd_topic_id;
							param.mod_review_by = this.currentUser.login_id;
							param.mod_review_status = '1';
							param.mod_title = '1';
							param.mod_project_id = '4';
							this.syllabusService.insertPublishSyllabus(param)
								.subscribe(
									(publishResult: any) => {
										if (publishResult && publishResult.status === 'ok') {
											this.fetchSyllabusDetails();
											this.commonService.showSuccessErrorMessage('Syllabus Publish Successfully', 'success');
										}
									});
						}
					});
		}
	}

	// updtae syllabus list function
	updateSyllabussEdit($event) {
		if ($event) {
			const param: any = {};
			param.sd_id = this.editParam.sd_id;
			param.sd_period_req = this.editParam.sd_period_req;
			param.sd_desc = this.editParam.sd_desc;
			this.syllabusService.updateSyllabusEditDetails(param)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.fetchSyllabusDetails();
							this.commonService.showSuccessErrorMessage('Syllabus List Updated Successfully', 'success');
						}
					});
		}
	}

	// fetch syllabus details for table
	fetchSyllabusDetails() {
		this.finalDivFlag = false;
		this.syllabusService.getSylIdByClassSubject(this.reviewForm.value.syl_class_id, this.reviewForm.value.syl_sub_id)
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
					} else {
						this.finalSpannedArray = [];
						this.finalDivFlag = true;
						this.commonService.showSuccessErrorMessage('No Record Found', 'error');
					}
				}
			);

	}


}
