import { Component, OnInit, Inject, Input, OnChanges } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import {
  SisService,
  CommonAPIService,
  SmartService,
  FaService,
} from "../../_services";
import { forEach } from "@angular/router/src/utils/collection";
import { Element } from "./model";
import {
  MatTableDataSource,
  MatPaginator,
  PageEvent,
  MatSort,
  MatPaginatorIntl,
} from "@angular/material";

@Component({
  selector: 'app-voucher-ref-modal',
  templateUrl: './voucher-ref-modal.component.html',
  styleUrls: ['./voucher-ref-modal.component.css']
})
export class VoucherRefModalComponent implements OnInit {

  dtotal = 0;
  ctotal = 0;
  attachmentArray: any[] = [];
  voucherData: any;
  tableDivFlag = false;
  ELEMENT_DATA: Element[];
  displayedColumns: string[] = [
    // "srno",
    "account_code",
    "account",
    "particular",
    "debit",
    "credit",
  ];
  dataSource = new MatTableDataSource<Element>();
  constructor(
    public dialogRef: MatDialogRef<VoucherRefModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fbuild: FormBuilder,
    private fb: FormBuilder,
    private commonAPIService: CommonAPIService,
    private faService: FaService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    console.log(this.data);
    this.buildForm();
    this.getSattleJV();
  }
  buildForm() {}

  closeDialog() {
    this.dialogRef.close();
  }
  getSattleJV(){
    this.faService.getSattleJV(this.data.param).subscribe((data:any)=>{
      if(data) {
        console.log(data);
        this.commonAPIService.showSuccessErrorMessage('Fetched Successfully', 'success');
      } else {
        this.commonAPIService.showSuccessErrorMessage('Error to fetch', 'error');
      }
    });
  }

}
