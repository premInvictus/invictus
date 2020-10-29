import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AxiomService, SmartService, SisService, CommonAPIService, FeeService } from '../../_services';
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
  reportdate = new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
  @ViewChild('searchModal') searchModal;
  pdfrowdata: any[] = [];
  levelHeading: any[] = [];
  levelTotalFooter: any[] = [];
  levelSubtotalFooter: any[] = [];
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
  gridHeight: any;
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
  nodataFlag = true;
  dataArr: any[] = [];
  groupColumns: any[] = [];
  groupLength: any;
  selectedGroupingFields: string[] = ['', '', ''];
  sessionArray: any[] = [];
  holidayArray: any[] = [];
  sessionName: any;
  schoolInfo: any;
  monthArray: any[] = [];
  notFormatedCellArray: any[] = [];
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
  constructor(
    public dialog: MatDialog,
    private fbuild: FormBuilder,
    private smartService: SmartService,
    public commonAPIService: CommonAPIService,
    public axiomService: AxiomService,
    public sisService: SisService,
    private erpCommonService: ErpCommonService,
    public feeService: FeeService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
  }

  ngOnInit() {
    this.buildForm();
    this.getSchool();
    this.getSession();
    this.getFeeMonths();
    this.getAllEmployee('');
  }

  buildForm() {
    this.attendanceReport = this.fbuild.group({
      month_id: ''
    });

  }
  getFeeMonths() {
    this.monthArray = [];
    this.feeService.getFeeMonths({}).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.monthArray = result.data;
      } else {
      }
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
  getAllEmployee(value) {
    this.employeeArray = [];
    if (value) {
      this.commonAPIService.getFilterData(value).subscribe((result: any) => {
        if (result && result.data.length > 0) {
          this.employeeArray = result.data;
          this.getEmployeeAttendance();
        }
      });
    } else {
      this.commonAPIService.getAllEmployee({}).subscribe((result: any) => {
        if (result && result.length > 0) {
          this.employeeArray = result;
          this.getEmployeeAttendance();
        }
      });
    }
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
  getSchool() {
    this.erpCommonService.getSchool()
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.schoolInfo = result.data[0];
          }
        });
  }
  getEmployeeAttendance() {
    this.attendanceArray = [];
    this.employeeAttendanceArray = [];
    this.dataset = [];
    this.columnDefinitions = [];
    this.holidayArray = [];
    var no_of_days = this.getDaysInMonth(this.attendanceReport.value.month_id, new Date().getFullYear());
    const inputJson: any = {};
    inputJson.datefrom = new Date().getFullYear() + '-' + this.attendanceReport.value.month_id + '-1';
    inputJson.dateto = new Date().getFullYear() + '-' + this.attendanceReport.value.month_id + '-' + no_of_days;
    this.smartService.getHolidayOnly(inputJson).subscribe((res: any) => {
      if (res) {
        this.holidayArray = res.data ? res.data : [];
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
        const checkifMonthEntry: any = [{
          $match : {
            "$and": [
              { "ses_id": this.session.ses_id },
              { "month_id": (new Date(this.attendanceReport.value.month_id).getMonth() + 1).toString() }
            ]
          },
          
      }];
        this.commonAPIService.checkAttendance(checkifMonthEntry).subscribe((res: any) => {
          if (res && res.status === 'ok') {
            this.attendanceArray = res.data;
            this.getAttendanceReport('');
          } else {
            this.attendanceArray = [];
            this.getAttendanceReport('');
          }
        });
      } else {
        this.nodataFlag = true;
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

  getAttendanceReport(value: any) {
    this.dataArr = [];
    this.totalRow = {};
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
          this.columnDefinitions.push({
            id: 'total', name: 'Total Present', field: 'total', sortable: true,
            filterable: true,
            filterSearchType: FieldType.string
          });
          this.columnDefinitions.push({
            id: 'total_absent', name: 'Total Absent', field: 'total_absent', sortable: true,
            filterable: true,
            filterSearchType: FieldType.string
          });
        }
        const obj: any = {};
        obj['id'] = (index + 1);
        obj['srno'] = (index + 1);
        obj['full_name'] = item.emp_name ? new CapitalizePipe().transform(item.emp_name) : '-';
        var dateFormate;
        for (const dety of item.attendance_array) {
          let date = this.commonAPIService.dateConvertion(dety.date, 'dd-MMM-y')
          if (dety.attendance === 'h') {
            obj[date] = 'h';
          } else {
            dateFormate = this.commonAPIService.dateConvertion(dety.date, 'y-MM-dd');
            obj[date] = this.getAttendance(item.emp_id, dateFormate);
          }
          obj['total'] = this.getSumByEmplyoeewise(item.emp_id);
          obj['total_absent'] = this.getAbsentSum(item.emp_id);
        }
        this.dataset.push(obj);
        index++;
      }
      this.totalRow = {};
      const obj3: any = {};
      obj3['id'] = 'footer';
      obj3['srno'] = '';
      obj3['full_name'] = 'Total Present';
      for (const item of repoArray) {
        for (const dety of item.attendance_array) {
          let date = this.commonAPIService.dateConvertion(dety.date, 'dd-MMM-y')
          if (dety.attendance === 'h') {
            obj3[date] = 0;
          } else {
            dateFormate = this.commonAPIService.dateConvertion(dety.date, 'y-MM-dd');
            obj3[date] = this.getSumByDatewise(dateFormate);
          }
        }
      }
      obj3['total'] = this.dataset.map(t => t['total']).reduce((acc, val) => Number(acc) + Number(val), 0);
      obj3['total_absent'] = this.dataset.map(t => t['total_absent']).reduce((acc, val) => Number(acc) + Number(val), 0);
      this.totalRow = obj3;
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
        return '<i class="fas fa-hospital-symbol" style="color:orange"></i>';
      } else {
        return "<i class='fas fa-times' style='color:red'></i>";
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
  getSumByDatewise(date) {
    let findex: any = '';
    let totalArray = [];
    var present = 0;
    var absent = 0;
    var total = 0;
    findex = this.attendanceArray.findIndex(e => (e.entrydate) === (date));
    if (findex !== -1) {
      for (let item of this.attendanceArray[findex].employeeList) {
        if (item.attendance === 1) {
          present++;
        } else if (item.attendance === 0) {
          absent++;
        }
        total++;
      }
      totalArray.push({
        'present': present,
        'absent': absent,
        'total': total,
      });
    }
    return present;
  }
  getSumByEmplyoeewise(emp_id) {
    let totalArray = [];
    var present = 0;
    var absent = 0;
    var total = 0;
    for (let item of this.attendanceArray) {
      for (let dety of item.employeeList) {
        if (dety.emp_id === emp_id) {
          if (dety.attendance === 1) {
            present++;
          } else if (dety.attendance === 0) {
            absent++;
          }
          total++;
        }
      }
    }
    totalArray.push({
      'present': present,
      'absent': absent,
      'total': total,
    });
    return present;
  }
  getAbsentSum(emp_id) {
    let totalArray = [];
    var present = 0;
    var absent = 0;
    var total = 0;
    for (let item of this.attendanceArray) {
      for (let dety of item.employeeList) {
        if (dety.emp_id === emp_id) {
          if (dety.attendance === 1) {
            present++;
          } else if (dety.attendance === 0) {
            absent++;
          }
          total++;
        }
      }
    }
    totalArray.push({
      'present': present,
      'absent': absent,
      'total': total,
    });
    return absent;
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
    reportType = new TitleCasePipe().transform('Employee Attendance Report: ') + this.sessionName;
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
    for (const item of this.exportColumnDefinitions) {
      columns.push({
        key: item.id,
        width: 10
      });
      columValue.push(item.name);
    }
    this.sessionName = this.getSessionName(this.session.ses_id);
    reportType = new TitleCasePipe().transform('employee_attendance_') + this.sessionName;
    let reportType2: any = '';
    reportType2 = new TitleCasePipe().transform('employee attendance report: ') + this.sessionName;
    const fileName =reportType + '_' + this.reportdate +'.xlsx';
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
    }
    if (this.totalRow) {
      worksheet.addRow(this.totalRow);
    }
    //style grand total
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
          cell.alignment = { horizontal: 'center' };
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
  openSearchDialog = (data) => { this.searchModal.openModal(data); }
  searchOk($event) {
    this.getAllEmployee($event);
  }
}
