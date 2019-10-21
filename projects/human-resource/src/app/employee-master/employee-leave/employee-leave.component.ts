import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'app-employee-leave',
	templateUrl: './employee-leave.component.html',
	styleUrls: ['./employee-leave.component.scss']
})
export class EmployeeLeaveComponent implements OnInit {
	searchForm : FormGroup;
	employeeForm : FormGroup;
	tabSelectedIndex = 0;
	formsTab: any[] = [];
	employeeData: any[] = [];
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
