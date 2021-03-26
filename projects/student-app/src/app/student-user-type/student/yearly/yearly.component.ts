import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ErpCommonService, CommonAPIService } from 'src/app/_services/index';

import * as moment from 'moment';

@Component({
	selector: 'app-yearly',
	templateUrl: './yearly.component.html',
	styleUrls: ['./yearly.component.css']
})
export class YearlyComponent implements OnInit, OnChanges {
	@Input() reloadScheduler;
	nothingToshowText: any = 'Nothing to show'; // "By default" => There are no events scheduled that day.
	colors: any = {
		// holiday: {
		// 	primary: '#1fbcbb',
		// 	secondary: '#1fbcbb'
		// },
		// present: {
		// 	primary: '#eb4d4b',
		// 	secondary: '#eb4d4b'
		// },
		nodata: {
			primary: '#ffffff',
			secondary: '#ffffff',
		},
		holiday: {
			primary: '#F6B83B',
			secondary: '#F6B83B'
		},
		present: {
			primary: '#30B835',
			secondary: '#30B835'
		},
		absent: {
			primary: '#F63B3B',
			secondary: '#F63B3B'
		}
	};
	bgClassColorArray: any = ['step minimized holiday', 'step minimized non-teaching', 'step minimized class-spe'];
	events: any[] = [];
	viewDate: Date;
	themecolor: any = '#0a5ab3';
	schedulerArray: any[] = [];
	schedulerFlag = false;
	ecArray: any[] = [];
	ses_id;
	sessionYear: any[] = [];
	sessionStartMonth;
	sessionEndMonth;
	fromYear;
	studentAttenance:any[]=[];
	constructor(
		private commonAPIService: CommonAPIService,
		private erpCommonService:ErpCommonService
	) { }

	ngOnInit() {
		this.ses_id = JSON.parse(localStorage.getItem('session')).ses_id;
		this.viewDate = new Date();
		this.getStudentAttendence();
		console.log('reloadScheduler',this.reloadScheduler);
	}

	ngOnChanges() {
		// console.log('calling ngonchanges', this.reloadScheduler);
		// if (this.reloadScheduler) {
		// 	this.getStudentAttendence();
		// }
	}

	eventClicked(event) {
	}
	actionClicked(event) {
	}
	async getStudentAttendence(){
		const studentAttenance = [];
		const param:any={};
		param.class_id = this.reloadScheduler.class_id;
		param.sec_id = this.reloadScheduler.sec_id;
		param.fm_id = this.reloadScheduler.fm_id;
		param.au_login_id = this.reloadScheduler.au_login_id;
		await this.erpCommonService.getStudentAttendence(param).toPromise().then((result: any) => {
			if (result && result.status === 'ok') {
				if (result.data.attendence && result.data.attendence.length > 0 && result.data.attendence[0].attendence) {
					const attendence = result.data.attendence[0].attendence;
					const fromDate = moment(this.reloadScheduler.year_id+'-'+this.reloadScheduler.fm_id+'-01');
					const toDate = moment(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));
					console.log('toDate --------------------',toDate, )
					console.log('new Date().getDay()',new Date().getDate())
					for (const i = fromDate; i.diff(toDate, 'days') <= 0; i.add(1, 'days')) {
						const eachEvent: any = {};
						const nowDate = i.toDate();
						const dayOfMonth = i.format('D');
						eachEvent.start = nowDate;
						eachEvent.end = nowDate;
						eachEvent.title = '';
						eachEvent.sc_id = '';

						if (attendence[dayOfMonth] == 'h') {
							eachEvent.color = this.colors.holiday;
						} else if (attendence[dayOfMonth] == '0') {
							eachEvent.color = this.colors.absent;
						} else if (attendence[dayOfMonth] == '1') {
							eachEvent.color = this.colors.present;
						} else if(attendence[dayOfMonth] == '-') {
							eachEvent.color =this.colors.nodata; 
						}
						this.events.push(eachEvent);
					}
					this.schedulerFlag = true;
					console.log('this.events',this.events);
				}
			}
		});
	}
	// getScheduler() {
	// 	this.schedulerArray = [];
	// 	this.ecArray = [];
	// 	this.erpCommonService.getScheduler({}).subscribe((result: any) => {
	// 		if (result && result.status === 'ok') {
	// 			this.schedulerArray = result.data;
	// 			let csNameSet = new Set();
	// 			if (this.schedulerArray.length > 0) {
	// 				this.schedulerArray.forEach(element => {
	// 					csNameSet.add(element.ec_id);
	// 					const fromDate = moment(element.sc_from);
	// 					const toDate = moment(element.sc_to);
	// 					for (const i = fromDate; i.diff(toDate, 'days') <= 0; i.add(1, 'days')) {
	// 						const eachEvent: any = {};
	// 						const nowDate = i.toDate();
	// 						eachEvent.start = nowDate;
	// 						eachEvent.end = nowDate;
	// 						eachEvent.title = element.sc_title;
	// 						eachEvent.sc_id = element.sc_id;
	// 						if (element.ec_id === '1') {
	// 							eachEvent.color = this.colors.holiday;
	// 						} else if (element.ec_id === '2') {
	// 							eachEvent.color = this.colors.nonTeaching;
	// 						} else if (element.ec_id === '3') {
	// 							eachEvent.color = this.colors.classSpecific;
	// 						}
	// 						this.events.push(eachEvent);
	// 					}
	// 				});
	// 				// console.log(csNameSet);
	// 				csNameSet = new Set(Array.from(csNameSet).sort());
	// 				csNameSet.forEach(ele => {
	// 					const eco: any = {ec_id: '', ec_name: '', ecArray: []};
	// 					eco.ec_id = ele;
	// 					this.schedulerArray.forEach(ele1 => {
	// 						if (ele === ele1.ec_id) {
	// 							eco.ec_name = ele1.ec_name;
	// 							eco.ecArray.push({sc_title: ele1.sc_title, sc_from: ele1.sc_from});
	// 						}
	// 					});
	// 					this.ecArray.push(eco);
	// 				});
	// 				// console.log('ecArray', this.ecArray);
	// 				// console.log(this.events);
	// 				this.schedulerFlag = true;
	// 			}
	// 		} else {
	// 			this.schedulerFlag = true;
	// 			// this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
	// 		}
	// 	});
	// }
}
