import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService, ExamService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
//import { Element } from './additional-subject.model';
import { MatTableDataSource } from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';

@Component({
	selector: 'app-additional-subject',
	templateUrl: './additional-subject.component.html',
	styleUrls: ['./additional-subject.component.css']
})
export class AdditionalSubjectComponent implements OnInit {
	displayedColumns: string[] = ['au_admission_no','au_full_name'];
	studentSubjectArray = [{id: '0', name: 'Subject'}, {id: '1', name: 'Additional'}];
	subjectFlag = false;
	additionalFlag = false;
	finalDivFlag = true;
	submitFlag = false;
	disableApiCall = false;
	firstForm: FormGroup;
	rollNoForm: FormGroup;
	classArray: any[] = [];
	sectionArray: any[] = [];
	subjectArray: any[] = [];
	studentArray: any[] = [];
	currentUser: any;
	session: any;
	ELEMENT_DATA: any[] = [];
	rollNoDataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
	formgroupArray: any[] = [];
	finalArray: any[] = [];
	selectionArray: any[] = [];
	addselectionArray: any[] = [];
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
			syl_mapping_id: '',
			syl_class_id: '',
			syl_section_id: ''
		});
	}
	//  Get Class List function
	getClass() {
		this.datareset();
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
		this.subjectArray = [];
		this.smartService.getSubjectsByClass({ class_id : this.firstForm.value.syl_class_id, sec_id: this.firstForm.value.syl_section_id, sub_isexam: '1'})
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.subjectArray = [];
						const temp = result.data;
						if (temp.length > 0) {
							temp.forEach(element => {
								element.sub_parent_name = '';
							  if (element.sub_parent_id && element.sub_parent_id === '0') {
								const childSub: any[] = [];
								for (const item of temp) {
								  if (element.sub_id === item.sub_parent_id) {
									  item.sub_parent_name = element.sub_name
									childSub.push(item);
								  }
								}
								if(childSub.length > 0) {
									childSub.forEach( e => {
										this.subjectArray.push(e);
									})
								} else {
									this.subjectArray.push(element);
								}
							  }
							});
						}
						this.displayedColumns.push('au_admission_no');
						this.displayedColumns.push('au_full_name');
						this.subjectArray.forEach(element => {
							this.displayedColumns.push('sub'+element.sub_id);
						});
						console.log(this.subjectArray);
					}
				}
			);
	}
	// get section list according to selected class
	getSectionsByClass() {
		this.datareset();
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
	datareset() {
		this.formgroupArray = [];
		this.ELEMENT_DATA = [];
		this.rollNoDataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
		this.subjectFlag = false;
		this.additionalFlag = false;
		this.finalDivFlag = true;
		this.selectionArray = [];
		console.log(this.selectionArray);
	}
	fetchDetails() {
		this.subjectFlag = false;
		this.additionalFlag = false;
		this.finalDivFlag = true;
		this.displayedColumns = 
		this.formgroupArray = [];
		this.ELEMENT_DATA = [];
		this.rollNoDataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
		this.studentArray = [];
		this.addselectionArray = [];
		this.selectionArray = [];
		this.getSubjectsByClass();
		const studentParam: any = {};
		studentParam.au_class_id = this.firstForm.value.syl_class_id;
		studentParam.au_sec_id = this.firstForm.value.syl_section_id;
		studentParam.au_role_id = '4';
		studentParam.au_status = '1';
		this.examService.getClassStudentSubjects(studentParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.studentArray = result.data;
						for (const item of this.studentArray) {
							this.ELEMENT_DATA.push({
								au_admission_no: item.au_admission_no,
								au_full_name: new CapitalizePipe().transform(item.au_full_name),
								au_login_id: item.au_login_id,
							});
							if(item.au_subjects.length > 0) {
								item.au_subjects.forEach(element => {
									this.selectionArray.push({ess_login_id: element.ess_login_id, ess_sub_id: element.sub_id, ess_ses_id: element.ess_ses_id, ess_additional: element.ess_additional});
									if(element.ess_additional === '1') {
										this.addselectionArray.push({ess_login_id: element.ess_login_id, ess_sub_id: element.sub_id, ess_ses_id: element.ess_ses_id, ess_additional: element.ess_additional});
									}
								});
							}
						}
						this.rollNoDataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
						if(this.firstForm.value.syl_mapping_id === '0') {
							this.subjectFlag = true;
						} else {
							this.additionalFlag = true;
						}
						this.finalDivFlag = false;
					} else {
						this.studentArray = [];
						this.ELEMENT_DATA = [];
						this.rollNoDataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
					}
				}
			);
	}
	finalSubmit() {
		if(this.firstForm.value.syl_mapping_id === '0') {
			if(this.selectionArray.length > 0) {
				this.disableApiCall = true;
				this.examService.insertExamSubjectStudent({insertData: this.selectionArray}).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.commonService.showSuccessErrorMessage(result.message, 'success');
						this.datareset();
						this.disableApiCall = false;
						this.firstForm.reset();
					} else {
						this.disableApiCall = false;
					}
				});
			}
		} else {
			if(this.addselectionArray.length > 0) {
				this.disableApiCall = true;
				this.examService.updateExamSubjectStudent({updatetData: this.addselectionArray}).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.commonService.showSuccessErrorMessage(result.message, 'success');
						this.datareset();
						this.disableApiCall = false;
						this.firstForm.reset();
					} else {
						this.disableApiCall = false;
					}
				});
			}
		}
		
	}

	toggleSelection(login_id, sub_id, event) {
		const sindex = this.selectionArray.findIndex(e => e.ess_login_id === login_id && e.ess_sub_id === sub_id);
		if(event.checked) {
			console.log('true');
			this.selectionArray.push({ess_login_id: login_id, ess_sub_id: sub_id, ess_ses_id: this.session.ses_id, ess_additional: this.firstForm.value.syl_mapping_id});
		} else {
			console.log('false');
			this.selectionArray.splice(sindex, 1);
		}
		console.log(this.selectionArray);
	}
	toggleAdditionalSelection(login_id, sub_id, event) {
		const sindex = this.addselectionArray.findIndex(e => e.ess_login_id === login_id && e.ess_sub_id === sub_id);
		if(event.checked) {
			console.log('true');
			this.addselectionArray.push({ess_login_id: login_id, ess_sub_id: sub_id, ess_ses_id: this.session.ses_id, ess_additional: this.firstForm.value.syl_mapping_id});
		} else {
			console.log('false');
			this.addselectionArray.splice(sindex, 1);
		}
		console.log(this.addselectionArray);
	}
	masterToggleSelection(sub_id, event) {
		if(event.checked) {
			this.studentArray.forEach(element => {
				const sindex = this.selectionArray.findIndex(e => e.ess_login_id === element.au_login_id && e.ess_sub_id === sub_id);
				if(sindex === -1) {
					this.selectionArray.push({ess_login_id: element.au_login_id, ess_sub_id: sub_id, ess_ses_id: this.session.ses_id, ess_additional: this.firstForm.value.syl_mapping_id});
				}
			});			
		} else {
			this.selectionArray = this.selectionArray.filter(e => e.ess_sub_id !== sub_id);
		}
	}
	masterToggleAdditionalSelection(sub_id, event) {
		if(event.checked) {
			this.addselectionArray.forEach(element => {
				const sindex = this.addselectionArray.findIndex(e => e.ess_login_id === element.au_login_id && e.ess_sub_id === sub_id);
				if(sindex === -1) {
					this.addselectionArray.push({ess_login_id: element.au_login_id, ess_sub_id: sub_id, ess_ses_id: this.session.ses_id, ess_additional: this.firstForm.value.syl_mapping_id});
				}
			});			
		} else {
			this.addselectionArray = this.addselectionArray.filter(e => e.ess_sub_id !== sub_id);
		}
	}
	isSelected(login_id, sub_id) {
		const sindex = this.selectionArray.findIndex(e => e.ess_login_id === login_id && e.ess_sub_id === sub_id);
		if(sindex === -1) {
			return false;
		} else {
			return true;
		}
	}
	isAdditionalSelected(login_id, sub_id) {
		const sindex = this.addselectionArray.findIndex(e => e.ess_login_id === login_id && e.ess_sub_id === sub_id && e.ess_additional === '1');
		if(sindex === -1) {
			return false;
		} else {
			return true;
		}
	}
	isDisabled(login_id, sub_id) {
		const sindex = this.selectionArray.findIndex(e => e.ess_login_id === login_id && e.ess_sub_id === sub_id);
		if(sindex === -1) {
			return true;
		} else {
			return false;
		}
	}
	changeMapping(){
		this.datareset();
		this.firstForm.patchValue({
			syl_class_id: '',
			syl_section_id: ''
		})
	}

}
