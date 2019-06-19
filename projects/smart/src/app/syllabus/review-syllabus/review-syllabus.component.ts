import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService } from '../../_services';
import { SyllabusserviceService } from './../syllabusservice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-review-syllabus',
	templateUrl: './review-syllabus.component.html',
	styleUrls: ['./review-syllabus.component.css']
})
export class ReviewSyllabusComponent implements OnInit {
	@ViewChild('deleteModal') deleteModal;
	@ViewChild('publishModal') publishModal;
	public classArray: any[];
	public subjectArray: any[];
	public finalSyllabusArray: any[];
	finalSpannedArray: any[] = [];
	public topicArray: any[];
	public subtopicArray: any[];
	syl_id: any;
	public reviewform: FormGroup;
	editRequestFlag = false;
	finaldivflag = true;
	param: any = {};
	constructor(
		public dialog: MatDialog,
		private fbuild: FormBuilder,
		private syllabusservice: SyllabusserviceService,
		public common: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
	) { }

	openDialog(sd_id) {
		// tslint:disable-next-line: no-use-before-declare
		const dialogRef = this.dialog.open(EditSyllabus, {
			height: '550px',
			width: '700px',
			data: { sd_id: sd_id }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.fetchSyllabusDetails();
			}
		});
	}
	openModal(i, j, sd_id) {
		this.param.indexi = i;
		this.param.indexj = j;
		this.param.sd_id = sd_id;
		this.deleteModal.openModal(this.param);
	}
	openPublish(syl_id) {
		this.publishModal.openpublishModal();
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
			this.syllabusservice.deleteSyllabusDetails(param)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.fetchSyllabusDetails();
							this.common.showSuccessErrorMessage('Syllabus List Deleted Successfully', 'success');
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
						this.syl_id = result.data;
						if (this.syl_id !== '') {
							this.syllabusservice.getSyllabusDetails(this.syl_id)
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
														syl_id: this.syl_id
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

@Component({
	selector: 'edit-syllabus',
	templateUrl: 'edit-syllabus.html',
})
// tslint:disable-next-line: component-class-suffix
export class EditSyllabus {
	public editArray: any[] = [];
	public revieweditform: FormGroup;
	ckeConfig: any = {};
	constructor(
		private fbuild: FormBuilder,
		private syllabusservice: SyllabusserviceService,
		public common: CommonAPIService,
		public dialogRef: MatDialogRef<EditSyllabus>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }
	buildForm() {
		this.revieweditform = this.fbuild.group({
			class_name: '',
			sub_name: '',
			term_name: '',
			topic_name: '',
			subtopic_name: '',
			ctr_name: '',
			sd_period_req: '',
			sd_desc: '',
			sd_id: ''
		});
	}
	// tslint:disable-next-line: use-life-cycle-interface
	ngOnInit() {
		this.buildForm();
		this.getSyllabusDetailsEdit(this.data);
		this.ckeConfig = {
			allowedContent: true,
			pasteFromWordRemoveFontStyles: false,
			contentsCss: ['https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'],
			disallowedContent: 'm:omathpara',
			height: '140',
			width: '100%',
			// tslint:disable-next-line:max-line-length
			extraPlugins: '',
			scayt_multiLanguageMod: true,
			toolbar: [
				// tslint:disable-next-line:max-line-length
				['Bold', 'Italic', 'Underline', 'Strikethrough', 'Image', 'Table', 'Templates']
			],
			removeDialogTabs: 'image:advanced;image:Link'
		};
	}
	getSyllabusDetailsEdit(value: any) {
		console.log(value);
		this.syllabusservice.getSyllabusDetailsEdit(value)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.revieweditform.patchValue({
							'class_name': result.data[0].class_name,
							'sub_name': result.data[0].sub_name,
							'term_name': result.data[0].term_name,
							'topic_name': result.data[0].topic_name,
							'subtopic_name': result.data[0].st_name,
							'ctr_name': result.data[0].ctr_name,
							'sd_desc': result.data[0].sd_desc,
							'sd_period_req': result.data[0].sd_period_req,
							'sd_id': result.data[0].sd_id
						});
					}
				});
	}
	updateSyllabussEdit() {
		const param: any = {};
		param.sd_id = this.revieweditform.value.sd_id;
		param.sd_period_req = this.revieweditform.value.sd_period_req;
		param.sd_desc = this.revieweditform.value.sd_desc;
		this.syllabusservice.updateSyllabusEditDetails(param)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.common.showSuccessErrorMessage('Syllabus List Updated Successfully', 'success');
						this.dialogRef.close(true);
					}
				});
	}
	closeDialog() {
		this.dialogRef.close(false);
	}
}
