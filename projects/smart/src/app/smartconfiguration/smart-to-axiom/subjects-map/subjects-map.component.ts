import { Component, OnInit } from '@angular/core';
import { AxiomService, SisService, SmartService, CommonAPIService } from '../../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-subjects-map',
  templateUrl: './subjects-map.component.html',
  styleUrls: ['./subjects-map.component.css']
})
export class SubjectsMapComponent implements OnInit {

  subForm: FormGroup;
  gsArray: any[] = [];
  sArray: any[] = [];
  gasArray: any[] = [];
  subflag = false;
  constructor(
    private fbuild: FormBuilder,
    private axiomService: AxiomService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getGsub();
    this.getsub();
  }

  buildForm() {
    this.subForm = this.fbuild.group({
      subFromArray: this.fbuild.array([])
    });
  }
  get subFormArray() {
    return this.subForm.get('subFromArray') as FormArray;
  }
  addsubFormArray(gsub_id, gsub_name, sub_id) {
    this.subFormArray.push(
      this.fbuild.group({
        gsub_id: gsub_id,
        gsub_name: gsub_name,
        sub_id: sub_id
      })
    );
  }
  getGsub() {
    this.gsArray = [];
    this.smartService.getSubject({ sub_status: 1 }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.gsArray = result.data;
        this.subflag = true;
        if (this.gsArray.length > 0) {
          this.gsArray.forEach(element => {
            this.addsubFormArray(element.sub_id, element.sub_name, '');
          });
          this.getSmartToAxiom();
        }
      }
    });
  }
  getsub() {
    this.sArray = [];
    this.axiomService.getSubject().subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.sArray = result.data;
      }
    });
  }
  getSmartToAxiom() {
    this.gasArray = [];
    this.smartService.getSmartToAxiom({ tgam_config_type: '2' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.gasArray = result.data;
        if (this.gasArray.length > 0) {
          const patchdata = [];
          for (const element1 of this.subFormArray.value) {
            this.gasArray.forEach(element => {
              if (element1.gsub_id === element.tgam_global_config_id) {
                element1.sub_id = element.tgam_axiom_config_id.split(',');
              }
            });
            patchdata.push(element1);
          }
          this.subForm.reset();
          const items = this.subFormArray;
          for (let i = 0; i < patchdata.length; i++) {
            items.at(i).patchValue({
              gsub_id: patchdata[i].gsub_id,
              gsub_name: patchdata[i].gsub_name,
              sub_id: patchdata[i].sub_id
            });
          }
          this.subflag = true;
        }
      } else {
        this.subflag = true;
      }
    });
  }

  submitsub() {
    console.log(this.subForm.value);
    const param: any = {};
    param.mapsubArr = this.subForm.value;
    param.tgam_config_type = '2';
    this.smartService.addSmartToAxiom(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
      }
    });
  }

}
