import { Component, OnInit } from '@angular/core';
import {UserAccessMenuService} from '../../_services/userAccessMenu.service';
import { BreadCrumbService } from '../../_services/index';

@Component({
	selector: 'app-qtemplate',
	templateUrl: './qtemplate.component.html',
	styleUrls: ['./qtemplate.component.css']
})

export class QtemplateComponent implements OnInit {

	homeUrl: string;

	constructor(
		private userAccessMenuService: UserAccessMenuService,
		private breadCrumbService: BreadCrumbService
	) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
	}

	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
	}
}
