import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AxiomService, SisService, SmartService, CommonAPIService } from '../../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-subtopic-map',
  templateUrl: './subtopic-map.component.html',
  styleUrls: ['./subtopic-map.component.css']
})
export class SubtopicMapComponent implements OnInit, OnChanges {

  @Input() param: any
  subtopicForm: FormGroup;
  gtArray: any[] = [];
  tArray: any[] = [];
  gatArray: any[] = [];
  subtopicflag = false;
  constructor(
    private fbuild: FormBuilder,
    private axiomService: AxiomService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges() {
    console.log('in subtopic param', this.param);
    this.subtopicflag = false;
    if (this.param.topic_id) {
      const items = this.subtopicFormArray;
      for (let i = 0; i < items.length; i++) {
        items.removeAt(i);
      }
      this.getGsubtopic();
      this.getsubtopic();
    }
  }
  buildForm() {
    this.subtopicForm = this.fbuild.group({
      subtopicFromArray: this.fbuild.array([])
    });
  }
  get subtopicFormArray() {
    return this.subtopicForm.get('subtopicFromArray') as FormArray;
  }
  addsubtopicFormArray(gst_id, gst_name, st_id) {
    this.subtopicFormArray.push(
      this.fbuild.group({
        gst_id: gst_id,
        gst_name: gst_name,
        st_id: st_id
      })
    );
  }
  getGsubtopic() {
    this.gtArray = [];
    this.smartService.getSubtopicByTopicId({ topic_id: this.param.topic_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.gtArray = result.data;
        this.subtopicflag = true;
        if (this.gtArray.length > 0) {
          this.gtArray.forEach(element => {
            this.addsubtopicFormArray(element.st_id, element.st_name, '');
          });
          this.getSmartToAxiom();
        }
      }
    });
  }
  getsubtopic() {
    this.tArray = [];
    this.axiomService.getSubtopicByTopic(this.param.topic_id).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.tArray = result.data;
      }
    });
  }
  getSmartToAxiom() {
    this.gatArray = [];
    this.smartService.getSmartToAxiom({ tgam_config_type: '4' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.gatArray = result.data;
        if (this.gatArray.length > 0) {
          const patchdata = [];
          for (const element1 of this.subtopicFormArray.value) {
            this.gatArray.forEach(element => {
              if (element1.gst_id === element.tgam_global_config_id) {
                element1.st_id = element.tgam_axiom_config_id.split(',');
              }
            });
            patchdata.push(element1);
          }
          this.subtopicForm.reset();
          const items = this.subtopicFormArray;
          for (let i = 0; i < patchdata.length; i++) {
            items.at(i).patchValue({
              gst_id: patchdata[i].gst_id,
              gst_name: patchdata[i].gst_name,
              st_id: patchdata[i].st_id
            });
          }
          this.subtopicflag = true;
        }
      } else {
        this.subtopicflag = true;
      }
    });
  }

  submitsub() {
    console.log(this.subtopicForm.value);
    const param: any = {};
    param.mapsubtopicArr = this.subtopicForm.value;
    param.tgam_config_type = '4';
    this.smartService.addSmartToAxiom(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }

}
