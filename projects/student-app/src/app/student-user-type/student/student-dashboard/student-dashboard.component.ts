import { Component, OnInit} from '@angular/core';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';
import { AdminService } from 'projects/axiom/src/app/user-type/admin/services/admin.service';
import { ReportService } from 'projects/axiom/src/app/reports/service/report.service';
import { appConfig } from 'projects/axiom/src/app/app.config';
import { Event } from 'projects/axiom/src/app/_models/event';
import { SocketService, UserAccessMenuService } from 'projects/axiom/src/app/_services';
import { ErpCommonService, CommonAPIService } from 'src/app/_services/index';

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

	timeTableFlag = false;
	tableData: any[] = [];
	dataArray: any[] = [];
	dayArray: any[] = [];
	todaysDate = new Date();

	constructor(
		private reportService: ReportService,
		private qelementService: QelementService,
		private service: AdminService,
		private socketService: SocketService,
		private userAccessMenuService: UserAccessMenuService,
		private erpCommonService: ErpCommonService

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
		this.login_id = currentUser.login_id;
		this.qelementService.getUser({ login_id: currentUser.login_id, role_id: '4' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.userDetail = result.data[0];
					console.log('userDetail', this.userDetail);
					this.getOverallPerformance();
					this.getPeriodDayByClass();
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
					this.getPastScheduledExams();
					this.getComingScheduledExams();
					this.getSubjectsByClass();
					this.getStudentReportPerSubjectMarks();
					this.getHighestPercentageByStudentInAllExams();
					this.getPercentageByStudentInAllExams();
					this.getStudentRankInAllExams();
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
	getPeriodDayByClass() {
		this.erpCommonService.getPeriodDayByClass({class_id: this.userDetail.au_class_id}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log('getPeriodDayByClass', result.data);
			}
		});
	}
	getTeacherwiseTableDetails() {
		this.erpCommonService.getTeacherwiseTableDetails({ uc_class_id: '9', uc_sec_id: this.userDetail.au_sec_id})
		.subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.tableData = [];
				this.dataArray = [];
				this.tableData = res.data.tabledata;
				let i = 0;
				for (const item of this.tableData) {
					for (const titem of item) {
						if (this.dayArray[Number(this.todaysDate.getDay())] === titem.day) {
							this.dataArray.push({
								index: i + 1,
								data: titem
							});
						}
					}
					i++;
				}
				this.timeTableFlag = true;
			} else {
				this.timeTableFlag = false;
			}
		});
	}
	getComingScheduledExams() {
		const inputJson = {
			es_class_id: this.userDetail.au_class_id,
			es_sec_id: this.userDetail.au_sec_id,
			fetch_record: 10,
			es_status: 'both'
		};
		this.qelementService.getScheduledExam(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.comingExamArray = result.data;
			} else {
				this.comingExamArray = [];
			}
		});
	}
	getPastScheduledExams() {
		const inputJson = {
			es_class_id: this.userDetail.au_class_id,
			es_sec_id: this.userDetail.au_sec_id,
			fetch_record: 10,
			es_status: '2'
		};
		this.qelementService.getScheduledExam(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.pastExamArray = result.data;
			} else {
				this.pastExamArray = [];
			}
		});
	}
	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
}

	getSubjectsByClass(): void {
		this.subjectArray = [];
		this.erpCommonService.getSubjectsByClass({class_id: this.userDetail.au_class_id}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
					for (const item of this.subjectArray) {
						this.subjectNameArray.push(item.sub_name);
					}
				}
			}
		);
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

}
