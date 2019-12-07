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
  @ViewChild('searchModal') searchModal;
  sessionArray: any[] = [];
  totalRow: any;
  groupColumns: any[] = [];
  groupLength: any;
  nodataFlag = false;
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
  gridHeight: any;
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
    this.getSalaryReport('');
    this.getPaymentModes();
    this.getSalaryHeads();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
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
    this.erpCommonService.getSession().subscribe((result2: any) => {
      if (result2.status === 'ok') {
        this.sessionArray = result2.data;
        this.sessionName = this.getSessionName(this.session.ses_id);
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
  getSalaryReport(value: any) {
    this.dataArr = [];
    this.aggregatearray = [];
    this.columnDefinitions = [];
    this.dataset = [];
    this.tableFlag = false;
    this.nodataFlag = false;
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
      // "withoutFilter": true
      accessionJSON = {};
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
        filterSearchType: FieldType.string
      },
      {
        id: 'pan_no', name: 'PAN No.', field: 'pan_no', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string
      },
      {
        id: 'aadhar_no', name: 'Aadhar No.', field: 'aadhar_no', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string
      },

      {
        id: 'pf_acc_no', name: 'PF Acc. No.', field: 'pf_acc_no', sortable: true,
        filterable: true,
        width: 80,
        filterSearchType: FieldType.string
      },
      {
        id: 'esi_ac_no', name: 'ESI Acc. No.', field: 'esi_ac_no', sortable: true,
        filterable: true,
        width: 80,
        filterSearchType: FieldType.string
      },
      {
        id: 'nominee_detail', name: 'Nominee', field: 'nominee_detail', sortable: true,
        filterable: true,
        width: 80,
        filterSearchType: FieldType.number
      },
      {
        id: 'doj', name: 'Date of Joining', field: 'doj', sortable: true,
        filterable: true,
        width: 80,
        filterSearchType: FieldType.number,
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
        filterSearchType: FieldType.number
      },
      {
        id: 'confirmation_date', name: 'Confirmation Date', field: 'confirmation_date', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number
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
    // this.commonAPIService.getAllEmployee({}).subscribe((result: any) => {
    this.commonAPIService.getFilterData(accessionJSON).subscribe((result: any) => {
      if (result && result.data.length > 0) {
        const salaryHead: any[] = [];
        const deductionHead: any[] = [];
        this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
        repoArray = result.data;
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
                this.empShacolumns[i] = { columnDef: this.shacolumns[i]['header'], header: this.shacolumns[i]['header'], value: empBasicPay };
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
            for (const item of this.empShacolumns) {
              salaryHead.push(item.columnDef);
              if (item.columnDef === 'Basic Pay') {
                this.columnDefinitions.push({
                  id: item.columnDef, name: item.header, field: item.columnDef, sortable: true,
                  filterable: true,
                  filterSearchType: FieldType.string,
                  width: 80,
                  grouping: {
                    getter: item.columnDef,
                    formatter: (g) => {
                      return `${g.value}  <span style="color:green">(${g.count})</span>`;
                    },
                    aggregators: this.aggregatearray,
                    aggregateCollapsed: true,
                    collapsed: false
                  }
                });
              } else {
                this.columnDefinitions.push({
                  id: item.columnDef, name: item.header, field: item.columnDef, sortable: true,
                  filterable: true,
                  filterSearchType: FieldType.string,
                  width: 80,
                });
              }

            }
            for (const item of this.empShdcolumns) {
              deductionHead.push(item.columnDef);
              this.columnDefinitions.push({
                id: item.columnDef, name: item.header, field: item.columnDef, sortable: true,
                filterable: true,
                filterSearchType: FieldType.string
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
          obj['doj'] = item.emp_salary_detail.emp_organisation_relation_detail ?
            this.commonAPIService.dateConvertion(item.emp_salary_detail.emp_organisation_relation_detail.doj, 'dd-MMM-y') : '';
          obj['pf_joining_date'] = item.emp_salary_detail.emp_organisation_relation_detail ?
            this.commonAPIService.dateConvertion(item.emp_salary_detail.emp_organisation_relation_detail.pf_joining_date, 'dd-MMM-y') : '';
          obj['esic_joining_date'] = item.emp_salary_detail.emp_organisation_relation_detail ?
            this.commonAPIService.dateConvertion(item.emp_salary_detail.emp_organisation_relation_detail.esic_joining_date, 'dd-MMM-y') : '';
          obj['probation_till_date'] = item.emp_salary_detail.emp_organisation_relation_detail ?
            this.commonAPIService.dateConvertion(item.emp_salary_detail.emp_organisation_relation_detail.probation_till_date, 'dd-MMM-y') : '';
          obj['confirmation_date'] = item.emp_salary_detail.emp_organisation_relation_detail ?
            this.commonAPIService.dateConvertion(item.emp_salary_detail.emp_organisation_relation_detail.confirmation_date, 'dd-MMM-y') : '';
          obj['nominee_detail'] = item.emp_salary_detail.nominee_detail ? item.emp_salary_detail.nominee_detail.name : '';
          obj['bnk_name'] = item.emp_salary_detail.emp_bank_detail[0] && item.emp_salary_detail.emp_bank_detail[0].bnk_detail ? item.emp_salary_detail.emp_bank_detail[0].bnk_detail.bnk_name : '';
          obj['bnk_ifsc'] = item.emp_salary_detail.emp_bank_detail[0] && item.emp_salary_detail.emp_bank_detail[0].bnk_detail ? item.emp_salary_detail.emp_bank_detail[0].bnk_detail.bnk_ifsc : '';
          obj['bnk_acc_no'] = item.emp_salary_detail.emp_bank_detail[0] && item.emp_salary_detail.emp_bank_detail[0].bnk_detail ? item.emp_salary_detail.emp_bank_detail[0].bnk_detail.bnk_acc_no : '';
          obj['incremental_month'] = item.emp_salary_detail.emp_incremental_month_detail ? item.emp_salary_detail.emp_incremental_month_detail.month_data : '';
          obj['contact_period'] = item.emp_salary_detail.emp_job_detail ? item.emp_salary_detail.emp_job_detail.contact_period : '';
          obj['category_1'] = item.emp_salary_detail.emp_job_detail && item.emp_salary_detail.emp_job_detail.category_1 ? item.emp_salary_detail.emp_job_detail.category_1.name : '';
          obj['category_2'] = item.emp_salary_detail.emp_job_detail && item.emp_salary_detail.emp_job_detail.category_2 ? item.emp_salary_detail.emp_job_detail.category_2.name : '';
          obj['supervisor'] = item.emp_supervisor ? item.emp_supervisor.name : '';
          obj['emp_pay_scale'] = item.emp_salary_detail.emp_salary_structure.emp_pay_scale ? item.emp_salary_detail.emp_salary_structure.emp_pay_scale.pc_name : '';
          for (const item of this.empShacolumns) {
            obj[item.columnDef] = item.value;
          }
          for (const item of this.empShdcolumns) {
            obj[item.columnDef] = item.value;
          }
          obj['net_salary'] = item.emp_salary_detail.emp_salary_structure ? item.emp_salary_detail.emp_salary_structure.emp_net_salary : 0;
          obj['total_salary'] = item.emp_salary_detail.emp_salary_structure ? item.emp_salary_detail.emp_salary_structure.emp_total_earning : 0;

          this.dataset.push(obj);
          index++;
        }
        this.columnDefinitions.push({
          id: 'net_salary', name: 'Net Salary', field: 'net_salary', sortable: true,
          filterable: true,
          filterSearchType: FieldType.string,
          width: 80,
          grouping: {
            getter: 'net_salary',
            formatter: (g) => {
              return `${g.value}  <span style="color:green">(${g.count})</span>`;
            },
            aggregators: this.aggregatearray,
            aggregateCollapsed: true,
            collapsed: false
          }
        });
        this.columnDefinitions.push({
          id: 'total_salary', name: 'Total Earning', field: 'total_salary', sortable: true,
          filterable: true,
          filterSearchType: FieldType.string,
          width: 80
        });

        this.totalRow = {};
        const obj3: any = {};
        obj3['id'] = 'footer';
        obj3['srno'] = '';
        obj3['full_name'] = '';
        obj3['pan_no'] = '';
        obj3['aadhar_no'] = '';
        obj3['esi_ac_no'] = '';
        obj3['pf_acc_no'] = '';
        obj3['doj'] = '';
        obj3['pf_joining_date'] = '';
        obj3['esic_joining_date'] = '';
        obj3['probation_till_date'] = '';
        obj3['confirmation_date'] = '';
        obj3['nominee_detail'] = '';
        obj3['bnk_name'] = '';
        obj3['bnk_ifsc'] = '';
        obj3['bnk_acc_no'] = '';
        obj3['incremental_month'] = '';
        obj3['contact_period'] = '';
        obj3['category_1'] = '';
        obj3['category_2'] = 'Grand Total';
        obj3['supervisor'] = '';
        obj3['emp_pay_scale'] = '';
        // obj3['Basic Pay'] = this.dataset.map(t => t['Basic Pay']).reduce((acc, val) => Number(acc) + Number(val), 0);
        Object.keys(salaryHead).forEach(key2 => {
          Object.keys(this.dataset).forEach(key3 => {
            Object.keys(this.dataset[key3]).forEach(key4 => {
              if (key4 === salaryHead[key2]) {
                obj3[salaryHead[key2]] = this.dataset.map(t => t[salaryHead[key2]]).reduce((acc, val) => Number(acc) + Number(val), 0);
              }
            });
          });
        });
        Object.keys(deductionHead).forEach(key2 => {
          Object.keys(this.dataset).forEach(key3 => {
            Object.keys(this.dataset[key3]).forEach(key4 => {
              if (key4 === deductionHead[key2]) {
                obj3[deductionHead[key2]] = this.dataset.map(t => t[deductionHead[key2]]).reduce((acc, val) => Number(acc) + Number(val), 0);
              }
            });
          });
        });
        obj3['net_salary'] = this.dataset.map(t => t['net_salary']).reduce((acc, val) => Number(acc) + Number(val), 0);
        obj3['total_salary'] = this.dataset.map(t => t['total_salary']).reduce((acc, val) => Number(acc) + Number(val), 0);
        if (this.dataset.length <= 5) {
          this.gridHeight = 300;
        } else if (this.dataset.length <= 10 && this.dataset.length > 5) {
          this.gridHeight = 400;
        } else if (this.dataset.length > 10 && this.dataset.length <= 20) {
          this.gridHeight = 550;
        } else if (this.dataset.length > 20) {
          this.gridHeight = 750;
        }
        this.totalRow = obj3;
        this.tableFlag = true;
        this.nodataFlag = false;
      } else {
        this.tableFlag = true;
        this.nodataFlag = true;
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
  onCellClicked(e, args) {

  }
  onCellChanged(e, args) {

  }
  exportToExcel(json: any[]) {
    this.notFormatedCellArray = [];
    let reportType: any = '';
    const columns: any[] = [];
    const columValue: any[] = [];
    this.exportColumnDefinitions = [];
    this.exportColumnDefinitions = this.angularGrid.slickGrid.getColumns();
    for (const item of this.exportColumnDefinitions) {
      columns.push({
        key: item.id,
        width: this.checkWidth(item.id, item.name)
      });
      columValue.push(item.name);
    }
    this.sessionName = this.getSessionName(this.session.ses_id);
    reportType = new TitleCasePipe().transform('employee_salary_') + this.sessionName;
    let reportType2: any = '';
    reportType2 = new TitleCasePipe().transform('employee salary report: ') + this.sessionName;
    const fileName = reportType + '.xlsx';
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
      { pageSetup: { fitToWidth: 7 } });
    worksheet.mergeCells('A1:' + this.alphabetJSON[columns.length] + '1'); // Extend cell over all column headers
    worksheet.getCell('A1').value =
      new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
    worksheet.getCell('A1').alignment = { horizontal: 'left' };
    worksheet.mergeCells('A2:' + this.alphabetJSON[columns.length] + '2');
    worksheet.getCell('A2').value = reportType2;
    worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
    worksheet.getRow(4).values = columValue;
    worksheet.columns = columns;
    if (this.dataviewObj.getGroups().length === 0) {
      Object.keys(json).forEach(key => {
        const obj: any = {};
        for (const item2 of this.exportColumnDefinitions) {
          obj[item2.id] = this.checkReturn(this.commonAPIService.htmlToText(json[key][item2.id]));

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
    // worksheet.getRow(worksheet._rows.length).eachCell(cell => {
    //   this.columnDefinitions.forEach(element => {
    //     cell.font = {
    //       color: { argb: 'ffffff' },
    //       bold: true,
    //       name: 'Arial',
    //       size: 10
    //     };
    //     cell.alignment = { wrapText: true, horizontal: 'center' };
    //     cell.fill = {
    //       type: 'pattern',
    //       pattern: 'solid',
    //       fgColor: { argb: '439f47' },
    //       bgColor: { argb: '439f47' }
    //     };
    //     cell.border = {
    //       top: { style: 'thin' },
    //       left: { style: 'thin' },
    //       bottom: { style: 'thin' },
    //       right: { style: 'thin' }
    //     };
    //   });
    // });
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
          cell.alignment = { horizontal: 'center' };
        });
      } else if (rowNum > 4 && rowNum <= worksheet._rows.length) {
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
    // worksheet.getCell('A' + worksheet._rows.length).value = 'Report Filtered as:' + this.getParamValue();
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
  checkWidth(id, header) {
    const res = this.dataset.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
    const max2 = header.toString().length;
    const max = Math.max.apply(null, res);
    return max2 > max ? max2 : max;
  }
  checkReturn(data) {
    if (Number(data)) {
      return Number(data);
    } else {
      return data;
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
        worksheet.getCell('A' + worksheet._rows.length).value = this.commonAPIService.htmlToText(groupItem.title);
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
          obj3['id'] = '';
          obj3['srno'] = '';
          obj3['full_name'] = '';
          obj3['pan_no'] = '';
          obj3['aadhar_no'] = '';
          obj3['esi_ac_no'] = '';
          obj3['pf_acc_no'] = '';
          obj3['doj'] = '';
          obj3['pf_joining_date'] = '';
          obj3['esic_joining_date'] = '';
          obj3['probation_till_date'] = '';
          obj3['confirmation_date'] = '';
          obj3['nominee_detail'] = '';
          obj3['bnk_name'] = '';
          obj3['bnk_ifsc'] = '';
          obj3['bnk_acc_no'] = '';
          obj3['incremental_month'] = '';
          obj3['contact_period'] = '';
          obj3['category_1'] = '';
          obj3['category_2'] = '';
          obj3['supervisor'] = '';
          obj3['emp_pay_scale'] = '';
          obj3['net_salary'] = '';
          obj3['total_salary'] = '';

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
              obj[item2.id] = this.checkReturn(this.commonAPIService.htmlToText(groupItem.rows[key][item2.id]));

            }
            worksheet.addRow(obj);
          });
          const obj3: any = {};
          obj3['id'] = '';
          obj3['srno'] = '';
          obj3['full_name'] = '';
          obj3['pan_no'] = '';
          obj3['aadhar_no'] = '';
          obj3['esi_ac_no'] = '';
          obj3['pf_acc_no'] = '';
          obj3['doj'] = '';
          obj3['pf_joining_date'] = '';
          obj3['esic_joining_date'] = '';
          obj3['probation_till_date'] = '';
          obj3['confirmation_date'] = '';
          obj3['nominee_detail'] = '';
          obj3['bnk_name'] = '';
          obj3['bnk_ifsc'] = '';
          obj3['bnk_acc_no'] = '';
          obj3['incremental_month'] = '';
          obj3['contact_period'] = '';
          obj3['category_1'] = '';
          obj3['category_2'] = '';
          obj3['supervisor'] = '';
          obj3['emp_pay_scale'] = '';
          obj3['net_salary'] = '';
          obj3['total_salary'] = '';

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
    reportType = new TitleCasePipe().transform('Employee Salary Report: ') + this.sessionName;
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
          arr.push(this.commonAPIService.htmlToText(this.dataset[key][item2.id]));
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

        // // grand total
        // if (data.row.index === rows.length - 1) {
        //   doc.setFontStyle('bold');
        //   doc.setFontSize('18');
        //   doc.setTextColor('#ffffff');
        //   doc.setFillColor(67, 160, 71);
        // }
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
    doc.save(reportType + '_' + new Date() + '.pdf');
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

          obj3['id'] = '';
          obj3['srno'] = '';
          obj3['full_name'] = '';
          obj3['pan_no'] = '';
          obj3['aadhar_no'] = '';
          obj3['esi_ac_no'] = '';
          obj3['pf_acc_no'] = '';
          obj3['doj'] = '';
          obj3['pf_joining_date'] = '';
          obj3['esic_joining_date'] = '';
          obj3['probation_till_date'] = '';
          obj3['confirmation_date'] = '';
          obj3['nominee_detail'] = '';
          obj3['bnk_name'] = '';
          obj3['bnk_ifsc'] = '';
          obj3['bnk_acc_no'] = '';
          obj3['incremental_month'] = '';
          obj3['contact_period'] = '';
          obj3['category_1'] = '';
          obj3['category_2'] = '';
          obj3['supervisor'] = '';
          obj3['emp_pay_scale'] = '';
          obj3['net_salary'] = '';
          obj3['total_salary'] = '';
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
              arr.push(this.commonAPIService.htmlToText(groupItem.rows[key][item2.id]));

            }
            rowData.push(arr);
            this.pdfrowdata.push(arr);
          });
          const levelArray: any[] = [];
          const obj3: any = {};
          obj3['id'] = '';
          obj3['srno'] = '';
          obj3['full_name'] = '';
          obj3['pan_no'] = '';
          obj3['aadhar_no'] = '';
          obj3['esi_ac_no'] = '';
          obj3['pf_acc_no'] = '';
          obj3['doj'] = '';
          obj3['pf_joining_date'] = '';
          obj3['esic_joining_date'] = '';
          obj3['probation_till_date'] = '';
          obj3['confirmation_date'] = '';
          obj3['nominee_detail'] = '';
          obj3['bnk_name'] = '';
          obj3['bnk_ifsc'] = '';
          obj3['bnk_acc_no'] = '';
          obj3['incremental_month'] = '';
          obj3['contact_period'] = '';
          obj3['category_1'] = '';
          obj3['category_2'] = '';
          obj3['supervisor'] = '';
          obj3['emp_pay_scale'] = '';
          obj3['net_salary'] = '';
          obj3['total_salary'] = '';
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
  openSearchDialog = (data) => { this.searchModal.openModal(data); }
  searchOk($event) {
    this.getSalaryReport($event);
  }
}
