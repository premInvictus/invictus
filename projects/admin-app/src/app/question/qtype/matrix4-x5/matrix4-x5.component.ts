import { Component, OnInit, ChangeDetectorRef, AfterViewChecked, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ckconfig } from '../../../questionbank/ckeditorconfig';
@Component({
	selector: 'app-matrix4-x5',
	templateUrl: './matrix4-x5.component.html',
	styleUrls: ['./matrix4-x5.component.css']
})
export class Matrix4X5Component implements OnInit, AfterViewChecked {

	public ind_entry_form3: FormGroup;
	ckeConfig: any;
	@ViewChild('question') question: any;
	@ViewChild('optiona') optiona: any;
	@ViewChild('optionb') optionb: any;
	@ViewChild('optionq') optionq: any;
	@ViewChild('optionc') optionc: any;
	@ViewChild('optionr') optionr: any;
	@ViewChild('optiond') optiond: any;
	@ViewChild('optiont') optiont: any;
	@ViewChild('optionu') optionu: any;
	@ViewChild('explanationckeditor') explanationckeditor: any;
	constructor(
		private fbuild: FormBuilder,
		private changeDetector: ChangeDetectorRef
	) { }

	ngOnInit() {
		this.ckeConfig = ckconfig;
		this.buildForm();
	}

	ngAfterViewChecked() {
		this.changeDetector.detectChanges();
	}

	buildForm() {
		this.ind_entry_form3 = this.fbuild.group({
			qus_name: '',
			optiona: '',
			optionp: '',
			apqrst1: '',
			apqrst2: '',
			apqrst3: '',
			apqrst4: '',
			apqrst5: '',
			optionb: '',
			optionq: '',
			bpqrst1: '',
			bpqrst2: '',
			bpqrst3: '',
			bpqrst4: '',
			bpqrst5: '',
			optionc: '',
			optionr: '',
			cpqrst1: '',
			cpqrst2: '',
			cpqrst3: '',
			cpqrst4: '',
			cpqrst5: '',
			optiond: '',
			optiont: '',
			dpqrst1: '',
			dpqrst2: '',
			dpqrst3: '',
			dpqrst4: '',
			dpqrst5: '',
			optionu: '',
			qus_explanation: '',
			options: [],
			options_match: [],
			answer: []
		});
	}

}
