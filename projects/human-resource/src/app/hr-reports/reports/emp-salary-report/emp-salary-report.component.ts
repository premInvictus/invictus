import { Component, OnInit, Input, ViewChild } from '@angular/core';
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
import { SisService, CommonAPIService } from '../../../_services/index';
import { DecimalPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { CapitalizePipe } from 'src/app/_pipes';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';
@Component({
  selector: 'app-emp-salary-report',
  templateUrl: './emp-salary-report.component.html',
  styleUrls: ['./emp-salary-report.component.scss']
})
export class EmpSalaryReportComponent implements OnInit {
  sessionArray: any[] = [];
  totalRow: any;
  groupColumns: any[] = [];
  groupLength: any;
  session: any = {};
  columnDefinitions1: Column[] = [];
  exportColumnDefinitions: any[] = [];
  tableFlag = false;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  angularGrid: AngularGridInstance;
  dataviewObj: any;
  draggableGroupingPlugin: any;
  gridObj: any;
  selectedGroupingFields: string[] = ['', '', ''];
  aggregatearray: any[] = [];
  reportFilterForm: FormGroup;
  reportType = '1';
  dataArr: any[] = [];
  schoolInfo: any;
  sessionName: any;
  employeeData: any;
  salaryHeadsArr: any[] = [];
  shacolumns = [];
  empShacolumns = [];
  shdcolumns = [];
  empShdcolumns = [];
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
  currentUser: any;
  pdfrowdata: any[] = [];
  levelHeading: any[] = [];
  levelTotalFooter: any[] = [];
  levelSubtotalFooter: any[] = [];
  notFormatedCellArray: any[] = [];
  vendorData = '';
  subjectDataArray: any[] = [];
  session_id: any;
  paymentModeArray: any[] = [];
  @Input() userName: any = '';
  constructor(translate: TranslateService,
    private commonAPIService: CommonAPIService,
    private erpCommonService: ErpCommonService,
    public dialog: MatDialog,
    private fbuild: FormBuilder) { }

  ngOnInit() {
    this.getSession();
    this.getSchool();
    this.buildForm();
    const value = { "filters": [{ "filter_type": "", "filter_value": "", "type": "" }], "generalFilters": { "type_id": null, "genre.genre_name": null, "category_id": null, "reserv_status": null, "source": null, "language_details.lang_code": null, "user": localStorage.getItem('currentUser'), "from_date": "", "to_date": "", "rfid": "" }, "search_from": "master" };
    this.getAccessionReport('');
    this.getPaymentModes();
    this.getSalaryHeads();
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid; // grid object
    this.dataviewObj = angularGrid.dataView;
    this.updateTotalRow(angularGrid.slickGrid);
  }
  updateTotalRow(grid: any) {
    if (this.totalRow) {
      let columnIdx = grid.getColumns().length;
      while (columnIdx--) {
        const columnId = grid.getColumns()[columnIdx].id;
        const columnElement: HTMLElement = grid.getFooterRowColumn(columnId);
        columnElement.innerHTML = '<b>' + this.totalRow[columnId] + '<b>';
      }
    }

  }
  buildForm() {
    this.reportFilterForm = this.fbuild.group({
      'class_value': '',
      'hidden_value': '',
      'report_type': '',
      'downloadAll': true,
    });
  }
  getSession() {
    this.erpCommonService.getSession()
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            for (const citem of result.data) {
              this.sessionArray[citem.ses_id] = citem.ses_name;
            }
            if (this.session_id) {
              this.sessionName = this.sessionArray[this.session_id.ses_id];
            }

          }
        });
  }

  getPaymentModes() {
    this.commonAPIService.getMaster({ type_id: "6" }).subscribe((res: any) => {
      if (res) {
        for (let i = 0; i < res.length; i++) {
          var calculation_type = 'text';
          var calculation_value = 0;
          if (res && res[i] && res[i]['type'] && res[i]['type']['calculation_type'] && res[i]['type']['calculation_type']['cy_name'] === '%') {
            calculation_value = res[i]['type']['calculation_type']['cy_value'];
            calculation_type = res[i]['type']['calculation_type']['cy_name'];
          }

          var inputJson = {
            'pm_id': res[i]['name'] ? res[i]['name'].trim().toLowerCase().replace(' ', '_') : '',
            'pm_name': res[i]['name'],
            'pm_value': 0,
            'calculation_type': calculation_type,
            'calculation_value': calculation_value
          }
          this.paymentModeArray.push(inputJson);
        }
      }
    });
  }
  getSalaryHeads() {
    this.commonAPIService.getSalaryHeads({}).subscribe((res: any) => {
      if (res) {
        this.salaryHeadsArr = [];
        this.salaryHeadsArr = res;
        this.shacolumns = [];
        this.shdcolumns = [];
        this.shacolumns[0] = { columnDef: 'Basic Pay', header: 'Basic Pay', data: { sc_type: { 'type_id': 1 } } };
        for (var i = 0; i < this.salaryHeadsArr.length; i++) {
          //console.log("this.salaryHeadsArr[i]['sc_type']", this.salaryHeadsArr[i]['sc_type']);
          if (Number(this.salaryHeadsArr[i]['sc_type']['type_id']) === 1) {
            this.shacolumns.push({ columnDef: this.salaryHeadsArr[i]['sc_name'], header: this.salaryHeadsArr[i]['sc_name'], data: this.salaryHeadsArr[i] });
          }
          if (Number(this.salaryHeadsArr[i]['sc_type']['type_id']) === 2) {
            this.shdcolumns.push({ columnDef: this.salaryHeadsArr[i]['sc_name'], header: this.salaryHeadsArr[i]['sc_name'], data: this.salaryHeadsArr[i], value: 0 });
          }
        }
        //this.getAllEmployee();
      }
    });
  }

  getSchool() {
    this.erpCommonService.getSchool()
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.schoolInfo = result.data[0];
          }
        });
  }
  getAccessionReport(value: any) {


    this.dataArr = [];
    this.aggregatearray = [];
    this.columnDefinitions = [];
    this.dataset = [];
    this.tableFlag = false;
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
      enableExcelCopyBuffer: true,
      fullWidthRows: true,
      enableAutoTooltip: true,
      enableCellNavigation: true,
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

            //this.exportAsPDF(this.dataset);
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

            //	this.exportToExcel(this.dataset);
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
          setTimeout(() => {
            this.updateTotalRow(this.angularGrid.slickGrid);
          }, 100);
        },
        onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
      }
    };
    let repoArray = [];
    this.columnDefinitions = [];
    this.dataset = [];
    let accessionJSON: any;
    if (value) {
      accessionJSON = value;
    } else {
      accessionJSON = { "withoutFilter": true }
    }

    this.columnDefinitions = [
      {
        id: 'srno',
        name: 'SNo.',
        field: 'srno',
        sortable: true,
        maxWidth: 40
      },
      {
        id: 'full_name', name: 'Full Name', field: 'full_name', sortable: true,
        filterable: true,
        filterSearchType: FieldType.string,
        filter: { model: Filters.compoundInput },
        formatter: this.bookNoFormatter,
        width: 80,
        grouping: {
          getter: 'full_name',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false
        },
        groupTotalsFormatter: this.srnTotalsFormatter
      },
      {
        id: 'pan_no', name: 'PAN No.', field: 'pan_no', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string,
        filter: { model: Filters.compoundInput },
        grouping: {
          getter: 'pan_no',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false
        },
      },
      {
        id: 'aadhar_no', name: 'Aadhar No.', field: 'aadhar_no', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string,
        filter: { model: Filters.compoundInput },
        grouping: {
          getter: 'aadhar_no',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false
        },
      },

      {
        id: 'pf_acc_no', name: 'PF Acc. No.', field: 'pf_acc_no', sortable: true,
        filterable: true,
        width: 80,
        filterSearchType: FieldType.string,
        filter: { model: Filters.compoundInput },
        grouping: {
          getter: 'pf_acc_no',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'esi_ac_no', name: 'ESI Acc. No.', field: 'esi_ac_no', sortable: true,
        filterable: true,
        width: 80,
        filterSearchType: FieldType.string,
        filter: { model: Filters.compoundInput },
        grouping: {
          getter: 'esi_ac_no',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'nominee_detail', name: 'Nominee', field: 'nominee_detail', sortable: true,
        filterable: true,
        width: 80,
        filterSearchType: FieldType.number,
        filter: { model: Filters.compoundInput },
        grouping: {
          getter: 'nominee_detail',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'doj', name: 'Date of Joining', field: 'doj', sortable: true,
        filterable: true,
        width: 80,
        filterSearchType: FieldType.number,
        filter: { model: Filters.compoundInput },
        grouping: {
          getter: 'doj',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'pf_joining_date', name: 'PF Joining Date', field: 'pf_joining_date', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string,
        filter: { model: Filters.compoundInput },
        grouping: {
          getter: 'pf_joining_date',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'esic_joining_date', name: 'ESI Joining Date', field: 'esic_joining_date', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'esic_joining_date',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        }
      },
      {
        id: 'probation_till_date', name: 'Probation', field: 'probation_till_date', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'probation_till_date',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'confirmation_date', name: 'Confirmation Date', field: 'confirmation_date', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'confirmation_date',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'category_1', name: 'Category I', field: 'category_1', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'category_1',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'category_2', name: 'Category II', field: 'category_2', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'category_2',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'supervisor', name: 'Supervisor', field: 'supervisor', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'supervisor',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'emp_pay_scale', name: 'Pay Scale', field: 'emp_pay_scale', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'emp_pay_scale',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
    ];

    this.commonAPIService.getAllEmployee({}).subscribe((result: any) => {
      if (result && result.length > 0) {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
        repoArray = result;
        let index = 0;
        for (const item of repoArray) {

          this.empShacolumns = [];
          this.empShdcolumns = [];
          var total_deductions = 0;
          var total_earnings = 0;
          var empBasicPay = item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.emp_basic_pay_scale ? Number(item.emp_salary_detail.emp_salary_structure.emp_basic_pay_scale) : 0;
          for (var i = 0; i < this.shacolumns.length; i++) {
            if (Number(this.shacolumns[i]['data']['sc_type']['type_id']) === 1) {
              var value = 0;

              if (this.shacolumns[i]['header'] === 'Basic Pay') {
                this.empShacolumns[i] = { columnDef: this.shacolumns[i]['data']['sc_name'], header: this.shacolumns[i]['data']['sc_name'], value: empBasicPay };
              } else {
                this.empShacolumns[i] = { columnDef: this.shacolumns[i]['data']['sc_name'], header: this.shacolumns[i]['data']['sc_name'], value: 0 };
              }

              if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads) {
                for (var j = 0; j < item.emp_salary_detail.emp_salary_structure.emp_salary_heads.length; j++) {
                  if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j] && Number(this.shacolumns[i]['data']['sc_id']) === Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_id'])) {

                    if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] &&
                      item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_type'] &&
                      Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_type']['type_id']) === 1
                    ) {
                      if ((item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type']).toLowerCase() === 'text') {
                        value = Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value']);
                      }

                      if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] === '%') {
                        value = (Number(empBasicPay) * Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value'])) / 100;
                      }

                      this.empShacolumns[i]['value'] = value.toFixed(2);
                      this.shacolumns[i]['value'] = value.toFixed(2);
                      total_earnings = total_earnings + Number(value);

                    } else {
                      this.shacolumns[i]['value'] = 0;
                      this.empShacolumns[i]['value'] = 0;
                    }
                  }
                }
              }

            }
          }
          for (var i = 0; i < this.shdcolumns.length; i++) {
            if (Number(this.shdcolumns[i]['data']['sc_type']['type_id']) === 2) {
              var value = 0;
              this.empShdcolumns[i] = { columnDef: this.shdcolumns[i]['data']['sc_name'], header: this.shdcolumns[i]['data']['sc_name'], value: 0 };

              if (item.emp_salary_detail
                && item.emp_salary_detail.emp_salary_structure
                && item.emp_salary_detail.emp_salary_structure.emp_salary_heads) {
                for (var j = 0; j < item.emp_salary_detail.emp_salary_structure.emp_salary_heads.length; j++) {
                  if (this.shdcolumns[i]['data'] && item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j] && Number(this.shdcolumns[i]['data']['sc_id']) === Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_id'])) {

                    if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] &&
                      item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_type'] &&
                      Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_type']['type_id']) === 2
                    ) {
                      if ((item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type']).toLowerCase() === 'text') {
                        value = Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value']);
                      }

                      if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] === '%') {
                        value = (Number(empBasicPay) * Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value'])) / 100;

                      }
                      this.empShdcolumns[i]['value'] = value.toFixed(2);
                      this.shdcolumns[i]['value'] = value.toFixed(2);
                      total_deductions = total_deductions - Number(value);

                    } else {
                      this.shdcolumns[i]['value'] = 0;
                      this.empShdcolumns[i]['value'] = 0;
                    }

                  }
                }
              }

            }

          }
          if (index === 0) {
            for (const item of this.shacolumns) {
              this.columnDefinitions.push({
                id: item.columnDef, name: item.header, field: item.columnDef, sortable: true,
                filterable: true,
                filterSearchType: FieldType.string,
                filter: { model: Filters.compoundInput },
                formatter: this.bookNoFormatter,
                width: 80,
                grouping: {
                  getter: item.columnDef,
                  formatter: (g) => {
                    return `${g.value}  <span style="color:green">(${g.count})</span>`;
                  },
                  aggregators: this.aggregatearray,
                  aggregateCollapsed: true,
                  collapsed: false
                },
                groupTotalsFormatter: this.srnTotalsFormatter
              });
            }
            for (const item of this.empShdcolumns) {
              this.columnDefinitions.push({
                id: item.columnDef, name: item.header, field: item.columnDef, sortable: true,
                filterable: true,
                filterSearchType: FieldType.string,
                filter: { model: Filters.compoundInput },
                formatter: this.bookNoFormatter,
                width: 80,
                grouping: {
                  getter: item.columnDef,
                  formatter: (g) => {
                    return `${g.value}  <span style="color:green">(${g.count})</span>`;
                  },
                  aggregators: this.aggregatearray,
                  aggregateCollapsed: true,
                  collapsed: false
                },
                groupTotalsFormatter: this.srnTotalsFormatter
              });
            }
          }

          const obj: any = {};
          obj['id'] = (index + 1);
          obj['srno'] = (index + 1);
          obj['full_name'] = item.emp_name ? new CapitalizePipe().transform(item.emp_name) : '-';
          obj['pan_no'] = item.emp_salary_detail.account_docment_detail ? item.emp_salary_detail.account_docment_detail.pan_no : '';
          obj['aadhar_no'] = item.emp_salary_detail.account_docment_detail ? item.emp_salary_detail.account_docment_detail.aadhar_no : '';
          obj['esi_ac_no'] = item.emp_salary_detail.account_docment_detail ? item.emp_salary_detail.account_docment_detail.esi_ac_no : '';
          obj['pf_acc_no'] = item.emp_salary_detail.account_docment_detail ? item.emp_salary_detail.account_docment_detail.pf_acc_no : '';
          obj['doj'] = item.emp_salary_detail.emp_organisation_relation_detail ? item.emp_salary_detail.emp_organisation_relation_detail.doj : '';
          obj['pf_joining_date'] = item.emp_salary_detail.emp_organisation_relation_detail ? item.emp_salary_detail.emp_organisation_relation_detail.pf_joining_date : '';
          obj['esic_joining_date'] = item.emp_salary_detail.emp_organisation_relation_detail ? item.emp_salary_detail.emp_organisation_relation_detail.esic_joining_date : '';
          obj['probation_till_date'] = item.emp_salary_detail.emp_organisation_relation_detail ? item.emp_salary_detail.emp_organisation_relation_detail.probation_till_date : '';
          obj['confirmation_date'] = item.emp_salary_detail.emp_organisation_relation_detail ? item.emp_salary_detail.emp_organisation_relation_detail.confirmation_date : '';
          obj['nominee_detail'] = item.emp_salary_detail.nominee_detail ? item.emp_salary_detail.nominee_detail.name : '';
          obj['bnk_name'] = item.emp_salary_detail.emp_bank_detail[0] && item.emp_salary_detail.emp_bank_detail[0].bnk_detail ? item.emp_salary_detail.emp_bank_detail[0].bnk_detail.bnk_name : '';
          obj['bnk_ifsc'] = item.emp_salary_detail.emp_bank_detail[0] && item.emp_salary_detail.emp_bank_detail[0].bnk_detail ? item.emp_salary_detail.emp_bank_detail[0].bnk_detail.bnk_ifsc : '';
          obj['bnk_acc_no'] = item.emp_salary_detail.emp_bank_detail[0] && item.emp_salary_detail.emp_bank_detail[0].bnk_detail ? item.emp_salary_detail.emp_bank_detail[0].bnk_detail.bnk_acc_no : '';
          obj['incremental_month'] = item.emp_salary_detail.emp_incremental_month_detail ? item.emp_salary_detail.emp_incremental_month_detail.month_data : '';
          obj['contact_period'] = item.emp_salary_detail.emp_job_detail ? item.emp_salary_detail.emp_job_detail.contact_period : '';
          obj['category_1'] = item.emp_salary_detail.emp_job_detail && item.emp_salary_detail.emp_job_detail.category_1 ? item.emp_salary_detail.emp_job_detail.category_1.cat_name : '';
          obj['category_2'] = item.emp_salary_detail.emp_job_detail && item.emp_salary_detail.emp_job_detail.category_2 ? item.emp_salary_detail.emp_job_detail.category_2.cat_name : '';
          obj['supervisor'] = item.emp_supervisor ? item.emp_supervisor.name : '';
          obj['emp_pay_scale'] = item.emp_salary_detail.emp_salary_structure.emp_pay_scale ? item.emp_salary_detail.emp_salary_structure.emp_pay_scale.pc_name : '';
          for (const item of this.empShacolumns) {
            obj[item.columnDef] = item.value;
          }
          for (const item of this.empShdcolumns) {
            obj[item.columnDef] = item.value;
          }
          this.dataset.push(obj);
          index++;
        }
        this.tableFlag = true;
      } else {
        this.tableFlag = true;
      }
    });

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
  resetValues() {
    this.reportFilterForm.patchValue({
      'class_value': '',
      'hidden_value': '',
      'report_type': '',
      'downloadAll': true,
    });
  }
  exportToFile(type = 'csv') {
    let reportType: any = '';
    this.sessionName = this.getSessionName(this.session.ses_id);
    reportType = new TitleCasePipe().transform('Accession Master:') + this.sessionName;
    this.angularGrid.exportService.exportToFile({
      delimiter: (type === 'csv') ? DelimiterType.comma : DelimiterType.tab,
      filename: reportType + '_' + new Date(),
      format: (type === 'csv') ? FileType.csv : FileType.txt
    });
  }
  getSessionName(id) {
    const findex = this.sessionArray.findIndex(f => f.ses_id === id);
    if (findex !== -1) {
      return this.sessionArray[findex].ses_name;
    }
  }
  bookNoFormatter(row, cell, value, columnDef, dataContext) {
    if (value !== '-') {
      return '<div style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
        + '<span class="book-no"><a href="javascript:void(0)">' + value + '</a></span>' + '</div>';
    } else {
      return '-';
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
}
