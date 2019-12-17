import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService, ExamService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';

@Component({
	selector: 'app-mark-attendance',
	templateUrl: './mark-attendance.component.html',
	styleUrls: ['./mark-attendance.component.css']
})
export class MarkAttendanceComponent implements OnInit {
	submitFlag = false;
	defaultFlag = false;
	finalDivFlag = true;
	entry_date = new Date()
	firstForm: FormGroup;
	attendanceForm: FormGroup;
	classArray: any[] = [];
	sectionArray: any[] = [];
	studentArray: any[] = [];
	currentUser: any;
	session: any;
	formgroupArray: any[] = [];
	finalArray: any[] = [];
	studentAttendanceArray: any[] = [];
	presentFlag: any[] = [];
	absentFlag: any[] = [];
	totalStudent = 0;
	presentStudent = 0;
	absentStudent = 0;
	defaultsrc: any;
	settings: any[] = [];
	attendanceTheme = '1';
	attendanceArray: any[] = [
		{ aid: 0, a_name: 'Absent' },
		{ aid: 1, a_name: 'Present' },
	];
	requiredAll = true;
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
		this.getGlobalSetting();
		this.buildForm();		
		this.getClass();
	}

	buildForm() {
		this.firstForm = this.fbuild.group({
			syl_class_id: '',
			syl_section_id: '',
			cw_entry_date: this.entry_date
		});
		this.attendanceForm = this.fbuild.group({
			attendance: ''
		});
	}

	getGlobalSetting() {
		let param: any = {};
		param.gs_name = ['school_attendance_theme'];
		this.examService.getGlobalSetting(param).subscribe((result: any) => {
		  if (result && result.status === 'ok') {
			this.settings = result.data;
			this.settings.forEach(element => {
			  if (element.gs_alias === 'school_attendance_theme') {
				this.attendanceTheme = element.gs_value;
			  }
			});
		  }
		})
	  }

	resetdata() {
		this.formgroupArray = [];
		this.studentAttendanceArray = [];
		this.studentArray = [];
		this.finalArray = [];
		this.defaultFlag = false;
		this.submitFlag = false;
		this.finalDivFlag = true;
		this.attendanceForm.patchValue({
			'attendance': ''
		});
	}
	resetForm() {
		this.formgroupArray = [];
		this.studentAttendanceArray = [];
		this.studentArray = [];
		this.finalArray = [];
		this.defaultFlag = false;
		this.finalDivFlag = true;
		this.submitFlag = false;
		this.firstForm.patchValue({
			'syl_class_id': '',
			'syl_section_id': ''
		});
		this.attendanceForm.patchValue({
			'attendance': ''
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
	// get section list according to selected class
	getSectionsByClass() {
		this.resetdata();
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
	fetchDetails() {
		this.presentStudent = 0;
		this.absentStudent = 0;
		this.finalArray = [];
		this.formgroupArray = [];
		this.studentArray = [];
		this.studentAttendanceArray = [];
		const studentParam: any = {};
		studentParam.au_class_id = this.firstForm.value.syl_class_id;
		studentParam.au_sec_id = this.firstForm.value.syl_section_id;
		studentParam.ma_created_date = this.commonService.dateConvertion(this.firstForm.value.cw_entry_date);
		studentParam.au_role_id = '4';
		studentParam.au_status = '1';
		this.examService.getUserAttendance(studentParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.finalDivFlag = false;
						this.defaultFlag = true;
						this.studentArray = result.data;
						let counter = 0;
						for (const item of this.studentArray) {
							if (item.upd_gender === 'M') {
								this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.svg';
							  } else if (item.upd_gender === 'F') {
								this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/girl.svg';
							  } else {
								this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.svg';
							  }
							this.studentAttendanceArray.push({
								sr_no: counter,
								au_profileimage: item.au_profileimage ? item.au_profileimage : this.defaultsrc,
								au_full_name: new CapitalizePipe().transform(item.au_full_name),
								au_roll_no: item.r_rollno,
							});
							this.finalArray.push({
								class_id: this.firstForm.value.syl_class_id ? this.firstForm.value.syl_class_id : '',
								sec_id: this.firstForm.value.syl_section_id ? this.firstForm.value.syl_section_id : '',
								ma_created_date: this.commonService.dateConvertion(this.firstForm.value.cw_entry_date) ? this.commonService.dateConvertion(this.firstForm.value.cw_entry_date) : '',
								login_id: item.au_login_id ? item.au_login_id : '',
								roll_no: item.r_rollno ? item.r_rollno : '',
								attendance: item.ma_attendance ? Number(item.ma_attendance) : '',
								session_id: this.session.ses_id ? this.session.ses_id : '',
								created_by: this.currentUser.login_id ? this.currentUser.login_id : ''
							});
							counter++;
							this.totalStudent = counter;
							if (Number(item.ma_attendance) === 0) {
								this.absentStudent++;
							} else {
								this.presentStudent++;
							}
						}
					}
				});
	}
	markStudentAttendance() {
		this.submitFlag = true;
		if (this.attendanceForm.value.attendance === 0) {
			let counter1 = 0;
			for (const item of this.studentArray) {
				this.finalArray[counter1].attendance = 0;
				counter1++;
				this.absentStudent = counter1;
				this.presentStudent = 0;
			}
		} else {
			let counter1 = 0;
			for (const item of this.studentArray) {
				this.finalArray[counter1].attendance = 1;
				counter1++;
				this.presentStudent = counter1;
				this.absentStudent = 0;
			}
		}
	}
	changeStudentAttendanceStatus($event, i) {
		this.submitFlag = true;
		if (this.finalArray[i].attendance === 1) {
			this.finalArray[i].attendance = 0;
			this.presentStudent--;
			this.absentStudent++;
		} else {			
			this.presentStudent++;
			this.absentStudent--;
			this.finalArray[i].attendance = 1;
		}
	}
	submit() {
		this.requiredAll = true;
		for (const item of this.finalArray) {
			if (item.attendance === '') {
				this.requiredAll = false;
			}
		}
		if (this.requiredAll) {
			const checkParam: any = {};
			checkParam.au_class_id = this.firstForm.value.syl_class_id;
			checkParam.au_sec_id = this.firstForm.value.syl_section_id;
			checkParam.ma_created_date = this.commonService.dateConvertion(this.firstForm.value.cw_entry_date);
			checkParam.au_ses_id = this.session.ses_id;
			this.examService.checkAttendanceForClass(checkParam).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.examService.updateAttendance(this.finalArray).subscribe((result_u: any) => {
						if (result_u && result_u.status === 'ok') {
							this.resetForm();
							this.commonService.showSuccessErrorMessage('Attendance  Updated Successfully', 'success');
						} else {
							this.commonService.showSuccessErrorMessage('Update failed', 'error');
						}
					});
				} else {
					this.examService.insertAttendance(this.finalArray).subscribe((result_i: any) => {
						if (result_i && result_i.status === 'ok') {
							this.resetForm();
							this.commonService.showSuccessErrorMessage('Attendance Marked Successfully', 'success');
						} else {
							this.commonService.showSuccessErrorMessage('Insert failed', 'error');
						}
					});
				}
			});
		} else {
			this.commonService.showSuccessErrorMessage('Mark all student attendance', 'error');
		}

	}

}
