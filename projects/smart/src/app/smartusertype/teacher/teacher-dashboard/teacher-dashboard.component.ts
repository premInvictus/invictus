import { Component, OnInit } from '@angular/core';
import { AxiomService, SisService, SmartService, CommonAPIService } from '../../../_services';
import { PreviewDocumentComponent } from '../../../smart-shared/preview-document/preview-document.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
	selector: 'app-teacher-dashboard',
	templateUrl: './teacher-dashboard.component.html',
	styleUrls: ['./teacher-dashboard.component.css']
})
export class TeacherDashboardComponent implements OnInit {
	image: string;
	currentUser: any = {};
	getUserDetail: any[] = [];
	pastExamArray: any[] = [];
	comingExamArray: any[] = [];
	login_id: string;
	subjectArray: any[];
	classArray: any[];
	userDetail: any;

	timeTableFlag = false;
	dayArray: any[] = [];
	timetableArray: any[] = [];
	periodSup = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
	weekArr: any[] = ['Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday'];
	week: any[] = ['Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday'];
	week_day: number;
	todaysDate = new Date();
	sub_id;
	assignmentArray: any[] = [];
	currentAssignment: any;
	currentAssignmentIndex: number;
	assignmentPre = true;
	assignmentNext = true;
	tsubArr: any[] = [];
	tclassArr: any[] = [];
	tsecArr: any[] = [];
	aparamform: FormGroup;
	// test
	testView = 'past';

	constructor(
		private axiomService: AxiomService,
		private sisService: SisService,
		private smartService: SmartService,
		public dialog: MatDialog,
		private commonAPIService: CommonAPIService,
		private fb: FormBuilder

	) { }

	ngOnInit() {
		this.buildForm();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.login_id = this.currentUser.login_id;
		this.getSubject();
		this.getClassByTeacherId();
		this.getScheduler();
		this.sisService.getUser({ login_id: this.currentUser.login_id, role_id: '3' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.userDetail = result.data[0];
					console.log('userDetail', this.userDetail);
					this.getTeacherwiseTableDetails();
					if (this.userDetail.au_profileimage && this.userDetail.au_profileimage.charAt(0)) {
						this.image = this.userDetail.au_profileimage.substring(1, this.userDetail.au_profileimage.length);
					} else if (this.userDetail.au_profileimage === '') {
						this.image = '/upload/noimage.png';
					} else {
						this.image = this.userDetail.au_profileimage;
					}
				}
			}
		);


	}
	buildForm() {
		this.aparamform = this.fb.group({
			class_id: '',
			sec_id: '',
			sub_id: ''
		});
	}
	getTeacherwiseTableDetails() {
		this.dayArray = [];
		this.timeTableFlag = false;
		const param: any = {};
		param.class_id = this.userDetail.au_class_id;
		param.sec_id = this.userDetail.au_sec_id;
		this.smartService.getTeacherwiseTableDetails({ uc_login_id: this.currentUser.login_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.weekArr = [];
				this.timetableArray = result.data.tabledata;
				const no_of_day = this.timetableArray[0].length - 1;
				console.log('timetableArray', result.data.tabledata);
				for (let i = 0; i < no_of_day; i++) {
					if (Number(result.data.today_day_of_week) - 1 === i) {
						this.weekArr.push('Today');
					} else {
						this.weekArr.push(this.week[i]);
					}
				}
				this.getTimetableOfDay(result.data.day_of_week);
				this.timeTableFlag = true;
			}
		});
	}
	getSubject() {
		this.smartService.getSubject({ sub_timetable: 1 }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log(result.data);
				this.subjectArray = result.data;
			}
		});
	}
	getSubColor(sub_id) {
		let scolor = '#808080';
		this.subjectArray.forEach(item => {
			if (item.sub_id === sub_id) {
				scolor = item.sub_color;
			}
		});
		return scolor;
	}
	getTimetableOfDay(cday) {
		cday = Number(cday);
		this.week_day = cday;
		this.dayArray = [];
		const tlen = this.timetableArray.length;
		for (let i = 0; i < tlen; i++) {
			if (this.timetableArray[i][cday - 1].subject_name === '-') {
				this.timetableArray[i][cday - 1].subject_name = 'Leisure';
			}
			this.dayArray.push(this.timetableArray[i][cday - 1]);
		}
	}
	switchView(testView) {
		this.testView = testView;
	}
	previewDocuments(attachmentArray) {
		const attArr: any[] = [];
		if (attachmentArray && attachmentArray.length > 0) {
			attachmentArray.forEach(element => {
				attArr.push({
					file_url: element.atmt_url
				});
			});
			const dialogRef = this.dialog.open(PreviewDocumentComponent, {
				height: '80%',
				width: '1000px',
				data: {
					index: '',
					images: attArr
				}
			});
		}
	}
	getClassByTeacherId() {
		this.tclassArr = [];
		this.smartService.getClassByTeacherId({ teacher_id: this.login_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.tclassArr = result.data;
				this.aparamform.patchValue({
					class_id: this.tclassArr[0].class_id
				});
				this.getSectionByTeacherIdClassId();
			}
		});
	}
	getSectionByTeacherIdClassId() {
		this.tsecArr = [];
		this.smartService.getSectionByTeacherIdClassId({
			teacher_id: this.login_id,
			class_id: this.aparamform.value.class_id
		}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.tsecArr = result.data;
				this.aparamform.patchValue({
					sec_id: this.tsecArr[0].sec_id
				});
				this.getSubjectByTeacherIdClassIdSectionId();
			}
		});
	}
	getSubjectByTeacherIdClassIdSectionId() {
		this.tsubArr = [];
		this.smartService.getSubjectByTeacherIdClassIdSectionId({
			teacher_id: this.login_id, class_id: this.aparamform.value.class_id,
			sec_id: this.aparamform.value.sec_id
		}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.tsubArr = result.data;
				this.aparamform.patchValue({
					sub_id: this.tsubArr[0].sub_id
				});
				this.getAssignment();
			}
		});
	}
	getAssignment() {
		if (this.aparamform.valid) {
			this.assignmentArray = [];
			if (!this.sub_id) {
				this.sub_id = this.subjectArray[0].sub_id;
			}
			const param: any = {};
			param.teacher_id = this.login_id;
			param.class_id = this.aparamform.value.class_id;
			param.sec_id = this.aparamform.value.sec_id;
			param.sub_id = this.aparamform.value.sub_id;
			// param.from = this.commonAPIService.dateConvertion(this.todaysDate);
			param.from = '2019-05-12';
			param.to = this.commonAPIService.dateConvertion(this.todaysDate);
			param.withDate = true;
			param.as_status = [1];
			this.smartService.getAssignment(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.assignmentArray = result.data;
					this.assignmentNavigate(0);

				}
			});
		}
	}

	assignmentNavigate(index) {
		this.currentAssignmentIndex = index;
		this.currentAssignment = this.assignmentArray[this.currentAssignmentIndex];
		if (this.assignmentArray.length === 1 || this.assignmentArray.length === 0) {
			this.assignmentPre = true;
			this.assignmentNext = true;
		} else if (this.currentAssignmentIndex === this.assignmentArray.length - 1) {
			this.assignmentNext = true;
			this.assignmentPre = false;
		} else if (this.currentAssignmentIndex === 0) {
			this.assignmentNext = false;
			this.assignmentPre = true;
		}

	}
	getScheduler() {
		this.smartService.getScheduler({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
			}
		});
	}
}
