import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, AxiomService, SisService, SmartService } from '../../_services';
import { ZoomMtg } from '@zoomus/websdk';
import { MatTableDataSource } from '@angular/material';

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

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
	today = new Date();
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
	access_key: any;
	week_day: any;
	dayArray: any[];
	timetableArray: any;
	timeTableFlag: boolean;
	ELEMENT_DATA:any= [];
	dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
	displayedColumns = ['snno', 'subject','class','section','start', 'end',  'action'];
	weekArr: any[] = ['Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday'];
	week: any[] = ['Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday'];
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
		this.commonService.getGlobalSetting({ gs_alias: 'onlne_session_key' }).subscribe((res:any) => {
			this.access_key = JSON.parse(res.data[0].gs_value);
		})
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
		let itemNO = 1;
		console.log("i am --------------------", this.dayArray);
		
		this.dayArray.forEach((element:any) => {
			
			let obj:any = {
				snno: itemNO,
				class: element.class_name,
				section: element.sec_name,
				start:element.tsoc_start_time,
				end: element.tsoc_end_time,
				subject: element.subject_name,
				action: element
			}
			this.ELEMENT_DATA.push(obj);
			itemNO++;
		})
		this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
		
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
	openclass(item:any) {
		
		if(item.tsoc_type == 'zoom') {
			let name:any = {}
			this.access_key.forEach(element => {
				if(element.name == 'zoom') {
					name = element;
				}
			});
			console.log("i am element", name);
			
			let spliturl = item.tsoc_url.split('/')[4];
			let mId = spliturl.split('?')[0];
			let pwd = spliturl.split("pwd=")[1];
	
			console.log("i am here", mId, pwd);
			
			
			let signature = ZoomMtg.generateSignature({
				meetingNumber: mId,
				apiKey: name.apiacess,
				apiSecret:  name.apisecret,
				role: '1'
			  });
			  
			  document.getElementById('zmmtg-root').style.display = 'block'
	
			  ZoomMtg.init({
				leaveUrl: window.location.href,
				showMeetingHeader: false, //option
				disableInvite: true, //optional
				disableCallOut: false, //optional
				disableRecord: false, //optional
				disableJoinAudio: false, //optional
				audioPanelAlwaysOpen: true, //optional
				showPureSharingContent: false, //optional
				isSupportAV: true, //optional,
				isSupportChat: true, //optional,
				isSupportQA: true, //optional,
				isSupportPolling: true, //optional
				isSupportBreakout: true, //optional
				isSupportCC: true, //optional,
				screenShare: true, //optional,
				rwcBackup: '', //optional,
				videoDrag: true, //optional,
				sharingMode: 'both', //optional,
				videoHeader: true, //optional,
				isLockBottom: true, // optional,
				isSupportNonverbal: true, // optional,
				isShowJoiningErrorDialog: true, 
				success: (success) => {
				  console.log(success, signature);
		  
				  ZoomMtg.join({
					signature: signature,
					meetingNumber: mId,
					userName:item.tsoc_admin_name,
					apiKey: name.apiacess,
					userEmail: item.tsoc_admin_email,
					passWord: pwd,
					success: (success) => {
					  console.log(success)
					},
					error: (error) => {
					  console.log(error)
					}
				  })
		  
				},
				error: (error) => {
				  console.log(error)
				}
			  }) 
			} else {
				this.commonService.showSuccessErrorMessage( "No class assigned", 'error')
			}
		
	}
}
