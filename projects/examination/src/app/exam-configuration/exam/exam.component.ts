import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService, ExamService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';
import { Element } from './exam.model';
import { DecimalPipe } from '@angular/common';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';

@Component({
	selector: 'app-exam',
	templateUrl: './exam.component.html',
	styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {
	displayedColumns: string[] = ['exam_name', 'exam_category', 'exam_class',
		'exam_sub_exam', 'exam_sub_exam_max_marks', 'exam_calculation_rule', 'exam_weightage', 'status', 'action'];
	@ViewChild('deleteModal') deleteModal;
	examForm: FormGroup;
	currentUser: any; 
	session: any;
	ckeConfig: any = {};
	subExamArray: any[] = [];
	ELEMENT_DATA: Element[] = [];
	termArray: any[] = [];
	categoryArray: any[] = [];
	classArray: any[] = [];
	gradeSetArray: any[] = [];
	calculationArray: any[] = [];
	amountDetailArray: any[] = [];
	formGroupArray: any[] = [];
	newAmtDetails: any[] = [];
	updateFlag = false;
	viewOnly = true;
	examDetailsArray: any[] = [];
	param: any = {};
	examDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	constructor(
		public dialog: MatDialog,
		private fbuild: FormBuilder,
		private smartService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
		public examService: ExamService
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
	}
	ngOnInit() {
		this.buildForm();
		this.getTermList();
		this.getExamActivityCategory();
		this.getGradeSet();
		this.getClass();
		this.getSubExam();
		this.getExamCalculation();
		this.getExamDetails();
	}
	buildForm() {
		this.examForm = this.fbuild.group({
			exam_id: '',
			exam_name: '',
			exam_category: '',
			exam_marks_type: '',
			exam_class: '',
			exam_sub_exam: '',
			exam_max_marks: '',
			exam_sub_exam_max_marks: '',
			exam_calculation_rule: '',
			exam_weightage: ''

		});
	}
	resetForm() {
		this.examForm.patchValue({
			'exam_id': '',
			'exam_name': '',
			'exam_category': '',
			'exam_marks_type': '',
			'exam_class': '',
			'exam_sub_exam': '',
			'exam_max_marks': '',
			'exam_sub_exam_max_marks': '',
			'exam_calculation_rule': '',
			'exam_weightage': ''
		});
		this.updateFlag = false;
		this.viewOnly = true;
	}
	// delete dialog open modal function
	openDeleteModal(value) {
		this.param.exam_id = value;
		this.param.text = 'Delete';
		this.deleteModal.openModal(this.param);
	}
	getExamActivityCategory() {
		const inputJson = {};
		this.examService.getExamActivityCategory(inputJson)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.categoryArray = result.data;
					}
				}
			);
	}
	getTermList() {
		this.smartService.getTermList()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.termArray = result.data;
					}
				}
			);
	}
	getGradeSet() {
		this.examService.getDropdownGradeSet({})
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.gradeSetArray = result.data;
					}
				}
			);
	}
	//  Get Class List function
	getClass() {
		const classParam: any = {};
		classParam.role_id = this.currentUser.role_id;
		classParam.login_id = this.currentUser.login_id;
		this.smartService.getClassData(classParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.classArray = result.data;
					}
				}
			);
	}
	getSubExam() {
		const inputJson = {};
		this.examService.getSubExam(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subExamArray = result.data;
			}
		});
	} 
	getExamCalculation() {
		const inputJson = {};
		this.examService.getExamCalculation(inputJson)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.calculationArray = result.data;
					}
				}
			);
	}
	getGradeName(gradeId) {
		for (const item of this.gradeSetArray) {
			if (Number(item.egs_number) === Number(gradeId)) {
				return item.egs_name;
			}
		}
	}
	getMaxMarks($event) {
		let subExamArray: any[] = [];
		this.formGroupArray = [];
		subExamArray = $event.value;
		if (this.newAmtDetails.length === 0) {
			for (const titem of subExamArray) {
				const findex = this.formGroupArray.findIndex(f => Number(f.se_id) === Number(titem));
				if (findex === -1) {
					this.formGroupArray.push({
						se_id: titem,
						sexam_name: this.getSubExamName(titem),
						formGroup: this.fbuild.group({
							'exam_max_marks': ''
						})
					});
				}
			}
		} else {
			for (const item of this.newAmtDetails) {
				for (const titem of subExamArray) {
					const findex = this.formGroupArray.findIndex(f => Number(f.se_id) === Number(titem));
					const findex2 = this.newAmtDetails.findIndex(f => Number(f.se_id) === Number(titem));
					if (findex === -1 && Number(titem) === Number(item.se_id)
						&& findex2 !== -1) {
						this.formGroupArray.push({
							se_id: titem,
							sexam_name: this.getSubExamName(titem),
							formGroup: this.fbuild.group({
								'exam_max_marks': item.head_amt
							})
						});
					}
					if (findex === -1 && findex2 === -1) {
						this.formGroupArray.push({
							se_id: titem,
							sexam_name: this.getSubExamName(titem),
							formGroup: this.fbuild.group({
								'exam_max_marks': ''
							})
						});
					}
				}
			}
		}
	}
	getSubExamName(se_id) {
		const findex = this.subExamArray.findIndex(f => Number(f.se_id) === Number(se_id));
		if (findex !== -1) {
			return this.subExamArray[findex].sexam_name;
		}
	}

	saveForm() {
		let validateFlag = true;
		this.amountDetailArray = [];
		if (this.formGroupArray.length > 0) {
			for (const item of this.formGroupArray) {
				if (item.formGroup.value.exam_max_marks !== '') {
					validateFlag = true;
					this.amountDetailArray.push({
						se_id: item.se_id,
						sexam_name: item.sexam_name,
						exam_max_marks: item.formGroup.value.exam_max_marks
					});
				} else {
					validateFlag = false;
					item.formGroup.controls['exam_max_marks'].markAsDirty();
					break;
				}
			}
		}
		if (this.examForm.valid && validateFlag) {
			this.examForm.value['exam_sub_exam_max_marks'] = this.amountDetailArray;
			const insertJson = {
				exam_name: this.examForm.value.exam_name,
				exam_category: this.examForm.value.exam_category,
				exam_marks_type: this.examForm.value.exam_marks_type,
				exam_class: this.examForm.value.exam_class,
				exam_sub_exam: this.examForm.value.exam_sub_exam,
				exam_sub_exam_max_marks: this.amountDetailArray,
				exam_calculation_rule: this.examForm.value.exam_calculation_rule,
				exam_weightage: this.examForm.value.exam_weightage,
			};
			const updateJson = {
				exam_id: this.examForm.value.exam_id,
				exam_name: this.examForm.value.exam_name,
				exam_category: this.examForm.value.exam_category,
				exam_marks_type: this.examForm.value.exam_marks_type,
				exam_class: this.examForm.value.exam_class,
				exam_sub_exam: this.examForm.value.exam_sub_exam,
				exam_sub_exam_max_marks: this.amountDetailArray,
				exam_calculation_rule: this.examForm.value.exam_calculation_rule,
				exam_weightage: this.examForm.value.exam_weightage,
			};
			if (this.examForm.value.exam_id === '') {
				this.examService.insertExam(insertJson).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.resetForm();
						this.amountDetailArray = [];
						this.formGroupArray = [];
						this.getExamDetails();
						this.commonService.showSuccessErrorMessage(result.message, 'success');
					} else {
						this.commonService.showSuccessErrorMessage(result.message, 'error');
					}
				});
			} else {
				this.examService.updateExam(updateJson).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.resetForm();
						this.amountDetailArray = [];
						this.formGroupArray = [];
						this.getExamDetails();
						this.commonService.showSuccessErrorMessage(result.message, 'success');
					} else {
						this.commonService.showSuccessErrorMessage(result.message, 'error');
					}
				});
			}
		} else {
			this.commonService.showSuccessErrorMessage('Please fill all required field', 'error');
		}
	}

	getExamDetails() {
		this.examDetailsArray = [];
		this.examService.getExamDetails({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.examDetailsArray = result.data;
				this.ELEMENT_DATA = [];
				if (this.examDetailsArray.length > 0) {
					this.examDetailsArray.forEach(item => {
						const pushitem: any = {};
						let sub_exam_name = '';
						if (item.exam_sub_exam_max_marks && item.exam_sub_exam_max_marks.length > 0) {
							for (const cname of item.exam_sub_exam_max_marks) {
								sub_exam_name = sub_exam_name + 'Sub-Exam - ' + cname.sexam_name + ' : Max Marks - ' +
									new DecimalPipe('en-us').transform(cname.exam_max_marks) + ' , ';
							}
							sub_exam_name = sub_exam_name.substring(0, sub_exam_name.length - 2);
						}
						let class_name = '';
						if (item.exam_class && item.exam_class.length > 0) {
							for (const det of item.exam_class) {
								class_name = class_name + det.class_name + ', ';
							}
							class_name = class_name.substring(0, class_name.length - 2);
						}
						pushitem.exam_name = item.exam_name;
						pushitem.exam_category = item.eac_name;
						pushitem.exam_class = class_name;
						pushitem.exam_sub_exam = sub_exam_name;
						pushitem.exam_marks_type = this.getGradeName(item.exam_marks_type);
						pushitem.exam_calculation_rule = item.ecr_name;
						pushitem.exam_weightage = item.exam_weightage;
						// pushitem.status = item.fh_status === '1' ? true : false;
						pushitem.action = item;
						pushitem.status = item;
						pushitem.modify = item.exam_id;
						this.ELEMENT_DATA.push(pushitem);
					});
					this.examDataSource = new MatTableDataSource(this.ELEMENT_DATA);
				}
			}
			this.resetForm();
		});
	}
	formEdit(value) {
		this.updateFlag = true;
		this.viewOnly = false;
		this.setFormValue(value);
	}
	setFormValue(value) {
		this.newAmtDetails = [];
		const subExamArray: any = [];
		this.formGroupArray = [];
		if (value.exam_sub_exam_max_marks) {
			for (const item of value.exam_sub_exam_max_marks) {
				this.formGroupArray.push({
					se_id: item.se_id,
					sexam_name: item.sexam_name,
					formGroup: this.fbuild.group({
						'exam_max_marks': item.exam_max_marks
					})
				});
				subExamArray.push(item.se_id);
			}
			this.newAmtDetails = value.exam_sub_exam_max_marks;
		}
		const class_id = value.class_id ? value.class_id.replace(/\s/g, '').split(',') : [];
		this.examForm.patchValue({
			exam_id: value.exam_id,
			exam_name: value.exam_name,
			exam_category: value.exam_category,
			exam_marks_type: value.exam_marks_type,
			exam_class: class_id,
			exam_sub_exam: subExamArray,
			exam_calculation_rule: value.exam_calculation_rule,
			exam_weightage: value.exam_weightage,
		});
	}
	deleteExam($event) {
		const deleteJson = {
			exam_id: $event.exam_id,
			exam_status: '5'
		};
		this.examService.deleteExam(deleteJson).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.commonService.showSuccessErrorMessage('Deleted Succesfully', 'success');
				this.getExamDetails();
				this.resetForm();
			}
		});
	}
	getActiveStatus(value: any) {
		if (value.exam_status === '1') {
			return true;
		}
	}
	toggleStatus(value: any) {
		if (value.exam_status === '1') {
			value.exam_status = '0';
		} else {
			value.exam_status = '1';
		}
		const statusJson = {
			exam_status: value.exam_status,
			exam_id: value.exam_id
		};
		this.examService.deleteExam(statusJson).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.commonService.showSuccessErrorMessage('Status Changed', 'success');
				this.getExamDetails();
			}
		});
	}

}
