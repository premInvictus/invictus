import { Component, OnInit, Inject, Input, OnChanges, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { SisService, CommonAPIService, SmartService, FaService } from '../../_services';
import { forEach } from '@angular/router/src/utils/collection';
import { VoucherModalComponent } from '../voucher-modal/voucher-modal.component';
import * as Excel from 'exceljs/dist/exceljs';
import * as XLSX from 'xlsx';
// const jspdf = require('jspdf');
const jsPDF = require('jspdf');
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { ErpCommonService } from 'src/app/_services';
import * as $ from 'jquery';
@Component({
  selector: 'app-ledger-entry-model',
  templateUrl: './ledger-entry-model.component.html',
  styleUrls: ['./ledger-entry-model.component.css']
})
export class LedgerEntryModelComponent implements OnInit, OnChanges {
  schoolInfo: any;
  showPdf = false;
  accountform: FormGroup;
  disabledApiButton = false;
  accountGroupArr: any[] = [];
  accountTypeArr: any[] = [];
  currentCoaId = 0;
  blankArr: any[] = [];
  showtitle = false;
  currentReceiptData: any;
  credit_total_f = 0;
  debit_total_f = 0;
  deviation_f = 0;
  currentUser: any;
  session_id: any;
  monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  @Input() param: any;
  closingDate: any;
  showExcel = false;


  showExcelDiv = false;
  partialPaymentStatus = 1;
  @ViewChildren('tablecmp') tablecmp: QueryList<ElementRef>;
  @ViewChildren('tablecmp1') tablecmp1: QueryList<ElementRef>;
  @ViewChildren('dummydiv') dummydiv: QueryList<ElementRef>;
  constructor(
    public dialogRef: MatDialogRef<LedgerEntryModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fbuild: FormBuilder,
    private fb: FormBuilder,
    private commonAPIService: CommonAPIService,
    private faService: FaService,
    private dialog: MatDialog,
    private erpCommonService: ErpCommonService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.session_id = JSON.parse(localStorage.getItem('session'));
  }

  ngOnInit() {
    this.buildForm();
    console.log(this.data);
    if (this.data.showtitle) {
      this.showtitle = true;
    }
    this.getLedger();
    this.getSchool();
    this.checkPartialPaymentStatus();
  }
  buildForm() {
  }
  ngOnChanges() {
    // console.log(this.param);
    // this.param.forEach(element => {
    // let dtotal = 0;
    // element.debit_data.forEach(element1 => {
    //   dtotal += Number(element1.vc_particulars_data.vc_debit);
    // });
    // element.dtotal = dtotal;
    // let ctotal = 0;
    // element.credit_data.forEach(element1 => {
    //   ctotal += Number(element1.vc_particulars_data.vc_credit);
    // });
    // element.ctotal = ctotal;
    // if((dtotal -  ctotal) > 0){
    //   element.ctobalance = (dtotal -  ctotal);
    //   element.ctotal += element.ctobalance
    // } else {
    //   element.dtobalance = (ctotal -  dtotal);
    //   element.dtotal += element.dtobalance;
    // }
    // });

  }


  checkPartialPaymentStatus() {
    let param: any = {};
    param.gs_alias = ['fa_partial_payment'];
    this.faService.getGlobalSetting(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        if (result.data && result.data[0]) {
          this.partialPaymentStatus = Number(result.data[0]['gs_value']);
        }

      }
    })
  }

  checkBlankArray(item) {
    // console.log("in");
    this.blankArr = [];
    if (item.debit_data.length > item.credit_data.length) {
      for (var i = 0; i < (item.debit_data.length - item.credit_data.length); i++) {
        this.blankArr.push(i);
      }
    } else if (item.debit_data.length < item.credit_data.length) {
      for (var i = 0; i < (item.credit_data.length - item.debit_data.length); i++) {
        this.blankArr.push(i);
      }
    }

    return this.blankArr;

  }

  getLedger() {
    if (this.data.coa_id) {
      console.log(this.data.date);
      this.faService.getTrialBalance({ coa_id: [this.data.coa_id], monthId: this.data.date != 'consolidate' ? Number(this.data.date) : 'consolidate' }).subscribe((data: any) => {
        if (data) {
          console.log(data);
          // this.param = data;
          var receipt_data = data.receipt_data;
          var receiptArr = [];
          for (var j = 0; j < receipt_data.length; j++) {
            receiptArr.push(receipt_data[j]['tb_name']);
          }
          for (var i = 0; i < data.ledger_data.length; i++) {
            if (data.ledger_data[i]['coa_dependencies'] && receiptArr.indexOf(data.ledger_data[i]['coa_dependencies'][0]['dependency_name']) > -1) {
              var index = receiptArr.indexOf(data.ledger_data[i]['coa_dependencies'][0]['dependency_name']);


              var receipt_value = receipt_data[index]['receipt_amt'];
              if (receipt_value > 0) {
                var iJson: any = {
                  "vc_account_type": data.ledger_data[i]['coa_dependencies'][0]['dependency_name'],
                  "vc_credit": receipt_value

                }
                data.ledger_data[i]['debit_data'].push(iJson);
                data.ledger_data[i]['credit_data'].push({});
              }
              if (receipt_value < 0) {
                var iJson: any = {
                  "vc_account_type": data.ledger_data[i]['coa_dependencies'][0]['dependency_name'],
                  "vc_debit": receipt_value

                }
                data.ledger_data[i]['credit_data'].push(iJson);
                data.ledger_data[i]['debit_data'].push({});
              }
            }
            if (i === data.ledger_data.length - 1) {
              this.param = data;
              //this.tableDivFlag = true;
            }
          }
        } else {

        }
      })
    }
  }

  getDeviation(param) {
    if (param) {
      this.debit_total_f = 0;
      this.credit_total_f = 0;
      this.deviation_f = 0;
      if(param['debit_data']) {
      for (var i = 0; i < param['debit_data'].length; i++) {
        //debit_total = debit_total+param['debit_data'][i]['vc_credit'];
        this.debit_total_f = this.debit_total_f + (param['debit_data'][i]['vc_credit'] ? param['debit_data'][i]['vc_credit'] : 0);
      }}

      if(param['credit_data']) {
      for (var i = 0; i < param['credit_data'].length; i++) {
        //credit_total = credit_total+param['credit_data'][i]['vc_debit'];
        this.credit_total_f = this.credit_total_f + (param['credit_data'][i]['vc_debit'] ? param['credit_data'][i]['vc_debit'] : 0);
      }}
      // console.log(this.debit_total_f, this.credit_total_f);
      this.deviation_f = this.debit_total_f - this.credit_total_f;
      return this.deviation_f;
    }
  }

  // checkForPayableComponent(citem, param) {
  //   //console.log('djfd');
  //   this.currentReceiptData = {};
  //   var flag = 0;
  //   if( param['receipt_data'] && citem ) {
  //    console.log('in--',  citem, param);
  //     for(var i=0; i< param['receipt_data'].length;i++) {
  //     //  console.log(param['receipt_data'][i]['tb_name'], citem['coa_acc_name']);
  //       if( param['receipt_data'][i]['tb_name'] === citem['coa_acc_name'] ) {
  //         this.currentReceiptData = param['receipt_data'][i];
  //          console.log('in1---', i, this.currentReceiptData);
  //         flag = 1;
  //         break;
  //       }
  //     }
  //   }
  //   return flag;
  // }


  closeDialog() {
    this.dialogRef.close();
  }
  getTwoDecimalValue(value) {
    // console.log('value',value);
    if (value && value != 0 && value != '') {
      return Number.parseFloat(value.toFixed(2));
    } else {
      return value;
    }

  }

  openVoucherModal(value) {
    console.log('value--', value);
    const dialogRef = this.dialog.open(VoucherModalComponent, {
      // height: '50vh',
      // width: '100vh',
      data: {
        title: value.vc_type + ' voucher',
        vc_id: value.vc_id
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
  // downloadPdf() {
  //   var data = document.getElementById('tablepdf');  
  //   html2canvas(data).then(canvas => {  
  //     // Few necessary setting options  
  //     var imgWidth = 260;   
  //     var pageHeight = 295;    
  //     var imgHeight = (canvas.height * imgWidth / canvas.width);  
  //     var heightLeft = imgHeight;  

  //     const contentDataURL = canvas.toDataURL('image/png')  
  //     let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
  //     var position = 0;  
  //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
  //     pdf.save('MYPdf.pdf'); // Generated PDF   
  //   });  
  // }

  downloadExcel(index, accName) {
    console.log($(".tablePdf").length);
    var tablecmp = [];
    var $headers = $("#tablecmp" + index + " th");
    var $rows = $("#tablecmp" + index + " tbody tr").each(function (index) {
      var cells = $(this).find("td");
      tablecmp[index] = {};
      cells.each(function (cellIndex) {
        if ($(this).nodeType === Node.COMMENT_NODE) {
          $(this).remove();
        }
        tablecmp[index][$($headers[cellIndex]).html()] = $(this).text();
      });
    });

    var tablecmp1 = [];
    var $headers = $("#tablecmp1" + index + " th");
    var $rows = $("#tablecmp1" + index + " tbody tr").each(function (index) {
      var cells = $(this).find("td");
      tablecmp1[index] = {};
      if ($(this).nodeType === Node.COMMENT_NODE) {
        $(this).remove();
      }
      cells.each(function (cellIndex) {
        tablecmp1[index][$($headers[cellIndex]).html()] = $(this).text();
      });
    });




    for (var i = 0; i < tablecmp.length; i++) {
      tablecmp[i]['CDate'] = tablecmp1[i]['Date'];
      tablecmp[i]['CParticulars'] = tablecmp1[i]['Particulars'];
      tablecmp[i]['CFolio'] = tablecmp1[i]['Folio'];
      tablecmp[i]['CAmount (₹)'] = tablecmp1[i]['Amount (₹)'];
    }

    console.log('tablecmp', tablecmp);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();


    var Heading = [
      ["Account Name", accName],
      [""],
      ["Date", "Particulars", "Folio", "Amount (₹)", "Date", "Particulars", "Folio", "Amount (₹)"],
    ];

    //Had to create a new workbook and then add the header

    XLSX.utils.sheet_add_aoa(wb, Heading);

    const ws: XLSX.WorkSheet = XLSX.utils.sheet_add_json(wb, tablecmp, { origin: 'A4', skipHeader: true });

    ws["!cols"] = [{ width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'SheetJS.xlsx');

  }

  downloadAllExcel() {
    console.log($(".tablePdf").length);
    var totalTables = $(".tablePdf").length;
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    let ws: XLSX.WorkSheet;
    var tablecmp = [];
    for (var index = 0; index < totalTables; index++) {
      
      var $headers = $("#tablecmp" + index + " th");
      var $rows = $("#tablecmp" + index + " tbody tr").each(function (index) {
        var cells = $(this).find("td");
        tablecmp[index] = {};
        cells.each(function (cellIndex) {
          if ($(this).nodeType === Node.COMMENT_NODE) {
            $(this).remove();
          }
          tablecmp[index][$($headers[cellIndex]).html()] = $(this).text();
        });
      });

      var tablecmp1 = [];
      var $headers = $("#tablecmp1" + index + " th");
      var $rows = $("#tablecmp1" + index + " tbody tr").each(function (index) {
        var cells = $(this).find("td");
        tablecmp1[index] = {};
        if ($(this).nodeType === Node.COMMENT_NODE) {
          $(this).remove();
        }
        cells.each(function (cellIndex) {
          tablecmp1[index][$($headers[cellIndex]).html()] = $(this).text();
        });
      });




      for (var i = 0; i < tablecmp.length; i++) {
        tablecmp[i]['CDate'] = tablecmp1[i]['Date'];
        tablecmp[i]['CParticulars'] = tablecmp1[i]['Particulars'];
        tablecmp[i]['CFolio'] = tablecmp1[i]['Folio'];
        tablecmp[i]['CAmount (₹)'] = tablecmp1[i]['Amount (₹)'];
      }

      console.log('tablecmp', tablecmp);



      var Heading = [
        ["Account Name", "Test Account"],
        ["Date", "Particulars", "Folio", "Amount (₹)", "Date", "Particulars", "Folio", "Amount (₹)"],
      ];

      //Had to create a new workbook and then add the header

      XLSX.utils.sheet_add_aoa(wb, Heading);

      ws = XLSX.utils.sheet_add_json(wb, tablecmp, { origin: 'A4', skipHeader: true });

      ws["!cols"] = [{ width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }];
      
    }
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'SheetJS.xlsx');
  }

  downloadPdf(accountName) {
    this.showPdf = true;
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
        fontSize: 12,
      },
      useCss: true,
      theme: 'striped'
    });

    doc.autoTable({
      head: [[
        new TitleCasePipe().transform(accountName)
      ]],
      didDrawPage: function (data) {
        doc.setFont('Roboto');
      },
      headerStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'center',
        fontSize: 10,
      },
      useCss: true,
      theme: 'striped'
    });

    doc.autoTable({
      html: '#tablepdf',
      headerStyles: {
        fontStyle: 'normal',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'center',
        fontSize: 9,
      },
      useCss: true,
      styles: {
        fontSize: 9,
        cellWidth: 'auto',
        textColor: 'black',
        lineColor: '#89A8C9',
      },
      theme: 'grid'
    });

    // doc.autoTable({
    // 	head: [['Report Generated By : ' + this.currentUser.full_name]],
    // 	didDrawPage: function (data) {
    // 		doc.setFont('Roboto');
    // 	},
    // 	headerStyles: {
    // 		fontStyle: 'bold',
    // 		fillColor: '#ffffff',
    // 		textColor: 'black',
    // 		halign: 'left',
    // 		fontSize: 10,
    // 	},
    // 	useCss: true,
    // 	theme: 'striped'
    // });
    doc.autoTable({
      // head: [['No. of Records : ' + this.employeeData.length]],
      // didDrawPage: function (data) {
      // 	doc.setFont('Roboto');
      // },
      headerStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'left',
        fontSize: 10,
      },
      useCss: true,
      theme: 'striped'
    });
    // doc.save('table.pdf');

    // const doc = new jsPDF('landscape');
    // doc.setFont('helvetica');
    // doc.setFontSize(5);
    // doc.autoTable({ html: '#book_log' });

    doc.save('FinancialLedgerCompute_' + (new Date).getTime() + '.pdf');
    this.showPdf = false;
  }


  getMonthWithYear() {
    // let str = '';
    // let nYear = 0;
    // let currentSessionFirst = this.sessionName.split('-')[0];
    // let currentSessionSecond = this.sessionName.split('-')[1];
    // var month_id = this.searchForm.value.month_id;
    // if ((Number(month_id) != 1) && (Number(month_id) != 2) && (Number(month_id) != 3)) {
    // 	nYear = currentSessionFirst;
    // } else {
    // 	nYear = currentSessionSecond;
    // }
    // str = this.monthNames[Number(month_id) - 1].substring(0, 3) + '\'';
    // str += nYear.toString().substring(nYear.toString().length - 2);
    // return str;
  }


}
