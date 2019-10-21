import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'app-employee-attendance',
	templateUrl: './employee-attendance.component.html',
	styleUrls: ['./employee-attendance.component.scss']
})
export class EmployeeAttendanceComponent implements OnInit {
	employeeForm : FormGroup;
	searchForm : FormGroup;
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
