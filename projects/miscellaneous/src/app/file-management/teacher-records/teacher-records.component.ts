import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';

@Component({
	selector: 'app-teacher-records',
	templateUrl: './teacher-records.component.html',
	styleUrls: ['./teacher-records.component.scss']
})
export class TeacherRecordsComponent implements OnInit {
	
	
	constructor(
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService
	) { }

	ngOnInit() {}
	
}
