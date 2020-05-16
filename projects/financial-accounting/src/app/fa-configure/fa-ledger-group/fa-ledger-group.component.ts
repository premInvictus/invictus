import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ErpCommonService } from 'src/app/_services';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { SisService, CommonAPIService } from '../../_services/index';
@Component({
	selector: 'app-fa-ledger-report',
	templateUrl: './fa-ledger-report.component.html',
	styleUrls: ['./fa-ledger-report.component.css']
})
export class LedgerReportComponent implements OnInit {

	ngOnInit() {

	}
}
