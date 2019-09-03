import { Component, OnInit } from '@angular/core';
import { AxiomService, SisService, SmartService, CommonAPIService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-smart-to-axiom',
  templateUrl: './smart-to-axiom.component.html',
  styleUrls: ['./smart-to-axiom.component.css']
})
export class SmartToAxiomComponent implements OnInit {
  paramform: FormGroup;
  gsArray: any[] = [];
  gcArray: any[] = [];
  gtArray: any[] = [];
  selected = new FormControl(0);
  constructor(
    private fbuild: FormBuilder,
    private axiomService: AxiomService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getGClass();
  }
  buildForm() {
    this.paramform = this.fbuild.group({
      class_id: '',
      sub_id: '',
      topic_id: ''
    });
  }
  getGClass() {
    this.gcArray = [];
    this.smartService.getClass({ class_status: 1 }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.gcArray = result.data;
      }
    });
  }
  getGSub() {
    this.paramform.patchValue({
      sub_id: ''
    });
    this.gsArray = [];
    this.smartService.getSubjectsByClass({ class_id: this.paramform.value.class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.gsArray = result.data;
      }
    });
  }
  getGtopic() {
    this.paramform.patchValue({
      topic_id: ''
    });
    this.gtArray = [];
    this.smartService.getTopicByClassIdSubjectId({ class_id: this.paramform.value.class_id, sub_id: this.paramform.value.sub_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.gtArray = result.data;
      }
    });
  }

}
