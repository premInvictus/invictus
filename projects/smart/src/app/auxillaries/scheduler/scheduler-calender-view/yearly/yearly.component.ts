import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { SmartService, CommonAPIService, SisService } from '../../../../_services';
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
		holiday: {
			primary: '#1fbcbb',
			secondary: '#1fbcbb'
		},
		nonTeaching: {
			primary: '#eb4d4b',
			secondary: '#eb4d4b'
		},
		classSpecific: {
			primary: '#febe36',
			secondary: '#febe36'
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
	constructor(
		private smartService: SmartService,
		private commonAPIService: CommonAPIService,
		private sisService: SisService
	) { }

	ngOnInit() {
		this.ses_id = JSON.parse(localStorage.getItem('session')).ses_id;
		this.viewDate = new Date();
		this.getScheduler();
		this.getSession();
		this.getSchool();
	}
	getSchool() {
		this.sisService.getSchool().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log(result.data);
				if (result.data.length > 0) {
					this.sessionStartMonth = result.data[0].session_start_month;
					this.sessionEndMonth = result.data[0].session_end_month;
				}
				console.log(this.sessionEndMonth);
				console.log(this.sessionStartMonth);
			}
		});
	}
	getSession() {
		this.sisService.getSession().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				if (result.data.length > 0) {
					result.data.forEach(element => {
						if (element.ses_id === this.ses_id) {
							const ses_name = element.ses_name;
							this.getSession = ses_name.split('-');
							// console.log(this.getSession);
						}
					});
				}
			}
		});
	}

	ngOnChanges() {
		// console.log('calling ngonchanges', this.reloadScheduler);
		if (this.reloadScheduler > 0) {
			this.getScheduler();
		}
	}

	eventClicked(event) {
	}
	actionClicked(event) {
	}
	getScheduler() {
		this.schedulerArray = [];
		this.ecArray = [];
		this.smartService.getScheduler({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.schedulerArray = result.data;
				let csNameSet = new Set();
				if (this.schedulerArray.length > 0) {
					this.schedulerArray.forEach(element => {
						csNameSet.add(element.ec_id);
						const fromDate = moment(element.sc_from);
						const toDate = moment(element.sc_to);
						for (const i = fromDate; i.diff(toDate, 'days') <= 0; i.add(1, 'days')) {
							const eachEvent: any = {};
							const nowDate = i.toDate();
							eachEvent.start = nowDate;
							eachEvent.end = nowDate;
							eachEvent.title = element.sc_title;
							eachEvent.sc_id = element.sc_id;
							if (element.ec_id === '1') {
								eachEvent.color = this.colors.holiday;
							} else if (element.ec_id === '2') {
								eachEvent.color = this.colors.nonTeaching;
							} else if (element.ec_id === '3') {
								eachEvent.color = this.colors.classSpecific;
							}
							this.events.push(eachEvent);
						}
					});
					// console.log(csNameSet);
					csNameSet = new Set(Array.from(csNameSet).sort());
					csNameSet.forEach(ele => {
						const eco: any = {ec_id: '', ec_name: '', ecArray: []};
						eco.ec_id = ele;
						this.schedulerArray.forEach(ele1 => {
							if (ele === ele1.ec_id) {
								eco.ec_name = ele1.ec_name;
								eco.ecArray.push({sc_title: ele1.sc_title, sc_from: ele1.sc_from});
							}
						});
						this.ecArray.push(eco);
					});
					// console.log('ecArray', this.ecArray);
					// console.log(this.events);
					this.schedulerFlag = true;
				}
			} else {
				this.schedulerFlag = true;
				// this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
}
