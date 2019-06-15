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
			modalForm: FormGroup;
			public classArray: any[];
			public termArray: any[];
			public ctrArray: any[];
			public topicArray: any[];
			finalAwardArray: any[] = [];
			finalAwardArray2: any[] = [];
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
		getTopicName(value) {
			for (const item of this.topicArray) {
				if (item.topic_id === value) {
					return item.topic_name;
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
				this.finalAwardArray.push(this.parameterform2.value);
				for (let i = 0; i < this.finalAwardArray.length; i++) {
					const spannArray: any[] = [];
					spannArray.push({
						sd_topic_id: this.finalAwardArray[i].sd_topic_id,
						sd_st_id: this.finalAwardArray[i].sd_st_id,
						sd_period_req: this.finalAwardArray[i].sd_period_req,
						sd_ctr_id: this.finalAwardArray[i].sd_ctr_id,
						sd_desc: this.finalAwardArray[i].sd_desc,
					});
					for (let j = i + 1; j < this.finalAwardArray.length; j++) {
						if (this.finalAwardArray[i].sd_topic_id === this.finalAwardArray[j].sd_topic_id) {
							spannArray.push({
								sd_topic_id: this.finalAwardArray[i].sd_topic_id,
								sd_st_id: this.finalAwardArray[j].sd_st_id,
								sd_period_req: this.finalAwardArray[j].sd_period_req,
								sd_ctr_id: this.finalAwardArray[j].sd_ctr_id,
								sd_desc: this.finalAwardArray[j].sd_desc,
							});
						}
					}
					const findex = this.finalSpannedArray.findIndex(f => f.sd_topic_id === this.finalAwardArray[i].sd_topic_id);
					if (findex === -1) {
						this.finalSpannedArray.push({
							sd_topic_id: this.finalAwardArray[i].sd_topic_id,
							details: spannArray
						});
					}
				}
				this.resetForm();
			} else {
				this.common.showSuccessErrorMessage('Please fill all required fields', 'error');
			}
			console.log(this.finalAwardArray);
		}
}
