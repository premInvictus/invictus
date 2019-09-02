import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService, ExamService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { Element } from './additional-subject.model';
import { MatTableDataSource } from '@angular/material';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';

@Component({
	selector: 'app-additional-subject',
	templateUrl: './additional-subject.component.html',
	styleUrls: ['./additional-subject.component.css']
})
export class AdditionalSubjectComponent implements OnInit {
	displayedColumns: string[] = ['sr_no', 'au_admission_no', 'au_full_name', 'au_roll_no', 'subjects'];
	defaultFlag = false;
	finalDivFlag = true;
	firstForm: FormGroup;
	rollNoForm: FormGroup;
	classArray: any[] = [];
	sectionArray: any[] = [];
	subjectArray: any[] = [];
	studentArray: any[] = [];
	currentUser: any;
	session: any;
	ELEMENT_DATA: Element[] = [];
	rollNoDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	formgroupArray: any[] = [];
	finalArray: any[] = [];
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
		this.getClass();
	}

	buildForm() {
		this.firstForm = this.fbuild.group({
			syl_class_id: '',
			syl_section_id: ''
		});
	}
	//  Get Class List function
	getClass() {
		this.sectionArray = [];
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
	getSubjectsByClass() {
		this.smartService.getSubjectsByClass({ class_id: this.firstForm.value.syl_class_id })
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.subjectArray = result.data;
					} else {
						this.subjectArray = [];
					}
				}
			);
	}
	// get section list according to selected class
	getSectionsByClass() {
		this.firstForm.patchValue({
			'syl_section_id': ''
		});
		const sectionParam: any = {};
		sectionParam.class_id = this.firstForm.value.syl_class_id;
		this.smartService.getSectionsByClass(sectionParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.sectionArray = result.data;
					} else {
						this.sectionArray = [];
					}
				}
			);
	}
	finalCancel() {
		this.formgroupArray = [];
		this.ELEMENT_DATA = [];
		this.defaultFlag = false;
		this.finalDivFlag = true;
		this.firstForm.patchValue({
			'syl_class_id': '',
			'syl_section_id': ''
		});
	}
	fetchDetails() {
		this.formgroupArray = [];
		this.ELEMENT_DATA = [];
		this.getSubjectsByClass();
		const studentParam: any = {};
		studentParam.au_class_id = this.firstForm.value.syl_class_id;
		studentParam.au_sec_id = this.firstForm.value.syl_section_id;
		studentParam.au_role_id = '4';
		studentParam.au_status = '1';
		this.examService.getAdditionalSubjectUser(studentParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.defaultFlag = true;
						this.finalDivFlag = false;
						this.studentArray = result.data;
						let counter = 1;
						for (const item of this.studentArray) {
							this.ELEMENT_DATA.push({
								sr_no: counter,
								au_admission_no: item.au_admission_no,
								au_full_name: new CapitalizePipe().transform(item.au_full_name),
								au_roll_no: item.r_rollno,
								subjects: this.subjectArray,
							});
							counter++;
							this.formgroupArray.push({
								formGroup: this.fbuild.group({
									class_id: this.firstForm.value.syl_class_id,
									sec_id: this.firstForm.value.syl_section_id,
									login_id: item.au_login_id,
									roll_no: item.r_rollno,
									subjects: item.a_subject_id,
									session_id: this.session.ses_id,
									created_by: this.currentUser.login_id

								})
							});
						}
						this.rollNoDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
					} else {
						this.studentArray = [];
					}
				}
			);
	}
	finalSubmit() {
		this.finalArray = [];
		for (const item of this.formgroupArray) {
			this.finalArray.push(item.formGroup.value);
		}
		console.log(this.finalArray);
		// const checkParam: any = {};
		// checkParam.au_class_id = this.firstForm.value.syl_class_id;
		// checkParam.au_sec_id = this.firstForm.value.syl_section_id;
		// checkParam.au_ses_id = this.session.ses_id;

		this.examService.insertAdditionalSubject(this.finalArray).subscribe((result: any) => {
			if (result && result.status === 'ok') {
        this.commonService.showSuccessErrorMessage('Roll No. Inserted Successfully', 'success');
			}
		});






		// this.examService.checkRollNoForClass(checkParam).subscribe((result: any) => {
		// 	if (result && result.status === 'ok') {
		// 		this.examService.updateRollNo(this.finalArray).subscribe((result_u: any) => {
		// 			if (result_u && result_u.status === 'ok') {
		// 				this.finalCancel();
		// 				this.commonService.showSuccessErrorMessage('Roll No. Updated Successfully', 'success');
		// 			} else {
		// 				this.commonService.showSuccessErrorMessage('Update failed', 'error');
		// 			}
		// 		});
		// 	} else {
		// 		this.examService.insertRollNo(this.finalArray).subscribe((result_i: any) => {
		// 			if (result_i && result_i.status === 'ok') {
		// 				this.finalCancel();
		// 				this.commonService.showSuccessErrorMessage('Roll No. Inserted Successfully', 'success');
		// 			} else {
		// 				this.commonService.showSuccessErrorMessage('Insert failed', 'error');
		// 			}
		// 		});
		// 	}
		// });
	}

}
