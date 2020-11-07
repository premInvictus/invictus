import { Component, OnInit } from '@angular/core';
import { BreadCrumbService } from '../../_services/index';

@Component({
	selector: 'app-template-review-list',
	templateUrl: './template-review-list.component.html',
	styleUrls: ['./template-review-list.component.css']
})

export class TemplateReviewListComponent implements OnInit {

	homeUrl: string;

	constructor(
		private breadCrumbService: BreadCrumbService
	) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
	}

}
