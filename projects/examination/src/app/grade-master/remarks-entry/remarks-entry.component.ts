import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';


@Component({
	selector: 'app-remarks-entry',
	templateUrl: './remarks-entry.component.html',
	styleUrls: ['./remarks-entry.component.css']
})
export class RemarksEntryComponent implements OnInit {
	hintColor = '#ff0000';
	isExamAvailable = true;
	paramform: FormGroup;
	subjectWiseRemark = false;
	classArray: any[] = [];
	subjectArray: any[] = [];
	sectionArray: any[] = [];
	termsArray: any[] = [];
	examArray: any[] = [];
	subexamArray: any[] = [];
	studentArray: any[] = [];
	formGroupArray: any[] = [];
	formGroupArray2: any[] = [];
	remarkSet: any[] = [];
	remarkDescriptionArray: any[] = [];
	tableDivFlag = false;
	submitFlag = false;
	marksInputArray: any[] = [];
	remarksEntry: any[] = [];
	remarkArray: any[] = [];
	remarkInputArray: any[] = [];
	marksEditable = true;
	editTable = false;
	examType: any;
	classGradeTerm: any[] = [];
	responseMarksArray: any[] = [];
	remarksTypeArray: any[] = [
		{ rt_id: 1, rt_name: 'Internal Type' },
		{ rt_id: 2, rt_name: 'External Type' }
	];
	sortUp = false;
	disabledApiButton = false;
	ngOnInit() {
		this.buildForm();
		this.getClass();
		this.getClassTermGrade();
	}

	constructor(
		private fbuild: FormBuilder,
		private examService: ExamService,
		private sisService: SisService,
		private smartService: SmartService,
		private commonAPIService: CommonAPIService,
		public dialog: MatDialog
	) { }

	buildForm() {
		this.paramform = this.fbuild.group({
			ere_class_id: '',
			ere_sec_id: '',
			ere_remarks_type: '',
			ere_sub_id: '',
			ere_term_id: '',
			ere_exam_id: '',
			ere_sub_exam_id: ''
		});
		this.formGroupArray = [];
		this.formGroupArray2 = [];
	}
	getClass() {
		this.classArray = [];
		this.smartService.getClassData({ class_status: '1' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.classArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	getClassTermGrade() {
		this.examService.getClassTermGrade({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.classGradeTerm = result.data;
			}
		});
	}

	getSectionsByClass() {
		this.dataReset();
		this.paramform.patchValue({
			ere_sec_id: '',
			ere_remarks_type: '',
			ere_term_id: '',
			ere_sub_id: '',
			ere_exam_id: '',
			ere_sub_exam_id: ''
		});
		this.sectionArray = [];
		this.smartService.getSectionsByClass({ class_id: this.paramform.value.ere_class_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.sectionArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
		this.subjectWiseRemark = this.getRemarkActiveInactive();
	}
	getRemarkActiveInactive() {
		let flag = false;
		for (const item of this.classGradeTerm) {
			for (const titem of item.ect_class_id) {
				if (Number(titem) === Number(this.paramform.value.ere_class_id)) {
					const evg_highest: any = JSON.parse(item.ect_grade_avg_highest);
					if (Object.keys(evg_highest).length > 0 && evg_highest['remark']) {
						flag = evg_highest['remark'];
						break;
					} else {
						flag = false;
						break;
					}
				}
			}
		}
		return flag;
	}

	getRemarksType() {
		if (Number(this.paramform.value.ere_remarks_type) === 1) {
			this.tableDivFlag = false;
			this.getSubjectsByClass();
			this.getClassTerm();
			// this.getSubExam();
			this.getRemarkSet();
			this.dataReset();

		} else {
			this.tableDivFlag = false;
			this.getRemarkSet();
			this.getClassTerm();
			this.subjectArray = [];
			this.subexamArray = [];
			this.examArray = [];
			// this.getSubExam();
			this.getRemarkSet();
			this.dataReset();
			this.paramform.patchValue({
				ere_term_id: '',
				ere_sub_id: '',
				ere_exam_id: '',
				ere_sub_exam_id: ''
			});

		}
	}
	getClassTerm() {
		this.termsArray = [];
		this.examService.getClassTerm({ class_id: this.paramform.value.ere_class_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				result.data.ect_no_of_term.split(',').forEach(element => {
					this.termsArray.push({ id: element, name: result.data.ect_term_alias + ' ' + element });
				});
				this.examType = result.data.ect_exam_type;

			} else {
				// this.commonAPIService.showSuccessErrorMessage(result.message, 'error'); 
			}
		});
	}
	showTableData() {
		this.getSubjectsByClass();
		if (Number(this.paramform.value.ere_remarks_type) === 2) {
			if (Number(this.examType) === 1 && this.paramform.value.ere_sub_id === '') {
			} else if (Number(this.examType) === 1 && this.paramform.value.ere_sub_id !== '') {
				this.displayExternalType();
			} else {
				this.displayExternalType();
			}
		}
	}
	getSubjectsByClass() {
		this.subjectArray = [];
		this.smartService.getSubjectsByClass({ class_id: this.paramform.value.ere_class_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				//this.subjectArray = result.data;
				//this.subSubjectArray = result.data;
				const temp = result.data;
				let scholastic_subject: any[] = [];
				let coscholastic_subject: any[] = [];
				if (temp.length > 0) {
					temp.forEach(element => {
						if (element.sub_type === '1') {
							if (element.sub_parent_id && element.sub_parent_id === '0') {
								var childSub: any[] = [];
								for (const item of temp) {
									if (element.sub_id === item.sub_parent_id) {
										childSub.push(item);
									}
								}
								element.childSub = childSub;
								scholastic_subject.push(element);
							}
						} else if (element.sub_type === '2') {
							if (element.sub_parent_id && element.sub_parent_id === '0') {
								var childSub: any[] = [];
								for (const item of temp) {
									if (element.sub_id === item.sub_parent_id) {
										childSub.push(item);
									}
								}
								element.childSub = childSub;
								coscholastic_subject.push(element);
							}
						}
					});
				}
				for (var i = 0; i < scholastic_subject.length; i++) {
					this.subjectArray.push(scholastic_subject[i]);
				}
				for (var i = 0; i < coscholastic_subject.length; i++) {
					this.subjectArray.push(coscholastic_subject[i]);
				}
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	getExamDetails() {
		this.paramform.patchValue({
			ere_exam_id: '',
		});
		this.examArray = [];
		this.subexamArray = [];
		this.examService.getExamDetails({ exam_class: this.paramform.value.ere_class_id, term_id: this.paramform.value.ere_term_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.examArray = result.data;
				if(this.examArray.length > 0) this.isExamAvailable = true;
			} else {
				this.isExamAvailable = false;
				// this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	getSubExam() {
		this.paramform.patchValue({
			ere_sub_exam_id: '',
		});
		this.subexamArray = [];
		this.examService.getExamDetails({ exam_class: this.paramform.value.ere_class_id, term_id: this.paramform.value.ere_term_id, exam_id: this.paramform.value.ere_exam_id }).subscribe((result: any) => {
			if (result && result.status === 'ok' && result.data && result.data[0]) {
				this.subexamArray = result.data[0].exam_sub_exam_max_marks;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	getRemarkSet() {
		this.examService.getRemarkSet({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.remarkSet = result.data;
			}
			for (const item of this.remarkSet) {
				this.remarkDescriptionArray[item.ers_id] = item.ers_remark_description;
			}
		});
	}
	onSelectChange(event, s, i) {
		this.submitFlag = true;
		const eventValue = event.source.value;
		const obj: any = {};
		obj['sdesc' + s + i] = this.remarkDescriptionArray[eventValue];
		this.formGroupArray[s].formGroup[i].patchValue(obj);
	}
	onSelectExternalChange(event, s) {
		this.submitFlag = true;
		const eventValue = event.source.value;
		const obj: any = {};
		obj['remark'] = this.remarkDescriptionArray[eventValue];
		this.formGroupArray2[s].formGroup[0].patchValue(obj);
	}
	getRollNoUser() {
		this.dataReset();
		this.paramform.patchValue({
			ere_remarks_type: '',
			ere_term_id: '',
			ere_sub_id: '',
			ere_exam_id: '',
			ere_sub_exam_id: ''
		});
		this.tableDivFlag = false;
		if (this.paramform.value.ere_class_id && this.paramform.value.ere_sec_id) {
			this.studentArray = [];
			this.examService.getRollNoUser({ au_class_id: this.paramform.value.ere_class_id, au_sec_id: this.paramform.value.ere_sec_id })
				.subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.studentArray = result.data;
					} else {
						this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
					}
				});
		}
	}
	getSubexamName(se_id) {
		return this.subexamArray.find(e => e.se_id === se_id).sexam_name;
	}
	displayData() {
		if (this.paramform.value.ere_sub_exam_id.length > 0 && Number(this.paramform.value.ere_remarks_type) === 1) {
			this.tableDivFlag = true;
			this.responseMarksArray = [];
			this.formGroupArray = [];
			this.marksInputArray = [];
			const param: any = {};
			param.examEntry = this.paramform.value;
			this.examService.getRemarksEntry(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.responseMarksArray = result.data;
					this.paramform.value.ere_sub_exam_id.forEach(selement => {
						result.data.forEach(melement => {
							if (selement === melement.examEntry.ere_sub_exam_id) {
								melement.examEntryMapping.forEach(element => {
									this.marksInputArray.push({
										es_id: melement.examEntry.ere_sub_exam_id,
										login_id: element.erem_login_id,
										mark: element.erem_marks,
										remarks: element.erem_remark
									});
								});
							}
						});
					});
					let i = 0;
					for (const item of this.studentArray) {
						const subjectDes: any[] = [];
						let j = 0;
						this.paramform.value.ere_sub_exam_id.forEach(selement => {
							const obj: any = {};
							obj['login_id'] = item.au_login_id;
							obj['s_id'] = selement;
							obj['sdesc' + i + j] = '';
							obj['svalue' + i + j] = '';
							subjectDes.push(
								this.fbuild.group(obj)
							);
							j++;
						});
						this.formGroupArray.push({
							login: item.au_login_id,
							formGroup: subjectDes,
							sub_key: this.paramform.value.ere_sub_exam_id
						});
						i++;
					}

				}
			});

		} else {
			this.marksInputArray = [];
			this.tableDivFlag = false;;
		}
	}

	displayExternalType() {
		if (Number(this.paramform.value.ere_remarks_type) === 2) {
			this.responseMarksArray = [];
			this.formGroupArray2 = [];
			this.remarkInputArray = [];
			const param: any = {};
			param.examEntry = this.paramform.value;
			this.examService.getRemarksEntry(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.responseMarksArray = result.data;
					for (const item of this.responseMarksArray) {
						for (const det of item.examEntryMapping) {
							this.remarkInputArray.push({
								login_id: det.erem_login_id,
								remarks: det.erem_remark
							});
						}
					}
					for (const item of this.studentArray) {
						const subjectDes: any[] = [];
						const obj: any = {};
						obj['login_id'] = item.au_login_id;
						obj['remark'] = '';
						obj['remark_id'] = '';
						subjectDes.push(
							this.fbuild.group(obj)
						);

						this.formGroupArray2.push({
							formGroup: subjectDes
						});
					}
					console.log(this.formGroupArray2);
					this.tableDivFlag = true;
				}
			});
		}

	}
	displayExternalType2() {
		if (Number(this.paramform.value.ere_remarks_type) === 2) {
			this.responseMarksArray = [];
			this.formGroupArray2 = [];
			this.remarkInputArray = [];
			const param: any = {};
			param.examEntry = this.paramform.value;
			this.examService.getRemarksEntry(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.responseMarksArray = result.data;
					for (const item of this.responseMarksArray) {
						for (const det of item.examEntryMapping) {
							this.remarkInputArray.push({
								login_id: det.erem_login_id,
								remarks: det.erem_remark
							});
						}
					}
					for (const item of this.studentArray) {
						const subjectDes: any[] = [];
						const obj: any = {};
						obj['login_id'] = item.au_login_id;
						obj['remark'] = '';
						obj['remark_id'] = '';
						subjectDes.push(
							this.fbuild.group(obj)
						);

						this.formGroupArray2.push({
							formGroup: subjectDes
						});
					}
					this.tableDivFlag = true;
				}
			});
		}
	}
	checkEditable(es_id, ere_review_status, editTable) {
		if (this.responseMarksArray.length > 0) {
			if (editTable) {
				return true;
			} else {
				const rindex = this.responseMarksArray.findIndex(item => item.examEntry.ere_sub_exam_id === es_id);
				if (rindex === -1) {
					return true;
				} else {
					if (this.responseMarksArray[rindex].examEntry.ere_review_status === ere_review_status) {
						return true;
					} else {
						return false;
					}
				}
			}
		} else {
			return true;
		}
	}
	checkExternalEdit(ere_review_status, editTable) {
		if (this.responseMarksArray.length > 0) {
			if (editTable) {
				return true;
			} else {
				const rindex = this.responseMarksArray.findIndex(item => Number(item.examEntry.ere_review_status) === Number(ere_review_status));
				if (rindex !== -1) {
					return true;
				} else {
					return false;
				}

			}
		} else {
			return true;
		}
	}
	isAnyoneEditable(ere_review_status) {
		let status = false;
		if (this.responseMarksArray.length > 0) {
			for (const item of this.responseMarksArray) {
				if (item.examEntry.ere_review_status === ere_review_status) {
					status = true;
					break;
				}
			}
		} else {
			status = true;
		}
		return status;
	}
	getSubjectName() {
		for (const item of this.subjectArray) {
			if (item.sub_id === this.paramform.value.ere_sub_id) {
				return item.sub_name;
			}
		}
	}
	enterInputMarks(es_id, login_id, mark) {
		this.submitFlag = true;
		const ind = this.marksInputArray.findIndex(e => e.es_id === es_id && e.login_id === login_id);
		if (ind !== -1) {
			this.marksInputArray[ind].mark = mark;
		} else {
			this.marksInputArray.push({
				es_id: es_id,
				login_id: login_id,
				mark: mark
			});
		}
		//console.log(this.marksInputArray);
	}

	getInputRemarks(es_id, login_id) {
		const ind = this.marksInputArray.findIndex(e => e.es_id === es_id && e.login_id === login_id);
		if (ind !== -1) {
			return this.marksInputArray[ind].remarks;
		} else {
			return '';
		}
	}
	getInputRemarks2(login_id) {
		const ind = this.remarkInputArray.findIndex(e => e.login_id === login_id);
		if (ind !== -1) {
			return this.remarkInputArray[ind].remarks;
		} else {
			return '';
		}
	}
	saveForm(status = '0') {
		this.disabledApiButton = true;
		this.editTable = false;
		this.remarkArray = [];
		let i = 0;
		for (const item of this.formGroupArray) {
			let j = 0;
			for (const det of item.formGroup) {
				if (det.value['sdesc' + i + j] !== '') {
					this.remarkArray.push(
						{
							es_id: det.value.s_id,
							login_id: det.value.login_id,
							mark: det.value['sdesc' + i + j]
						}
					);
				} else {
					const ind = this.marksInputArray.findIndex(e => e.login_id === det.value.login_id && e.es_id === det.value.s_id);
					if (ind !== -1) {
						this.remarkArray.push(
							{
								es_id: det.value.s_id,
								login_id: det.value.login_id,
								mark: this.marksInputArray[ind].remarks
							}
						);
					}
				}
				j++;
			}
			i++;
		}
		const param: any = {};
		param.examEntry = this.paramform.value;
		param.examEntryMapping = this.remarkArray;
		param.examEntryStatus = status;
		param.externalFlag = '0';
		this.examService.addReMarksEntry(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.disabledApiButton = false;
				this.displayData();
			} else {
				this.disabledApiButton = false;
			}
		});
	}
	saveForm2(status = '0') {
		this.disabledApiButton = true;
		this.editTable = false;
		this.remarksEntry = [];
		let check_valid = false;
		check_valid = Number(this.examType) === 1 && this.subjectWiseRemark ? (this.paramform.value.ere_sub_id ? true : false) : (this.paramform.value.ere_term_id ? true : false);
		if (check_valid) {
			for (const item of this.formGroupArray2) {
				for (const det of item.formGroup) {
					if (det.value.remark !== '') {
						this.remarksEntry.push(
							{
								erem_login_id: det.value.login_id,
								erem_remark: det.value.remark
							}
						);
					} else {
						const ind = this.remarkInputArray.findIndex(e => e.login_id === det.value.login_id);
						if (ind !== -1) {
							this.remarksEntry.push(
								{
									erem_login_id: det.value.login_id,
									erem_remark: this.remarkInputArray[ind].remarks
								}
							);
						}
					}
				}
			}
			const param: any = {};
			param.examEntry = this.paramform.value;
			param.examEntryMapping = this.remarksEntry;
			param.examEntryStatus = status;
			param.externalFlag = '1';
			this.examService.addReMarksEntry(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.disabledApiButton = false;
					this.displayExternalType();
				} else {
					this.disabledApiButton = false;
				}
			});
		} else {
			this.disabledApiButton = false;
			this.commonAPIService.showSuccessErrorMessage('Please fill all req fields', 'error');
		}

	}
	changeFlagStatus() {
		this.submitFlag = true;
	}
	dataReset() {
		this.responseMarksArray = [];
		this.formGroupArray2 = [];
		this.remarkInputArray = [];
		this.responseMarksArray = [];
		this.formGroupArray = [];
		this.marksInputArray = [];
		this.remarkInputArray = [];
		this.tableDivFlag = false;
		this.submitFlag = false;
	}
	edit() {
		this.editTable = true;
	}
	isExist(mod_id) {
		if (mod_id === '471') {
			if (this.commonAPIService.isExistUserAccessMenu(mod_id)) {
				return true;
			}
		}
	}

	changeSortIcon() {
		this.sortUp = !this.sortUp;
	}
	checkEditableForStudent(stu) {
		//console.log('stu---->',stu);
		if(stu.is_editable === '1') {
		  return true;
		} else {
		  return false;
		}
	}
	isAnyoneEditabelStu() {
		let anyoneeditable = false;
		this.studentArray.forEach(element => {
		  if(element.is_editable === '1') {
			anyoneeditable = true;
		  }
		});
		return anyoneeditable;
	}
}

