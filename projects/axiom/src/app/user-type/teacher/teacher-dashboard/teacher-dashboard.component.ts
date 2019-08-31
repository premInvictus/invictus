import { Component, OnInit } from '@angular/core';
import { QelementService } from '../../../questionbank/service/qelement.service';
import { AdminService } from '../../admin/services/admin.service';
import { appConfig } from '../../../app.config';
import * as Highcharts from 'highcharts';
import { UserAccessMenuService, NotificationService } from '../../../_services';


declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/treemap')(Highcharts);
require('highcharts/modules/funnel')(Highcharts);
require('highcharts/highcharts-3d')(Highcharts);


@Component({
		selector: 'app-teacher-dashboard',
		templateUrl: './teacher-dashboard.component.html',
		styleUrls: ['./teacher-dashboard.component.css']
})

export class TeacherDashboardComponent implements OnInit {

		hosturl = appConfig.apiUrl;
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
		constructor(
				private qelementService: QelementService,
				private adminService: AdminService,
				private notif: NotificationService,
				private userAccessMenuService: UserAccessMenuService
		) { }

		ngOnInit() {
				this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
				for (let i = 0; i < this.currentUser.full_name.length; i++) {
						if (this.currentUser.full_name[i] === ' ') {
								break;
						} else {
								this.usernane = this.usernane + this.currentUser.full_name[i];
						}
						this.usernane = this.usernane.charAt(0).toUpperCase() + this.usernane.slice(1);
				}
				this.getPastScheduledExams();
				this.getComingScheduledExams();
				this.getDashboardReport();
				this.getStudentLeaderBoard();
				this.getClassLeaderBoard();
		}
		getDashboardReport() {
				this.qtptData = {};
				this.adminService.getDashboardReport(
						{ qus_status: '1', tp_status: '1', qp_status: '1', es_status: '2', login_id: this.currentUser.login_id }).subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												this.qtptData = result.data;
												this.qtptDataInReview = {};
												this.adminService.getDashboardReport(
														{ qus_status: '0', tp_status: '0',
														qp_status: '0', es_status: '0', login_id: this.currentUser.login_id }).subscribe(
																(result2: any) => {
																		if (result2 && result2.status === 'ok') {
																				this.qtptDataInReview = result2.data;
																				this.threedchart.series[0].data = [
																						Number(this.qtptDataInReview.qus_count),
																						Number(this.qtptDataInReview.tp_count),
																						Number(this.qtptDataInReview.qp_count),
																						Number(this.qtptDataInReview.es_count)
																				];
																				this.threedchart.series[1].data = [
																						Number(this.qtptData.qus_count),
																						Number(this.qtptData.tp_count),
																						Number(this.qtptData.qp_count),
																						Number(this.qtptData.es_count)
																				];
																				this.workanalysisdiv = true;
																		}
																});
										}
								});
		}
		getClassLeaderBoard() {
				this.topperclassArray = [];
				this.adminService.getClassLeaderBoard().subscribe(
						(result: any) => {
								if (result && result.status === 'ok') {
										this.topperclassArray = result.data;
								}
						}
				);
		}
		getComingScheduledExams() {
				const inputJson = {
						login_id: this.currentUser.login_id,
						role_id: this.currentUser.role_id,
						fetch_record : 10,
						es_status: '0'
				};
				this.qelementService.getScheduledExam(inputJson).subscribe((result: any) => {
						if (result && result.status === 'ok') {
								this.comingExamArray = result.data;
						}
				});
		}
		getPastScheduledExams() {
				const inputJson = {
						login_id: this.currentUser.login_id,
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
		studentimagesrc(srcstr: string) {
				if (srcstr.length > 0) {
						return this.hosturl + srcstr.substr(1);
				} else if (srcstr === '') {
						return this.hosturl + '/upload/noimage.png';
				} else {
						return srcstr;
				}

		}
		getStudentLeaderBoard() {
				this.topperArray = [];
				this.adminService.getStudentLeaderBoard().subscribe(
						(result: any) => {
								if (result && result.status === 'ok') {
										this.topperArray = result.data;
								}
						}
				);
		}
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
					this.qelementService.teacherEndSession({ es_id: value.es_id, eva_status: value.es_qt_status}).subscribe(
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
