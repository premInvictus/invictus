import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonAPIService, InventoryService } from '../../_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import * as Excel from 'exceljs/dist/exceljs';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { ErpCommonService } from 'src/app/_services';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.component.html',
  styleUrls: ['./inventory-details.component.css']
})
export class InventoryDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  itemData: any[] = [];
  itemData2: any[] = [];
  currentUser: any;
  userData: any = '';
  ITEM_LOGS: any[] = [];
  itempagesize = 10;
  LOGS_DATA: any[] = [];
  sessionArray: any = [];
  sessionName: any;
  totalRecords: any;
  pageIndex = 0;
  @ViewChild('searchModal') searchModal;
  pageEvent: PageEvent;
  pageSize = 10;
  itempagesizeoptions = [10, 25, 50, 100];
  session_id: any;
  @ViewChild(MatPaginator) paginator: MatPaginator
  datasource = new MatTableDataSource<any>(this.LOGS_DATA);
  searchForm: FormGroup;
  length: any;
  spans: any[] = [];
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
  schoolInfo: any;
  logdisplayedcolumns: any[] = ['sno', 'date', 'code', 'name', 'category', 'location', 'issued_qty', 'returned_qty'];
  constructor(private common: CommonAPIService, private fbuild: FormBuilder,
    private service: InventoryService,
    private router: Router,
    private route: ActivatedRoute,
    private erpCommonService: ErpCommonService) { }

  ngOnInit() {
    localStorage.removeItem('invoiceBulkRecords');
    localStorage.removeItem('item_code_details');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session_id = JSON.parse(localStorage.getItem('session'))['ses_id'];
    this.buildForm();
    if (Object.keys(this.common.getItemsData()).length > 0) {
      this.getLogs();
    } else {
      this.getLogs2();
    }
    this.getSchool();
    this.getSession();
  }
  ngOnDestroy() {
    localStorage.removeItem('invoiceBulkRecords');
  }
  getItems($event) {
    if ($event.target.value.length >= 3) {
      this.common.setData('or', $event.target.value);
      this.router.navigate(['../item-search'], { relativeTo: this.route });
    }
  }
  openSearchDialog = (data) => { this.searchForm.patchValue({ search: '' }); this.searchModal.openModal(data); };
  getSession() {
    this.erpCommonService.getSession()
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            for (const citem of result.data) {
              this.sessionArray[citem.ses_id] = citem.ses_name;
            }
            if (this.session_id) {
              this.sessionName = this.sessionArray[this.session_id];
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
  ngAfterViewInit() {
    this.datasource.paginator = this.paginator;
  }
  fetchData(event?: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getLogs();
    return event;
  }
  getLogs() {
    let logData: any = {};
    logData = this.common.getItemsData();
    localStorage.setItem('item_code_details', JSON.stringify(this.common.getItemsData()));
    this.itemData.push(this.common.getItemsData());
    this.service.getItemLogs({
      "item_code": logData.item_code,
      "pageIndex": this.pageIndex,
      "pageSize": this.pageSize
    }).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.itemData2.push(res.data[0]);
        let ind = 0;
        const total_qty2 = this.itemData2[0].item_location.reduce((total: number, val) => {
          return total += Number(val.item_qty);
        }, 0);
        for (const item of this.itemData2) {
          for (const titem of item.logs) {
            for (const titem2 of titem.user_inv_logs) {
              if (Number(item.item_code) === Number(titem2.item_code)) {
                let date: any = '-';
                if (titem2.status === 'issued') {
                  date = new DatePipe('en-in').transform(titem2.issued_on, 'd-MMM-y');
                } else if (titem2.status === 'returned') {
                  date = new DatePipe('en-in').transform(titem2.returned_on, 'd-MMM-y');
                }
                this.LOGS_DATA.push({
                  "sno": ind + 1,
                  "date": date,
                  "code": item.item_code,
                  "name": item.item_name,
                  "role_id": item.user_role_id,
                  "user_name": titem.user_full_name,
                  "locs": item.locs,
                  "category": item.item_category.name,
                  "nature": item.item_nature.name,
                  "location": this.getLocation(titem2.item_location.location_id, item.locs),
                  "location_id": titem2.location_id,
                  "issued_qty": titem2.item_status === 'issued' ? titem2.item_location.item_qty : '-',
                  "returned_qty": titem2.item_status === 'returned' ? titem2.item_location.item_qty : '-',
                  "available_qty": total_qty2,
                  "issued_on": titem2.issued_on ? new DatePipe('en-in').transform(titem2.issued_on, 'd-MMM-y') : '-',
                  "returned_on": titem2.returned_on ? new DatePipe('en-in').transform(titem2.returned_on, 'd-MMM-y') : '-',
                  "due_date": titem2.due_date ? new DatePipe('en-in').transform(titem2.due_date, 'd-MMM-y') : '-',
                });
                ind++;
                break;
              }
            }
          }
        }
        this.totalRecords = Number(res.totalRecords);
        localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
        this.datasource = new MatTableDataSource<any>(this.LOGS_DATA);
        this.datasource.paginator.length = this.paginator.length = this.totalRecords;
        this.datasource.paginator = this.paginator;
        console.log(this.LOGS_DATA);
      }
    });
    const total_qty = this.itemData[0].item_location.reduce((total: number, val) => {
      return total += Number(val.item_qty);
    }, 0);
    const DATA = this.itemData.reduce((current, next, index) => {
      next.item_location.forEach(element => {
        current.push({
          "sno": index + 1,
          "code": next.item_code,
          "name": next.item_name,
          "session": next.item_session,
          "item_location": next.item_location,
          "nature": next.item_nature.name,
          "category": next.item_category.name,
          "location": this.getLocation(element.location_id, next.locs),
          "qty": this.getQuantity(element.location_id, next.item_location),
          "reorder": next.item_reorder_level,
          "units": next.item_units.name,
          "desc": next.item_desc,
          "status": next.item_status,
          "total_qty": total_qty,
          "action": next
        });
      });
      return current;
    }, []);
    this.ITEM_LOGS = DATA;
    this.cacheSpan('sno', d => d.sno);
    this.cacheSpan('code', d => d.code);
    this.cacheSpan('name', d => d.name);
    this.cacheSpan('nature', d => d.nature);
    this.cacheSpan('category', d => d.category);
    this.cacheSpan('reorder', d => d.reorder);
    this.cacheSpan('desc', d => d.desc);
  }
  getLogs2() {
    let logData: any = {};
    logData = JSON.parse(localStorage.getItem('item_code_details'));
    this.itemData.push(JSON.parse(localStorage.getItem('item_code_details')));
    this.service.getItemLogs({
      "item_code": logData.item_code,
      "pageIndex": this.pageIndex,
      "pageSize": this.pageSize
    }).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.itemData2.push(res.data[0]);
        let ind = 0;
        const total_qty2 = this.itemData2[0].item_location.reduce((total: number, val) => {
          return total += Number(val.item_qty);
        }, 0);
        for (const item of this.itemData2) {
          for (const titem of item.logs) {
            for (const titem2 of titem.user_inv_logs) {
              if (Number(item.item_code) === Number(titem2.item_code)) {
                let date: any = '-';
                if (titem2.status === 'issued') {
                  date = new DatePipe('en-in').transform(titem2.issued_on, 'd-MMM-y');
                } else if (titem2.status === 'returned') {
                  date = new DatePipe('en-in').transform(titem2.returned_on, 'd-MMM-y');
                }
                this.LOGS_DATA.push({
                  "sno": ind + 1,
                  "date": date,
                  "code": item.item_code,
                  "name": item.item_name,
                  "role_id": item.user_role_id,
                  "user_name": titem.user_full_name,
                  "locs": item.locs,
                  "category": item.item_category.name,
                  "nature": item.item_nature.name,
                  "location": this.getLocation(titem2.item_location.location_id, item.locs),
                  "location_id": titem2.location_id,
                  "issued_qty": titem2.item_status === 'issued' ? titem2.item_location.item_qty : '-',
                  "returned_qty": titem2.item_status === 'returned' ? titem2.item_location.item_qty : '-',
                  "available_qty": total_qty2,
                  "issued_on": titem2.issued_on ? new DatePipe('en-in').transform(titem2.issued_on, 'd-MMM-y') : '-',
                  "returned_on": titem2.returned_on ? new DatePipe('en-in').transform(titem2.returned_on, 'd-MMM-y') : '-',
                  "due_date": titem2.due_date ? new DatePipe('en-in').transform(titem2.due_date, 'd-MMM-y') : '-',
                });
                ind++;
                break;
              }
            }
          }
        }
        this.totalRecords = Number(res.totalRecords);
        localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
        this.datasource = new MatTableDataSource<any>(this.LOGS_DATA);
        this.datasource.paginator.length = this.paginator.length = this.totalRecords;
        this.datasource.paginator = this.paginator;
      }
    });
    const total_qty = this.itemData[0].item_location.reduce((total: number, val) => {
      return total += Number(val.item_qty);
    }, 0);
    const DATA = this.itemData.reduce((current, next, index) => {
      next.item_location.forEach(element => {
        current.push({
          "sno": index + 1,
          "code": next.item_code,
          "name": next.item_name,
          "session": next.item_session,
          "item_location": next.item_location,
          "nature": next.item_nature.name,
          "category": next.item_category.name,
          "location": this.getLocation(element.location_id, next.locs),
          "qty": this.getQuantity(element.location_id, next.item_location),
          "reorder": next.item_reorder_level,
          "units": next.item_units.name,
          "desc": next.item_desc,
          "status": next.item_status,
          "total_qty": total_qty,
          "action": next
        });
      });
      return current;
    }, []);
    this.ITEM_LOGS = DATA;
    this.cacheSpan('sno', d => d.sno);
    this.cacheSpan('code', d => d.code);
    this.cacheSpan('name', d => d.name);
    this.cacheSpan('nature', d => d.nature);
    this.cacheSpan('category', d => d.category);
    this.cacheSpan('reorder', d => d.reorder);
    this.cacheSpan('desc', d => d.desc);
    console.log(this.ITEM_LOGS);
  }
  buildForm() {
    this.searchForm = this.fbuild.group({
      search: '',
    });
  }
  getLocation(id, array: any[]) {
    const findex = array.findIndex(f => Number(f.location_id) === Number(id));
    if (findex !== -1) {
      return array[findex].location_hierarchy;
    } else {
      return '-';
    }
  }
  getQuantity(id, array: any[]) {
    const findex = array.findIndex(f => Number(f.location_id) === Number(id));
    if (findex !== -1) {
      return array[findex].item_qty;
    }
  }
  cacheSpan(key, accessor) {
    for (let i = 0; i < this.ITEM_LOGS.length;) {
      let currentValue = accessor(this.ITEM_LOGS[i]);
      let count = 1;
      for (let j = i + 1; j < this.ITEM_LOGS.length; j++) {
        if (currentValue != accessor(this.ITEM_LOGS[j])) {
          break;
        }
        count++;
      }
      if (!this.spans[i]) {
        this.spans[i] = {};
      }
      this.spans[i][key] = count;
      i += count;
    }
  }
  getRole(role_id) {
    if (Number(role_id) === 2) {
      return 'Staff';
    } else if (Number(role_id) === 3) {
      return 'Teacher';
    } else {
      return 'Student';
    }
  }
  searchOk($event) {
    this.common.setData('and', $event);
    this.router.navigate(['../item-search'], { relativeTo: this.route });
  }
  search() {
    if (this.searchForm.value.search.length >= 3) {
      this.common.setData('or',this.searchForm.value);
      this.router.navigate(['../item-search'], { relativeTo: this.route });
    }
  }
  downloadExcel() {
    console.log(this.LOGS_DATA);
    let reportType: any = '';
    let reportType2: any = '';
    const columns: any = [];
    columns.push({
      key: 'date',
      width: this.checkWidth('date', 'Item Code')
    });
    columns.push({
      key: 'code',
      width: this.checkWidth('code', 'Item Name')
    });
    columns.push({
      key: 'name',
      width: this.checkWidth('name', 'Nature')
    });
    columns.push({
      key: 'role_id',
      width: this.checkWidth('role_id', 'Location')
    });
    columns.push({
      key: 'issued_qty',
      width: this.checkWidth('issued_qty', 'Issued Quantity')
    });
    columns.push({
      key: 'returned_qty',
      width: this.checkWidth('returned_qty', 'Returned Quantity')
    });
    columns.push({
      key: 'due_date',
      width: this.checkWidth('due_date', 'Due Date')
    });
    columns.push({
      key: 'available_qty',
      width: this.checkWidth('available_qty', 'Available Quantity')
    });


    reportType2 = new TitleCasePipe().transform(this.userData.au_full_name + ' itemlogreport_') + this.sessionName;
    reportType = new TitleCasePipe().transform(this.userData.au_full_name + ' Item Log report: ') + this.sessionName;
    const fileName = reportType + '.xlsx';
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
      { pageSetup: { fitToWidth: 7 } });
    worksheet.mergeCells('A1:' + this.alphabetJSON[8] + '1');
    worksheet.getCell('A1').value =
      new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
    worksheet.getCell('A1').alignment = { horizontal: 'left' };
    worksheet.mergeCells('A2:' + this.alphabetJSON[8] + '2');
    worksheet.getCell('A2').value = new TitleCasePipe().transform(' Item Log report: ') + this.sessionName;
    worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
    worksheet.mergeCells('A3:B3');
    worksheet.getCell('A3').value = 'Admission No : ' + this.userData.em_admission_no;
    worksheet.getCell(`A3`).alignment = { horizontal: 'left' };
    worksheet.mergeCells('C3:D3');
    worksheet.getCell('C3').value = 'Name : ' + this.userData.au_full_name;
    worksheet.getCell(`C3`).alignment = { horizontal: 'left' };
    worksheet.mergeCells('E3:F3');
    worksheet.getCell('E3').value = 'Class : ' + this.userData.class_name + '     ' + 'Section: ' + this.userData.sec_name;
    worksheet.getCell(`E3`).alignment = { horizontal: 'left' };
    worksheet.getCell('A5').value = 'Item Code';
    worksheet.getCell('B5').value = 'Item Name';
    worksheet.getCell('C5').value = 'Nature';
    worksheet.getCell('D5').value = 'Location';
    worksheet.getCell('E5').value = 'Issued Quantity';
    worksheet.getCell('F5').value = 'Issued On';
    worksheet.getCell('G5').value = 'Due Date';
    worksheet.getCell('H5').value = 'Returned On';
    worksheet.getCell('I5').value = 'Fine';



    worksheet.columns = columns;
    this.length = worksheet._rows.length;
    let totRow = this.length + this.LOGS_DATA.length + 5;

    worksheet.mergeCells('A' + totRow + ':' + 'B' + totRow);
    worksheet.getCell('A' + totRow + ':' + 'B' + totRow).value = 'Report Generated By : ' + this.currentUser.full_name;
    worksheet.getCell('A' + totRow + ':' + 'B' + totRow).alignment = { horizontal: 'left' };
    worksheet.mergeCells('A' + (totRow + 1) + ':' + 'B' + (totRow + 1));
    worksheet.getCell('A' + (totRow + 1) + ':' + 'B' + (totRow + 1)).value = 'No. of Records : ' + this.LOGS_DATA.length;
    worksheet.getCell('A' + (totRow + 1) + ':' + 'B' + (totRow + 1)).alignment = { horizontal: 'left' };
    for (const item of this.LOGS_DATA) {
      const prev = this.length + 1;
      const obj: any = {};

      this.length++;
      worksheet.getCell('A' + this.length).value = item.date;
      worksheet.getCell('B' + this.length).value = item.code;
      worksheet.getCell('C' + this.length).value = item.user_name;
      worksheet.getCell('D' + this.length).value = this.getRole(item.role_id);
      worksheet.getCell('D' + this.length).value = this.getLocation(item.location_id, item.locs);
      worksheet.getCell('E' + this.length).value = item.issued_qty;
      worksheet.getCell('F' + this.length).value = item.returned_qty;
      worksheet.getCell('G' + this.length).value = item.due_date ? item.due_date : '-';
      worksheet.getCell('H' + this.length).value = item.available_qty ? item.available_qty : '-';

      worksheet.addRow(obj);
    }


    worksheet.eachRow((row, rowNum) => {
      if (rowNum === 1) {
        row.font = {
          name: 'Arial',
          size: 16,
          bold: true
        };
      }
      if (rowNum === 2) {
        row.font = {
          name: 'Arial',
          size: 14,
          bold: true
        };
      }
      if (rowNum === 3) {
        row.font = {
          name: 'Arial',
          size: 12,
          bold: true
        };
      }

      if (rowNum === totRow || rowNum === (totRow + 1)) {
        row.font = {
          name: 'Arial',
          size: 14,
          bold: true
        };
      }
      if (rowNum === 5) {
        row.eachCell(cell => {
          cell.font = {
            name: 'Arial',
            size: 10,
            bold: true,
            color: { argb: '636a6a' }
          };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'c8d6e5' },
            bgColor: { argb: 'c8d6e5' },
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          cell.alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
        });
      }
      if (rowNum >= 5 && rowNum <= this.LOGS_DATA.length + 5) {
        row.eachCell(cell => {
          // tslint:disable-next-line: max-line-length

          if (rowNum % 2 === 0) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'ffffff' },
              bgColor: { argb: 'ffffff' },
            };
          } else {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'ffffff' },
              bgColor: { argb: 'ffffff' },
            };
          }

          cell.font = {
            color: { argb: 'black' },
            bold: false,
            name: 'Arial',
            size: 10
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          cell.alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
        });
      } else if (rowNum === totRow || rowNum === (totRow + 1)) {
        row.font = {
          name: 'Arial',
          size: 12,
          bold: true
        };
        row.eachCell(cell => {
          cell.alignment = { horizontal: 'text', vertical: 'top', wrapText: true };
        });
      }
    });
    workbook.xlsx.writeBuffer().then(data => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      saveAs(blob, fileName);
    });


  }

  downloadPdf() {
    const doc = new jsPDF('landscape');

    doc.autoTable({
      head: [[new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state]],
      didDrawPage: function (data) {
        doc.setFont('Roboto');
      },
      headerStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'center',
        fontSize: 15,
      },
      useCss: true,
      theme: 'striped'
    });

    doc.autoTable({
      head: [[new TitleCasePipe().transform(' Item Log report: ') + this.sessionName]],
      didDrawPage: function (data) {
        doc.setFont('Roboto');
      },
      headerStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'center',
        fontSize: 13,
      },
      useCss: true,
      theme: 'striped'
    });
    doc.autoTable({
      head: [['Admission No : ' + this.userData.em_admission_no + '    Name : ' + this.userData.au_full_name + '     Class : ' + this.userData.class_name + '     ' + ' Section: ' + this.userData.sec_name]],
      didDrawPage: function (data) {
        doc.setFont('Roboto');
      },
      headerStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'center',
        fontSize: 13,
      },
      useCss: true,
      theme: 'striped'
    });
    doc.autoTable({
      html: '#item_log',
      headerStyles: {
        fontStyle: 'normal',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'center',
        fontSize: 14,
      },
      useCss: true,
      styles: {
        fontSize: 14,
        cellWidth: 'auto',
        textColor: 'black',
        lineColor: '#89A8C9',
      },
      theme: 'grid'
    });

    doc.autoTable({
      head: [['Report Generated By : ' + this.currentUser.full_name]],
      didDrawPage: function (data) {
        doc.setFont('Roboto');
      },
      headerStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'left',
        fontSize: 13,
      },
      useCss: true,
      theme: 'striped'
    });
    doc.autoTable({
      head: [['No. of Records : ' + this.LOGS_DATA.length]],
      didDrawPage: function (data) {
        doc.setFont('Roboto');
      },
      headerStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'left',
        fontSize: 13,
      },
      useCss: true,
      theme: 'striped'
    });

    doc.save('itemLog_' + this.searchForm.value.searchId + '_' + (new Date).getTime() + '.pdf');
  }

  checkWidth(id, header) {

    const res = this.LOGS_DATA.map((f) => f.id !== '-' && f.id ? f.id.toString().length : 1);
    const max2 = header.toString().length;
    const max = Math.max.apply(null, res);
    return max2 > max ? max2 : max;
  }
}
