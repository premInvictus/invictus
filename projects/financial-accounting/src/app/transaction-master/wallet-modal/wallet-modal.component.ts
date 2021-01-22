import { Component, OnInit , Inject, EventEmitter, Output, Input} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
	GridOption, Column, AngularGridInstance, Grouping, Aggregators,
	FieldType,
	Filters,
	Formatters,
	DelimiterType,
	FileType
} from 'angular-slickgrid';
import { FeeService, CommonAPIService, SisService } from '../../_services';
import { DecimalPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { CapitalizePipe, IndianCurrency } from '../../_pipes';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import * as Excel from 'exceljs/dist/exceljs';
import * as ExcelProper from 'exceljs';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';

@Component({
  selector: 'app-wallet-modal',
  templateUrl: './wallet-modal.component.html',
  styleUrls: ['./wallet-modal.component.css']
})
export class WalletModalComponent implements OnInit {
  reportdate = new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
  reportname = 'Wallet Collection';
  @Input() userName: any = '';
  totalRow: any;
  feeHeadJson: any[] = [];
  groupColumns: any[] = [];
  groupLength: any;
  exportColumnDefinitions: any[] = [];
  @Output() displyRep = new EventEmitter();
  columnDefinitions1: Column[] = [];
  columnDefinitions2: Column[] = [];
  gridOptions1: GridOption;
  gridOptions2: GridOption;
  tableFlag = false;
  dataset1: any[];
  dataset2: any[];
  initgrid = false;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  angularGrid: AngularGridInstance;
  dataviewObj: any;
  draggableGroupingPlugin: any;
  durationOrderByCount = false;
  gridObj: any;
  processing = false;
  selectedGroupingFields: string[] = ['', '', ''];
  totalRecords: number;
  aggregatearray: any[] = [];
  reportFilterForm: FormGroup;
  valueArray: any[] = [];
  classDataArray: any[] = [];
  reportTypeArray: any[] = [];
  valueLabel: any = '';
  reportType = '1';
  filterFlag = false;
  filterResult: any[] = [];
  sortResult: any[] = [];
  dataArr: any[] = [];
  hiddenValueArray5: any[] = [];
  hiddenValueArray4: any[] = [];
  sessionArray: any[] = [];
  schoolInfo: any = {};
  session: any = {};
  sessionName: any;
  alphabetJSON = {
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D',
    5: 'E',
    6: 'F',
    7: 'G',
    8: 'H',
    9: 'I',
    10: 'J',
    11: 'K',
    12: 'L',
    13: 'M',
    14: 'N',
    15: 'O',
    16: 'P',
    17: 'Q',
    18: 'R',
    19: 'S',
    20: 'T',
    21: 'U',
    22: 'V',
    23: 'W',
    24: 'X',
    25: 'Y',
    26: 'Z',
    27: 'AA',
    28: 'AB',
    29: 'AC',
    30: 'AD',
    31: 'AE',
    32: 'AF',
    33: 'AG',
    34: 'AH',
    35: 'AI',
    36: 'AJ',
    37: 'AK',
    38: 'AL',
    39: 'AM',
    40: 'AN',
    41: 'AO',
    42: 'AP',
    43: 'AQ',
    44: 'AR',

  };
  filteredAs: any = {};
  currentUser: any;
  pdfrowdata: any[] = [];
  levelHeading: any[] = [];
  levelTotalFooter: any[] = [];
  levelSubtotalFooter: any[] = [];
  notFormatedCellArray: any[] = [];
  gridHeight: number;
  locationArray:any[] = [];
  constructor(translate: TranslateService,
    public dialogRef: MatDialogRef<WalletModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private feeService: FeeService,
    private common: CommonAPIService,
    private sisService: SisService,
    public dialog: MatDialog,
    private fbuild: FormBuilder) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getSchool();
    this.session = JSON.parse(localStorage.getItem('session'));
    this.getSession();
    this.getLocation();
    this.buildForm();
  }
  getLocationName(location_id) {
    if(location_id && this.locationArray.length > 0) {
      for (const item of this.locationArray) {
        if (Number(item.location_id) === Number(location_id)) {
          return item.location_hierarchy;
        }
      }
    } else {
      return '';
    }
    
  }
  getLocation() {
    var inputJson = {};
    this.feeService.getLocation(inputJson).subscribe((result: any) => {
    if (result) {
      this.locationArray = result;
    } else {
      this.locationArray = [];
    }
    });
  }
  getSchool() {
    this.sisService.getSchool().subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.schoolInfo = res.data[0];
        console.log(this.schoolInfo);
      }
    });
  }
  getSessionName(id) {
    const findex = this.sessionArray.findIndex(f => f.ses_id === id);
    if (findex !== -1) {
      return this.sessionArray[findex].ses_name;
    }
  }
  getSession() {
    this.sisService.getSession().subscribe((result2: any) => {
      if (result2.status === 'ok') {
        this.sessionArray = result2.data;
      }
    });
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid; // grid object
    this.dataviewObj = angularGrid.dataView;
    this.updateTotalRow(angularGrid.slickGrid);
    this.updateClassSort(angularGrid.slickGrid, angularGrid.dataView);
  }
  parseRoman(s) {
        var val = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
        return s.toUpperCase().split('').reduce( (r, a, i, aa) => {
            return val[a] < val[aa[i + 1]] ? r - val[a] : r + val[a];
        }, 0);
  }
  isRoman(s) {
        // http://stackoverflow.com/a/267405/1447675
        return /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i.test(s);
  }
  updateClassSort(grid:any,dataView:any) {
    let columnIdx = grid.getColumns().length;
    while (columnIdx--) {
      const columnId = grid.getColumns()[columnIdx];
      if (columnId['name'] == 'Class Name' || columnId['name'] == 'Class-Section') {
        grid.onSort.subscribe((e, args)=> {
          console.log('in, args', args);
          // args.multiColumnSort indicates whether or not this is a multi-column sort.
          // If it is, args.sortCols will have an array of {sortCol:..., sortAsc:...} objects.
          // If not, the sort column and direction will be in args.sortCol & args.sortAsc.
          
          // We'll use a simple comparer function here.
          args = args.sortCols[0];
          var comparer = (a, b) =>{
            if (this.isRoman(a[args.sortCol.field].split(" ")[0]) || this.isRoman(b[args.sortCol.field].split(" ")[0])) {
              
              return (this.parseRoman(a[args.sortCol.field].split(" ")[0]) > this.parseRoman(b[args.sortCol.field].split(" ")[0])) ? 1 : -1;
              
              
            } else if (this.isRoman(a[args.sortCol.field].split("-")[0]) || this.isRoman(b[args.sortCol.field].split("-")[0])) {
              
              return (this.parseRoman(a[args.sortCol.field].split("-")[0]) > this.parseRoman(b[args.sortCol.field].split("-")[0])) ? 1 : -1;
            
            
            } else {
              
              return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
            }
          
          }
          
          // Delegate the sorting to DataView.
          // This will fire the change events and update the grid.
          dataView.sort(comparer, args.sortAsc);
          });
      }
    }
  }
  updateTotalRow(grid: any) {
    let columnIdx = grid.getColumns().length;
    while (columnIdx--) {
      const columnId = grid.getColumns()[columnIdx].id;
      const columnElement: HTMLElement = grid.getFooterRowColumn(columnId);
      columnElement.innerHTML = '<b>' + this.totalRow[columnId] + '<b>';
    }
  }
  buildForm() {
    this.reportFilterForm = this.fbuild.group({
      'report_type': '',
      'fee_value': '',
      'from_date': '',
      'to_date': '',
      'downloadAll': '',
      'hidden_value': '',
      'hidden_value2': '',
      'hidden_value3': '',
      'hidden_value4': '',
      'hidden_value5': '',
      'filterReportBy': '',
      'admission_no': '',
      'au_full_name': '',
      'pageSize': '10',
      'pageIndex': '0',
      'login_id': '',
      'orderBy': ''
    });
    this.reportFilterForm.patchValue({
      'report_type': 'wallet_transaction_all',
      'from_date': this.data.date,
      'to_date': this.data.date,
    });
    this.changeReportType();
  }
  getClassName(classArray) {
    let className = '';
    for (const item of classArray) {
      for (const titem of this.classDataArray) {
        if (item === titem.class_id) {
          className = className + titem.class_name + ',';
        }
      }
    }
    return className;
  }
  getConReport(value: any) {
    value.from_date = new DatePipe('en-in').transform(value.from_date, 'yyyy-MM-dd');
    value.to_date = new DatePipe('en-in').transform(value.to_date, 'yyyy-MM-dd');
    this.dataArr = [];
    this.aggregatearray = [];
    this.columnDefinitions = [];
    this.dataset = [];
    this.tableFlag = false;
    let repoArray = [];
    this.columnDefinitions = [];
    this.dataset = [];
    const collectionJSON: any = {
      'admission_no': '',
      'studentName': '',
      'report_type': value.report_type,
      'routeId': value.fee_value,
      'from_date': value.from_date,
      'to_date': value.to_date,
      'pageSize': '10',
      'pageIndex': '0',
      'filterReportBy': 'collection',
      'login_id': value.login_id,
      'orderBy': value.orderBy,
      'downloadAll': true
    };
    this.columnDefinitions = [];
    this.columnDefinitions.push({
      id: 'srno',
      name: 'SNo.',
      field: 'srno',
      sortable: true,
      maxWidth: 40
    });
    this.columnDefinitions.push({
      id: 'trn_date', name: 'Trans. Date', field: 'trn_date',
      sortable: true,
      filterable: true,
      width: 80,
      formatter: this.checkDateFormatter,
      filterSearchType: FieldType.dateIso,
      filter: { model: Filters.compoundDate },
      grouping: {
        getter: 'trn_date',
        formatter: (g) => {
          if (g.value !== '-' && g.value !== '' && g.value !== '<b>Grand Total</b>') {
            return `${new DatePipe('en-in').transform(g.value, 'd-MMM-y')}  <span style="color:green">(${g.count})</span>`;
          } else {
            return `${''}`;
          }
        },
        aggregators: this.aggregatearray,
        aggregateCollapsed: true,
        collapsed: false
      },
      groupTotalsFormatter: this.srnTotalsFormatter,
    });
    this.columnDefinitions.push( {
      id: 'stu_admission_no',
      name: 'Enrollment No.',
      field: 'stu_admission_no',
      filterable: true,
      filterSearchType: FieldType.string,
      filter: { model: Filters.compoundInputText },
      sortable: true,
      width: 80,
      grouping: {
        getter: 'stu_admission_no',
        formatter: (g) => {
          return `${g.value} <span style="color:green"> (${g.count})</span>`;
        },
        aggregators: this.aggregatearray,
        aggregateCollapsed: true,
        collapsed: false
      },
    });
    this.columnDefinitions.push({
      id: 'stu_full_name',
      name: 'Student Name',
      field: 'stu_full_name',
      filterable: true,
      sortable: true,
      width: 180,
      filterSearchType: FieldType.string,
      filter: { model: Filters.compoundInputText },
      grouping: {
        getter: 'stu_full_name',
        formatter: (g) => {
          return `${g.value}  <span style="color:green">(${g.count})</span>`;
        },
        aggregators: this.aggregatearray,
        aggregateCollapsed: true,
        collapsed: false
      },
    });
    this.columnDefinitions.push({
      id: 'stu_class_name',
      name: 'Class-Section',
      field: 'stu_class_name',
      sortable: true,
      filterable: true,
      width: 60,
      filterSearchType: FieldType.string,
      filter: { model: Filters.compoundInputText },
      grouping: {
        getter: 'stu_class_name',
        formatter: (g) => {
          return `${g.value}  <span style="color:green">(${g.count})</span>`;
        },
        aggregators: this.aggregatearray,
        aggregateCollapsed: true,
        collapsed: false,
      },
    });
    this.columnDefinitions.push({
      id: 'particulars',
      name: 'Particulars',
      field: 'particulars',
      sortable: true,
      filterable: true,
      width: 180,
      filterSearchType: FieldType.string,
      filter: { model: Filters.compoundInputText },
    });
    if (this.reportType === 'wallet_transaction_all') {
      this.columnDefinitions.push({
        id: 'store',
        name: 'Store',
        field: 'store',
        sortable: true,
        filterable: true,
        width: 60,
        filterSearchType: FieldType.string,
        filter: { model: Filters.compoundInputText },
        grouping: {
          getter: 'store',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      });
    }
    this.columnDefinitions.push({
      id: 'deposit_amt',
      name: 'Deposit',
      field: 'deposit_amt',
      sortable: true,
      filterable: true,
      width: 60,
      filterSearchType: FieldType.string,
      filter: { model: Filters.compoundInputText },
      formatter: this.checkFeeFormatter,
      groupTotalsFormatter: this.sumTotalsFormatter
    });
    this.columnDefinitions.push({
      id: 'withdrawal_amt',
      name: 'Withdrawal',
      field: 'withdrawal_amt',
      sortable: true,
      filterable: true,
      width: 60,
      filterSearchType: FieldType.string,
      filter: { model: Filters.compoundInputText },
      formatter: this.checkFeeFormatter,
      groupTotalsFormatter: this.sumTotalsFormatter
    });
    if (this.reportType === 'wallet_transaction_all') {
      this.columnDefinitions.push({
        id: 'purchase_amt',
        name: 'Purchase',
        field: 'purchase_amt',
        sortable: true,
        filterable: true,
        width: 60,
        filterSearchType: FieldType.string,
        filter: { model: Filters.compoundInputText },
        formatter: this.checkFeeFormatter,
        groupTotalsFormatter: this.sumTotalsFormatter
      });
    }
    // this.columnDefinitions.push({
    // 	id: 'balance',
    // 	name: 'Balance',
    // 	field: 'balance',
    // 	sortable: true,
    // 	filterable: true,
    // 	width: 60,
    // 	filterSearchType: FieldType.string,
    // 	filter: { model: Filters.compoundInputText },
    // });
    this.feeService.getWalletsReport(collectionJSON).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.common.showSuccessErrorMessage('Report Data Fetched Successfully', 'success');
        console.log('result', result);
        repoArray = result.data;
        let index = 0;
        for (const item of repoArray) {
          const obj: any = {};
          obj['id'] = index+1;
          obj['srno'] =index+1;
          obj['stu_admission_no'] = repoArray[Number(index)]['au_admission_no'] ?
            repoArray[Number(index)]['au_admission_no'] : '-';
          obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(index)]['au_full_name']);
          if (repoArray[Number(index)]['sec_id'] !== '0') {
            obj['stu_class_name'] = repoArray[Number(index)]['class_name'] + '-' +
              repoArray[Number(index)]['sec_name'];
          } else {
            obj['stu_class_name'] = repoArray[Number(index)]['class_name'];
          }
          obj['trn_date'] = repoArray[Number(index)]['w_transaction_date'] ?
            repoArray[Number(index)]['w_transaction_date'] : '-';
          if(item.w_opening == 1){
            obj['deposit_amt'] = parseInt(item.w_amount);
            obj['particulars'] = 'Opening Balance';
          } else if(item.w_amount_status == 'deposit'){
            obj['deposit_amt'] = parseInt(item.w_amount);
            obj['particulars'] = item.pay_name ? 'Amount Received (By '+item.pay_name+')': 'Amount Received';
          } else if(item.w_amount_status == 'withdrawal'){
            obj['withdrawal_amt'] = parseInt(item.w_amount);
            obj['particulars'] = item.pay_name ? 'Withdrawal (By '+item.pay_name+')': 'Withdrawal';
          } else if(item.w_amount_status == 'purchase'){
            if (this.reportType === 'wallet_transaction_all') {
              obj['purchase_amt'] = parseInt(item.w_amount);
              const particulars=this.getLocationName(item.w_ref_location_id);
              const subparticulars = item.w_ref_no_of_items ? '(No of items - '+item.w_ref_no_of_items+')' : '';
              obj['particulars'] = subparticulars ? particulars+subparticulars: particulars;
              obj['store'] = particulars;
            }						
          }
          if(!obj['deposit_amt']) {
            obj['deposit_amt'] = '';
          }
          if(!obj['withdrawal_amt']) {
            obj['withdrawal_amt'] = '';
          }
          if (this.reportType === 'wallet_transaction_all') {
            if(!obj['purchase_amt']) {
              obj['purchase_amt'] = '';
            }
            if(!obj['store']) {
              obj['store'] = '';
            }
          }
          // obj['balance'] = '';
          this.dataset.push(obj);
          this.aggregatearray.push(new Aggregators.Sum('deposit_amt'));
          this.aggregatearray.push(new Aggregators.Sum('withdrawal_amt'));
          if (this.reportType === 'wallet_transaction_all') {
            this.aggregatearray.push(new Aggregators.Sum('purchase_amt'));
          }
          index++;
        }
        this.totalRow = {};
        const obj3: any = {};
        obj3['id'] = 'footer';
        obj3['srno'] = '';
        obj3['trn_date'] = 'Grand Total';
        obj3['stu_admission_no'] = '';
        obj3['stu_full_name'] = '';
        obj3['stu_class_name'] = '';
        obj3['particulars'] = '';
        obj3['store'] = '';
        obj3['deposit_amt'] =
          new IndianCurrency().transform(this.dataset.map(t => t.deposit_amt ? t.deposit_amt : 0).reduce((acc, val) => acc + val, 0));
        obj3['withdrawal_amt'] =
          new IndianCurrency().transform(this.dataset.map(t => t.withdrawal_amt ? t.withdrawal_amt : 0).reduce((acc, val) => acc + val, 0));
        if (this.reportType === 'wallet_transaction_all') {
          obj3['purchase_amt'] =
          new IndianCurrency().transform(this.dataset.map(t => t.purchase_amt ? t.purchase_amt : 0).reduce((acc, val) => acc + val, 0));
        }
        this.totalRow=obj3;
        
        if (this.dataset.length <= 5) {
          this.gridHeight = 300;
        } else if (this.dataset.length <= 10 && this.dataset.length > 5) {
          this.gridHeight = 400;
        } else if (this.dataset.length > 10 && this.dataset.length <= 20) {
          this.gridHeight = 550;
        } else if (this.dataset.length > 20) {
          this.gridHeight = 750;
        }
        this.tableFlag = true;
      } else {
        this.tableFlag = true;
      }
    });
  }
  checkReturn(data) {
    if (Number(data)) {
      return Number(data);
    } else {
      return data;
    }
  }
  resetValues() {
    this.reportFilterForm.patchValue({
      'login_id': '',
      'orderBy': '',
      'fee_value': '',
      'from_date': '',
      'to_date': '',
      'downloadAll': '',
      'hidden_value': '',
      'hidden_value2': '',
      'hidden_value3': '',
      'hidden_value4': '',
      'hidden_value5': '',
      'filterReportBy': '',
      'admission_no': '',
      'au_full_name': '',
      'pageSize': '10',
      'pageIndex': '0'
    });
    this.sortResult = [];
    this.filterResult = [];
  }
  clearGroupsAndSelects() {
    this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = '');
    this.clearGrouping();
  }

  clearGrouping() {
    if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
      this.draggableGroupingPlugin.clearDroppedGroups();
    }
  }

  collapseAllGroups() {
    this.dataviewObj.collapseAllGroups();
    this.updateTotalRow(this.angularGrid.slickGrid);
  }

  expandAllGroups() {
    this.dataviewObj.expandAllGroups();
    this.updateTotalRow(this.angularGrid.slickGrid);
  }
  onGroupChanged(groups: Grouping[]) {
    if (Array.isArray(this.selectedGroupingFields) && Array.isArray(groups) && groups.length > 0) {
      // update all Group By select dropdown
      this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = groups[i] && groups[i].getter || '');
    }
  }

  showPreHeader() {
    this.gridObj.setPreHeaderPanelVisibility(true);
  }

  selectTrackByFn(index, item) {
    return index;
  }

  toggleDraggableGroupingRow() {
    this.clearGrouping();
    this.gridObj.setPreHeaderPanelVisibility(!this.gridObj.getOptions().showPreHeaderPanel);
  }
  onCellChanged(e, args) {
    console.log(e);
    console.log(args);
  }
  sumTotalsFormatter(totals, columnDef) {
    console.log(totals);
    console.log(columnDef);
    const val = totals.sum && totals.sum[columnDef.field];
    if (val != null) {
      if (new DecimalPipe('en-in').transform(((Math.round(parseFloat(val) * 100) / 100)))) {
        return '<b class="total-footer-report">' + new DecimalPipe('en-in').transform(((Math.round(parseFloat(val) * 100) / 100))) + '</b>';
      } else {
        return '';
      }
      
    }
    return '';
  }
  checkFeeFormatter(row, cell, value, columnDef, dataContext) {
    if (value === 0) {
      return '';
    } else {
      if (value ) {
        return new DecimalPipe('en-in').transform(value);
      }else {
        return '';
      }
    }
  }
  checkTotalFormatter(row, cell, value, columnDef, dataContext) {
    if (value === 0) {
      return '-';
    } else {
      if (value ) {
        return new DecimalPipe('en-in').transform(value);
      }else {
        return '-';
      }
    }
  }
  checkFeeHeadFormatter(row, cell, value, columnDef, dataContext) {
    console.log(value);
    if (value)
      return value;
    else 
      return '';
  }
  checkReceiptFormatter(row, cell, value, columnDef, dataContext) {
    if (value === '-') {
      return '-';
    } else {
      if (value)
        return '<a>' + value + '</a>';
      else 
        return '-';
    }
  }
  checkDateFormatter(row, cell, value, columnDef, dataContext) {
    if (value !== '-') {
      return new DatePipe('en-in').transform(value, 'd-MMM-y');
    } else {
      return value;
    }
  }
  srnTotalsFormatter(totals, columnDef) {
    if (totals.group.level === 0) {
      return '<b class="total-footer-report">Total</b>';
    }
    if (totals.group.level > 0) {
      return '<b class="total-footer-report">Sub Total (' + totals.group.value + ') </b>';
    }
  }
  getMFRFormatter(row, cell, value, columnDef, dataContext) {
    if (value.status === 'unpaid') {
      return '<div style="background-color:#f93435 !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
        + '<span class="invoice-span-mfr">' + value.invoice_id + '</span>' + '</div>';
    } else if (value.status === 'paid') {
      return '<div style="background-color:#27de80 !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
        + '<span class="invoice-span-mfr">' + value.invoice_id + '</span>' + '</div>';
    } else if (value.status === 'Not Generated') {
      return '<div style="background-color:#d2d8e0 !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;' +
        'border-right: 1px solid #89a8c8; border-top: 0px !important;' +
        'border-bottom: 0px !important; border-left: 0px !important; margin: auto;">'
        + '<span class="invoice-span-mfr">' + value.invoice_id + '</span>' + '</div>';
    } else if (value.status === 'Unpaid with fine') {
      return '<div style="background-color:#4a7bec !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
        + '<span class="invoice-span-mfr">' + value.invoice_id + '</span>' + '</div>';
    } else {
      return '<div style="background-color:#7bd450 !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
        + '<span class="invoice-span-mfr">' + value.invoice_id + '</span>' + '</div>';
    }
  }
  getFeeHeads() {
    this.valueArray = [];
    this.feeService.getFeeHeads({ fh_is_hostel_fee: '' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        for (const item of result.data) {
          this.valueArray.push({
            id: item.fh_id,
            name: item.fh_name
          });
        }
      }
    });
  }
  getClass() {
    this.valueArray = [];
    for (const item of this.classDataArray) {
      this.valueArray.push({
        id: item.class_id,
        name: item.class_name
      });
    }
  }
  getClassData() {
    this.valueArray = [];
    this.common.getClassData({}).subscribe((result: any) => {
      if (result.status === 'ok') {
        this.classDataArray = result.data;
        for (const item of this.classDataArray) {
          this.valueArray.push({
            id: item.class_id,
            name: item.class_name
          });
        }
      }
    });
  }
  getReportName(value) {
    const findex = this.reportTypeArray.findIndex(f => f.report_type === value);
    if (findex !== -1) {
      return this.reportTypeArray[findex].report_name;
    }
  }
  changeReportType() {
    this.filterResult = [];
    this.sortResult = [];
    this.tableFlag = false;
    if (true) {
      this.gridOptions = {
        enableDraggableGrouping: true,
        createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        enableHeaderMenu: true,
        preHeaderPanelHeight: 40,
        enableFiltering: true,
        enableSorting: true,
        enableColumnReorder: true,
        createFooterRow: true,
        showFooterRow: true,
        footerRowHeight: 35,
        rowHeight: 35,
        enableExcelCopyBuffer: true,
        enableAutoTooltip: true,
        enableCellNavigation: true,
        fullWidthRows: true,
        headerMenu: {
          iconColumnHideCommand: 'fas fa-times',
          iconSortAscCommand: 'fas fa-sort-up',
          iconSortDescCommand: 'fas fa-sort-down',
          title: 'Sort'
        },
        exportOptions: {
          sanitizeDataExport: true,
          exportWithFormatter: true
        },
        gridMenu: {
          customItems: [{
            title: 'pdf',
            titleKey: 'Export as PDF',
            command: 'exportAsPDF',
            iconCssClass: 'fas fa-download'
          },
          {
            title: 'excel',
            titleKey: 'Export Excel',
            command: 'exportAsExcel',
            iconCssClass: 'fas fa-download'
          },
          {
            title: 'expand',
            titleKey: 'Expand Groups',
            command: 'expandGroup',
            iconCssClass: 'fas fa-expand-arrows-alt'
          },
          {
            title: 'collapse',
            titleKey: 'Collapse Groups',
            command: 'collapseGroup',
            iconCssClass: 'fas fa-compress'
          },
          {
            title: 'cleargroup',
            titleKey: 'Clear Groups',
            command: 'cleargroup',
            iconCssClass: 'fas fa-eraser'
          }
          ],
          onCommand: (e, args) => {
            if (args.command === 'toggle-preheader') {
              // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
              this.clearGrouping();
            }
            if (args.command === 'exportAsPDF') {
              // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
              this.exportAsPDF(this.dataset);
            }
            if (args.command === 'expandGroup') {
              // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
              this.expandAllGroups();
            }
            if (args.command === 'collapseGroup') {
              // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
              this.collapseAllGroups();
            }
            if (args.command === 'cleargroup') {
              // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
              this.clearGrouping();
            }
            if (args.command === 'exportAsExcel') {
              // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
              this.exportToExcel(this.dataset);
            }
            if (args.command === 'export-csv') {
              this.exportToFile('csv');
            }
          },
          onColumnsChanged: (e, args) => {
            this.updateTotalRow(this.angularGrid.slickGrid);
          },
        },
        draggableGrouping: {
          dropPlaceHolderText: 'Drop a column header here to group by the column',
          // groupIconCssClass: 'fa fa-outdent',
          deleteIconCssClass: 'fa fa-times',
          onGroupChanged: (e, args) => {
            this.groupColumns = [];
            this.groupColumns = args.groupColumns;
            this.onGroupChanged(args && args.groupColumns);
          },
          onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
        }
      };
      this.filterFlag = false;
      this.getConReport(this.reportFilterForm.value);
    }
  }
  getFromDate(value) {
    this.reportFilterForm.patchValue({
      from_date: new DatePipe('en-in').transform(value, 'yyyy-MM-dd')
    });
  }
  getToDate(value) {
    this.reportFilterForm.patchValue({
      to_date: new DatePipe('en-in').transform(value, 'yyyy-MM-dd')
    });
  }
  checkWidth(id, header) {
    const res = this.dataset.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
    const max2 = header.toString().length;
    const max = Math.max.apply(null, res);
    return max2 > max ? max2 : max;
  }
  getGroupColumns(columns) {
    let grName = '';
    for (const item of columns) {
      for (const titem of this.columnDefinitions) {
        if (item.getter === titem.id) {
          grName = grName + titem.name + ',';
          break;
        }
      }
    }
    return grName.substring(0, grName.length - 1);
  }
  exportToExcel(json: any[]) {
    this.notFormatedCellArray = [];
    let reportType: any = '';
    const columns: any[] = [];
    const columValue: any[] = [];
    this.exportColumnDefinitions = [];
    this.exportColumnDefinitions = this.angularGrid.slickGrid.getColumns();
    // for (const item of this.exportColumnDefinitions) {
    // 	columns.push({
    // 		key: item.id,
    // 		width: this.checkWidth(item.id, item.name)
    // 	});
    // 	columValue.push(item.name);
    // }
    this.sessionName = this.getSessionName(this.session.ses_id);
    reportType = new TitleCasePipe().transform(this.reportname)+ '_' + this.sessionName;
    let reportType2: any = '';
    reportType2 = new TitleCasePipe().transform(this.reportname)+ '_' + this.sessionName;
    const fileName =reportType + '_' + this.reportdate +'.xlsx';
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
      { pageSetup: { fitToWidth: 7 } });
    for (const item of this.exportColumnDefinitions) {
      if(!(item.id.includes('checkbox_select'))) {
      columns.push({
        key: item.id,
        width: 8
        //width: this.checkWidth(item.id, item.name)
      });
      columValue.push(item.name);}
    }
    //worksheet.properties.defaultRowHeight =80;
    worksheet.mergeCells('A1:' + this.alphabetJSON[columns.length] + '1'); // Extend cell over all column headers
    worksheet.getCell('A1').value =
      new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
    worksheet.getCell('A1').alignment = { horizontal: 'left' };
    worksheet.mergeCells('A2:' + this.alphabetJSON[columns.length] + '2');
    worksheet.getCell('A2').value = reportType2;
    worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
    worksheet.getRow(4).values = columValue;
    worksheet.columns = columns;
    for(var i=1; i<=columns.length;i++) {
      
      worksheet.getColumn(i).alignment = {vertical: 'middle', horizontal: 'left',  wrapText: true};
      
    }
    if (this.dataviewObj.getGroups().length === 0) {
      Object.keys(json).forEach(key => {
        const obj: any = {};
        for (const item2 of this.exportColumnDefinitions) {
          if (item2.id === 'trn_date') {
            obj[item2.id] = new DatePipe('en-in').transform((json[key][item2.id]));
          } else {
            obj[item2.id] = this.checkReturn(this.common.htmlToText(json[key][item2.id]));
          }
        }
        worksheet.addRow(obj);
      });
    } else {
      // iterate all groups
      this.checkGroupLevel(this.dataviewObj.getGroups(), worksheet);
    }
    if (this.totalRow) {
      worksheet.addRow(this.totalRow);
    }
    // style grand total
    worksheet.getRow(worksheet._rows.length).eachCell(cell => {
      this.columnDefinitions.forEach(element => {
        cell.font = {
          color: { argb: 'ffffff' },
          bold: true,
          name: 'Arial',
          size: 10
        };
        cell.alignment = { wrapText: true, horizontal: 'center' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '439f47' },
          bgColor: { argb: '439f47' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });
    // style all row of excel
    worksheet.eachRow((row, rowNum) => {
      if (rowNum === 1) {
        row.font = {
          name: 'Arial',
          size: 14,
          bold: true
        };
      } else if (rowNum === 2) {
        row.font = {
          name: 'Arial',
          size: 12,
          bold: true
        };
      } else if (rowNum === 4) {
        row.eachCell((cell) => {
          cell.font = {
            name: 'Arial',
            size: 12,
            bold: true
          };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'bdbdbd' },
            bgColor: { argb: 'bdbdbd' },
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          cell.alignment = { wrapText:true, horizontal: 'center' };
        });
      } else if (rowNum > 4 && rowNum < worksheet._rows.length) {
        const cellIndex = this.notFormatedCellArray.findIndex(item => item === rowNum);
        if (cellIndex === -1) {
          row.eachCell((cell) => {
            cell.font = {
              name: 'Arial',
              size: 10,
            };
            cell.alignment = { wrapText: true, horizontal: 'center' };
          });
          if (rowNum % 2 === 0) {
            row.eachCell((cell) => {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ffffff' },
                bgColor: { argb: 'ffffff' },
              };
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
            });
          } else {
            row.eachCell((cell) => {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ffffff' },
                bgColor: { argb: 'ffffff' },
              };
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
            });
          }

        }
      }
    });

    worksheet.addRow({});
    if (this.groupColumns.length > 0) {
      worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
        this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
      worksheet.getCell('A' + worksheet._rows.length).value = 'Groupded As: ' + this.getGroupColumns(this.groupColumns);
      worksheet.getCell('A' + worksheet._rows.length).font = {
        name: 'Arial',
        size: 10,
        bold: true
      };
    }

    worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
      this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
    worksheet.getCell('A' + worksheet._rows.length).value = 'Report Filtered as:' + this.getParamValue();
    worksheet.getCell('A' + worksheet._rows.length).font = {
      name: 'Arial',
      size: 10,
      bold: true
    };

    worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
      this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
    worksheet.getCell('A' + worksheet._rows.length).value = 'No of records: ' + json.length;
    worksheet.getCell('A' + worksheet._rows.length).font = {
      name: 'Arial',
      size: 10,
      bold: true
    };

    worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
      this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
    worksheet.getCell('A' + worksheet._rows.length).value = 'Generated On: '
      + new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
    worksheet.getCell('A' + worksheet._rows.length).font = {
      name: 'Arial',
      size: 10,
      bold: true
    };

    worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
      this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
    worksheet.getCell('A' + worksheet._rows.length).value = 'Generated By: ' + this.currentUser.full_name;
    worksheet.getCell('A' + worksheet._rows.length).font = {
      name: 'Arial',
      size: 10,
      bold: true
    };
    workbook.xlsx.writeBuffer().then(data => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      saveAs(blob, fileName);
    });
  }
  filtered(event) {
    this.filteredAs[event.source.ngControl.name] = event.source._placeholder + ' - ' + event.source.selected.viewValue;
  }
  getParamValue() {
    const filterArr = [];
    Object.keys(this.filteredAs).forEach(key => {
      filterArr.push(this.filteredAs[key]);
    });
    filterArr.push(
      this.common.dateConvertion(this.reportFilterForm.value.from_date, 'd-MMM-y') + ' - ' +
      this.common.dateConvertion(this.reportFilterForm.value.to_date, 'd-MMM-y'));
  }
  getLevelFooter(level, groupItem) {
    if (level === 0) {
      return 'Total';
    }
    if (level > 0) {
      return 'Sub Total (' + groupItem.value + ')';
    }
  }
  checkGroupLevel(item, worksheet) {
    if (item.length > 0) {
      for (const groupItem of item) {
        worksheet.addRow({});
        this.notFormatedCellArray.push(worksheet._rows.length);
        // style for groupeditem level heading
        worksheet.mergeCells('A' + (worksheet._rows.length) + ':' +
          this.alphabetJSON[this.exportColumnDefinitions.length] + (worksheet._rows.length));
        worksheet.getCell('A' + worksheet._rows.length).value = this.common.htmlToText(groupItem.title);
        worksheet.getCell('A' + worksheet._rows.length).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'c8d6e5' },
          bgColor: { argb: 'ffffff' },
        };
        worksheet.getCell('A' + worksheet._rows.length).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        worksheet.getCell('A' + worksheet._rows.length).font = {
          name: 'Arial',
          size: 10,
          bold: true
        };

        if (groupItem.groups) {
          this.checkGroupLevel(groupItem.groups, worksheet);
          const obj3: any = {};
          obj3['id'] = 'footer'; 
          obj3['srno'] = '';
          obj3['trn_date'] = this.getLevelFooter(groupItem.level, groupItem);
          obj3['particulars'] = '';
          obj3['stu_admission_no'] = '';
          obj3['stu_full_name'] = '';
          obj3['stu_class_name'] = '';
          obj3['store'] = '';
          obj3['deposit_amt'] =
          new IndianCurrency().transform(groupItem.rows.map(t => t.deposit_amt ? t.deposit_amt : 0).reduce((acc, val) => acc + val, 0));
          obj3['withdrawal_amt'] =
          new IndianCurrency().transform(groupItem.rows.map(t => t.withdrawal_amt ? t.withdrawal_amt : 0).reduce((acc, val) => acc + val, 0));
          if (this.reportType === 'wallet_transaction_all') {
            obj3['purchase_amt'] =
            new IndianCurrency().transform(groupItem.rows.map(t => t.purchase_amt ? t.purchase_amt : 0).reduce((acc, val) => acc + val, 0));
            
          }
          worksheet.addRow(obj3);
          this.notFormatedCellArray.push(worksheet._rows.length);
          // style row having total
          if (groupItem.level === 0) {
            worksheet.getRow(worksheet._rows.length).eachCell(cell => {
              this.exportColumnDefinitions.forEach(element => {
                cell.font = {
                  name: 'Arial',
                  size: 10,
                  bold: true,
                  color: { argb: 'ffffff' }
                };
                cell.alignment = { wrapText: true, horizontal: 'center' };
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: '004261' },
                  bgColor: { argb: '004261' },
                };
                cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' }
                };
              });
            });
          } else if (groupItem.level > 0) {
            worksheet.getRow(worksheet._rows.length).eachCell(cell => {
              this.exportColumnDefinitions.forEach(element => {
                cell.font = {
                  name: 'Arial',
                  size: 10,
                };
                cell.alignment = { wrapText: true, horizontal: 'center' };
                cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' }
                };
              });
            });
          }
        } else {
          Object.keys(groupItem.rows).forEach(key => {
            const obj = {};
            for (const item2 of this.exportColumnDefinitions) {
              if (item2.id === 'trn_date') {
                obj[item2.id] = new DatePipe('en-in').transform((groupItem.rows[key][item2.id]));
              } else {
                obj[item2.id] = this.checkReturn(this.common.htmlToText(groupItem.rows[key][item2.id]));
              }

            }
            worksheet.addRow(obj);
          });
          const obj3: any = {};
          obj3['id'] = 'footer'; 
          obj3['srno'] = '';
          obj3['trn_date'] = this.getLevelFooter(groupItem.level, groupItem);
          obj3['particulars'] = '';
          obj3['stu_admission_no'] = '';
          obj3['stu_full_name'] = '';
          obj3['stu_class_name'] = '';
          obj3['store'] = '';
          obj3['deposit_amt'] =
          new IndianCurrency().transform(groupItem.rows.map(t => t.deposit_amt ? t.deposit_amt : 0).reduce((acc, val) => acc + val, 0));
          obj3['withdrawal_amt'] =
          new IndianCurrency().transform(groupItem.rows.map(t => t.withdrawal_amt ? t.withdrawal_amt : 0).reduce((acc, val) => acc + val, 0));
          if (this.reportType === 'wallet_transaction_all') {
          obj3['purchase_amt'] =
          new IndianCurrency().transform(groupItem.rows.map(t => t.purchase_amt ? t.purchase_amt : 0).reduce((acc, val) => acc + val, 0));
          
          }
          worksheet.addRow(obj3);
          this.notFormatedCellArray.push(worksheet._rows.length);
          if (groupItem.level === 0) {
            worksheet.getRow(worksheet._rows.length).eachCell(cell => {
              this.exportColumnDefinitions.forEach(element => {
                cell.font = {
                  name: 'Arial',
                  size: 10,
                  bold: true,
                  color: { argb: 'ffffff' }
                };
                cell.alignment = { wrapText: true, horizontal: 'center' };
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: '004261' },
                  bgColor: { argb: '004261' },
                };
                cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' }
                };
              });
            });
          } else if (groupItem.level > 0) {
            worksheet.getRow(worksheet._rows.length).eachCell(cell => {
              this.exportColumnDefinitions.forEach(element => {
                cell.font = {
                  name: 'Arial',
                  size: 10,
                };
                cell.alignment = { wrapText: true, horizontal: 'center' };
                cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' }
                };
              });
            });
          }
        }
      }
    }
  }
  exportAsPDF(json: any[]) {
    const headerData: any[] = [];
    this.pdfrowdata = [];
    this.levelHeading = [];
    this.levelTotalFooter = [];
    this.levelSubtotalFooter = [];
    this.exportColumnDefinitions = [];
    this.exportColumnDefinitions = this.angularGrid.slickGrid.getColumns();
    let reportType: any = '';
    this.sessionName = this.getSessionName(this.session.ses_id);
    reportType = new TitleCasePipe().transform(this.reportname) + this.sessionName;
    const doc = new jsPDF('p', 'mm', 'a0');
    doc.autoTable({
      // tslint:disable-next-line:max-line-length
      head: [[new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state]],
      didDrawPage: function (data) {

      },
      headStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'left',
        fontSize: 22,
      },
      useCss: true,
      theme: 'striped'
    });
    doc.autoTable({
      head: [[reportType]],
      margin: { top: 0 },
      didDrawPage: function (data) {

      },
      headStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'left',
        fontSize: 20,
      },
      useCss: true,
      theme: 'striped'
    });
    const rowData: any[] = [];
    for (const item of this.exportColumnDefinitions) {
      headerData.push(item.name);
    }
    if (this.dataviewObj.getGroups().length === 0) {
      Object.keys(this.dataset).forEach((key: any) => {
        const arr: any[] = [];
        for (const item2 of this.exportColumnDefinitions) {
          if (item2.id === 'trn_date') {
            arr.push(new DatePipe('en-in').transform((this.dataset[key][item2.id])));
          } else if (item2.id === 'deposit_amt' || item2.id === 'withdrawal_amt') {
            this.dataset[key][item2.id] ? this.dataset[key][item2.id] : ''
            arr.push(this.dataset[key][item2.id]);
          } else {
            arr.push(this.common.htmlToText(this.dataset[key][item2.id]));
          }
        }
        rowData.push(arr);
        this.pdfrowdata.push(arr);
      });
    } else {
      // iterate all groups
      this.checkGroupLevelPDF(this.dataviewObj.getGroups(), doc, headerData);
    }
    if (this.totalRow) {
      const arr: any[] = [];
      for (const item of this.exportColumnDefinitions) {
        arr.push(this.totalRow[item.id]);
      }
      rowData.push(arr);
      this.pdfrowdata.push(arr);
    }
    doc.levelHeading = this.levelHeading;
    doc.levelTotalFooter = this.levelTotalFooter;
    doc.levelSubtotalFooter = this.levelSubtotalFooter;
    doc.autoTable({
      head: [headerData],
      body: this.pdfrowdata,
      startY: doc.previousAutoTable.finalY + 0.5,
      tableLineColor: 'black',
      didDrawPage: function (data) {
        doc.setFontStyle('bold');

      },
      willDrawCell: function (data) {
        // tslint:disable-next-line:no-shadowed-variable
        const doc = data.doc;
        const rows = data.table.body;

        // level 0
        const lfIndex = doc.levelTotalFooter.findIndex(item => item === data.row.index);
        if (lfIndex !== -1) {
          doc.setFontStyle('bold');
          doc.setFontSize('18');
          doc.setTextColor('#ffffff');
          doc.setFillColor(0, 62, 120);
        }

        // level more than 0
        const lsfIndex = doc.levelSubtotalFooter.findIndex(item => item === data.row.index);
        if (lsfIndex !== -1) {
          doc.setFontStyle('bold');
          doc.setFontSize('18');
          doc.setTextColor('#ffffff');
          doc.setFillColor(229, 136, 67);
        }

        // group heading
        const lhIndex = doc.levelHeading.findIndex(item => item === data.row.index);
        if (lhIndex !== -1) {
          doc.setFontStyle('bold');
          doc.setFontSize('18');
          doc.setTextColor('#5e666d');
          doc.setFillColor('#c8d6e5');
        }

        // grand total
        if (data.row.index === rows.length - 1) {
          doc.setFontStyle('bold');
          doc.setFontSize('18');
          doc.setTextColor('#ffffff');
          doc.setFillColor(67, 160, 71);
        }
      },
      headStyles: {
        fontStyle: 'bold',
        fillColor: '#c8d6e5',
        textColor: '#5e666d',
        fontSize: 18,
      },
      alternateRowStyles: {
        fillColor: '#f1f4f7'
      },
      useCss: true,
      styles: {
        fontSize: 18,
        cellWidth: 'auto',
        textColor: 'black',
        lineColor: '#89a8c8',
      },
      theme: 'grid'
    });
    if (this.groupColumns.length > 0) {
      doc.autoTable({
        // tslint:disable-next-line:max-line-length
        head: [['Groupded As:  ' + this.getGroupColumns(this.groupColumns)]],
        didDrawPage: function (data) {

        },
        headStyles: {
          fontStyle: 'bold',
          fillColor: '#ffffff',
          textColor: 'black',
          halign: 'left',
          fontSize: 20,
        },
        useCss: true,
        theme: 'striped'
      });
    }
    doc.autoTable({
      // tslint:disable-next-line:max-line-length
      head: [['Report Filtered as:  ' + this.getParamValue()]],
      didDrawPage: function (data) {

      },
      headStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'left',
        fontSize: 20,
      },
      useCss: true,
      theme: 'striped'
    });
    doc.autoTable({
      // tslint:disable-next-line:max-line-length
      head: [['No of records: ' + json.length]],
      didDrawPage: function (data) {

      },
      headStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'left',
        fontSize: 20,
      },
      useCss: true,
      theme: 'striped'
    });
    doc.autoTable({
      // tslint:disable-next-line:max-line-length
      head: [['Generated On: '
        + new DatePipe('en-in').transform(new Date(), 'd-MMM-y')]],
      didDrawPage: function (data) {

      },
      headStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'left',
        fontSize: 20,
      },
      useCss: true,
      theme: 'striped'
    });
    doc.autoTable({
      // tslint:disable-next-line:max-line-length
      head: [['Generated By: ' + new TitleCasePipe().transform(this.currentUser.full_name)]],
      didDrawPage: function (data) {

      },
      headStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'left',
        fontSize: 20,
      },
      useCss: true,
      theme: 'striped'
    });
    doc.save(reportType + '_' + this.reportdate + '.pdf');
  }
  checkGroupLevelPDF(item, doc, headerData) {
    if (item.length > 0) {
      for (const groupItem of item) {
        // add and style for groupeditem level heading
        this.pdfrowdata.push([groupItem.value + ' (' + groupItem.rows.length + ')']);
        this.levelHeading.push(this.pdfrowdata.length - 1);
        if (groupItem.groups) {
          this.checkGroupLevelPDF(groupItem.groups, doc, headerData);
          const levelArray: any[] = [];
          const obj3: any = {};
          obj3['srno'] = '';
          obj3['trn_date'] = this.getLevelFooter(groupItem.level, groupItem);
          obj3['particulars'] = '';
          obj3['stu_admission_no'] = '';
          obj3['stu_full_name'] = '';
          obj3['stu_class_name'] = '';
          obj3['store'] = '';
          obj3['deposit_amt'] =
          new IndianCurrency().transform(groupItem.rows.map(t => t.deposit_amt ? t.deposit_amt : 0).reduce((acc, val) => acc + val, 0));
          obj3['withdrawal_amt'] =
          new IndianCurrency().transform(groupItem.rows.map(t => t.withdrawal_amt ? t.withdrawal_amt : 0).reduce((acc, val) => acc + val, 0));
          if (this.reportType === 'wallet_transaction_all') {
          obj3['purchase_amt'] =
          new IndianCurrency().transform(groupItem.rows.map(t => t.purchase_amt ? t.purchase_amt : 0).reduce((acc, val) => acc + val, 0));
          
          }
          for (const col of this.exportColumnDefinitions) {
            Object.keys(obj3).forEach((key: any) => {
              if (col.id === key) {
                levelArray.push(obj3[key]);
              }
            });
          }
          if (groupItem.level === 0) {
            this.pdfrowdata.push(levelArray);
            this.levelTotalFooter.push(this.pdfrowdata.length - 1);
          } else if (groupItem.level > 0) {
            this.pdfrowdata.push(levelArray);
            this.levelSubtotalFooter.push(this.pdfrowdata.length - 1);
          }

        } else {
          const rowData: any[] = [];
          Object.keys(groupItem.rows).forEach(key => {
            const arr: any = [];
            for (const item2 of this.columnDefinitions) {
              if (item2.id === 'trn_date') {
                arr.push(new DatePipe('en-in').transform((groupItem.rows[key][item2.id])));
              } else if (item2.id === 'deposit_amt' || item2.id === 'withdrawal_amt') {
                groupItem.rows[key][item2.id] ? groupItem.rows[key][item2.id] : ''
                arr.push(groupItem.rows[key][item2.id]);
              } else {
                arr.push(this.common.htmlToText(groupItem.rows[key][item2.id]));
              }
            }
            rowData.push(arr);
            this.pdfrowdata.push(arr);
          });
          const levelArray: any[] = [];
          const obj3: any = {};
          obj3['srno'] = '';
          obj3['trn_date'] = this.getLevelFooter(groupItem.level, groupItem);
          obj3['particulars'] = '';
          obj3['stu_admission_no'] = '';
          obj3['stu_full_name'] = '';
          obj3['stu_class_name'] = '';
          obj3['store'] = '';
          obj3['deposit_amt'] = 
          new IndianCurrency().transform(groupItem.rows.map(t => t.deposit_amt ? t.deposit_amt : 0).reduce((acc, val) => acc + val, 0));
          obj3['withdrawal_amt'] =
          new IndianCurrency().transform(groupItem.rows.map(t => t.withdrawal_amt ? t.withdrawal_amt : 0).reduce((acc, val) => acc + val, 0));
          if (this.reportType === 'wallet_transaction_all') {
          obj3['purchase_amt'] =
          new IndianCurrency().transform(groupItem.rows.map(t => t.purchase_amt ? t.purchase_amt : 0).reduce((acc, val) => acc + val, 0));
          
          }
          for (const col of this.exportColumnDefinitions) {
            Object.keys(obj3).forEach((key: any) => {
              if (col.id === key) {
                levelArray.push(obj3[key]);
              }
            });
          }
          if (groupItem.level === 0) {
            this.pdfrowdata.push(levelArray);
            this.levelTotalFooter.push(this.pdfrowdata.length - 1);
          } else if (groupItem.level > 0) {
            this.pdfrowdata.push(levelArray);
            this.levelSubtotalFooter.push(this.pdfrowdata.length - 1);
          }
        }
      }
    }
  }
  exportToFile(type = 'csv') {
    let reportType: any = '';
    this.sessionName = this.getSessionName(this.session.ses_id);
    this.angularGrid.exportService.exportToFile({
      delimiter: (type === 'csv') ? DelimiterType.comma : DelimiterType.tab,
      filename: reportType + '_' + new Date(),
      format: (type === 'csv') ? FileType.csv : FileType.txt
    });
  }
}
