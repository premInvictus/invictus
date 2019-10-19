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
	paramform: FormGroup;
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
	responseMarksArray: any[] = [];
	remarksTypeArray: any[] = [
		{ rt_id: 1, rt_name: 'Internal Type' },
		{ rt_id: 2, rt_name: 'External Type' }
	];
	ngOnInit() {
		this.buildForm();
		this.getClass();
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
		this.smartService.getClass({ class_status: '1' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.classArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	getSectionsByClass() {
		this.dataReset();
		this.paramform.patchValue({
			ere_remarks_type:'',
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
	}

	getRemarksType() {
		if (Number(this.paramform.value.ere_remarks_type) === 1) {
			this.tableDivFlag = false;
			this.getSubjectsByClass();
			this.getClassTerm();
			this.getExamDetails();
			this.getSubExam();
			this.getRemarkSet();
			this.dataReset();
		} else {
			this.tableDivFlag = false;
			this.getRemarkSet();
			this.getClassTerm();
			this.subjectArray = [];
			this.subexamArray = [];
			this.examArray = [];
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
		if (Number(this.paramform.value.ere_remarks_type) === 2) {
			if (Number(this.examType) === 1 && this.paramform.value.ere_sub_id === '') {
				this.getSubjectsByClass();
			} else if (Number(this.examType) === 1 && this.paramform.value.ere_sub_id !== '') {
				this.displayExternalType();
			} else {
				this.displayExternalType();
			}
		}
	}
	getSubjectsByClass() {
		this.subjectArray = [];
		this.paramform.patchValue({
			ere_sub_id: ''
		});
		this.smartService.getSubjectsByClass({ class_id: this.paramform.value.ere_class_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subjectArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	getExamDetails() {
		this.examArray = [];
		this.examService.getExamDetails({ exam_class: this.paramform.value.ere_class_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.examArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	getSubExam() {
		this.subexamArray = [];
		this.examService.getSubExam({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subexamArray = result.data;
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
			ere_remarks_type:'',
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
		if (this.paramform.value.ere_sub_exam_id.length > 0) {
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
		this.editTable = false;
		this.remarkArray = [];
		if (this.paramform.valid && this.marksInputArray.length > 0) {
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
					this.displayData();
				}
			});
		}
	}
	saveForm2(status = '0') {
		this.editTable = false;
		this.remarksEntry = [];
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
				this.displayExternalType();
			}
		});

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
}

