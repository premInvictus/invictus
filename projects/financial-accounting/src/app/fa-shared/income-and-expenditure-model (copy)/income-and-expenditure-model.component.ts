import { Component, OnInit, Inject, Input, OnChanges } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { SisService, CommonAPIService, SmartService, FaService } from '../../_services';
import { forEach } from '@angular/router/src/utils/collection';
import { LedgerEntryModelComponent } from '../../fa-shared/ledger-entry-model/ledger-entry-model.component';

@Component({
  selector: 'app-income-and-expenditure-model',
  templateUrl: './income-and-expenditure-model.component.html',
  styleUrls: ['./income-and-expenditure-model.component.css']
})
export class IncomeAndExpenditureModalComponent implements OnInit {

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
  @Input() param: any;
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
    this.checkPartialPaymentStatus();
  }
  buildForm() {
  }
  ngOnChanges() {
    this.checkPartialPaymentStatus();
    console.log(this.param);
    this.creditSideTotal = 0;
    this.debitSideTotal = 0;


  }


  checkPartialPaymentStatus() {
    let param1: any = {};
    param1.gs_alias = ['fa_partial_payment'];
    this.faService.getGlobalSetting(param1).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        if (result.data && result.data[0]) {
          this.partialPaymentStatus = Number(result.data[0]['gs_value']);
          console.log('this.partialPaymentStatus--', this.partialPaymentStatus);
          this.getTotal(this.param);
        }

      }
    })
  }

  checkBlankArray(param) {
    this.blankArr = [];
    this.debitRow = 0;
    console.log(this.partialPaymentStatus);
    this.creditRow = this.partialPaymentStatus ? (param['invoice_due_data'].length > 0 ? param['invoice_due_data'].length + 1 : 0) : 0;
    // if (this.debitSideTotal != this.creditSideTotal) {
    this.debitRow = (this.debitSideTotal < this.creditSideTotal) ? this.debitRow + this.debitSideBlankArr.length - 1 : this.debitRow + this.debitSideBlankArr.length;
    // this.creditRow = (this.debitSideTotal > this.creditSideTotal) ? this.creditRow + this.creditSideBlankArr.length -1 : this.creditRow + this.creditSideBlankArr.length;
    // }

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


  getDeviation(param) {
    if (param) {
      this.debit_total_f = 0;
      this.credit_total_f = 0;
      this.deviation_f = 0;
      for (var i = 0; i < param['debit_data'].length; i++) {
        this.debit_total_f = this.debit_total_f + (param['debit_data'][i]['vc_credit'] ? param['debit_data'][i]['vc_credit'] : 0);
      }
      for (var i = 0; i < param['credit_data'].length; i++) {
        this.credit_total_f = this.credit_total_f + (param['credit_data'][i]['vc_debit'] ? param['credit_data'][i]['vc_debit'] : 0);
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
        this.debitTotal = this.debitTotal + (param['ledger_data'][i]['debit_data'][j]['vc_credit'] ? param['ledger_data'][i]['debit_data'][j]['vc_credit'] : 0);
      }
      for (var k = 0; k < param['ledger_data'][i]['credit_data'].length; k++) {
        this.creditTotal = this.creditTotal + (param['ledger_data'][i]['credit_data'][k]['vc_debit'] ? param['ledger_data'][i]['credit_data'][k]['vc_debit'] : 0);
      }

      diff = this.creditTotal - this.debitTotal;
      if (diff > 0) {
        diffTotal = diffTotal + diff;
        this.creditSideTotal = diffTotal;
        this.creditSideBlankArr.push(i);
      } else if (diff < 0) {
        diffCTotal = diffCTotal + diff;
        this.debitSideTotal = diffCTotal;
        this.debitSideBlankArr.push(i);
      }


    }
    this.creditSideTotal = this.creditSideTotal - (this.partialPaymentStatus ? Number(param['head_total_amt']) : 0);
    this.debitSideTotal = this.debitSideTotal;

    console.log('debitSideTotal', this.debitSideTotal);
    console.log('creditSideTotal', this.creditSideTotal);
    this.checkBlankArray(this.param);
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

}
