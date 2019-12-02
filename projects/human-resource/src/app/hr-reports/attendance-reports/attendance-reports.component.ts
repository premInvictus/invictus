import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AxiomService, SmartService, SisService, CommonAPIService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';
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
  selector: 'app-attendance-reports',
  templateUrl: './attendance-reports.component.html',
  styleUrls: ['./attendance-reports.component.scss']
})
export class AttendanceReportsComponent implements OnInit {
  submitFlag = false;
  defaultFlag = false;
  finalDivFlag = true;
  entry_date = new Date();
  firstForm: FormGroup;
  attendanceReport: FormGroup;
  employeeArray: any[] = [];
  employeeAttendanceArray: any[] = [];
  attendanceArray: any[] = [];
  studentArray: any[] = [];
  departmentArray: any[] = [];
  currentUser: any;
  session: any;
  monthEntryAvailable = false;
  att_id: any;
  defaultsrc: any;
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
  totalRow: any;
  requiredAll = true;
  employeeCatDeptAvail = false;
  nodataFlag = false;
  dataArr: any[] = [];
  aggregatearray: any[] = [];
  groupColumns: any[] = [];
  groupLength: any;
  selectedGroupingFields: string[] = ['', '', ''];
  sessionArray: any[] = [];
  holidayArray: any[] = [];
  sessionName: any;
  constructor(
    public dialog: MatDialog,
    private fbuild: FormBuilder,
    private smartService: SmartService,
    public commonAPIService: CommonAPIService,
    public axiomService: AxiomService,
    public sisService: SisService,
    private erpCommonService: ErpCommonService,
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
  }

  ngOnInit() {
    this.buildForm();
    this.getAllEmployee();
  }

  buildForm() {
    this.attendanceReport = this.fbuild.group({
      month_id: ''
    });

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
  getAllEmployee() {
    this.commonAPIService.getAllEmployee({}).subscribe((result: any) => {
      if (result && result.length > 0) {
        this.employeeArray = result;
      }
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
  getSessionName(id) {
    const findex = this.sessionArray.findIndex(f => Number(f.ses_id) === Number(id));
    if (findex !== -1) {
      return this.sessionArray[findex].ses_name;
    }
  }
  getEmployeeAttendance() {
    var no_of_days = this.getDaysInMonth(this.attendanceReport.value.month_id, new Date().getFullYear());
    const inputJson: any = {};
    inputJson.datefrom = new Date().getFullYear() + '-' + this.attendanceReport.value.month_id + '-1';
    inputJson.dateto = new Date().getFullYear() + '-' + this.attendanceReport.value.month_id + '-' + no_of_days;
    this.smartService.getHolidayOnly(inputJson).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.holidayArray = res.data;
        const dateArray: any[] = [];
        var date;
        var dateFormate;
        for (let i = 0; i <= no_of_days; i++) {
          date = new Date().getFullYear() + '-' + this.attendanceReport.value.month_id + '-' + i;
          dateFormate = this.commonAPIService.dateConvertion(date, 'y-MM-dd');
          if (i !== 0) {
            const findex = this.holidayArray.indexOf(dateFormate);
            if (findex !== -1) {
              dateArray.push({
                date: date,
                attendance: 'h'
              });
            } else {
              dateArray.push({
                date: date,
                attendance: ''
              });
            }

          }
        }
        for (let item of this.employeeArray) {
          this.employeeAttendanceArray.push({
            emp_id: item.emp_id,
            emp_name: item.emp_name,
            attendance_array: dateArray
          });
        }
        const checkifMonthEntry: any = {
          "$and": [
            { "ses_id": this.session.ses_id },
            { "month_id": new Date(this.attendanceReport.value.month_id).getMonth() + 1 }
          ]
        };
        this.commonAPIService.checkAttendance(checkifMonthEntry).subscribe((res: any) => {
          if (res && res.status === 'ok') {
            this.monthEntryAvailable = true;
            this.attendanceArray = res.data;
            this.getAccessionReport('');
          } else {
            this.monthEntryAvailable = false;
          }
        });
      }
    });
  }
  getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  };


  getAttendance(emp_id, date) {
    let findex: any = '';
    findex = this.attendanceArray.findIndex(e => (e.entrydate) === (date));
    if (findex !== -1) {
      let findex2: any = '';
      findex2 = this.attendanceArray[findex].employeeList.findIndex(f => Number(f.emp_id) === Number(emp_id));
      if (findex2 !== -1) {
        return this.attendanceArray[findex].employeeList[findex2].attendance;
      } else {
        return '-';
      }
    }
    else {
      return '-';
    }
  }

  getAccessionReport(value: any) {
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

            //this.exportToExcel(this.dataset);
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
        maxWidth: 40,

      },
      {
        id: 'full_name', name: 'Full Name', field: 'full_name', sortable: true,
        filterable: true,
        filterSearchType: FieldType.string,
        width: 80
      }
    ];

    if (this.employeeAttendanceArray.length > 0) {
      repoArray = this.employeeAttendanceArray;
      console.log(repoArray);
      let index = 0;
      for (const item of repoArray) {
        if (index === 0) {
          for (const dety of item.attendance_array) {
            let date = this.commonAPIService.dateConvertion(dety.date, 'dd-MMM-y')
            let date_name = this.commonAPIService.dateConvertion(dety.date, 'dd');
            this.columnDefinitions.push({
              id: date, name: date_name, field: date, sortable: true,
              filterable: true,
              filterSearchType: FieldType.string,
              formatter: this.iconFormatter
            });
          }
        }
        const obj: any = {};
        obj['id'] = (index + 1);
        obj['srno'] = (index + 1);
        obj['full_name'] = item.emp_name ? new CapitalizePipe().transform(item.emp_name) : '-';
        for (const dety of item.attendance_array) {
          let date = this.commonAPIService.dateConvertion(dety.date, 'dd-MMM-y')
          if (dety.attendance !== 'h') {
            obj[date] = this.getAttendance(item.emp_id, dety.date);
          } else {
            console.log('sss',obj[date]);
            obj[date] = 'h';
          }
        }
        this.dataset.push(obj);
        index++;
      }
      this.tableFlag = true;
      this.nodataFlag = false;
    } else {
      this.nodataFlag = true;
      this.tableFlag = true;
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
  iconFormatter(row, cell, value, columnDef, dataContext) {
    if (value !== '-') {
      if (value === 1) {
        return "<i class='fas fa-check' style='color:green'></i>";
      } else if (value === 'h') {
        return "<i class='fas fa-holly-berry'></i>";
      } else {
        return "<i class='fas fa-times ' style='color:red'></i>";
      }
    } else {
      return "-";
    }

  }
  selectTrackByFn(index, item) {
    return index;
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


}
