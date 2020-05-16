import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ErpCommonService } from 'src/app/_services';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { SisService, CommonAPIService } from '../../_services/index';
@Component({
	selector: 'app-fa-account-group',
	templateUrl: './fa-account-group.component.html',
	styleUrls: ['./fa-account-group.component.css']
})
export class AccountGroupComponent implements OnInit {

	ngOnInit() {

	}
}
