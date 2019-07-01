import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';

@Component({
	selector: 'app-teacher-wise-timetable',
	templateUrl: './teacher-wise-timetable.component.html',
	styleUrls: ['./teacher-wise-timetable.component.css']
})
export class TeacherWiseTimetableComponent implements OnInit {
	periodSup = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
	teacherArray: any[] = [];
	subjectArray: any[] = [];
	teacherwiseArray: any[] = [];
	teacherwiseForm: FormGroup;
	teacherId: any;
	noOfDay: any;
	constructor(
		private fbuild: FormBuilder,
		private smartService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
	) { }

	ngOnInit() {
		this.buildForm();
	}
	buildForm() {
		this.teacherwiseForm = this.fbuild.group({
			teacher_name: '',
			subject_name: ''
		});
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
					this.commonService.showSuccessErrorMessage(result.data, 'error');
				}
			});
		}
	}
	setTeacherId(teacherDetails) {
		this.teacherwiseForm.patchValue({
			teacher_name: teacherDetails.au_full_name,
			cw_teacher_id: teacherDetails.au_login_id
		});
		this.teacherId = teacherDetails.au_login_id;
		this.getSubjectByTeacherId();
		this.getTeacherwiseTableDetails();
	}
	getSubjectByTeacherId() {
		this.subjectArray = [];
		this.smartService.getSubjectByTeacherId({ teacher_id: this.teacherId }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subjectArray = result.data;
			} else {
				this.commonService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	getTeacherwiseTableDetails() {
		this.smartService.getTeacherwiseTableDetails({ uc_login_id: this.teacherId }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.noOfDay = result.data.no_of_day;
				this.teacherwiseArray = result.data.tabledata;
				console.log(this.teacherwiseArray);
			} else {
				this.commonService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
}
