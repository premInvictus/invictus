import { Component, OnInit, Input, Output, EventEmitter, HostBinding, OnChanges } from '@angular/core';
// import * as cloneDeep from "lodash/cloneDeep";
import { DomSanitizer } from '@angular/platform-browser';
// const clone: cloneDeep = (<any>cloneDeep).default || cloneDeep
@Component({
	selector: 'angular-calendar-year-view',
	templateUrl: './angular-calendar-year-view.component.html',
	styleUrls: ['./angular-calendar-year-view.component.scss']
})
export class AngularCalendarYearViewComponent implements OnInit, OnChanges {
	@HostBinding('style')
	get style() {
		return this.sanitizer.bypassSecurityTrustStyle(
			`--themecolor: ${this.themecolor};`
		);
	}
	@Input()
	themecolor: any = '#ff0000';
	@Input()
	events = [];

	@Input()
	yearFrom;

	@Input()
	yearTo;

	@Input()
	monthFrom;

	@Input()
	monthTo;

	@Input()
	viewDate: Date = new Date();

	@Output()
	eventClicked = new EventEmitter<any>();

	@Output()
	actionClicked = new EventEmitter<any>();

	loader: any = false;
	days: any = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	dayindex: any;
	daydetails: any = {};
	calendar: any = [];
	spinner: any = true;
	constructor(public sanitizer: DomSanitizer,

	) { }
	ngOnInit() {
		this.initCalendar();
	}
	ngOnChanges() {
		this.initCalendar();
	}
	initCalendar() {
		this.calendar = [];
		this.spinner = false;
		if (this.yearFrom !== this.yearTo) {
			for (let index = this.monthFrom - 1; index < 12; index++) {
				this.calendar.push({
					date: new Date(this.yearFrom, index + 1, 0),
					days: this.generateCalendar(index + 1, this.yearFrom),
					month: index,
					year: this.yearFrom
				});
			}
			for (let index = 0; index < this.monthTo; index++) {
				this.calendar.push({
					date: new Date(this.yearTo, index + 1, 0),
					days: this.generateCalendar(index + 1, this.yearTo),
					month: index,
					year: this.yearTo
				});
			}
		} else {
				for (let index = this.monthFrom - 1; index < this.monthTo; index++) {
					this.calendar.push({
						date: new Date(this.yearFrom, index + 1, 0),
						days: this.generateCalendar(index + 1, this.yearFrom),
						month: index,
						year: this.yearFrom
					});
				}
		}
		const self = this;
		setTimeout(() => {
			self.spinner = false;
		}, 2000);
	}
	generateCalendar(month, year) {
		const monthList = [];
		const nbweeks = this.getNbWeeks(month, year);
		let dayone = new Date(year, month - 1, 1).getDay();
		const nbdaysMonth = new Date(year, month, 0).getDate();
		const lastdayindex = new Date(year, month - 1, nbdaysMonth).getDay();
		let lastday = 7;
		let day = 1;
		const today = new Date().toDateString();

		for (let indexweek = 0; indexweek < nbweeks; indexweek++) {
			monthList[indexweek] = [];
			if (nbweeks === indexweek + 1) {
				lastday = lastdayindex + 1;
			}
			if (indexweek > 0) {
				dayone = 0;
			}
			for (let indexday = dayone; indexday < lastday; indexday++) {
				const d1 = new Date(year, month - 1, day).toDateString();
				const istoday = d1 === today;
				const colorsEvents = this.getnbevents(day, month - 1, year);
				monthList[indexweek][indexday] = {
					day: day,
					istoday: istoday,
					colors: colorsEvents.color,
					events: [],
					nb: colorsEvents.nb
				};
				day++;
			}
		}

		return monthList;
	}
	getNbWeeks(month, year) {
		const dayone = new Date(year, month - 1, 1).getDay();
		const nbdaysMonth = new Date(year, month, 0).getDate();
		const lastday = new Date(year, month - 1, nbdaysMonth).getDay();
		return (nbdaysMonth + dayone + (6 - lastday)) / 7;
	}
	getTodayEvents(day, month, year) {
		console.log('day ', day);
		console.log('month', month);
		console.log('year ', year);
		this.daydetails = {};

		if (this.events.length > 0) {
			this.loader = true;
			// this.daydetails = clone(day);
			this.daydetails = day;
			const d1 = new Date(year, month, day.day).toDateString();

			for (let index = 0; index < this.events.length; index++) {
				const element = this.events[index];
				const d2 = element.start.toDateString();
				if (d2 === d1) {
					this.daydetails.events.push(element);
				}
				if (index === this.events.length - 1) {
					const self = this;
					setTimeout(() => {
						self.loader = false;
					}, 1000);
				}

			}
		}
	}
	getnbevents(day, month, year) {
		let nb = 0;
		const colors = [];
		if (this.events.length > 0) {
			const d1 = new Date(year, month, day).toDateString();
			for (let index = 0; index < this.events.length; index++) {
				const element = this.events[index];
				const d2 = element.start.toDateString();
				if (d2 === d1) {
					nb++;
					colors.push(element.color.secondary);
				}
			}
			return ({ nb: nb, color: colors.toString() });
		} else {
			return { color: '', nb: 0 };
		}
	}
	eventClickedFn(event) {
		this.eventClicked.emit(event);
	}
	refresh(date) {
		this.initCalendar();
	}
	actionClickedFn(action, event?) {
		this.actionClicked.emit({ action: action, event: event });
	}
}
