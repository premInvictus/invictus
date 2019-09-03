import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AxiomService, SisService, SmartService, CommonAPIService } from '../../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-topic-map',
  templateUrl: './topic-map.component.html',
  styleUrls: ['./topic-map.component.css']
})
export class TopicMapComponent implements OnInit, OnChanges {

  @Input() param: any
  topicForm: FormGroup;
  gtArray: any[] = [];
  tArray: any[] = [];
  gatArray: any[] = [];
  topicflag = false;
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
    console.log('in topic param', this.param);
    this.topicflag = false;
    if (this.param.class_id && this.param.sub_id) {
      const items = this.topicFormArray;
      for (let i = 0; i < items.length; i++) {
        items.removeAt(i);
      }
      this.getGtopic();
      this.gettopic();
    }
  }
  buildForm() {
    this.topicForm = this.fbuild.group({
      topicFromArray: this.fbuild.array([])
    });
  }
  get topicFormArray() {
    return this.topicForm.get('topicFromArray') as FormArray;
  }
  addtopicFormArray(gtopic_id, gtopic_name, topic_id) {
    this.topicFormArray.push(
      this.fbuild.group({
        gtopic_id: gtopic_id,
        gtopic_name: gtopic_name,
        topic_id: topic_id
      })
    );
  }
  getGtopic() {
    this.gtArray = [];
    this.smartService.getTopicByClassIdSubjectId({ class_id: this.param.class_id, sub_id: this.param.sub_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.gtArray = result.data;
        this.topicflag = true;
        if (this.gtArray.length > 0) {
          this.gtArray.forEach(element => {
            this.addtopicFormArray(element.topic_id, element.topic_name, '');
          });
          this.getSmartToAxiom();
        }
      }
    });
  }
  gettopic() {
    this.tArray = [];
    this.axiomService.getTopicByClassSubject(this.param.class_id, this.param.sub_id).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.tArray = result.data;
      }
    });
  }
  getSmartToAxiom() {
    this.gatArray = [];
    this.smartService.getSmartToAxiom({ tgam_config_type: '3' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.gatArray = result.data;
        if (this.gatArray.length > 0) {
          const patchdata = [];
          for (const element1 of this.topicFormArray.value) {
            this.gatArray.forEach(element => {
              if (element1.gtopic_id === element.tgam_global_config_id) {
                element1.topic_id = element.tgam_axiom_config_id.split(',');
              }
            });
            patchdata.push(element1);
          }
          this.topicForm.reset();
          const items = this.topicFormArray;
          for (let i = 0; i < patchdata.length; i++) {
            items.at(i).patchValue({
              gtopic_id: patchdata[i].gtopic_id,
              gtopic_name: patchdata[i].gtopic_name,
              topic_id: patchdata[i].topic_id
            });
          }
          this.topicflag = true;
        }
      } else {
        this.topicflag = true;
      }
    });
  }

  submitsub() {
    console.log(this.topicForm.value);
    const param: any = {};
    param.maptopicArr = this.topicForm.value;
    param.tgam_config_type = '3';
    this.smartService.addSmartToAxiom(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }

}
