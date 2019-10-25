import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';

@Component({
	selector: 'app-employee-ledger',
	templateUrl: './employee-ledger.component.html',
	styleUrls: ['./employee-ledger.component.scss']
})
export class EmployeeLedgerComponent implements OnInit {
	
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
