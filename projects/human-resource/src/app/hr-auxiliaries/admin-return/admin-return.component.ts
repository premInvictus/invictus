import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';

@Component({
	selector: 'app-admin-return',
	templateUrl: './admin-return.component.html',
	styleUrls: ['./admin-return.component.scss']
})
export class AdminReturnComponent implements OnInit {
	
	tabSelectedIndex = 0;
	formsTab: any[] = [];
	settingsArray: any[] = [];
	reRenderFormSubscription: any;
	reRenderTabSubscription: any;
	studentRecord: any = {};
	constructor(
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService
	) { }

	ngOnInit() {}
	
}
