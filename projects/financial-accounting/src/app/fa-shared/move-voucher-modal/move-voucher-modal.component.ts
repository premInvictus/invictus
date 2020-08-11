import { Component, OnInit, Inject, Input, OnChanges } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import {
  CommonAPIService,
  FaService,
} from "../../_services";

import {
  MatTableDataSource,
  MatPaginator,
  PageEvent,
  MatSort,
  MatPaginatorIntl,
} from "@angular/material";
@Component({
  selector: "app-move-voucher-modal",
  templateUrl: "./move-voucher-modal.component.html",
  styleUrls: ["./move-voucher-modal.component.css"],
})
export class MoveVoucherModalComponent implements OnInit {
  ses_data:any
  sessionArray: any[] = [];
  voucherData: any;
  sessionForm:FormGroup;
  currentUser:any;
  mData:any;
  constructor(
    public dialogRef: MatDialogRef<MoveVoucherModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fbuild: FormBuilder,
    private fb: FormBuilder,
    private commonAPIService: CommonAPIService,
    private faService: FaService,
    private dialog: MatDialog,
  ) {
    this.currentUser = localStorage.getItem('currentUser');
  }

  ngOnInit() {
    console.log(this.data);
    this.mData = JSON.parse(JSON.stringify(this.data));
    if (this.data.vc_id) {
      this.getVoucherData(this.data.vc_id);
    }
    this.buildForm();
    this.getSession();
  }
  buildForm() {
    this.sessionForm = this.fb.group({
      s_id: ''
    });

  }

  getSession() {
    this.faService.getSession().subscribe((data:any)=>{
      this.sessionArray = data.data;
    })
  }


  getVoucherData(voucherId) {
  
  }

  checkForMove(event) {
    this.ses_data = event.value ? this.sessionArray.find((obj)=>  obj.ses_id == event.value) : '';
    if (this.ses_data['ses_name']) {
      var sesStartDate = this.ses_data['ses_name'].split("-")[0]+"-04-01";
      var sesEndDate = this.ses_data['ses_name'].split("-")[1]+"-04-01";
      console.log(this.data.vc_date)
      if (this.data && this.data.vc_date 
          && (new Date(this.data.vc_date).getTime() >= new Date(sesStartDate).getTime())
          && (new Date(this.data.vc_date).getTime() <= new Date(sesEndDate).getTime())) {


            

      } else {
        this.commonAPIService.showSuccessErrorMessage("Selected Voucher is not the Range of Selected Financial Year, Please Update the date of Voucher First", "error");
      }
    }
    
  }

  submit() {


    let param: any = {};
    const tempDate = this.data.vc_date;
    param.vc_type = this.data.vc_type;
    param.vc_date = tempDate;

    this.faService.getVoucherTypeMaxId(param).subscribe((data: any) => {
      if (data) {
        var inputJson = this.data;
      
        var tempVcArr= this.data.vc_number.vc_name.split("/");
        tempVcArr[tempVcArr.length-1] = (data.vc_code.toString()).padStart(4, '0');
        delete inputJson['_id'];
        inputJson['vc_ses_id'] = this.ses_data['ses_id'].toString();
        inputJson['vc_number'] = {vc_code: data.vc_code, vc_name:tempVcArr.join("/")};
        console.log('inputJson=--', inputJson)
        this.faService.updateMoveVoucherEntry([inputJson]).subscribe((data: any) => {
          if (data) {
            this.commonAPIService.showSuccessErrorMessage('Voucher entry Updated Successfully', 'success');
             var fJson = {
              vc_id: this.mData.vc_id,
              mvc_from_ses:this.mData.vc_ses_id,
              mvc_to_ses:this.ses_data['ses_id'],
              mvc_created_by: this.currentUser,
             };
             this.faService.insertMoveVoucherCodeLog(fJson).subscribe((data:any) => {

             })
           
           
            this.dialogRef.close();
          } else {
            this.commonAPIService.showSuccessErrorMessage('Error While Updating Voucher Entry', 'error');
          }
        });

      console.log(this.data);
      }
    });

  }

  closeDialog() {
    this.dialogRef.close();
  }
  
}
