import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ErpCommonService } from 'src/app/_services';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { SisService, CommonAPIService } from '../../_services/index';
@Component({
	selector: 'app-fa-position-mapping',
	templateUrl: './fa-position-mapping.component.html',
	styleUrls: ['./fa-position-mapping.component.css']
})
export class PositionMappingComponent implements OnInit {
	ngOnInit() {

	}
}
