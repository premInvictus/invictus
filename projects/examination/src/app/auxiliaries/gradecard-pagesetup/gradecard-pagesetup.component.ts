import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SmartService, CommonAPIService, ExamService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-gradecard-pagesetup',
  templateUrl: './gradecard-pagesetup.component.html',
  styleUrls: ['./gradecard-pagesetup.component.css']
})
export class GradecardPagesetupComponent implements OnInit {

  gradecard_printsetup: any[] = [];
  paramform: FormGroup;
  classArray: any[] = [];
  pageSize: any[] = [{id:'A4', name:'A4'},{id:'A3', name:'A3'}];
  pageOreintation: any[] = [{id:'P', name:'Portrate'},{id:'L', name:'Landscape'}];
  fontSize: any[] = [5,6,7,8,9,10,11,12];
  pageMargin: any[] = [0,1,2,3,4,5,6,7,8,9,10,11,12];
  
  
  constructor(
    public dialogRef: MatDialogRef<GradecardPagesetupComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private examService: ExamService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    public fbuild: FormBuilder
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.buildForm();
    this.getClass();
    this.getGlobalSetting();
  }
  buildForm(){
    this.paramform = this.fbuild.group({
      class_id:'',
      page_size: '',
      font_size: '',
      page_margin_left:'',
      page_margin_top:'',
      page_margin_right:'',
      page_margin_bottom:'',
      page_orientation: ''
    })
  }
  getClass() {
    this.classArray = [];
    this.smartService.getClassData({ class_status: '1' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.classArray = result.data;
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  setPrintSetup(){
    const index = this.gradecard_printsetup.findIndex(e => e.class_id === this.paramform.value.class_id);
    if(index !== -1) {
      this.paramform.setValue({
        class_id: this.gradecard_printsetup[index].class_id,
        page_size: this.gradecard_printsetup[index].page_size,
        font_size: this.gradecard_printsetup[index].font_size,
        page_margin_left: this.gradecard_printsetup[index].page_margin_left,
        page_margin_top: this.gradecard_printsetup[index].page_margin_top,
        page_margin_right: this.gradecard_printsetup[index].page_margin_right,
        page_margin_bottom: this.gradecard_printsetup[index].page_margin_bottom,
        page_orientation: this.gradecard_printsetup[index].page_orientation
      })
    } else {
      this.paramform.patchValue({
        page_size: 'A4',
        font_size: 8,
        page_margin_left:5,
        page_margin_top:5,
        page_margin_right:5,
        page_margin_bottom:5,
        page_orientation: 'P'
      })
    }
  }
  getGlobalSetting() {
    let param: any = {};
    param.gs_alias = ['gradecard_printsetup'];
    this.examService.getGlobalSettingReplace(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        const settings = result.data;
        settings.forEach(element => {
          if (element.gs_alias === 'gradecard_printsetup') {
            this.gradecard_printsetup = JSON.parse(element.gs_value);
          }
        });
      }
    })
  }
  closeDialog() {
    this.dialogRef.close();
  }
  submit(){
    if(this.paramform.value.class_id) {
      const index = this.gradecard_printsetup.findIndex(e => e.class_id === this.paramform.value.class_id);
      if(index !== -1) {
        this.gradecard_printsetup.splice(index,1);
        this.gradecard_printsetup.push(this.paramform.value);
      } else {
        this.gradecard_printsetup.push(this.paramform.value);
      }
      console.log(this.gradecard_printsetup);
      this.examService.updateGlobalSetting({'gradecard_printsetup':JSON.stringify(this.gradecard_printsetup)}).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
        } else {
          this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
        }
      });
    }
  }

}
