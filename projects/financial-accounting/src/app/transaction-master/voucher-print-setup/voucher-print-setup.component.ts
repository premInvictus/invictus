import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FaService, CommonAPIService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-voucher-print-setup',
  templateUrl: './voucher-print-setup.component.html',
  styleUrls: ['./voucher-print-setup.component.css']
})
export class VoucherPrintSetupComponent implements OnInit {

  voucher_printsetup: any[] = [];
  paramform: FormGroup;
  pageSize: any[] = [{id:'A4', name:'A4'},{id:'A5', name:'A5'}];
  pageOreintation: any[] = [{id:'P', name:'Portrait'},{id:'L', name:'Landscape'}];
  fontSize: any[] = [5,6,7,8,9,10,11,12];
  pageMargin: any[] = [0,1,2,3,4,5,6,7,8,9,10,11,12];
  
  
  constructor(
    public dialogRef: MatDialogRef<VoucherPrintSetupComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private faService:FaService,
    private commonAPIService: CommonAPIService,
    public fbuild: FormBuilder
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.buildForm();
    this.getGlobalSetting();
  }
  buildForm(){
    this.paramform = this.fbuild.group({
      page_size: '',
      font_size: '',
      page_margin_left:'',
      page_margin_top:'',
      page_margin_right:'',
      page_margin_bottom:'',
      page_orientation: ''
    })
  }
  
  setPrintSetup(){
    
      this.paramform.setValue({
        page_size: this.voucher_printsetup[0].page_size,
        font_size: this.voucher_printsetup[0].font_size,
        page_margin_left: this.voucher_printsetup[0].page_margin_left,
        page_margin_top: this.voucher_printsetup[0].page_margin_top,
        page_margin_right: this.voucher_printsetup[0].page_margin_right,
        page_margin_bottom: this.voucher_printsetup[0].page_margin_bottom,
        page_orientation: this.voucher_printsetup[0].page_orientation
      })
    
  }
  getGlobalSetting() {
    let param: any = {};
    param.gs_alias = ['voucher_printsetup'];
    this.faService.getGlobalSettingReplace(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        const settings = result.data;
        settings.forEach(element => {
          if (element.gs_alias === 'voucher_printsetup') {
            this.voucher_printsetup = JSON.parse(element.gs_value);
          }
        });
      }
    })
  }
  closeDialog() {
    this.dialogRef.close();
  }
  submit(){
    
      this.voucher_printsetup = [];
      this.voucher_printsetup.push(this.paramform.value);
      
      console.log(this.voucher_printsetup);
      this.faService.updateGlobalSetting({'voucher_printsetup':JSON.stringify(this.voucher_printsetup)}).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
        } else {
          this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
        }
      });
  }

}
