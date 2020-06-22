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
import {SelectionModel} from '@angular/cdk/collections'; 

@Component({
  selector: 'app-voucher-ref-modal',
  templateUrl: './voucher-ref-modal.component.html',
  styleUrls: ['./voucher-ref-modal.component.css']
})
export class VoucherRefModalComponent implements OnInit {

  selection = new SelectionModel<Element>(true, []);
  currentTabIndex = 2;
  dtotal = 0;
  ctotal = 0;
  attachmentArray: any[] = [];
  voucherData: any;
  tableDivFlag = false;
  ELEMENT_DATA: Element[];
  displayedColumns: string[] = [
    'select',
    'vc_code',
    'vc_date',
    'vc_amount',
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
    if(this.data.refData){
      this.currentTabIndex = this.data.refData.currentTabIndex;
    }
    this.buildForm();
    this.getSattleJV();
  }
  buildForm() {}

  closeDialog() {
    this.dialogRef.close();
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Element): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.vc_code}`;
  }
  getSattleJV(){
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.faService.getSattleJV(this.data.param).subscribe((data:any)=>{
      if(data) {
        console.log(data);
        for(const item of data){
          this.ELEMENT_DATA.push({
            vc_code:item.vc_number.vc_name,
            vc_date:item.vc_date,
            vc_amount:this.getAmt(item.vc_particulars_data),
            vc_amount_type:''
          })
        }
        this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
        if(this.data.refData && this.data.refData.currentTabIndex == 2 && this.data.refData.selection.length > 0){
          this.data.refData.selection.forEach(element => {
            const edata = this.ELEMENT_DATA.find(e => e.vc_code == element);
            if(edata){
              this.selection.selected.push(edata);
            }
          });
          console.log(this.selection);
        }
        this.commonAPIService.showSuccessErrorMessage('Fetched Successfully', 'success');
      } else {
        this.commonAPIService.showSuccessErrorMessage('Error to fetch', 'error');
      }
    });
  }
  setIndex(event) {
		console.log(event);
		this.currentTabIndex = event;
  }
  getAmt(value){
    let amt = 0;
    for(const item of value){
      amt += Number(item.vc_debit)
    }
    return amt;
  }
  refsubmit() {
    console.log(this.selection);
    this.dialogRef.close({
      currentTabIndex:this.currentTabIndex,
      selection:this.selection.selected.map(e => e.vc_code)
    })
  }

}
