
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './model';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { TitleCasePipe } from '@angular/common';
import { SisService, CommonAPIService, FaService } from '../../_services/index';
import { LedgerEntryModelComponent } from '../../fa-shared/ledger-entry-model/ledger-entry-model.component';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.scss']
})
export class BalanceSheetComponent implements OnInit {
  accountForm: FormGroup;
  accountsArray: any[] = [];
  ledgerArray: any[] = [];
  tableDivFlag = false;
  feeMonthArray: any[] = [];
  incomeExpenditureArray: any[] = [];
  prevIncomeExpenditureArray: any[] = [];
  assetsGroupArr = [];
  liabilitiesGroupArr = [];
  constructor(
    private fbuild: FormBuilder,
    private sisService: SisService,
    private commonAPIService: CommonAPIService,
    private faService: FaService,
    private dialog: MatDialog
  ) { }


  ngOnInit() {
    this.buildForm();
    this.getAccounts();
    this.getFeeMonths();
  }

  buildForm() {
    this.accountForm = this.fbuild.group({
      tb_month: ''
    })
  }

  getFeeMonths() {
    this.feeMonthArray = [];
    this.faService.getFeeMonths({}).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        //	console.log(result.data);
        this.feeMonthArray = result.data;
        // this.feeMonthArray.push({
        //   fm_id: 'consolidate',
        //   fm_name: 'Consolidated'
        // })
      }
    });
  }
  getAccounts() {
    this.faService.getAllChartsOfAccount({}).subscribe((data: any) => {
      if (data) {
        this.accountsArray = data;
      } else {
        this.accountsArray = [];
      }
    })
  }

  getIncomeAndExenditure() {
    if (this.accountForm.valid) {
      this.tableDivFlag = false;
      this.ledgerArray = [];
      var inputJson = {
        monthId: this.accountForm.value.tb_month,
        display_section: 'incomeExpenditure'
      };

      this.faService.getTrialBalance(inputJson).subscribe((data: any) => {
        if (data) {

          var receipt_data = data.receipt_data;
          var receiptArr = [];
          for (var j = 0; j < receipt_data.length; j++) {
            receiptArr.push(receipt_data[j]['tb_name']);
          }
          if (data.ledger_data.length > 0) {
            for (var i = 0; i < data.ledger_data.length; i++) {
              if (data.ledger_data[i]['coa_dependencies'] && receiptArr.indexOf(data.ledger_data[i]['coa_dependencies'][0]['dependency_name']) > -1) {
                var index = receiptArr.indexOf(data.ledger_data[i]['coa_dependencies'][0]['dependency_name']);

                var opening_balance = 0;
                if (data.ledger_data[i]['debit_data'] && data.ledger_data[i]['debit_data'][0] && data.ledger_data[i]['debit_data'][0]['vc_account_type'] === 'opening_balance') {
                  opening_balance = data.ledger_data[i]['debit_data'][0]['vc_account_type']['vc_debit'];
                }

                var receipt_value = receipt_data[index]['receipt_amt'];
                if (receipt_value > 0) {
                  var iJson: any = {
                    "vc_account_type": data.ledger_data[i]['coa_dependencies'][0]['dependency_name'],
                    "vc_credit": receipt_value + opening_balance

                  }
                  data.ledger_data[i]['debit_data'].push(iJson);
                  data.ledger_data[i]['credit_data'].push({});
                }
                if (receipt_value < 0) {
                  var iJson: any = {
                    "vc_account_type": data.ledger_data[i]['coa_dependencies'][0]['dependency_name'],
                    "vc_debit": receipt_value + opening_balance

                  }
                  data.ledger_data[i]['credit_data'].push(iJson);
                  data.ledger_data[i]['debit_data'].push({});
                }
              }
              if (i === data.ledger_data.length - 1) {
                this.incomeExpenditureArray = data;
                this.getBalanceSheet();
              }
            }
          } else {
            this.incomeExpenditureArray = data;
            this.getBalanceSheet();
          }

          // console.log('this.ledgerArray--', this.ledgerArray);



        } else {
          this.getBalanceSheet();
        }
      })
    }
  }

  getPreviousIncomeAndExenditure() {
    this.prevIncomeExpenditureArray=[];
    if (this.accountForm.valid && this.accountForm.value.tb_month) {
      var smId = this.accountForm.value.tb_month[0];
      var emId = this.accountForm.value.tb_month[this.accountForm.value.tb_month.length-1];
      // if (!((Number(smId) == 4) && (Number(emId) == 3))) {
      if (!(Number(smId) == 4)) {
      this.tableDivFlag = false;
      this.ledgerArray = [];

      let prevMonth = 0;
      // if (Number(this.accountForm.value.tb_month) == 1 || Number(this.accountForm.value.tb_month) == 2 || Number(this.accountForm.value.tb_month) == 3) {
      //   if (Number(this.accountForm.value.tb_month) == 1) {
      //     prevMonth = 12
      //   } else {
      //     prevMonth = Number(this.accountForm.value.tb_month) - 1;
      //   }
      // } else if (Number(this.accountForm.value.tb_month) > 4 && Number(this.accountForm.value.tb_month) <= 12) {
      //   prevMonth = Number(this.accountForm.value.tb_month) - 1;
      // }
      console.log('prevMonth--', prevMonth)
      var inputJson = {
        monthId: this.accountForm.value.tb_month,
        display_section: 'incomeExpenditure',
        foraccumulate: true
      };

      this.faService.getTrialBalance(inputJson).subscribe((data: any) => {
        if (data) {

          var receipt_data = data.receipt_data;
          var receiptArr = [];
          for (var j = 0; j < receipt_data.length; j++) {
            receiptArr.push(receipt_data[j]['tb_name']);
          }
          if (data.ledger_data.length > 0) {
            for (var i = 0; i < data.ledger_data.length; i++) {
              if (data.ledger_data[i]['coa_dependencies'] && receiptArr.indexOf(data.ledger_data[i]['coa_dependencies'][0]['dependency_name']) > -1) {
                var index = receiptArr.indexOf(data.ledger_data[i]['coa_dependencies'][0]['dependency_name']);

                var opening_balance = 0;
                if (data.ledger_data[i]['debit_data'] && data.ledger_data[i]['debit_data'][0] && data.ledger_data[i]['debit_data'][0]['vc_account_type'] === 'opening_balance') {
                  opening_balance = data.ledger_data[i]['debit_data'][0]['vc_account_type']['vc_debit'];
                }

                var receipt_value = receipt_data[index]['receipt_amt'];
                if (receipt_value > 0) {
                  var iJson: any = {
                    "vc_account_type": data.ledger_data[i]['coa_dependencies'][0]['dependency_name'],
                    "vc_credit": receipt_value + opening_balance

                  }
                  data.ledger_data[i]['debit_data'].push(iJson);
                  data.ledger_data[i]['credit_data'].push({});
                }
                if (receipt_value < 0) {
                  var iJson: any = {
                    "vc_account_type": data.ledger_data[i]['coa_dependencies'][0]['dependency_name'],
                    "vc_debit": receipt_value + opening_balance

                  }
                  data.ledger_data[i]['credit_data'].push(iJson);
                  data.ledger_data[i]['debit_data'].push({});
                }
              }
              if (i === data.ledger_data.length - 1) {
                this.prevIncomeExpenditureArray = data;

              }
            }
          } else {
            this.prevIncomeExpenditureArray = data;

          }

          // console.log('this.ledgerArray--', this.ledgerArray);



        } else {

        }
      })
    }
  }
  }

  getBalanceSheet() {
    if (this.accountForm.valid) {
      var inputJson = {
        monthId: this.accountForm.value.tb_month,
        display_section: 'balanceSheet',
        //coa_id:[185,116,117]
      };

      this.faService.getTrialBalance(inputJson).subscribe((data: any) => {
        if (data) {
          data['liabilities_group_data'] = [];
          data['assets_group_data'] = [];
          var receipt_data = data.receipt_data;
          var receiptArr = [];
          for (var j = 0; j < receipt_data.length; j++) {
            receiptArr.push(receipt_data[j]['tb_name']);
          }
          if (data && data.ledger_data && data.ledger_data.length > 0) {
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
                this.getGroupArray(data);
              }

            }

          } else {
            this.ledgerArray = data;
            this.tableDivFlag = true;
          }
          //console.log('this.ledgerArray--', this.ledgerArray);



        } else {

        }
      })
    }
  }

  getGroupArray(data) {
    var tempLiabilitiesGroupArr = [];
    var tempAssetsGrouparr = [];

    for (var i = 0; i < data.ledger_data.length; i++) {


      // if (data.ledger_data[i]['account_display']['display_section']['balanceSheet']['liabilities']) {

      //   if (data.ledger_data[i]['coa_acc_group']['group_parent_name']) {

      //     if ((((tempLiabilitiesGroupArr.indexOf(data.ledger_data[i]['coa_acc_group']['group_parent_name'])) < 0) && (data.ledger_data[i]['coa_acc_group']['group_parent_name']) != '')) {
      //       if(data.ledger_data[i]['coa_id'] ==151) {
      //         console.log(data.ledger_data[i]);
      //       }
      //       data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']] = [];
      //       data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']] = [];

      //       if (data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']]) {
      //         if(data.ledger_data[i]['coa_id'] ==151) {
      //           console.log(data.ledger_data[i]);
      //         }
      //         data.ledger_data[i]['total_dev'] = this.getDeviation( data.ledger_data[i]);
      //         if ( data.ledger_data[i]['total_dev'] != 0) {
      //         data.ledger_data[i]['expand'] = true;
      //         data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]); }
      //       } else {
      //         if(data.ledger_data[i]['coa_id'] ==151) {
      //           console.log(data.ledger_data[i]);
      //         }
      //         data.ledger_data[i]['total_dev'] = this.getDeviation( data.ledger_data[i]);
      //         if ( data.ledger_data[i]['total_dev'] != 0) {
      //         data.ledger_data[i]['expand'] = true;
      //         data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']] = [data.ledger_data[i]];}
      //       }
      //       tempLiabilitiesGroupArr.push(data.ledger_data[i]['coa_acc_group']['group_name']);
      //       tempLiabilitiesGroupArr.push(data.ledger_data[i]['coa_acc_group']['group_parent_name']);


      //     } else {
      //       if (((tempLiabilitiesGroupArr.indexOf(data.ledger_data[i]['coa_acc_group']['group_name'])) < 0)) {
      //         // console.log('iunn 236')
      //         if (data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']]) {
      //           data.ledger_data[i]['total_dev'] = this.getDeviation( data.ledger_data[i]);
      //           if ( data.ledger_data[i]['total_dev'] != 0) {
      //           data.ledger_data[i]['expand'] = true;
      //           // console.log(data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']]);
      //           data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]); }
      //         } else {
      //           data.ledger_data[i]['total_dev'] = this.getDeviation( data.ledger_data[i]);
      //           if ( data.ledger_data[i]['total_dev'] != 0) {
      //           data.ledger_data[i]['expand'] = true;
      //           data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']] = [data.ledger_data[i]]; }
      //         }

      //         tempLiabilitiesGroupArr.push(data.ledger_data[i]['coa_acc_group']['group_name']);
      //       } else {
      //         if (data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']] && data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']]) {
      //           data.ledger_data[i]['total_dev'] = this.getDeviation( data.ledger_data[i]);
      //           if ( data.ledger_data[i]['total_dev'] != 0) {
      //           data.ledger_data[i]['expand'] = true;
      //           // console.log( data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']]);
      //           data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);}
      //         } else {
      //           data.ledger_data[i]['total_dev'] = this.getDeviation( data.ledger_data[i]);
      //           if ( data.ledger_data[i]['total_dev'] != 0) {
      //           data.ledger_data[i]['expand'] = true;
      //           if (data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']]) {
      //             data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']] = [(data.ledger_data[i])];
      //           }

      //         }
      //         }
      //       }


      //     }



      //   } else {
      //     // console.log(data.ledger_data[i]['coa_acc_group']['group_name'], data.ledger_data[i]['coa_acc_name']);

      //     if (((tempLiabilitiesGroupArr.indexOf(data.ledger_data[i]['coa_acc_group']['group_name'])) > -1)) {

      //       if (data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_name']]) {
      //         data.ledger_data[i]['total_dev'] = this.getDeviation( data.ledger_data[i]);
      //         if ( data.ledger_data[i]['total_dev'] != 0) {
      //         data.ledger_data[i]['expand'] = true;
      //         data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]); }
      //       }

      //       tempLiabilitiesGroupArr.push(data.ledger_data[i]['coa_acc_group']['group_name']);
      //     } else {

      //       if (data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_name']] && data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_name']].length > 0) {
      //         data.ledger_data[i]['total_dev'] = this.getDeviation( data.ledger_data[i]);
      //         if ( data.ledger_data[i]['total_dev'] != 0) {
      //         data.ledger_data[i]['expand'] = true;
      //         data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]); }
      //       } else {
      //         data.ledger_data[i]['total_dev'] = this.getDeviation( data.ledger_data[i]);
      //         if ( data.ledger_data[i]['total_dev'] != 0) {
      //         data.ledger_data[i]['expand'] = true;
      //         data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_name']] = [data.ledger_data[i]]; }
      //       }
      //       tempLiabilitiesGroupArr.push(data.ledger_data[i]['coa_acc_group']['group_name']);

      //     }
      //   }

      // }
      if (data.ledger_data[i]['account_display']['display_section']['balanceSheet']['liabilities']) {
        if (data.ledger_data[i]['coa_acc_group']['group_parent_name']) {

          

          if ((((tempLiabilitiesGroupArr.indexOf(data.ledger_data[i]['coa_acc_group']['group_parent_name'])) < 0) && (data.ledger_data[i]['coa_acc_group']['group_parent_name']) != '')) {

            data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']] = [];

            if (data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']]) {

              data.ledger_data[i]['total_dev'] = this.getDeviation(data.ledger_data[i]);
              if (data.ledger_data[i]['total_dev'] != 0) {
                data.ledger_data[i]['expand'] = true;
                data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);
              }
            } else {

              data.ledger_data[i]['total_dev'] = this.getDeviation(data.ledger_data[i]);
              if (data.ledger_data[i]['total_dev'] != 0) {
                data.ledger_data[i]['expand'] = true;
                if (!(data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']])) {
                  data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']] = [];
                }
                data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);
              }
            }

            tempLiabilitiesGroupArr.push(data.ledger_data[i]['coa_acc_group']['group_parent_name']);
          } else {
            if (((tempLiabilitiesGroupArr.indexOf(data.ledger_data[i]['coa_acc_group']['group_name'])) < 0)) {

              if ((data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']])) {

                if (data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']]) {
                  data.ledger_data[i]['total_dev'] = this.getDeviation(data.ledger_data[i]);
                  if (data.ledger_data[i]['total_dev'] != 0) {
                    data.ledger_data[i]['expand'] = true;
                    data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);
                  }
                } else {

                  data.ledger_data[i]['total_dev'] = this.getDeviation(data.ledger_data[i]);
                  if (data.ledger_data[i]['total_dev'] != 0) {
                    data.ledger_data[i]['expand'] = true;
                    if (!(data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']])) {
                      data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']] = [];
                    }
                    data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);
                  }
                }
              } else {

                if (!(data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']])) {
                  data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']] = [];
                }
                data.ledger_data[i]['total_dev'] = this.getDeviation(data.ledger_data[i]);
                    if (data.ledger_data[i]['total_dev'] != 0) {
                      data.ledger_data[i]['expand'] = true;
                    }
                if (!(data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']])) {
                  data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']] = [];
                  data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);
                }

                tempLiabilitiesGroupArr.push(data.ledger_data[i]['coa_acc_group']['group_parent_name']);
              }



            } else {
              if ((data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']])) {
                if (data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']]) {
                  data.ledger_data[i]['total_dev'] = this.getDeviation(data.ledger_data[i]);
                  if (data.ledger_data[i]['total_dev'] != 0) {
                    data.ledger_data[i]['expand'] = true;

                    if ((data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']])) {
                      data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);
                    }
                  } else {
                    data.ledger_data[i]['total_dev'] = this.getDeviation(data.ledger_data[i]);
                    if (data.ledger_data[i]['total_dev'] != 0) {
                      data.ledger_data[i]['expand'] = true;
                    }
                    if (!(data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']])) {
                      data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']] = [];
                    }
                    data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);
                  }
                } else {
                  data.ledger_data[i]['total_dev'] = this.getDeviation(data.ledger_data[i]);
                  if (data.ledger_data[i]['total_dev'] != 0) {
                    data.ledger_data[i]['expand'] = true;
                    if (!(data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']])) {
                      data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']] = [];
                    }
                    data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);
                  }
                }
              } else {

                tempLiabilitiesGroupArr.push(data.ledger_data[i]['coa_acc_group']['group_parent_name']);
              }
            }

          }

        } else {

          if (((tempLiabilitiesGroupArr.indexOf(data.ledger_data[i]['coa_acc_group']['group_name'])) > -1)) {
            if (data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_name']]) {
              data.ledger_data[i]['total_dev'] = this.getDeviation(data.ledger_data[i]);
              if (data.ledger_data[i]['total_dev'] != 0) {
                data.ledger_data[i]['expand'] = true;
                data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);
              }
            }

            tempLiabilitiesGroupArr.push(data.ledger_data[i]['coa_acc_group']['group_name']);
          } else {

            if (data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_name']]) {
              data.ledger_data[i]['total_dev'] = this.getDeviation(data.ledger_data[i]);
              if (data.ledger_data[i]['total_dev'] != 0) {
                data.ledger_data[i]['expand'] = true;
                data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_name']].push([data.ledger_data[i]]);
              }
            } else {
              data.ledger_data[i]['total_dev'] = this.getDeviation(data.ledger_data[i]);
              if (data.ledger_data[i]['total_dev'] != 0) {
                data.ledger_data[i]['expand'] = true;

                if (!(data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_name']])) {
                  data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_name']] = [];

                }
                data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);

              }
              tempLiabilitiesGroupArr.push(data.ledger_data[i]['coa_acc_group']['group_name']);
            }


          }
        }
      }
      if (data.ledger_data[i]['account_display']['display_section']['balanceSheet']['assets']) {
        if (data.ledger_data[i]['coa_acc_group']['group_parent_name']) {
         

          if ((((tempAssetsGrouparr.indexOf(data.ledger_data[i]['coa_acc_group']['group_parent_name'])) < 0) && (data.ledger_data[i]['coa_acc_group']['group_parent_name']) != '')) {

            data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']] = [];

            if (data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']]) {

              data.ledger_data[i]['total_dev'] = this.getDeviation(data.ledger_data[i]);
              if (data.ledger_data[i]['total_dev'] != 0) {
                data.ledger_data[i]['expand'] = true;

                data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);
                
              }
            } else {

              data.ledger_data[i]['total_dev'] = this.getDeviation(data.ledger_data[i]);
              if (data.ledger_data[i]['total_dev'] != 0) {
                data.ledger_data[i]['expand'] = true;
                if (!(data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']])) {
                  data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']] = [];
                }
                data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);
                
              }
            }

            tempAssetsGrouparr.push(data.ledger_data[i]['coa_acc_group']['group_parent_name']);
          } else {
            if (((tempAssetsGrouparr.indexOf(data.ledger_data[i]['coa_acc_group']['group_name'])) < 0)) {

              if ((data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']])) {

                if (data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']]) {
                  data.ledger_data[i]['total_dev'] = this.getDeviation(data.ledger_data[i]);
                  if (data.ledger_data[i]['total_dev'] != 0) {
                    data.ledger_data[i]['expand'] = true;
                    data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);
                    
                  }
                } else {

                  data.ledger_data[i]['total_dev'] = this.getDeviation(data.ledger_data[i]);
                  if (data.ledger_data[i]['total_dev'] != 0) {
                    data.ledger_data[i]['expand'] = true;
                    if (!(data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']])) {
                      data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']] = [];
                    }
                    data.ledger_data[i]['total_dev'] = this.getDeviation(data.ledger_data[i]);
                    if (data.ledger_data[i]['total_dev'] != 0) {
                      data.ledger_data[i]['expand'] = true;
                    }
                    data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);
                    
                  }
                }
              } else {

                if (!(data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']])) {
                  data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']] = [];
                }
                if (!(data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']])) {
                  data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']] = [];
                  data.ledger_data[i]['total_dev'] = this.getDeviation(data.ledger_data[i]);
                    if (data.ledger_data[i]['total_dev'] != 0) {
                      data.ledger_data[i]['expand'] = true;
                    }
                  data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);
                  
                }

                tempAssetsGrouparr.push(data.ledger_data[i]['coa_acc_group']['group_parent_name']);
              }



            } else {
              if ((data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']])) {
                if (data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']]) {
                  data.ledger_data[i]['total_dev'] = this.getDeviation(data.ledger_data[i]);
                  if (data.ledger_data[i]['total_dev'] != 0) {
                    data.ledger_data[i]['expand'] = true;

                    if ((data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']])) {
                      data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);
                      
                    }
                  } else {
                    if (!(data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']])) {
                      data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']] = [];
                    }
                    data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);
                    
                  }
                } else {
                  data.ledger_data[i]['total_dev'] = this.getDeviation(data.ledger_data[i]);
                  if (data.ledger_data[i]['total_dev'] != 0) {
                    data.ledger_data[i]['expand'] = true;
                    if (!(data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']])) {
                      data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']] = [];
                    }
                    data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);
                    
                  }
                }
              } else {

                tempAssetsGrouparr.push(data.ledger_data[i]['coa_acc_group']['group_parent_name']);
              }
            }

          }

        } else {

          if (((tempAssetsGrouparr.indexOf(data.ledger_data[i]['coa_acc_group']['group_name'])) > -1)) {
            if (data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_name']]) {
              data.ledger_data[i]['total_dev'] = this.getDeviation(data.ledger_data[i]);
              if (data.ledger_data[i]['total_dev'] != 0) {
                data.ledger_data[i]['expand'] = true;
                data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);
              }
            }
            
            tempAssetsGrouparr.push(data.ledger_data[i]['coa_acc_group']['group_name']);
          } else {
            
            if (data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_name']]) {
              data.ledger_data[i]['total_dev'] = this.getDeviation(data.ledger_data[i]);
              if (data.ledger_data[i]['total_dev'] != 0) {
                data.ledger_data[i]['expand'] = true;
                data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_name']].push([data.ledger_data[i]]);
              }
            } else {
              
              data.ledger_data[i]['total_dev'] = this.getDeviation(data.ledger_data[i]);
              if (data.ledger_data[i]['total_dev'] != 0) {
                data.ledger_data[i]['expand'] = true;

                if (!(data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_name']])) {
                  data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_name']] = [];

                }
                data['assets_group_data'][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);

              }
              tempAssetsGrouparr.push(data.ledger_data[i]['coa_acc_group']['group_name']);
            }


          }
        }



        // } else {

        //   if (data.ledger_data[i]['coa_acc_group']['group_parent_name']) {
        //     console.log('in--');
        //     if ( (((tempLiabilitiesGroupArr.indexOf(data.ledger_data[i]['coa_acc_group']['group_parent_name'])) > 0) && (data.ledger_data[i]['coa_acc_group']['group_parent_name']) != '')) {
        //     data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_parent_name']][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);}
        //   } else {
        //     data['liabilities_group_data'][data.ledger_data[i]['coa_acc_group']['group_name']].push(data.ledger_data[i]);
        //   }
        // }


        //console.log(" data['liabilities_group_data']", tempLiabilitiesGroupArr, tempAssetsGrouparr);
      }

      if (i === data.ledger_data.length - 1) {
        var assetsArr = [];
        var liabilitiesArr = [];

        for (var key in data.assets_group_data) {
          var subassetsArr = [];
          for (var key1 in data.assets_group_data[key]) {
            subassetsArr.push(data.assets_group_data[key][key1]);
          }
          assetsArr.push(subassetsArr);
        }
        for (var key in data.liabilities_group_data) {
          var sublibalietiesArr = [];
          for (var key1 in data.liabilities_group_data[key]) {
            sublibalietiesArr.push(data.liabilities_group_data[key][key1]);
          }
          liabilitiesArr.push(sublibalietiesArr);
        }
        data['assets_group_data'] = assetsArr;
        data['liabilities_group_data'] = liabilitiesArr;
        this.ledgerArray = data;
        this.tableDivFlag = true;
        //  console.log('data--', data);
      }
    }

  }

  getDeviation(param) {
    if (param) {
      let debit_total_f:any = 0;
      let credit_total_f:any = 0;
      let deviation_f = 0;
      // console.log('param--', param);


      if (param['debit_data']) {
        for (var i = 0; i < param['debit_data'].length; i++) {
          debit_total_f = parseFloat(debit_total_f.toString()) + (param['debit_data'][i]['vc_credit'] ? parseFloat(param['debit_data'][i]['vc_credit'].toString()) : 0);
          
        }
      }
      if (param['credit_data']) {
        for (var i = 0; i < param['credit_data'].length; i++) {
          credit_total_f = parseFloat(credit_total_f.toString()) + (param['credit_data'][i]['vc_debit'] ? parseFloat(param['credit_data'][i]['vc_debit'].toString()) : 0);
          
        }
      }
     
      deviation_f = debit_total_f - credit_total_f;
      
      if (param && param.account_display && param.account_display.display_section && param.account_display.display_section.balanceSheet.liabilities) {
        return -Number(deviation_f);
      } else {
        return Number(deviation_f);

      }

    }
  }





  openLedgerModal(value) {
    const dialogRef = this.dialog.open(LedgerEntryModelComponent, {
      height: '520px',
      width: '800px',
      data: {
        title: 'Create Account'
      }
    });
    dialogRef.afterClosed().subscribe(dresult => {
      //	console.log(dresult);
      this.getAccounts();
    });
  }

}