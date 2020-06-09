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
  @Input() param: any;
  @Input() incomeExpenditureArray: any;
  @Input() date: any;
  currentReceiptData: any;
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
    //this.getGroupArray();
    this.getIncomeExpenditureDeviation();
    this.getTotal();
  }

  getGroupArray() {
    var tempLiabilitiesGroupArr = [];
    var tempAssetsGrouparr = [];
    this.param['liabilities_group_data'] = [];
    this.param['assets_group_data'] = [];
    for (var i = 0; i < this.param.ledger_data.length; i++) {
      if (this.param.ledger_data[i]['account_display']['display_section']['balanceSheet']['liabilities']) {
        if (!((tempLiabilitiesGroupArr.indexOf(this.param.ledger_data[i]['coa_acc_group']['group_name'])) > -1)) {
          tempLiabilitiesGroupArr.push(this.param.ledger_data[i]['coa_acc_group']['group_name']);
          if (this.param.ledger_data[i]['credit_data'].length > 0 && this.param.ledger_data[i]['credit_data'][0] && this.param.ledger_data[i]['credit_data'][0]['vc_debit']) {
            this.param['liabilities_group_data'][this.param.ledger_data[i]['coa_acc_group']['group_name']] = {
              group_name: this.param.ledger_data[i]['coa_acc_group']['group_name'],
              group_parent_name: this.param.ledger_data[i]['coa_acc_group']['group_parent_name'] ? this.param.ledger_data[i]['coa_acc_group']['group_parent_name'] : '',
              group_data: [this.param.ledger_data[i]]
            };
          }
        } else {
          if (this.param.ledger_data[i]['credit_data'].length > 0 && this.param.ledger_data[i]['credit_data'][0] && this.param.ledger_data[i]['credit_data'][0]['vc_debit']) {
            this.param['liabilities_group_data'][this.param.ledger_data[i]['coa_acc_group']['group_name']]['group_data'].push(
              this.param.ledger_data[i]
            );
          }
        }
      }
      if (this.param.ledger_data[i]['account_display']['display_section']['balanceSheet']['assets']) {
        if (!((tempAssetsGrouparr.indexOf(this.param.ledger_data[i]['coa_acc_group']['group_name'])) > -1)) {
          tempAssetsGrouparr.push(this.param.ledger_data[i]['coa_acc_group']['group_name']);

          if (this.param.ledger_data[i]['debit_data'].length > 0 && this.param.ledger_data[i]['debit_data'][0] && this.param.ledger_data[i]['debit_data'][0]['vc_credit']) {
            this.param['assets_group_data'][this.param.ledger_data[i]['coa_acc_group']['group_name']] = {
              group_name: this.param.ledger_data[i]['coa_acc_group']['group_name'],
              group_parent_name: this.param.ledger_data[i]['coa_acc_group']['group_parent_name'] ? this.param.ledger_data[i]['coa_acc_group']['group_parent_name'] : '',
              group_data: [this.param.ledger_data[i]]
            };
          }
        } else {
          if (this.param.ledger_data[i]['debit_data'].length > 0 && this.param.ledger_data[i]['debit_data'][0] && this.param.ledger_data[i]['debit_data'][0]['vc_credit']) {
            this.param['assets_group_data'][this.param.ledger_data[i]['coa_acc_group']['group_name']]['group_data'].push(
              this.param.ledger_data[i]
            );
          }
        }
      }
    }
    console.log(this.param);
  }

  checkBlankArray() {
    this.blankArr = [];
    this.debitRow = 0;
    this.creditRow = 0;
    this.debitRow = this.debitRow + this.debitSideBlankArr.length;
    this.creditRow = this.creditRow + this.creditSideBlankArr.length;
    if (this.debitRow > this.creditRow) {
      for (var i = 0; i < 2 * (this.debitRow - this.creditRow); i++) {
        this.blankArr.push(i);
      }
    } else if (this.creditRow > this.debitRow) {
      for (var i = 0; i < 2 * (this.creditRow - this.debitRow); i++) {
        this.blankArr.push(i);
      }
    }
    console.log(this.debitRow, this.creditRow);
  }


  getDeviation(param) {
    if (param) {
      this.debit_total_f = 0;
      this.credit_total_f = 0;
      this.deviation_f = 0;
      if ( param['debit_data']) {
      for (var i = 0; i < param['debit_data'].length; i++) {
        this.debit_total_f = this.debit_total_f + (param['debit_data'][i]['vc_credit'] ? param['debit_data'][i]['vc_credit'] : 0);
      } }
      if ( param['credit_data']) {
      for (var i = 0; i < param['credit_data'].length; i++) {
        this.credit_total_f = this.credit_total_f + (param['credit_data'][i]['vc_debit'] ? param['credit_data'][i]['vc_debit'] : 0);
      } }
      this.deviation_f = this.debit_total_f - this.credit_total_f;

      return this.deviation_f;
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
    creditSideTotal = creditSideTotal - Number(this.incomeExpenditureArray['head_total_amt']);
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
        if(this.param['ledger_data'][i]['account_display']['display_section']['balanceSheet']['assets']) {
        this.debitTotal = this.debitTotal + (this.param['ledger_data'][i]['debit_data'][j]['vc_credit'] ? this.param['ledger_data'][i]['debit_data'][j]['vc_credit'] : 0);
        }

      }
      for (var k = 0; k < this.param['ledger_data'][i]['credit_data'].length; k++) {
        if(this.param['ledger_data'][i]['account_display']['display_section']['balanceSheet']['liabilities']) {
        this.creditTotal = this.creditTotal + (this.param['ledger_data'][i]['credit_data'][k]['vc_debit'] ? this.param['ledger_data'][i]['credit_data'][k]['vc_debit'] : 0);
        }
      }

      diff = this.debitTotal - this.creditTotal;
      if (diff < 0) {
        diffTotal = diffTotal + diff;
        this.creditSideTotal = diffTotal;
        this.creditSideBlankArr.push(i);
      } else if (diff > 0) {
        diffCTotal = diffCTotal + diff;
        this.debitSideTotal = diffCTotal;
        this.debitSideBlankArr.push(i);
      }


    }
    this.creditSideTotal = this.creditSideTotal - Number(this.param['head_total_amt']);
    this.debitSideTotal = this.debitSideTotal + (Number(this.param['head_total_amt']) - Number(this.param['total_receipt_amt']));
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

}