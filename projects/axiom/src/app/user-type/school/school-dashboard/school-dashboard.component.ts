import { Component, OnInit } from '@angular/core';
import { QelementService } from '../../../questionbank/service/qelement.service';
import { AdminService } from '../../admin/services/admin.service';
import { appConfig } from '../../../app.config';
import * as Highcharts from 'highcharts';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonAPIService, UserAccessMenuService, NotificationService } from '../../../_services';

export interface PeriodicElement {
		exam: number;
		student: any;
		report: any;
		marks: string;
		total: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
		{ exam: 1, student: 'Hydrogen', report: 1.0079, marks: 'H', total: '80%' },
		{ exam: 1, student: 'Hydrogen', report: 1.0079, marks: 'H', total: '80%' },
		{ exam: 1, student: 'Hydrogen', report: 1.0079, marks: 'H', total: '80%' },
		{ exam: 1, student: 'Hydrogen', report: 1.0079, marks: 'H', total: '80%' },
		{ exam: 1, student: 'Hydrogen', report: 1.0079, marks: 'H', total: '80%' },
		{ exam: 1, student: 'Hydrogen', report: 1.0079, marks: 'H', total: '80%' },
		{ exam: 1, student: 'Hydrogen', report: 1.0079, marks: 'H', total: '80%' },
		{ exam: 1, student: 'Hydrogen', report: 1.0079, marks: 'H', total: '80%' },
		{ exam: 1, student: 'Hydrogen', report: 1.0079, marks: 'H', total: '80%' },
		{ exam: 1, student: 'Hydrogen', report: 1.0079, marks: 'H', total: '80%' },
		{ exam: 1, student: 'Hydrogen', report: 1.0079, marks: 'H', total: '80%' },
		{ exam: 1, student: 'Hydrogen', report: 1.0079, marks: 'H', total: '80%' }
];


declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/treemap')(Highcharts);
require('highcharts/modules/funnel')(Highcharts);

@Component({
		selector: 'app-school-dashboard',
		templateUrl: './school-dashboard.component.html',
		styleUrls: ['./school-dashboard.component.css']
})
export class SchoolDashboardComponent implements OnInit {
		schoolinfoArray: any = {};
		schooldashBoardInfo: any = {};
		pastExamArray: any[] = [];
		comingExamArray: any[] = [];
		classLeaderBoardArray: any[] = [];
		studentLeaderBoardArray: any = [];
		admissionArray: any[] = [];
		imageArray: any[] = [];
		classArray: any[] = [];
		currentUser: any = {};
		dataArray: any[] = [];
		dataTempArray: any[] = [];
		dataArrayFinal: any[] = [];
		dataExamGivenArray: any[] = [];
		dataHeatMapTempArray: any[] = [];
		dataHeatMapArray: any[] = [];
		storeFinalArray: any[] = [];
		storeFinalArray2: any[] = [];
		showHeatMap = false;
		sessionArray: any[] = [];
		session: any;
		monthJSON: any[] = [
				{ month_id: 1, month_name: 'January' },
				{ month_id: 2, month_name: 'February' },
				{ month_id: 3, month_name: 'March' },
				{ month_id: 4, month_name: 'April' },
				{ month_id: 5, month_name: 'May' },
				{ month_id: 6, month_name: 'June' },
				{ month_id: 7, month_name: 'July' },
				{ month_id: 8, month_name: 'August' },
				{ month_id: 9, month_name: 'September' },
				{ month_id: 10, month_name: 'October' },
				{ month_id: 11, month_name: 'November' },
				{ month_id: 12, month_name: 'December' }
		];
		monthArray: any[] = [];
		examSetupPerClassPerMonthArray: any[] = [];
		hosturl = appConfig.apiUrl;
		today = Date.now();
		heatmap: any = {
				chart: {
						type: 'heatmap',
						marginTop: 40,
						marginBottom: 80,
						plotBorderWidth: 1
				},


				title: {
						text: ''
				},

				xAxis: {
						categories: []
				},

				yAxis: {
						categories: [],
						title: {
								text: 'Classes'
						},
				},

				colorAxis: {
						min: 0,
						minColor: '#FFFFFF',
						maxColor: Highcharts.getOptions().colors[0]
				},

				legend: {
						align: 'right',
						layout: 'vertical',
						margin: 0,
						verticalAlign: 'top',
						y: 25,
						symbolHeight: 280
				},

				tooltip: {
						formatter: function () {
								return '<b>' + this.series.yAxis.categories[this.point.y] + '</b> Conducted <br><b>' +
										this.point.value + '</b> Test in <b>' + this.series.xAxis.categories[this.point.x] + '</b>';
						}
				},

				series: [{
						name: 'Test per Class',
						borderWidth: 1,
						data: [],
						dataLabels: {
								enabled: true,
								color: '#000000'
						}
				}]
		};

		displayedColumns: string[] = ['select', 'exam', 'student', 'report', 'marks', 'total'];
		dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
		selection = new SelectionModel<PeriodicElement>(true, []);
		userAccessClass: any[] = [];
		finalPastExamArray: any[] = [];
		finalComingExamArray: any[] = [];

		constructor(
				private qelementService: QelementService,
				private adminService: AdminService,
				private common: CommonAPIService,
				private notif: NotificationService,
				private userAccessMenuService: UserAccessMenuService) { }

		ngOnInit() {
				this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
				this.session = JSON.parse(localStorage.getItem('session'));
				this.getPastScheduledExams();
				this.getComingScheduledExams();
				this.getSchool();
				this.getDashboardDetails();
				this.getClassLeaderBoardData();
				this.getStudentLeaderBoard();
		}
		getComingScheduledExams() {
			this.comingExamArray = [];
				const inputJson = {
						role_id: this.currentUser.role_id,
						fetch_record : 10,
						es_status: 'both'
				};
				this.qelementService.getScheduledExam(inputJson).subscribe((result: any) => {
						if (result && result.status === 'ok') {
								this.comingExamArray = result.data;
						}
				});
		}
		getPastScheduledExams() {
			this.pastExamArray = [];
				const inputJson = {
						role_id: this.currentUser.role_id,
						fetch_record : 10,
						es_status: '2'
				};
				this.qelementService.getScheduledExam(inputJson).subscribe((result: any) => {
						if (result && result.status === 'ok') {
								this.pastExamArray = result.data;
						}
				});
		}
		getSession() {
				this.common.getSession().subscribe((result: any) => {
						if (result && result.status === 'ok') {
								this.sessionArray = result.data;
						}
				});
		}
		getSessionName(id) {
				const findex = this.sessionArray.findIndex(f => f.ses_id === id);
				if (findex !== -1) {
						return this.sessionArray[findex].ses_name;
				}
		}
		getSchool() {
				this.classArray = [];
				this.dataArray = [];
				this.dataTempArray = [];
				this.dataArrayFinal = [];
				this.dataExamGivenArray = [];
				this.dataHeatMapTempArray = [];
				this.dataHeatMapArray = [];
				this.storeFinalArray = [];
				this.storeFinalArray2 = [];
				this.monthArray = [];
				this.schoolinfoArray = [];
				this.sessionArray = [];
				this.qelementService.getSchool().subscribe(
						(result: any) => {
								if (result && result.status === 'ok') {
										this.getSession();
										this.schoolinfoArray = result.data[0];
										const startMonth = this.schoolinfoArray.session_start_month;
										const endMonth = this.schoolinfoArray.session_end_month;
										for (let i = Number(startMonth); i <= Number(endMonth) + 12; i++) {
												for (const item of this.monthJSON) {
														if (i === item.month_id) {
																this.monthArray.push(item.month_name);
														}
														if ((i - 12) === item.month_id) {
																this.monthArray.push(item.month_name);
														}
												}
										}
										this.getExamSetupPerClassPerMonth();
								}
						}
				);

		}

		getDashboardDetails() {
				const param: any = {};
				param.qus_status = '0';
				param.tp_status = '0';
				param.qp_status = '0';
				param.es_status = '2';
				this.adminService.getDashboardReport(param).subscribe(
						(result: any) => {
								if (result && result.status === 'ok') {
										this.schooldashBoardInfo = result.data;
								}
						});
		}

		getClassLeaderBoardData() {
			this.classLeaderBoardArray = [];
				this.adminService.getClassLeaderBoard().subscribe(
						(result: any) => {
								if (result && result.status === 'ok') {
										this.classLeaderBoardArray = result.data;
								}
						}
				);
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
		getStudentLeaderBoard() {
			this.studentLeaderBoardArray = [];
				this.adminService.getStudentLeaderBoard().subscribe(
						(result: any) => {
								if (result && result.status === 'ok') {
										this.studentLeaderBoardArray = result.data;
										for (const item of this.studentLeaderBoardArray) {
												if (item.au_profileimage && item.au_profileimage.charAt(0) === '.') {
														this.imageArray.push(item.au_profileimage.substring(1, item.au_profileimage.length));
												} else if (item.au_profileimage === '') {
														this.imageArray.push('https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.png');
												} else {
														this.imageArray.push(item.au_profileimage);
												}
										}
										for (const item of this.studentLeaderBoardArray) {
												let counter = item.au_full_name.length;
												for (let i = item.au_full_name.length; i > 0; i--) {
														if (item.au_full_name.charAt(i) === '-') {
																break;
														} else {
																counter--;
														}
												}
												this.admissionArray.push(item.au_full_name.substring(counter));
										}
								}
						});
		}
		getExamSetupPerClassPerMonth() {
				const param: any = {};
				this.examSetupPerClassPerMonthArray = [];
				param.year = new Date().getFullYear();
				param.si_prefix = this.currentUser.Prefix;
				this.adminService.getExamSetupPerClassPerMonth(param).subscribe((result: any) => {
						if (result && result.status === 'ok') {
								this.examSetupPerClassPerMonthArray = result.data;
								this.getClass();
						}
				});
		}
		getClass() {
				this.qelementService.getClass().subscribe((result: any) => {
						if (result && result.status === 'ok') {
								let classItemArray: any[] = [];
								this.classArray = [];
								classItemArray = result.data;
								for (const item of classItemArray) {
										this.classArray.push(item.class_name);
								}
								this.getData();
						}
				});
		}
		getData() {
				this.qelementService.getClass().subscribe((result: any) => {
						if (result && result.status === 'ok') {
								let classItemArray: any[] = [];
								this.dataTempArray = [];
								this.dataExamGivenArray = [];
								classItemArray = result.data;
								for (let i = 0; i < this.monthArray.length; i++) {
										for (const item of this.examSetupPerClassPerMonthArray) {
												if (item.MonthName === this.monthArray[i]) {
														for (const item2 of this.examSetupPerClassPerMonthArray) {
																const datavalue: any[] = [];
																const k = 0;
																const findex = classItemArray.findIndex((f) => f.class_id === item.class_id);
																if (item.class_id === item2.class_id) {
																		datavalue[k] = i;
																		datavalue[k + 1] = findex;
																		datavalue[k + 2] = Number(item.total_exam_setup);
																		this.dataTempArray.push(
																				{ month_id: datavalue[k], class_id: datavalue[k + 1], tot_id: datavalue[k + 2] });
																		this.dataExamGivenArray.push(
																				{
																						month_id: datavalue[k],
																						class_id: datavalue[k + 1],
																						tot_id: datavalue[k + 2]
																				});
																		break;
																}
														}
												}

										}
										for (let j = 0; j < this.classArray.length; j++) {
												const datavalue: any[] = [];
												const k = 0;
												datavalue[k] = i;
												datavalue[k + 1] = j;
												datavalue[k + 2] = 0;
												this.dataTempArray.push({ month_id: datavalue[k], class_id: datavalue[k + 1], tot_id: datavalue[k + 2] });
										}
								}
								this.showData();
						}
				});
		}
		showData() {
				this.showHeatMap = false;
				this.dataArrayFinal = [];
				this.dataHeatMapTempArray = [];
				this.storeFinalArray2 = [];
				const counter = 0;
				for (const item1 of this.dataTempArray) {
						for (const item2 of this.dataExamGivenArray) {
								if (item1.class_id === item2.class_id && item1.month_id === item2.month_id && item1.tot_id === 0) {
										this.dataArrayFinal.push({ month_id: item2.month_id, class_id: item2.class_id, tot_id: item2.tot_id });
										break;
								} else {
										continue;
								}

						}
						this.dataArrayFinal.push({ month_id: item1.month_id, class_id: item1.class_id, tot_id: item1.tot_id });
				}
				for (const item of this.dataArrayFinal) {
						const findex = this.dataHeatMapTempArray.findIndex((f) => f.class_id === item.class_id && f.month_id === item.month_id);
						if (findex !== -1) {
								this.dataArrayFinal[findex] = [];

						}
						this.dataHeatMapTempArray.push({ month_id: item.month_id, class_id: item.class_id, tot_id: item.tot_id });


				}
				this.storeFinalArray2 = this.dataArrayFinal;
				if (this.storeFinalArray2) {
						this.storeFinalArray = [];
						for (let i = 0; i < this.storeFinalArray2.length - 1; i++) {
								if (this.storeFinalArray2[i].month_id || this.storeFinalArray2[i].month_id === 0) {
										if (this.storeFinalArray2[i].month_id === this.storeFinalArray2[i + 1].month_id
												&& this.storeFinalArray2[i].class_id === this.storeFinalArray2[i + 1].class_id) {
												this.storeFinalArray2[i + 1] = [];
										}
								}
						}
						this.storeFinalArray = this.storeFinalArray2;
						if (this.storeFinalArray) {
								this.dataHeatMapArray = [];

								for (const item of this.storeFinalArray) {
										if (item.month_id === 0 || item.month_id) {
												const datavalue: any[] = [];
												const k = 0;
												datavalue[k] = item.month_id;
												datavalue[k + 1] = item.class_id;
												datavalue[k + 2] = item.tot_id;
												this.dataHeatMapArray.push(datavalue);
										}

								}
								this.heatmap.yAxis.categories = this.classArray;
								this.heatmap.series[0].data = this.dataHeatMapArray;
								this.heatmap.title.text = '';
								this.heatmap.title.text = 'Test Conducted per Class per Month' + '(' + this.getSessionName(this.session.ses_id) + ')';
								this.showHeatMap = true;
								this.heatmap.xAxis.categories = this.monthArray;
						}

				}
		}
		manipulateData() {
		}
		showHeatMapData() {
		}
		reloadHeatMap() {
				this.showHeatMap = false;
				this.getSchool();
		}
		isExistUserAccessMenu(mod_id) {
				return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
		}
		startTest(es_id) {
				for (const item of this.comingExamArray) {
						if (Number(item.es_id) === Number(es_id)) {
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
										let url: any;
										if (Number(this.currentUser.role_id) === 2) {
										url = '/school/eassessment/testscreeen/' + es_id;
										} else if (Number(this.currentUser.role_id) === 3) {
											url = '/teacher/eassessment/testscreeen/' + es_id;
										}
										const param = 'width='
										+ screen.width + ',height=' + screen.height + ',toolbar=0,location=0,menubar=0,status=0,resizable=0';
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
}
