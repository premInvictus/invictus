import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService, FeeService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import {
  GridOption, Column, AngularGridInstance, Grouping, Aggregators,
  FieldType,
  Filters,
  Formatters,
  DelimiterType,
  FileType
} from 'angular-slickgrid';
declare var slickgroup: any;
//const slickgroup =  require('slickgrid-colgroup-plugin');
//declare const slickgroup: any;
//import * as slickgroup from 'slickgrid-colgroup-plugin'

//import * as slickgroup from './../../../../../../node_modules/slickgrid-colgroup-plugin/src/slick.colgroup.js';
import { DatePipe, TitleCasePipe } from '@angular/common';
const jsPDF = require('jspdf');
import 'jspdf-autotable'
import * as Excel from 'exceljs/dist/exceljs'
import { saveAs } from 'file-saver'

@Component({
  selector: 'app-student-attendence',
  templateUrl: './student-attendence.component.html',
  styleUrls: ['./student-attendence.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StudentAttendenceComponent implements OnInit {
  reportData = new DatePipe('en-in').transform(new Date(), 'd-MMM-y')
  paramform: FormGroup
  classArray: any[] = [];
  subjectArray: any[] = [];
  subSubjectArray: any[] = [];
  sectionArray: any[] = [];
  studentArray: any[] = [];
  monthArray: any[] = [];

  columnDefinitions: any[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  angularGrid: AngularGridInstance;
  dataviewObj: any;
  gridObj: any;
  gridHeight: any;
  tableFlag = false;
  totalRow: any;
  report_type = "";
  reportArray: any[] = [
    {
      id: 0,
      attendance_report_type: 'Summarised Report'
    },
    {
      id: 1,
      attendance_report_type: 'Detailed Report'
    }
  ]
  pdfrowdata: any[] = []
  levelHeading: any[] = []
  levelTotalFooter: any[] = []
  levelSubtotalFooter: any[] = []
  currentSession: any;
  schoolInfo: any;
  currentUser: any;
  notFormatedCellArray: any[];
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
    26: 'Z'
  };

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getSession();
    this.buildForm();
    this.getSchool();
    this.getClass();
    this.getFeeMonths();
    this.gridOptions = {
      enableDraggableGrouping: false,
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
      // colspanCallback: this.renderDifferentColspan,
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
        }
        ],
        onCommand: (e, args) => {
          if (args.command === 'exportAsPDF') {
            // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
            this.exportAsPDF(this.dataset);
          }
          if (args.command === 'exportAsExcel') {
            // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
            this.exportToExcel(this.dataset);
          }
          if (args.command === 'export-csv') {
            //this.exportToFile('csv');
          }
        },
        onColumnsChanged: (e, args) => {
          console.log('Column selection changed from Grid Menu, visible columns: ', args.columns);
          this.updateTotalRow(this.angularGrid.slickGrid);
        },
      }
    };
    // console.log(slickgroup);
    if (new slickgroup.ColGroup()) {
      // console.log(new slickgroup.ColGroup());
      this.gridOptions['registerPlugins'] = [new slickgroup.ColGroup()];
    }
  }
  constructor(
    private fbuild: FormBuilder,
    private examService: ExamService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    public dialog: MatDialog,
    public feeService: FeeService
  ) { }
  buildForm() {
    this.paramform = this.fbuild.group({
      class_id: '',
      sec_id: '',
      fm_id: '',
      date_id: '',
    })
  }
  resetData() {
    this.paramform.patchValue({
      class_id: '',
      sec_id: '',
      fm_id: '',
      date_id: '',
    })
    this.dataset = []
  }
  toggleReport(item) {
    this.resetData()
    if (item.value == 0) {
      this.report_type = "summarised_report"
    } else if (item.value == 1) {
      this.report_type = "detailed_report"
    }
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
  getSchool() {
    this.sisService.getSchool().subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.schoolInfo = res.data[0];
      }
    });
  }
  getClass() {
    this.classArray = [];
    this.smartService.getClassData({ class_status: '1' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.classArray = result.data;
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getSectionsByClass() {
    this.paramform.patchValue({
      sec_id: ''
    });
    this.sectionArray = [];
    this.smartService.getSectionsByClass({ class_id: this.paramform.value.class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.sectionArray = result.data;
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getRollNoUser() {
    if (this.paramform.value.class_id && this.paramform.value.sec_id) {
      this.studentArray = [];
      this.examService.getRollNoUser({ au_class_id: this.paramform.value.class_id, au_sec_id: this.paramform.value.sec_id }).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          this.studentArray = result.data;
        } else {
          this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
        }
      });
    }
  }
  getSession() {
    this.sisService.getSession().subscribe((result: any) => {
      if (result.status === 'ok') {
        const sessionArray = result.data
        const ses_id = JSON.parse(localStorage.getItem('session')).ses_id
        sessionArray.forEach(ele => {
          if (ele.ses_id === ses_id) {
            this.currentSession = ele
          }
        });
      }
    })
  }
  submit() {
    if (this.report_type == 'summarised_report') {
      this.resetDataset();
      const date = new DatePipe('en-in').transform(this.paramform.value.date_id, 'yyyy-MM-dd')
      this.examService.getAttendanceReportClassSectionWise(date).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          // console.log('>>> Result ', result.data)
          this.prepareDataSource(result.data);
        }
      })
    } else if (this.report_type == 'detailed_report') {
      this.resetDataset();
      this.examService.getStudentAttendence(this.paramform.value).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          // console.log(result.data);
          this.prepareDataSource(result.data);
        }
      })
    }
  }
  resetDataset() {
    this.dataset = [];
    this.columnDefinitions = [];
    this.tableFlag = false;
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    const grid = angularGrid.slickGrid; // grid object
    this.dataviewObj = angularGrid.dataView;
    // console.log('dataviewObj', this.dataviewObj);
    this.updateTotalRow(angularGrid.slickGrid);
  }
  getReportHeader() {
    let reportHeader
    if (this.report_type == 'summarised_report') {
      reportHeader = 'Summaried Report'
    } else if (this.report_type == 'detailed_report') {
      reportHeader = 'Detailed Report'
    }
    return 'Student Attendance ' + reportHeader
  }
  checkWidth(id, header) {
    const res = this.dataset.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
    const max2 = header.toString().length;
    const max = Math.max.apply(null, res);
    return max2 > max ? max2 : max;
  }
  getNumberWithZero(value: string) {
    if (value === '0') {
      return 0;
    } else {
      return Number(value) ? Number(value) : value;
    }
  }
  getLevelFooter(level) {
    if (level === 0) {
      return 'Total';
    } else if (level > 0) {
      return 'Sub Total (level ' + level + ')';
    }
  }
  checkGroupLevel(item, worksheet) {
    if (item.length > 0) {
      for (const groupItem of item) {
        worksheet.addRow({});
        this.notFormatedCellArray.push(worksheet._rows.length);
        // style for groupeditem level heading
        worksheet.mergeCells('A' + (worksheet._rows.length) + ':' +
          this.alphabetJSON[this.columnDefinitions.length] + (worksheet._rows.length));
        worksheet.getCell('A' + worksheet._rows.length).value = groupItem.value + ' (' + groupItem.rows.length + ')';
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
          const blankTempObj = {};
          for (const item2 of this.columnDefinitions) {
            if (item2.id === 'class_name') {
              blankTempObj[item2.id] = this.getLevelFooter(groupItem.level);
            } else if (item2.id === 'student_strength') {
              blankTempObj[item2.id] = groupItem.rows.length;
            } else if (item2.id === 'admission_no') {
              blankTempObj[item2.id] = groupItem.rows.length;
            } else {
              blankTempObj[item2.id] = '';
            }
          }
          worksheet.addRow(blankTempObj);
          this.notFormatedCellArray.push(worksheet._rows.length);
          // style row having total
          if (groupItem.level === 0) {
            worksheet.getRow(worksheet._rows.length).eachCell(cell => {
              this.columnDefinitions.forEach(element => {
                cell.font = {
                  name: 'Arial',
                  size: 10,
                  bold: true
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
              this.columnDefinitions.forEach(element => {
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
            for (const item2 of this.columnDefinitions) {
              obj[item2.id] = groupItem.rows[key][item2.id];
            }
            worksheet.addRow(obj);
          });
          const blankTempObj = {};
          for (const item2 of this.columnDefinitions) {
            if (item2.id === 'class_name') {
              blankTempObj[item2.id] = this.getLevelFooter(groupItem.level);
            } else if (item2.id === 'student_strength') {
              blankTempObj[item2.id] = groupItem.rows.length;
            } else if (item2.id === 'admission_no') {
              blankTempObj[item2.id] = groupItem.rows.length;
            } else {
              blankTempObj[item2.id] = '';
            }
          }
          worksheet.addRow(blankTempObj);
          this.notFormatedCellArray.push(worksheet._rows.length);
          // style row having total
          if (groupItem.level === 0) {
            worksheet.getRow(worksheet._rows.length).eachCell(cell => {
              this.columnDefinitions.forEach(element => {
                cell.font = {
                  name: 'Arial',
                  size: 10,
                  bold: true
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
              this.columnDefinitions.forEach(element => {
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

  // Export As PDF
  exportAsPDF(json: any[]) {
    const headerData: any[] = []
    this.pdfrowdata = []
    this.levelHeading = []
    this.levelTotalFooter = []
    this.levelSubtotalFooter = []
    const reportType = this.getReportHeader() + ' : ' + this.currentSession.ses_name
    const doc = new jsPDF('p', 'mm', 'a0')
    doc.autoTable({
      head: [[
        new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state
      ]],
      didDrawPage: function (data) { },
      headStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'left',
        fontSize: 22,
      },
      useCss: true,
      theme: 'striped'
    })
    doc.autoTable({
      head: [[reportType]],
      margin: { top: 0 },
      didDrawPage: function (data) { },
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
    const rowData: any[] = []
    for (const item of this.columnDefinitions) {
      headerData.push(item.name)
    }
    if (this.dataviewObj.getGroups().length === 0) {
      json.forEach(ele => {
        const arr: any[] = [];
        this.columnDefinitions.forEach(col => {
          arr.push(ele[col.id])
        })
        rowData.push(arr);
        this.pdfrowdata.push(arr)
      })
    } else {
      // this.checkGroupLevelPDF(this.dataviewObj.getGroups(), doc, headerData);
    }
    if (this.totalRow) {
      const arr: any[] = [];
      for (const item of this.columnDefinitions) {
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
    // if (this.groupColumns.length > 0) {
    //   doc.autoTable({
    //     // tslint:disable-next-line:max-line-length
    //     head: [['Groupded As:  ' + this.getGroupColumns(this.groupColumns)]],
    //     didDrawPage: function (data) {

    //     },
    //     headStyles: {
    //       fontStyle: 'bold',
    //       fillColor: '#ffffff',
    //       textColor: 'black',
    //       halign: 'left',
    //       fontSize: 20,
    //     },
    //     useCss: true,
    //     theme: 'striped'
    //   });
    // }

    // doc.autoTable({
    //   // tslint:disable-next-line:max-line-length
    //   head: [['Report Filtered as:  ' + this.reportData]],
    //   didDrawPage: function (data) {

    //   },
    //   headStyles: {
    //     fontStyle: 'bold',
    //     fillColor: '#ffffff',
    //     textColor: 'black',
    //     halign: 'left',
    //     fontSize: 20,
    //   },
    //   useCss: true,
    //   theme: 'striped'
    // });
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
    doc.save(reportType + '_' + this.reportData + '.pdf');
  }
  // Export As Excel
  exportToExcel(json: any[]) {
    this.notFormatedCellArray = [];
    const reportType = this.getReportHeader() + ' : ' + this.currentSession.ses_name;
    const columns: any[] = [];
    const columnValue: any[] = [];
    for (const item of this.columnDefinitions) {
      columns.push({
        key: item.id,
        width: this.checkWidth(item.id, item.name)
      })
      columnValue.push(item.name)
    }
    const fileName = reportType + ' - ' + this.reportData + '.xlsx';
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } }, { pageSetup: { fitToWidth: 7 } });
    worksheet.mergeCells('A1:' + this.alphabetJSON[columns.length] + '1');
    worksheet.getCell('A1').value = new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city +
      ', ' + this.schoolInfo.school_state;
    worksheet.getCell('A1').alignment = { horizontal: 'left' };

    worksheet.mergeCells('A2:' + this.alphabetJSON[columns.length] + '2');
    worksheet.getCell('A2').value = reportType;
    worksheet.getCell('A2').alignment = { horizontal: 'left' };

    worksheet.getRow(4).values = columnValue;

    worksheet.columns = columns;
    // console.log('this.dataviewObj.getGroups()', this.dataviewObj.getGroups());
    if (this.dataviewObj.getGroups().length === 0) {
      json.forEach(element => {
        const excelobj: any = {};
        this.columnDefinitions.forEach(element1 => {
          excelobj[element1.id] = this.getNumberWithZero(element[element1.id]);
        });
        worksheet.addRow(excelobj);
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
          size: 16,
          bold: true
        };
      } else if (rowNum === 2) {
        row.font = {
          name: 'Arial',
          size: 14,
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
                fgColor: { argb: 'dedede' },
                bgColor: { argb: 'dedede' },
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
    // if (this.groupColumns.length > 0) {
    //   worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
    //     this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
    //   worksheet.getCell('A' + worksheet._rows.length).value = 'Groupded As: ' + this.getGroupColumns(this.groupColumns);
    //   worksheet.getCell('A' + worksheet._rows.length).font = {
    //     name: 'Arial',
    //     size: 10,
    //     bold: true
    //   };
    // }

    // worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
    //   this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
    // worksheet.getCell('A' + worksheet._rows.length).value = 'Report Filtered as: ' + this.getParamValue();
    // worksheet.getCell('A' + worksheet._rows.length).font = {
    //   name: 'Arial',
    //   size: 10,
    //   bold: true
    // };

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
    worksheet.getCell('A' + worksheet._rows.length).value = 'Generated By: ' + new TitleCasePipe().transform(this.currentUser.full_name);
    worksheet.getCell('A' + worksheet._rows.length).font = {
      name: 'Arial',
      size: 10,
      bold: true
    };

    workbook.xlsx.writeBuffer().then(data => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      saveAs(blob, fileName)
    })
  }

  // Export To File

  updateTotalRow(grid: any) {
    //console.log('this.groupColumns', this.groupColumns);
    let columnIdx = grid.getColumns().length;
    while (columnIdx--) {
      const columnId = grid.getColumns()[columnIdx].id;
      if (columnId) {
        const columnElement: HTMLElement = grid.getFooterRowColumn(columnId);
        columnElement.innerHTML = '<b>' + this.totalRow[columnId] + '<b>';
      }

    }
  }
  iconFormatter(row, cell, value, columnDef, dataContext) {
    if (value !== '-') {
      if (value === '1') {
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
  getStudentsTotalPresentAbsent(value: any) {
    let studentDetailsArray = []
    for (const item of value) {
      for (const item2 of item['sectionWiseDetails']) {
        let present = 0, absent = 0
        present += item2['present']
        absent += item2['absent']

        studentDetailsArray.push({
          class_name: item2['sec_name'] ? item['class_name'] + '-' + item2['sec_name'] : item['class_name'],
          present: present,
          absent: absent,
          total: present + absent
        })
      }
    }
    return studentDetailsArray
  }
  prepareDataSource(value) {
    if (this.report_type == 'summarised_report') {
      this.columnDefinitions = [
        {
          id: 'class_name', name: 'Class Name', field: 'class_name', sortable: true, filterable: true, resizable: true,
        },
        {
          id: 'present', name: 'Present', field: 'present', sortable: true, filterable: true, resizable: true,
        },
        {
          id: 'absent', name: 'Absent', field: 'absent', sortable: true, filterable: true, resizable: true,
        },
        {
          id: 'total', name: 'Total', field: 'total', sortable: true, filterable: true, resizable: true,
        }
      ]
      const classWiseAttendanceArray = this.getStudentsTotalPresentAbsent(value)
      for (let i = 0; i < classWiseAttendanceArray.length; i++) {
        const tempObj = {}
        tempObj['id'] = i
        tempObj['class_name'] = classWiseAttendanceArray[i]['class_name']
        tempObj['present'] = classWiseAttendanceArray[i]['present']
        tempObj['absent'] = classWiseAttendanceArray[i]['absent']
        tempObj['total'] = classWiseAttendanceArray[i]['total']
        this.dataset.push(tempObj)
      }
      const blankTempObj = {};
      let totalPresent = 0, totalAbsent = 0, totalStrength = 0
      classWiseAttendanceArray.forEach(ele => {
        totalPresent += ele['present']
        totalAbsent += ele['absent']
        totalStrength += ele['total']
      })
      blankTempObj['id'] = classWiseAttendanceArray.length;
      blankTempObj['class_name'] = 'Grand Total';
      blankTempObj['present'] = totalPresent;
      blankTempObj['absent'] = totalAbsent;
      blankTempObj['total'] = totalStrength;

      this.totalRow = blankTempObj;

      if (this.dataset.length > 20) {
        this.gridHeight = 750;
      } else if (this.dataset.length > 10) {
        this.gridHeight = 600;
      } else if (this.dataset.length > 5) {
        this.gridHeight = 400;
      } else {
        this.gridHeight = 300;
      }
      this.tableFlag = true;
    } else if (this.report_type == 'detailed_report') {
      this.columnDefinitions = [
        { id: 'au_admission_no', name: 'Admission no', field: 'au_admission_no', sortable: true, filterable: true, resizable: false, },
        { id: 'au_full_name', name: 'Name', field: 'au_full_name', sortable: true, filterable: true, resizable: false, columnGroup: 'info' },
      ];
      for (let index = 1; index <= value.no_of_days_in_month; index++) {
        this.columnDefinitions.push({
          id: index.toString(), name: index.toString(), field: index.toString(), sortable: true, filterable: true, resizable: false, formatter: this.iconFormatter, columnGroup: 'days'
        });
      }
      this.columnDefinitions.push(
        { id: 'present', name: 'Present', field: 'present', sortable: true, filterable: true, resizable: false, columnGroup: 'attendance' }
      );
      this.columnDefinitions.push(
        { id: 'absent', name: 'Absent', field: 'absent', sortable: true, filterable: true, resizable: false, columnGroup: 'attendance' }
      );

      this.columnDefinitions.push(
        { id: 'absent1', name: 'Absent1', field: 'attendance', sortable: true, filterable: true, resizable: false, columnGroup: 'attendance1' }
      );



      for (let i = 0; i < value.attendence.length; i++) {
        const tempObj = {};
        tempObj['id'] = i;
        tempObj['au_admission_no'] = value.attendence[i]['au_admission_no'];
        tempObj['au_full_name'] = value.attendence[i]['au_full_name'];
        tempObj['present'] = value.attendence[i]['present'];
        tempObj['absent'] = value.attendence[i]['absent'];
        for (let key in value.attendence[i]['attendence']) {
          tempObj[key] = value.attendence[i]['attendence'][key];
        }
        // console.log('>>>>  temoObj of Attendance', tempObj);

        this.dataset.push(tempObj);
      }
      const blankTempObj = {};
      blankTempObj['id'] = value.attendence.length;
      blankTempObj['au_admission_no'] = 'Grand Total';
      blankTempObj['au_full_name'] = '';
      blankTempObj['present'] = '';
      blankTempObj['absent'] = '';
      for (let index = 1; index <= value.no_of_days_in_month; index++) {
        let totalpresent = 0;
        for (let i = 0; i < value.attendence.length; i++) {
          if (value.attendence[i]['attendence'][index] === '1') {
            totalpresent++;
          }
        }
        blankTempObj[index.toString()] = totalpresent;
      }
      this.totalRow = blankTempObj;
      // console.log('dataset  ', this.dataset);
      if (this.dataset.length > 20) {
        this.gridHeight = 750;
      } else if (this.dataset.length > 10) {
        this.gridHeight = 550;
      } else if (this.dataset.length > 5) {
        this.gridHeight = 400;
      } else {
        this.gridHeight = 300;
      }
      this.tableFlag = true;
    }
  }
  // renderDifferentColspan(item: any) {
  //   if (item.id % 2 === 1) {
  //     return {
  //       columns: {
  //         duration: {
  //           colspan: 3 // "duration" will span over 3 columns
  //         }
  //       }
  //     };
  //   } else {
  //     return {
  //       columns: {
  //         0: {
  //           colspan: '*' // starting at column index 0, we will span accross all column (*)
  //         }
  //       }
  //     };
  //   }
  // }

}
