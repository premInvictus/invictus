import { Component, OnInit } from '@angular/core';
import { BreadCrumbService } from '../../_services/index';

@Component({
	selector: 'app-reviewq',
	templateUrl: './reviewq.component.html',
	styleUrls: ['./reviewq.component.css']
})
export class ReviewqComponent implements OnInit {

	homeUrl: string;

	constructor(
		private breadCrumbService: BreadCrumbService
	) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
	}
}
