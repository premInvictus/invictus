import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';

@Component({
	selector: 'app-employee-ledger',
	templateUrl: './employee-ledger.component.html',
	styleUrls: ['./employee-ledger.component.scss']
})
export class EmployeeLedgerComponent implements OnInit {
	
	employeedetails : any = {};
	lastrecordFlag: boolean;
	lastEmployeeDetails: any;
	lastRecordId: any;
	login_id: any;
	employeeDetailsForm: any;
	defaultsrc: any;
	navigation_record: any;
	viewOnly: boolean;
	@ViewChild('myInput') myInput: ElementRef;
	constructor(private commonAPIService : CommonAPIService) { }
  
	ngOnInit() {
		this.getEmployeeNavigationRecords();
	}
	getEmployeeNavigationRecords() {
		this.commonAPIService.getEmployeeNavigationRecords({}).subscribe((result: any) => {
			this.lastRecordId =  result.last_record;
		});
	}
}
