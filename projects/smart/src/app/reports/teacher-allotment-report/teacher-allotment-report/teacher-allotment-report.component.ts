import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularGridInstance, Column, GridOption, Grouping, SortDirectionNumber, Sorters } from 'angular-slickgrid';
const jsPDF = require('jspdf');
import 'jspdf-autotable'
import * as Excel from 'exceljs/dist/exceljs'
import { saveAs } from 'file-saver'
import { SisService, CommonAPIService, AxiomService } from '../../../_services';
import { ErpCommonService } from '../../../../../../../src/app/_services/erp-common.service'


@Component({
  selector: 'app-teacher-allotment-report',
  templateUrl: './teacher-allotment-report.component.html',
  styleUrls: ['./teacher-allotment-report.component.css']
})
export class TeacherAllotmentReportComponent implements OnInit {
  reportdate = new DatePipe('en-in').transform(new Date(), 'd-MMM-y')
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  notFormatedCellArray: any[] = [];
  angularGrid: AngularGridInstance;
  dataviewObj: any;
  gridObj: any;
  gridHeight: any;
  pdfrowdata: any[] = []
  levelHeading: any[];
  levelTotalFooter: any[];
  currentSession: any;
  schoolInfo: any;
  aggregatearray: any[] = [];
  currentUser: any;
  levelSubtotalFooter: any;
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
  teacherId: any;
  groupColumns: any[] = [];
  subjectArray: any[];
  classArray: any[];
  teachersArray: any
  allTeacherDetails: any[];
  selectedGroupingFields: string[] = [];
  draggableGroupingPlugin: any;
  exportColumnDefinitions: any;
  totalRow: any;

  constructor(private common: CommonAPIService, private sis: SisService, private axiom: AxiomService, private erpService: ErpCommonService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.getSession()
    this.getSchool()
    this.gridOptions = {
      enableDraggableGrouping: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: false,
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
        },
        onColumnsChanged: (e, args) => {
          console.log('Column selection changed from Grid Menu, visible columns: ', args.columns);
          // this.updateTotalRow(this.angularGrid.slickGrid);
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

    this.columnDefinitions = [
      // { id: 'sr_no', name: 'Sr. No.', field: 'sr_no', sortable: true, filterable: true, resizable: false },
      {
        id: 't_id', name: 'Teacher Id', field: 't_id', sortable: true, filterable: true, resizable: true,
        grouping: {
          getter: 't_id',
          formatter: (g) => {
            return `${g.value}  <span style="color:green">(${g.count})</span>`;
          },
          comparer: (a, b) => {
            // (optional) comparer is helpful to sort the grouped data
            // code below will sort the grouped value in ascending order
            return Sorters.string(a.value, b.value, SortDirectionNumber.desc);
          },
          aggregators: this.aggregatearray,
          aggregateCollapsed: false,
          collapsed: false,
        }
      },
      { id: 't_name', name: 'Teacher Name', field: 't_name', sortable: true, filterable: true, resizable: true },
      {
        id: 't_class', name: 'Class', field: 't_class', sortable: true, filterable: true, resizable: true
      },
      { id: 't_subject', name: 'Subject', field: 't_subject', sortable: true, filterable: true, resizable: true }
    ]
    this.getAllTeacherDetails()
  }

  getSession() {
    this.sis.getSession().subscribe((result: any) => {
      if (result && result.status == 'ok') {
        const sessionArray = result.data
        const ses_id = JSON.parse(localStorage.getItem('session')).ses_id
        sessionArray.forEach(ele => {
          if (ele.ses_id === ses_id) {
            this.currentSession = ele
          }
        })
      } else {
        return this.common.showSuccessErrorMessage(result.message, 'error')
      }
    })
  }

  getSchool() {
    this.sis.getSchool().subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.schoolInfo = result.data[0];
      } else {
        return this.common.showSuccessErrorMessage(result.message, 'error')
      }
    })
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

  getAllTeacherDetails() {
    this.erpService.getGlobalTeacher({ "au_role_id": "3" }).subscribe((result: any) => {
      if (result && result.status == 'ok') {
        this.allTeacherDetails = result.data;

        this.prepareDataSource();
      }
    })
  }
  // groupByClass() {
  //   this.dataviewObj.setGrouping({
  //     getter: 't_class',
  //     formatter: (g) => {
  //       return `<b>${g.value}</b><span style="color:green"> (${g.count})</span>`;
  //     },
  //     comparer: (a, b) => {
  //       // (optional) comparer is helpful to sort the grouped data
  //       // code below will sort the grouped value in ascending order
  //       return Sorters.string(a.value, b.value, SortDirectionNumber.asc);
  //     },
  //     aggregators: this.aggregatearray,
  //     aggregateCollapsed: true,
  //     collapsed: false,
  //   });
  //   this.draggableGroupingPlugin.setDroppedGroups('t_class');
  // }
  groupById() {
    this.dataviewObj.setGrouping({
      getter: 't_id',
      formatter: (g) => {
        return `<b>${g.value}</b><span style="color:green"> (${g.count})</span>`;
      },
      comparer: (a, b) => {
        // (optional) comparer is helpful to sort the grouped data
        // code below will sort the grouped value in ascending order
        return Sorters.string(a.value, b.value, SortDirectionNumber.asc);
      },
      aggregators: this.aggregatearray,
      aggregateCollapsed: true,
      collapsed: false,
    });
    this.draggableGroupingPlugin.setDroppedGroups('t_id');
  }

  onGroupChanged(groups: Grouping[]) {
    if (Array.isArray(this.selectedGroupingFields) && Array.isArray(groups) && groups.length > 0) {
      // update all Group By select dropdown
      this.selectedGroupingFields.forEach((g, i) => {
        this.selectedGroupingFields[i] = groups[i] && groups[i].getter || '';
      });
    }
    console.log('dataviewObj', this.dataviewObj.getGroups());
  }

  prepareDataSource() {
    let count = 0;
    this.allTeacherDetails.forEach((ele) => {
      if (ele['cs_relations'].length > 0) {
        ele['cs_relations'].forEach((e, index) => {
          const obj = {};
          obj['id'] = count
          obj['sr_no'] = count
          obj['t_id'] = ele['au_login_id']
          obj['t_name'] = ele['au_full_name']
          obj['t_class'] = e['sec_name'] ? e['class_name'] + '-' + e['sec_name'] : ' - '
          obj['t_subject'] = e['sub_name']
          count++

          this.dataset.push(obj);
        });
      }

    })
    if (this.dataset.length > 20) {
      this.gridHeight = 800;
    } else if (this.dataset.length > 10) {
      this.gridHeight = 650;
    } else if (this.dataset.length > 5) {
      this.gridHeight = 500;
    } else {
      this.gridHeight = 400;
    }
    setTimeout(() => this.groupById(), 2);
  }
  getGroupColumns(columns) {
    let grName = '';
    for (const item of columns) {
      for (const titem of this.exportColumnDefinitions) {
        if (item.getter === titem.id) {
          grName = grName + titem.name + ',';
          break;
        }
      }
    }
    return grName.substring(0, grName.length - 1);
  }

  // Export as PDF new
  exportAsPDF(json: any[]) {
    const headerData: any[] = []
    this.pdfrowdata = []
    this.levelHeading = []
    this.levelTotalFooter = []
    this.levelSubtotalFooter = []
    const reportType = 'Teacher\'s Subject Allotment Report' + ' : ' + this.currentSession.ses_name;
    const doc = new jsPDF('l', 'mm', 'a0');
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
    this.exportColumnDefinitions = this.angularGrid.slickGrid.getColumns();
    for (const item of this.exportColumnDefinitions) {
      headerData.push(item.name);
    }
    if (this.dataviewObj.getGroups().length === 0) {
      json.forEach(element => {
        const arr: any[] = [];
        this.exportColumnDefinitions.forEach(element1 => {
          arr.push(element[element1.id]);
        });
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

        // grand total
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
    // doc.autoTable({
    //   // tslint:disable-next-line:max-line-length
    //   head: [['Report Filtered as:  ' + this.getParamValue()]],
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
          for (const item2 of this.exportColumnDefinitions) {
            if (item2.id === 'admission_no') {
              levelArray.push(this.getLevelFooter(groupItem.level));
            } else if (item2.id === 'full_name') {
              levelArray.push(groupItem.rows.length);
            } else {
              levelArray.push('');
            }
          }
          // style row having total
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
            const earr: any[] = [];
            for (const item2 of this.exportColumnDefinitions) {
              earr.push(groupItem.rows[key][item2.id]);
            }
            rowData.push(earr);
            this.pdfrowdata.push(earr);
          });
          // const levelArray: any[] = [];
          // for (const item2 of this.exportColumnDefinitions) {
          //   if (item2.id === 'admission_no') {
          //     levelArray.push(this.getLevelFooter(groupItem.level));
          //   } else if (item2.id === 'full_name') {
          //     levelArray.push(groupItem.rows.length);
          //   } else {
          //     levelArray.push('');
          //   }
          // }
          // style row having total
          // if (groupItem.level === 0) {
          //   this.pdfrowdata.push(levelArray);
          //   this.levelTotalFooter.push(this.pdfrowdata.length - 1);
          // } else if (groupItem.level > 0) {
          //   this.pdfrowdata.push(levelArray);
          //   this.levelSubtotalFooter.push(this.pdfrowdata.length - 1);
          // }
        }
      }
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
    console.log('checkGroupLevel item ', item);
    // console.log('checkGroupLevel worksheet ', worksheet);
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
          this.exportColumnDefinitions.forEach(element => {
            if (element.id === 'admission_no') {
              blankTempObj[element.id] = this.getLevelFooter(groupItem.level);
            } else if (element.id === 'full_name') {
              blankTempObj[element.id] = groupItem.rows.length;
            } else {
              blankTempObj[element.id] = '';
            }
          });
          worksheet.addRow(blankTempObj);
          this.notFormatedCellArray.push(worksheet._rows.length);
          // style row having total
          if (groupItem.level === 0) {
            worksheet.getRow(worksheet._rows.length).eachCell(cell => {
              this.exportColumnDefinitions.forEach(element => {
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
              obj[item2.id] = groupItem.rows[key][item2.id];
            }
            worksheet.addRow(obj);
          });
          const blankTempObj = {};
          this.exportColumnDefinitions.forEach(element => {
            if (element.id === 'admission_no') {
              blankTempObj[element.id] = this.getLevelFooter(groupItem.level);
            } else if (element.id === 'full_name') {
              blankTempObj[element.id] = groupItem.rows.length;
            } else {
              blankTempObj[element.id] = '';
            }
          });
          worksheet.addRow(blankTempObj);
          this.notFormatedCellArray.push(worksheet._rows.length);
          // style row having total
          if (groupItem.level === 0) {
            worksheet.getRow(worksheet._rows.length).eachCell(cell => {
              this.exportColumnDefinitions.forEach(element => {
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

  // Export as Excel new
  exportToExcel(json: any[]) {
    this.notFormatedCellArray = [];
    // console.log('excel json',);
    const reportType = 'Teacher\'s Subject Allotment Report' + ' : ' + this.currentSession.ses_name;
    const columns: any[] = [];
    const columValue: any[] = [];
    this.exportColumnDefinitions = this.angularGrid.slickGrid.getColumns();
    for (const item of this.exportColumnDefinitions) {
      columns.push({
        key: item.id,
        width: this.checkWidth(item.id, item.name)
      });
      columValue.push(item.name);
    }
    const fileName = reportType + '_' + this.reportdate + '.xlsx';
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } }, { pageSetup: { fitToWidth: 7 } });
    worksheet.mergeCells('A1:' + this.alphabetJSON[columns.length] + '1');
    worksheet.getCell('A1').value = new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city +
      ', ' + this.schoolInfo.school_state;
    worksheet.getCell('A1').alignment = { horizontal: 'left' };

    worksheet.mergeCells('A2:' + this.alphabetJSON[columns.length] + '2');
    worksheet.getCell('A2').value = reportType;
    worksheet.getCell('A2').alignment = { horizontal: 'left' };

    worksheet.getRow(4).values = columValue;

    worksheet.columns = columns;
    console.log('this.dataviewObj.getGroups()', this.dataviewObj.getGroups());
    if (this.dataviewObj.getGroups().length === 0) {
      json.forEach(element => {
        const excelobj: any = {};
        this.exportColumnDefinitions.forEach(element1 => {
          excelobj[element1.id] = this.getNumberWithZero(element[element1.id]);
        });
        worksheet.addRow(excelobj);
      });
    } else {
      // iterate all groups
      this.checkGroupLevel(this.dataviewObj.getGroups(), worksheet);
    }
    // if (this.totalRow) {
    //   worksheet.addRow(this.totalRow);
    // }
    // style grand total
    // worksheet.getRow(worksheet._rows.length).eachCell(cell => {
    //   this.exportColumnDefinitions.forEach(element => {
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
      }
      else if (rowNum > 4 && rowNum < worksheet._rows.length) {
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

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid
    const grid = angularGrid.slickGrid
    this.dataviewObj = angularGrid.dataView;
    // this.updateTotalRow(angularGrid.slickGrid)
  }
}

