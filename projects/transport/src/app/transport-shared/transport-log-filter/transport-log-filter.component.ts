import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CommonAPIService, SisService, AxiomService, TransportService } from '../../_services';

@Component({
  selector: 'app-transport-log-filter',
  templateUrl: './transport-log-filter.component.html',
  styleUrls: ['./transport-log-filter.component.scss']
})
export class TransportLogFilterComponent implements OnInit {
  generalFilterForm: FormGroup;
  bus_arr = [];
  op_arr = [{id:'$eq',value:'='}, {id:'$lt',value:'<'},{id:'$gt',value:'>'}]
  constructor(
    public dialogRef: MatDialogRef<TransportLogFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder,
    public commonService: CommonAPIService,
    public axiomService: AxiomService,
    public sisService: SisService,
    public transportService: TransportService
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getAllTransportVehicle();
  }
  buildForm() {
    this.generalFilterForm = this.fb.group({
      bus_id: '',
      from: '',
      to: '',
      amount: '',
      amount_op: ''
    })
  }
  getAllTransportVehicle() {
    this.bus_arr = [];
    this.transportService.getAllTransportVehicle({ status: '1' }).subscribe((result: any) => {
      if (result && result.length > 0) {
        this.bus_arr = result;
      }
    });
  }
  closeDialog(data = null): void {
    this.dialogRef.close(data);
  }
  submit() {
    if (this.generalFilterForm.value.from || this.generalFilterForm.value.to) {
      this.generalFilterForm.patchValue({
        from: new DatePipe('en-in').transform(this.generalFilterForm.value.from, 'yyyy-MM-dd'),
        to: new DatePipe('en-in').transform(this.generalFilterForm.value.to, 'yyyy-MM-dd')
      });
    };
    this.closeDialog(this.generalFilterForm.value);
  }
}
