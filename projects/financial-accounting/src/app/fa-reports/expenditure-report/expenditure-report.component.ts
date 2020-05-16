import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe, TitleCasePipe, DecimalPipe } from '@angular/common';
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
  selector: 'app-expenditure-report',
  templateUrl: './expenditure-report.component.html',
  styleUrls: ['./expenditure-report.component.scss']
})
export class ExpenditureReportComponent implements OnInit {
  ngOnInit() {
    
  }
}
