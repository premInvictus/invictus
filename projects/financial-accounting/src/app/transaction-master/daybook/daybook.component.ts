
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
	
	
	constructor(
		private fbuild: FormBuilder,
		private faService: FaService,
		public router: Router,
		public route: ActivatedRoute
	) { }
	
  
	ngOnInit(){
		this.buildForm();
		this.getFeeMonths();
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