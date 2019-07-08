import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { AxiomService, SisService, SmartService, CommonAPIService } from '../../_services';

@Component({
	selector: 'app-log-entry-report',
	templateUrl: './log-entry-report.component.html',
	styleUrls: ['./log-entry-report.component.css']
})
export class LogEntryReportComponent implements OnInit {

	paramForm: FormGroup;
	teacherArray: any[] = [];
	classArray: any[] = [];
	sectionArray: any[] = [];
	subjectArray: any[] = [];
	classworkArray: any[] = [];
	teacherId = '';
	currentUser: any = {};
	periodSup = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
	noDataFlag = true;
	toMin = new Date();
	currentTabIndex = 0;
	isTeacher = false;
	constructor(
		private fbuild: FormBuilder,
		private axiomService: AxiomService,
		private sisService: SisService,
		private smartService: SmartService,
		private commonAPIService: CommonAPIService
	) { }
	ngOnInit() {
		this.buildForm();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		if (this.currentUser.role_id === '3') {
			this.teacherId = this.currentUser.login_id;
			this.isTeacher = true;
			this.paramForm.patchValue({
				teacher_id: this.currentUser.login_id
			});
		}
		this.getClass();
		this.getSubject();
	}
	buildForm() {
		this.paramForm = this.fbuild.group({
			teacher_name: '',
			teacher_id: '',
			class_id: '',
			sec_id: '',
			sub_id: '',
			from: [new Date(), Validators.required],
			to: [new Date(), Validators.required]
		});
	}
	setMinTo(event) {
		this.toMin = event.value;
	}
	getTeacherInfo(event) {
		console.log(event.target.value);
		this.teacherArray = [];
		if (event.target.value) {
			this.axiomService.getAllTeacher({ full_name: event.target.value, role_id: '3', status: '1' }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.teacherArray = result.data;
					console.log(result.data);
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
					this.classworkArray = [];
					this.noDataFlag = true;

				}
			});
		}
	}
	setTeacherId(teacherDetails) {
		this.paramForm.patchValue({
			teacher_name: teacherDetails.au_full_name,
			teacher_id: teacherDetails.au_login_id
		});
		this.teacherId = teacherDetails.au_login_id;
		// this.getClasswork();
	}

	getClass() {
		this.classArray = [];
		this.sisService.getClass({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.classArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	getSectionsByClass() {
		this.sectionArray = [];
		this.sisService.getSectionsByClass({ class_id: this.paramForm.value.class_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.sectionArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	getSubject() {
		this.subjectArray = [];
		this.axiomService.getSubject().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subjectArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	setIndex(event) {
		console.log(event);
		this.currentTabIndex = event;
		this.paramForm.patchValue({
			teacher_name: '',
			teacher_id: '',
			class_id: '',
			sec_id: '',
			sub_id: '',
		});
	}


}
