import { Component, OnInit, Inject, Input, OnChanges } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormGroup, FormArray, FormBuilder, Validators,FormControl } from "@angular/forms";
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
import * as moment from 'moment';
@Component({
  selector: 'app-voucher-ref-modal',
  templateUrl: './voucher-ref-modal.component.html',
  styleUrls: ['./voucher-ref-modal.component.css']
})
export class VoucherRefModalComponent implements OnInit {

  selection = new SelectionModel<Element>(true, []);
  vc_invoiceno = new FormControl()
  vc_grno = new FormControl()
  vc_chequeno = new FormControl();
  vc_chequedate = new FormControl();
  currentTabIndex = 2;
  dtotal = 0;
  ctotal = 0;
  attachmentArray: any[] = [];
  voucherData: any;
  tableDivFlag = false;
  ELEMENT_DATA: Element[]  = [];
  displayedColumns: string[] = [
    'select',
    'vc_code',
    'vc_date',
    'vc_amount',
  ];
  displayedColumns1: string[] = [
    'vc_code',
    'vc_date',
    'vc_amount',
    'action'
  ];
  orderMaster: any[] = [];
  sattleJVList:any[] = [];
  dataSource = new MatTableDataSource<Element>();
  dataSource1 = new MatTableDataSource<Element>();
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
    if(this.currentTabIndex == 2 && this.data.refData && this.data.refData.update == true) {
    this.sattleJVList = this.data.refData.selected;
    this.sattleJVPrepare();
    } else if(this.currentTabIndex == 0){
      this.vc_grno.setValue(this.data.refData.selection);
    } else if(this.currentTabIndex == 1){
      this.vc_invoiceno.setValue(this.data.refData.selection);
    }
    
    this.buildForm();
    this.getSattleJV();
  }
  sattleJVPrepare(){
    this.dataSource1 = new MatTableDataSource<Element>(this.sattleJVList);
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
        console.log(this.dataSource.data)
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
    console.log('this.data.param--',this.data.param)
    this.faService.getSattleJV(this.data.param).subscribe((data:any)=>{
      if(data) {
        console.log(data);
        for(const item of data){
          this.ELEMENT_DATA.push({
            vc_id:item.vc_id,
            vc_code:item.vc_number.vc_name,
            vc_date:item.vc_date,
            vc_amount:this.getAmt(item.vc_particulars_data, item),
            vc_amount_type:'',
            va_particulars_detail: this.getParticularsDetail(item.vc_particulars_data, item)
          })
        }
        this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
        // if(this.data.refData && this.data.refData.currentTabIndex == 2 && this.data.refData.selected.length > 0){
        //   this.dataSource.data.forEach(row => {
        //     const findex = this.data.refData.selected.findIndex(e => e.vc_id == row.vc_id);
        //     if(findex != -1){
        //       this.selection.select(row)
        //     }            
        //   });
        //   console.log(this.selection);
        // }
       
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
  getOrderMaster(event=null){
		
		if(event){
			console.log('key',event.keyCode);
			if(event.keyCode != 38 && event.keyCode != 40 ){
				let param: any = {};
				param.pm_type = 'GR'
				if(event) {
					param.pm_id = event.target.value
				}
				this.faService.getOrderMaster(param).subscribe((data:any)=>{
					if(data) {
						this.orderMaster = data;
						console.log('getOrderMaster',data);
					}												
				});
			}
		} else {
			let param: any = {};
			param.pm_type = 'GR'
			if(event) {
				param.pm_id = event.target.value
			}
			this.faService.getOrderMaster(param).subscribe((data:any)=>{
				if(data) {
					this.orderMaster = data;
					console.log('getOrderMaster',data);
				}												
			});	
		}
	}
  getAmt(value, item){
    let amt = 0;
    for(const item of value){
      if(item.vc_account_type_id === this.data.param.coa_id) {
      amt += Number(item.vc_credit)}
    }
    return amt;
  }

  getParticularsDetail(value, item) {
    let pstr = '';

    for(const item of value){
      if(item.vc_account_type_id === this.data.param.coa_id) {
        pstr = item.vc_particulars;
      }
    }
    return pstr;
  }
  refsubmit() {
    console.log(this.selection);
    const item:any = {};
    if(this.currentTabIndex == 0){
      item.currentTabIndex=this.currentTabIndex;
      item.selection=this.vc_grno.value;
      item.update=this.data.refData&&this.data.refData.update ? this.data.refData.update : false;
    } else if(this.currentTabIndex == 1){
      item.currentTabIndex=this.currentTabIndex;
      item.selection=this.vc_invoiceno.value;
      item.update=this.data.refData&&this.data.refData.update ? this.data.refData.update : false;
    } else if(this.currentTabIndex == 2 && this.selection.selected.length > 0){
      const tselection = this.selection.selected.map(e => e.vc_code);
      const tParticulars  =this.selection.selected.map(e => e.va_particulars_detail);
      if(this.sattleJVList.length > 0){
        this.sattleJVList.forEach(element => {
          // const ti = this.selection.selected.findIndex(e => e.vc_id == element.vc_id);
          // if(ti == -1) {            
          // }
          tselection.push(element.vc_code);
          tParticulars.push(element.vc_particulars_detail);
          
        });
      }
      let tamount=this.selection.selected.reduce((a,b) => a+b.vc_amount,0);
      if(this.sattleJVList.length > 0){
        this.sattleJVList.forEach(element => {
          tamount += element.vc_amount
        });
      }
      let tselected=this.selection.selected;
      if(this.sattleJVList.length > 0){
        this.sattleJVList.forEach(element => {
          tselected.push(element)
        });
      }

      item.currentTabIndex=this.currentTabIndex;
      item.selection=tselection
      item.particularsDetails= tParticulars;
      item.update=this.data.refData&&this.data.refData.update ? this.data.refData.update : false;
      item.amount=tamount;
      item.particularsDetails=tParticulars;
      item.selected=tselected;
    } else if(this.currentTabIndex == 3) {
      item.currentTabIndex=this.currentTabIndex;
      item.vc_chequeno=this.vc_chequeno.value;
      item.vc_chequedate=this.vc_chequedate.value.format("YYYY-MM-DD");
      item.update=this.data.refData&&this.data.refData.update ? this.data.refData.update : false;
    }
    this.dialogRef.close(item);
  }
  deleteVoucherEntry(value){
    console.log('vjal',value);
    if(value){
      const param:any = {};
      if(value.vc_id){
        param.vc_id= value.vc_id;
      }
      param.vc_sattle_status = 1;
      this.faService.changeSattleStatus(param).subscribe((data:any)=>{
				if(data) {
          console.log('data',data);
          this.getSattleJV();
          const findex = this.sattleJVList.findIndex(e => e.vc_id == value.vc_id);
          this.sattleJVList.splice(findex,1);
          this.commonAPIService.showSuccessErrorMessage('Unsattled Successfuly','success');
				}												
			});
      
    }
  }
  setDate() {
    
  }
  // isSelected(row){
  //   const findex = this.selection.selected.findIndex(e => e.vc_id = row.vc_id);
  //   if(findex == -1){
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

}
