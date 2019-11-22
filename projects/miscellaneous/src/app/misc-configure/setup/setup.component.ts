import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ErpCommonService } from 'src/app/_services';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { SisService, CommonAPIService } from '../../_services/index';
@Component({
	selector: 'app-setup',
	templateUrl: './setup.component.html',
	styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

	constructor(
		private fbuild: FormBuilder,
		private erpCommonService: ErpCommonService,
		public commonService: CommonAPIService
	) {
	}

	ngOnInit() {
	}
}
