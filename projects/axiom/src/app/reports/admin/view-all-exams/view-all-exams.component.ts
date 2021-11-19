import { Component, OnInit } from '@angular/core';
import { QelementService } from '../../../questionbank/service/qelement.service';
import { NotificationService, UserAccessMenuService, BreadCrumbService } from '../../../_services';
@Component({
	selector: 'app-view-all-exams',
	templateUrl: './view-all-exams.component.html',
	styleUrls: ['./view-all-exams.component.css']
})
export class ViewAllExamsComponent implements OnInit {
	homeUrl: string;
	comingexamFlag = true;
	pastexamFlag = false;
	deleteScheduledExam;
	currentQues;
	deleteComCancel;
	constructor(private qelementService: QelementService,
		private notif: NotificationService,
		private userAccessMenuService: UserAccessMenuService,
		private breadCrumbService: BreadCrumbService) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
	}
	setFlag($event) {
		if ($event.index === 0) {
			this.comingexamFlag = true;
			this.pastexamFlag = false;
		} else {
			this.comingexamFlag = false;
			this.pastexamFlag = true;
		}
	}

}
