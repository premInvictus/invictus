import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService } from '../../_services';
import { ExamService } from '../../_services/exam.service';
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
	tableDivFlag = false;
	marksInputArray: any[] = [];
	marksInputArray2: any[] = [];
	marksEditable = true;
	responseMarksArray: any[] = [];
	remarksTypeArray: any[] = [
		{ rt_id: 1, rt_name: 'Internal Type' },
		{ rt_id: 2, rt_name: 'CC' },
		{ rt_id: 3, rt_name: 'Non Cc' }
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
		this.paramform.patchValue({
			ere_sec_id: ''
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
		if (this.paramform.value.ere_remarks_type === 3) {
			this.getRollNoUser();
			this.tableDivFlag = true;
		} else {
			this.tableDivFlag = false;
			this.getSubjectsByClass();
			this.getTermList();
			this.getExamDetails();
			this.getSubExam();
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
	getTermList() {
		this.termsArray = [];
		this.smartService.getTermList().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.termsArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	getExamDetails() {
		this.examArray = [];
		this.examService.getExamDetails({}).subscribe((result: any) => {
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
	getRollNoUser() {
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
			this.responseMarksArray = [];
			this.marksInputArray = [];
			this.marksInputArray2 = [];
			this.tableDivFlag = true;
			const param: any = {};
			param.examEntry = this.paramform.value;
			this.examService.getRemarksEntry(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.responseMarksArray = result.data;
					if (result.data.length > 0) {
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
					}
				}
			});

			this.examService.getMarksforRemarksEntry(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					if (result.data.length > 0) {
						this.paramform.value.ere_sub_exam_id.forEach(selement => {
							result.data.forEach(melement => {
								if (selement === melement.examEntry.eme_subexam_id) {
									melement.examEntryMapping.forEach(element => {
										this.marksInputArray2.push({
											es_id: melement.examEntry.eme_subexam_id,
											login_id: element.emem_login_id,											
											mark: element.emem_marks
										});
									});
								}
							});
						});
					}
				}
			});
			console.log('marksInputArray', this.marksInputArray2);
		} else {
			this.marksInputArray = [];
			this.marksInputArray2 = [];
			this.tableDivFlag = false;
		}
	
	}
	checkEditable(es_id, ere_review_status) {
		if (this.responseMarksArray.length > 0) {
			for (const item of this.responseMarksArray) {
				if (item.examEntry.ere_sub_exam_id === es_id) {
					if (item.examEntry.ere_review_status === ere_review_status) {
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
		console.log(this.marksInputArray);
	}

	getInputRemarks(es_id, login_id) {
		const ind = this.marksInputArray.findIndex(e => e.es_id === es_id && e.login_id === login_id);
		if (ind !== -1) {
			return this.marksInputArray[ind].remarks;
		} else {
			return '';
		}
	}

	getInputMarks(es_id, login_id) {
		const ind = this.marksInputArray2.findIndex(e => e.es_id === es_id && e.login_id === login_id);
		if (ind !== -1) {
			return this.marksInputArray2[ind].mark;
		} else {
			return '';
		}
	}

	saveForm(status = '0') {
		if (this.paramform.valid && this.marksInputArray.length > 0) {
			const param: any = {};
			param.examEntry = this.paramform.value;
			param.examEntryMapping = this.marksInputArray;
			param.examEntryStatus = status;
			console.log('save', param);
			this.examService.addReMarksEntry(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.displayData();
				}
			});
		}
	}
}


