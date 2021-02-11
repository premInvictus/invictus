import { Component, OnInit, Inject, Input, OnChanges } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { SisService, CommonAPIService, SmartService, FaService } from '../../_services';
import { forEach } from '@angular/router/src/utils/collection';
import { LedgerEntryModelComponent } from '../../fa-shared/ledger-entry-model/ledger-entry-model.component';
import * as $ from 'jquery';
import { DatePipe, TitleCasePipe } from '@angular/common';
import {IndianCurrency} from '../../_pipes';
import * as Excel from 'exceljs/dist/exceljs';
import { saveAs } from 'file-saver';
const jsPDF = require('jspdf');
import 'jspdf-autotable';
@Component({
  selector: 'app-trial-balance-modal',
  templateUrl: './trial-balance-modal.component.html',
  styleUrls: ['./trial-balance-modal.component.css']
})
export class TrialBalanceModalComponent implements OnInit {
  session:any;
  accountform: FormGroup;
  disabledApiButton = false;
  accountGroupArr: any[] = [];
  accountTypeArr: any[] = [];
  currentCoaId = 0;
  blankArr: any[] = [];
  credit_total_f = 0;
  debit_total_f = 0;
  deviation_f = 0;
  debitTotal = 0;
  creditTotal = 0;
  debitTotalarr: any[] = [];
  creditTotalarr: any[] = [];
  creditSideTotal = 0;
  debitSideTotal = 0;
  debitRow = 0;
  creditRow = 0;
  debitSideBlankArr = [];
  creditSideBlankArr = [];
  showTrialData = false;
  totalDebitRowLength = 0;
  totalCreditRowLength = 0;
  @Input() param: any;
  @Input() prevIncomeExpenditureArray: any;
  @Input() date: any;
  currentReceiptData: any;
  previousIncomeExpenditureDeviation: any = 0;
  partialPaymentStatus = 1;
  schoolInfo: any;
  currentUser: any;
  notFormatedCellArray: any[] = [];
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
    private fbuild: FormBuilder,
    private fb: FormBuilder,
    private commonAPIService: CommonAPIService,
    private faService: FaService,
    private sisService: SisService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.checkPartialPaymentStatus();
    this.session = JSON.parse(localStorage.getItem('session'));
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getSchool();
    this.getSession();
  }

  getSession() {
    this.sisService.getSession().subscribe((res:any) => {
      // console.log("i am response", res);
      this.session = res.data.filter((e) => e.ses_id === this.session.ses_id)
      console.log("i am new session", this.session);
    })
    
    
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
  buildForm() {
  }
  ngOnChanges() {
    console.log(this.param);
    this.creditSideTotal = 0;
    this.debitSideTotal = 0;
    this.previousIncomeExpenditureDeviation = 0;
    this.checkPartialPaymentStatus();
    this.getPreviousIncomeExpenditureDeviation();

  }

  getPreviousIncomeExpenditureDeviation() {

    var diff = 0;
    var diffTotal = 0;
    var diffCTotal = 0;
    var debitSideTotal = 0;
    var creditSideTotal = 0;
    this.previousIncomeExpenditureDeviation = 0;
    if (this.prevIncomeExpenditureArray && this.prevIncomeExpenditureArray['ledger_data']) {

      for (var i = 0; i < this.prevIncomeExpenditureArray['ledger_data'].length; i++) {
        var debitTotal = 0;
        var creditTotal = 0;
        for (var j = 0; j < this.prevIncomeExpenditureArray['ledger_data'][i]['debit_data'].length; j++) {
          debitTotal = debitTotal + (this.prevIncomeExpenditureArray['ledger_data'][i]['debit_data'][j]['vc_credit'] ? parseFloat(this.prevIncomeExpenditureArray['ledger_data'][i]['debit_data'][j]['vc_credit']) : 0);
        }
        for (var k = 0; k < this.prevIncomeExpenditureArray['ledger_data'][i]['credit_data'].length; k++) {
          creditTotal = creditTotal + (this.prevIncomeExpenditureArray['ledger_data'][i]['credit_data'][k]['vc_debit'] ? parseFloat(this.prevIncomeExpenditureArray['ledger_data'][i]['credit_data'][k]['vc_debit']) : 0);
        }

        diff = creditTotal - debitTotal;
        if (diff > 0) {
          diffTotal = diffTotal + diff;
          creditSideTotal = diffTotal;
        } else if (diff < 0) {
          diffCTotal = diffCTotal + (-diff);
          debitSideTotal = diffCTotal;
        }

      }
    }
    this.previousIncomeExpenditureDeviation = creditSideTotal - debitSideTotal;
    this.showTrialData = true;
    if (this.showTrialData) {
      setTimeout(() => {
        this.totalDebitRowLength = $("#liabilities_side tr").length;
        this.totalCreditRowLength = $("#assets_side tr").length;
        this.checkBlankArray();
      }, 1500);

    }
    // console.log('expenditure difference previous',creditSideTotal, debitSideTotal,creditTotal-debitTotal);
    // var diff = 0;
    // var diffTotal = 0;
    // var diffCTotal = 0;
    // for (var i = 0; i < param['ledger_data'].length; i++) {
    //   this.debitTotal = 0;
    //   this.creditTotal = 0;
    //   for (var j = 0; j < param['ledger_data'][i]['debit_data'].length; j++) {
    //     this.debitTotal = this.debitTotal + (param['ledger_data'][i]['debit_data'][j]['vc_credit'] && !(isNaN(param['ledger_data'][i]['debit_data'][j]['vc_credit'])) ? parseFloat(param['ledger_data'][i]['debit_data'][j]['vc_credit']) : 0);
    //   }
    //   for (var k = 0; k < param['ledger_data'][i]['credit_data'].length; k++) {
    //     this.creditTotal = this.creditTotal + (param['ledger_data'][i]['credit_data'][k]['vc_debit'] && !(isNaN(param['ledger_data'][i]['credit_data'][k]['vc_debit']))  ? parseFloat(param['ledger_data'][i]['credit_data'][k]['vc_debit']) : 0);
    //   }

    //   diff = this.creditTotal - this.debitTotal;
    //   if (diff > 0) {
    //     diffTotal = diffTotal + diff;
    //     this.creditSideTotal = diffTotal;
    //   } else if (diff < 0) {
    //     diffCTotal = diffCTotal + (-diff);
    //     this.debitSideTotal = diffCTotal;
    //   }


    // }
    // this.creditSideTotal = this.creditSideTotal;
    // this.debitSideTotal = this.debitSideTotal;

    // console.log('debitSideTotal', this.debitSideTotal);
    // console.log('creditSideTotal', this.creditSideTotal,this.creditSideBlankArr);

  }


  checkPartialPaymentStatus() {
    let param1: any = {};
    // param1.gs_alias = ['fa_partial_payment'];
    // this.faService.getGlobalSetting(param1).subscribe((result: any) => {
    //   if (result && result.status === 'ok') {
    //     if (result.data && result.data[0]) {
    //       this.partialPaymentStatus = Number(result.data[0]['gs_value']);
    //       this.getTotal(this.param);
    //     }        

    //   }
    // });
    this.getTotal(this.param);
  }

  checkBlankArray() {
    this.blankArr = [];
    this.debitRow = 0;
    this.creditRow = 0;
    this.debitRow = this.totalDebitRowLength;
    this.creditRow = this.totalCreditRowLength;
    if (this.debitRow > this.creditRow) {
      for (var i = 0; i < (this.debitRow - this.creditRow); i++) {
        this.blankArr.push(i);
      }
    } else if (this.creditRow > this.debitRow) {
      for (var i = 0; i < (this.creditRow - this.debitRow); i++) {
        this.blankArr.push(i);
      }
    }
    console.log(this.debitRow, this.creditRow);
    if (document.readyState === 'complete') {
      // The page is fully loaded
      console.log('pages is loaded');
    }
  }

  // checkBlankArray(param) {
  //   console.log('in')
  //   this.blankArr = [];
  //   this.debitRow =  (param['total_receipt_amt'] > 0 ? 1 : 0) ;
  //   this.creditRow =  (param['invoice_due_data'] && param['invoice_due_data'].length > 0 ? param['invoice_due_data'].length+1 : 0) ;
  //   this.debitRow =  this.debitSideBlankArr.length;
  //   this.creditRow =  this.creditSideBlankArr.length;
  //   if (this.debitRow > this.creditRow) {
  //     for (var i = 0; i < (this.debitRow - this.creditRow); i++) {
  //       this.blankArr.push(i);
  //     }
  //   } else if (this.creditRow > this.debitRow) {
  //     for (var i = 0; i < (this.creditRow - this.debitRow); i++) {
  //       this.blankArr.push(i);
  //     }
  //   }
  //   console.log( this.debitRow, this.creditRow);

  // }

  getDeviation(param) {
    if (param) {
      this.debit_total_f = 0;
      this.credit_total_f = 0;
      this.deviation_f = 0;
      for (var i = 0; i < param['debit_data'].length; i++) {
        this.debit_total_f = this.debit_total_f + (param['debit_data'][i]['vc_credit'] && !(isNaN(param['debit_data'][i]['vc_credit'])) ? parseFloat(param['debit_data'][i]['vc_credit']) : 0);
      }
      for (var i = 0; i < param['credit_data'].length; i++) {
        this.credit_total_f = this.credit_total_f + (param['credit_data'][i]['vc_debit'] && !(isNaN(param['credit_data'][i]['vc_debit'])) ? parseFloat(param['credit_data'][i]['vc_debit']) : 0);
      }
      this.deviation_f = this.debit_total_f - this.credit_total_f;

      return this.deviation_f;
    }
  }

  getTotal(param) {

    var diff = 0;
    var diffTotal = 0;
    var diffCTotal = 0;
    this.debitSideBlankArr = [];
    this.creditSideBlankArr = [];
    for (var i = 0; i < param['ledger_data'].length; i++) {
      this.debitTotal = 0;
      this.creditTotal = 0;
      for (var j = 0; j < param['ledger_data'][i]['debit_data'].length; j++) {
        this.debitTotal = this.debitTotal + (param['ledger_data'][i]['debit_data'][j]['vc_credit'] && !isNaN(param['ledger_data'][i]['debit_data'][j]['vc_credit']) ? parseFloat(param['ledger_data'][i]['debit_data'][j]['vc_credit']) : 0);

      }

      for (var k = 0; k < param['ledger_data'][i]['credit_data'].length; k++) {
        this.creditTotal = this.creditTotal + (param['ledger_data'][i]['credit_data'][k]['vc_debit'] && !isNaN(param['ledger_data'][i]['credit_data'][k]['vc_debit']) ? parseFloat(param['ledger_data'][i]['credit_data'][k]['vc_debit']) : 0);
        // console.log(k);
      }

      diff = this.debitTotal - this.creditTotal;
      if (diff < 0) {
        diffTotal = diffTotal - diff;
        // console.log(diff, i); 
        this.creditSideTotal = diffTotal;
        this.creditSideBlankArr.push(i);
      } else if (diff > 0) {

        diffCTotal = diffCTotal + diff;
        this.debitSideTotal = diffCTotal;
        this.debitSideBlankArr.push(i);
      }

      if (i === param['ledger_data'].length - 1) {
        this.creditSideTotal = this.creditSideTotal;
        this.debitSideTotal = this.debitSideTotal;
        if (this.creditSideTotal < 0) {
          this.creditSideTotal = -this.creditSideTotal;
        }

        if (this.debitSideTotal < 0) {
          this.debitSideTotal = -this.debitSideTotal;
        }
        // this.checkBlankArray(this.param);
      }

    }

    this.creditSideTotal = this.creditSideTotal + this.previousIncomeExpenditureDeviation;

  }

  downloadPdf() {
    console.log("i a here");
    let arr = this.session[0].ses_name.split('-');
    let filterdate = ''
    if(this.date.length == 1) {
      filterdate = this.month_array.filter(e => e.id == this.date[0])[0].name + "'" + (parseInt(this.date[0]) < 4 ? arr[1].slice(-2): arr[0].slice(-2))
    } else {
      filterdate = this.month_array.filter(e => e.id == this.date[0])[0].name + "'" + (parseInt(this.date[0]) < 4 ? arr[1].slice(-2): arr[0].slice(-2));
      filterdate += "-" + this.month_array.filter(e => e.id == this.date[this.date.length - 1])[0].name + "'" + (parseInt(this.date[this.date.length - 1]) < 4 ? arr[1].slice(-2): arr[0].slice(-2))
    }
    const doc = new jsPDF('p', 'mm', 'a0');
    let pdfrowdata = [];
    let table1data = this.param.ledger_data.filter((e) =>  e.credit_data.length > 0 && e.credit_data.map(t => t.vc_debit).reduce((acc, val) => acc + val, 0) > e.debit_data.map(t => t.vc_credit).reduce((acc, val) => acc + val, 0));
    let table1data2 = this.param.ledger_data.filter((e) =>  e.debit_data.length > 0 && e.credit_data.map(t => t.vc_debit).reduce((acc, val) => acc + val, 0) < e.debit_data.map(t => t.vc_credit).reduce((acc, val) => acc + val, 0));
    let totalexp = 0;
    let totalinc = 0;
    console.log("i m ", table1data);
    
    for(let i = 0; i < (table1data.length < table1data2.length ? table1data2.length: table1data.length); i++) {
      let a = [];
      a.push(table1data2[i] ? table1data2[i].coa_code: '-');
      a.push(table1data2[i]? table1data2[i].coa_acc_name: '-');
      a.push(table1data2[i]  ? new IndianCurrency().transform(table1data2[i].debit_data.map(t => t.vc_credit).reduce((acc, val) => acc + val, 0) - table1data2[i].credit_data.map(t => t.vc_debit).reduce((acc, val) => acc + val, 0)): '-');
      a.push(table1data[i] ? table1data[i].coa_code: '-');
      a.push(table1data[i]?table1data[i].coa_acc_name:'-');
      a.push(table1data[i]? new IndianCurrency().transform(table1data[i].credit_data.map(t => t.vc_debit).reduce((acc, val) => acc + val, 0) - table1data[i].debit_data.map(t => t.vc_credit).reduce((acc, val) => acc + val, 0)): '-');

      pdfrowdata.push(a);
      totalexp += table1data2[i] ? (table1data2[i].debit_data.map(t => t.vc_credit).reduce((acc, val) => acc + val, 0) - table1data2[i].credit_data.map(t => t.vc_debit).reduce((acc, val) => acc + val, 0)): 0;
      totalinc += table1data[i] ? table1data[i].credit_data.map(t => t.vc_debit).reduce((acc, val) => acc + val, 0) - table1data[i].debit_data.map(t => t.vc_credit).reduce((acc, val) => acc + val, 0): 0 ;
    }
    // if(totalinc < totalexp) {
    //   let a = ['','','','', 'Excess of Expenditure over Income', new IndianCurrency().transform(totalexp - totalinc) ];
    //   pdfrowdata.push(a);
    //   totalinc = totalexp;
    // } else {
    //   let a = ['', 'Excess of Income over Expenditure', new IndianCurrency().transform(totalinc - totalexp),'','','' ];
    //   pdfrowdata.push(a);
    //   totalexp = totalinc;
    // }
    let finalarray = ['','Total',new IndianCurrency().transform(totalexp), '', 'Total', new IndianCurrency().transform(totalinc)];
    pdfrowdata.push(finalarray);
    doc.levelHeading = [];
					doc.levelTotalFooter = [];
					doc.levelSubtotalFooter = [];

		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [[new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state]],
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 50,
			},
			useCss: true,
			theme: 'striped'
		});
    doc.autoTable({
      head: [[`Trial Balance Report - ${filterdate}`]],
      margin: { bottom: 10 },
      didDrawPage: function (data) {

      },
      headStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'center',
        fontSize: 40,
        // textAlign: 'center'
      },
      useCss: true,
      theme: 'striped'
    });
    doc.autoTable({
      head: [['Account Code', 'Particulars', 'Amount', 'Account Code', 'Particulars', 'Amount']],
      body: pdfrowdata,
      startY: doc.previousAutoTable.finalY + 0.5,
      tableLineColor: 'black',
      didDrawPage: function (data) {
        doc.setFontStyle('bold');
      },
      willDrawCell: function (data) {
        // tslint:disable-next-line:no-shadowed-variable
        const doc = data.doc;
        const rows = data.table.body;

        // level 0
        const lfIndex = doc.levelTotalFooter.findIndex(item => item === data.row.index);
        if (lfIndex !== -1) {
          doc.setFontStyle('bold');
          doc.setFontSize('16');
          doc.setTextColor('#ffffff');
          doc.setFillColor(0, 62, 120);
        }

        // level more than 0
        const lsfIndex = doc.levelSubtotalFooter.findIndex(item => item === data.row.index);
        if (lsfIndex !== -1) {
          doc.setFontStyle('bold');
          doc.setFontSize('16');
          doc.setTextColor('#ffffff');
          doc.setFillColor(229, 136, 67);
        }

        // group heading
        const lhIndex = doc.levelHeading.findIndex(item => item === data.row.index);
        if (lhIndex !== -1) {
          doc.setFontStyle('bold');
          doc.setFontSize('16');
          doc.setTextColor('#5e666d');
          doc.setFillColor('#c8d6e5');
        }

        // grand total
        if (data.row.index === rows.length - 1) {
          doc.setFontStyle('bold');
          doc.setFontSize('16');
          doc.setTextColor('#ffffff');
          doc.setFillColor(67, 160, 71);
        }
      },
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
        minCellHeight: 20,
        fontSize: 18,
        cellWidth: 'auto',
        textColor: 'black',
        lineColor: '#89a8c8',
        valign: 'middle',
        halign: 'right',
      },
      theme: 'grid'
    });
    doc.autoTable({
      // tslint:disable-next-line:max-line-length
      head: [['Generated On: '
        + new DatePipe('en-in').transform(new Date(), 'd-MMM-y')]],
      margin: { top: 10 },
      didDrawPage: function (data) {

      },
      headStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'left',
        fontSize: 40,
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
        fontSize: 40,
      },
      useCss: true,
      theme: 'striped'
    });
    doc.save('Trial_balance_Report' + ".pdf");
    
  }

  downloadExcel() {
    console.log("i am here", this.param);
    let columndefinition = [
      {
        name: 'Account Code',
        id: 'account_code_1'
      },
      {
        name: 'Particulars',
        id: 'expenditure'
      },
      {
        name: 'Amount',
        id: 'amount_1'
      },
      {
        name: 'Account Code',
        id: 'account_code_2'
      },
      {
        name: 'Particulars',
        id: 'income'
      },
      {
        name: 'Amount ',
        id: 'amount_2'
      },
    ];
    const columns: any[] = [];
    const columValue: any[] = [];
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Income_and_expenditure_report', { properties: { showGridLines: true } },
      { pageSetup: { fitToWidth: 7 } });
    for (const item of columndefinition) {
      columns.push({
        key: item.id,
        width: 12
      });
      columValue.push(item.name);
    }
    let filterdate = '';
    let arr = this.session[0].ses_name.split('-');
    if(this.date.length == 1) {
      filterdate = this.month_array.filter(e => e.id == this.date[0])[0].name + "'" + (parseInt(this.date[0]) < 4 ? arr[1].slice(-2): arr[0].slice(-2))
    } else {
      filterdate = this.month_array.filter(e => e.id == this.date[0])[0].name + "'" + (parseInt(this.date[0]) < 4 ? arr[1].slice(-2): arr[0].slice(-2));
      filterdate += "-" + this.month_array.filter(e => e.id == this.date[this.date.length - 1])[0].name + "'" + (parseInt(this.date[this.date.length - 1]) < 4 ? arr[1].slice(-2): arr[0].slice(-2))
    }

    let table1data = this.param.ledger_data.filter((e) =>  e.credit_data.length > 0 && e.credit_data.map(t => t.vc_debit).reduce((acc, val) => acc + val, 0) > e.debit_data.map(t => t.vc_credit).reduce((acc, val) => acc + val, 0));
    let table1data2 = this.param.ledger_data.filter((e) =>  e.debit_data.length > 0 && e.credit_data.map(t => t.vc_debit).reduce((acc, val) => acc + val, 0) < e.debit_data.map(t => t.vc_credit).reduce((acc, val) => acc + val, 0));
    // console.log("i am here", table1data, table1data2);
    
    worksheet.properties.defaultRowHeight = 25;
    worksheet.mergeCells('A1:' + this.alphabetJSON[columns.length] + '1'); // Extend cell over all column headers
    worksheet.getCell('A1').value =
      new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
    worksheet.getCell('A1').alignment = { horizontal: 'left' };
    worksheet.mergeCells('A2:' + this.alphabetJSON[columns.length] + '2');
    worksheet.getCell('A2').value = `Trial Balance Report - ${filterdate}`;
    worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
    worksheet.getRow(4).values = columValue;
    worksheet.columns = columns;
    let obj2 = {
      account_code_1 : '',
      expenditure:'Total',
      amount_1: 0,
      account_code_2 : '',
      income:'Total',
      amount_2: 0,
    }
    for(let i = 0; i < (table1data.length < table1data2.length ? table1data2.length: table1data.length); i++) {
      let obj={
        account_code_1: table1data2[i] ? table1data2[i].coa_code: '-',
        expenditure: table1data2[i]? table1data2[i].coa_acc_name: '-',
        amount_1: table1data2[i] ? (table1data2[i].debit_data.map(t => t.vc_credit).reduce((acc, val) => acc + val, 0) - table1data2[i].credit_data.map(t => t.vc_debit).reduce((acc, val) => acc + val, 0)): '-',
        account_code_2: table1data[i] ? table1data[i].coa_code: '-',
        income: table1data[i]? table1data[i].coa_acc_name:'-',
        amount_2: table1data[i]? (table1data[i].credit_data.map(t => t.vc_debit).reduce((acc, val) => acc + val, 0) - table1data[i].debit_data.map(t => t.vc_credit).reduce((acc, val) => acc + val, 0)): '-',
      
      };

      obj2.amount_1 += table1data2[i] ? table1data2[i].debit_data.map(t => t.vc_credit).reduce((acc, val) => acc + val, 0) - table1data2[i].credit_data.map(t => t.vc_debit).reduce((acc, val) => acc + val, 0): 0;
      obj2.amount_2 += table1data[i] ? table1data[i].credit_data.map(t => t.vc_debit).reduce((acc, val) => acc + val, 0) - table1data[i].debit_data.map(t => t.vc_credit).reduce((acc, val) => acc + val, 0): 0;
      // console.log("i am obj", obj);

      worksheet.addRow(obj);
    }
    // if(obj2.amount_1 < obj2.amount_2) {
    //   let ovj = {
    //     account_code_1 : '',
    //     account_code_2 : '',
    //     income:'',
    //     amount_2: '',
    //     expenditure: 'Excess of Income over Expenditure',
    //     amount_1: new IndianCurrency().transform(obj2.amount_2 - obj2.amount_1)
    //   }
    //   worksheet.addRow(ovj);
    //   obj2.amount_1 = obj2.amount_2;
    // } else  if(obj2.amount_1 > obj2.amount_2) {
    //   let ovj = {
    //     account_code_1 : '',
    //     account_code_2 : '',
    //     expenditure:'',
    //     amount_2: '',
    //     income: 'Excess of Expenditure over Income',
    //     amount_1: new IndianCurrency().transform(obj2.amount_1 - obj2.amount_2)
    //   }
    //   worksheet.addRow(ovj);
    //   obj2.amount_2 = obj2.amount_1;
    // }
    obj2.amount_1 = (obj2.amount_1);
    obj2.amount_2 = (obj2.amount_2);
    worksheet.addRow(obj2);

      worksheet.getRow(worksheet._rows.length).eachCell(cell => {
        columndefinition.forEach(element => {
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
            cell.alignment = { horizontal: 'center', wrapText: true };
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
        row.defaultRowHeight = 24;
      });
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
        saveAs(blob, "Trial_Balance_report" + ".xlsx");
      });

    
    // for(let i = 0; i < (this.param.ledger_data.length > ))

  }


  openLedgerModal(value) {
    console.log('trial balance coa_id', value, this.date);
    const dialogRef = this.dialog.open(LedgerEntryModelComponent, {
      height: '520px',
      width: '1400px',
      data: {
        title: value.coa_acc_name,
        showtitle: true,
        coa_id: value.coa_id,
        date: this.date,
        value: value
      }
    });
  }
  getTwoDecimalValue(value) {
    // console.log('value',value);
    if (value && value != 0 && value != '' && !isNaN(value)) {
      return Number.parseFloat(value.toFixed(2));
    } else {
      return isNaN(value) ? 0 : value;
    }

  }

}
