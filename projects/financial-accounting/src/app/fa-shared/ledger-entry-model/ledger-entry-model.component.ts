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
import { saveAs } from 'file-saver';
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

  month_array = [
    {
      id: '04',
      name: 'April'
    },
    {
      id: '05',
      name: 'May'
    },
    {
      id: '06',
      name: 'June'
    },
    {
      id: '07',
      name: 'July'
    },
    {
      id: '08',
      name: 'August'
    },
    {
      id: '09',
      name: 'September'
    },
    {
      id: '10',
      name: 'October'
    },
    {
      id: '11',
      name: 'November'
    },
    {
      id: '12',
      name: 'December'
    },
    {
      id: '01',
      name: 'January'
    },
    {
      id: '02',
      name: 'Feburary'
    },
    {
      id: '03',
      name: 'March'
    },

  ]
  session: any;
  date: any;
  notFormatedCellArray: any;

  constructor(
    public dialogRef: MatDialogRef<LedgerEntryModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fbuild: FormBuilder,
    private fb: FormBuilder,
    private commonAPIService: CommonAPIService,
    private faService: FaService,
    private dialog: MatDialog,
    private erpCommonService: ErpCommonService,
    private sisService: SisService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.session_id = JSON.parse(localStorage.getItem('session'));
  }
  

  ngOnInit() {
    this.getSession();
    this.buildForm();
    console.log("data >>>>>",this.data);
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
   promote(foo, arr) {
    for (var i=0; i < arr.length; i++) {
        if (arr[i].foo === foo) {
            var a = arr.splice(i,1);   // removes the item
            arr.unshift(a[0]);         // adds it back to the beginning
            break;
        }
    }
    // Matching item wasn't found. Array is unchanged, but you could do something
    // else here if you wish (like an error message).
  }
  getLedger() {
    this.credit_total_f = 0;
    this.debit_total_f = 0;
    this.deviation_f = 0;
    if (this.data.coa_id) {
      console.log("passed ledger data ",this.data.date);
      this.faService.getTrialBalance({ coa_id: [this.data.coa_id], monthId: this.data.date}).subscribe((data: any) => {
        console.log(">>>>>>>>>>>>>>>>>>> Get Trail Balance >>>>>>>>>>>>>>>>>>>>",data);
        if (data) {
          // this.param = data;
          var receipt_data = data.receipt_data;
          var receiptArr = [];
          for (var j = 0; j < receipt_data.length; j++) {
            receiptArr.push(receipt_data[j]['tb_name']);
          }

          
        console.log(">>>>>>>>>>>>>>>>>>> Get ledger_data >>>>>>>>>>>>>>>>>>>>",data.ledger_data);
          for (var i = 0; i < data.ledger_data.length; i++) {
            if (data.ledger_data[i]['coa_dependencies'] && data.ledger_data[i]['coa_dependencies'].length > 0 && data.ledger_data[i]['coa_dependencies'] && receiptArr.indexOf(data.ledger_data[i]['coa_dependencies'][0]['dependency_name']) > -1) {
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
            }else if(data.ledger_data[i]['coa_dependencies'] == undefined || data.ledger_data[i]['coa_dependencies'].length <= 0){
              console.log("I am here");
              let open_year = data.ledger_data[0].coa_opening_balance_data.opening_balance_date.split('-');
              var y: number = +open_year[0];
              let new_open_year = y + 1;
              let new_open_date = new_open_year + "-01-01";
              let closing_date = open_year[0] + "12-31";
              var iJson: any = {
                "vc_account_type": "Opening Balance",
                "vc_debit": data.ledger_data[0].coa_opening_balance_data.opening_balance,
                "vc_date" : new_open_date,
                "vc_closing_date" : closing_date
              }
              data.ledger_data[i]['credit_data'].push({});
              data.ledger_data[i]['debit_data'].push({});
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
  

  getSession() {
    this.sisService.getSession().subscribe((res:any) => {
      console.log("i am session", res);
      res.data.forEach(element => {
        if(element.ses_alias === 'current') this.session = element.ses_id
      });
      // this.session = res.data.filter((e) => e.ses_alias === 'current')
      console.log("i am new session", this.session);
    })
  }

  getDeviation(param) {
    if (param) {
      this.debit_total_f = 0;
      this.credit_total_f = 0;
      this.deviation_f = 0;
      if(param['debit_data']) {
      for (var i = 0; i < param['debit_data'].length; i++) {
        //debit_total = debit_total+param['debit_data'][i]['vc_credit'];
        this.debit_total_f = this.debit_total_f + (param['debit_data'][i]['vc_credit'] && !(isNaN(param['debit_data'][i]['vc_credit'])) ? parseFloat(param['debit_data'][i]['vc_credit']) : 0);
        // console.log('debit--',param['debit_data'][i]['vc_credit']);
      }}

      if(param['credit_data']) {
      for (var i = 0; i < param['credit_data'].length; i++) {
        //credit_total = credit_total+param['credit_data'][i]['vc_debit'];
        this.credit_total_f = this.credit_total_f + (param['credit_data'][i]['vc_debit'] && !(isNaN(param['credit_data'][i]['vc_debit'])) ? parseFloat(param['credit_data'][i]['vc_debit']) : 0);
        // console.log('credit--',param['credit_data'][i]['vc_debit']);
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
    if (value && value != 0 && value != '' && !isNaN(value)) {
      return parseFloat((value).toString()).toFixed(2);
    } else {
      return !isNaN(value) ? value : 0;
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
    this.sisService.getSchool().subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.schoolInfo = res.data[0];
        console.log('this.schoolInfo 202', this.schoolInfo)
        this.schoolInfo['disable'] = true;
        this.schoolInfo['si_school_prefix'] = this.schoolInfo.school_prefix;
        this.schoolInfo['si_school_name'] = this.schoolInfo.school_name;
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
        console.log($($headers[cellIndex]).html(),'html--');
        if ($($headers[cellIndex]).html() == "Amount (₹)") {
          tablecmp[index][$($headers[cellIndex]).html()] = Number($(this).text().replace(/[^0-9.-]+/g,""));
        } else {
          tablecmp[index][$($headers[cellIndex]).html()] = $(this).text();
        }
        
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
        // tablecmp1[index][$($headers[cellIndex]).html()] = $(this).text();
        if ($($headers[cellIndex]).html() == "Amount (₹)") {
          tablecmp1[index][$($headers[cellIndex]).html()] = Number($(this).text().replace(/[^0-9.-]+/g,""));
        } else {
          tablecmp1[index][$($headers[cellIndex]).html()] = $(this).text();
        }
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

    var schoolName = this.schoolInfo.school_name + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;

    var Heading = [
      [schoolName],
      [""],
      [""],
      ["Account Name", accName],
      [""],
      ["Date", "Particulars", "Folio", "Amount (₹)", "Date", "Particulars", "Folio", "Amount (₹)"],
    ];

    //Had to create a new workbook and then add the header

    XLSX.utils.sheet_add_aoa(wb, Heading);

    const ws: XLSX.WorkSheet = XLSX.utils.sheet_add_json(wb, tablecmp, { origin: 'A7', skipHeader: true });

    ws["!cols"] = [{ width: 20}, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Ledger');

    XLSX.writeFile(wb, 'FinancialLedger_' + (new Date).getTime() + '.xlsx');

  }


//   downloadExcel() {
//     const table:any = document.querySelector('#liabilities_side');
//     const table1:any = document.querySelector('#assets_side');
//     let tableArray1 = [];
//     let tableArray2 = [];
//     // console.log("i am table", table.tBodies[0].rows);
//     Array.from(table.tBodies[0].rows).forEach((row:any, idx:any) => {
//       let tds = []; 
//       Array.from(row.cells).map((td:any) => tds.push(td.textContent));
      
//       tableArray1.push(tds);
//     });
//     Array.from(table1.tBodies[0].rows).forEach((row:any, idx:any) => {
//       let tds = []; 
//       Array.from(row.cells).map((td:any) => tds.push(td.textContent));
      
//       tableArray2.push(tds);
//     })
//     // console.log('tds content:', tableArray1, tableArray2);

//     let columndefinition = [
//       {
//         name: 'Account Code',
//         id: 'account_code_1'
//       },
//       {
//         name: 'Capital & Liabilites',
//         id: 'expenditure'
//       },
//       {
//         name: 'Amount',
//         id: 'amount_1'
//       },
//       {
//         name: 'Account Code',
//         id: 'account_code_2'
//       },
//       {
//         name: 'Assets',
//         id: 'income'
//       },
//       {
//         name: 'Amount ',
//         id: 'amount_2'
//       },
//     ];
//     const columns: any[] = [];
//     const columValue: any[] = [];
//     const workbook = new Excel.Workbook();
//     const worksheet = workbook.addWorksheet('Balance_Sheet_report', { properties: { showGridLines: true } },
//       { pageSetup: { fitToWidth: 7 } });
//     for (const item of columndefinition) {
//       columns.push({
//         key: item.id,
//         width: 12
//       });
//       columValue.push(item.name);
//     }
//     let filterdate = '';
//     let arr = this.session[0].ses_name.split('-');
//     if(this.date.length == 1) {
//       filterdate = this.month_array.filter(e => e.id == this.date[0])[0].name + "'" + (parseInt(this.date[0]) < 4 ? arr[1].slice(-2): arr[0].slice(-2))
//     } else {
//       filterdate = this.month_array.filter(e => e.id == this.date[0])[0].name + "'" + (parseInt(this.date[0]) < 4 ? arr[1].slice(-2): arr[0].slice(-2));
//       filterdate += "-" + this.month_array.filter(e => e.id == this.date[this.date.length - 1])[0].name + "'" + (parseInt(this.date[this.date.length - 1]) < 4 ? arr[1].slice(-2): arr[0].slice(-2))
//     }

//     worksheet.properties.defaultRowHeight = 25;
//     worksheet.mergeCells('A1:' + this.alphabetJSON[columns.length] + '1'); // Extend cell over all column headers
//     worksheet.getCell('A1').value =
//       new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
//     worksheet.getCell('A1').alignment = { horizontal: 'left' };
//     worksheet.mergeCells('A2:' + this.alphabetJSON[columns.length] + '2');
//     worksheet.getCell('A2').value = `Balance Sheet Report - ${filterdate}`;
//     worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
//     worksheet.getRow(4).values = columValue;
//     worksheet.columns = columns;

//     for(let i = 0; i < (tableArray1.length -1 ); i++) {
//       // console.log("i am here", tableArray1[i][2], tableArray2[i][2], parseInt(tableArray1[i][2].replace('( - )', '')), parseInt(tableArray2[i][2].replace('( - )', '')));     
//       let obj={
//         account_code_1: tableArray1[i][0],
//         expenditure: tableArray1[i][1],
//         amount_1: tableArray1[i][2] != '' ? tableArray1[i][2].includes('( - )') ? parseInt(tableArray1[i][2].replace('( - )', '').replace(',', '')): parseInt(tableArray1[i][2].replace(',', '')) : '-' ,
//         account_code_2: tableArray2[i][0],
//         income: tableArray2[i][1],
//         amount_2: tableArray2[i][2] != '' ? tableArray2[i][2].includes('( - )') ? parseInt(tableArray2[i][2].replace('( - )', '').replace(',', '')): parseInt(tableArray2[i][2].replace(',', '')) : '-',
      
//       };

//       // obj2.amount_1 += table1[i] ? table1[i].debit_data.map(t => t.vc_credit).reduce((acc, val) => acc + val, 0) - table1[i].credit_data.map(t => t.vc_debit).reduce((acc, val) => acc + val, 0): 0;
//       // obj2.amount_2 += table[i] ? table[i].credit_data.map(t => t.vc_debit).reduce((acc, val) => acc + val, 0) - table[i].debit_data.map(t => t.vc_credit).reduce((acc, val) => acc + val, 0): 0;
//       // // console.log("i am obj", obj);

//       worksheet.addRow(obj);

//     }
//     let obj={
//       account_code_1: '',
//       expenditure: 'Total',
//       amount_1:  this.getTwoDecimalValue(0),
//       account_code_2: '',
//       income: 'Total',
//       amount_2: this.getTwoDecimalValue(0),
    
//     };
//     worksheet.addRow(obj);

//     worksheet.getRow(worksheet._rows.length).eachCell(cell => {
//       columndefinition.forEach(element => {
//         cell.font = {
//           color: { argb: 'ffffff' },
//           bold: true,
//           name: 'Arial',
//           size: 10
//         };
//         cell.alignment = { wrapText: true, horizontal: 'center' };
//         cell.fill = {
//           type: 'pattern',
//           pattern: 'solid',
//           fgColor: { argb: '439f47' },
//           bgColor: { argb: '439f47' }
//         };
//         cell.border = {
//           top: { style: 'thin' },
//           left: { style: 'thin' },
//           bottom: { style: 'thin' },
//           right: { style: 'thin' }
//         };
//       });
//     });
//     // style all row of excel
//     worksheet.eachRow((row, rowNum) => {
//       if (rowNum === 1) {
//         row.font = {
//           name: 'Arial',
//           size: 14,
//           bold: true
//         };
//       } else if (rowNum === 2) {
//         row.font = {
//           name: 'Arial',
//           size: 12,
//           bold: true
//         };
//       } else if (rowNum === 4) {
//         row.eachCell((cell) => {
//           cell.font = {
//             name: 'Arial',
//             size: 12,
//             bold: true
//           };
//           cell.fill = {
//             type: 'pattern',
//             pattern: 'solid',
//             fgColor: { argb: 'bdbdbd' },
//             bgColor: { argb: 'bdbdbd' },
//           };
//           cell.border = {
//             top: { style: 'thin' },
//             left: { style: 'thin' },
//             bottom: { style: 'thin' },
//             right: { style: 'thin' }
//           };
//           cell.alignment = { horizontal: 'center', wrapText: true };
//         });
//       } else if (rowNum > 4 && rowNum < worksheet._rows.length) {
//         const cellIndex = this.notFormatedCellArray.findIndex(item => item === rowNum);
//         if (cellIndex === -1) {
//           row.eachCell((cell) => {
//             cell.font = {
//               name: 'Arial',
//               size: 10,
//             };
//             cell.alignment = { wrapText: true, horizontal: 'center' };
//           });
//           if (rowNum % 2 === 0) {
//             row.eachCell((cell) => {
//               cell.fill = {
//                 type: 'pattern',
//                 pattern: 'solid',
//                 fgColor: { argb: 'ffffff' },
//                 bgColor: { argb: 'ffffff' },
//               };
//               cell.border = {
//                 top: { style: 'thin' },
//                 left: { style: 'thin' },
//                 bottom: { style: 'thin' },
//                 right: { style: 'thin' }
//               };
//             });
//           } else {
//             row.eachCell((cell) => {
//               cell.fill = {
//                 type: 'pattern',
//                 pattern: 'solid',
//                 fgColor: { argb: 'ffffff' },
//                 bgColor: { argb: 'ffffff' },
//               };
//               cell.border = {
//                 top: { style: 'thin' },
//                 left: { style: 'thin' },
//                 bottom: { style: 'thin' },
//                 right: { style: 'thin' }
//               };
//             });
//           }

//         }
//       }
//       row.defaultRowHeight = 24;
//     });
//     worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
//     this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
//   worksheet.getCell('A' + worksheet._rows.length).value = 'Generated On: '
//     + new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
//   worksheet.getCell('A' + worksheet._rows.length).font = {
//     name: 'Arial',
//     size: 10,
//     bold: true
//   };

//   worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
//     this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
//   worksheet.getCell('A' + worksheet._rows.length).value = 'Generated By: ' + this.currentUser.full_name;
//   worksheet.getCell('A' + worksheet._rows.length).font = {
//     name: 'Arial',
//     size: 10,
//     bold: true
//   };
//     workbook.xlsx.writeBuffer().then(data => {
//       const blob = new Blob([data], { type: 'application/octet-stream' });
//       saveAs(blob, "Balance_sheet_report" + ".xlsx");
//     });

// // get all rows in the first table body
//     // const rows = table.tBodies[0].rows;
//   }

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

  downloadPdf(accountName, index) {
    
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
        console.log($($headers[cellIndex]).html(),'html--');
        if ($($headers[cellIndex]).html() == "Amount (₹)") {
          tablecmp[index][$($headers[cellIndex]).html()] = Number($(this).text().replace(/[^0-9.-]+/g,""));
        } else {
          tablecmp[index][$($headers[cellIndex]).html()] = $(this).text();
        }
        
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
        // tablecmp1[index][$($headers[cellIndex]).html()] = $(this).text();
        if ($($headers[cellIndex]).html() == "Amount (₹)") {
          tablecmp1[index][$($headers[cellIndex]).html()] = Number($(this).text().replace(/[^0-9.-]+/g,""));
        } else {
          tablecmp1[index][$($headers[cellIndex]).html()] = $(this).text();
        }
      });
    });




    for (var i = 0; i < tablecmp.length; i++) {
      tablecmp[i]['CDate'] = tablecmp1[i]['Date'];
      tablecmp[i]['CParticulars'] = tablecmp1[i]['Particulars'];
      tablecmp[i]['CFolio'] = tablecmp1[i]['Folio'];
      tablecmp[i]['CAmount (₹)'] = tablecmp1[i]['Amount (₹)'];
    }


    console.log('tablecmp', tablecmp);
    this.showPdf = true;
    const doc = new jsPDF('landscape');

    var tableData = [];
    tablecmp.forEach((element)=>{
      var temp = [];
      for (var key in element) {
        var value = element[key];   
        temp.push(value)     
      }
      console.log("temp", temp);
      tableData.push(temp)
    })
    console.log("tableData", tableData);

    doc.autoTable({
      head: [[new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state]],
      didDrawPage: function (data) {
        doc.setFont('Roboto');
      },
      headStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'center',
        fontSize: 25,
      },
      useCss: true,
      theme: 'striped'
    });

    doc.autoTable({
      head: [[`Ledger Report`]],
      margin: { bottom: 10 },
      didDrawPage: function (data) {

      },
      headStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'center',
        fontSize: 20,
        // textAlign: 'center'
      },
      useCss: true,
      theme: 'striped'
    });

    doc.autoTable({
      head: [[` A/c - ${new TitleCasePipe().transform(accountName)}`]],
      didDrawPage: function (data) {
        doc.setFont('Roboto');
      },
      headStyles: {
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
      head: [['Date', 'Particulars', 'Folio', 'Amount', 'Date', 'Particulars', 'Folio', 'Amount']],
      body: tableData,
      startY: doc.previousAutoTable.finalY + 0.5,
      tableLineColor: 'black',
      didDrawPage: function (data) {
        doc.setFontStyle('bold');
      },
      // willDrawCell: function (data) {
      //   // tslint:disable-next-line:no-shadowed-variable
      //   const doc = data.doc;
      //   const rows = data.table.body;
      //   console.log("data",data);
      //   // doc.setFontStyle('bold');
      //   // doc.setFontSize('16');
      //   // doc.setTextColor('#000000');
      //   // doc.setFillColor(229, 136, 67);
        
      // },
      headStyles: {
        fontStyle: 'bold',
        fillColor: '#c8d6e5',
        textColor: '#5e666d',
        fontSize: 16,
        halign: 'center',
      },
      alternateRowStyles: {
        fillColor: '#f1f4f7'
      },
      useCss: true,
      styles: {
        minCellHeight: 10,
        fontSize: 14,
        cellWidth: 'auto',
        textColor: 'black',
        lineColor: '#89a8c8',
        valign: 'middle',
        halign: 'right',
      },
      theme: 'grid'
    });

    // doc.autoTable({
    //   head: [['Date', 'Particulars', 'Folio', 'Amount', 'Date', 'Particulars', 'Folio', 'Amount']],
    //   body: tablecmp,
    //   headStyles: {
    //     fontStyle: 'normal',
    //     fillColor: '#ffffff',
    //     textColor: 'black',
    //     halign: 'center',
    //     fontSize: 9,
    //   },
    //   useCss: true,
    //   styles: {
    //     fontSize: 9,
    //     cellWidth: 'auto',
    //     textColor: 'black',
    //     lineColor: '#89A8C9',
    //   },
    //   theme: 'grid'
    // });

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
    // doc.autoTable({
    //   // head: [['No. of Records : ' + this.employeeData.length]],
    //   // didDrawPage: function (data) {
    //   // 	doc.setFont('Roboto');
    //   // },
    //   headerStyles: {
    //     fontStyle: 'bold',
    //     fillColor: '#ffffff',
    //     textColor: 'black',
    //     halign: 'left',
    //     fontSize: 10,
    //   },
    //   useCss: true,
    //   theme: 'striped'
    // });
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
