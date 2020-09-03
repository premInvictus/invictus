import { Component, OnInit } from '@angular/core';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';
import { AdminService } from 'projects/axiom/src/app/user-type/admin/services/admin.service';
import { ReportService } from 'projects/axiom/src/app/reports/service/report.service';
import { appConfig } from 'projects/axiom/src/app/app.config';
import { Event } from 'projects/axiom/src/app/_models/event';
import { SocketService, UserAccessMenuService } from 'projects/axiom/src/app/_services';
import { ErpCommonService, CommonAPIService } from 'src/app/_services/index';
import { FormControl } from '@angular/forms';
import { PreviewDocumentComponent } from '../../../shared-module/preview-document/preview-document.component';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
	selector: 'app-student-dashboard',
	templateUrl: './student-dashboard.component.html',
	styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {


	today = Date.now();
	currentUser: any = {};
	getUserDetail: any[] = [];
	pastExamArray: any[] = [];
	comingExamArray: any[] = [];
	usernane: any = '';
	hosturl = appConfig.apiUrl;
	overAllFlag = false;
	loading = false;
	login_id: string;
	subjectArray: any[];
	classArray: any[];
	userDetail: any;
	examMarksArray: any[] = [];
	testArray: any[] = ['Test1', 'Test2', 'Test3', 'Test4', 'Test5', 'Test6', 'Test7', 'Test8', 'Test9', 'Test10'];
	subjectNameArray: any[] = [];
	overallPerformance: any[] = [];
	overallPerformanceTestMark: any[] = [];
	overAllPerformanceDiv = true;
	marks: any;
	seriesArray: any[] = [];
	grade: any;
	overallPerformanceArray: any[];
	image: any = {};
	testTotalMarks: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	testsMarks: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	lastName: any = {};
	admissionNumber: any = {};
	className: any = {};
	secName: any = {};
	dob: any = {};
	address: any = {};
	phoneNumber: any = {};
	emailId: any = {};
	studentResultBoardArray: any[] = [];
	highestMarks: any;
	totalTest: any;
	latestMarks: any;
	currentRank: any;

	currentExam: any;
	currentExamIndex: number;
	examPre = true;
	examNext = true;
	examArray: any[] = [];
	axiomUserDetails: any = {
		class_id: '',
		sec_id: ''
	}
	// test
	testView = 'past';

	timeTableFlag = false;
	dayArray: any[] = [];
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

	msgArray: any[] = [];
	currentmsg: any;
	currentmsgIndex: number;
	msgPre = true;
	msgNext = true;

	noData = false;
	studentdetails:any;
	defaultsrc='';
	class_sec:any;
	sessionArray:any[]=[];
	session:any;
	sessionName:string='';
	sessionAttendance:any;
	monthAttendance:any;
	gaugeOptionsflag=false;
	gaugeOptions:any;
	sessionAttendancechartflag=false;
	sessionAttendancechart:any={};
	monthAttendancechartflag=false;
	monthAttendancechart:any={};

	

	constructor(
		private reportService: ReportService,
		private qelementService: QelementService,
		private service: AdminService,
		private socketService: SocketService,
		private userAccessMenuService: UserAccessMenuService,
		private erpCommonService: ErpCommonService,
		public dialog: MatDialog,
		private commonAPIService: CommonAPIService,
		private router:Router,
		private route:ActivatedRoute

	) { }

	overAllOptions: any = {
		title: {
			text: ''
		},
		xAxis: {
			categories: this.testArray,
			title: {
				text: 'Test Name'
			}
		},
		yAxis: {
			min: 0,
			title: {
				text: 'Marks'
			}
		},
		labels: {
			items: [{
				html: '',
				style: {
					left: '50px',
					top: '18px'
				}
			}]
		},
		colors: ['#04cde4', '#fe756d', '#6610f2', '#3f51b5', '#4caf50', '#e81e63',
			'#fe9800', '#795548', '#374046', '#009688', '#ccdb39', '#9c27b0'],
		series: this.seriesArray
	};

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
		this.login_id = currentUser.login_id;
		this.qelementService.getUser({ login_id: currentUser.login_id, role_id: '4' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.userDetail = result.data[0];
					console.log('userDetail', this.userDetail);
					this.erpCommonService.getStudentInformation({login_id: currentUser.login_id, enrollment_type: '4'}).subscribe((resutl1: any) => {
						if(resutl1 && resutl1.status === 'ok') {
							this.studentdetails = resutl1.data[0];
							this.className = resutl1.data[0].class_name;
							this.secName = resutl1.data[0].sec_name;
							this.dob = resutl1.data[0].au_dob;
							this.phoneNumber = resutl1.data[0].au_mobile;
							this.currentUser['class_id'] = resutl1.data[0] && resutl1.data[0]['class_id'] ? resutl1.data[0]['class_id'] : '';
							localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
							const gender =this.studentdetails.au_gender;
							if (gender === 'M') {
								this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.png';
							} else if (gender === 'F') {
								this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/girl.png';
							} else {
								this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
							}
							this.defaultsrc = this.studentdetails.au_profileimage
								? this.studentdetails.au_profileimage
								: this.defaultsrc;

							const class_name = this.studentdetails.class_name;
							const section_name = this.studentdetails.sec_name;
							if (section_name !== ' ') {
								this.class_sec = class_name + ' - ' + section_name;
							} else {
								this.class_sec = class_name;
							}
						}
					})
					this.getOverallPerformance();
					this.getSmartToAxiom();
					// this.getPeriodDayByClass();
					this.getClassSectionWiseTimeTable();
					this.admissionNumber = this.userDetail.au_admission_no;
					this.className = this.userDetail.class_name;
					this.secName = this.userDetail.sec_name;
					this.dob = this.userDetail.au_dob;
					this.phoneNumber = this.userDetail.au_mobile;
					if (this.userDetail.personal_details[0]) {
						this.address = this.userDetail.personal_details[0].upd_address;
					} else {
						this.address = '';
					}
					this.emailId = this.userDetail.au_email;

					if (this.userDetail.au_profileimage && this.userDetail.au_profileimage.charAt(0)) {
						this.image = this.userDetail.au_profileimage.substring(1, this.userDetail.au_profileimage.length);
					} else if (this.userDetail.au_profileimage === '') {
						this.image = '/upload/noimage.png';
					} else {
						this.image = this.userDetail.au_profileimage;
					}
					// this.getPastScheduledExams();
					// this.getComingScheduledExams();
					this.getSubjectsByClass();
					this.getStudentReportPerSubjectMarks();
					this.getHighestPercentageByStudentInAllExams();
					this.getPercentageByStudentInAllExams();
					this.getStudentRankInAllExams();
					this.getMessages();
					this.getSession();
				}
			}
		);
		for (let i = 0; i < this.currentUser.full_name.length; i++) {
			if (this.currentUser.full_name[i] === ' ') {
				break;
			} else {
				this.usernane = this.usernane + this.currentUser.full_name[i];
			}
			this.usernane = this.usernane.charAt(0).toUpperCase() + this.usernane.slice(1);
		}

		let counter = this.currentUser.full_name.length;
		for (let i = this.currentUser.full_name.length; i > 0; i--) {
			if (this.currentUser.full_name.charAt(i) === ' ') {
				break;
			} else {
				counter--;
			}
		}
		let ctr = 0;
		for (let i = 0; i < this.currentUser.full_name.length; i++) {
			if (this.currentUser.full_name.charAt(i) === ' ') {
				ctr++;
			}
		}
		if (ctr >= 1) {
			this.lastName = this.currentUser.full_name.substring(counter + 1);
			this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1);
		} else {
			this.lastName = '';
		}


	}
	formatDate() {
		var d = new Date(),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
	
		if (month.length < 2) 
			month = '0' + month;
		if (day.length < 2) 
			day = '0' + day;
	
		return [year, month, day].join('-');
	}
	startformatDate() {
		var d = new Date(),
			month = '' + (d.getMonth() + 1),
			year = d.getFullYear();
	
		if (month.length < 2) 
			month = '0' + month;
	
		return [year, month, '01'].join('-');
	}
	getSession(){
		this.erpCommonService.getSession()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						for (const citem of result.data) {
							this.sessionArray[citem.ses_id] = citem.ses_name;
						}
						if (this.session) {
							this.sessionName = this.sessionArray[this.session.ses_id];
							
							this.getStudentDashboardAttendance();
						}

					}
				});
	}
	async getStudentDashboardAttendance(){
		const sessionNameArr = this.sessionName.split('-');
		const param:any={};
		param.from = sessionNameArr[0]+'-04-01';
		param.to = this.formatDate();
		param.au_login_id = this.userDetail.au_login_id;
		await this.erpCommonService.getStudentDashboardAttendance(param).toPromise().then((result: any) => {
			if (result && result.status === 'ok') {
				this.sessionAttendance = result.data;
			}
		});
		const param1:any={};
		param1.from = this.startformatDate();
		param1.to = this.formatDate();
		param1.au_login_id = this.userDetail.au_login_id;
		await this.erpCommonService.getStudentDashboardAttendance(param1).toPromise().then((result: any) => {
			if (result && result.status === 'ok') {
				this.monthAttendance = result.data;
			}
		});
		//this.FeeReceiptReportCalculation(this.sessionAttendance);
		this.sessionChart(this.sessionAttendance);
		this.monthChart(this.monthAttendance);
		this.HighChartOption(this.sessionAttendance);
	}
	HighChartOption(data) {
		this.gaugeOptionsflag = true;
		this.gaugeOptions = {
			chart: {
			  type: 'solidgauge',
			  height: 200,
			  width: 200,
			  events: {
				render: ''
			  }
			},
		
			title: {
			  text: '',
			  style: {
				fontSize: '10px'
			  }
			},
		
			tooltip: {
			  borderWidth: 0,
			  backgroundColor: 'none',
			  shadow: false,
			  style: {
				fontSize: '14px'
			  },
			  pointFormat: '{series.name}<br><span style="font-size:16px; color: {point.color}; font-weight: bold;">{point.y}</span>',
			  positioner: function (labelWidth) {
				return {
				  x: (this.chart.chartWidth - labelWidth) / 40,
				  y: (this.chart.plotHeight / 2) - 117
				};
			  }
			},
		
			pane: {
			  startAngle: 0,
			  endAngle: 360,
			  background: [{ // Track for Highest
				outerRadius: '100%',
				innerRadius: '80%',
				backgroundColor: '#E5E5E5',
				borderWidth: 0
			  }]
			},
		
			yAxis: {
			  min: 0,
			  max: 100,
			  lineWidth: 0,
			  tickPositions: []
			},
		
			plotOptions: {
			  solidgauge: {
				cursor: 'pointer',
				dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                },
				linecap: '',
				stickyTracking: false,
			  }
			},
		
			series: [{
			  name: 'Attendance',
			  data: [{
				color: '#4DB848',
				radius: '100%',
				innerRadius: '80%',
				y: data.attendenceInPercent
			  }],
			  dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ('black') + '">{y}%</span><br/>' +
                       '<span style="font-size:12px;color:silver"></span></div>'
            },
			}]
		  };
	  }
	monthChart(data){
		this.monthAttendancechartflag=true;
		this.monthAttendancechart={
			title: {
				text: '',
				align: 'right',
				margin: 0,
			  },
			  chart: {					
				renderTo: 'container',
				type: 'bar',
				height: 60,
			  },
			  credits: false,
			  tooltip: false,
			  legend: false,
			  navigation: {
				buttonOptions: {
				  enabled: false
				}
			  },
			  xAxis: {
				visible: false,
			  },
			  yAxis: {
				visible: false,
				min: 0,
				max: 100,
			  },
			  series: [{
				data: [100],
				grouping: false,
				animation: false,
				enableMouseTracking: false,
				showInLegend: false,
				color: '#ddd',
				pointWidth: 25,
				borderWidth: 0,
				borderRadiusTopLeft: '50%',
				borderRadiusTopRight: '50%',
				borderRadiusBottomLeft: '50%',
				borderRadiusBottomRight: '50%',
				dataLabels: {
				  className: 'highlight',
				  format: '',
				  enabled: true,
				  align: 'right',
				  style: {
					color: 'white',
					textOutline: false,
				  }
				}
			  }, {
				enableMouseTracking: false,
				data: [data.attendenceInPercent],
				borderRadiusBottomLeft: '50%',
				borderRadiusBottomRight: '50%',
				color: '#004899',
				borderWidth: 0,
				pointWidth: 25,
				animation: {
				  duration: 250,
				},
				dataLabels: {
				  enabled: true,
				  inside: true,
				  align: 'left',
				  format: '{point.y}%',
				  style: {
					color: 'white',
					textOutline: false,
				  }
				}
			  }]
		};
	}
	sessionChart(data){
		this.sessionAttendancechartflag=true;
		this.sessionAttendancechart={
			title: {
				text: '',
				align: 'right',
				margin: 0,
			  },
			  chart: {					
				renderTo: 'container',
				type: 'bar',
				height: 60,
			  },
			  credits: false,
			  tooltip: false,
			  legend: false,
			  navigation: {
				buttonOptions: {
				  enabled: false
				}
			  },
			  xAxis: {
				visible: false,
			  },
			  yAxis: {
				visible: false,
				min: 0,
				max: 100,
			  },
			  series: [{
				data: [100],
				grouping: false,
				animation: false,
				enableMouseTracking: false,
				showInLegend: false,
				color: '#ddd',
				pointWidth: 25,
				borderWidth: 0,
				borderRadiusTopLeft: '50%',
				borderRadiusTopRight: '50%',
				borderRadiusBottomLeft: '50%',
				borderRadiusBottomRight: '50%',
				dataLabels: {
				  className: 'highlight',
				  format: '',
				  enabled: true,
				  align: 'right',
				  style: {
					color: 'white',
					textOutline: false,
				  }
				}
			  }, {
				enableMouseTracking: false,
				data: [data.attendenceInPercent],
				borderRadiusBottomLeft: '50%',
				borderRadiusBottomRight: '50%',
				color: '#3c9211',
				borderWidth: 0,
				pointWidth: 25,
				animation: {
				  duration: 250,
				},
				dataLabels: {
				  enabled: true,
				  inside: true,
				  align: 'left',
				  format: '{point.y}%',
				  style: {
					color: 'white',
					textOutline: false,
				  }
				}
			  }]
		};
	}
	getMessages() {
		this.msgArray = [];
		//var inputJson = {'msg_to.login_id': this.currentUser && this.currentUser['login_id']};
		var inputJson = { 'status.status_name' : 'approved','$or': [{ 'msg_to.login_id': this.currentUser && this.currentUser['login_id'] }, { 'msg_thread.msg_to.login_id': this.currentUser && this.currentUser['login_id'] }] };
		console.log('inputJson--', inputJson);
		// this.erpCommonService.getMessage(inputJson);
		this.commonAPIService.getWebPushNotification({ 'msg_to': this.currentUser.login_id }).subscribe((result: any) => {
			if (result && result.data && result.data[0]) {
				//this.msgArray = result.data;
				let i =0;
				for (const item of result.data) {
					if (i < 10) {
						this.msgArray.push(item);
					}
					i++;
				}
				this.msgNavigate(0);
			}
		});
	}
	getSmartToAxiom() {
		const param: any = {};
		param.tgam_config_type = '1';
		param.tgam_global_config_id = this.userDetail.au_class_id;
		param.tgam_global_sec_id = this.userDetail.au_sec_id;
		this.erpCommonService.getSmartToAxiom(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.axiomUserDetails.class_id = result.data[0].tgam_axiom_config_id;
				this.axiomUserDetails.sec_id = this.userDetail.au_sec_id;
				this.getComingScheduledExams();
			}
		})
	}
	getClassSectionWiseTimeTable() {
		this.dayArray = [];
		this.timeTableFlag = false;
		this.noData = false;
		const param: any = {};
		param.class_id = this.userDetail.au_class_id;
		param.sec_id = this.userDetail.au_sec_id;
		if (this.week_day) {
			param.week_day = this.week_day;
		}
		this.erpCommonService.getClassSectionWiseTimeTable(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.weekArr = [];
				this.dayArray = result.data.data;
				if (!(result.data.data)) {
					this.noData = true;
				}
				this.week_day = Number(result.data.day_of_week);
				console.log('dayArray', this.dayArray);
				this.timeTableFlag = true;
				for (let i = 0; i < result.data.no_of_day; i++) {
					if (Number(result.data.today_day_of_week) - 1 === i) {
						this.weekArr.push('Today');
					} else {
						this.weekArr.push(this.week[i]);
					}
				}
			}
		});
	}
	switchView(testView) {
		this.testView = testView;
		console.log('testview', this.testView);
		if (this.testView === 'past') {
			this.getComingScheduledExams();
		} else {
			this.getPastScheduledExams();
		}
	}
	getComingScheduledExams() {
		this.comingExamArray = [];
		this.examArray = [];
		const inputJson = {
			es_class_id: this.axiomUserDetails.class_id,
			es_sec_id: this.axiomUserDetails.sec_id,
			fetch_record: 10,
			es_status: 'both'
		};
		this.qelementService.getScheduledExam(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.comingExamArray = result.data;
				this.examArray = result.data;
				this.examNavigate(0);
				console.log(this.comingExamArray);
			} else {
				this.currentExam = null;
			}
		});
	}
	getPastScheduledExams() {
		this.pastExamArray = [];
		this.examArray = [];
		const inputJson = {
			es_class_id: this.axiomUserDetails.class_id,
			es_sec_id: this.axiomUserDetails.sec_id,
			fetch_record: 10,
			es_status: '2'
		};
		this.qelementService.getScheduledExam(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.pastExamArray = result.data;
				this.examArray = result.data;
				this.examNavigate(0);

			} else {
				this.currentExam = null;
			}
		});
	}
	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
	}

	getSubjectsByClass(): void {
		this.subjectArray = [];
		this.erpCommonService.getSubjectsByClass({ class_id: this.userDetail.au_class_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
					for (const item of this.subjectArray) {
						this.subjectNameArray.push(item.sub_name);
					}
					this.getAssignment();
				}
			}
		);
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
	getAssignment() {
		this.assignmentArray = [];
		if (!this.sub_id) {
			this.sub_id = this.subjectArray[0].sub_id;
		}
		const param: any = {};
		param.class_id = this.userDetail.au_class_id;
		param.sec_id = this.userDetail.au_sec_id;
		//param.sub_id = this.sub_id;
		// param.from = this.commonAPIService.dateConvertion(this.todaysDate);
		// param.to = this.commonAPIService.dateConvertion(this.todaysDate);
		// param.withDate = true;
		param.as_status = ['1'];
		// {
		// 	class_id: this.userDetail.au_class_id, 
		// 	sec_id: this.userDetail.au_sec_id,
		// 	sub_id: this.sub_id,
		// 	as_status: [1]
		// }
		this.erpCommonService.getAssignment(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.assignmentArray = result.data;
				this.assignmentNavigate(0);

			}
		});
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
		} else {
			this.assignmentPre = false;
			this.assignmentNext = false;
		}

	}
	msgNavigate(index) {
		this.currentmsgIndex = index;
		this.currentmsg = this.msgArray[this.currentmsgIndex];
		if (this.msgArray.length === 1 || this.msgArray.length === 0) {
			this.msgPre = true;
			this.msgNext = true;
		} else if (this.currentmsgIndex === this.msgArray.length - 1) {
			this.msgNext = true;
			this.msgPre = false;
		} else if (this.currentmsgIndex === 0) {
			this.msgNext = false;
			this.msgPre = true;
		} else {
			this.msgPre = false;
			this.msgNext = false;
		}

	}

	examNavigate(index) {
		this.currentExamIndex = index;
		this.currentExam = this.examArray[this.currentExamIndex];
		if (this.examArray.length === 1 || this.examArray.length === 0) {
			this.examPre = true;
			this.examNext = true;
		} else if (this.currentExamIndex === this.examArray.length - 1) {
			this.examNext = true;
			this.examPre = false;
		} else if (this.currentExamIndex === 0) {
			this.examNext = false;
			this.examPre = true;
		} else {
			this.examPre = false;
			this.examNext = false;
		}

	}

	getTotalBySubject(sub_id) {
		let total = 0;
		for (const item of this.examMarksArray) {
			if (item.sub_id === sub_id) {
				total += Number(item.total_mark);
			}
		}
		return total;
	}

	getAverageBySubject(sub_id) {
		let total = 0;
		let countExam = 0;
		for (const item of this.examMarksArray) {
			if (item.sub_id === sub_id) {
				countExam++;
				total += Number(item.total_mark);
			}
		}
		return total / countExam;
	}

	getOverallPerformance() {
		this.overallPerformanceArray = [];
		this.reportService.studentOveralPerformance({ class_id: this.userDetail.au_class_id, login_id: this.login_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					let testMarks: any[] = [];
					let stotal = 0;
					let tcount = 0;
					const ttotal = 0;
					let ttmi = 0;
					this.overallPerformanceArray = result.data;
					for (const item of this.overallPerformanceArray) {
						ttmi = 0;
						stotal = 0;
						tcount = 0;
						testMarks = [];
						testMarks.push(Number(item.T1));
						testMarks.push(Number(item.T2));
						testMarks.push(Number(item.T3));
						testMarks.push(Number(item.T4));
						testMarks.push(Number(item.T5));
						testMarks.push(Number(item.T6));
						testMarks.push(Number(item.T7));
						testMarks.push(Number(item.T8));
						testMarks.push(Number(item.T9));
						testMarks.push(Number(item.T10));
						for (const marks of testMarks) {
							stotal += Number(marks);
							if (Number(marks) > 0) {
								tcount++;
							}
						}
						const subject_avg = stotal / tcount;
						let str = subject_avg.toString();
						if (str === 'NaN') {
							str = '0';
						}
						// tslint:disable-next-line:max-line-length
						this.overallPerformance.push({ sub_total: stotal, sub_avg: str.slice(0, 4), sub_id: item.sub_id, sub_name: item.sub_name, test: testMarks });
						for (const tmark of testMarks) {
							this.testTotalMarks[ttmi++] += Number(tmark);
						}
						this.overallPerformanceTestMark.push({ test_total: ttotal, test_avg: ttotal / ttmi, test: testMarks });
						this.seriesArray.push({
							type: 'spline',
							name: item.sub_name,
							data: testMarks
						});
						this.loading = false;
					}
					// this.overAllOptions.series = this.seriesArray
					this.overAllFlag = true;
				}
			});
	}

	getPercentageColor(value) {
		if (Number(value) > 90) {
			this.grade = 'A1';
			return '#009688';
		} else if (Number(value) > 80) {
			this.grade = 'A2';
			return '#4caf50';
		} else if (Number(value) > 70) {
			this.grade = 'B1';
			return '#04cde4';
		} else if (Number(value) > 60) {
			this.grade = 'B2';
			return '#ccdb39';
		} else if (Number(value) > 50) {
			this.grade = 'C1';
			return '#fe9800';
		} else if (Number(value) > 40) {
			this.grade = 'C2';
			return '#fe756d';
		} else if (Number(value) > 32) {
			this.grade = 'D';
			return '#e81e63';
		} else {
			this.grade = 'E';
			return '#EB1010';
		}
	}
	getStudentReportPerSubjectMarks() {
		const param: any = {};
		param.login_id = this.currentUser.login_id;
		param.class_id = this.userDetail.au_class_id;
		param.section_id = this.userDetail.au_sec_id;
		this.service.getStudentReportPerSubjectMarks(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.studentResultBoardArray = result.data;
			}
		});
	}
	checkImage(value) {
		if (value.toLowerCase().includes('social')) {

			return '/assets/images/subjectwiseimages/socialstudies.svg';
		}
		if (value.toLowerCase().includes('civ')) {

			return '/assets/images/subjectwiseimages/civics.svg';
		}
		if (value.toLowerCase().includes('scie')) {

			return '/assets/images/subjectwiseimages/science.svg';
		}
		if (value.toLowerCase().includes('geo')) {

			return '/assets/images/subjectwiseimages/geography.svg';
		}
		if (value.toLowerCase().includes('physics')) {

			return '/assets/images/subjectwiseimages/physics.svg';
		}
		if (value.toLowerCase().includes('chemis')) {

			return '/assets/images/subjectwiseimages/chemistry.svg';
		}
		if (value.toLowerCase().includes('physical')) {

			return '/assets/images/subjectwiseimages/physicaleducation.svg';
		}
		if (value.toLowerCase().includes('acc')) {

			return '/assets/images/subjectwiseimages/accountancy.svg';
		}
		if (value.toLowerCase().includes('music')) {

			return '/assets/images/subjectwiseimages/music.svg';
		}
		if (value.toLowerCase().includes('eco')) {

			return '/assets/images/subjectwiseimages/economics.svg';
		}
		if (value.toLowerCase().includes('busi')) {

			return '/assets/images/subjectwiseimages/business.svg';
		}
		if (value.toLowerCase().includes('political')) {

			return '/assets/images/subjectwiseimages/politicalscience.svg';
		}
		if (value.toLowerCase().includes('draw')) {

			return '/assets/images/subjectwiseimages/drawing.svg';
		}
		if (value.toLowerCase().includes('knowledge')) {

			return '/assets/images/subjectwiseimages/generalknowledge.svg';
		}
		if (value.toLowerCase().includes('sanskr')) {

			return '/assets/images/subjectwiseimages/sanskrit.svg';
		}
		if (value.toLowerCase().includes('hind')) {

			return '/assets/images/subjectwiseimages/hindi.svg';
		}
		if (value.toLowerCase().includes('engl')) {

			return '/assets/images/subjectwiseimages/english.svg';
		}
		if (value.toLowerCase().includes('biol')) {

			return '/assets/images/subjectwiseimages/biology.svg';
		}
		if (value.toLowerCase().includes('comp')) {

			return '/assets/images/subjectwiseimages/computer.svg';
		}
		if (value.toLowerCase().includes('math')) {

			return '/assets/images/subjectwiseimages/maths.svg';
		}
		if (value.toLowerCase().includes('hist')) {

			return '/assets/images/subjectwiseimages/history.svg';
		}
		if ((value.toLowerCase().includes('evs') || (value.toLowerCase().includes('env')))) {

			return '/assets/images/subjectwiseimages/evs.svg';
		} else {
			return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvODJt31eGtz7SdvI_VDSfF-0n9VI3OBwBVs9VhAzza0nNiH65';
		}


	}
	convertFloat(value) {
		const parseValue = Math.round(value * 100) / 100;
		return parseValue;
	}
	getHighestPercentageByStudentInAllExams() {
		const param: any = {};
		param.login_id = this.login_id;
		param.es_status = '2';
		this.service.getHighestPercentageByStudentInAllExams(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.highestMarks = result.data[0].HighestPercentage;
				this.totalTest = result.data[0].testCount;
			}
		});
	}
	getPercentageByStudentInAllExams() {
		const param: any = {};
		param.login_id = this.login_id;
		param.es_status = '2';
		let marksArray: any[] = [];
		this.service.getPercentageByStudentInAllExams(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				marksArray = result.data;
				for (const item of marksArray) {
					if (item.percentile) {
						this.latestMarks = item.percentile;
						break;
					} else {
						this.latestMarks = 0;
						break;
					}
				}
			}
		});
	}
	getStudentRankInAllExams() {
		const param: any = {};
		param.login_id = this.login_id;
		param.es_status = '2';
		let rankDetail: any = {};
		this.service.getStudentRankInAllExams(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				rankDetail = result.data[0];
				if (rankDetail.rank) {
					this.currentRank = rankDetail.rank;
				} else {
					this.currentRank = rankDetail.Total_Student;
				}
			}
		});
	}
	startTest(examDetail) {

		this.socketService.initSocket();

		this.socketService.onEvent(Event.CONNECT)
			.subscribe(() => {
				if (this.currentUser) {
					const userDetail = {
						examId: examDetail.es_id,
						userId: this.currentUser.login_id,
						paperId: examDetail.es_qp_id,
						schoolId: this.currentUser.Prefix,
						userType: this.currentUser.role_id
					};
					this.socketService.sendUserInformation(userDetail);
					userDetail['action'] = appConfig.testInitiateCode;
					this.socketService.sendUserTestActionDetail(userDetail);
				}
			}
			);
		this.socketService.onEvent(Event.DISCONNECT)
			.subscribe(() => {
				console.log('Disconnected');
			});

		let url = '';
		if (examDetail.es_template_type === '1') {
			url = '/student/test/instruction-screen/' + examDetail.es_id;
		} else if (examDetail.es_template_type === '2') {
			url = 'student/test/jee-mains-instruction/' + examDetail.es_id;
		} else if (examDetail.es_template_type === '3') {
			url = 'student/test/jee-advanced-instruction/' + examDetail.es_id;
		}
		const param = 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,location=0,menubar=0,status=0,resizable=0';
		window.open(url, '_blank', param);
	}
	currentHour() {
		const currentHour = this.todaysDate.getHours()
		if (currentHour == 0 || currentHour < 12) return "Good Morning"
		else if (currentHour <= 19) return "Good Afternon"
		else return "Good Evening"
	}
	viewmore(linkktype){
		if(linkktype=='communication'){
			this.router.navigate(['./notice/notice-board'], { relativeTo: this.route });
		} else if(linkktype=='assignment'){
			this.router.navigate(['./academics/assignment'], { relativeTo: this.route });
		}
	}

}
