import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { ErpCommonService } from 'src/app/_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import * as Excel from 'exceljs/dist/exceljs';
import * as XLSX from 'xlsx';
import * as moment from 'moment/moment';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

@Component({
	selector: 'app-reports',
	templateUrl: './reports.component.html',
	styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

	constructor(
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService,
		private erpCommonService: ErpCommonService
	) {
	}

	ngOnInit() {
		

	}



}


