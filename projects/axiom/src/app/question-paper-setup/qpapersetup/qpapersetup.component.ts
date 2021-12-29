import { Component, OnInit } from '@angular/core';
import { BreadCrumbService } from '../../_services/index';


@Component({
	selector: 'app-qpapersetup',
	templateUrl: './qpapersetup.component.html',
	styleUrls: ['./qpapersetup.component.css']
})

export class QpapersetupComponent implements OnInit {

	homeUrl: string;

	constructor(
		private breadCrumbService: BreadCrumbService
	) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
	}

}
