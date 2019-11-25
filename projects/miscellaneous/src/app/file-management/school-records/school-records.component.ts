import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { MatDialog } from '@angular/material';
@Component({
	selector: 'app-school-records',
	templateUrl: './school-records.component.html',
	styleUrls: ['./school-records.component.scss']
})
export class SchoolRecordsComponent implements OnInit {


	constructor(
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService
	) {
	}

	ngOnInit() {
	}



}

