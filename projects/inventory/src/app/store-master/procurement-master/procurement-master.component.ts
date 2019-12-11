import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAPIService, SisService, AxiomService } from '../../_services';

@Component({
  selector: 'app-procurement-master',
  templateUrl: './procurement-master.component.html',
  styleUrls: ['./procurement-master.component.css']
})
export class ProcurementMasterComponent implements OnInit {
  createRequistionForm: FormGroup;
  itemArray: any[] = [];
  itemCode: any;
  itemCodeArray: any[] = [];
  finalRequistionArray: any[] = [];
  constructor(
    private fbuild: FormBuilder,
    public commonService: CommonAPIService,
    public axiomService: AxiomService,
    public sisService: SisService,
  ) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    this.createRequistionForm = this.fbuild.group({
      item_code: '',
      item_name: '',
      item_desc: '',
      item_quantity: '',
      item_units: ''

    });
  }

  filterItem($event) {
    // keyCode
    if (Number($event.keyCode) !== 40 && Number($event.keyCode) !== 38) {
      if ($event.target.value !== '' && $event.target.value.length >= 3) {
        this.itemArray = [];
        this.commonService.getItemsFromMaster({ item_name: $event.target.value }).subscribe((result: any) => {
          if (result) {
            this.itemArray = result;
          }
        });
      }
    }
  }
  getItemPerId(item: any) {
    this.itemCode = item.item_code;
    this.createRequistionForm.patchValue({
      item_name: item.item_name,
      item_desc: item.item_desc,
      item_units: item.item_units.name
    });
  }
  additem() {
    if (this.createRequistionForm.valid) {
      console.log(this.createRequistionForm.value);
    } else {
      this.commonService.showSuccessErrorMessage('Please fill all required field', 'error');
    }
  }



  // Add syllabus list function
  // addDetailsList() {
  //   if (this.createRequistionForm.valid) {
  //     const sindex = this.itemCodeArray.findIndex(f => f.item_code === this.createRequistionForm.value.item_code);
  //     if (sindex !== -1) {
  //      // this.openMessageModal();
  //     } else {
  //       if (this.createRequistionForm.value.sd_ctr_id === '1') {
  //         this.itemCodeArray.push({
  //           item_code: this.createRequistionForm.value.item_code,
  //         });
  //       }
  //       this.finalRequistionArray.push(this.createRequistionForm.value);
  //     }
  //     for (let i = 0; i < this.finalSyllabusArray.length; i++) {
  //       let sd_period_teacher: any = '';
  //       let sd_period_test: any = '';
  //       let sd_period_revision: any = '';

  //       if (this.finalSyllabusArray[i].sd_ctr_id === '1') {
  //         sd_period_teacher = this.finalSyllabusArray[i].sd_period_req;
  //       } else if (this.finalSyllabusArray[i].sd_ctr_id === '2') {
  //         sd_period_test = this.finalSyllabusArray[i].sd_period_req;
  //       } else {
  //         sd_period_revision = this.finalSyllabusArray[i].sd_period_req;
  //       }
  //       const spannArray: any[] = [];
  //       spannArray.push({
  //         sd_topic_id: this.finalSyllabusArray[i].sd_topic_id,
  //         sd_st_id: this.finalSyllabusArray[i].sd_st_id,
  //         sd_period_req: this.finalSyllabusArray[i].sd_period_req,
  //         sd_period_teacher: sd_period_teacher,
  //         sd_period_test: sd_period_test,
  //         sd_period_revision: sd_period_revision,
  //         sd_ctr_id: this.finalSyllabusArray[i].sd_ctr_id,
  //         sd_desc: this.finalSyllabusArray[i].sd_desc,
  //       });
  //       for (let j = i + 1; j < this.finalSyllabusArray.length; j++) {
  //         let sd_period_teacher1: any = '';
  //         let sd_period_test1: any = '';
  //         let sd_period_revision1: any = '';
  //         if (this.finalSyllabusArray[i].sd_topic_id === this.finalSyllabusArray[j].sd_topic_id) {
  //           if (this.finalSyllabusArray[j].sd_ctr_id === '1') {
  //             sd_period_teacher1 = this.finalSyllabusArray[j].sd_period_req;
  //           } else if (this.finalSyllabusArray[j].sd_ctr_id === '2') {
  //             sd_period_test1 = this.finalSyllabusArray[j].sd_period_req;
  //           } else {
  //             sd_period_revision1 = this.finalSyllabusArray[j].sd_period_req;
  //           }
  //           spannArray.push({
  //             sd_topic_id: this.finalSyllabusArray[i].sd_topic_id,
  //             sd_st_id: this.finalSyllabusArray[j].sd_st_id,
  //             sd_period_req: this.finalSyllabusArray[j].sd_period_req,
  //             sd_period_teacher: sd_period_teacher1,
  //             sd_period_test: sd_period_test1,
  //             sd_period_revision: sd_period_revision1,
  //             sd_ctr_id: this.finalSyllabusArray[j].sd_ctr_id,
  //             sd_desc: this.finalSyllabusArray[j].sd_desc,
  //           });
  //         }
  //       }
  //       const findex = this.finalSpannedArray.findIndex(f => f.sd_topic_id === this.finalSyllabusArray[i].sd_topic_id);
  //       if (findex === -1) {
  //         this.finalSpannedArray.push({
  //           sd_topic_id: this.finalSyllabusArray[i].sd_topic_id,
  //           details: spannArray,
  //           total: this.finalSyllabusArray[i].sd_period_req
  //         });
  //         this.totalPeriodTempCount = this.totalPeriodTempCount + this.finalSyllabusArray[i].sd_period_req;
  //       } else {
  //         this.finalSpannedArray[findex].total = this.finalSpannedArray[findex].total + this.finalSyllabusArray[i].sd_period_req;
  //         this.totalPeriodTempCount = this.totalPeriodTempCount + this.finalSyllabusArray[i].sd_period_req;
  //       }
  //     }
  //     this.syllabusDetailForm.patchValue({
  //       'sd_st_id': '',
  //       'sd_period_req': '',
  //       'sd_desc': ''
  //     });
  //   } else {
  //     this.commonService.showSuccessErrorMessage('Please fill all required fields', 'error');
  //   }
  // }

}
