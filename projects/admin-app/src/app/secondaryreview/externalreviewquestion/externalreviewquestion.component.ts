import { Component, OnInit } from '@angular/core';
import { BreadCrumbService } from 'projects/axiom/src/app/_services/index';

@Component({
	selector: 'app-externalreviewquestion',
	templateUrl: './externalreviewquestion.component.html',
	styleUrls: ['./externalreviewquestion.component.css']
})
export class ExternalreviewquestionComponent implements OnInit {

	homeUrl: string;

	constructor(
		private breadCrumbService: BreadCrumbService
	) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
	}

}
