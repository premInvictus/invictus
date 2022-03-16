import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonAPIService, NotificationService } from '../../_services'
import { DatePipe, TitleCasePipe } from '@angular/common';

import {
  GridOption, Column, AngularGridInstance, Grouping, Aggregators,
  FieldType,
  Filters,
  Formatters,
  DelimiterType,
  FileType
} from 'angular-slickgrid';
const jsPDF = require('jspdf');
import 'jspdf-autotable'
import * as Excel from 'exceljs/dist/exceljs'
import { saveAs } from 'file-saver'



@Component({
  selector: 'app-access-rights-report',
  templateUrl: './access-rights-report.component.html',
  styleUrls: ['./access-rights-report.component.css']
})
export class AccessRightsReportComponent implements OnInit {
  reportData = new DatePipe('en-in').transform(new Date(), 'd-MMM-y')
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  notFormatedCellArray: any[] = [];
  angularGrid: AngularGridInstance;
  dataviewObj: any;
  gridObj: any;
  gridHeight: any;
  tableFlag = false;
  userList: any
  login_id: any
  tableData: any = []
  pdfrowdata: any[] = []
  levelHeading: any[];
  levelTotalFooter: any[];
  currentSession: any;
  schoolInfo: any;
  totalRow: any;
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

  constructor(private common: CommonAPIService, private notif: NotificationService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.getSession()
    this.getSchool()
    this.gridOptions = {
      enableDraggableGrouping: false,
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
      }
    };

    this.columnDefinitions = [
      { id: 'sr_no', name: 'Sr. No.', field: 'sr_no', sortable: true, filterable: true, resizable: false },
      { id: 'login_id', name: 'Login Id', field: 'login_id', sortable: true, filterable: true, resizable: true },
      { id: 'name', name: 'User Name', field: 'name', sortable: true, filterable: true, resizable: true },
      { id: 'project', name: 'Module Name', field: 'project', sortable: true, filterable: true, resizable: true },
      { id: 'menu', name: 'Menu', field: 'menu', sortable: true, filterable: true, resizable: true },
      { id: 'module', name: 'Module', field: 'module', sortable: true, filterable: true, resizable: true },
      { id: 'sub_rights', name: 'Sub-Rights', field: 'sub_rights', sortable: true, filterable: true, resizable: true }
    ]

    this.prepareDataSource()
  }

  getSession() {
    this.common.getSession().subscribe((result: any) => {
      if (result && result.status == 'ok') {
        const sessionArray = result.data
        const ses_id = JSON.parse(localStorage.getItem('session')).ses_id
        sessionArray.forEach(ele => {
          if (ele.ses_id === ses_id) {
            this.currentSession = ele
          }
        })
      } else {
        return this.notif.showSuccessErrorMessage(result.message, 'error')
      }
    })
  }

  getSchool() {
    this.common.getSchool().subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.schoolInfo = result.data[0];
      } else {
        return this.notif.showSuccessErrorMessage(result.message, 'error')
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

  /**
   * * Reference from Project - AXIOM 
   * * Project Name - AXIOM
   * * mod_level - 0 - Question Management   [Menu]
   * * mod_level - 1 - Question Bank         [Module]
   * * mod_level - 2 - Objective Unpublish   [Sub-Rights]
   */
  prepareDataSource() {
    this.common.getAllUserAccessMenu({}).subscribe((result: any) => {
      if (result && result.status == 'success') {
        const data = result.data

        for (let i = 0; i < data.length; i++) {
          const tempObj = {}
          tempObj['id'] = i + 1
          tempObj['sr_no'] = i + 1
          tempObj['login_id'] = data[i]['login_id'] ? data[i]['login_id'] : ' - '
          tempObj['name'] = data[i]['name'] ? data[i]['name'] : ' - '
          tempObj['project'] = data[i]['project'] ? data[i]['project'] : ' - '

          if (data[i]['mod_level']) {
            if (data[i]['mod_level'] == '0') {
              tempObj['menu'] = data[i]['module'] // 0  
            } else tempObj['menu'] = ' - '

            if (data[i]['mod_level'] == '1') {
              tempObj['module'] = data[i]['module'] // 1
            } else tempObj['module'] = ' - '

            if (data[i]['mod_level'] == '2') {
              tempObj['sub_rights'] = data[i]['module'] // 2
            } else tempObj['sub_rights'] = ' - '
          }
          this.dataset.push(tempObj)

          if (this.dataset.length > 20) {
            this.gridHeight = 800;
          } else if (this.dataset.length > 10) {
            this.gridHeight = 650;
          } else if (this.dataset.length > 5) {
            this.gridHeight = 500;
          } else {
            this.gridHeight = 400;
          }
        }

      } else {
        return this.notif.showSuccessErrorMessage(result.message, 'error')
      }
    })
  }

  // Export as PDF
  exportAsPDF(json: any[]) {
    const headerData: any[] = []
    this.pdfrowdata = []
    this.levelHeading = []
    this.levelTotalFooter = []
    const reportType = 'Access Rights Report' + ' : ' + this.currentSession.ses_name
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
    }
    // if (this.totalRow) {
    //   const arr: any[] = [];
    //   for (const item of this.columnDefinitions) {
    //     arr.push(this.totalRow[item.id]);
    //   }
    //   rowData.push(arr);
    //   this.pdfrowdata.push(arr);
    // }
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
        // const lsfIndex = doc.levelSubtotalFooter.findIndex(item => item === data.row.index);
        // if (lsfIndex !== -1) {
        //   doc.setFontStyle('bold');
        //   doc.setFontSize('18');
        //   doc.setTextColor('#ffffff');
        //   doc.setFillColor(229, 136, 67);
        // }

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
          doc.setTextColor('#5e666d');
          doc.setFillColor('#ffffff');
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
    const reportType = 'Access Rights Report' + ' : ' + this.currentSession.ses_name;
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
      // this.checkGroupLevel(this.dataviewObj.getGroups(), worksheet);
    }
    // if (this.totalRow) {
    //   worksheet.addRow(this.totalRow);
    // }
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
      } else if (rowNum > 4 && rowNum < worksheet._rows.length + 1) {
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


  // updateTotalRow(grid: any) {
  //   let columnIdx = grid.getColumns().length;
  //   while (columnIdx--) {
  //     const columnId = grid.getColumns()[columnIdx].id;
  //     const columnElement: HTMLElement = grid.getFooterRowColumn(columnId);
  //     columnElement.innerHTML = '<b>' + this.totalRow[columnId] + '<b>';
  //   }
  // }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid
    const grid = angularGrid.slickGrid
    this.dataviewObj = angularGrid.dataView;
    // this.updateTotalRow(angularGrid.slickGrid)
  }
}
