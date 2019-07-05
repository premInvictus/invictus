import { Component, OnInit } from '@angular/core';
import { SmartService, CommonAPIService } from '../../../../_services';
import * as moment from 'moment';

@Component({
	selector: 'app-yearly',
	templateUrl: './yearly.component.html',
	styleUrls: ['./yearly.component.css']
})
export class YearlyComponent implements OnInit {
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
	events: any[] = [];
	viewDate: Date;
	themecolor: any = '#0a5ab3';
	schedulerArray: any[] = [];
	schedulerFlag = false;
	constructor(
		private smartService: SmartService,
		private commonAPIService: CommonAPIService,
	) { }

	ngOnInit() {
		this.viewDate = new Date();
		console.log(this.viewDate);
		this.getScheduler();
	}

	eventClicked(event) {
		console.log(event);
	}
	actionClicked(event) {
		console.log('action', event.action);
		console.log('event', event.event);
	}
	getScheduler() {
		this.smartService.getScheduler({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.schedulerArray = result.data;
				if (this.schedulerArray.length > 0) {
					this.schedulerArray.forEach(element => {
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
					console.log(this.events);
					this.schedulerFlag = true;
				}
			} else {
				this.schedulerFlag = true;
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
}
