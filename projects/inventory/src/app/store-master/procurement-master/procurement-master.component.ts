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
        this.sisService.getStateCountryByCity({ cit_name: $event.target.value }).subscribe((result: any) => {
          if (result.status === 'ok') {
            this.itemArray = result.data;
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
    });
  }
}
