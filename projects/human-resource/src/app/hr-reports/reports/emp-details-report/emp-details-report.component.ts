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
  @ViewChild('searchModal') searchModal;
  sessionArray: any[] = [];
  documentArray: any[] = [];
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
  gridHeight: any;
  nodataFlag = false;
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
  documentsArray: any[] = [
    { docreq_id: 1, docreq_name: "Id & Address Proof", docreq_alias: "Id", docreq_is_required: "1", docreq_status: "1", verified_status: false },
    { docreq_id: 2, docreq_name: "Education", docreq_alias: "Education", docreq_is_required: "1", docreq_status: "1", verified_status: false },
    { docreq_id: 3, docreq_name: "Experience", docreq_alias: "Experience", docreq_is_required: "1", docreq_status: "1", verified_status: false },
    { docreq_id: 4, docreq_name: "Others", docreq_alias: "Others", docreq_is_required: "1", docreq_status: "1", verified_status: false }
  ];
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
    this.documentArray = [];
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
      //"withoutFilter": true
      accessionJSON = {}
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
        width: 80
      },
      {
        id: 'designation', name: 'Designation', field: 'designation', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string,
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
      },
      {
        id: 'sec_mobile', name: 'Secondary Mobile No.', field: 'sec_mobile', sortable: true,
        filterable: true,
        width: 80,
        filterSearchType: FieldType.number,
      },
      {
        id: 'whatsup_no', name: 'Whatsapp No.', field: 'whatsup_no', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number,
      },
      {
        id: 'email_id', name: 'Email Id', field: 'email_id', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string
      },
      {
        id: 'address', name: 'Address', field: 'address', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string,
      },
      {
        id: 'city', name: 'City, State and Pincode', field: 'city', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string
      },
      {
        id: 'res_address', name: 'Res. Address', field: 'res_address', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string
      },
      {
        id: 'res_city', name: 'City, State and Pincode', field: 'res_city', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string
      },
      {
        id: 'relationship', name: 'Contact Relationship', field: 'relationship', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string
      },
      {
        id: 'contact_name', name: 'Contact Name', field: 'contact_name', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number
      },
      {
        id: 'occupation', name: 'Contact Occupation', field: 'occupation', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string
      },
      {
        id: 'education', name: 'Contact Education', field: 'education', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string
      },
      {
        id: 'contact_mobile', name: 'Contact Mobile', field: 'contact_mobile', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.number
      },
      {
        id: 'contact_email', name: 'Contact Email', field: 'contact_email', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string
      },
      {
        id: 'contact_organisation', name: 'Contact Organisation', field: 'contact_organisation', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string
      },
      {
        id: 'contact_designation', name: 'Contact Designation', field: 'contact_designation', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string
      },
      {
        id: 'contact_address', name: 'Contact Address', field: 'contact_address', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string
      },
      {
        id: 'contact_city', name: 'Contact City', field: 'contact_city', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string
      },
      {
        id: 'reference', name: 'Reference', field: 'reference', sortable: true,
        filterable: true,
        width: 120,
        filterSearchType: FieldType.string
      }

    ];

    // this.commonAPIService.getAllEmployee({}).subscribe((result: any) => {
    this.commonAPIService.getFilterData(accessionJSON).subscribe((result: any) => {
      if (result && result.data.length > 0) {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
        repoArray = result.data;
        let index = 0;
        for (const item of repoArray) {
          if (index === 0) {
            for (const dety of this.documentsArray) {
              this.columnDefinitions.push({
                id: dety.docreq_alias, name: dety.docreq_name, field: dety.docreq_alias, sortable: true,
                filterable: true,
                filterSearchType: FieldType.string,
                formatter: this.iconFormatter
              });
            }
          }
          this.documentArray = item.emp_document_detail && item.emp_document_detail.document_data ? item.emp_document_detail.document_data : [];
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
          obj['city'] = item.emp_personal_detail.address_detail && item.emp_personal_detail.address_detail.city.cit_name &&
            item.emp_personal_detail.address_detail.state.sta_name ? item.emp_personal_detail.address_detail.city.cit_name + ',' +
            item.emp_personal_detail.address_detail.state.sta_name + ' - ' + item.emp_personal_detail.address_detail.pin : '-';
          obj['res_address'] = item.emp_personal_detail.residential_address_detail ? item.emp_personal_detail.residential_address_detail.address : '-';
          obj['res_city'] = item.emp_personal_detail.residential_address_detail && item.emp_personal_detail.residential_address_detail.city.cit_name &&
            item.emp_personal_detail.residential_address_detail.state.sta_name ? item.emp_personal_detail.residential_address_detail.city.cit_name + ',' +
            item.emp_personal_detail.residential_address_detail.state.sta_name + ' - ' + item.emp_personal_detail.residential_address_detail.pin : '-';
          obj['relationship'] = item.emp_personal_contact && item.emp_personal_contact.relationship_personal_detail ?
            item.emp_personal_contact.relationship_personal_detail.rel_category.rel_name : '-',
            obj['contact_name'] = item.emp_personal_contact && item.emp_personal_contact.relationship_personal_detail ?
              item.emp_personal_contact.relationship_personal_detail.rel_full_name : '-',
            obj['occupation'] = item.emp_personal_contact && item.emp_personal_contact.relationship_personal_detail ?
              item.emp_personal_contact.relationship_personal_detail.rel_occupation : '-',
            obj['education'] = item.emp_personal_contact && item.emp_personal_contact.relationship_personal_detail ?
              item.emp_personal_contact.relationship_personal_detail.rel_education : '-',
            obj['contact_mobile'] = item.emp_personal_contact && item.emp_personal_contact.relationship_personal_detail &&
              item.emp_personal_contact.relationship_personal_detail.rel_contact_detail ?
              item.emp_personal_contact.relationship_personal_detail.rel_contact_detail.rel_mobile_no : '-',
            obj['contact_email'] = item.emp_personal_contact && item.emp_personal_contact.relationship_personal_detail &&
              item.emp_personal_contact.relationship_personal_detail.rel_contact_detail ?
              item.emp_personal_contact.relationship_personal_detail.rel_contact_detail.rel_email : '-',
            obj['contact_organisation'] = item.emp_personal_contact && item.emp_personal_contact.relationship_personal_detail ?
              item.emp_personal_contact.relationship_personal_detail.rel_organisation : '-',
            obj['contact_designation'] = item.emp_personal_contact && item.emp_personal_contact.relationship_personal_detail ?
              item.emp_personal_contact.relationship_personal_detail.rel_designation : '-',
            obj['contact_address'] = item.emp_personal_contact && item.emp_personal_contact.relationship_personal_detail.rel_address_detail ?
              item.emp_personal_contact.relationship_personal_detail.rel_address_detail.address : '-',
            obj['contact_city'] = item.emp_personal_contact && item.emp_personal_contact.relationship_personal_detail.rel_address_detail
              && item.emp_personal_contact.relationship_personal_detail.rel_address_detail.city ?
              item.emp_personal_contact.relationship_personal_detail.rel_address_detail.city + ',' +
              item.emp_personal_contact.relationship_personal_detail.rel_address_detail.state + ',' +
              item.emp_personal_contact.relationship_personal_detail.rel_address_detail.pin : '-',
            obj['reference'] = item.emp_personal_contact && item.emp_personal_contact.relationship_personal_detail.rel_reference_detail ?
              item.emp_personal_contact.relationship_personal_detail.rel_reference_detail.ref_person_name : '-'
          for (const item of this.documentArray) {
            for (const detz of item.files_data) {
              obj[item.document_name] = detz.file_url;
            }
          }
          this.dataset.push(obj);
          index++;
        }
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
        this.nodataFlag = false;
      } else {
        this.nodataFlag = true;
        this.tableFlag = true;
      }
    });

  }
  iconFormatter(row, cell, value, columnDef, dataContext) {
    if (value) {
      return "<i class='fas fa-check' style='color:green'></i>";
    } else {
      return "<i class='fas fa-times' style='color:red'></i>";
    }
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
    const findex = this.sessionArray.findIndex(f => Number(f.ses_id) === Number(id));
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
    reportType = new TitleCasePipe().transform('Employee Details Report: ') + this.sessionName;
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
          obj3['designation'] = '';
          obj3['employee_type'] = '';
          obj3['department'] = '';
          obj3['wing'] = '';
          obj3['pri_mobile'] = '';
          obj3['sec_mobile'] = '';
          obj3['whatsup_no'] = '';
          obj3['email_id'] = '';
          obj3['address'] = '';
          obj3['city'] = '';
          obj3['res_address'] = '';
          obj3['res_city'] = '';
          obj3['relationship'] = '';
          obj3['contact_name'] = '';
          obj3['occupation'] = '';
          obj3['education'] = '';
          obj3['contact_mobile'] = '';
          obj3['contact_email'] = '';
          obj3['contact_organisation'] = '';
          obj3['contact_designation'] = '';
          obj3['contact_address'] = '';
          obj3['contact_city'] = '';
          obj3['reference'] = '';
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
          obj3['designation'] = '';
          obj3['employee_type'] = '';
          obj3['department'] = '';
          obj3['wing'] = '';
          obj3['pri_mobile'] = '';
          obj3['sec_mobile'] = '';
          obj3['whatsup_no'] = '';
          obj3['email_id'] = '';
          obj3['address'] = '';
          obj3['city'] = '';
          obj3['res_address'] = '';
          obj3['res_city'] = '';
          obj3['relationship'] = '';
          obj3['contact_name'] = '';
          obj3['occupation'] = '';
          obj3['education'] = '';
          obj3['contact_mobile'] = '';
          obj3['contact_email'] = '';
          obj3['contact_organisation'] = '';
          obj3['contact_designation'] = '';
          obj3['contact_address'] = '';
          obj3['contact_city'] = '';
          obj3['reference'] = '';
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
    reportType = new TitleCasePipe().transform('employee_details_') + this.sessionName;
    let reportType2: any = '';
    reportType2 = new TitleCasePipe().transform('employee details report: ') + this.sessionName;
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
          obj3['designation'] = '';
          obj3['employee_type'] = '';
          obj3['department'] = '';
          obj3['wing'] = '';
          obj3['pri_mobile'] = '';
          obj3['sec_mobile'] = '';
          obj3['whatsup_no'] = '';
          obj3['email_id'] = '';
          obj3['address'] = '';
          obj3['city'] = '';
          obj3['res_address'] = '';
          obj3['res_city'] = '';
          obj3['relationship'] = '';
          obj3['contact_name'] = '';
          obj3['occupation'] = '';
          obj3['education'] = '';
          obj3['contact_mobile'] = '';
          obj3['contact_email'] = '';
          obj3['contact_organisation'] = '';
          obj3['contact_designation'] = '';
          obj3['contact_address'] = '';
          obj3['contact_city'] = '';
          obj3['reference'] = '';

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
              if ((item2.id === 'cheque_date' || item2.id === 'deposite_date'
                || item2.id === 'dishonor_date') && groupItem.rows[key][item2.id] !== '-') {
                obj[item2.id] = new DatePipe('en-in').transform((groupItem.rows[key][item2.id]));
              } else {
                obj[item2.id] = this.checkReturn(this.commonAPIService.htmlToText(groupItem.rows[key][item2.id]));
              }

            }
            worksheet.addRow(obj);
          });
          const obj3: any = {};
          obj3['id'] = '';
          obj3['srno'] = '';
          obj3['full_name'] = '';
          obj3['designation'] = '';
          obj3['employee_type'] = '';
          obj3['department'] = '';
          obj3['wing'] = '';
          obj3['pri_mobile'] = '';
          obj3['sec_mobile'] = '';
          obj3['whatsup_no'] = '';
          obj3['email_id'] = '';
          obj3['address'] = '';
          obj3['city'] = '';
          obj3['res_address'] = '';
          obj3['res_city'] = '';
          obj3['relationship'] = '';
          obj3['contact_name'] = '';
          obj3['occupation'] = '';
          obj3['education'] = '';
          obj3['contact_mobile'] = '';
          obj3['contact_email'] = '';
          obj3['contact_organisation'] = '';
          obj3['contact_designation'] = '';
          obj3['contact_address'] = '';
          obj3['contact_city'] = '';
          obj3['reference'] = '';

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
  openSearchDialog = (data) => { this.searchModal.openModal(data); }
  searchOk($event) {
    this.getAccessionReport($event);
  }
}
