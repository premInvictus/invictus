import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  GridOption, Column, AngularGridInstance, Grouping, Aggregators,
  FieldType,
  Filters,
  Formatters,
  DelimiterType,
  FileType
} from 'angular-slickgrid';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import * as Excel from 'exceljs/dist/exceljs';
import * as ExcelProper from 'exceljs';
import { TranslateService } from '@ngx-translate/core';
import { ErpCommonService } from 'src/app/_services';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';

@Component({
  selector: 'app-statutory-report',
  templateUrl: './statutory-report.component.html',
  styleUrls: ['./statutory-report.component.scss']
})
export class StatutoryReportComponent implements OnInit {
  ngOnInit() {

  }
}
