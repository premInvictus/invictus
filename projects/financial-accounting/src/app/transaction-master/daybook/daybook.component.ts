
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { FaService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-daybook',
	templateUrl: './daybook.component.html',
	styleUrls: ['./daybook.component.scss']
})
export class DaybookComponent implements OnInit {
	
	currentTabIndex = 3;
	feeMonthArray = [];
	paramform: FormGroup;
	adjustmentStatus = 0;
	
	constructor(
		private fbuild: FormBuilder,
		private faService: FaService,
		public router: Router,
		public route: ActivatedRoute
	) { }
	
  
	ngOnInit(){
		this.buildForm();
		this.getFeeMonths();
		this.getGlobalSetting();
		this.route.queryParams.subscribe(param => {
			console.log(param);
		})
	}
	buildForm() {
		this.paramform = this.fbuild.group({
		  month: ''
		})
	  }
	setIndex(event) {
		console.log(event);
		this.currentTabIndex = event;
	}
	getGlobalSetting() {
		let param: any = {};
		param.gs_alias = ['fee_invoice_includes_adjustments'];
		this.faService.getGlobalSetting(param).subscribe((result: any) => {

			if (result && result.status === 'ok') {
				if (result.data && result.data[0]) {
					this.adjustmentStatus = result.data[0]['gs_value'] == '1'? 1 : 0 ;
				}

			}
		})
	}
	getFeeMonths() {
		this.feeMonthArray = [];
		this.faService.getFeeMonths({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log(result.data);
				this.feeMonthArray = result.data;
			}
		});
	}
}