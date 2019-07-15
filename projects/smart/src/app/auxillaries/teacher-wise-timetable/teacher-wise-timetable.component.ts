import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, AxiomService, SmartService } from '../../_services';

@Component({
	selector: 'app-teacher-wise-timetable',
	templateUrl: './teacher-wise-timetable.component.html',
	styleUrls: ['./teacher-wise-timetable.component.css']
})
export class TeacherWiseTimetableComponent implements OnInit {
	periodSup = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
	teacherwiseFlag = false;
	finalDivFlag = true;
	teacherArray: any[] = [];
	subjectArray: any[] = [];
	teacherwiseArray: any[] = [];
	teacherwiseWeekArray: any[] = [];
	teacherwiseForm: FormGroup;
	teacherId: any;
	noOfDay: any;
	constructor(
		private fbuild: FormBuilder,
		private smartService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
	) { }

	ngOnInit() {
		this.buildForm();
	}
	buildForm() {
		this.teacherwiseForm = this.fbuild.group({
			teacher_name: '',
			subject_id: ''
		});
	}
	// get teacher information
	getTeacherInfo(event) {
		this.teacherArray = [];
		if (event.target.value) {
			this.axiomService.getAllTeacher({ full_name: event.target.value, role_id: '3', status: '1' }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.teacherArray = result.data;
				} else {
					this.commonService.showSuccessErrorMessage(result.data, 'error');
				}
			});
		}
	}
	// get subject name from existing array
	getSubjectName(value) {
		const ctrIndex = this.subjectArray.findIndex(f => Number(f.sub_id) === Number(value));
		if (ctrIndex !== -1) {
			return this.subjectArray[ctrIndex].sub_name;
		}
	}
	// set teacher name
	setTeacherId(teacherDetails) {
		this.teacherwiseForm.patchValue({
			teacher_name: teacherDetails.au_full_name,
			cw_teacher_id: teacherDetails.au_login_id
		});
		this.teacherId = teacherDetails.au_login_id;
		this.getSubjectByTeacherId();
		this.getTeacherwiseTableDetails();
	}

	// get subject by teacher
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

	// get teacherwise timetable details
	getTeacherwiseTableDetails() {
		this.teacherwiseWeekArray = [];
		this.teacherwiseArray = [];
		this.finalDivFlag = false;
		this.teacherwiseFlag = true;
		this.smartService.getTeacherwiseTableDetails({ uc_login_id: this.teacherId }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.teacherwiseArray = result.data.tabledata;
				Object.keys(result.data.dataperiod).forEach(key => {
					if (key !== '-') {
						this.teacherwiseWeekArray.push({
							sub_id: key,
							dataArr: result.data.dataperiod[key]
						});
					}
				});
			} else {
				this.teacherwiseArray = [];
				this.finalDivFlag = true;
				this.commonService.showSuccessErrorMessage('No record found', 'error');
			}
		});
	}
}
