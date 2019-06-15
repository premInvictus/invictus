import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService, CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
import { SyllabusserviceService } from './../syllabusservice.service';
@Component({
	selector: 'app-add-syllabus',
	templateUrl: './add-syllabus.component.html',
	styleUrls: ['./add-syllabus.component.css']
})
export class AddSyllabusComponent implements OnInit {
			public parameterform: FormGroup;
			public parameterform2: FormGroup;
			activityUpdateFlag = false;
			syllabusUpdateFlag = false;
			syllabusvalue1: any;
			syllabusvalue2: any;
			modalForm: FormGroup;
			public classArray: any[];
			public termArray: any[];
			public ctrArray: any[];
			public topicArray: any[];
			finalSyllabusArray: any[] = [];
			finalSpannedArray: any[] = [];
			currentUser: any;
			syl_id: any;
			syl_class_id: any;
			syl_sub_id: any;
			syl_term_id: any;
			syl_result: any;
			subtopicArray: any;
			sub_id: any;
			ckeConfig: any = {};
			public subjectArray: any[];
			syllabus_flag = true;
			details_flag = false;
			editRequestFlag = false;
			totalByTopic: any[] = [{
				topic_id: '',
				total: 0
			}];
			constructor(
				private fbuild: FormBuilder,
				private syllabusservice: SyllabusserviceService,
				public common: CommonAPIService,
				public axiomService: AxiomService,
				public sisService: SisService,

			) { }

			ngOnInit() {
				this.buildForm();
				this.getClass();
				this.getTermList();
				this.ctrList();
				this.ckeConfig = {
					allowedContent: true,
					pasteFromWordRemoveFontStyles: false,
					contentsCss: ['https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'],
					disallowedContent: 'm:omathpara',
					height: '150',
					width: '100%',
					// tslint:disable-next-line:max-line-length
					extraPlugins: '',
					scayt_multiLanguageMod: true,
					toolbar: [
						// tslint:disable-next-line:max-line-length
						['Font', 'FontSize', 'Bold', 'Italic', 'Underline', 'Strikethrough', 'Image', 'Table', 'Templates']
					],
					removeDialogTabs: 'image:advanced;image:Link'
				};
			}

			buildForm() {
				this.parameterform = this.fbuild.group({
						syl_class_id: '',
						syl_sub_id: '',
						syl_term_id: ''
				});
				this.parameterform2 = this.fbuild.group({
						// syl_class_id: '',
						// syl_sub_id: '',
						sd_ctr_id: '',
						sd_topic_id: '',
						sd_st_id: '',
						sd_period_req: '',
						sd_desc: ''
				});
		}
		getClass() {
				this.syllabusservice.getClass()
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												this.classArray = result.data;
										}
								}
						);
		}

		getSubjectsByClass(): void {
			this.syllabusservice.getSubjectsByClass(this.parameterform.value.syl_class_id)
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

		getTermList() {
				this.syllabusservice.getTermList()
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												this.termArray = result.data;
										}
								}
						);
		}

		ctrList() {
			this.syllabusservice.ctrList()
					.subscribe(
							(result: any) => {
									if (result && result.status === 'ok') {
											this.ctrArray = result.data;
									}
							}
					);
		}

		getTopicByClassSubject(class_id, sub_id) {
			this.axiomService.getTopicByClassSubject(class_id, sub_id)
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

		getSubtopicByTopic(): void {
			this.axiomService.getSubtopicByTopic(this.parameterform2.value.sd_topic_id)
					.subscribe(
							(result: any) => {
									if (result && result.status === 'ok') {
											this.subtopicArray = result.data;
									} else {
											this.subtopicArray = [];
											this.common.showSuccessErrorMessage('No Record Found', 'error');
									}
							}
					);
		}

		getSyllabus(value) {
			this.syllabusservice.getSyllabus(value)
					.subscribe(
							(result: any) => {
									if (result && result.status === 'ok') {
											this.syl_result = result.data[0];
											this.getTopicByClassSubject(this.syl_result.syl_class_id, this.syl_result.syl_sub_id);
									}
							}
					);
		}

		getSyllabusClass(class_id) {
			const cindex = this.classArray.findIndex(f => Number(f.class_id) === Number(class_id));
			if (cindex !== -1) {
				return this.classArray[cindex].class_name;
			}
		}
		getSyllabusSubject(sub_id) {
			const sindex = this.subjectArray.findIndex(f => Number(f.sub_id) === Number(sub_id));
			if (sindex !== -1) {
				return this.subjectArray[sindex].sub_name;
			}
		}
		getSyllabusTerm(term_id) {
			const tindex = this.termArray.findIndex(f => Number(f.term_id) === Number(term_id));
			if (tindex !== -1) {
				return this.termArray[tindex].term_name;
			}
		}
		getCtrName(value) {
			for (const item of this.ctrArray) {
				if (item.ctr_id === value) {
					return item.ctr_name;
				}
			}
		}
		getTopicName(value) {
			for (const item of this.topicArray) {
				if (item.topic_id === value) {
					return item.topic_name;
				}
			}
		}
		getSubTopicName(value) {
			for (const item of this.subtopicArray) {
				if (Number(item.st_id) === Number(value)) {
					return item.st_name;
				}
			}
		}
		resetForm() {
			this.parameterform2.patchValue({
				'sd_ctr_id': '',
				'sd_topic_id': '',
				'sd_st_id': '',
				'sd_period_req': '',
				'sd_desc': ''
			});
		}

		submit() {
			if (this.parameterform.valid) {
				this.common.startLoading();
				this.syllabusservice.insertSyllabus(this.parameterform.value).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.syllabus_flag = false;
						this.details_flag = true;
						this.getSyllabus({syl_id: result.data});
					}
				});
			} else {
				this.common.showSuccessErrorMessage('Please fill all required field', 'error');
			}
		}
		addDetailsList() {
			if (!this.editRequestFlag) {
				this.finalSpannedArray = [];
			}
			if (this.parameterform2.valid) {
				this.finalSyllabusArray.push(this.parameterform2.value);

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
							});
						}
					}
					const findex = this.finalSpannedArray.findIndex(f => f.sd_topic_id === this.finalSyllabusArray[i].sd_topic_id);
					if (findex === -1) {
						this.finalSpannedArray.push({
							sd_topic_id: this.finalSyllabusArray[i].sd_topic_id,
							details: spannArray,
							total : this.finalSyllabusArray[i].sd_period_req
						});
					} else {
						this.finalSpannedArray[findex].total = this.finalSpannedArray[findex].total + this.finalSyllabusArray[i].sd_period_req;
					}
					console.log(this.finalSpannedArray);
				}
				this.resetForm();
			} else {
				this.common.showSuccessErrorMessage('Please fill all required fields', 'error');
			}
		}
		editSyllabusList(value1, value2) {
			this.syllabusUpdateFlag = true;
			this.syllabusvalue1 = value1;
			this.syllabusvalue2 = value2;
			this.parameterform2.patchValue({
				'sd_ctr_id': this.finalSpannedArray[value1].details[value2].sd_ctr_id,
				'sd_topic_id': this.finalSpannedArray[value1].sd_topic_id,
				'sd_st_id': this.finalSpannedArray[value1].details[value2].sd_st_id,
				'sd_period_req': this.finalSpannedArray[value1].details[value2].sd_period_req,
				'sd_desc': this.finalSpannedArray[value1].details[value2].sd_desc,
			});
		}
		updateSyllabussList() {
			const findex = this.finalSyllabusArray.findIndex(f => f.sd_topic_id === this.finalSpannedArray[this.syllabusvalue1].sd_topic_id
				&& f.sd_ctr_id === this.finalSpannedArray[this.syllabusvalue1].details[this.syllabusvalue2].sd_ctr_id
				&& f.sd_period_req === this.finalSpannedArray[this.syllabusvalue1].details[this.syllabusvalue2].sd_period_req);
			this.finalSyllabusArray[findex] = this.parameterform2.value;
			const spannArray: any[] = [];
				let sd_period_teacher2: any = '';
				let sd_period_test2: any = '';
				let sd_period_revision2: any = '';
				if (this.parameterform2.value.sd_ctr_id === '1') {
					sd_period_teacher2 = this.parameterform2.value.sd_period_req;
				} else if (this.parameterform2.value.sd_ctr_id === '2') {
					sd_period_test2 = this.parameterform2.value.sd_period_req;
				} else {
					sd_period_revision2 = this.parameterform2.value.sd_period_req;
				}
// tslint:disable-next-line: max-line-length
				this.finalSpannedArray[this.syllabusvalue1].total = this.finalSpannedArray[this.syllabusvalue1].total - this.finalSpannedArray[this.syllabusvalue1].details[this.syllabusvalue2].sd_period_req;
			if (this.parameterform2.value.sd_topic_id === this.finalSpannedArray[this.syllabusvalue1].sd_topic_id) {
				this.finalSpannedArray[this.syllabusvalue1].sd_topic_id = this.parameterform2.value.sd_topic_id;
				this.finalSpannedArray[this.syllabusvalue1].details[this.syllabusvalue2] = this.parameterform2.value;
				this.finalSpannedArray[this.syllabusvalue1].details[this.syllabusvalue2].sd_period_teacher = sd_period_teacher2;
				this.finalSpannedArray[this.syllabusvalue1].details[this.syllabusvalue2].sd_period_test = sd_period_test2;
				this.finalSpannedArray[this.syllabusvalue1].details[this.syllabusvalue2].sd_period_revision = sd_period_revision2;
// tslint:disable-next-line: max-line-length
				this.finalSpannedArray[this.syllabusvalue1].total = this.finalSpannedArray[this.syllabusvalue1].total + this.parameterform2.value.sd_period_req;
			} else {
				spannArray.push({
					sd_ctr_id: this.parameterform2.value.sd_ctr_id,
					sd_topic_id: this.parameterform2.value.sd_topic_id,
					sd_period_req: this.parameterform2.value.sd_period_req,
					sd_period_teacher: sd_period_teacher2,
					sd_period_test: sd_period_test2,
					sd_period_revision: sd_period_revision2,
					sd_st_id: this.parameterform2.value.sd_st_id,
					sd_desc: this.parameterform2.value.sd_desc,
				});
				console.log(this.finalSpannedArray);
				this.finalSpannedArray[this.syllabusvalue1].details.splice(this.syllabusvalue2, 1);

				const rindex = this.finalSpannedArray.findIndex(f => f.sd_topic_id === this.parameterform2.value.sd_topic_id);
				if (rindex === -1) {
					this.finalSpannedArray.push({
						sd_topic_id: this.parameterform2.value.sd_topic_id,
						details: spannArray
						//total : this.finalSyllabusArray[i].sd_period_req
					});
				} else {
					this.finalSpannedArray[rindex].details = spannArray;
				}

				// this.finalSpannedArray.push({
				// 	sd_topic_id: this.parameterform2.value.sd_topic_id,
				// 	details: spannArray
				// });
				// console.log(this.finalSpannedArray);
				// //this.addDetailsList();
			}
			this.common.showSuccessErrorMessage('Syllabus List Updated', 'success');
			this.resetForm();
			this.syllabusUpdateFlag = false;
		}
		deleteSyllabusList(value1, value2) {
			if (this.finalSpannedArray[value1].details.length > 1) {
				this.finalSpannedArray[value1].details.splice(value2, 1);
			} else {
				this.finalSpannedArray.splice(value1, 1);
			}
			this.finalSyllabusArray.splice(value1, 1);
			this.resetForm();
		}
} 
