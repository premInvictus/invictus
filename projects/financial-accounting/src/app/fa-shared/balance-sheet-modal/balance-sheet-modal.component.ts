import { Component, OnInit, Inject, Input, OnChanges } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { SisService, CommonAPIService, SmartService, FaService } from '../../_services';
import { forEach } from '@angular/router/src/utils/collection';
import { LedgerEntryModelComponent } from '../../fa-shared/ledger-entry-model/ledger-entry-model.component';

@Component({
  selector: 'app-balance-sheet-modal',
  templateUrl: './balance-sheet-modal.component.html',
  styleUrls: ['./balance-sheet-modal.component.css']
})
export class BalanceSheetModalComponent implements OnInit {

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
  assetsGroupArr = [];
  liabilitiesGroupArr = [];
  incomeExpenditureDeviation = 0;
  totalDebitRowLength = 0;
  totalCreditRowLength = 0;
  @Input() param: any;
  @Input() incomeExpenditureArray: any;
  @Input() date: any;
  currentReceiptData: any;
  partialPaymentStatus = 1;
  constructor(
    private fbuild: FormBuilder,
    private fb: FormBuilder,
    private commonAPIService: CommonAPIService,
    private faService: FaService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
  }
  ngOnChanges() {
    console.log(this.param);
    this.creditSideTotal = 0;
    this.debitSideTotal = 0;
    this.totalDebitRowLength = 0;
    this.totalCreditRowLength = 0;
    //this.getGroupArray();
    this.checkPartialPaymentStatus();
    this.recursiveDebitArraylength(this.param.liabilities_group_data);
    this.recursiveCreditArraylength(this.param.assets_group_data);
    this.getIncomeExpenditureDeviation();
    this.getTotal();
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


  checkBlankArray() {
    this.blankArr = [];
    this.debitRow = 0;
    this.creditRow = 0;
    this.debitRow = this.totalDebitRowLength;
    this.creditRow = this.partialPaymentStatus ? this.totalCreditRowLength : this.totalCreditRowLength + 1;
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
  }


  recursiveDebitArraylength(arr) {

    for (var ele in arr) {
      if (Array.isArray(arr[ele])) {
        console.log(this.totalDebitRowLength, arr[ele]);
        this.totalDebitRowLength++;
        this.recursiveDebitArraylength(arr[ele])
      } else {
        this.totalDebitRowLength++;
      }
    }

  }

  recursiveCreditArraylength(arr) {

    for (var ele in arr) {
      if (Array.isArray(arr[ele])) {
        this.totalCreditRowLength++;
        this.recursiveCreditArraylength(arr[ele])
      } else {
        this.totalCreditRowLength++;
      }
    }

  }


  getDeviation(param) {
    if (param) {
      this.debit_total_f = 0;
      this.credit_total_f = 0;
      this.deviation_f = 0;
      if (param['debit_data']) {
        for (var i = 0; i < param['debit_data'].length; i++) {
          this.debit_total_f = this.debit_total_f + (param['debit_data'][i]['vc_credit'] ? param['debit_data'][i]['vc_credit'] : 0);
        }
      }
      if (param['credit_data']) {
        for (var i = 0; i < param['credit_data'].length; i++) {
          this.credit_total_f = this.credit_total_f + (param['credit_data'][i]['vc_debit'] ? param['credit_data'][i]['vc_debit'] : 0);
        }
      }
      this.deviation_f = this.debit_total_f - this.credit_total_f;

      return this.deviation_f < 0 ? -this.deviation_f : this.deviation_f;
    }
  }

  getIncomeExpenditureDeviation() {
    var diff = 0;
    var diffTotal = 0;
    var diffCTotal = 0;
    var debitTotal = 0;
    var creditTotal = 0;
    var debitSideTotal = 0;
    var creditSideTotal = 0;
    for (var i = 0; i < this.incomeExpenditureArray['ledger_data'].length; i++) {
      debitTotal = 0;
      creditTotal = 0;
      for (var j = 0; j < this.incomeExpenditureArray['ledger_data'][i]['debit_data'].length; j++) {
        debitTotal = debitTotal + (this.incomeExpenditureArray['ledger_data'][i]['debit_data'][j]['vc_credit'] ? this.incomeExpenditureArray['ledger_data'][i]['debit_data'][j]['vc_credit'] : 0);
      }
      for (var k = 0; k < this.incomeExpenditureArray['ledger_data'][i]['credit_data'].length; k++) {
        creditTotal = creditTotal + (this.incomeExpenditureArray['ledger_data'][i]['credit_data'][k]['vc_debit'] ? this.incomeExpenditureArray['ledger_data'][i]['credit_data'][k]['vc_debit'] : 0);
      }

      diff = creditTotal - debitTotal;
      if (diff > 0) {
        diffTotal = diffTotal + diff;
        creditSideTotal = diffTotal;
      } else if (diff < 0) {
        diffCTotal = diffCTotal + diff;
        debitSideTotal = diffCTotal;
      }


    }
    creditSideTotal = creditSideTotal - (this.partialPaymentStatus ? Number(this.incomeExpenditureArray['head_total_amt']) : 0);
    debitSideTotal = debitSideTotal;
    console.log(debitSideTotal, creditSideTotal)
    this.incomeExpenditureDeviation = debitSideTotal - creditSideTotal;
  }



  getTotal() {

    var diff = 0;
    var diffTotal = 0;
    var diffCTotal = 0;
    this.debitSideBlankArr = [];
    this.creditSideBlankArr = [];
    for (var i = 0; i < this.param['ledger_data'].length; i++) {
      this.debitTotal = 0;
      this.creditTotal = 0;
      for (var j = 0; j < this.param['ledger_data'][i]['debit_data'].length; j++) {
        if (this.param['ledger_data'][i]['account_display']['display_section']['balanceSheet']['assets']) {
          this.creditTotal = this.creditTotal + (this.param['ledger_data'][i]['debit_data'][j]['vc_credit'] ? (this.param['ledger_data'][i]['debit_data'][j]['vc_credit'] < 0 ? -(this.param['ledger_data'][i]['debit_data'][j]['vc_credit']) : this.param['ledger_data'][i]['debit_data'][j]['vc_credit']) : 0);

          //console.log('debitTotal>', this.debitTotal, this.param['ledger_data'][i]['debit_data'][j]['vc_credit'], i);
        }


      }
      for (var k = 0; k < this.param['ledger_data'][i]['credit_data'].length; k++) {
        if (this.param['ledger_data'][i]['account_display']['display_section']['balanceSheet']['liabilities']) {
          this.debitTotal = this.debitTotal + (this.param['ledger_data'][i]['credit_data'][k]['vc_debit'] ? (this.param['ledger_data'][i]['credit_data'][k]['vc_debit'] < 0 ? -(this.param['ledger_data'][i]['credit_data'][k]['vc_debit']) : this.param['ledger_data'][i]['credit_data'][k]['vc_debit']) : 0);

          //console.log('debitTotal>', this.creditTotal,this.param['ledger_data'][i]['credit_data'][k]['vc_debit'], i);
        }
      }


      diff = this.debitTotal - this.creditTotal;
      if (diff < 0) {
        diffTotal = diffTotal - diff;
        console.log(diff, i);
        this.creditSideTotal = diffTotal;
        this.creditSideBlankArr.push(i);
      } else if (diff > 0) {

        diffCTotal = diffCTotal + diff;
        this.debitSideTotal = diffCTotal;
        this.debitSideBlankArr.push(i);
      }




    }

    this.creditSideTotal = this.creditSideTotal + (Number(this.param['head_total_amt']) - Number(this.param['total_receipt_amt']));
    if (this.creditSideTotal < 0) {
      this.creditSideTotal = -this.creditSideTotal;
    }
    this.debitSideTotal = this.debitSideTotal + this.incomeExpenditureDeviation;
    if (this.debitSideTotal < 0) {
      this.debitSideTotal = -this.debitSideTotal;
    }
    ///console.log('this.debitSideTotal--',this.debitSideTotal, this.creditSideTotal);
    this.checkBlankArray();
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
        date: this.date
      }
    });
  }
  getTwoDecimalValue(value) {
    // console.log('value',value);
    if (value && value != 0 && value != '') {
      return Number.parseFloat(value.toFixed(2));
    } else {
      return value;
    }

  }

  toggle(parent, subgroup, mode) {
    console.log(parent, mode);
    var activearr = (mode === 'liabilities') ? this.param['liabilities_group_data'] : this.param['assets_group_data'];
    var total = 0;
    if (parent == '' && subgroup != '') {
      if (activearr) {
        for (var i = 0; i < activearr.length; i++) {
          if (activearr[i]['coa_acc_group'] && activearr[i]['coa_acc_group']['group_name'] === subgroup) {
            if (activearr[i]['expand']) {
              activearr[i]['expand'] = false;
            } else {
              activearr[i]['expand'] = true;
            }
          }
          for (var j = 0; j < activearr[i].length; j++) {
            if (activearr[i][j]['coa_acc_group'] && activearr[i][j]['coa_acc_group']['group_name'] === subgroup) {
              if (activearr[i][j]['expand']) {
                activearr[i][j]['expand'] = false;
              } else {
                activearr[i][j]['expand'] = true;
              }
            }

            if (activearr[i][j]) {
              for (var k = 0; k < activearr[i][j].length; k++) {
                if (activearr[i][j][k]['coa_acc_group'] && activearr[i][j][k]['coa_acc_group']['group_name'] === subgroup) {
                  if (activearr[i][j][k]['expand']) {
                    activearr[i][j][k]['expand'] = false;
                  } else {
                    activearr[i][j][k]['expand'] = true;
                  }
                }
              }
            }
          }
        }
        console.log(activearr)
      }
    }  else if (parent != '') {

      if (activearr) {
        for (var i = 0; i < activearr.length; i++) {
          if (activearr[i]['coa_acc_group'] && activearr[i]['coa_acc_group']['group_parent_name'] === parent) {
            if (activearr[i]['expand']) {
              activearr[i]['expand'] = false;
            } else {
              activearr[i]['expand'] = true;
            }
          }
          for (var j = 0; j < activearr[i].length; j++) {
            if (activearr[i][j]['coa_acc_group'] && activearr[i][j]['coa_acc_group']['group_parent_name'] === parent) {
              if (activearr[i][j]['expand']) {
                activearr[i][j]['expand'] = false;
              } else {
                activearr[i][j]['expand'] = true;
              }
            }

            if (activearr[i][j]) {
              for (var k = 0; k < activearr[i][j].length; k++) {
                if (activearr[i][j][k]['coa_acc_group'] && activearr[i][j][k]['coa_acc_group']['group_parent_name'] === parent) {
                  if (activearr[i][j][k]['expand']) {
                    activearr[i][j][k]['expand'] = false;
                  } else {
                    activearr[i][j][k]['expand'] = true;
                  }
                }
              }
            }
          }
        }
        console.log(activearr)
      }

    }

  }


  getGroupTotal(parent, subgroup, mode) {
    console.log(parent, mode);
    var activearr = (mode === 'liabilities') ? this.param['liabilities_group_data'] : this.param['assets_group_data'];
    var total = 0;
    if (parent == '' && subgroup != '') {
      if (activearr) {
        for (var i = 0; i < activearr.length; i++) {
          if (activearr[i]['coa_acc_group'] && activearr[i]['coa_acc_group']['group_name'] === subgroup) {
            
            total = total + this.getDeviation(activearr[i]);
            activearr[i]['total'] = total;
          }
          for (var j = 0; j < activearr[i].length; j++) {
            if (activearr[i][j]['coa_acc_group'] && activearr[i][j]['coa_acc_group']['group_name'] === subgroup) {
              
              total = total + this.getDeviation(activearr[i][j]);
              activearr[i][j]['total'] = total;
            }

            if (activearr[i][j]) {
              for (var k = 0; k < activearr[i][j].length; k++) {
                if (activearr[i][j][k]['coa_acc_group'] && activearr[i][j][k]['coa_acc_group']['group_name'] === subgroup) {
                  
                  total = total + this.getDeviation(activearr[i][j][k]);
                  activearr[i][j][k]['total'] = total;
                }
              }
            }
          }
        }
        console.log(activearr)
      }
    }  else if (parent != '') {

      if (activearr) {
        for (var i = 0; i < activearr.length; i++) {
          if (activearr[i]['coa_acc_group'] && activearr[i]['coa_acc_group']['group_parent_name'] === parent) {
            total = total + this.getDeviation(activearr[i]);
            activearr[i]['total'] = total;
          }
          for (var j = 0; j < activearr[i].length; j++) {
            if (activearr[i][j]['coa_acc_group'] && activearr[i][j]['coa_acc_group']['group_parent_name'] === parent) {
              total = total + this.getDeviation(activearr[i][j]);
              activearr[i][j]['total'] = total;
            }

            if (activearr[i][j]) {
              for (var k = 0; k < activearr[i][j].length; k++) {
                if (activearr[i][j][k]['coa_acc_group'] && activearr[i][j][k]['coa_acc_group']['group_parent_name'] === parent) {
                  total = total + this.getDeviation(activearr[i][j][k]);
                  activearr[i][j][k]['total'] = total;
                }
              }
            }
          }
        }
        console.log(activearr)
      }

    }

    return this.getTwoDecimalValue(total);

  }

 

}


