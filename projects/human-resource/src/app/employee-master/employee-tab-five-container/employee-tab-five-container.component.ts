import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { SisService, CommonAPIService, SmartService } from '../../_services/index';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
@Component({
	selector: 'app-employee-tab-five-container',
	templateUrl: './employee-tab-five-container.component.html',
	styleUrls: ['./employee-tab-five-container.component.scss']
})
export class EmployeeTabFiveContainerComponent implements OnInit, OnChanges {
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	panelOpenState = true;
	classSection: FormGroup;
	addOnly = false;
	editOnly = false;
	viewOnly = true;
	saveFlag = false;
	editRequestFlag = false;
	taboneform: any = {};
	login_id = '';
	studentdetails: any = {};
	parentDetails2: any = {};
	addressDetails: any[] = [];
	parentJson: any[] = [];
	reqParamArray = [];
	finalSibReqArray = [];
	finalSibReqArray2 = [];
	checkChangedFieldsArray: any = [];
	finalArray: any[] = [];
	settingsArray: any[] = [];
	classArray: any[] = [];
	sectionArray: any[] = [];
	subjectArray: any[] = [];
	currentUser: any;
	@ViewChild('editReference') editReference;

	constructor(public commonAPIService: CommonAPIService, private fbuild: FormBuilder,
		private syllabusService: SmartService, private sisService: SisService) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

	}

	setActionControls(data) {
		if (data.addMode) {
			this.addOnly = true;
			this.viewOnly = false;
		}
		if (data.editMode) {
			this.editOnly = true;
			this.viewOnly = false;
			this.saveFlag = true;
		}
		if (data.viewMode) {
			this.viewOnly = true;
			this.saveFlag = false;
			this.editRequestFlag = false;

			if (this.addOnly) {
				this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
					if (result.status === 'ok') {
						//this.commonAPIService.studentData.next(result.data[0]);
						this.addOnly = false;
					}
				});
			} else {
				//this.commonAPIService.studentData.next(this.context.studentdetails.studentdetailsform.value.au_enrollment_id);
			}
		}
	}

	ngOnInit() {
		this.buildForm();
		this.getClass();
	}
	ngOnChanges() {
	}
	buildForm() {
		this.classSection = this.fbuild.group({
			syl_class_id: '',
			syl_section_id: '',
			syl_sub_id: '',
		});
	}
	saveForm() {

	}
	updateForm(isview) {
		this.classSection['emp_class_section_detail'] = [
			{
				class_detail: {
					class_id: this.classSection.value.syl_class_id,
					class_name: ''
				},
				section_detail: {
					sec_id: this.classSection.value.syl_section_id,
					sec_name: ''
				},
				subject_detail: {
					sub_id: this.classSection.value.syl_sub_id,
					sub_name: ''
				},
				class_teacher_staus: false,
				status: ''
			}
		];
	}

	//  Get Class List function
	getClass() {
		const classParam: any = {};
		classParam.role_id = this.currentUser.role_id;
		classParam.login_id = this.currentUser.login_id;
		this.syllabusService.getClassData(classParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.classArray = result.data;
					}
				}
			);
		this.classSection.patchValue({
			'syl_sub_id': ''
		});
	}
	// get section list according to selected class
	getSectionsByClass() {
		this.classSection.patchValue({
			'syl_section_id': '',
			'syl_sub_id': ''
		});
		const sectionParam: any = {};
		sectionParam.class_id = this.classSection.value.syl_class_id;
		this.syllabusService.getSectionsByClass(sectionParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.sectionArray = result.data;
						this.getSubjectsByClass();
					} else {
						this.sectionArray = [];
					}
				}
			);
	}
	//  Get Subject By Class function
	getSubjectsByClass(): void {
		this.classSection.patchValue({
			'syl_sub_id': ''
		});
		const subjectParam: any = {};
		subjectParam.class_id = this.classSection.value.syl_class_id;
		this.syllabusService.getSubjectsByClass(subjectParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.subjectArray = result.data;
					} else {
						this.subjectArray = [];
						this.commonAPIService.showSuccessErrorMessage('No Record Found', 'error');
					}
				}
			);
	}
	addlist() {
		if (this.classSection.valid) {
			this.finalArray.push(this.classSection.value);
		}
		console.log(this.finalArray)
	}
	delete(index){
		
	}
	isExistUserAccessMenu(actionT) {
		// if (this.context && this.context.studentdetails) {
		// 	return this.context.studentdetails.isExistUserAccessMenu(actionT);
		// }
	}
	editConfirm() { }
}
