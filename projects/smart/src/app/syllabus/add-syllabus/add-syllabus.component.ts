import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
import * as XLSX from 'xlsx';
@Component({
	selector: 'app-add-syllabus',
	templateUrl: './add-syllabus.component.html',
	styleUrls: ['./add-syllabus.component.css']
})
export class AddSyllabusComponent implements OnInit {
	@ViewChild('deleteModal') deleteModal;
	activityUpdateFlag = false;
	syllabusUpdateFlag = false;
	finaldivflag = true;
	finalSubmitdivflag = false;
	requiredField = false;
	syllabus_flag = true;
	details_flag = false;
	periodDivFlag = false;
	editRequestFlag = false;
	public syllabusForm: FormGroup;
	public syllabusDetailForm: FormGroup;
	public classArray: any[];
	public subjectArray: any[];
	public ctrArray: any[];
	public topicArray: any[] = [];
	finalSyllabusArray: any[] = [];
	finalSpannedArray: any[] = [];
	finalSubmitArray: any[] = [];
	finalXlslArray: any[] = [];
	XlslArray: any[] = [];
	arrayBuffer: any;
	file: File;
	syllabusValue1: any;
	syllabusValue2: any;
	currentUser: any;
	session: any;
	syl_id: any;
	syl_class_id: any;
	syl_sub_id: any;
	syl_result: any = {};
	subtopicArray: any;
	subtopic_id_string: any = '';
	topic_id_string: any = '';
	sub_id: any;
	ckeConfig: any = {};
	submitParam: any = {};
	subTopicJson: any[] = [];
	add = 'Add';
	constructor(
		private fbuild: FormBuilder,
		private syllabusService: SmartService,
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
		this.ctrList();
		this.ckeConfig = {
			allowedContent: true,
			pasteFromWordRemoveFontStyles: false,
			contentsCss: ['https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'],
			disallowedContent: 'm:omathpara',
			height: '150',
			width: '100%',
			extraPlugins: '',
			scayt_multiLanguageMod: true,
			toolbar: [
				['Font', 'FontSize', 'Bold', 'Italic', 'Underline', 'Strikethrough', 'Image', 'Table', 'Templates']
			],
			removeDialogTabs: 'image:advanced;image:Link'
		};
	}

	buildForm() {
		this.syllabusForm = this.fbuild.group({
			syl_class_id: '',
			syl_sub_id: '',
		});
		this.syllabusDetailForm = this.fbuild.group({
			sd_ctr_id: '',
			sd_topic_id: '',
			sd_st_id: '',
			sd_period_req: '',
			sd_desc: ''
		});
	}

	incomingfile(event) {
		this.file = event.target.files[0];
		this.Upload();
	}

	Upload() {
		const fileReader = new FileReader();
		fileReader.onload = (e) => {
			this.arrayBuffer = fileReader.result;
			const data = new Uint8Array(this.arrayBuffer);
			const arr = new Array();
			// tslint:disable-next-line: curly
			for (let i = 0; i !== data.length; ++i) arr[i] = String.fromCharCode(data[i]);
			const bstr = arr.join('');
			const workbook = XLSX.read(bstr, { type: 'binary' });
			const first_sheet_name = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[first_sheet_name];
			this.XlslArray = XLSX.utils.sheet_to_json(worksheet, { raw: true });
			for (let i = 0; i < this.XlslArray.length; i++) {
				this.finalXlslArray.push({
					sd_ctr_id: this.XlslArray[i].Category,
					sd_topic_id: this.XlslArray[i].Topic,
					sd_period_req: this.XlslArray[i].Period,
					sd_st_id: this.XlslArray[i].Subtopic,
					sd_desc: this.XlslArray[i].Description,
				});
				if (i === (this.XlslArray.length - 1)) {
					this.subtopic_id_string = this.subtopic_id_string + this.XlslArray[i].Subtopic;
					this.topic_id_string = this.topic_id_string + this.XlslArray[i].Topic;
				} else {
					this.subtopic_id_string = this.subtopic_id_string + this.XlslArray[i].Subtopic + ',';
					this.topic_id_string = this.topic_id_string + this.XlslArray[i].Topic + ',';
				}
			}
			this.getTopicNameById(this.topic_id_string);
			this.getSubTopicNameById(this.subtopic_id_string);
		};
		fileReader.readAsArrayBuffer(this.file);

	}

	// get topic name by topic Id
	getTopicNameById(topic_id) {
		const topicParam: any = {};
		topicParam.topic_id = topic_id;
		this.syllabusService.getTopicNameById(topicParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.topicArray = result.data;
						this.addxlslDetailsList(this.finalXlslArray);
					}
				}
			);
	}

	// get Subtopic name by Subtopic Id
	getSubTopicNameById(subTopic_id) {
		const subTopicParam: any = {};
		subTopicParam.st_id = subTopic_id;
		this.syllabusService.getSubTopicNameById(subTopicParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.subTopicJson = result.data;
					}
				}
			);
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
					}
				}
			);
	}

	//  Open Final Submit Modal function
	openSubmitModal() {
		this.submitParam.text = 'Add';
		this.deleteModal.openModal(this.submitParam);
	}

	//  Get Subject By Class function
	getSubjectsByClass(): void {
		const subjectParam: any = {};
		subjectParam.class_id = this.syllabusForm.value.syl_class_id;
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

	//  Get CTR List function
	ctrList() {
		this.syllabusService.ctrList()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.ctrArray = result.data;
					}
				}
			);
	}

	//  Get Topic List function
	getTopicByClassSubject() {
		console.log(this.topicArray);
		this.axiomService.getTopicByClassSubject(this.syllabusForm.value.syl_class_id, this.syllabusForm.value.syl_sub_id)
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

	//  Get Subtopic List function
	getSubtopicByTopic(): void {
		this.axiomService.getSubtopicByTopic(this.syllabusDetailForm.value.sd_topic_id)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.subtopicArray = result.data;
						if (this.subTopicJson.length > 1) {
							const subTopindex = this.subTopicJson.findIndex(f => Number(f.st_id) === Number(this.subtopicArray.st_id));
							if (subTopindex === -1) {
								for (let i = 0; i < this.subtopicArray.length; i++) {
									this.subTopicJson.push({
										st_id: this.subtopicArray[i].st_id,
										st_name: this.subtopicArray[i].st_name,
									});
								}
							}
						} else {
							this.subTopicJson = this.subtopicArray;
						}
					} else {
						this.subtopicArray = [];
						this.commonService.showSuccessErrorMessage('No Record Found', 'error');
					}
				}
			);
	}

	//  Get Class Name from existion Array for details table
	getSyllabusClass(class_id) {
		const cindex = this.classArray.findIndex(f => Number(f.class_id) === Number(class_id));
		if (cindex !== -1) {
			return this.classArray[cindex].class_name;
		}
	}

	//  Get Subject Name from existion Array for details table
	getSyllabusSubject(sub_id) {
		const sindex = this.subjectArray.findIndex(f => Number(f.sub_id) === Number(sub_id));
		if (sindex !== -1) {
			return this.subjectArray[sindex].sub_name;
		}
	}

	//  Get Ctr Name from existion Array for details table
	getCtrName(value) {
		const ctrIndex = this.ctrArray.findIndex(f => Number(f.ctr_id) === Number(value));
		if (ctrIndex !== -1) {
			return this.ctrArray[ctrIndex].ctr_name;
		}
	}

	//  Get Topic Name from existion Array for details table
	getTopicName(value) {
		const topIndex = this.topicArray.findIndex(f => Number(f.topic_id) === Number(value));
		if (topIndex !== -1) {
			return this.topicArray[topIndex].topic_name;
		}
	}

	//  Get Sub Topic Name from existion Array for details table
	getSubTopicName(value) {
		const subIndex = this.subTopicJson.findIndex(f => Number(f.st_id) === Number(value));
		if (subIndex !== -1) {
			return this.subTopicJson[subIndex].st_name;
		}
	}

	// Reset Syllabus Details form 
	resetForm() {
		this.syllabusDetailForm.patchValue({
			'sd_ctr_id': '',
			'sd_topic_id': '',
			'sd_st_id': '',
			'sd_period_req': '',
			'sd_desc': ''
		});
	}

	// Function for cancel the perfor action and back to add class and subject
	finalCancel() {
		this.finalSpannedArray = [];
		this.finalSubmitArray = [];
		this.finaldivflag = true;
		this.finalSubmitdivflag = false;
		this.syllabus_flag = true;
		this.details_flag = false;
		this.syllabusForm.patchValue({
			'syl_class_id': '',
			'syl_sub_id': ''
		});
		this.resetForm();
	}

	// add class and subject form submit function
	submit() {
		if (this.syllabusForm.valid) {
			this.syllabusService.getSylIdByClassSubject(this.syllabusForm.value.syl_class_id, this.syllabusForm.value.syl_sub_id)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.commonService.showSuccessErrorMessage('Syllabus Already Added', 'error');
						} else {
							this.syllabus_flag = false;
							this.details_flag = true;
						}
					});
		} else {
			this.commonService.showSuccessErrorMessage('Please fill all required field', 'error');
		}
	}
	// Add syllabus list function
	addDetailsList() {
		this.finaldivflag = false;
		this.finalSubmitdivflag = true;
		this.periodDivFlag = false;
		if (!this.editRequestFlag) {
			this.finalSpannedArray = [];
		}
		if (this.syllabusDetailForm.valid) {
			if (this.syllabusDetailForm.value.sd_period_req === 0) {
				this.finaldivflag = true;
				this.finalSubmitdivflag = false;
				this.periodDivFlag = true;
				return false;
			}
			this.finalSyllabusArray.push(this.syllabusDetailForm.value);
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
						total: this.finalSyllabusArray[i].sd_period_req
					});
				} else {
					this.finalSpannedArray[findex].total = this.finalSpannedArray[findex].total + this.finalSyllabusArray[i].sd_period_req;
				}
			}
			this.syllabusDetailForm.patchValue({
				'sd_st_id': '',
				'sd_period_req': '',
				'sd_desc': ''
			});
		} else {
			this.commonService.showSuccessErrorMessage('Please fill all required fields', 'error');
		}
	}



	// Add syllabus list function
	addxlslDetailsList(xlsl_array) {
		this.finaldivflag = false;
		this.finalSubmitdivflag = true;
		this.periodDivFlag = false;
		if (!this.editRequestFlag) {
			this.finalSpannedArray = [];
		}
		if (xlsl_array.length > 0) {
			this.finalSyllabusArray = xlsl_array;
			for (let i = 0; i < this.finalSyllabusArray.length; i++) {
				let sd_period_teacher: any = '';
				let sd_period_test: any = '';
				let sd_period_revision: any = '';
				if (Number(this.finalSyllabusArray[i].sd_ctr_id) === 1) {
					sd_period_teacher = this.finalSyllabusArray[i].sd_period_req;
				} else if (Number(this.finalSyllabusArray[i].sd_ctr_id) === 2) {
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
						if (Number(this.finalSyllabusArray[j].sd_ctr_id) === 1) {
							sd_period_teacher1 = this.finalSyllabusArray[j].sd_period_req;
						} else if (Number(this.finalSyllabusArray[j].sd_ctr_id) === 2) {
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
						total: this.finalSyllabusArray[i].sd_period_req
					});
				} else {
					this.finalSpannedArray[findex].total = this.finalSpannedArray[findex].total + this.finalSyllabusArray[i].sd_period_req;
				}
			}
			this.syllabusDetailForm.patchValue({
				'sd_st_id': '',
				'sd_period_req': '',
				'sd_desc': ''
			});
		} else {
			this.commonService.showSuccessErrorMessage('Please fill all required fields in Excel', 'error');
		}
	}

	// Edit syllabus list function
	editSyllabusList(value1, value2) {
		console.log(value1);
		console.log(this.finalSpannedArray[value1].details[value2].sd_ctr_id);
		console.log(this.finalSpannedArray);
		this.syllabusUpdateFlag = true;
		this.syllabusValue1 = value1;
		this.syllabusValue2 = value2;
		this.syllabusDetailForm.patchValue({
			'sd_ctr_id': this.finalSpannedArray[value1].details[value2].sd_ctr_id.toString(),
			'sd_topic_id': this.finalSpannedArray[value1].sd_topic_id.toString(),
			'sd_st_id': this.finalSpannedArray[value1].details[value2].sd_st_id,
			'sd_period_req': this.finalSpannedArray[value1].details[value2].sd_period_req,
			'sd_desc': this.finalSpannedArray[value1].details[value2].sd_desc,
		});
	}

	// Update syllabus list function
	updateSyllabussList() {
		this.syllabusDetailForm.value.sd_topic_id = Number(this.syllabusDetailForm.value.sd_topic_id);
		this.syllabusDetailForm.value.sd_ctr_id = Number(this.syllabusDetailForm.value.sd_ctr_id);
		console.log(this.syllabusDetailForm.value);
		const findex = this.finalSyllabusArray.findIndex(f => f.sd_topic_id === this.finalSpannedArray[this.syllabusValue1].sd_topic_id
			&& f.sd_ctr_id === this.finalSpannedArray[this.syllabusValue1].details[this.syllabusValue2].sd_ctr_id
			&& f.sd_period_req === this.finalSpannedArray[this.syllabusValue1].details[this.syllabusValue2].sd_period_req);
		this.finalSyllabusArray[findex] = this.syllabusDetailForm.value;
		const spannArray: any[] = [];
		let sd_period_teacher2: any = '';
		let sd_period_test2: any = '';
		let sd_period_revision2: any = '';
		if (this.syllabusDetailForm.value.sd_ctr_id.toString() === '1') {
			sd_period_teacher2 = this.syllabusDetailForm.value.sd_period_req;
		} else if (this.syllabusDetailForm.value.sd_ctr_id.toString() === '2') {
			sd_period_test2 = this.syllabusDetailForm.value.sd_period_req;
		} else {
			sd_period_revision2 = this.syllabusDetailForm.value.sd_period_req;
		}
		// tslint:disable-next-line: max-line-length
		this.finalSpannedArray[this.syllabusValue1].total = this.finalSpannedArray[this.syllabusValue1].total - this.finalSpannedArray[this.syllabusValue1].details[this.syllabusValue2].sd_period_req;
		if (this.syllabusDetailForm.value.sd_topic_id === this.finalSpannedArray[this.syllabusValue1].sd_topic_id) {
			this.finalSpannedArray[this.syllabusValue1].sd_topic_id = this.syllabusDetailForm.value.sd_topic_id;
			this.finalSpannedArray[this.syllabusValue1].details[this.syllabusValue2] = this.syllabusDetailForm.value;
			this.finalSpannedArray[this.syllabusValue1].details[this.syllabusValue2].sd_period_teacher = sd_period_teacher2;
			this.finalSpannedArray[this.syllabusValue1].details[this.syllabusValue2].sd_period_test = sd_period_test2;
			this.finalSpannedArray[this.syllabusValue1].details[this.syllabusValue2].sd_period_revision = sd_period_revision2;
			// tslint:disable-next-line: max-line-length
			this.finalSpannedArray[this.syllabusValue1].total = this.finalSpannedArray[this.syllabusValue1].total + this.syllabusDetailForm.value.sd_period_req;
		} else {
			// tslint:disable-next-line: no-shadowed-variable
			const spannArray: any[] = [];
			spannArray.push({
				sd_ctr_id: this.syllabusDetailForm.value.sd_ctr_id,
				sd_topic_id: this.syllabusDetailForm.value.sd_topic_id,
				sd_period_req: this.syllabusDetailForm.value.sd_period_req,
				sd_period_teacher: sd_period_teacher2,
				sd_period_test: sd_period_test2,
				sd_period_revision: sd_period_revision2,
				sd_st_id: this.syllabusDetailForm.value.sd_st_id,
				sd_desc: this.syllabusDetailForm.value.sd_desc,
			});
			if (this.finalSpannedArray.length > 0) {
				this.finalSpannedArray[this.syllabusValue1].details.splice(this.syllabusValue2, 1);
				if (this.finalSpannedArray[this.syllabusValue1].details.length === 0) {
					this.finalSpannedArray.splice(this.syllabusValue1, 1);
				}
			} else {
				this.finalSpannedArray.splice(this.syllabusValue1, 1);
			}
			const rindex = this.finalSpannedArray.findIndex(f => f.sd_topic_id === this.syllabusDetailForm.value.sd_topic_id);
			if (rindex === -1) {
				this.finalSpannedArray.push({
					sd_topic_id: this.syllabusDetailForm.value.sd_topic_id,
					details: spannArray,
					total: this.syllabusDetailForm.value.sd_period_req
				});
			} else {
				this.finalSpannedArray[rindex].details.push({
					sd_ctr_id: this.syllabusDetailForm.value.sd_ctr_id,
					sd_topic_id: this.syllabusDetailForm.value.sd_topic_id,
					sd_period_req: this.syllabusDetailForm.value.sd_period_req,
					sd_period_teacher: sd_period_teacher2,
					sd_period_test: sd_period_test2,
					sd_period_revision: sd_period_revision2,
					sd_st_id: this.syllabusDetailForm.value.sd_st_id,
					sd_desc: this.syllabusDetailForm.value.sd_desc,
				});
				this.finalSpannedArray[rindex].total = this.finalSpannedArray[rindex].total + this.syllabusDetailForm.value.sd_period_req;
			}
		}
		this.commonService.showSuccessErrorMessage('Syllabus List Updated', 'success');
		this.resetForm();
		this.syllabusUpdateFlag = false;
	}

	// Delete syllabus list function
	deleteSyllabusList(value1, value2) {
		if (this.finalSpannedArray[value1].details.length > 1) {
			this.finalSpannedArray[value1].details.splice(value2, 1);
		} else {
			this.finalSpannedArray.splice(value1, 1);
		}
		this.finalSyllabusArray.splice(value1, 1);
		this.resetForm();
	}

	// final submit function 
	// In this function database entry occur
	finalSubmit($event) {
		if ($event) {
			this.syllabusService.insertSyllabus(this.syllabusForm.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.syl_id = result.data;
					for (const item of this.finalSpannedArray) {
						for (const fetch of item.details) {
							if (fetch.sd_st_id === '') {
								fetch.sd_st_id = '0';
							}
							this.finalSubmitArray.push({
								sd_syl_id: this.syl_id,
								sd_ses_id: this.session.ses_id,
								sd_created_by: this.currentUser.login_id,
								sd_ctr_id: fetch.sd_ctr_id,
								sd_topic_id: fetch.sd_topic_id,
								sd_period_req: fetch.sd_period_req,
								sd_st_id: fetch.sd_st_id,
								sd_desc: fetch.sd_desc
							});
						}
					}
					this.syllabusService.insertSyllabusDetails(this.finalSubmitArray).subscribe((result1: any) => {
						if (result1 && result1.status === 'ok') {
							this.finalSpannedArray = [];
							this.finalSubmitArray = [];
							this.resetForm();
						}
					});
				}
			});
		}
	}
}
