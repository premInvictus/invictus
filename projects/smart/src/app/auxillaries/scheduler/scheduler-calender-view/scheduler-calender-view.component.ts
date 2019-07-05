import { Component, OnInit } from '@angular/core';
import { SmartService, CommonAPIService } from '../../../_services';

@Component({
	selector: 'app-scheduler-calender-view',
	templateUrl: './scheduler-calender-view.component.html',
	styleUrls: ['./scheduler-calender-view.component.css']
})
export class SchedulerCalenderViewComponent implements OnInit {
	constructor(
		private smartService: SmartService,
		private commonAPIService: CommonAPIService,
	) { }

	ngOnInit() {
	}

}
