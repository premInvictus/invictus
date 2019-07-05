import { Component, OnInit, ViewChild } from '@angular/core';
import { SmartService, CommonAPIService } from '../../../../_services';
import * as moment from 'moment';
import {
	startOfDay,
	endOfDay,
	subDays,
	addDays,
	endOfMonth,
	isSameDay,
	isSameMonth,
	addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import {
	CalendarEvent,
	CalendarEventAction,
	CalendarEventTimesChangedEvent,
	CalendarView
} from 'angular-calendar';

@Component({
	selector: 'app-monthly',
	templateUrl: './monthly.component.html',
	styleUrls: ['./monthly.component.css']
})
export class MonthlyComponent implements OnInit {

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

	view: CalendarView = CalendarView.Month;

	CalendarView = CalendarView;

	viewDate: Date = new Date();

	modalData: {
		action: string;
		event: CalendarEvent;
	};

	actions: CalendarEventAction[] = [];

	refresh: Subject<any> = new Subject();

	events: CalendarEvent[] = [];

	activeDayIsOpen = true;
	schedulerArray: any[] = [];
	schedulerFlag = false;

	constructor(
		private smartService: SmartService,
		private commonAPIService: CommonAPIService,
	) {}
	ngOnInit() {
		this.getScheduler();
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

	dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
		if (isSameMonth(date, this.viewDate)) {
			if (
				(isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
				events.length === 0
			) {
				this.activeDayIsOpen = false;
			} else {
				this.activeDayIsOpen = true;
			}
			this.viewDate = date;
		}
	}

	eventTimesChanged({
		event,
		newStart,
		newEnd
	}: CalendarEventTimesChangedEvent): void {
		this.events = this.events.map(iEvent => {
			if (iEvent === event) {
				return {
					...event,
					start: newStart,
					end: newEnd
				};
			}
			return iEvent;
		});
		this.handleEvent('Dropped or resized', event);
	}

	handleEvent(action: string, event: CalendarEvent): void {
		this.modalData = { event, action };
		console.log(this.modalData);
	}

	deleteEvent(eventToDelete: CalendarEvent) {
		this.events = this.events.filter(event => event !== eventToDelete);
	}

	setView(view: CalendarView) {
		this.view = view;
	}

	closeOpenMonthViewDay() {
		this.activeDayIsOpen = false;
	}

}
