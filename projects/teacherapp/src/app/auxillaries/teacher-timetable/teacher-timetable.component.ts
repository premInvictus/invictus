import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, AxiomService, SisService, SmartService } from '../../_services';
@Component({
	selector: 'app-teacher-timetable',
	templateUrl: './teacher-timetable.component.html',
	styleUrls: ['./teacher-timetable.component.css']
})
export class TeacherTimetableComponent implements OnInit {
	periodSup = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
	teacherwiseFlag = false;
	finalDivFlag = true;
	teacherArray: any[] = [];
	subjectArray: any[] = [];
	subArray: any[] = [];
	classArray: any[] = [];
	sectionArray: any[] = [];
	teacherwiseArray: any[] = [];
	teacherwiseWeekArray: any[] = [];
	finalArr: any[] = []; 
	sessionArray: any[] = [];
	teacherwiseForm: FormGroup;
	teacherId: any; 
	teacherName: any;
	noOfDay: any;
	sum = 0;
	monday = 0;
	tuesday = 0;
	wednesday = 0;
	thursday = 0;
	friday = 0;
	saturday = 0;
	sunday = 0;
	grandTotal = 0;
	currentUser: any;
	session: any;
	schoolInfo: any = {};
	sessionName: any;
	length: any;
	period = 0;
	constructor(
		private fbuild: FormBuilder,
		private smartService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,

	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
	}

	ngOnInit() {
		this.buildForm();
		this.getClassByTeacherId();
		this.getSubjectByTeacherId();
		this.getTeacherwiseTableDetails();
	}
	buildForm() {
		this.teacherwiseForm = this.fbuild.group({
			tt_class_id: '',
			tt_section_id: '',
			tt_subject_id: '',
		});
	}
	// get subject name from existing array
	getSubjectName(value) {
		const ctrIndex = this.subjectArray.findIndex(f => Number(f.sub_id) === Number(value));
		if (ctrIndex !== -1) {
			return this.subjectArray[ctrIndex].sub_name;
		}
	}
	// get subject by teacher
	getSubjectByTeacherId() {
		this.subjectArray = [];
		this.teacherId = this.currentUser.login_id;
		this.smartService.getSubjectByTeacherId({ teacher_id: this.teacherId }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subjectArray = result.data;
			} else {
				this.commonService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	// get class by teacher
	getClassByTeacherId() {
		this.classArray = [];
		this.teacherId = this.currentUser.login_id;
		this.smartService.getClassByTeacherId({ teacher_id: this.teacherId }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.classArray = result.data;
			} else {
				this.commonService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	// get section by class and teacher
	getSectionByTeacherIdClassId() {
		this.teacherId = this.currentUser.login_id;
		this.sectionArray = [];
		const jsonInput = {
			teacher_id: this.teacherId,
			class_id: this.teacherwiseForm.value.tt_class_id
		};		
		this.smartService.getSectionByTeacherIdClassId(jsonInput).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.sectionArray = result.data;
			} else {
				this.commonService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	// get Subject by class,section and teacher
	getSubjectByTeacherIdClassIdSectionId() {
		this.subArray = [];
		this.teacherId = this.currentUser.login_id;
		const jsonInput = {
			teacher_id: this.teacherId,
			class_id: this.teacherwiseForm.value.tt_class_id,
			sec_id: this.teacherwiseForm.value.tt_section_id
		};
		
		this.smartService.getSubjectByTeacherIdClassIdSectionId(jsonInput).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subArray = result.data;
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
		this.teacherId = this.currentUser.login_id;
		this.smartService.getTeacherwiseTableDetails({ uc_login_id: this.teacherId }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.teacherwiseArray = result.data.tabledata;
				this.finalArr = [];
				for (const item of this.teacherwiseArray) {
					for (const dety of item) {
						this.finalArr.push(dety);
					}
				}
				Object.keys(result.data.dataperiod).forEach(key => {
					if (key !== '-') {
						this.teacherwiseWeekArray.push({
							sub_id: key,
							dataArr: result.data.dataperiod[key]
						});
					}
				});
				for (const item of this.teacherwiseWeekArray) {
					for (const titem of item.dataArr) {
						this.grandTotal = this.grandTotal + (Number(titem.count));
						if (titem.day === 'Monday') {
							this.monday = this.monday + (Number(titem.count));
						}
						if (titem.day === 'Tuesday') {
							this.tuesday = this.tuesday + (Number(titem.count));
						}
						if (titem.day === 'Wednesday') {
							this.wednesday = this.wednesday + (Number(titem.count));
						}
						if (titem.day === 'Thursday') {
							this.thursday = this.thursday + (Number(titem.count));
						}
						if (titem.day === 'Friday') {
							this.friday = this.friday + (Number(titem.count));
						}
						if (titem.day === 'Saturday') {
							this.saturday = this.saturday + (Number(titem.count));
						}
						if (titem.day === 'Sunday') {
							this.sunday = this.sunday + (Number(titem.count));
						}
					}
				}
			} else {
				this.teacherwiseArray = [];
				this.finalDivFlag = true;
				this.commonService.showSuccessErrorMessage('No record found', 'error');
			}
		});
	}
	getSum(dety) {
		this.sum = 0;
		for (const titem of dety) {
			if (titem.day !== '-') {
				this.sum = this.sum + (Number(titem.count));
			}
		}
		return this.sum;
	}
}
