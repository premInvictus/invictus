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
  selector: 'app-emp-details-report',
  templateUrl: './emp-details-report.component.html',
  styleUrls: ['./emp-details-report.component.scss']
})
export class EmpDetailsReportComponent implements OnInit {
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
  employeeData: any;
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
        id: 'designation', name: 'Designation', field: 'designation', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string,
        filter: { model: Filters.compoundInput },
        grouping: {
          getter: 'designation',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false
        },
      },
      {
        id: 'employee_type', name: 'Employee Type', field: 'employee_type', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string,
        filter: { model: Filters.compoundInput },
        grouping: {
          getter: 'employee_type',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false
        },
      },

      {
        id: 'department', name: 'Department', field: 'department', sortable: true,
        filterable: true,
        width: 80,
        filterSearchType: FieldType.string,
        filter: { model: Filters.compoundInput },
        grouping: {
          getter: 'department',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'wing', name: 'Wing', field: 'wing', sortable: true,
        filterable: true,
        width: 80,
        filterSearchType: FieldType.string,
        filter: { model: Filters.compoundInput },
        grouping: {
          getter: 'wing',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'pri_mobile', name: 'Primary Mobile No.', field: 'pri_mobile', sortable: true,
        filterable: true,
        width: 80,
        filterSearchType: FieldType.number,
        filter: { model: Filters.compoundInput },
        grouping: {
          getter: 'pri_mobile',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'sec_mobile', name: 'Secondary Mobile No.', field: 'sec_mobile', sortable: true,
        filterable: true,
        width: 80,
        filterSearchType: FieldType.number,
        filter: { model: Filters.compoundInput },
        grouping: {
          getter: 'sec_mobile',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'whatsup_no', name: 'Whatsapp No.', field: 'whatsup_no', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string,
        filter: { model: Filters.compoundInput },
        grouping: {
          getter: 'whatsup_no',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'email_id', name: 'Email Id', field: 'email_id', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'email_id',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        }
      },
      {
        id: 'address', name: 'Address', field: 'address', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'address',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'city', name: 'City, State and Pincode', field: 'city', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'city',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'res_address', name: 'Res. Address', field: 'res_address', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'res_address',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'res_city', name: 'City, State and Pincode', field: 'res_city', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'res_city',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'relationship', name: 'Contact Relationship', field: 'relationship', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'relationship',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'contact_name', name: 'Contact Name', field: 'contact_name', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'contact_name',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'occupation', name: 'Contact Occupation', field: 'occupation', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'occupation',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'education', name: 'Contact Education', field: 'education', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'education',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'contact_mobile', name: 'Contact Mobile', field: 'contact_mobile', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'contact_mobile',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'contact_email', name: 'Contact Email', field: 'contact_email', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'contact_email',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'contact_organisation', name: 'Contact Organisation', field: 'contact_organisation', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'contact_organisation',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'contact_designation', name: 'Contact Designation', field: 'contact_designation', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'contact_designation',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'contact_address', name: 'Contact Address', field: 'contact_address', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'contact_address',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'contact_city', name: 'Contact City', field: 'contact_city', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'contact_city',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      },
      {
        id: 'reference', name: 'Reference', field: 'reference', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
        grouping: {
          getter: 'reference',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: true,
          collapsed: false,
        },
      }

    ];

    this.commonAPIService.getAllEmployee({}).subscribe((result: any) => {
      if (result && result.length > 0) {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
        repoArray = result;
        let index = 0;
        for (const item of repoArray) {
          const obj: any = {};
          obj['id'] = (index + 1);
          obj['srno'] = (index + 1);
          obj['full_name'] = item.emp_name ? new CapitalizePipe().transform(item.emp_name) : '-';
          obj['designation'] = item.emp_designation_detail ? new CapitalizePipe().transform(item.emp_designation_detail.des_name) : '-';
          obj['employee_type'] = item.emp_category_detail ? new CapitalizePipe().transform(item.emp_category_detail.cat_name) : '-';
          obj['department'] = item.emp_department_detail ? new CapitalizePipe().transform(item.emp_department_detail.dpt_name) : '-';
          obj['wing'] = item.emp_wing_detail ? new CapitalizePipe().transform(item.emp_wing_detail.wing_name) : '-';
          obj['pri_mobile'] = item.emp_personal_detail.contact_detail ? item.emp_personal_detail.contact_detail.primary_mobile_no : '-';
          obj['sec_mobile'] = item.emp_personal_detail.contact_detail ? item.emp_personal_detail.contact_detail.secondary_mobile_no : '-';
          obj['whatsup_no'] = item.emp_personal_detail.contact_detail ? item.emp_personal_detail.contact_detail.whatsup_no : '-';
          obj['email_id'] = item.emp_personal_detail.contact_detail ? item.emp_personal_detail.contact_detail.email_id : '-';
          obj['address'] = item.emp_personal_detail.address_detail ? item.emp_personal_detail.address_detail.address : '-';
          obj['city'] = item.emp_personal_detail.address_detail && item.emp_personal_detail.address_detail.city &&
            item.emp_personal_detail.address_detail.state ? item.emp_personal_detail.address_detail.city.cit_name + ',' +
            item.emp_personal_detail.address_detail.state.sta_name + ' - ' + item.emp_personal_detail.address_detail.pin : '-';
          obj['res_address'] = item.emp_personal_detail.residential_address_detail ? item.emp_personal_detail.residential_address_detail.address : '-';
          obj['res_city'] = item.emp_personal_detail.residential_address_detail && item.emp_personal_detail.residential_address_detail.city &&
            item.emp_personal_detail.residential_address_detail.state ? item.emp_personal_detail.residential_address_detail.city.cit_name + ',' +
            item.emp_personal_detail.residential_address_detail.state.sta_name + ' - ' + item.emp_personal_detail.residential_address_detail.pin : '-';
          obj['relationship'] = item.emp_personal_contact && item.emp_personal_contact.relationship_personal_detail ?
            item.emp_personal_contact.relationship_personal_detail.rel_category.rel_name : '',
            obj['contact_name'] = item.emp_personal_contact && item.emp_personal_contact.relationship_personal_detail ?
              item.emp_personal_contact.relationship_personal_detail.rel_full_name : '',
            obj['occupation'] = item.emp_personal_contact && item.emp_personal_contact.relationship_personal_detail ?
              item.emp_personal_contact.relationship_personal_detail.rel_occupation : '',
            obj['education'] = item.emp_personal_contact && item.emp_personal_contact.relationship_personal_detail ?
              item.emp_personal_contact.relationship_personal_detail.rel_education : '',
            obj['contact_mobile'] = item.emp_personal_contact && item.emp_personal_contact.relationship_personal_detail &&
              item.emp_personal_contact.relationship_personal_detail.rel_contact_detail ?
              item.emp_personal_contact.relationship_personal_detail.rel_contact_detail.rel_mobile_no : '',
            obj['contact_email'] = item.emp_personal_contact && item.emp_personal_contact.relationship_personal_detail &&
              item.emp_personal_contact.relationship_personal_detail.rel_contact_detail ?
              item.emp_personal_contact.relationship_personal_detail.rel_contact_detail.rel_email : '',
            obj['contact_organisation'] = item.emp_personal_contact && item.emp_personal_contact.relationship_personal_detail ?
              item.emp_personal_contact.relationship_personal_detail.rel_organisation : '',
            obj['contact_designation'] = item.emp_personal_contact && item.emp_personal_contact.relationship_personal_detail ?
              item.emp_personal_contact.relationship_personal_detail.rel_designation : '',
            obj['contact_address'] = item.emp_personal_contact && item.emp_personal_contact.relationship_personal_detail.rel_address_detail ?
              item.emp_personal_contact.relationship_personal_detail.rel_address_detail.address : '',
            obj['contact_city'] = item.emp_personal_contact && item.emp_personal_contact.relationship_personal_detail.rel_address_detail ?
              item.emp_personal_contact.relationship_personal_detail.rel_address_detail.city + ',' + item.emp_personal_contact.relationship_personal_detail.rel_address_detail.state + ',' +
              item.emp_personal_contact.relationship_personal_detail.rel_address_detail.pin : '',
            obj['reference'] = item.emp_personal_contact && item.emp_personal_contact.relationship_personal_detail.rel_reference_detail ?
              item.emp_personal_contact.relationship_personal_detail.rel_reference_detail.ref_person_name : ''
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
