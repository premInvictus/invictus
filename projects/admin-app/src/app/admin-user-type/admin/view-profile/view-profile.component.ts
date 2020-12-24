import { Component, OnInit } from '@angular/core';
import { QelementService } from '../../../questionbank/service/qelement.service';
import { AdminService } from '../../../_services/admin.service';
import { environment } from '../../../../../../../src/environments/environment';
import * as Highcharts from 'highcharts';
import { UserAccessMenuService, NotificationService } from '../../../_services';
import { ErpCommonService, CommonAPIService } from 'src/app/_services/index';
// import { PreviewDocumentComponent } from '../../../shared-module/preview-document/preview-document.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BranchChangeService } from 'src/app/_services/branchChange.service';
import { DatePipe } from '@angular/common';

declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/treemap')(Highcharts);
require('highcharts/modules/funnel')(Highcharts);
require('highcharts/highcharts-3d')(Highcharts);


@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  hosturl = environment.apiAxiomUrl;
	qtptData: any = {};
	qtptDataInReview: any = {};
	topperArray: any[] = [];
	topperclassArray: any[] = [];
	sessionArray: any[] = [];
	session: any;
	pastExamArray: any[] = [];
	comingExamArray: any[] = [];
	finalPastExamArray: any[] = [];
	finalComingExamArray: any[] = [];
	workanalysisdiv = false;
	threedchart: any = {
		chart: {
			type: 'column',
			options3d: {
				enabled: true,
				alpha: 0,
				beta: 15,
				viewDistance: 25,
				depth: 60
			}
		},

		title: {
			text: 'Overall Work Analysis'
		},

		xAxis: {
			categories: ['Q.Bank', 'Template', 'Paper', 'Result'],
			labels: {
				skew3d: true,
				style: {
					fontSize: '14px'
				}
			},
		},

		yAxis: {
			allowDecimals: false,
			min: 0,
			title: {
				text: 'Current Work Status',
				skew3d: true
			}
		},

		tooltip: {
			headerFormat: '<b>{point.key}</b><br>',
			pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} / {point.stackTotal}'
		},

		plotOptions: {
			column: {
				stacking: 'normal',
				depth: 40
			}
		},

		series: [{
			name: 'In Review',
			color: '#83d7c6',
		}, {
			name: 'Publish',
			color: '#04CDE4'
		}]
	};

	teacherInfoArray: any = {};
	today = Date.now();
	currentUser: any = {};
	getUserDetail: any[] = [];
	userAccessClass: any[] = [];

	usernane: any = '';

	login_id: string;
	image: string;
	userDetail: any;
	subjectArray: any[];
	classArray: any[];

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
	timetableArray: any[] = [];
	periodSup = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
	weekArr: any[] = ['Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday'];
	week: any[] = ['Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday'];
	userDetails: any;
	leave_credit = 0;
	leave_granted = 0;
	monthDays: any[] = [];
	week_day: number;
	todaysDate = new Date();
	sub_id;
	dataMonth = 0;
	dataSession = 0
	assignmentArray: any[] = [];
	gaugeOptionsflag = false;
	gaugeOptions: any;
	currentAssignment: any;
	currentAssignmentIndex: number;
	assignmentPre = true;
	assignmentNext = true;
	tsubArr: any[] = [];
	tclassArr: any[] = [];
	tsecArr: any[] = [];
	aparamform: FormGroup;
	workingDay = 0;
	holidayArr: any[];
	sessionLeave: any;
	sessionValue = 4;
	defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
	constructor(
		private qelementService: QelementService,
		
		private notif: NotificationService,
		private userAccessMenuService: UserAccessMenuService,
		private erpCommonService: ErpCommonService,
		public dialog: MatDialog,
		private commonAPIService: CommonAPIService,
		private fb: FormBuilder,
		private branchChangeService: BranchChangeService
	) { }

	ngOnInit() {
		this.getDaySpace();
		this.setTeacherDashboard();
		this.branchChangeService.branchSwitchSubject.subscribe((data: any) => {
			if (data) {
				this.setTeacherDashboard();
			}
		});
		this.getUserDetailsHr();
		// this.getAttendanceReport();
	}

	getUserDetailsHr() {
		this.userAccessMenuService.getAllUser({ emp_login_id: this.currentUser.login_id }).subscribe(
			(result: any) => {
				// console.log("i am result", result, result);
				if (result && result.length > 0) {
					this.userDetails = result[0];
					this.getAttendanceReport();
					if(this.userDetails.emp_profile_pic){
						this.defaultsrc = this.userDetails.emp_profile_pic;
					}
					if (this.userDetails && this.userDetails.emp_month_attendance_data) {
						// console.log("i am here inside", this.userDetails.emp_month_attendance_data);

						this.userDetails.emp_month_attendance_data.forEach(element => {
							// console.log("i am session",);

							if (element.ses_id == JSON.parse(localStorage.getItem('session')).ses_id) {
								if (element.month_data && element.month_data.length > 0) {
									const tempmonthdata = element.month_data[element.month_data.length - 1];
									// console.log('tempmonthdata', tempmonthdata); 

									tempmonthdata.attendance_detail.emp_leave_credited.forEach(e => {
										this.leave_credit += (e.leave_value ? Number(e.leave_value) : 0);
									});
									tempmonthdata.attendance_detail.emp_leave_granted.forEach(e => {
										this.leave_credit -= (e.leave_value ? Number(e.leave_value) : 0);
									})


									element.month_data.forEach(e => {
										e.attendance_detail.emp_leave_granted.forEach(x => {
											this.leave_granted += (x.leave_value ? Number(x.leave_value) : 0);
										})
									})
								}
							}
						});
					}
				}
			}
		);
	}

	getAttendanceReport() {
		console.log("in here");

		const inputJson = {
			month_id: new Date().getMonth() + 1,
			ses_id: JSON.parse(localStorage.getItem('session')).ses_id,
		}


		this.commonAPIService.getGlobalSetting({ gs_alias: 'attendance_calculation' }).subscribe(
			(res: any) => {
				console.log("i am res", res, res.data[0].gs_value)
				if (res.data[0].gs_value == "manual") {
					this.commonAPIService.getAllEmployeeLeaveData(inputJson).subscribe(
						(result: any) => {
							console.log("i am cennn", result);
							
							// if (result != undefined && result.length != 0) {
							if (result != undefined && result.length != 0) {
								let arr = [];
								var t = new Date();
								let count = 0;
								let present = 0;
								for (let i = 0; i < t.getDate(); i++) {
									// console.log("sssssssss");

									// console.log("i am here", new Date(resp[i - count].entrydate).getDate(),resp[i - count] );

									if (i + 1 == new Date(result[i - count].entrydate).getDate()) {

										let stat1 = result[i - count].employeeList;
										// console.log("i am stat1", stat1);
										// let stat = stat1.find(e => e.emp_id == 1);
										// console.log("i am stat", stat);

										let stat = (stat1 as any).filter((item: any) => item.emp_id == 1)[0];
										// console.log("i am stat", stat);

										if (stat != undefined && stat.leave_half_day == true) {
											present += 1
											arr.push({
												day: i + 1,
												value: "#2C6E06"
											})
										} else if ((stat != undefined && stat.attendance == 1)) {
											present += 1
											arr.push({
												day: i + 1,
												value: "#30B835"
											})
										} else {
											arr.push({
												day: i + 1,
												value: "#F63B3B"
											})
										}
									} else {
										arr.push({
											day: i + 1,
											value: "#F6B838"
										})
										count += 1;
									}
								}
								for (let i = t.getDate(); i < new Date(t.getFullYear(), t.getMonth() + 1, 0, 23, 59, 59).getDate(); i++) {
									arr.push({
										day: i + 1,
										value: "#ffffff"
									})
								}

								this.dataMonth = Math.round(present * 100 / result.length);

								if (arr.length == 0) {
									for (let i = 0; i < new Date(t.getFullYear(), t.getMonth() + 1, 0, 23, 59, 59).getDate(); i++) {
										arr.push({
											day: i + 1,
											value: "#ffffff"
										})
									}
								}
								// console.log("i am arr", arr);

								for (let i = 0; i < this.holidayArr.length; i++) {
									// console.log("i am focal point", new Date(this.holidayArr[i]).getDate());
									arr[new Date(this.holidayArr[i]).getDate() - 1].value = "#F6B838"

								}
								this.monthDays = this.monthDays.concat(arr);

							} else {
								let arr = [];
								var t = new Date();
								for (let i = 0; i < new Date(t.getFullYear(), t.getMonth() + 1, 0, 23, 59, 59).getDate(); i++) {
									arr.push({
										day: i + 1,
										value: "#ffffff"
									})
								}
								for (let i = 0; i < this.holidayArr.length; i++) {
									// console.log("i am focal point", new Date(this.holidayArr[i]).getDate());
									arr[new Date(this.holidayArr[i]).getDate() - 1].value = "#F6B838"

								}
								this.monthDays = this.monthDays.concat(arr);
							}

							this.getHighChart();;
						}
					);

				} else {
					this.commonAPIService.getShiftAttendance(inputJson).subscribe(
						(result: any) => {
							if (result != undefined && result.length != 0) {
								let arr = [];
								var t = new Date();
								let count = 0;
								let present = 0;
								for (let i = 0; i < t.getDate(); i++) {
									if (i + 1 == new Date(result[i - count].created_on).getDate()) {
										let stat = [];
										stat = result[i - count].employeeList.find(element => (element.emp_code_no == this.userDetails.emp_id));
										if (stat != undefined) {
											present += 1
											arr.push({
												day: i + 1,
												value: "#30B835"
											})
										}
										else {
											arr.push({
												day: i + 1,
												value: "#F63B3B"
											})
										}
									} else {
										arr.push({
											day: i + 1,
											value: "#F6B838"
										})
										count += 1;
									}
								}
								for (let i = t.getDate(); i < new Date(t.getFullYear(), t.getMonth() + 1, 0, 23, 59, 59).getDate(); i++) {
									arr.push({
										day: i + 1,
										value: "#ffffff"
									})
								}

								this.dataMonth = Math.round(present * 100 / result.length);

								if (arr.length == 0) {
									for (let i = 0; i < new Date(t.getFullYear(), t.getMonth() + 1, 0, 23, 59, 59).getDate(); i++) {
										arr.push({
											day: i + 1,
											value: "#ffffff"
										})
									}
								}
								for (let i = 0; i < this.holidayArr.length; i++) {
									// console.log("i am focal point", new Date(this.holidayArr[i]).getDate());
									arr[new Date(this.holidayArr[i]).getDate() - 1].value = "#F6B838"

								}
								this.monthDays = this.monthDays.concat(arr);

							} else {
								let arr = [];
								var t = new Date();
								for (let i = 0; i < new Date(t.getFullYear(), t.getMonth() + 1, 0, 23, 59, 59).getDate(); i++) {
									arr.push({
										day: i + 1,
										value: "#ffffff"
									})
								}
								for (let i = 0; i < this.holidayArr.length; i++) {
									// console.log("i am focal point", new Date(this.holidayArr[i]).getDate());
									arr[new Date(this.holidayArr[i]).getDate() - 1].value = "#F6B838"

								}
								this.monthDays = this.monthDays.concat(arr);
							}

							this.getHighChart();



						}
					);
				}
			}
		)





	}

	getHighChart() {
		const inputJson2 = {
			emp_code_no: !this.userDetails.emp_id ? this.userDetails.emp_code_no : this.userDetails.emp_id,
			ses_id: JSON.parse(localStorage.getItem('session')).ses_id,
		}
		function formatDate(date) {
			var d = new Date(date),
				month = '' + (d.getMonth() + 1),
				day = '' + d.getDate(),
				year = d.getFullYear();

			if (month.length < 2)
				month = '0' + month;
			if (day.length < 2)
				day = '0' + day;

			return [year, month, day].join('-');
		}

		this.commonAPIService.getSchool().subscribe(
			(res: any) => {

				let data = res.data[0];
				this.sessionValue = data.session_start_month

				let workingDayParam: any = {};
				workingDayParam.datefrom = formatDate(` ${this.sessionValue} 1 ${new Date().getFullYear()}`);
				workingDayParam.dateto = formatDate(new Date());
				workingDayParam.class_id = 1;

				console.log("i am vvvvvv ", workingDayParam);



				this.commonAPIService.GetHolidayDays(workingDayParam).subscribe(
					(res: any) => {
						this.workingDay = res.data.workingDay
						this.commonAPIService.getShiftSeasonAttendance(inputJson2).subscribe(res => {
							console.log("i am sessionLeave", res);

							this.sessionLeave = res;
							this.dataSession = Math.round(this.sessionLeave.length * 100 / this.workingDay);
							this.HighChartOption(this.dataMonth, this.dataSession);
						})
					}
				)

			}
		)



	}

	getDaySpace() {
		var date = new Date();
		var dayOne = new Date(date.getFullYear(), date.getMonth(), 1);
		var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)
		for (let i = 0; i < dayOne.getDay(); i++) {
			this.monthDays.unshift({
				day: "",
				value: "white"
			})
		}
		const inputJson: any = {};
		inputJson.datefrom = new DatePipe('en-in').transform(dayOne, 'yyyy-MM-dd');
		inputJson.dateto = new DatePipe('en-in').transform(lastDay, 'yyyy-MM-dd');

		this.commonAPIService.getHolidayOnly(inputJson).subscribe(
			(res: any) => {
				console.log("i am response json", res);
				this.holidayArr = res.data;

			}
		)

	}

	setTeacherDashboard() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		for (let i = 0; i < this.currentUser.full_name.length; i++) {
			if (this.currentUser.full_name[i] === ' ') {
				break;
			} else {
				this.usernane = this.usernane + this.currentUser.full_name[i];
			}
			this.usernane = this.usernane.charAt(0).toUpperCase() + this.usernane.slice(1);
		}
		// this.getUserDetailsHr();
		// console.log("i am currentUser", this.currentUser);
		// this.getPastScheduledExams();
		this.getComingScheduledExams();
		// this.getDashboardReport();
		// this.getStudentLeaderBoard();
		// this.getClassLeaderBoard();

		this.buildForm();
		this.login_id = this.currentUser.login_id;
		this.getSubject();
		this.getClassByTeacherId();
		this.getScheduler();
		// this.HighChartOption()
		this.erpCommonService.getUser({ login_id: this.currentUser.login_id, role_id: '3' }).subscribe(
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
	//HighChartOption(dataMonth,dataSession) when fetching from api
	HighChartOption(dataMonth, dataSession) {

		// dataLabels: {
		// 	format: '<div style="text-align:center"><span style="font-size:25px;color:' +
		// 		('black') + '">{y}%</span><br/>' +
		// 		   '<span style="font-size:12px;color:silver"></span></div>'
		// },
		this.gaugeOptionsflag = true;
		this.gaugeOptions = {
			chart: {
				type: 'solidgauge',
				height: 250,
				width: 250,
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

			// tooltip: {
			//   borderWidth: 0,
			//   backgroundColor: 'none',
			//   shadow: false,
			//   style: {
			// 	fontSize: '14px'
			//   },
			//   pointFormat: '{series.name}<br><span style="font-size:16px; color: {point.color}; font-weight: bold;">{point.y}</span>',
			//   positioner: function (labelWidth) {
			// 	return {
			// 	  x: (this.chart.chartWidth - labelWidth) / 40,
			// 	  y: (this.chart.plotHeight / 2) - 117
			// 	};
			//   }
			// },

			tooltip: {
				borderWidth: 0,
				backgroundColor: 'none',
				shadow: false,
				style: {
					fontSize: '14px'
				},
				valueSuffix: '%',
				pointFormat: '<span style="font-size:1.5em; color: {point.color}; font-weight: bold">{point.y}</span><br>{series.name}',
				positioner: function (labelWidth) {
					return {
						x: (this.chart.chartWidth - labelWidth) / 2,
						y: (this.chart.plotHeight / 2) - 10
					};
				}
			},

			pane: {
				startAngle: 0,
				endAngle: 360,
				background: [{ // Track for Highest
					outerRadius: '100%',
					innerRadius: '80%',
					backgroundColor: '#d6fed8',
					borderWidth: 0
				},
				{ // Track for Highest
					outerRadius: '80%',
					innerRadius: '60%',
					backgroundColor: '#ede5ff',
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
					dataLabels: {
						enabled: false
					},
					linecap: 'round',
					stickyTracking: false,
					rounded: true
				}
			},

			series: [{
				name: 'Present',
				data: [{
					color: '#14aae1',
					radius: '100%',
					innerRadius: '80%',
					y: dataSession
				}]
			},
			{
				name: 'Present',
				data: [{
					color: '#4b1fd4',
					radius: '80%',
					innerRadius: '60%',
					y: dataMonth
				}]
			}]
		};
	}

	// getDashboardReport() {
	// 	this.qtptData = {};
	// 	this.adminService.getDashboardReport(
	// 		{ qus_status: '1', tp_status: '1', qp_status: '1', es_status: '2', login_id: this.currentUser.login_id }).subscribe(
	// 			(result: any) => {
	// 				if (result && result.status === 'ok') {
	// 					this.qtptData = result.data;
	// 					this.qtptDataInReview = {};
	// 					this.adminService.getDashboardReport(
	// 						{
	// 							qus_status: '0', tp_status: '0',
	// 							qp_status: '0', es_status: '0', login_id: this.currentUser.login_id
	// 						}).subscribe(
	// 							(result2: any) => {
	// 								if (result2 && result2.status === 'ok') {
	// 									this.qtptDataInReview = result2.data;
	// 									this.threedchart.series[0].data = [
	// 										Number(this.qtptDataInReview.qus_count),
	// 										Number(this.qtptDataInReview.tp_count),
	// 										Number(this.qtptDataInReview.qp_count),
	// 										Number(this.qtptDataInReview.es_count)
	// 									];
	// 									this.threedchart.series[1].data = [
	// 										Number(this.qtptData.qus_count),
	// 										Number(this.qtptData.tp_count),
	// 										Number(this.qtptData.qp_count),
	// 										Number(this.qtptData.es_count)
	// 									];
	// 									this.workanalysisdiv = true;
	// 								}
	// 							});
	// 				}
	// 			});
	// }
	// getClassLeaderBoard() {
	// 	this.topperclassArray = [];
	// 	this.adminService.getClassLeaderBoard().subscribe(
	// 		(result: any) => {
	// 			if (result && result.status === 'ok') {
	// 				this.topperclassArray = result.data;
	// 			}
	// 		}
	// 	);
	// }
	getComingScheduledExams() {
		this.examArray = [];
		const inputJson = {
			login_id: this.currentUser.login_id,
			role_id: this.currentUser.role_id,
			fetch_record: 10,
			es_status: '0'
		};
		this.qelementService.getScheduledExam(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.comingExamArray = result.data;
				this.examArray = result.data;
				this.examNavigate(0);
			} else {
				this.currentExam = null;
			}
		});
	}
	getPastScheduledExams() {
		this.examArray = [];
		const inputJson = {
			login_id: this.currentUser.login_id,
			role_id: this.currentUser.role_id,
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
	studentimagesrc(srcstr: string) {
		if (srcstr.length > 0) {
			return this.hosturl + srcstr.substr(1);
		} else if (srcstr === '') {
			return this.hosturl + '/upload/noimage.png';
		} else {
			return srcstr;
		}

	}
	// getStudentLeaderBoard() {
	// 	this.topperArray = [];
	// 	this.adminService.getStudentLeaderBoard().subscribe(
	// 		(result: any) => {
	// 			if (result && result.status === 'ok') {
	// 				this.topperArray = result.data;
	// 			}
	// 		}
	// 	);
	// }
	convertFloat(value) {
		const parseValue = Math.round(value * 100) / 100;
		return parseValue;
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
	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
	}
	startTest(es_id) {
		for (const item of this.comingExamArray) {
			if (item.es_id === es_id) {
				const examscheduledate = new Date(item.es_start_date + ' 00:00:01');
				const today = new Date();
				const year = today.getFullYear();
				const tmon = today.getMonth() + 1;
				const tdate = today.getDate();
				const examstartdate = new Date(year + '-' + (tmon) + '-' + tdate + ' 00:00:01');
				if (+examscheduledate > +examstartdate) {
					this.notif.showSuccessErrorMessage('Exam can not be started prior to the scheduled date', 'error');
				} else if (+examscheduledate < +examstartdate) {
					this.notif.showSuccessErrorMessage('The date of examination has lapsed', 'error');
				} else {
					const url = '/testscreeen/' + es_id;
					const param = 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,location=0,menubar=0,status=0,resizable=0';
					window.open(url, '_blank', param);
				}
				break;
			}
		}
	}
	endTest(value) {
		if (confirm('Do you really wish to end the test') === true) {
			this.qelementService.teacherEndSession({ es_id: value.es_id, eva_status: value.es_qt_status }).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('Exam Ended successfully', 'success');
						this.getComingScheduledExams();
					}
				}
			);
		}
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
		this.erpCommonService.getTeacherwiseTableDetails({ uc_login_id: this.currentUser.login_id }).subscribe((result: any) => {
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
		this.erpCommonService.getSubject({}).subscribe((result: any) => {
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
	previewDocuments(attachmentArray) {
		const attArr: any[] = [];
		if (attachmentArray && attachmentArray.length > 0) {
			attachmentArray.forEach(element => {
				attArr.push({
					file_url: element.atmt_url
				});
			});
			// const dialogRef = this.dialog.open(PreviewDocumentComponent, {
			// 	height: '80%',
			// 	width: '1000px',
			// 	data: {
			// 		index: '',
			// 		images: attArr
			// 	}
			// });
		}
	}
	getClassByTeacherId() {
		this.tclassArr = [];
		this.erpCommonService.getClassByTeacherId({ teacher_id: this.login_id }).subscribe((result: any) => {
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
		this.erpCommonService.getSectionByTeacherIdClassId({
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
		this.erpCommonService.getSubjectByTeacherIdClassIdSectionId({
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
			this.erpCommonService.getAssignment(param).subscribe((result: any) => {
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
		this.erpCommonService.getScheduler({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
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
	currentHour() {
		const currentHour = this.todaysDate.getHours()
		if (currentHour == 0 || currentHour < 12) return "Good Morning"
		else if (currentHour <= 19) return "Good Afternon"
		else return "Good Evening"
	}
}

 