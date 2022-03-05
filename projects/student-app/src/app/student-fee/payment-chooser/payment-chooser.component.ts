import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-payment-chooser',
  templateUrl: './payment-chooser.component.html',
  styleUrls: ['./payment-chooser.component.css']
})
export class PaymentChooserComponent implements OnInit {
  settings: any[] = [];
  @ViewChild('provider') provider;
  chosenBank: any = '';
  @Output() confirm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  selectedIndex = '';
  dialogRef: MatDialogRef<PaymentChooserComponent>;
  formGroupArray: any[] = [];
  constructor(private erp: ErpCommonService, private fbuild: FormBuilder,
    public dialog: MatDialog,
    private common: CommonAPIService,
  ) { }

  openModal() {
    this.chosenBank = '';
    this.dialogRef = this.dialog.open(this.provider, {
      height: '60vh',
      width: '60vh',
      position: {
        top: '20px'
      }
    });
    this.getGlobalSetting();
  }
  ngOnInit() {
  }
  getGlobalSetting() {
    this.formGroupArray = [];
    this.erp.getGlobalSetting({ "gs_alias": "payment_banks" }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.settings = (result.data[0] && result.data[0]['gs_value']) ? JSON.parse(result.data[0] && result.data[0]['gs_value']) : [];
        console.log("pg settings >>>>>>>>>>>>>>>>>>>",this.settings);
        for (const item of this.settings) {
          if (item.enabled == 'true') {
            this.formGroupArray.push({
              formGroup: this.fbuild.group({
                'bank': ''
              }),
              bank_name: item.bank_name,
              trans_bnk_id: item.trans_bnk_id
            });
          }

        }
      }
    });
  }
  closeDialog() {
    this.resetForm();
    this.dialogRef.close();
  }
  resetForm() {
    for (const item of this.formGroupArray) {
      item.formGroup.patchValue({
        bank: ''
      });
    }
  }
  chooseBank(item, index) {
    // console.log("formGroupArray bank >>>>>", this.formGroupArray, "-----", index);
    
    let j = 0;
    this.chosenBank = item.bank_alias;
    for (const i of this.formGroupArray) {
      if (i.trans_bnk_id && index === i.trans_bnk_id) {
        i.formGroup.patchValue({
          bank: this.chosenBank
        });
        console.log("choosen bank >>>>>", i, "-----", index);
      } else {
        i.formGroup.patchValue({
          bank: ''
        });
      }
      j++;
    }
    console.log("formGroupArray bank >>>>>", this.formGroupArray, "-----", index);

  }
  closeDialog2() {
    let counter = 0;
    // for (const item of this.formGroupArray) {
    //   if (!item.formGroup.value.bank) {
    //     counter++;
    //   } else {
    //     break;
    //   }
    // }
    if (!this.chosenBank) {
      this.common.showSuccessErrorMessage('Please select a provider', 'error');
    } else {
      this.confirm.emit({bank: this.chosenBank});
      this.closeDialog();
    }
  }

}
