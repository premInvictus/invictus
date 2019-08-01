import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SisService, AxiomService, CommonAPIService, SmartService } from '../../_services';
import { AddSchedulerComponent } from './add-scheduler/add-scheduler.component';

@Component({
	selector: 'app-scheduler',
	templateUrl: './scheduler.component.html',
	styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {

	pageView = 'calender';
	reloadScheduler = 0;
	constructor(
		private sisService: SisService,
		private commonAPIService: CommonAPIService,
		private axiomService: AxiomService,
		private smartService: SmartService,
		public dialog: MatDialog
	) { }

	ngOnInit() {
	}
	openAddScheduler() {
		const dialogRef = this.dialog.open(AddSchedulerComponent, {
			height: '520px',
			width: '800px',
			data: {
				title: 'Add Scheduler'
			}
		});
		dialogRef.afterClosed().subscribe(dresult => {
			console.log(dresult);
			if (dresult && dresult.reloadScheduler) {
				this.reloadScheduler = ++this.reloadScheduler;
			}
		});
	}
	switchView(pageview) {
		this.pageView = pageview;
	}

}
