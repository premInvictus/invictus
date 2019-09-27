import { Component, OnInit } from '@angular/core';
import { ErpCommonService } from 'src/app/_services';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-rfid-printing',
  templateUrl: './rfid-printing.component.html',
  styleUrls: ['./rfid-printing.component.css']
})
export class RfidPrintingComponent implements OnInit {
  bookData: any[] = [];
  formGroupArray: any[] = [];
  finalDataArray: any[] = [];
  constructor(private common: ErpCommonService, private fbuild: FormBuilder) { }
  ngOnInit() {
    this.getReservoirData();
  }
  getReservoirData() {
    this.common.getReservoirData({}).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.bookData = [];
        this.bookData = res.data;
        for (const item of this.bookData) {
          this.formGroupArray.push({
            formGroup: this.fbuild.group({
              reserv_id: item.reserv_id,
              rfid: item.rfid ? item.rfid : ''
            })
          });
        }
      }
    });
  }
  finalSubmit() {
    this.finalDataArray = [];
    for (const item of this.formGroupArray) {
      this.finalDataArray.push(item.formGroup.value);
    }
      this.common.updateRFIDMapping({rfid_data: this.finalDataArray}).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          this.getReservoirData();
        }
      });
  }

}
